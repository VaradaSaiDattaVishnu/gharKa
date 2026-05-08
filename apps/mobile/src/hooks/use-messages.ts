import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { messagesApi } from './use-api';

const api = messagesApi();

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: api.getConversations,
    refetchInterval: 15000,
  });
}

export function useMessages(orderId: string) {
  return useQuery({
    queryKey: ['messages', orderId],
    queryFn: () => api.getMessages(orderId),
    enabled: !!orderId,
    refetchInterval: 5000,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, content }: { orderId: string; content: string }) =>
      api.sendMessage(orderId, content),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => api.markAsRead(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}
