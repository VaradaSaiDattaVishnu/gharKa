"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { MapPin, RefreshCw } from "lucide-react";
import { CategoryFilter, type FilterValue } from "@/components/listings/category-filter";
import { ListingGrid } from "@/components/listings/listing-grid";
import { LocationPrompt } from "@/components/shared/location-prompt";
import { Button } from "@/components/ui/button";
import { useListings } from "@/hooks/use-listings";
import { useLocationStore } from "@/store/location-store";
import type { FoodCategory } from "@gharka/shared";

export default function FeedPage() {
  const [selectedCategory, setSelectedCategory] = useState<FilterValue>("ALL");
  const { hasPermission, address } = useLocationStore();

  const categoryParam =
    selectedCategory === "ALL" ? undefined : (selectedCategory as FoodCategory);
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } =
    useListings(categoryParam);

  const listings = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) =>
      page.data.map((listing) => ({
        id: listing.id,
        title: listing.title,
        images: listing.images,
        price: listing.price,
        category: listing.category,
        distance: listing.distance,
      }))
    );
  }, [data]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  if (!hasPermission) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LocationPrompt />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4">
      {/* Location indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4"
      >
        <div className="flex items-center gap-2 text-sm font-body text-slate">
          <MapPin className="h-4 w-4 text-coriander" />
          <span>
            Showing food within 5km
            {address && (
              <>
                {" "}of{" "}
                <span className="font-medium text-charcoal">{address}</span>
              </>
            )}
          </span>
        </div>
        <button
          onClick={handleRefresh}
          className="p-2 rounded-full hover:bg-mist/50 transition-colors"
          aria-label="Refresh listings"
        >
          <RefreshCw className="h-4 w-4 text-slate" />
        </button>
      </motion.div>

      {/* Category Filter */}
      <div className="sticky top-[72px] z-20 bg-cloud/80 backdrop-blur-sm -mx-4 px-4 sm:-mx-6 sm:px-6 py-2 mb-4">
        <CategoryFilter
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {/* Listings Grid */}
      <ListingGrid
        listings={listings}
        isLoading={isLoading}
        emptyMessage="No food nearby yet"
        emptyDescription="Be the first cook in your area! Start selling your homemade food."
        emptyActionLabel="Start Selling"
        onEmptyAction={() => (window.location.href = "/sell/new")}
      />

      {/* Load More */}
      {hasNextPage && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
          >
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}
