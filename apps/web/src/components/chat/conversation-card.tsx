"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { formatTimeAgo } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ConversationCardProps {
  orderId: string;
  otherUserName: string;
  otherUserAvatar: string | null;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export function ConversationCard({
  orderId,
  otherUserName,
  otherUserAvatar,
  lastMessage,
  lastMessageAt,
  unreadCount,
}: ConversationCardProps) {
  return (
    <Link href={`/chat/${orderId}`}>
      <div
        className={cn(
          "flex items-center gap-3 p-4 rounded-xl hover:bg-cloud/50 transition-colors",
          unreadCount > 0 && "bg-turmeric-light/20"
        )}
      >
        <Avatar src={otherUserAvatar} name={otherUserName} size="lg" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4
              className={cn(
                "font-heading text-sm truncate",
                unreadCount > 0
                  ? "font-bold text-charcoal"
                  : "font-semibold text-charcoal"
              )}
            >
              {otherUserName}
            </h4>
            <span className="text-[10px] font-body text-ash shrink-0 ml-2">
              {formatTimeAgo(lastMessageAt)}
            </span>
          </div>
          <p
            className={cn(
              "text-sm font-body truncate mt-0.5",
              unreadCount > 0 ? "text-charcoal font-medium" : "text-slate"
            )}
          >
            {lastMessage}
          </p>
        </div>

        {unreadCount > 0 && (
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-turmeric px-1.5 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </div>
    </Link>
  );
}
