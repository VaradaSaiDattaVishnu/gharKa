"use client";

import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@gharka/shared";

const statusConfig: Record<
  string,
  { label: string; variant: "ash" | "turmeric" | "coriander" | "info" | "error" }
> = {
  [OrderStatus.PLACED]: { label: "Placed", variant: "ash" },
  [OrderStatus.CONFIRMED]: { label: "Confirmed", variant: "turmeric" },
  [OrderStatus.READY]: { label: "Ready", variant: "coriander" },
  [OrderStatus.PICKED_UP]: { label: "Picked Up", variant: "info" },
  [OrderStatus.COMPLETED]: { label: "Completed", variant: "coriander" },
  [OrderStatus.CANCELLED]: { label: "Cancelled", variant: "error" },
};

interface OrderStatusBadgeProps {
  status: string;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    variant: "ash" as const,
  };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
