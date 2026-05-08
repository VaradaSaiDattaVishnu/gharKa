"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, Eye, EyeOff, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ListingCardSkeleton } from "@/components/ui/skeleton";
import { useMyListings } from "@/hooks/use-listings";
import { useUpdateListing } from "@/hooks/use-listing";
import { formatPrice } from "@/lib/utils";
import { CATEGORY_DISPLAY_NAMES, type FoodCategory } from "@gharka/shared";

export default function SellPage() {
  const { data, isLoading } = useMyListings();
  const listings = data?.data || [];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-charcoal">
            My Listings
          </h1>
          <p className="text-sm font-body text-slate mt-1">
            Manage your dishes and track orders
          </p>
        </div>
        <Link href="/sell/new">
          <Button variant="primary" size="md">
            <Plus className="h-5 w-5 mr-1" />
            Add Dish
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <EmptyState
          icon={<Package className="h-16 w-16" />}
          title="No dishes yet"
          description="Start sharing your homemade food with the community!"
          actionLabel="Add Your First Dish"
          onAction={() => (window.location.href = "/sell/new")}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {listings.map((listing, index) => (
            <SellerListingCard
              key={listing.id}
              listing={listing}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SellerListingCard({
  listing,
  index,
}: {
  listing: {
    id: string;
    title: string;
    images: string[];
    price: number;
    category: string;
    isActive: boolean;
    availableQuantity: number;
  };
  index: number;
}) {
  const [isActive, setIsActive] = useState(listing.isActive);
  const updateListing = useUpdateListing(listing.id);

  const toggleActive = async () => {
    const newState = !isActive;
    setIsActive(newState);
    // The API would have a toggle endpoint; we simulate with update
    try {
      // This would be a proper API call
      await updateListing.mutateAsync({});
    } catch {
      setIsActive(!newState);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="rounded-2xl bg-white border border-mist/50 shadow-sm overflow-hidden"
    >
      <div className="relative aspect-[3/2] bg-cloud">
        {listing.images[0] ? (
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-ash/40">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="currentColor">
              <circle cx="24" cy="28" r="16" opacity="0.2" />
            </svg>
          </div>
        )}
        {!isActive && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <Badge variant="ash">Inactive</Badge>
          </div>
        )}
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-heading text-base font-bold text-charcoal">
              {listing.title}
            </h3>
            <Badge variant="turmeric" className="mt-1">
              {CATEGORY_DISPLAY_NAMES[listing.category as FoodCategory] ||
                listing.category}
            </Badge>
          </div>
          <span className="font-heading font-bold text-turmeric">
            {formatPrice(listing.price)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-body text-slate">
            {listing.availableQuantity} left
          </span>
          <button
            onClick={toggleActive}
            className="flex items-center gap-1.5 text-xs font-body font-medium text-slate hover:text-charcoal transition-colors"
            aria-label={isActive ? "Deactivate listing" : "Activate listing"}
          >
            {isActive ? (
              <>
                <Eye className="h-4 w-4" /> Active
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4" /> Inactive
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
