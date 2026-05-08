import type { FastifyInstance } from "fastify";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import * as controller from "./admin.controller.js";

export default async function adminRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);
  fastify.addHook("preHandler", authorize(["ADMIN"]));

  fastify.get("/users", controller.listUsers);
  fastify.patch("/users/:id/status", controller.toggleUserStatus);
  fastify.get("/listings", controller.listListings);
  fastify.delete("/listings/:id", controller.deleteListing);
  fastify.get("/stats", controller.getStats);
}
