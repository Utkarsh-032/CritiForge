import * as cheerio from "cheerio";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { chromium } from "playwright";

const MAX_URL_LENGTH = 2048;
const MAX_REDIRECTS = 5;
const MAX_HTML_BYTES = 1_500_000;
const MAX_TEXT_LENGTH = 12_000;
const REQUEST_TIMEOUT_MS = 15_000;
const SCREENSHOT_TIMEOUT_MS = 20_000;
const MAX_SCREENSHOT_BASE64_BYTES = 3_500_000;

export class WebsiteCollectorError extends Error {
  constructor(kind) {
    super(kind);
    this.kind = kind;
  }
}

function isPrivateIpv4(address) {
  const parts = address.split(".").map(Number);
  const [a, b] = parts;
  return a === 0 || a === 10 || a === 127 || (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 198 && (b === 18 || b === 19)) || a >= 224;
}

function isUnsafeIp(address) {
  const family = isIP(address);
  if (family === 4) return isPrivateIpv4(address);
  if (family !== 6) return true;
  const normalized = address.toLowerCase();
  if (normalized === "::" || normalized === "::1" || normalized.startsWith("fc") || normalized.startsWith("fd") || normalized.startsWith("fe8") || normalized.startsWith("fe9") || normalized.startsWith("fea") || normalized.startsWith("feb")) return true;
  const mapped = normalized.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  return Boolean(mapped && isPrivateIpv4(mapped[1]));
}

export async function assertSafeWebsiteUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new WebsiteCollectorError("invalid-url");
  }

  if (value.length > MAX_URL_LENGTH || !["http:", "https:"].includes(url.protocol) || url.username || url.password) throw new WebsiteCollectorError("invalid-url");
  const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (hostname === "localhost" || hostname.endsWith(".localhost")) throw new WebsiteCollectorError("unsafe-target");

  try {
    const addresses = isIP(hostname) ? [{ address: hostname }] : await lookup(hostname, { all: true, verbatim: true });
    if (!addresses.length || addresses.some(({ address }) => isUnsafeIp(address))) throw new WebsiteCollectorError("unsafe-target");
  } catch (error) {
    if (error instanceof WebsiteCollectorError) throw error;
    throw new WebsiteCollectorError("dns-failure");
  }

  return url;
}

async function readResponseBody(response) {
  const chunks = [];
  let total = 0;
  const reader = response.body?.getReader();
  if (!reader) return "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_HTML_BYTES) throw new WebsiteCollectorError("html-too-large");
    chunks.push(value);
  }

  return new TextDecoder().decode(Buffer.concat(chunks));
}

async function fetchHtml(requestedUrl) {
  let currentUrl = await assertSafeWebsiteUrl(requestedUrl);

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    let response;
    try {
      response = await fetch(currentUrl, { redirect: "manual", signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS), headers: { "User-Agent": "CritiForgeWebsiteReview/1.0" } });
    } catch {
      throw new WebsiteCollectorError("unreachable");
    }

    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location || redirectCount === MAX_REDIRECTS) throw new WebsiteCollectorError("unreachable");
      currentUrl = await assertSafeWebsiteUrl(new URL(location, currentUrl).toString());
      continue;
    }

    if (!response.ok) throw new WebsiteCollectorError("unreachable");
    if (!response.headers.get("content-type")?.includes("text/html")) throw new WebsiteCollectorError("unreachable");
    return { finalUrl: currentUrl.toString(), html: await readResponseBody(response) };
  }

  throw new WebsiteCollectorError("unreachable");
}

function textList($, selector, limit = 30) {
  return $(selector).map((_, element) => $(element).text().replace(/\s+/g, " ").trim()).get().filter(Boolean).slice(0, limit);
}

function collectEvidence(requestedUrl, finalUrl, html) {
  const $ = cheerio.load(html);
  $("script, style, noscript, template").remove();
  const headings = $("h1, h2, h3, h4, h5, h6").map((_, element) => ({ level: Number(element.tagName.slice(1)), text: $(element).text().replace(/\s+/g, " ").trim() })).get().filter(({ text }) => text).slice(0, 40);
  const images = $("img").map((_, element) => ({ alt: $(element).attr("alt") || "", hasAlt: $(element).attr("alt") !== undefined })).get().slice(0, 80);
  const inputs = $("input, textarea, select").map((_, element) => { const id = $(element).attr("id"); const ariaLabel = $(element).attr("aria-label"); return { type: $(element).attr("type") || element.tagName.toLowerCase(), hasLabel: Boolean(ariaLabel || (id && $(`label[for="${id}"]`).length) || $(element).closest("label").length) }; }).get().slice(0, 60);

  return {
    requestedUrl,
    finalUrl,
    title: $("title").first().text().trim(),
    metaDescription: $("meta[name='description']").attr("content") || "",
    viewport: $("meta[name='viewport']").attr("content") || "",
    documentLanguage: $("html").attr("lang") || "",
    headingHierarchy: headings,
    navigationText: textList($, "nav a"),
    buttons: textList($, "button, input[type='submit'], input[type='button']"),
    links: textList($, "a"),
    images,
    formLabels: textList($, "label"),
    inputTypes: inputs.map(({ type }) => type),
    landmarks: $("header, nav, main, footer, aside, [role='banner'], [role='navigation'], [role='main'], [role='contentinfo']").map((_, element) => element.tagName.toLowerCase()).get(),
    visibleText: $("body").text().replace(/\s+/g, " ").trim().slice(0, MAX_TEXT_LENGTH),
    counts: { headings: headings.length, links: $("a").length, buttons: $("button, input[type='submit'], input[type='button']").length, imagesMissingAlt: images.filter(({ hasAlt, alt }) => !hasAlt || !alt.trim()).length, inputsMissingLabels: inputs.filter(({ hasLabel }) => !hasLabel).length },
  };
}

async function captureScreenshot(finalUrl) {
  let browser;
  let context;
  let page;
  try {
    browser = await chromium.launch({ headless: true });
    context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    page = await context.newPage();
    await page.route("**/*", async (route) => {
      const request = route.request();
      try {
        if (!request.url().startsWith("http://") && !request.url().startsWith("https://")) return route.abort();
        await assertSafeWebsiteUrl(request.url());
        if (request.resourceType() === "media") return route.abort();
        return route.continue();
      } catch {
        return route.abort();
      }
    });
    await page.goto(finalUrl, { waitUntil: "domcontentloaded", timeout: SCREENSHOT_TIMEOUT_MS });
    await page.waitForTimeout(800);
    let screenshot = await page.screenshot({ type: "jpeg", quality: 55 });
    if (screenshot.toString("base64").length > MAX_SCREENSHOT_BASE64_BYTES) screenshot = await page.screenshot({ type: "jpeg", quality: 30 });
    if (screenshot.toString("base64").length > MAX_SCREENSHOT_BASE64_BYTES) throw new WebsiteCollectorError("screenshot-failed");
    return screenshot.toString("base64");
  } catch (error) {
    if (error instanceof WebsiteCollectorError) throw error;
    if (error?.name === "TimeoutError") throw new WebsiteCollectorError("browser-timeout");
    throw new WebsiteCollectorError("screenshot-failed");
  } finally {
    await page?.close().catch(() => {});
    await context?.close().catch(() => {});
    await browser?.close().catch(() => {});
  }
}

export async function collectWebsiteEvidence(requestedUrl) {
  const { finalUrl, html } = await fetchHtml(requestedUrl);
  const evidence = collectEvidence(requestedUrl, finalUrl, html);
  const screenshotBase64 = await captureScreenshot(finalUrl);
  return { evidence, screenshotBase64 };
}
