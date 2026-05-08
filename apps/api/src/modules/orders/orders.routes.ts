import type { FastifyInstance } from "fastify";
import { createOrderSchema, updateOrderStatusSchema } from "@gharka/shared";
import { authenticate } from "../../middleware/authenticate.js";
import { validateBody } from "../../middleware/validate.js";
import * as controller from "./orders.controller.js";

export default async function ordersRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);

  fastify.post(
    "/",
    { preHandler: [validateBody(createOrderSchema)] },
    controller.create
  );

  fastify.get("/", controller.list);

  fastify.get("/:id", controller.getById);

  fastify.patch(
    "/:id/status",
    { preHandler: [validateBody(updateOrderStatusSchema)] },
    controller.updateStatus
  );
}
