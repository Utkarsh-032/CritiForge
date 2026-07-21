import { APIConnectionError, APIConnectionTimeoutError, APIError, AuthenticationError, NotFoundError, PermissionDeniedError, RateLimitError } from "groq-sdk";
import { getGroqClient, groqModel } from "./groqClient.js";
import { buildMentorInput, mentorInstructions } from "../prompts/mentorPrompt.js";
import { mentorResponseSchema } from "../schemas/mentorSchema.js";

export class MentorServiceError extends Error {
  constructor(kind) {
    super(kind);
    this.kind = kind;
  }
}

function parseMentorResponse(content) {
  const json = typeof content === "string" ? content.replace(/^```json\s*|\s*```$/g, "").trim() : "";

  try {
    const parsedResponse = mentorResponseSchema.safeParse(JSON.parse(json));
    return parsedResponse.success ? { data: parsedResponse.data, kind: null } : { data: null, kind: "validation" };
  } catch {
    return { data: null, kind: "malformed-response" };
  }
}

export async function createMentorResponse(question, context) {
  let client;

  try {
    client = getGroqClient();
  } catch {
    throw new MentorServiceError("configuration");
  }

  if (!groqModel) throw new MentorServiceError("model-unavailable");

  try {
    const response = await client.chat.completions.create({
      model: groqModel,
      messages: [
        { role: "system", content: mentorInstructions },
        { role: "user", content: buildMentorInput(question, context) },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const mentorResponse = parseMentorResponse(response.choices[0]?.message?.content);
    if (mentorResponse.data) return mentorResponse.data;

    const correction = await client.chat.completions.create({
      model: groqModel,
      messages: [
        { role: "system", content: "Return only corrected JSON that exactly follows the CritiForge mentor structure. Do not add markdown or commentary." },
        { role: "user", content: `Correct this invalid mentor JSON. Use source "groq" and reviewType "mentor":\n${response.choices[0]?.message?.content || "No response content was returned."}` },
      ],
      response_format: { type: "json_object" },
      temperature: 0,
    });

    const correctedResponse = parseMentorResponse(correction.choices[0]?.message?.content);
    if (!correctedResponse.data) throw new MentorServiceError(correctedResponse.kind);
    return correctedResponse.data;
  } catch (error) {
    if (error instanceof MentorServiceError) throw error;
    if (error instanceof RateLimitError || error?.status === 429) throw new MentorServiceError("rate-limit");
    if (error instanceof AuthenticationError || error instanceof PermissionDeniedError || error?.status === 401 || error?.status === 403) throw new MentorServiceError("authentication");
    if (error instanceof NotFoundError || error?.status === 404) throw new MentorServiceError("model-unavailable");
    if (error instanceof APIConnectionTimeoutError) throw new MentorServiceError("request-timeout");
    if (error instanceof APIConnectionError || error instanceof APIError) throw new MentorServiceError("upstream");
    throw new MentorServiceError("unexpected");
  }
}
