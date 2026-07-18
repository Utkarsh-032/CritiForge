import { createMentorResponse, MentorServiceError } from "../../services/mentorService.js";
import { mentorRequestSchema } from "../../schemas/mentorSchema.js";

export async function mentor(request, response) {
  const parsedRequest = mentorRequestSchema.safeParse(request.body);

  if (!parsedRequest.success) {
    const { question, context } = request.body || {};
    if (typeof question !== "string") return response.status(400).json({ error: "Question must be a string." });
    if (!question.trim()) return response.status(400).json({ error: "Question is required." });
    if (question.trim().length > 3000) return response.status(400).json({ error: "Question must not exceed 3000 characters." });
    if (context !== undefined && typeof context !== "string") return response.status(400).json({ error: "Context must be a string when provided." });
    if (typeof context === "string" && context.trim().length > 15000) return response.status(400).json({ error: "Context must not exceed 15000 characters." });
    return response.status(400).json({ error: "Invalid mentor request." });
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
        unexpected: [500, "Unable to prepare mentor guidance. Please try again later."],
      };
      const [status, message] = responses[error.kind] || responses.unexpected;
      return response.status(status).json({ error: message });
    }

    return response.status(500).json({ error: "Unable to prepare mentor guidance. Please try again later." });
  }
}
