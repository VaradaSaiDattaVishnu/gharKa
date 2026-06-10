// pm2 process configuration for the GharKa API.
//
// Start / reload:  pm2 startOrReload deploy/oracle/ecosystem.config.cjs --update-env
//
// The API loads its own environment from apps/api/.env via dotenv, so we only
// need to point pm2 at the built entrypoint and set the working directory to
// the api folder (dotenv reads .env relative to the process cwd).
const { resolve } = require("node:path");

const API_DIR = resolve(__dirname, "../../apps/api");

module.exports = {
  apps: [
    {
      name: "gharka-api",
      script: resolve(API_DIR, "dist/index.js"),
      cwd: API_DIR,
      interpreter: "node",
      // Socket.io holds long-lived WebSocket connections; a single fork keeps
      // every client on one process, so no sticky sessions / Redis adapter
      // are needed. Do NOT switch to cluster mode without a Socket.io adapter.
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_restarts: 10,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
