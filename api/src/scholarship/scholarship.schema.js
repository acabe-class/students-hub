import { z } from "zod";

export const createApplicationSchema = z.object({
  track_id: z.string().uuid({ message: "Valid track ID is required" }),
  personal_statement: z.string().min(100, { message: "Personal statement must be at least 100 characters" }),
  academic_background: z.string().min(50, { message: "Academic background must be at least 50 characters" }),
  financial_need: z.string().min(50, { message: "Financial need description must be at least 50 characters" }),
  career_goals: z.string().min(50, { message: "Career goals must be at least 50 characters" }),
  resume_url: z.string().url({ message: "Valid resume URL is required" }).optional(),
  transcript_url: z.string().url({ message: "Valid transcript URL is required" }).optional()
});

export const updateApplicationSchema = z.object({
  track_id: z.string().uuid({ message: "Valid track ID is required" }).optional(),
  personal_statement: z.string().min(100, { message: "Personal statement must be at least 100 characters" }).optional(),
  academic_background: z.string().min(50, { message: "Academic background must be at least 50 characters" }).optional(),
  financial_need: z.string().min(50, { message: "Financial need description must be at least 50 characters" }).optional(),
  career_goals: z.string().min(50, { message: "Career goals must be at least 50 characters" }).optional(),
  resume_url: z.string().url({ message: "Valid resume URL is required" }).optional(),
  transcript_url: z.string().url({ message: "Valid transcript URL is required" }).optional()
});

export const reviewApplicationSchema = z.object({
  status: z.enum(['approved', 'rejected', 'under_review'], {
    message: "Status must be approved, rejected, or under_review"
  }),
  reviewer_notes: z.string().min(10, { message: "Reviewer notes must be at least 10 characters" })
}); 