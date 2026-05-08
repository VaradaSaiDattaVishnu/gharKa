import type { FastifyRequest, FastifyReply } from "fastify";
import * as adminService from "./admin.service.js";

export async function listUsers(request: FastifyRequest, reply: FastifyReply) {
  const users = await adminService.listUsers();
  return reply.send({ success: true, data: users });
}

export async function toggleUserStatus(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const user = await adminService.toggleUserStatus(request.params.id);
  return reply.send({ success: true, data: user });
}

export async function listListings(request: FastifyRequest, reply: FastifyReply) {
  const listings = await adminService.listAllListings();
  return reply.send({ success: true, data: listings });
}

export async function deleteListing(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  await adminService.deleteListing(request.params.id);
  return reply.send({ success: true, data: null });
}

export async function getStats(request: FastifyRequest, reply: FastifyReply) {
  const stats = await adminService.getStats();
  return reply.send({ success: true, data: stats });
}
