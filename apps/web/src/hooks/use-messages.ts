"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type {
  ApiResponse,
  PaginatedResponse,
  MessageResponse,
  SendMessageInput,
} from "@gharka/shared";
import type { Conversation } from "@gharka/shared";

export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: () =>
      api.get<PaginatedResponse<Conversation>>("/api/messages/conversations"),
    staleTime: 15 * 1000,
    refetchInterval: 30 * 1000,
  });
}

export function useMessages(orderId: string) {
  return useQuery({
    queryKey: ["messages", orderId],
    queryFn: () =>
      api.get<PaginatedResponse<MessageResponse>>(
        `/api/messages/${orderId}`
      ),
    enabled: !!orderId,
    refetchInterval: 5000,
  });
}

export function useSendMessage(orderId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendMessageInput) =>
      api.post<ApiResponse<MessageResponse>>(
        `/api/messages/${orderId}`,
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", orderId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
