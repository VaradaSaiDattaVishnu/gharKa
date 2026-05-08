"use client";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useLocationStore } from "@/store/location-store";
import type {
  PaginatedResponse,
  ListingResponse,
} from "@gharka/shared";

export function useListings(
  category?: string,
  radius: number = 5000,
  limit: number = 20
) {
  const { latitude, longitude } = useLocationStore();

  return useInfiniteQuery({
    queryKey: ["listings", latitude, longitude, category, radius],
    queryFn: async ({ pageParam }) => {
      const params: Record<string, string | number | boolean | undefined> = {
        lat: latitude!,
        lng: longitude!,
        radius,
        limit,
        category,
        cursor: pageParam as string | undefined,
      };
      return api.get<PaginatedResponse<ListingResponse>>(
        "/api/listings",
        params
      );
    },
    enabled: !!latitude && !!longitude,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasMore ? lastPage.meta.cursor : undefined,
    initialPageParam: undefined as string | undefined,
    staleTime: 2 * 60 * 1000,
  });
}

export function useMyListings() {
  return useQuery({
    queryKey: ["my-listings"],
    queryFn: () =>
      api.get<PaginatedResponse<ListingResponse>>("/api/listings/mine"),
    staleTime: 60 * 1000,
  });
}

export function useAllListings(cursor?: string, limit: number = 50) {
  return useQuery({
    queryKey: ["admin-listings", cursor],
    queryFn: () =>
      api.get<PaginatedResponse<ListingResponse>>("/api/admin/listings", {
        cursor,
        limit,
      }),
    staleTime: 30 * 1000,
  });
}
