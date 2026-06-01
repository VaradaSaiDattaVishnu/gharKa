import type { FastifyRequest, FastifyReply } from "fastify";
import type { CreateListingInput, UpdateListingInput, ListingsQuery } from "@gharka/shared";
import * as listingsService from "./listings.service.js";

export async function list(request: FastifyRequest, reply: FastifyReply) {
  const query = request.query as ListingsQuery;
  const result = await listingsService.listNearby(query);
  return reply.send({ success: true, data: result.items, meta: result.meta });
}

export async function mine(request: FastifyRequest, reply: FastifyReply) {
  const result = await listingsService.listBySeller(request.userId);
  return reply.send({ success: true, data: result.items, meta: result.meta });
}

export async function getById(request: FastifyRequest, reply: FastifyReply) {
  const params = request.params as { id: string };
  const listing = await listingsService.getById(params.id);
  return reply.send({ success: true, data: listing });
}

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as CreateListingInput;
  const listing = await listingsService.create(request.userId, body);
  return reply.code(201).send({ success: true, data: listing });
}

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const params = request.params as { id: string };
  const body = request.body as UpdateListingInput;
  const listing = await listingsService.update(params.id, request.userId, body);
  return reply.send({ success: true, data: listing });
}

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const params = request.params as { id: string };
  await listingsService.remove(params.id, request.userId);
  return reply.send({ success: true, data: null });
}

export async function toggleActive(request: FastifyRequest, reply: FastifyReply) {
  const params = request.params as { id: string };
  const listing = await listingsService.toggleActive(params.id, request.userId);
  return reply.send({ success: true, data: listing });
}
