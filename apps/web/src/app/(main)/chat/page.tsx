"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { ConversationCard } from "@/components/chat/conversation-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useConversations } from "@/hooks/use-messages";

export default function ChatPage() {
  const { data, isLoading } = useConversations();
  const conversations = data?.data || [];

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-6">
      <h1 className="font-heading text-2xl font-bold text-charcoal mb-6">
        Messages
      </h1>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-4">
              <Skeleton className="h-14 w-14 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ))}
        </div>
      ) : conversations.length === 0 ? (
        <EmptyState
          icon={<MessageCircle className="h-16 w-16" />}
          title="No conversations yet"
          description="When you place an order or receive one, you can chat with the other person here."
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="divide-y divide-mist/50"
        >
          {conversations.map((conv) => (
            <ConversationCard
              key={conv.orderId}
              orderId={conv.orderId}
              otherUserName={conv.otherUserName}
              otherUserAvatar={conv.otherUserAvatar}
              lastMessage={conv.lastMessage}
              lastMessageAt={conv.lastMessageAt as unknown as string}
              unreadCount={conv.unreadCount}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
