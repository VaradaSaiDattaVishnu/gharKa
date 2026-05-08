import { eq, and, or, desc, sql, isNull } from "drizzle-orm";
import { getDb } from "../../db/index.js";
import { messages, orders, users } from "../../db/schema.js";
import { AppError } from "../../plugins/error-handler.plugin.js";

export async function getConversations(userId: string) {
  const db = getDb();
  const rows = await db.execute(sql`
    SELECT DISTINCT ON (m.order_id)
      m.order_id as "orderId",
      CASE
        WHEN m.sender_id = ${userId} THEN m.receiver_id
        ELSE m.sender_id
      END as "otherUserId",
      u.name as "otherUserName",
      u.avatar_url as "otherUserAvatar",
      m.content as "lastMessage",
      m.created_at as "lastMessageAt",
      (
        SELECT COUNT(*)::int FROM messages m2
        WHERE m2.order_id = m.order_id
          AND m2.receiver_id = ${userId}
          AND m2.read_at IS NULL
      ) as "unreadCount"
    FROM messages m
    JOIN users u ON u.id = CASE
      WHEN m.sender_id = ${userId} THEN m.receiver_id
      ELSE m.sender_id
    END
    WHERE m.sender_id = ${userId} OR m.receiver_id = ${userId}
    ORDER BY m.order_id, m.created_at DESC
  `);
  return rows;
}

export async function getMessagesForOrder(orderId: string, userId: string) {
  const db = getDb();
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!order) {
    throw new AppError(404, "ORDER_NOT_FOUND", "Order not found");
  }

  if (order.buyerId !== userId && order.sellerId !== userId) {
    throw new AppError(403, "FORBIDDEN", "Access denied");
  }

  const rows = await db
    .select()
    .from(messages)
    .where(eq(messages.orderId, orderId))
    .orderBy(messages.createdAt);

  return rows;
}

export async function sendMessage(
  senderId: string,
  orderId: string,
  content: string
) {
  const db = getDb();
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!order) {
    throw new AppError(404, "ORDER_NOT_FOUND", "Order not found");
  }

  if (order.buyerId !== senderId && order.sellerId !== senderId) {
    throw new AppError(403, "FORBIDDEN", "Access denied");
  }

  const receiverId = order.buyerId === senderId ? order.sellerId : order.buyerId;

  const [message] = await db
    .insert(messages)
    .values({ senderId, receiverId, orderId, content })
    .returning();

  return message;
}

export async function markAsRead(orderId: string, userId: string) {
  const db = getDb();
  await db
    .update(messages)
    .set({ readAt: new Date() })
    .where(
      and(
        eq(messages.orderId, orderId),
        eq(messages.receiverId, userId),
        isNull(messages.readAt)
      )
    );
}
