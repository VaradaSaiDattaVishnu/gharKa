"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBag, ChefHat } from "lucide-react";
import { OrderCard } from "@/components/orders/order-card";
import { OrderTimeline } from "@/components/orders/order-timeline";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { OrderCardSkeleton } from "@/components/ui/skeleton";
import { useOrders, type OrderWithDetails } from "@/hooks/use-orders";
import { useUpdateOrderStatus } from "@/hooks/use-orders";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";
import { OrderStatus, canTransition, ORDER_STATUS_TRANSITIONS } from "@gharka/shared";

type Tab = "buyer" | "seller";

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<Tab>("buyer");
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(
    null
  );
  const { user } = useAuthStore();
  const { addToast } = useUIStore();
  const router = useRouter();

  const { data, isLoading } = useOrders(activeTab);
  const orders = data?.data || [];

  const updateStatus = useUpdateOrderStatus(selectedOrder?.id || "");

  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedOrder) return;
    try {
      await updateStatus.mutateAsync({ status: newStatus as OrderStatus });
      addToast(`Order ${newStatus.toLowerCase()}!`, "success");
      setSelectedOrder(null);
    } catch (err) {
      addToast(
        err instanceof Error ? err.message : "Failed to update",
        "error"
      );
    }
  };

  const nextStatuses = selectedOrder
    ? ORDER_STATUS_TRANSITIONS[selectedOrder.status as OrderStatus] || []
    : [];

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-6">
      <h1 className="font-heading text-2xl font-bold text-charcoal mb-6">
        Orders
      </h1>

      {/* Tab Switch */}
      <div className="flex rounded-xl bg-cloud p-1 mb-6" role="tablist">
        {[
          { key: "buyer" as Tab, label: "As Buyer", icon: ShoppingBag },
          { key: "seller" as Tab, label: "As Seller", icon: ChefHat },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "relative flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-body font-medium transition-colors",
              activeTab === tab.key ? "text-charcoal" : "text-ash"
            )}
            role="tab"
            aria-selected={activeTab === tab.key}
          >
            {activeTab === tab.key && (
              <motion.div
                layoutId="order-tab"
                className="absolute inset-0 rounded-lg bg-white shadow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <tab.icon className="relative z-10 h-4 w-4" />
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Order List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <OrderCardSkeleton key={i} />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={
            activeTab === "buyer" ? (
              <ShoppingBag className="h-16 w-16" />
            ) : (
              <ChefHat className="h-16 w-16" />
            )
          }
          title={
            activeTab === "buyer"
              ? "No orders yet"
              : "No orders received yet"
          }
          description={
            activeTab === "buyer"
              ? "Browse food near you and place your first order!"
              : "Once buyers request your dishes, orders will appear here."
          }
          actionLabel={activeTab === "buyer" ? "Browse Food" : undefined}
          onAction={
            activeTab === "buyer" ? () => router.push("/feed") : undefined
          }
        />
      ) : (
        <div className="space-y-3">
          {orders.map((order, index) => (
            <OrderCard
              key={order.id}
              id={order.id}
              status={order.status}
              quantity={order.quantity}
              createdAt={order.createdAt}
              listing={order.listing}
              otherUser={activeTab === "buyer" ? order.seller : order.buyer}
              otherUserRole={activeTab === "buyer" ? "cook" : "buyer"}
              onClick={() => setSelectedOrder(order)}
              index={index}
            />
          ))}
        </div>
      )}

      {/* Order Detail Sheet */}
      <BottomSheet
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title="Order Details"
      >
        {selectedOrder && (
          <div className="space-y-5">
            <div>
              <h3 className="font-heading font-bold text-charcoal">
                {selectedOrder.listing?.title || "Dish"}
              </h3>
              <p className="text-sm font-body text-slate">
                Qty: {selectedOrder.quantity}
              </p>
            </div>

            <OrderTimeline currentStatus={selectedOrder.status} />

            {nextStatuses.length > 0 && activeTab === "seller" && (
              <div className="flex gap-2">
                {nextStatuses.map((status) => (
                  <Button
                    key={status}
                    variant={
                      status === OrderStatus.CANCELLED ? "danger" : "primary"
                    }
                    size="sm"
                    onClick={() => handleStatusUpdate(status)}
                    isLoading={updateStatus.isPending}
                    className="flex-1"
                  >
                    {status === OrderStatus.CANCELLED
                      ? "Cancel"
                      : `Mark ${status.replace("_", " ").toLowerCase()}`}
                  </Button>
                ))}
              </div>
            )}

            <Button
              variant="outline"
              size="md"
              className="w-full"
              onClick={() => {
                router.push(`/chat/${selectedOrder.id}`);
                setSelectedOrder(null);
              }}
            >
              Open Chat
            </Button>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
