import { assertGeminiConfiguration, generateGeminiContent } from "./geminiClient.js";
import { collectWebsiteEvidence, WebsiteCollectorError } from "./websiteCollector.js";
import { buildWebsiteEvidenceInput, websiteReviewInstructions } from "../prompts/websiteReviewPrompt.js";
import { websiteReviewResponseSchema } from "../schemas/websiteReviewSchema.js";

export class WebsiteReviewServiceError extends Error {
  constructor(kind) { super(kind); this.kind = kind; }
}

function parseWebsiteReview(content, analyzedUrl) {
  const json = typeof content === "string" ? content.replace(/^```json\s*|\s*```$/g, "").trim() : "";
  try {
    const parsed = websiteReviewResponseSchema.safeParse(JSON.parse(json));
    return parsed.success && parsed.data.analyzedUrl === analyzedUrl ? parsed.data : null;
  } catch { return null; }
}

export async function createWebsiteReview(url) {
  try { assertGeminiConfiguration(); } catch { throw new WebsiteReviewServiceError("configuration"); }

  let collected;
  try { collected = await collectWebsiteEvidence(url); } catch (error) { if (error instanceof WebsiteCollectorError) throw new WebsiteReviewServiceError(error.kind); throw new WebsiteReviewServiceError("unreachable"); }

  try {
    const response = await generateGeminiContent({ systemInstruction: websiteReviewInstructions, prompt: buildWebsiteEvidenceInput(collected.evidence), screenshotBase64: collected.screenshotBase64 });
    const review = parseWebsiteReview(response, collected.evidence.finalUrl);
    if (review) return review;
    const correction = await generateGeminiContent({ systemInstruction: "Return only corrected JSON that exactly follows the CritiForge website review structure. Do not add markdown or commentary.", prompt: `Correct this invalid website review JSON. Use source "gemini", reviewType "website", and analyzedUrl "${collected.evidence.finalUrl}":\n${response}` });
    const corrected = parseWebsiteReview(correction, collected.evidence.finalUrl);
    if (!corrected) throw new WebsiteReviewServiceError("malformed-response");
    return corrected;
  } catch (error) {
    if (error instanceof WebsiteReviewServiceError) throw error;
    if (error?.status === 429) throw new WebsiteReviewServiceError("rate-limit");
    if (error?.status === 401 || error?.status === 403) throw new WebsiteReviewServiceError("authentication");
    if (error?.status === 404 || error?.status === 400) throw new WebsiteReviewServiceError("vision_model_unavailable");
    if (error?.name === "TimeoutError" || error instanceof TypeError || error?.status >= 500) throw new WebsiteReviewServiceError("upstream");
    throw new WebsiteReviewServiceError("unexpected");
  }
}
