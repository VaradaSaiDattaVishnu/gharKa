"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { ListingForm } from "@/components/listings/listing-form";
import { useCreateListing } from "@/hooks/use-listing";
import { useUIStore } from "@/store/ui-store";
import type { CreateListingInput } from "@gharka/shared";

export default function NewListingPage() {
  const router = useRouter();
  const createListing = useCreateListing();
  const { addToast } = useUIStore();

  const handleSubmit = async (data: CreateListingInput) => {
    try {
      await createListing.mutateAsync(data);
      addToast("Dish listed successfully!", "success");
      router.push("/sell");
    } catch (err) {
      addToast(
        err instanceof Error ? err.message : "Failed to create listing",
        "error"
      );
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm font-body text-slate hover:text-charcoal transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold text-charcoal">
            Add a new dish
          </h1>
          <p className="text-sm font-body text-slate mt-1">
            Share your homemade food with the community
          </p>
        </div>

        <ListingForm
          onSubmit={handleSubmit}
          isLoading={createListing.isPending}
        />
      </motion.div>
    </div>
  );
}
