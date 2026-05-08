import { z } from "zod";

const orderStatusEnum = z.enum([
  "PLACED",
  "CONFIRMED",
  "READY",
  "PICKED_UP",
  "COMPLETED",
  "CANCELLED",
]);

export const createOrderSchema = z.object({
  listingId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

export const updateOrderStatusSchema = z.object({
  status: orderStatusEnum,
});

export const orderResponseSchema = z.object({
  id: z.string().uuid(),
  buyerId: z.string().uuid(),
  listingId: z.string().uuid(),
  sellerId: z.string().uuid(),
  quantity: z.number(),
  status: orderStatusEnum,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type OrderResponse = z.infer<typeof orderResponseSchema>;
