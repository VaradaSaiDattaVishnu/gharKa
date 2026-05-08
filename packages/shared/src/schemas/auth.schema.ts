import { z } from "zod";

export const sendOtpSchema = z.object({
  phone: z
    .string()
    .regex(/^\+[1-9]\d{6,14}$/, "Invalid phone number format. Use E.164 format."),
});

export const verifyOtpSchema = z.object({
  firebaseToken: z.string().min(1),
});

export const onboardSchema = z.object({
  name: z.string().min(2).max(100),
  avatarUrl: z.string().url().optional(),
  role: z.enum(["BUYER", "SELLER"]),
});

export type SendOtpInput = z.infer<typeof sendOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type OnboardInput = z.infer<typeof onboardSchema>;
