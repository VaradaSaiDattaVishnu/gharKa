import type { FastifyRequest, FastifyReply } from "fastify";
import * as uploadService from "./upload.service.js";

export async function getSignature(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as { folder?: string };
  const folder = body.folder ?? "listings";
  const result = uploadService.generateSignature(folder);
  return reply.send({ success: true, data: result });
}
