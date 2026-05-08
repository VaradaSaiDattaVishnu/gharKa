"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DistanceBadge } from "./distance-badge";
import { formatPrice } from "@/lib/utils";
import { CATEGORY_DISPLAY_NAMES, type FoodCategory } from "@gharka/shared";

interface ListingCardProps {
  id: string;
  title: string;
  images: string[];
  price: number;
  category: string;
  sellerName?: string;
  sellerAvatar?: string | null;
  distance?: number;
  index?: number;
}

export function ListingCard({
  id,
  title,
  images,
  price,
  category,
  sellerName,
  sellerAvatar,
  distance,
  index = 0,
}: ListingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.08,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link href={`/feed/${id}`}>
        <motion.article
          className="group rounded-2xl bg-white border border-mist/50 shadow-sm overflow-hidden"
          whileHover={{
            y: -4,
            boxShadow:
              "0 12px 24px -4px rgba(38, 50, 56, 0.08), 0 4px 8px -2px rgba(38, 50, 56, 0.04)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          layoutId={`listing-${id}`}
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-cloud">
            {images[0] ? (
              <Image
                src={images[0]}
                alt={title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-4xl text-ash/40">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="24" cy="28" r="16" opacity="0.2" />
                    <path
                      d="M20 18c0-4 2-7 4-9 2 2 4 5 4 9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                      opacity="0.3"
                    />
                  </svg>
                </span>
              </div>
            )}
            {distance !== undefined && (
              <div className="absolute top-3 right-3">
                <DistanceBadge meters={distance} />
              </div>
            )}
          </div>

          <div className="p-4 space-y-2">
            <h3 className="font-heading text-base font-bold text-charcoal line-clamp-1">
              {title}
            </h3>

            {sellerName && (
              <div className="flex items-center gap-2">
                <Avatar src={sellerAvatar} name={sellerName} size="sm" />
                <span className="text-sm font-body text-slate truncate">
                  {sellerName}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="font-heading text-lg font-bold text-turmeric">
                {formatPrice(price)}
              </span>
              <Badge variant="turmeric">
                {CATEGORY_DISPLAY_NAMES[category as FoodCategory] || category}
              </Badge>
            </div>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  );
}
