import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { verifyOtpSchema, onboardSchema } from "@gharka/shared";
import { authenticate } from "../../middleware/authenticate.js";
import { validateBody } from "../../middleware/validate.js";
import * as controller from "./auth.controller.js";

const refreshBodySchema = z.object({
  refreshToken: z.string().min(1),
});

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/verify-firebase",
    { preHandler: [validateBody(verifyOtpSchema)] },
    controller.verifyFirebase
  );

  fastify.post(
    "/refresh",
    { preHandler: [validateBody(refreshBodySchema)] },
    controller.refresh
  );

  fastify.post(
    "/logout",
    { preHandler: [authenticate, validateBody(refreshBodySchema)] },
    controller.logout
  );

  fastify.post(
    "/onboard",
    { preHandler: [authenticate, validateBody(onboardSchema)] },
    controller.onboard
  );
}
