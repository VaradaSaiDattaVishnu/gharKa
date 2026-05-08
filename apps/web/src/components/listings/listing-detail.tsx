"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Minus, Plus, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DistanceBadge } from "./distance-badge";
import { Dialog } from "@/components/ui/dialog";
import { formatPrice, formatTimeAgo } from "@/lib/utils";
import { CATEGORY_DISPLAY_NAMES, type FoodCategory } from "@gharka/shared";

interface Seller {
  id: string;
  name: string;
  avatarUrl: string | null;
}

interface ListingDetailProps {
  id: string;
  title: string;
  description: string | null;
  images: string[];
  price: number;
  quantity: number;
  availableQuantity: number;
  category: string;
  distance?: number;
  createdAt: string;
  seller?: Seller;
  onBack: () => void;
  onRequest: (quantity: number) => void;
  isRequesting?: boolean;
}

export function ListingDetail({
  title,
  description,
  images,
  price,
  availableQuantity,
  category,
  distance,
  createdAt,
  seller,
  onBack,
  onRequest,
  isRequesting,
}: ListingDetailProps) {
  const [orderQty, setOrderQty] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white"
    >
      {/* Parallax Header Image */}
      <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden bg-cloud">
        {images[0] ? (
          <Image
            src={images[0]}
            alt={title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="h-full bg-gradient-to-br from-turmeric-light to-coriander-light" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <button
          onClick={onBack}
          className="absolute top-4 left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-charcoal" />
        </button>
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 -mt-6 relative z-10">
        {/* Main Content Card */}
        <div className="rounded-2xl bg-white shadow-lg border border-mist/30 p-6 space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="font-heading text-2xl font-bold text-charcoal">
                {title}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="turmeric">
                  {CATEGORY_DISPLAY_NAMES[category as FoodCategory] || category}
                </Badge>
                {distance !== undefined && <DistanceBadge meters={distance} />}
              </div>
            </div>
            <span className="font-heading text-2xl font-bold text-turmeric shrink-0">
              {formatPrice(price)}
            </span>
          </div>

          {description && (
            <p className="text-sm font-body text-slate leading-relaxed">
              {description}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm text-slate font-body">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatTimeAgo(createdAt)}
            </span>
            <span className="text-coriander font-medium">
              {availableQuantity} available
            </span>
          </div>

          {/* Seller Card */}
          {seller && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-cloud/50 border border-mist/30">
              <Avatar
                src={seller.avatarUrl}
                name={seller.name}
                size="lg"
                blob
              />
              <div>
                <p className="font-heading font-bold text-charcoal">
                  {seller.name}
                </p>
                <p className="text-xs font-body text-slate flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Neighbor cook
                </p>
              </div>
            </div>
          )}

          {/* Request Button */}
          {availableQuantity > 0 && (
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => setShowConfirm(true)}
            >
              Request This Dish
            </Button>
          )}

          <p className="text-xs text-center font-body text-ash">
            Arrange payment directly with the cook
          </p>
        </div>
      </div>

      {/* Confirm Dialog */}
      <Dialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Request this dish"
      >
        <div className="space-y-5">
          <div className="text-center">
            <p className="font-heading font-bold text-charcoal text-lg">
              {title}
            </p>
            <p className="text-sm text-slate font-body">
              {formatPrice(price)} per serving
            </p>
          </div>

          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => setOrderQty(Math.max(1, orderQty - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-mist hover:bg-cloud transition-colors"
              disabled={orderQty <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="font-heading text-3xl font-bold text-charcoal min-w-[3ch] text-center">
              {orderQty}
            </span>
            <button
              onClick={() =>
                setOrderQty(Math.min(availableQuantity, orderQty + 1))
              }
              className="flex h-10 w-10 items-center justify-center rounded-full border border-mist hover:bg-cloud transition-colors"
              disabled={orderQty >= availableQuantity}
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="text-center p-3 rounded-xl bg-turmeric-light">
            <p className="text-sm font-body text-turmeric-dark">
              Total:{" "}
              <span className="font-heading font-bold text-lg">
                {formatPrice(price * orderQty)}
              </span>
            </p>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => {
              onRequest(orderQty);
              setShowConfirm(false);
            }}
            isLoading={isRequesting}
          >
            Confirm Request
          </Button>

          <p className="text-xs text-center font-body text-ash">
            The cook will confirm your request. Payment is arranged directly.
          </p>
        </div>
      </Dialog>
    </motion.div>
  );
}
