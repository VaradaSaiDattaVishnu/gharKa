import { z } from "zod";

export const sendMessageSchema = z.object({
  content: z.string().min(1).max(1000),
});

export const messageResponseSchema = z.object({
  id: z.string().uuid(),
  senderId: z.string().uuid(),
  receiverId: z.string().uuid(),
  orderId: z.string().uuid(),
  content: z.string(),
  readAt: z.string().nullable(),
  createdAt: z.string(),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type MessageResponse = z.infer<typeof messageResponseSchema>;
