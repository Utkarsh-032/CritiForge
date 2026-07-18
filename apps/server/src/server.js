import "./config/env.js";
import express from "express";
import { assertGroqConfiguration, groqModel } from "../services/groqClient.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import mentorRoutes from "./routes/mentorRoutes.js";

const app = express();
const port = process.env.PORT || 3001;

app.use((request, response, next) => { response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); response.setHeader("Access-Control-Allow-Headers", "Content-Type"); if (request.method === "OPTIONS") return response.sendStatus(204); next(); });
app.use(express.json());
app.get("/api/health", (request, response) => response.json({ status: "ok", message: "CritiForge API is running" }));
function sendAiStatus(request, response) {
  try {
    assertGroqConfiguration();
    response.json({
      status: "ok",
      provider: "groq",
      configured: true,
      model: groqModel,
      message: "CritiForge Groq configuration is ready",
    });
  } catch {
    response.status(503).json({
      status: "error",
      provider: "groq",
      configured: false,
      message: "CritiForge Groq configuration is incomplete.",
    });
  }
}
app.get("/api/ai/status", sendAiStatus);
app.get("/api/openai/status", sendAiStatus);
app.use("/api/reviews", reviewRoutes);
app.use("/api/mentor", mentorRoutes);
app.use((error, request, response, next) => { console.error(error); response.status(500).json({ error: "An unexpected server error occurred." }); next(); });

app.listen(port, () => console.log(`CritiForge demo API listening on http://localhost:${port}`));
