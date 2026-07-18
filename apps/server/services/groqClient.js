import Groq from "groq-sdk";
import "../src/config/env.js";

const apiKey = process.env.GROQ_API_KEY?.trim();
export const groqModel = process.env.GROQ_MODEL?.trim();
export const groq = apiKey ? new Groq({ apiKey, timeout: 30000, maxRetries: 0 }) : null;

export function assertGroqApiKey() {
  if (!apiKey) throw new Error("Groq is not configured: GROQ_API_KEY is missing.");
}

export function assertGroqConfiguration() {
  assertGroqApiKey();
  if (!groqModel) throw new Error("Groq is not configured: GROQ_MODEL is missing.");
}

export function getGroqClient() {
  assertGroqApiKey();
  return groq;
}
