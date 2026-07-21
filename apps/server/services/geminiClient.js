import "../src/config/env.js";

const apiKey = process.env.GEMINI_API_KEY?.trim();
export const geminiVisionModel = process.env.GEMINI_VISION_MODEL?.trim();

export function assertGeminiConfiguration() {
  if (!apiKey) throw new Error("Gemini is not configured: GEMINI_API_KEY is missing.");
  if (!geminiVisionModel) throw new Error("Gemini is not configured: GEMINI_VISION_MODEL is missing.");
}

export function getGeminiConfigurationStatus() {
  return {
    configured: Boolean(apiKey),
    modelConfigured: Boolean(geminiVisionModel),
  };
}

export async function generateGeminiContent({ systemInstruction, prompt, screenshotBase64 }) {
  assertGeminiConfiguration();
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(geminiVisionModel)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: AbortSignal.timeout(45_000),
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemInstruction }] },
      contents: [{ role: "user", parts: [
        { text: prompt },
        ...(screenshotBase64 ? [{ inlineData: { mimeType: "image/jpeg", data: screenshotBase64 } }] : []),
      ] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.2 },
    }),
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body?.error?.message || "Gemini request failed.");
    error.status = response.status;
    error.code = body?.error?.status || body?.error?.code;
    throw error;
  }

  const text = body?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim();
  if (!text) {
    const error = new Error("Gemini returned no review content.");
    error.code = "empty_response";
    throw error;
  }
  return text;
}
