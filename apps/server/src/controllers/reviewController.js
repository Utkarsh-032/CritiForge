import { createCodeReview, CodeReviewServiceError } from "../../services/codeReviewService.js";
import { codeReviewRequestSchema } from "../../schemas/codeReviewSchema.js";
import { createWebsiteReview, WebsiteReviewServiceError } from "../../services/websiteReviewService.js";
import { websiteReviewRequestSchema } from "../../schemas/websiteReviewSchema.js";

export async function websiteReview(request, response) {
  const parsedRequest = websiteReviewRequestSchema.safeParse(request.body);
  if (!parsedRequest.success) return response.status(400).json({ error: "A valid website URL of at most 2048 characters is required." });
  try {
    return response.status(200).json(await createWebsiteReview(parsedRequest.data.url, parsedRequest.data.force));
  } catch (error) {
    if (error instanceof WebsiteReviewServiceError) {
      const responses = {
        "invalid-url": [400, "Enter a valid public http or https URL."],
        "unsafe-target": [403, "The requested website target is not allowed."],
        "dns-failure": [422, "The website could not be resolved for analysis."],
        unreachable: [422, "The website could not be reached for analysis."],
        "html-too-large": [422, "The website HTML is too large to analyze safely."],
        "browser-timeout": [422, "The website visual capture timed out. Please retry."],
        "screenshot-failed": [422, "The website visual capture could not be completed."],
        configuration: [500, "Website review is not configured. Add GEMINI_API_KEY and GEMINI_VISION_MODEL to the server environment."],
        authentication: [502, "Website review authentication failed. Please try again later."],
        "rate-limit": [429, "Website review is temporarily rate limited. Please retry shortly."],
        "model-unavailable": [502, "The configured website vision model is unavailable or missing. Please try again later."],
        vision_model_unavailable: [502, "The configured website vision model is unavailable or does not support images. Please try again later."],
        upstream: [502, "Website review is temporarily unavailable. Please retry."],
        "malformed-response": [502, "Website review returned an invalid response. Please retry."],
        unexpected: [500, "Unable to create the website review. Please try again later."],
      };
      const [status, message] = responses[error.kind] || responses.unexpected;
      return response.status(status).json({ error: message });
    }
    return response.status(500).json({ error: "Unable to create the website review. Please try again later." });
  }
}
export async function codeReview(request, response) {
  const parsedRequest = codeReviewRequestSchema.safeParse(request.body);

  if (!parsedRequest.success) {
    const { language, code } = request.body || {};
    if (!["html", "css", "javascript"].includes(language)) return response.status(400).json({ error: "Language must be html, css, or javascript." });
    if (typeof code !== "string") return response.status(400).json({ error: "Code must be a string." });
    if (!code.trim()) return response.status(400).json({ error: "Code cannot be empty." });
    if (code.trim().length > 20000) return response.status(400).json({ error: "Code must not exceed 20000 characters." });
    return response.status(400).json({ error: "Invalid code review request." });
  }

  try {
    return response.status(200).json(await createCodeReview(parsedRequest.data.language, parsedRequest.data.code));
  } catch (error) {
    if (error instanceof CodeReviewServiceError) {
      const responses = {
        configuration: [500, "Code review is not configured. Contact the server administrator."],
        authentication: [502, "Code review authentication failed. Please try again later."],
        "rate-limit": [429, "Code review is temporarily rate limited. Please retry shortly."],
        "model-unavailable": [502, "The configured Groq model is unavailable or missing. Please try again later."],
        upstream: [502, "Code review service is temporarily unavailable. Please retry."],
        "malformed-response": [502, "Code review service returned an invalid response. Please retry."],
        unexpected: [500, "Unable to create the code review. Please try again later."],
      };
      const [status, message] = responses[error.kind] || responses.unexpected;
      return response.status(status).json({ error: message });
    }

    return response.status(500).json({ error: "Unable to create the code review. Please try again later." });
  }
}
