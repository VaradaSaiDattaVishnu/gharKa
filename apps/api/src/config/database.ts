import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/schema.js";
import { getEnv } from "./env.js";

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;
let _sql: ReturnType<typeof postgres> | null = null;

export function getDb() {
  if (_db) return _db;
  const env = getEnv();
  _sql = postgres(env.DATABASE_URL, {
    // Render free tier is 512 MB RAM and Neon free has a low connection ceiling;
    // 20 pooled connections is wasteful and a memory/OOM risk for a low-traffic
    // app. 5 is plenty here. idle_timeout closes idle conns so we don't hold
    // them open across Neon's 5-min compute auto-suspend.
    max: 5,
    idle_timeout: 20,
    connect_timeout: 10,
  });
  _db = drizzle(_sql, { schema });
  return _db;
}

export function getSql() {
  if (!_sql) getDb();
  return _sql!;
}

export async function closeDb() {
  if (_sql) {
    await _sql.end();
    _sql = null;
    _db = null;
  }
}
