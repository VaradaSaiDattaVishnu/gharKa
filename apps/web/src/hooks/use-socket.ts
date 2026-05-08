"use client";

import { useEffect, useRef, useCallback } from "react";
import {
  getSocket,
  connectSocket,
  disconnectSocket,
  joinRoom,
  leaveRoom,
} from "@/lib/socket-client";
import { useAuthStore } from "@/store/auth-store";

export function useSocket() {
  const { isAuthenticated } = useAuthStore();
  const connectedRef = useRef(false);

  useEffect(() => {
    if (isAuthenticated && !connectedRef.current) {
      connectSocket();
      connectedRef.current = true;
    }

    return () => {
      if (connectedRef.current) {
        disconnectSocket();
        connectedRef.current = false;
      }
    };
  }, [isAuthenticated]);

  const join = useCallback((room: string) => {
    joinRoom(room);
  }, []);

  const leave = useCallback((room: string) => {
    leaveRoom(room);
  }, []);

  const on = useCallback(
    (event: string, callback: (...args: unknown[]) => void) => {
      const socket = getSocket();
      socket.on(event, callback);
      return () => {
        socket.off(event, callback);
      };
    },
    []
  );

  const emit = useCallback((event: string, ...args: unknown[]) => {
    const socket = getSocket();
    socket.emit(event, ...args);
  }, []);

  return { join, leave, on, emit };
}
