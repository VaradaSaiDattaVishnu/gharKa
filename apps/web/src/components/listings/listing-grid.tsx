"use client";

import { cn } from "@/lib/utils";
import { ListingCard } from "./listing-card";
import { ListingCardSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { UtensilsCrossed } from "lucide-react";

interface ListingItem {
  id: string;
  title: string;
  images: string[];
  price: number;
  category: string;
  distance?: number;
  seller?: {
    name: string;
    avatarUrl: string | null;
  };
}

interface ListingGridProps {
  listings: ListingItem[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  onEmptyAction?: () => void;
  emptyActionLabel?: string;
  className?: string;
}

export function ListingGrid({
  listings,
  isLoading,
  emptyMessage = "No food nearby yet",
  emptyDescription = "Be the first cook in your area!",
  onEmptyAction,
  emptyActionLabel,
  className,
}: ListingGridProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6",
          className
        )}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <ListingCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!listings.length) {
    return (
      <EmptyState
        icon={<UtensilsCrossed className="h-16 w-16" />}
        title={emptyMessage}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6",
        className
      )}
    >
      {listings.map((listing, index) => (
        <ListingCard
          key={listing.id}
          id={listing.id}
          title={listing.title}
          images={listing.images}
          price={listing.price}
          category={listing.category}
          sellerName={listing.seller?.name}
          sellerAvatar={listing.seller?.avatarUrl}
          distance={listing.distance}
          index={index}
        />
      ))}
    </div>
  );
}
