import { eq, and, sql, lt } from "drizzle-orm";
import { getDb } from "../../db/index.js";
import { foodListings, users } from "../../db/schema.js";
import { buildDistanceQuery, buildDistanceFilter } from "../../utils/geo-query.js";
import { buildCursorMeta } from "../../utils/pagination.js";
import { AppError } from "../../plugins/error-handler.plugin.js";
import type { CreateListingInput, UpdateListingInput, ListingsQuery } from "@gharka/shared";

export async function listNearby(query: ListingsQuery) {
  const db = getDb();
  const { lat, lng, radius, category, cursor, limit } = query;
  const distanceExpr = buildDistanceQuery(lat, lng);
  const distanceFilterExpr = buildDistanceFilter(lat, lng, radius);

  const conditions = [
    eq(foodListings.isActive, true),
    sql`${distanceFilterExpr}`,
    sql`(${foodListings.expiresAt} IS NULL OR ${foodListings.expiresAt} > NOW())`,
    sql`${foodListings.availableQuantity} > 0`,
  ];

  if (category) {
    conditions.push(eq(foodListings.category, category));
  }

  if (cursor) {
    const [cursorRow] = await db
      .select({ id: foodListings.id })
      .from(foodListings)
      .where(eq(foodListings.id, cursor))
      .limit(1);
    if (cursorRow) {
      conditions.push(sql`${foodListings.id} > ${cursor}`);
    }
  }

  const rows = await db
    .select({
      id: foodListings.id,
      sellerId: foodListings.sellerId,
      title: foodListings.title,
      description: foodListings.description,
      images: foodListings.images,
      price: foodListings.price,
      quantity: foodListings.quantity,
      availableQuantity: foodListings.availableQuantity,
      category: foodListings.category,
      latitude: foodListings.latitude,
      longitude: foodListings.longitude,
      isActive: foodListings.isActive,
      createdAt: foodListings.createdAt,
      updatedAt: foodListings.updatedAt,
      expiresAt: foodListings.expiresAt,
      distance: distanceExpr.as("distance"),
      sellerName: users.name,
      sellerAvatar: users.avatarUrl,
    })
    .from(foodListings)
    .leftJoin(users, eq(foodListings.sellerId, users.id))
    .where(and(...conditions))
    .orderBy(sql`distance ASC`)
    .limit(limit + 1);

  const meta = buildCursorMeta(rows, limit);
  const items = rows.slice(0, limit);

  return { items, meta };
}

export async function listBySeller(sellerId: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(foodListings)
    .where(eq(foodListings.sellerId, sellerId))
    .orderBy(sql`${foodListings.createdAt} DESC`);
  return { items: rows, meta: { hasMore: false, cursor: null } };
}

export async function getById(id: string) {
  const db = getDb();
  const [listing] = await db
    .select()
    .from(foodListings)
    .where(eq(foodListings.id, id))
    .limit(1);
  if (!listing) {
    throw new AppError(404, "LISTING_NOT_FOUND", "Listing not found");
  }
  return listing;
}

export async function create(sellerId: string, data: CreateListingInput) {
  const db = getDb();
  const [listing] = await db
    .insert(foodListings)
    .values({
      sellerId,
      title: data.title,
      description: data.description ?? null,
      images: data.images,
      price: data.price.toString(),
      quantity: data.quantity,
      availableQuantity: data.quantity,
      category: data.category,
      latitude: data.location.latitude.toString(),
      longitude: data.location.longitude.toString(),
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    })
    .returning();
  return listing;
}

export async function update(id: string, sellerId: string, data: UpdateListingInput) {
  const db = getDb();
  const [existing] = await db
    .select()
    .from(foodListings)
    .where(and(eq(foodListings.id, id), eq(foodListings.sellerId, sellerId)))
    .limit(1);

  if (!existing) {
    throw new AppError(404, "LISTING_NOT_FOUND", "Listing not found or access denied");
  }

  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  if (data.title) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.images) updateData.images = data.images;
  if (data.price) updateData.price = data.price.toString();
  if (data.quantity) {
    const diff = data.quantity - Number(existing.quantity);
    updateData.quantity = data.quantity;
    updateData.availableQuantity = Math.max(0, Number(existing.availableQuantity) + diff);
  }
  if (data.category) updateData.category = data.category;
  if (data.expiresAt) updateData.expiresAt = new Date(data.expiresAt);

  const [listing] = await db
    .update(foodListings)
    .set(updateData)
    .where(eq(foodListings.id, id))
    .returning();
  return listing;
}

export async function remove(id: string, sellerId: string) {
  const db = getDb();
  const [listing] = await db
    .delete(foodListings)
    .where(and(eq(foodListings.id, id), eq(foodListings.sellerId, sellerId)))
    .returning();
  if (!listing) {
    throw new AppError(404, "LISTING_NOT_FOUND", "Listing not found or access denied");
  }
  return listing;
}

export async function toggleActive(id: string, sellerId: string) {
  const db = getDb();
  const [existing] = await db
    .select()
    .from(foodListings)
    .where(and(eq(foodListings.id, id), eq(foodListings.sellerId, sellerId)))
    .limit(1);

  if (!existing) {
    throw new AppError(404, "LISTING_NOT_FOUND", "Listing not found or access denied");
  }

  const [listing] = await db
    .update(foodListings)
    .set({ isActive: !existing.isActive, updatedAt: new Date() })
    .where(eq(foodListings.id, id))
    .returning();
  return listing;
}
