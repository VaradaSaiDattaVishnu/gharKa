import type { FastifyRequest, FastifyReply } from "fastify";
import type { ZodSchema } from "zod";

export function validateBody(schema: ZodSchema) {
  return async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const result = schema.safeParse(request.body);
    if (!result.success) {
      reply.code(400).send({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request body",
          details: result.error.flatten().fieldErrors,
        },
      });
      return;
    }
    request.body = result.data;
  };
}

export function validateQuery(schema: ZodSchema) {
  return async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const result = schema.safeParse(request.query);
    if (!result.success) {
      reply.code(400).send({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid query parameters",
          details: result.error.flatten().fieldErrors,
        },
      });
      return;
    }
    request.query = result.data as typeof request.query;
  };
}

export function validateParams(schema: ZodSchema) {
  return async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const result = schema.safeParse(request.params);
    if (!result.success) {
      reply.code(400).send({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid path parameters",
          details: result.error.flatten().fieldErrors,
        },
      });
      return;
    }
    request.params = result.data as typeof request.params;
  };
}
