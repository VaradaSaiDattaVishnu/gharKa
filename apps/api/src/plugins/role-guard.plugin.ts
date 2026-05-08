import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";
import { authorize } from "../middleware/authorize.js";

export default fp(async function roleGuardPlugin(fastify: FastifyInstance) {
  fastify.decorate("authorize", authorize);
});
