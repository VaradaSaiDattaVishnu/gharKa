"use client";

import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceLabel } from "@/lib/utils";

interface DistanceBadgeProps {
  meters: number;
  className?: string;
}

export function DistanceBadge({ meters, className }: DistanceBadgeProps) {
  const isNearby = meters < 1000;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium font-body",
        isNearby
          ? "bg-coriander-light text-coriander-dark"
          : "bg-cloud text-slate",
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          isNearby ? "bg-coriander" : "bg-ash"
        )}
      />
      <MapPin className="h-3 w-3" />
      {formatDistanceLabel(meters)}
    </span>
  );
}
