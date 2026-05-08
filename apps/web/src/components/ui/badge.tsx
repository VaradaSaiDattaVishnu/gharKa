"use client";

import { type HTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium font-body transition-colors",
  {
    variants: {
      variant: {
        turmeric: "bg-turmeric-light text-turmeric-dark",
        coriander: "bg-coriander-light text-coriander-dark",
        terracotta: "bg-orange-50 text-terracotta",
        charcoal: "bg-mist text-charcoal",
        ash: "bg-cloud text-slate",
        error: "bg-red-50 text-error",
        warning: "bg-yellow-50 text-warning",
        info: "bg-blue-50 text-info",
      },
    },
    defaultVariants: {
      variant: "charcoal",
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, className }))}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
