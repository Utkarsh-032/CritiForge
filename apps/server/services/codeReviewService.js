import { APIConnectionError, APIConnectionTimeoutError, APIError, AuthenticationError, NotFoundError, PermissionDeniedError, RateLimitError } from "groq-sdk";
import { getGroqClient, groqModel } from "./groqClient.js";
import { buildCodeReviewInput, codeReviewInstructions } from "../prompts/codeReviewPrompt.js";
import { codeReviewResponseSchema } from "../schemas/codeReviewSchema.js";

export class CodeReviewServiceError extends Error {
  constructor(kind) {
    super(kind);
    this.kind = kind;
  }
}

function parseReviewResponse(content, language) {
  const json = typeof content === "string" ? content.replace(/^```json\s*|\s*```$/g, "").trim() : "";

  try {
    const parsedReview = codeReviewResponseSchema.safeParse(JSON.parse(json));
    if (!parsedReview.success || parsedReview.data.language !== language) return null;
    return parsedReview.data;
  } catch {
    return null;
  }
}

export async function createCodeReview(language, code) {
  let client;

  try {
    client = getGroqClient();
  } catch {
    throw new CodeReviewServiceError("configuration");
  }

  if (!groqModel) throw new CodeReviewServiceError("model-unavailable");

  try {
    const response = await client.chat.completions.create({
      model: groqModel,
      messages: [
        { role: "system", content: codeReviewInstructions },
        { role: "user", content: buildCodeReviewInput(language, code) },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const parsedReview = parseReviewResponse(response.choices[0]?.message?.content, language);

    if (parsedReview) return parsedReview;

    const correction = await client.chat.completions.create({
      model: groqModel,
      messages: [
        { role: "system", content: "Return only corrected JSON that exactly follows the CritiForge code review structure. Scores must be integer values from 0 to 100. Do not add markdown or commentary." },
        { role: "user", content: `Correct this invalid code-review JSON for ${language}. Use source "groq", reviewType "code", and language "${language}":\n${response.choices[0]?.message?.content || "No response content was returned."}` },
      ],
      response_format: { type: "json_object" },
      temperature: 0,
    });

    const correctedReview = parseReviewResponse(correction.choices[0]?.message?.content, language);

    if (!correctedReview) throw new CodeReviewServiceError("malformed-response");
    return correctedReview;
  } catch (error) {
    if (error instanceof CodeReviewServiceError) throw error;
    if (error instanceof RateLimitError || error?.status === 429) throw new CodeReviewServiceError("rate-limit");
    if (error instanceof AuthenticationError || error instanceof PermissionDeniedError || error?.status === 401 || error?.status === 403) throw new CodeReviewServiceError("authentication");
    if (error instanceof NotFoundError || error?.status === 404) throw new CodeReviewServiceError("model-unavailable");
    if (error instanceof APIConnectionTimeoutError || error instanceof APIConnectionError || error instanceof APIError) throw new CodeReviewServiceError("upstream");
    throw new CodeReviewServiceError("unexpected");
  }
}
