"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatTimeAgo } from "@/lib/utils";

interface ChatBubbleProps {
  content: string;
  createdAt: string;
  isSent: boolean;
}

export function ChatBubble({ content, createdAt, isSent }: ChatBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn("flex", isSent ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2.5 relative",
          isSent
            ? "bg-turmeric-light text-charcoal rounded-br-md"
            : "bg-white border border-mist text-charcoal rounded-bl-md"
        )}
      >
        <p className="text-sm font-body leading-relaxed break-words">
          {content}
        </p>
        <p
          className={cn(
            "text-[10px] mt-1",
            isSent ? "text-turmeric-dark/60" : "text-ash"
          )}
        >
          {formatTimeAgo(createdAt)}
        </p>
      </div>
    </motion.div>
  );
}
