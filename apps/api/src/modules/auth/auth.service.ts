import { eq } from "drizzle-orm";
import { createHash, randomBytes } from "node:crypto";
import { getDb } from "../../db/index.js";
import { users, refreshTokens } from "../../db/schema.js";
import { getFirebaseAuth } from "../../config/firebase.js";
import { getEnv } from "../../config/env.js";
import { signAccessToken, signRefreshToken } from "../../utils/jwt.js";
import { AppError } from "../../plugins/error-handler.plugin.js";

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function verifyFirebaseAndLogin(firebaseToken: string) {
  const auth = getFirebaseAuth();
  const decoded = await auth.verifyIdToken(firebaseToken);
  const phone = decoded.phone_number;
  if (!phone) {
    throw new AppError(400, "INVALID_TOKEN", "Firebase token must contain a phone number");
  }

  const db = getDb();
  let [user] = await db.select().from(users).where(eq(users.phone, phone)).limit(1);

  const isNew = !user;
  if (!user) {
    const env = getEnv();
    const adminPhones = env.ADMIN_PHONE_NUMBERS.split(",").filter(Boolean);
    const role = adminPhones.includes(phone) ? "ADMIN" : "BUYER";
    [user] = await db
      .insert(users)
      .values({ phone, role })
      .returning();
  }

  const accessToken = signAccessToken({ userId: user.id, role: user.role });
  const refreshToken = signRefreshToken({ userId: user.id, role: user.role });

  await db.insert(refreshTokens).values({
    userId: user.id,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { user, accessToken, refreshToken, isNew };
}

export async function refreshAccessToken(token: string) {
  const db = getDb();
  const tokenHash = hashToken(token);

  const [stored] = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.tokenHash, tokenHash))
    .limit(1);

  if (!stored || stored.expiresAt < new Date()) {
    throw new AppError(401, "INVALID_REFRESH_TOKEN", "Refresh token is invalid or expired");
  }

  const [user] = await db.select().from(users).where(eq(users.id, stored.userId)).limit(1);
  if (!user || !user.isActive) {
    throw new AppError(401, "USER_INACTIVE", "User account is deactivated");
  }

  await db.delete(refreshTokens).where(eq(refreshTokens.id, stored.id));

  const accessToken = signAccessToken({ userId: user.id, role: user.role });
  const newRefreshToken = signRefreshToken({ userId: user.id, role: user.role });

  await db.insert(refreshTokens).values({
    userId: user.id,
    tokenHash: hashToken(newRefreshToken),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken: newRefreshToken };
}

export async function logout(userId: string, token: string) {
  const db = getDb();
  const tokenHash = hashToken(token);
  await db.delete(refreshTokens).where(eq(refreshTokens.tokenHash, tokenHash));
}

export async function onboardUser(
  userId: string,
  data: { name: string; avatarUrl?: string; role: string }
) {
  const db = getDb();
  const [user] = await db
    .update(users)
    .set({
      name: data.name,
      avatarUrl: data.avatarUrl ?? null,
      role: data.role as "BUYER" | "SELLER",
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning();

  if (!user) {
    throw new AppError(404, "USER_NOT_FOUND", "User not found");
  }

  const accessToken = signAccessToken({ userId: user.id, role: user.role });
  return { user, accessToken };
}
