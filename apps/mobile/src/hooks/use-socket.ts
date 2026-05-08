import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';
import { useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '../lib/api-client';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    let mounted = true;

    async function connect() {
      const token = await SecureStore.getItemAsync('accessToken');
      if (!token || !mounted) return;

      const socket = io(API_BASE_URL, {
        auth: { token },
        transports: ['websocket'],
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
      });

      socket.on('connect', () => {
        // Socket connected
      });

      socket.on('new_message', () => {
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
        queryClient.invalidateQueries({ queryKey: ['messages'] });
      });

      socket.on('order_update', () => {
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      });

      socket.on('disconnect', () => {
        // Socket disconnected
      });

      socketRef.current = socket;
    }

    connect();

    return () => {
      mounted = false;
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [queryClient]);

  return socketRef;
}
