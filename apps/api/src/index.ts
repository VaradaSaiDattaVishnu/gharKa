import "dotenv/config";
import { buildApp } from "./app.js";
import { getEnv } from "./config/env.js";
import { closeDb } from "./db/index.js";
import { logger } from "./utils/logger.js";

async function main() {
  const env = getEnv();
  const app = await buildApp();

  const shutdown = async (signal: string) => {
    logger.info({ signal }, "Shutting down");
    await app.close();
    await closeDb();
    process.exit(0);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  // Crash guards: on a free tier each process death is ~50s of downtime while it
  // restarts. Fastify already isolates per-request errors; these catch the stray
  // rejections/exceptions (e.g. from Socket.io or timers) that would otherwise
  // kill the whole process. Log loudly and stay up rather than restart-loop.
  process.on("unhandledRejection", (reason) => {
    logger.error({ reason }, "Unhandled promise rejection — process kept alive");
  });
  process.on("uncaughtException", (err) => {
    logger.error(err, "Uncaught exception — process kept alive");
  });

  try {
    await app.listen({ port: env.PORT, host: "0.0.0.0" });
    logger.info({ port: env.PORT }, "Server started");
  } catch (err) {
    logger.error(err, "Failed to start server");
    process.exit(1);
  }
}

main();
