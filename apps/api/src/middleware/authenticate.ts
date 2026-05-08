import type { FastifyRequest, FastifyReply } from "fastify";
import { verifyAccessToken } from "../utils/jwt.js";

declare module "fastify" {
  interface FastifyRequest {
    userId: string;
    userRole: string;
  }
}

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    reply.code(401).send({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Missing or invalid authorization header" },
    });
    return;
  }

  const token = authHeader.slice(7);
  try {
    const payload = verifyAccessToken(token);
    request.userId = payload.userId;
    request.userRole = payload.role;
  } catch {
    reply.code(401).send({
      success: false,
      error: { code: "TOKEN_EXPIRED", message: "Access token is invalid or expired" },
    });
  }
}
