import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("gharka_token")
        : null;

    socket = io(SOCKET_URL, {
      autoConnect: false,
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
  }
  return socket;
}

export function connectSocket() {
  const s = getSocket();
  if (!s.connected) {
    const token = localStorage.getItem("gharka_token");
    s.auth = { token };
    s.connect();
  }
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function joinRoom(room: string) {
  const s = getSocket();
  if (s.connected) {
    s.emit("join", room);
  }
}

export function leaveRoom(room: string) {
  const s = getSocket();
  if (s.connected) {
    s.emit("leave", room);
  }
}
