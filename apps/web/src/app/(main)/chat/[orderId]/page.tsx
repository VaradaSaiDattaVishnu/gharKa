"use client";

import { useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Info } from "lucide-react";
import { ChatBubble } from "@/components/chat/chat-bubble";
import { ChatInput } from "@/components/chat/chat-input";
import { LoadingPot } from "@/components/shared/loading-pot";
import { Avatar } from "@/components/ui/avatar";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { useMessages, useSendMessage } from "@/hooks/use-messages";
import { useOrder } from "@/hooks/use-orders";
import { useSocket } from "@/hooks/use-socket";
import { useAuthStore } from "@/store/auth-store";

export default function ChatRoomPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;
  const { user } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: orderData } = useOrder(orderId);
  const { data: messagesData, isLoading } = useMessages(orderId);
  const sendMessage = useSendMessage(orderId);
  const { join, leave } = useSocket();

  const messages = messagesData?.data || [];
  const order = orderData?.data;

  const otherUser =
    order?.buyerId === user?.id ? order?.seller : order?.buyer;

  useEffect(() => {
    join(`order:${orderId}`);
    return () => leave(`order:${orderId}`);
  }, [orderId, join, leave]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = (content: string) => {
    sendMessage.mutate({ content });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-72px)] md:h-[calc(100vh-72px-24px)]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-mist/50 shrink-0">
        <button
          onClick={() => router.back()}
          className="p-1.5 rounded-full hover:bg-mist/50 transition-colors md:hidden"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-charcoal" />
        </button>
        <Avatar
          src={otherUser?.avatarUrl}
          name={otherUser?.name}
          size="md"
        />
        <div className="flex-1 min-w-0">
          <h2 className="font-heading font-bold text-charcoal text-sm truncate">
            {otherUser?.name || "Chat"}
          </h2>
          {order && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-body text-slate truncate">
                {order.listing?.title}
              </span>
              <OrderStatusBadge status={order.status} />
            </div>
          )}
        </div>
      </div>

      {/* Payment Banner */}
      <div className="flex items-center gap-2 px-4 py-2 bg-turmeric-light/50 border-b border-turmeric-light text-xs font-body text-turmeric-dark shrink-0">
        <Info className="h-4 w-4 shrink-0" />
        <span>Arrange payment directly with the {order?.buyerId === user?.id ? "cook" : "buyer"}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-cloud/30">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingPot size="sm" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm font-body text-ash text-center">
              Start a conversation about this order
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              content={msg.content}
              createdAt={msg.createdAt}
              isSent={msg.senderId === user?.id}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="shrink-0">
        <ChatInput onSend={handleSend} disabled={sendMessage.isPending} />
      </div>
    </div>
  );
}
