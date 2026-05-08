import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { updateUserSchema, updateLocationSchema } from "@gharka/shared";
import { authenticate } from "../../middleware/authenticate.js";
import { validateBody } from "../../middleware/validate.js";
import * as controller from "./users.controller.js";

const updateRoleSchema = z.object({
  role: z.enum(["BUYER", "SELLER"]),
});

export default async function usersRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);

  fastify.get("/me", controller.getMe);

  fastify.patch(
    "/me",
    { preHandler: [validateBody(updateUserSchema)] },
    controller.updateMe
  );

  fastify.patch(
    "/me/location",
    { preHandler: [validateBody(updateLocationSchema)] },
    controller.updateLocation
  );

  fastify.patch(
    "/me/role",
    { preHandler: [validateBody(updateRoleSchema)] },
    controller.updateRole
  );
}
