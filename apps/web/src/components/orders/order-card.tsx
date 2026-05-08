"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { OrderStatusBadge } from "./order-status-badge";
import { Avatar } from "@/components/ui/avatar";
import { formatTimeAgo, formatPrice } from "@/lib/utils";

interface OrderCardProps {
  id: string;
  status: string;
  quantity: number;
  createdAt: string;
  listing?: {
    title: string;
    images: string[];
    price: number;
  };
  otherUser?: {
    name: string | null;
    avatarUrl: string | null;
  };
  otherUserRole: "cook" | "buyer";
  onClick?: () => void;
  index?: number;
}

export function OrderCard({
  status,
  quantity,
  createdAt,
  listing,
  otherUser,
  otherUserRole,
  onClick,
  index = 0,
}: OrderCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.06,
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <button
        onClick={onClick}
        className="w-full text-left rounded-2xl bg-white border border-mist/50 shadow-sm p-4 hover:shadow-md transition-shadow"
      >
        <div className="flex gap-3">
          <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-cloud shrink-0">
            {listing?.images[0] ? (
              <Image
                src={listing.images[0]}
                alt={listing.title || "Order"}
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-ash">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  opacity="0.3"
                >
                  <circle cx="12" cy="14" r="8" />
                </svg>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-heading font-bold text-charcoal text-sm truncate">
                {listing?.title || "Dish"}
              </h3>
              <OrderStatusBadge status={status} />
            </div>

            <div className="flex items-center gap-2">
              <Avatar
                src={otherUser?.avatarUrl}
                name={otherUser?.name}
                size="sm"
              />
              <span className="text-xs font-body text-slate truncate">
                {otherUser?.name || "User"} ({otherUserRole})
              </span>
            </div>

            <div className="flex items-center justify-between text-xs font-body text-ash">
              <span>
                Qty: {quantity}{" "}
                {listing?.price && (
                  <span className="text-turmeric font-medium">
                    {formatPrice(listing.price * quantity)}
                  </span>
                )}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTimeAgo(createdAt)}
              </span>
            </div>
          </div>
        </div>
      </button>
    </motion.div>
  );
}
