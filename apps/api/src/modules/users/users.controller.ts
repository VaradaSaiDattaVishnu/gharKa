import type { FastifyRequest, FastifyReply } from "fastify";
import type { UpdateUserInput, UpdateLocationInput } from "@gharka/shared";
import * as usersService from "./users.service.js";

export async function getMe(request: FastifyRequest, reply: FastifyReply) {
  const user = await usersService.getMe(request.userId);
  return reply.send({ success: true, data: user });
}

export async function updateMe(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as UpdateUserInput;
  const user = await usersService.updateMe(request.userId, body);
  return reply.send({ success: true, data: user });
}

export async function updateLocation(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as UpdateLocationInput;
  const user = await usersService.updateLocation(request.userId, body);
  return reply.send({ success: true, data: user });
}

export async function updateRole(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as { role: "BUYER" | "SELLER" };
  const user = await usersService.updateRole(request.userId, body.role);
  return reply.send({ success: true, data: user });
}
