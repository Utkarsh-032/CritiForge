import { z } from "zod";

const score = z.number().int().min(0).max(100);

export const codeReviewRequestSchema = z.object({
  language: z.enum(["html", "css", "javascript"]),
  code: z.string().trim().min(1).max(20000),
});

export const codeReviewResponseSchema = z.object({
  source: z.literal("groq"),
  reviewType: z.literal("code"),
  language: z.enum(["html", "css", "javascript"]),
  summary: z.string().min(1),
  overallScore: score,
  scores: z.object({
    quality: score,
    maintainability: score,
    security: score,
    performance: score,
    bestPractices: score,
  }),
  issues: z.array(z.object({
    severity: z.enum(["critical", "high", "medium", "low"]),
    category: z.enum(["bug", "security", "maintainability", "performance", "best-practice", "accessibility"]),
    title: z.string().min(1),
    explanation: z.string().min(1),
    lineReference: z.string().min(1),
    suggestedFix: z.string().min(1),
  })),
  strengths: z.array(z.string().min(1)),
  refactoringSuggestions: z.array(z.object({
    title: z.string().min(1),
    reason: z.string().min(1),
    exampleCode: z.string(),
  })),
});
