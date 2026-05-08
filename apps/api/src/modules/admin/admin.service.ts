import { eq, sql, desc, count } from "drizzle-orm";
import { getDb } from "../../db/index.js";
import { users, foodListings, orders } from "../../db/schema.js";
import { AppError } from "../../plugins/error-handler.plugin.js";

export async function listUsers() {
  const db = getDb();
  return db.select().from(users).orderBy(desc(users.createdAt));
}

export async function toggleUserStatus(userId: string) {
  const db = getDb();
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) {
    throw new AppError(404, "USER_NOT_FOUND", "User not found");
  }

  const [updated] = await db
    .update(users)
    .set({ isActive: !user.isActive, updatedAt: new Date() })
    .where(eq(users.id, userId))
    .returning();
  return updated;
}

export async function listAllListings() {
  const db = getDb();
  return db
    .select({
      id: foodListings.id,
      sellerId: foodListings.sellerId,
      title: foodListings.title,
      price: foodListings.price,
      category: foodListings.category,
      isActive: foodListings.isActive,
      createdAt: foodListings.createdAt,
      sellerName: users.name,
      sellerPhone: users.phone,
    })
    .from(foodListings)
    .leftJoin(users, eq(foodListings.sellerId, users.id))
    .orderBy(desc(foodListings.createdAt));
}

export async function deleteListing(id: string) {
  const db = getDb();
  const [listing] = await db
    .delete(foodListings)
    .where(eq(foodListings.id, id))
    .returning();
  if (!listing) {
    throw new AppError(404, "LISTING_NOT_FOUND", "Listing not found");
  }
  return listing;
}

export async function getStats() {
  const db = getDb();

  const [userStats] = await db
    .select({ total: count() })
    .from(users);

  const [listingStats] = await db
    .select({ total: count() })
    .from(foodListings);

  const [orderStats] = await db
    .select({ total: count() })
    .from(orders);

  const [activeListings] = await db
    .select({ total: count() })
    .from(foodListings)
    .where(eq(foodListings.isActive, true));

  return {
    totalUsers: userStats.total,
    totalListings: listingStats.total,
    totalOrders: orderStats.total,
    activeListings: activeListings.total,
  };
}
