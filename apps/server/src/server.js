import "./config/env.js";
import express from "express";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { assertGroqConfiguration, getGroqConfigurationStatus, groqModel } from "../services/groqClient.js";
import { getGeminiConfigurationStatus } from "../services/geminiClient.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import mentorRoutes from "./routes/mentorRoutes.js";

const app = express();
const port = process.env.PORT || 3001;
const frontendOrigins = (process.env.FRONTEND_ORIGIN || "http://localhost:5173").split(",").map((origin) => origin.trim()).filter(Boolean);
const aiRateLimit = rateLimit({
  windowMs: Number(process.env.AI_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  limit: Number(process.env.AI_RATE_LIMIT_MAX) || 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many AI requests from this browser. Please wait a few minutes and try again." },
});

app.disable("x-powered-by");
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use((request, response, next) => {
  const origin = request.get("origin");
  if (origin && !frontendOrigins.includes(origin)) return response.status(403).json({ error: "This origin is not allowed to use the API." });
  if (origin) response.setHeader("Access-Control-Allow-Origin", origin);
  response.setHeader("Vary", "Origin");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (request.method === "OPTIONS") return response.sendStatus(204);
  return next();
});
app.use(express.json({ limit: "256kb" }));
app.get("/api/health", (request, response) => response.json({ status: "ok", message: "CritiForge API is running" }));
function sendAiStatus(request, response) {
  const configuration = getGroqConfigurationStatus();
  const geminiConfiguration = getGeminiConfigurationStatus();
  try {
    assertGroqConfiguration();
    response.json({
      status: "ok",
      provider: "groq",
      configured: true,
      model: groqModel,
      ...configuration,
      ...geminiConfiguration,
      message: "CritiForge Groq configuration is ready",
    });
  } catch {
    response.status(503).json({
      status: "error",
      provider: "groq",
      configured: false,
      ...configuration,
      ...geminiConfiguration,
      message: "CritiForge Groq configuration is incomplete.",
    });
  }
}
app.get("/api/ai/status", sendAiStatus);
app.get("/api/openai/status", sendAiStatus);
app.use("/api/reviews", aiRateLimit, reviewRoutes);
app.use("/api/mentor", aiRateLimit, mentorRoutes);
app.use((error, request, response, next) => {
  void next;
  if (error?.type === "entity.too.large") return response.status(413).json({ error: "Request body must not exceed 256kb." });
  return response.status(500).json({ error: "An unexpected server error occurred." });
});

app.listen(port, () => console.log(`CritiForge API listening on http://localhost:${port}`));
