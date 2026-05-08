import { z } from "zod";

export const createUserSchema = z.object({
  phone: z.string().regex(/^\+[1-9]\d{6,14}$/),
  name: z.string().min(2).max(100).optional(),
  role: z.enum(["BUYER", "SELLER", "ADMIN"]),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  avatarUrl: z.string().url().optional(),
});

export const updateLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  location: z.string().max(255).optional(),
});

export const userResponseSchema = z.object({
  id: z.string().uuid(),
  phone: z.string(),
  name: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  role: z.enum(["BUYER", "SELLER", "ADMIN"]),
  location: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateLocationInput = z.infer<typeof updateLocationSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
