import type { Server, Socket } from "socket.io";
import { logger } from "../../utils/logger.js";

export function registerMessageHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    const userId = socket.data.userId as string;

    socket.on("order:join", (orderId: string) => {
      socket.join(`order:${orderId}`);
      logger.debug({ userId, orderId }, "Joined order room");
    });

    socket.on("order:leave", (orderId: string) => {
      socket.leave(`order:${orderId}`);
      logger.debug({ userId, orderId }, "Left order room");
    });

    socket.on("typing:start", (orderId: string) => {
      socket.to(`order:${orderId}`).emit("typing:start", { userId, orderId });
    });

    socket.on("typing:stop", (orderId: string) => {
      socket.to(`order:${orderId}`).emit("typing:stop", { userId, orderId });
    });
  });
}
