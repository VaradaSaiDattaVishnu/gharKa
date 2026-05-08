"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type {
  ApiResponse,
  PaginatedResponse,
  OrderResponse,
  CreateOrderInput,
  UpdateOrderStatusInput,
} from "@gharka/shared";

export interface OrderWithDetails extends OrderResponse {
  listing?: {
    title: string;
    images: string[];
    price: number;
  };
  buyer?: {
    name: string | null;
    avatarUrl: string | null;
  };
  seller?: {
    name: string | null;
    avatarUrl: string | null;
  };
}

export function useOrders(role: "buyer" | "seller") {
  return useQuery({
    queryKey: ["orders", role],
    queryFn: () =>
      api.get<PaginatedResponse<OrderWithDetails>>(`/api/orders`, {
        role,
      }),
    staleTime: 30 * 1000,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () =>
      api.get<ApiResponse<OrderWithDetails>>(`/api/orders/${id}`),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderInput) =>
      api.post<ApiResponse<OrderResponse>>("/api/orders", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
}

export function useUpdateOrderStatus(orderId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateOrderStatusInput) =>
      api.patch<ApiResponse<OrderResponse>>(
        `/api/orders/${orderId}/status`,
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    },
  });
}
