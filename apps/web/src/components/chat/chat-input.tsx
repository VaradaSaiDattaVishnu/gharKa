"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 p-3 bg-white border-t border-mist"
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 h-10 rounded-full border border-mist bg-cloud px-4 text-sm font-body text-charcoal placeholder:text-ash focus:outline-none focus:ring-2 focus:ring-turmeric/40 focus:border-turmeric transition-all"
        disabled={disabled}
        aria-label="Message input"
      />
      <motion.button
        type="submit"
        disabled={disabled || !text.trim()}
        whileTap={{ scale: 0.9 }}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
          text.trim()
            ? "bg-turmeric text-white"
            : "bg-mist text-ash"
        )}
        aria-label="Send message"
      >
        <Send className="h-5 w-5" />
      </motion.button>
    </form>
  );
}
