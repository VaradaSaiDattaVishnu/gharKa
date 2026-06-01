import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { createListingSchema, updateListingSchema, listingsQuerySchema } from "@gharka/shared";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { validateBody, validateQuery } from "../../middleware/validate.js";
import * as controller from "./listings.controller.js";

const idParamSchema = z.object({ id: z.string().uuid() });

export default async function listingsRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/",
    { preHandler: [validateQuery(listingsQuerySchema)] },
    controller.list
  );

  fastify.get(
    "/mine",
    { preHandler: [authenticate] },
    controller.mine
  );

  fastify.get(
    "/:id",
    controller.getById
  );

  fastify.post(
    "/",
    { preHandler: [authenticate, authorize(["SELLER", "ADMIN"]), validateBody(createListingSchema)] },
    controller.create
  );

  fastify.patch(
    "/:id",
    { preHandler: [authenticate, authorize(["SELLER", "ADMIN"]), validateBody(updateListingSchema)] },
    controller.update
  );

  fastify.delete(
    "/:id",
    { preHandler: [authenticate, authorize(["SELLER", "ADMIN"])] },
    controller.remove
  );

  fastify.patch(
    "/:id/toggle",
    { preHandler: [authenticate, authorize(["SELLER", "ADMIN"])] },
    controller.toggleActive
  );
}
