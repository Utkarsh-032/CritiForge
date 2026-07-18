import { APIConnectionError, APIConnectionTimeoutError, APIError, AuthenticationError, NotFoundError, PermissionDeniedError, RateLimitError } from "groq-sdk";
import { getGroqClient } from "./groqClient.js";
import { collectWebsiteEvidence, WebsiteCollectorError } from "./websiteCollector.js";
import { buildWebsiteEvidenceInput, websiteReviewInstructions } from "../prompts/websiteReviewPrompt.js";
import { websiteReviewResponseSchema } from "../schemas/websiteReviewSchema.js";

const visionModel = process.env.GROQ_VISION_MODEL?.trim();

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
  let client;
  try { client = getGroqClient(); } catch { throw new WebsiteReviewServiceError("configuration"); }
  if (!visionModel) throw new WebsiteReviewServiceError("model-unavailable");

  let collected;
  try { collected = await collectWebsiteEvidence(url); } catch (error) { if (error instanceof WebsiteCollectorError) throw new WebsiteReviewServiceError(error.kind); throw new WebsiteReviewServiceError("unreachable"); }

  try {
    const response = await client.chat.completions.create({
      model: visionModel,
      messages: [{ role: "system", content: websiteReviewInstructions }, { role: "user", content: [{ type: "text", text: buildWebsiteEvidenceInput(collected.evidence) }, { type: "image_url", image_url: { url: `data:image/jpeg;base64,${collected.screenshotBase64}` } }] }],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });
    const review = parseWebsiteReview(response.choices[0]?.message?.content, collected.evidence.finalUrl);
    if (review) return review;
    const correction = await client.chat.completions.create({ model: visionModel, messages: [{ role: "system", content: "Return only corrected JSON that exactly follows the CritiForge website review structure. Do not add markdown or commentary." }, { role: "user", content: `Correct this invalid website review JSON. Use source "groq", reviewType "website", and analyzedUrl "${collected.evidence.finalUrl}":\n${response.choices[0]?.message?.content || "No response content was returned."}` }], response_format: { type: "json_object" }, temperature: 0 });
    const corrected = parseWebsiteReview(correction.choices[0]?.message?.content, collected.evidence.finalUrl);
    if (!corrected) throw new WebsiteReviewServiceError("malformed-response");
    return corrected;
  } catch (error) {
    if (error instanceof WebsiteReviewServiceError) throw error;
    if (error instanceof RateLimitError || error?.status === 429) throw new WebsiteReviewServiceError("rate-limit");
    if (error instanceof AuthenticationError || error instanceof PermissionDeniedError || error?.status === 401 || error?.status === 403) throw new WebsiteReviewServiceError("authentication");
    if (error instanceof NotFoundError || error?.status === 404) throw new WebsiteReviewServiceError("model-unavailable");
    if (error instanceof APIConnectionTimeoutError || error instanceof APIConnectionError || error instanceof APIError) throw new WebsiteReviewServiceError("upstream");
    throw new WebsiteReviewServiceError("unexpected");
  }
}
