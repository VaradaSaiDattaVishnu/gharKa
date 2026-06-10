#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────
# GharKa API — build, migrate, and (re)start on the Oracle VM.
# Run from anywhere on the VM after setup.sh has completed:
#     cd ~/gharka && bash deploy/oracle/deploy.sh
#
# Safe to re-run for EVERY update:  git pull && bash deploy/oracle/deploy.sh
# ──────────────────────────────────────────────────────────────────────────
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_ROOT"

ENV_FILE="apps/api/.env"
if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: $ENV_FILE not found."
  echo "       cp deploy/oracle/api.env.example $ENV_FILE  and fill in real values first."
  exit 1
fi

echo "==> [1/4] Installing dependencies (frozen lockfile, incl. dev deps for build + migrations)"
pnpm install --frozen-lockfile

echo "==> [2/4] Building @gharka/shared, then @gharka/api"
pnpm --filter "@gharka/api..." run build

echo "==> [3/4] Applying database migrations to Neon"
# drizzle.config.ts reads process.env.DATABASE_URL directly (it does not load
# the .env file), so we extract and export it just for this step.
DATABASE_URL="$(grep -E '^DATABASE_URL=' "$ENV_FILE" | head -n1 | cut -d= -f2-)"
export DATABASE_URL
if [[ -z "$DATABASE_URL" ]]; then
  echo "ERROR: DATABASE_URL is empty in $ENV_FILE"; exit 1
fi
pnpm --filter @gharka/api run db:migrate

echo "==> [4/4] Starting / reloading the API under pm2"
pm2 startOrReload deploy/oracle/ecosystem.config.cjs --update-env
pm2 save

PORT="$(grep -E '^PORT=' "$ENV_FILE" | head -n1 | cut -d= -f2- || true)"
PORT="${PORT:-3001}"
echo ""
echo "============================================================"
echo " Deploy complete. API running on 127.0.0.1:${PORT} (behind Caddy)."
echo "   Local health : curl -s http://127.0.0.1:${PORT}/api/health"
echo "   Live health  : curl -s https://<your-domain>/api/health"
echo "   Logs         : pm2 logs gharka-api"
echo "   Status       : pm2 status"
echo "============================================================"
echo " First time only: run  pm2 startup  and execute the command it prints,"
echo " so the API restarts automatically after a reboot."
echo "============================================================"
