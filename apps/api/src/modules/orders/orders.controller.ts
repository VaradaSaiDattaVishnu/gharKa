import type { FastifyRequest, FastifyReply } from "fastify";
import type { CreateOrderInput, UpdateOrderStatusInput } from "@gharka/shared";
import * as ordersService from "./orders.service.js";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as CreateOrderInput;
  const order = await ordersService.create(request.userId, body);
  return reply.code(201).send({ success: true, data: order });
}

export async function list(request: FastifyRequest, reply: FastifyReply) {
  const rows = await ordersService.listForUser(request.userId, request.userRole);
  return reply.send({ success: true, data: rows });
}

export async function getById(request: FastifyRequest, reply: FastifyReply) {
  const params = request.params as { id: string };
  const order = await ordersService.getById(params.id, request.userId, request.userRole);
  return reply.send({ success: true, data: order });
}

export async function updateStatus(request: FastifyRequest, reply: FastifyReply) {
  const params = request.params as { id: string };
  const body = request.body as UpdateOrderStatusInput;
  const order = await ordersService.updateStatus(
    params.id,
    request.userId,
    request.userRole,
    body.status
  );
  return reply.send({ success: true, data: order });
}
