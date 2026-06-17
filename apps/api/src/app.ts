import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import { getEnv } from "./config/env.js";
import { logger } from "./utils/logger.js";
import errorHandlerPlugin from "./plugins/error-handler.plugin.js";
import rateLimitPlugin from "./plugins/rate-limit.plugin.js";
import socketPlugin from "./plugins/socket.plugin.js";
import { registerMessageHandlers } from "./modules/messages/messages.gateway.js";
import authRoutes from "./modules/auth/auth.routes.js";
import usersRoutes from "./modules/users/users.routes.js";
import listingsRoutes from "./modules/listings/listings.routes.js";
import ordersRoutes from "./modules/orders/orders.routes.js";
import messagesRoutes from "./modules/messages/messages.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import uploadRoutes from "./modules/upload/upload.routes.js";

export async function buildApp() {
  const env = getEnv();

  const fastify = Fastify({
    logger: false,
    trustProxy: true,
  });

  await fastify.register(cors, {
    origin: env.CORS_ORIGINS.split(",")
      .map((o) => o.trim().replace(/\/+$/, ""))
      .filter(Boolean),
    credentials: true,
  });

  await fastify.register(helmet, {
    contentSecurityPolicy: false,
  });

  await fastify.register(errorHandlerPlugin);
  await fastify.register(rateLimitPlugin);
  await fastify.register(socketPlugin);

  fastify.get("/api/health", async () => ({
    success: true,
    data: {
      status: "ok",
      // Render injects RENDER_GIT_COMMIT at runtime; exposing it here lets us
      // confirm exactly which commit is live (i.e. whether a push deployed).
      version: process.env.RENDER_GIT_COMMIT?.slice(0, 7) ?? "dev",
      timestamp: new Date().toISOString(),
    },
  }));

  await fastify.register(authRoutes, { prefix: "/api/auth" });
  await fastify.register(usersRoutes, { prefix: "/api/users" });
  await fastify.register(listingsRoutes, { prefix: "/api/listings" });
  await fastify.register(ordersRoutes, { prefix: "/api/orders" });
  await fastify.register(messagesRoutes, { prefix: "/api/messages" });
  await fastify.register(adminRoutes, { prefix: "/api/admin" });
  await fastify.register(uploadRoutes, { prefix: "/api/upload" });

  registerMessageHandlers(fastify.io);

  return fastify;
}
