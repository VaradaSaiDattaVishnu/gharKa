import { eq, and, or, desc, sql } from "drizzle-orm";
import { getDb } from "../../db/index.js";
import { orders, foodListings, users } from "../../db/schema.js";
import { canTransition, type OrderStatus } from "@gharka/shared";
import { AppError } from "../../plugins/error-handler.plugin.js";
import type { CreateOrderInput } from "@gharka/shared";

export async function create(buyerId: string, data: CreateOrderInput) {
  const db = getDb();
  const [listing] = await db
    .select()
    .from(foodListings)
    .where(and(eq(foodListings.id, data.listingId), eq(foodListings.isActive, true)))
    .limit(1);

  if (!listing) {
    throw new AppError(404, "LISTING_NOT_FOUND", "Listing not found or inactive");
  }

  if (listing.sellerId === buyerId) {
    throw new AppError(400, "SELF_ORDER", "Cannot order from your own listing");
  }

  if (Number(listing.availableQuantity) < data.quantity) {
    throw new AppError(400, "INSUFFICIENT_QUANTITY", "Not enough available quantity");
  }

  const [order] = await db.transaction(async (tx) => {
    await tx
      .update(foodListings)
      .set({
        availableQuantity: Number(listing.availableQuantity) - data.quantity,
        updatedAt: new Date(),
      })
      .where(eq(foodListings.id, data.listingId));

    return tx
      .insert(orders)
      .values({
        buyerId,
        listingId: data.listingId,
        sellerId: listing.sellerId,
        quantity: data.quantity,
      })
      .returning();
  });

  return order;
}

export async function listForUser(userId: string, role: string) {
  const db = getDb();
  const condition =
    role === "SELLER"
      ? eq(orders.sellerId, userId)
      : role === "ADMIN"
        ? sql`1=1`
        : eq(orders.buyerId, userId);

  const rows = await db
    .select({
      id: orders.id,
      buyerId: orders.buyerId,
      listingId: orders.listingId,
      sellerId: orders.sellerId,
      quantity: orders.quantity,
      status: orders.status,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
      listingTitle: foodListings.title,
      listingImage: foodListings.images,
    })
    .from(orders)
    .leftJoin(foodListings, eq(orders.listingId, foodListings.id))
    .where(condition)
    .orderBy(desc(orders.createdAt));

  return rows;
}

export async function getById(id: string, userId: string, role: string) {
  const db = getDb();
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, id))
    .limit(1);

  if (!order) {
    throw new AppError(404, "ORDER_NOT_FOUND", "Order not found");
  }

  if (role !== "ADMIN" && order.buyerId !== userId && order.sellerId !== userId) {
    throw new AppError(403, "FORBIDDEN", "Access denied");
  }

  return order;
}

export async function updateStatus(
  id: string,
  userId: string,
  role: string,
  newStatus: string
) {
  const db = getDb();
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, id))
    .limit(1);

  if (!order) {
    throw new AppError(404, "ORDER_NOT_FOUND", "Order not found");
  }

  if (role !== "ADMIN" && order.sellerId !== userId && order.buyerId !== userId) {
    throw new AppError(403, "FORBIDDEN", "Access denied");
  }

  const currentStatus = order.status as OrderStatus;
  const targetStatus = newStatus as OrderStatus;

  if (!canTransition(currentStatus, targetStatus)) {
    throw new AppError(
      400,
      "INVALID_TRANSITION",
      `Cannot transition from ${currentStatus} to ${targetStatus}`
    );
  }

  const [updated] = await db.transaction(async (tx) => {
    if (targetStatus === "CANCELLED" && order.status !== "CANCELLED") {
      await tx
        .update(foodListings)
        .set({
          availableQuantity: sql`${foodListings.availableQuantity} + ${order.quantity}`,
          updatedAt: new Date(),
        })
        .where(eq(foodListings.id, order.listingId));
    }

    return tx
      .update(orders)
      .set({ status: targetStatus, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
  });

  return updated;
}
