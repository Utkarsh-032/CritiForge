const KEY = "critiforge.reviewHistory.v2";
const LEGACY_KEY = "critiforge.reviewHistory.v1";
const STORAGE_VERSION = 2;
const MAX_ITEMS = 20;
const MAX_REPORT_CHARACTERS = 400000;
const ROUTES = { website: "/website-review", code: "/code-review", mentor: "/ai-mentor" };
const SENSITIVE_FIELD = /^(?:screenshot|screenshots|rawhtml|htmlsource|apikey|api_key|authorization|authenticationdata|authdata|credentials|cookie|cookies|password|secret|token|idtoken|access_?token|refresh_?token|networkresponse|networkresponses|responseheaders|requestheaders)$/i;

export const REVIEW_HISTORY_EVENT = "critiforge:review-history-change";

const makeId = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const boundedText = (value, limit) => typeof value === "string" ? value.trim().slice(0, limit) : "";

function sanitize(value, depth = 0, stringLimit = 20000, arrayLimit = 100) {
  if (depth > 8 || value === undefined || typeof value === "function") return undefined;
  if (value === null || typeof value === "boolean") return value;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") return value.slice(0, stringLimit);
  if (Array.isArray(value)) return value.slice(0, arrayLimit).map((item) => sanitize(item, depth + 1, stringLimit, arrayLimit)).filter((item) => item !== undefined);
  if (typeof value === "object") {
    return Object.fromEntries(Object.entries(value).flatMap(([key, item]) => {
      if (SENSITIVE_FIELD.test(key)) return [];
      const safeItem = sanitize(item, depth + 1, stringLimit, arrayLimit);
      return safeItem === undefined ? [] : [[key, safeItem]];
    }));
  }
  return undefined;
}

function safeReport(result) {
  let report = sanitize(result);
  if (!report || typeof report !== "object" || Array.isArray(report)) return null;
  try {
    if (JSON.stringify(report).length <= MAX_REPORT_CHARACTERS) return report;
    report = sanitize(result, 0, 4000, 50);
    return JSON.stringify(report).length <= MAX_REPORT_CHARACTERS ? report : null;
  } catch {
    return null;
  }
}

function normalizeInput(type, input) {
  if (!input || typeof input !== "object") return null;
  if (type === "website") return { reviewedUrl: boundedText(input.reviewedUrl, 2048) };
  if (type === "code") return { language: boundedText(input.language, 50), codePreview: boundedText(input.codePreview, 1200) };
  return { question: boundedText(input.question, 3000), contextPreview: boundedText(input.contextPreview, 1500) };
}

function normalizeItem(item, index = 0) {
  if (!item || typeof item !== "object") return null;
  const type = ["website", "code", "mentor"].includes(item.type) ? item.type : null;
  if (!type) return null;
  return {
    id: typeof item.id === "string" && item.id ? item.id : `legacy-${index}-${item.createdAt || "unknown"}`,
    type,
    title: boundedText(item.title, 300) || "Saved review",
    createdAt: typeof item.createdAt === "string" ? item.createdAt : "",
    score: Number.isFinite(item.score) ? item.score : null,
    inputSummary: boundedText(item.inputSummary || item.summary, 1000),
    summary: boundedText(item.summary, 5000),
    route: ROUTES[type],
    input: normalizeInput(type, item.input),
    report: item.report && typeof item.report === "object" ? safeReport(item.report) : null,
  };
}

function parseStored(raw) {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    const items = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.items) ? parsed.items : null;
    return items?.map(normalizeItem).filter(Boolean) || null;
  } catch {
    return null;
  }
}

function read() {
  const current = parseStored(localStorage.getItem(KEY));
  if (current) return current;
  const legacy = parseStored(localStorage.getItem(LEGACY_KEY));
  if (legacy) write(legacy);
  return legacy || [];
}

function write(items) {
  let candidates = items.slice(0, MAX_ITEMS);
  while (candidates.length) {
    try {
      localStorage.setItem(KEY, JSON.stringify({ version: STORAGE_VERSION, items: candidates }));
      localStorage.removeItem(LEGACY_KEY);
      return candidates;
    } catch {
      candidates = candidates.slice(0, -1);
    }
  }
  try {
    localStorage.setItem(KEY, JSON.stringify({ version: STORAGE_VERSION, items: [] }));
    localStorage.removeItem(LEGACY_KEY);
    return [];
  } catch {
    return null;
  }
}

const notify = () => window.dispatchEvent(new Event(REVIEW_HISTORY_EVENT));

export function createHistoryEntry(type, input = {}, result = {}) {
  const report = safeReport(result);
  const common = {
    id: makeId(),
    type,
    createdAt: new Date().toISOString(),
    score: Number.isFinite(result.overallScore) ? result.overallScore : null,
    summary: boundedText(result.summary, 5000) || "Review completed.",
    report,
    route: ROUTES[type],
  };

  if (type === "website") {
    const reviewedUrl = boundedText(result.analyzedUrl || input.url, 2048);
    let title = "Website Review";
    try { title = new URL(reviewedUrl).hostname || title; } catch { /* retain the safe fallback */ }
    return { ...common, title, inputSummary: reviewedUrl, input: { reviewedUrl } };
  }
  if (type === "code") {
    const language = boundedText(input.language, 50) || "code";
    const codePreview = boundedText(input.code, 1200);
    return { ...common, title: `${language[0].toUpperCase()}${language.slice(1)} Code Review`, inputSummary: `${language} code (${input.code?.trim().length || 0} characters)`, input: { language, codePreview } };
  }
  const question = boundedText(input.question, 3000);
  return { ...common, title: boundedText(result.topic, 300) || "AI Mentor Session", inputSummary: question, input: { question, contextPreview: boundedText(input.context, 1500) } };
}

export const getReviewHistory = () => {
  try { return read(); } catch { return []; }
};

export const subscribeToReviewHistory = (listener) => {
  const onStorage = (event) => { if (event.key === KEY || event.key === LEGACY_KEY) listener(); };
  window.addEventListener(REVIEW_HISTORY_EVENT, listener);
  window.addEventListener("storage", onStorage);
  return () => { window.removeEventListener(REVIEW_HISTORY_EVENT, listener); window.removeEventListener("storage", onStorage); };
};

export const saveReviewHistory = (entry) => {
  try {
    const normalized = normalizeItem(entry);
    if (!normalized) return getReviewHistory();
    const saved = write([normalized, ...read()]);
    if (saved) notify();
    return saved || [];
  } catch {
    return [];
  }
};

export const deleteReviewHistoryItem = (id) => {
  try {
    const saved = write(read().filter((item) => item.id !== id));
    if (saved) notify();
    return Boolean(saved);
  } catch {
    return false;
  }
};

export const clearReviewHistory = () => {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem(LEGACY_KEY);
    notify();
    return true;
  } catch {
    return false;
  }
};
