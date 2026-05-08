"use client";

import { useRouter, useParams } from "next/navigation";
import { ListingDetail } from "@/components/listings/listing-detail";
import { LoadingPot } from "@/components/shared/loading-pot";
import { useListing } from "@/hooks/use-listing";
import { useCreateOrder } from "@/hooks/use-orders";
import { useUIStore } from "@/store/ui-store";

export default function ListingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { data, isLoading, error } = useListing(id);
  const createOrder = useCreateOrder();
  const { addToast } = useUIStore();

  const handleRequest = async (quantity: number) => {
    try {
      await createOrder.mutateAsync({ listingId: id, quantity });
      addToast("Request sent! The cook will confirm shortly.", "success");
      router.push("/orders");
    } catch (err) {
      addToast(
        err instanceof Error ? err.message : "Failed to send request",
        "error"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingPot size="lg" />
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <p className="font-heading text-lg font-bold text-charcoal mb-2">
          Listing not found
        </p>
        <p className="text-sm font-body text-slate mb-4">
          This dish may have been removed or is no longer available.
        </p>
        <button
          onClick={() => router.back()}
          className="text-turmeric font-body font-medium hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  const listing = data.data;

  return (
    <ListingDetail
      id={listing.id}
      title={listing.title}
      description={listing.description}
      images={listing.images}
      price={listing.price}
      quantity={listing.quantity}
      availableQuantity={listing.availableQuantity}
      category={listing.category}
      distance={listing.distance}
      createdAt={listing.createdAt}
      seller={listing.seller}
      onBack={() => router.back()}
      onRequest={handleRequest}
      isRequesting={createOrder.isPending}
    />
  );
}
