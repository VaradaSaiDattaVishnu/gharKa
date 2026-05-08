import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { authenticate } from "../../middleware/authenticate.js";
import { validateBody } from "../../middleware/validate.js";
import * as controller from "./upload.controller.js";

const signatureBodySchema = z.object({
  folder: z.enum(["listings", "avatars"]).optional(),
});

export default async function uploadRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/signature",
    { preHandler: [authenticate, validateBody(signatureBodySchema)] },
    controller.getSignature
  );
}
