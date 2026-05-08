import type { FastifyRequest, FastifyReply } from "fastify";

export function authorize(allowedRoles: string[]) {
  return async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
    if (!allowedRoles.includes(request.userRole)) {
      reply.code(403).send({
        success: false,
        error: { code: "FORBIDDEN", message: "Insufficient permissions" },
      });
    }
  };
}
