# Keeping the GharKa API awake (Render free tier)

The API runs on Render's **free** web-service tier: `https://gharka-api.onrender.com`.

## Why it "dies"

A Render free web service **spins down after ~15 minutes with no inbound HTTP
request**. The next request has to boot the container + Node app — a **cold
start of ~30–60 seconds** — which feels exactly like the app is dead/broken.

To stay up, something must hit the service at least once every **<15 minutes**,
forever.

## Why the GitHub Action alone is NOT enough

`.github/workflows/keep-alive.yml` pings `/api/health`, but it is only a
backup, because GitHub-hosted cron is unreliable for this job:

1. **Scheduled crons are throttled and delayed.** GitHub runs `schedule:`
   workflows on a best-effort basis; under load they are routinely delayed
   **15–45 minutes** (worst at the top of the hour) or skipped entirely. A
   `*/5` schedule does **not** mean "every 5 minutes." A single 16-minute gap
   is enough for the service to fall asleep.
2. **GitHub auto-disables scheduled workflows after 60 days** of no repository
   activity. If you stop pushing commits, the pinger silently stops.

That combination is almost certainly why it still dies despite the cron.

## ✅ The reliable fix: an external uptime monitor

Use a purpose-built monitor that pings from its own infrastructure on a real
schedule (not GitHub's). Both options below are **free, need no credit card,
and never get auto-disabled.** Pick one (cron-job.org recommended).

### Option A — cron-job.org (recommended)

1. Sign up at <https://cron-job.org> (free).
2. **Create cronjob** →
   - **Title:** `GharKa API keep-alive`
   - **URL:** `https://gharka-api.onrender.com/api/health`
   - **Schedule:** Every **5 minutes** (select "Every 5 minutes", or custom
     `*/5 * * * *`).
   - **Request method:** `GET`
3. Save. Open the job → check the execution history shows HTTP `200`s.

### Option B — UptimeRobot

1. Sign up at <https://uptimerobot.com> (free).
2. **Add New Monitor** →
   - **Monitor Type:** `HTTP(s)`
   - **Friendly Name:** `GharKa API`
   - **URL:** `https://gharka-api.onrender.com/api/health`
   - **Monitoring Interval:** `5 minutes` (the free-plan minimum).
3. Create. As a bonus you get downtime email/Slack alerts.

> The health route (`apps/api/src/app.ts`) returns a static `200` and does **not**
> touch the database, so it is cheap and safe to hit every few minutes.

## Reality check (important)

- **A cold start can still happen** right after a Render deploy or an internal
  restart, even with a perfect 5-minute monitor. To make that survivable, the
  web client now **waits through a cold start (up to ~70s) and shows a
  "the server is waking up — try again" message instead of hanging forever**
  (see `apps/web/src/lib/api-client.ts`).
- **Free instance-hours cap.** Render gives ~750 free instance-hours/month per
  account. Keeping one service always-on uses ~730 of them — fine if this is
  your **only** free web service, but there is no headroom for a second one.
- If always-on free ever proves too fragile, the simplest upgrades are Render's
  paid Starter tier (no sleep) or a no-card always-on free PaaS like Northflank.

## TL;DR

1. Add a **cron-job.org** (or UptimeRobot) monitor on
   `https://gharka-api.onrender.com/api/health` every **5 min**. ← this is the fix.
2. Keep the GitHub Action as a backup (already updated).
3. The web app now degrades gracefully during a cold start instead of looking dead.
