import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { listingsApi } from './use-api';
import { useLocationStore } from '../store/location-store';
import type { FoodCategory } from '@gharka/shared';

const api = listingsApi();

export function useListings(category?: FoodCategory) {
  const { latitude, longitude } = useLocationStore();

  return useInfiniteQuery({
    queryKey: ['listings', latitude, longitude, category],
    queryFn: ({ pageParam }) =>
      api.list({
        lat: latitude ?? 0,
        lng: longitude ?? 0,
        category,
        cursor: pageParam ?? undefined,
        limit: 20,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasMore ? lastPage.meta.cursor : undefined,
    enabled: latitude !== null && longitude !== null,
  });
}

export function useListing(id: string) {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: () => api.getById(id),
    enabled: !!id,
  });
}

export function useMyListings() {
  const { latitude, longitude } = useLocationStore();

  return useQuery({
    queryKey: ['my-listings'],
    queryFn: () =>
      api.list({
        lat: latitude ?? 0,
        lng: longitude ?? 0,
        limit: 50,
      }),
    enabled: latitude !== null && longitude !== null,
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
    },
  });
}

export function useToggleListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.toggleActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
    },
  });
}

export function useDeleteListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
    },
  });
}
