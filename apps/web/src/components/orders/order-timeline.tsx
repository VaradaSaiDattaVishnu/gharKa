"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { OrderStatus } from "@gharka/shared";

const steps = [
  { status: OrderStatus.PLACED, label: "Placed" },
  { status: OrderStatus.CONFIRMED, label: "Confirmed" },
  { status: OrderStatus.READY, label: "Ready" },
  { status: OrderStatus.PICKED_UP, label: "Picked Up" },
  { status: OrderStatus.COMPLETED, label: "Completed" },
];

const statusOrder: Record<string, number> = {
  [OrderStatus.PLACED]: 0,
  [OrderStatus.CONFIRMED]: 1,
  [OrderStatus.READY]: 2,
  [OrderStatus.PICKED_UP]: 3,
  [OrderStatus.COMPLETED]: 4,
  [OrderStatus.CANCELLED]: -1,
};

interface OrderTimelineProps {
  currentStatus: string;
  className?: string;
}

export function OrderTimeline({ currentStatus, className }: OrderTimelineProps) {
  const currentIndex = statusOrder[currentStatus] ?? -1;
  const isCancelled = currentStatus === OrderStatus.CANCELLED;

  if (isCancelled) {
    return (
      <div className={cn("flex items-center justify-center py-4", className)}>
        <span className="text-sm font-body text-error font-medium">
          This order was cancelled
        </span>
      </div>
    );
  }

  return (
    <div className={cn("py-4", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.status} className="flex flex-col items-center flex-1">
              <div className="relative flex items-center w-full">
                {index > 0 && (
                  <div
                    className={cn(
                      "absolute left-0 right-1/2 top-1/2 -translate-y-1/2 h-0.5",
                      index <= currentIndex ? "bg-coriander" : "bg-mist"
                    )}
                  />
                )}
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "absolute left-1/2 right-0 top-1/2 -translate-y-1/2 h-0.5",
                      index < currentIndex ? "bg-coriander" : "bg-mist"
                    )}
                  />
                )}
                <div
                  className={cn(
                    "relative z-10 mx-auto flex h-8 w-8 items-center justify-center rounded-full transition-all",
                    isCompleted
                      ? "bg-coriander text-white"
                      : "bg-mist text-ash",
                    isCurrent && "ring-4 ring-coriander/20"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-current" />
                  )}
                </div>
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-body text-center",
                  isCurrent
                    ? "font-semibold text-coriander"
                    : isCompleted
                      ? "text-charcoal"
                      : "text-ash"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
