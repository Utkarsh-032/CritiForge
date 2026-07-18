import { z } from "zod";

export const mentorRequestSchema = z.object({
  question: z.string().trim().min(1).max(3000),
  context: z.string().trim().max(15000).optional().transform((value) => value || ""),
});

export const mentorResponseSchema = z.object({
  source: z.literal("groq"),
  reviewType: z.literal("mentor"),
  topic: z.string().min(1),
  summary: z.string().min(1),
  whyItMatters: z.string().min(1),
  whatIsWrong: z.array(z.string().min(1)),
  bestPractices: z.array(z.string().min(1)),
  betterApproach: z.array(z.string().min(1)),
  exampleCode: z.string(),
  learningTips: z.array(z.string().min(1)),
  nextSteps: z.array(z.string().min(1)),
});
