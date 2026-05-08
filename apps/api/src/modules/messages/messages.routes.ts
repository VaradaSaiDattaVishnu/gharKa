import type { FastifyInstance } from "fastify";
import { sendMessageSchema } from "@gharka/shared";
import { authenticate } from "../../middleware/authenticate.js";
import { validateBody } from "../../middleware/validate.js";
import * as controller from "./messages.controller.js";

export default async function messagesRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);

  fastify.get("/conversations", controller.getConversations);
  fastify.get("/:orderId", controller.getMessages);

  fastify.post(
    "/:orderId",
    { preHandler: [validateBody(sendMessageSchema)] },
    controller.sendMessage
  );

  fastify.patch("/:orderId/read", controller.markAsRead);
}
