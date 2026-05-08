import type { FastifyRequest, FastifyReply } from "fastify";
import type { SendMessageInput } from "@gharka/shared";
import * as messagesService from "./messages.service.js";

export async function getConversations(request: FastifyRequest, reply: FastifyReply) {
  const conversations = await messagesService.getConversations(request.userId);
  return reply.send({ success: true, data: conversations });
}

export async function getMessages(request: FastifyRequest, reply: FastifyReply) {
  const params = request.params as { orderId: string };
  const messages = await messagesService.getMessagesForOrder(params.orderId, request.userId);
  return reply.send({ success: true, data: messages });
}

export async function sendMessage(request: FastifyRequest, reply: FastifyReply) {
  const params = request.params as { orderId: string };
  const body = request.body as SendMessageInput;
  const message = await messagesService.sendMessage(
    request.userId,
    params.orderId,
    body.content
  );

  request.server.io.to(`user:${message.receiverId}`).emit("message:new", message);

  return reply.code(201).send({ success: true, data: message });
}

export async function markAsRead(request: FastifyRequest, reply: FastifyReply) {
  const params = request.params as { orderId: string };
  await messagesService.markAsRead(params.orderId, request.userId);
  return reply.send({ success: true, data: null });
}
