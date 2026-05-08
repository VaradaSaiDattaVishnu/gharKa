import { eq } from "drizzle-orm";
import { getDb } from "../../db/index.js";
import { users } from "../../db/schema.js";
import { AppError } from "../../plugins/error-handler.plugin.js";
import type { UpdateUserInput, UpdateLocationInput } from "@gharka/shared";

export async function getMe(userId: string) {
  const db = getDb();
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) {
    throw new AppError(404, "USER_NOT_FOUND", "User not found");
  }
  return user;
}

export async function updateMe(userId: string, data: UpdateUserInput) {
  const db = getDb();
  const [user] = await db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.id, userId))
    .returning();
  if (!user) {
    throw new AppError(404, "USER_NOT_FOUND", "User not found");
  }
  return user;
}

export async function updateLocation(userId: string, data: UpdateLocationInput) {
  const db = getDb();
  const [user] = await db
    .update(users)
    .set({
      latitude: data.latitude.toString(),
      longitude: data.longitude.toString(),
      location: data.location ?? null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning();
  if (!user) {
    throw new AppError(404, "USER_NOT_FOUND", "User not found");
  }
  return user;
}

export async function updateRole(userId: string, role: "BUYER" | "SELLER") {
  const db = getDb();
  const [user] = await db
    .update(users)
    .set({ role, updatedAt: new Date() })
    .where(eq(users.id, userId))
    .returning();
  if (!user) {
    throw new AppError(404, "USER_NOT_FOUND", "User not found");
  }
  return user;
}
