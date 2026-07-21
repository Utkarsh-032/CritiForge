import { z } from "zod";

const score = z.number().int().min(0).max(100);

export const websiteReviewRequestSchema = z.object({
  url: z.string().trim().min(1).max(2048),
  force: z.boolean().optional().default(false),
});

export const websiteReviewResponseSchema = z.object({
  source: z.literal("gemini"),
  reviewType: z.literal("website"),
  analyzedUrl: z.string().url(),
  summary: z.string().min(1),
  overallScore: score,
  scores: z.object({
    ui: score,
    ux: score,
    accessibility: score,
    content: score,
    responsiveness: score,
    performanceReadiness: score,
  }),
  issues: z.array(z.object({
    category: z.enum(["ui", "ux", "accessibility", "content", "responsiveness", "performance"]),
    severity: z.enum(["critical", "high", "medium", "low"]),
    title: z.string().min(1),
    explanation: z.string().min(1),
    evidence: z.string().min(1),
    recommendation: z.string().min(1),
  })),
  strengths: z.array(z.string().min(1)),
  recommendations: z.array(z.object({
    priority: z.number().int().positive(),
    title: z.string().min(1),
    description: z.string().min(1),
    expectedImpact: z.string().min(1),
  })),
  analysisMode: z.enum(["visual-and-structure", "structure-only"]).optional(),
  cached: z.boolean().optional(),
});
