import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).optional(),
  email: z.string().email({ message: "Invalid email format" }).optional(),
  roles: z.array(z.string()).optional(),
  track_id: z.string().uuid().optional()
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z.string().min(6, { message: "New password must be at least 6 characters" })
});

export const updateProfileSchema = z.object({
  bio: z.string().optional(),
  picture_url: z.string().url({ message: "Invalid URL format" }).optional(),
  track_id: z.string().uuid().optional()
}); 