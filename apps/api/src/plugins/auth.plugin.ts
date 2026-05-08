import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";
import { authenticate } from "../middleware/authenticate.js";

export default fp(async function authPlugin(fastify: FastifyInstance) {
  fastify.decorate("authenticate", authenticate);
});
