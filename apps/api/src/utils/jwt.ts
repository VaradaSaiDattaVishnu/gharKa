import jwt from "jsonwebtoken";
import { getEnv } from "../config/env.js";

export interface JwtPayload {
  userId: string;
  role: string;
}

// Long-lived access token so normal use (refresh, navigation, clicking around)
// never forces a re-login. This is a low-stakes community app with no payments,
// so a 2-day access token is an acceptable trade for not logging users out.
export function signAccessToken(payload: JwtPayload): string {
  const env = getEnv();
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "2d" });
}

// Refresh token outlives the access token by a wide margin so the session can
// silently extend for up to 30 days. Keep in sync with the DB row's expiresAt
// in auth.service.ts.
export function signRefreshToken(payload: JwtPayload): string {
  const env = getEnv();
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: "30d" });
}

export function verifyAccessToken(token: string): JwtPayload {
  const env = getEnv();
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  const env = getEnv();
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
}
