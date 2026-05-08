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
    max: 20,
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
