import { assertGeminiConfiguration, generateGeminiContent } from "./geminiClient.js";
import { collectWebsiteEvidence, WebsiteCollectorError } from "./websiteCollector.js";
import { buildWebsiteEvidenceInput, websiteReviewInstructions } from "../prompts/websiteReviewPrompt.js";
import { websiteReviewResponseSchema } from "../schemas/websiteReviewSchema.js";
const cache = new Map(); const CACHE_TTL = 10 * 60 * 1000; const CACHE_MAX = 50;

export class WebsiteReviewServiceError extends Error {
  constructor(kind) { super(kind); this.kind = kind; }
}

function parseWebsiteReview(content, analyzedUrl) {
  const json = typeof content === "string" ? content.replace(/^```json\s*|\s*```$/g, "").trim() : "";
  try {
    const parsed = websiteReviewResponseSchema.safeParse(JSON.parse(json));
    return parsed.success && parsed.data.analyzedUrl === analyzedUrl ? { data: parsed.data, kind: null } : { data: null, kind: "validation" };
  } catch { return { data: null, kind: "malformed-response" }; }
}

export async function createWebsiteReview(url, force = false) {
  const requestId = crypto.randomUUID(); const started = Date.now();
  const timing = (stage, duration, errorType) => console.info("website-review", { requestId, stage, durationMs: duration, ...(errorType ? { errorType } : {}) });
  timing("request-received", 0);
  try { assertGeminiConfiguration(); } catch { throw new WebsiteReviewServiceError("configuration"); }

  let collected;
  try { const validationStart = Date.now(); collected = await collectWebsiteEvidence(url, timing); timing("url-validation-and-collection", Date.now() - validationStart); } catch (error) { timing("collection-failed", Date.now() - started, error.kind || "unreachable"); if (error instanceof WebsiteCollectorError) throw new WebsiteReviewServiceError(error.kind); throw new WebsiteReviewServiceError("unreachable"); }
  const cacheKey = collected.evidence.finalUrl;
  const cached = cache.get(cacheKey);
  if (!force && cached && cached.expiresAt > Date.now()) { timing("cache-hit", Date.now() - started); return { ...cached.review, cached: true, analysisMode: cached.analysisMode }; }

  try {
    const geminiStart = Date.now(); const response = await generateGeminiContent({ systemInstruction: websiteReviewInstructions, prompt: buildWebsiteEvidenceInput(collected.evidence), screenshotBase64: collected.screenshotBase64 }); timing("gemini-request", Date.now() - geminiStart);
    const review = parseWebsiteReview(response, collected.evidence.finalUrl);
    if (review.data) { cache.set(cacheKey, { review: review.data, analysisMode: collected.analysisMode, expiresAt: Date.now() + CACHE_TTL }); if (cache.size > CACHE_MAX) cache.delete(cache.keys().next().value); timing("response-parse-and-validation", Date.now() - started); return { ...review.data, cached: false, analysisMode: collected.analysisMode }; }
    const correction = await generateGeminiContent({ systemInstruction: "Return only corrected JSON that exactly follows the CritiForge website review structure. Do not add markdown or commentary.", prompt: `Correct this invalid website review JSON. Use source "gemini", reviewType "website", and analyzedUrl "${collected.evidence.finalUrl}":\n${response}` });
    const corrected = parseWebsiteReview(correction, collected.evidence.finalUrl);
    if (!corrected.data) throw new WebsiteReviewServiceError(corrected.kind);
    cache.set(cacheKey, { review: corrected.data, analysisMode: collected.analysisMode, expiresAt: Date.now() + CACHE_TTL }); if (cache.size > CACHE_MAX) cache.delete(cache.keys().next().value); timing("total", Date.now() - started); return { ...corrected.data, cached: false, analysisMode: collected.analysisMode };
  } catch (error) {
    if (error instanceof WebsiteReviewServiceError) throw error;
    if (error?.status === 429) throw new WebsiteReviewServiceError("rate-limit");
    if (error?.status === 401 || error?.status === 403) throw new WebsiteReviewServiceError("authentication");
    if (error?.status === 404 || error?.status === 400) throw new WebsiteReviewServiceError("vision_model_unavailable");
    if (error?.name === "TimeoutError") throw new WebsiteReviewServiceError("request-timeout");
    if (error instanceof TypeError || error?.status >= 500) throw new WebsiteReviewServiceError("upstream");
    throw new WebsiteReviewServiceError("unexpected");
  }
}
