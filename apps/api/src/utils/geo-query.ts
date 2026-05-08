import { sql } from "drizzle-orm";

export function buildDistanceQuery(lat: number, lng: number) {
  return sql<number>`(
    6371000 * acos(
      LEAST(1.0, GREATEST(-1.0,
        cos(radians(${lat})) * cos(radians(latitude)) *
        cos(radians(longitude) - radians(${lng})) +
        sin(radians(${lat})) * sin(radians(latitude))
      ))
    )
  )`;
}

export function buildDistanceFilter(lat: number, lng: number, radiusMeters: number) {
  return sql`(
    6371000 * acos(
      LEAST(1.0, GREATEST(-1.0,
        cos(radians(${lat})) * cos(radians(latitude)) *
        cos(radians(longitude) - radians(${lng})) +
        sin(radians(${lat})) * sin(radians(latitude))
      ))
    )
  ) <= ${radiusMeters}`;
}
