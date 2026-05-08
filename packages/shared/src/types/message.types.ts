export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  orderId: string;
  content: string;
  readAt: Date | null;
  createdAt: Date;
}

export interface Conversation {
  orderId: string;
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar: string | null;
  lastMessage: string;
  lastMessageAt: Date;
  unreadCount: number;
}
