"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { ListingCardSkeleton } from "@/components/ui/skeleton";
import { useAllListings } from "@/hooks/use-listings";
import { useDeleteListing } from "@/hooks/use-listing";
import { useUIStore } from "@/store/ui-store";
import { formatPrice } from "@/lib/utils";
import { CATEGORY_DISPLAY_NAMES, type FoodCategory } from "@gharka/shared";

export default function AdminListingsPage() {
  const { data, isLoading } = useAllListings();
  const deleteListing = useDeleteListing();
  const { addToast } = useUIStore();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const listings = data?.data || [];

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteListing.mutateAsync(deleteTarget);
      addToast("Listing removed", "success");
      setDeleteTarget(null);
    } catch {
      addToast("Failed to remove listing", "error");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6">
      <Link
        href="/admin"
        className="flex items-center gap-1.5 text-sm font-body text-slate hover:text-charcoal transition-colors mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <h1 className="font-heading text-2xl font-bold text-charcoal mb-6">
        All Listings
      </h1>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <EmptyState
          title="No listings yet"
          description="No food listings have been created."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {listings.map((listing, i) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card className="overflow-hidden">
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
                    <div className="h-full flex items-center justify-center text-ash/30">
                      No image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-heading font-bold text-sm text-charcoal">
                        {listing.title}
                      </h3>
                      <Badge variant="turmeric" className="mt-1">
                        {CATEGORY_DISPLAY_NAMES[
                          listing.category as FoodCategory
                        ] || listing.category}
                      </Badge>
                    </div>
                    <span className="font-heading font-bold text-turmeric">
                      {formatPrice(listing.price)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <Badge variant={listing.isActive ? "coriander" : "ash"}>
                      {listing.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-error hover:bg-red-50"
                      onClick={() => setDeleteTarget(listing.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Remove Listing"
      >
        <div className="space-y-4">
          <p className="text-sm font-body text-slate">
            Are you sure you want to remove this listing? This action cannot be
            undone.
          </p>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={handleDelete}
              isLoading={deleteListing.isPending}
            >
              Remove
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
