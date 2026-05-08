"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type {
  ApiResponse,
  ListingResponse,
  CreateListingInput,
  UpdateListingInput,
} from "@gharka/shared";

export function useListing(id: string) {
  return useQuery({
    queryKey: ["listing", id],
    queryFn: () =>
      api.get<ApiResponse<ListingResponse & { seller?: { name: string; avatarUrl: string | null; id: string } }>>(
        `/api/listings/${id}`
      ),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateListingInput) =>
      api.post<ApiResponse<ListingResponse>>("/api/listings", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
    },
  });
}

export function useUpdateListing(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateListingInput) =>
      api.patch<ApiResponse<ListingResponse>>(`/api/listings/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listing", id] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
    },
  });
}

export function useDeleteListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.delete<ApiResponse<null>>(`/api/listings/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
    },
  });
}
