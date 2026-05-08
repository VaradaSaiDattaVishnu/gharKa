import { sql } from "drizzle-orm";
import type { PgSelect } from "drizzle-orm/pg-core";

export interface CursorPaginationParams {
  cursor?: string;
  limit: number;
}

export interface CursorPaginationMeta {
  cursor: string | null;
  hasMore: boolean;
}

export function buildCursorMeta<T extends { id: string }>(
  items: T[],
  limit: number
): CursorPaginationMeta {
  const hasMore = items.length > limit;
  const sliced = hasMore ? items.slice(0, limit) : items;
  return {
    cursor: sliced.length > 0 ? sliced[sliced.length - 1].id : null,
    hasMore,
  };
}
