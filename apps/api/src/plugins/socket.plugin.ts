import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";
import { Server } from "socket.io";
import { verifyAccessToken } from "../utils/jwt.js";
import { logger } from "../utils/logger.js";
import { getEnv } from "../config/env.js";

declare module "fastify" {
  interface FastifyInstance {
    io: Server;
  }
}

export default fp(async function socketPlugin(fastify: FastifyInstance) {
  const env = getEnv();
  const io = new Server(fastify.server, {
    cors: {
      origin: env.CORS_ORIGINS.split(","),
      credentials: true,
    },
    path: "/ws",
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token as string | undefined;
    if (!token) {
      return next(new Error("Authentication required"));
    }
    try {
      const payload = verifyAccessToken(token);
      socket.data.userId = payload.userId;
      socket.data.userRole = payload.role;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId as string;
    socket.join(`user:${userId}`);
    logger.info({ userId }, "Socket connected");

    socket.on("disconnect", () => {
      logger.info({ userId }, "Socket disconnected");
    });
  });

  fastify.decorate("io", io);

  fastify.addHook("onClose", () => {
    io.close();
  });
});
