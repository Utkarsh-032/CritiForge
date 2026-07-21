import { createMentorResponse, MentorServiceError } from "../../services/mentorService.js";
import { mentorRequestSchema } from "../../schemas/mentorSchema.js";

function sendError(response, status, type, message) {
  response.locals.providerErrorCode = type;
  return response.status(status).json({ error: { type, message } });
}

export async function mentor(request, response) {
  const parsedRequest = mentorRequestSchema.safeParse(request.body);

  if (!parsedRequest.success) {
    const { question, context } = request.body || {};
    if (typeof question !== "string") return sendError(response, 400, "invalid_request", "Question must be a string.");
    if (!question.trim()) return sendError(response, 400, "invalid_request", "Question is required.");
    if (question.trim().length > 3000) return sendError(response, 400, "invalid_request", "Question must not exceed 3000 characters.");
    if (context !== undefined && typeof context !== "string") return sendError(response, 400, "invalid_request", "Context must be a string when provided.");
    if (typeof context === "string" && context.trim().length > 15000) return sendError(response, 400, "invalid_request", "Context must not exceed 15000 characters.");
    return sendError(response, 400, "invalid_request", "Invalid mentor request.");
  }

  try {
    return response.status(200).json(await createMentorResponse(parsedRequest.data.question, parsedRequest.data.context));
  } catch (error) {
    if (error instanceof MentorServiceError) {
      const responses = {
        configuration: [500, "AI Mentor is not configured. Contact the server administrator."],
        authentication: [502, "AI Mentor authentication failed. Please try again later."],
        "rate-limit": [429, "AI Mentor is temporarily rate limited. Please retry shortly."],
        "model-unavailable": [502, "The configured Groq model is unavailable or missing. Please try again later."],
        upstream: [502, "AI Mentor is temporarily unavailable. Please retry."],
        "malformed-response": [502, "AI Mentor returned an invalid response. Please retry."],
        validation: [502, "AI Mentor response did not match the expected format. Please retry."],
        "request-timeout": [504, "AI Mentor timed out. Please retry."],
        unexpected: [500, "Unable to prepare mentor guidance. Please try again later."],
      };
      const [status, message] = responses[error.kind] || responses.unexpected;
      return sendError(response, status, error.kind, message);
    }

    return sendError(response, 500, "unexpected_server_error", "Unable to prepare mentor guidance. Please try again later.");
  }
}
