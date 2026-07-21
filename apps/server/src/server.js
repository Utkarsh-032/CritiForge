import "./config/env.js";
import express from "express";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { getGroqConfigurationStatus } from "../services/groqClient.js";
import { getGeminiConfigurationStatus } from "../services/geminiClient.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import mentorRoutes from "./routes/mentorRoutes.js";
import { closeWebsiteBrowser } from "../services/websiteCollector.js";

const app = express();
const port = process.env.PORT || 3001;
const host = "0.0.0.0";
const isProduction = process.env.NODE_ENV === "production";
const normalizeOrigin = (origin) => origin.trim().replace(/\/+$/, "");
const configuredOrigins = (process.env.FRONTEND_ORIGIN || "").split(",").map(normalizeOrigin).filter(Boolean);
const developmentOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const frontendOrigins = isProduction ? configuredOrigins : [...new Set([...configuredOrigins, ...developmentOrigins])];
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
  const normalizedOrigin = origin ? normalizeOrigin(origin) : "";
  if (normalizedOrigin && !frontendOrigins.includes(normalizedOrigin)) { console.warn("cors-rejected", { origin: normalizedOrigin }); return response.status(403).json({ error: { type: "cors_rejected", message: "This origin is not allowed to use the API." } }); }
  if (normalizedOrigin) response.setHeader("Access-Control-Allow-Origin", normalizedOrigin);
  response.setHeader("Vary", "Origin");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (request.method === "OPTIONS") return response.sendStatus(204);
  return next();
});
app.use((request, response, next) => {
  if (!request.path.startsWith("/api/reviews") && !request.path.startsWith("/api/mentor")) return next();
  const requestId = crypto.randomUUID(); const started = Date.now();
  response.locals.requestId = requestId;
  response.on("finish", () => console.info("ai-request", { requestId, endpoint: request.originalUrl.split("?")[0], stage: "response", responseStatus: response.statusCode, durationMs: Date.now() - started, providerErrorCode: response.locals.providerErrorCode || null }));
  return next();
});
app.use(express.json({ limit: "256kb" }));
app.get("/", (request, response) => response.json({ status: "ok", message: "CritiForge API is running", health: "/api/health" }));
app.get("/api/health", (request, response) => response.json({ status: "ok", message: "CritiForge API is running" }));
function sendAiStatus(request, response) {
  response.json({ status: "ok", providers: { groq: getGroqConfigurationStatus(), gemini: getGeminiConfigurationStatus() } });
}
app.get("/api/ai/status", sendAiStatus);
app.get("/api/openai/status", sendAiStatus);
app.use("/api/reviews", aiRateLimit, reviewRoutes);
app.use("/api/mentor", aiRateLimit, mentorRoutes);
app.use((error, request, response, next) => {
  void next;
  if (error?.type === "entity.too.large") return response.status(413).json({ error: { type: "request_too_large", message: "Request body must not exceed 256kb." } });
  return response.status(500).json({ error: { type: "unexpected_server_error", message: "An unexpected server error occurred." } });
});

const server = app.listen(port, host, () => console.log(`CritiForge API listening on ${host}:${port}`));

function shutdown(signal) {
  console.log(`${signal} received; closing CritiForge API.`);
  closeWebsiteBrowser().finally(() => server.close(() => process.exit(0)));
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.once("SIGTERM", () => shutdown("SIGTERM"));
process.once("SIGINT", () => shutdown("SIGINT"));
