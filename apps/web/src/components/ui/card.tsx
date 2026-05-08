"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type CardMotionProps = HTMLMotionProps<"div">;

export interface CardProps extends Omit<CardMotionProps, "ref"> {
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-2xl bg-white border border-mist/50 shadow-sm",
          hover && "cursor-pointer",
          className
        )}
        whileHover={
          hover
            ? {
                y: -4,
                boxShadow:
                  "0 12px 24px -4px rgba(38, 50, 56, 0.08), 0 4px 8px -2px rgba(38, 50, 56, 0.04)",
              }
            : undefined
        }
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("px-5 pt-5 pb-2", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-5 py-3", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("px-5 pt-2 pb-5", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardContent, CardFooter };
