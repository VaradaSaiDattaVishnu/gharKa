"use client";

import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl font-body font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-turmeric text-white hover:bg-turmeric-dark shadow-md shadow-turmeric/20",
        secondary: "bg-coriander text-white hover:bg-coriander-dark shadow-md shadow-coriander/20",
        ghost: "text-charcoal hover:bg-mist",
        outline: "border-2 border-turmeric text-turmeric hover:bg-turmeric-light",
        danger: "bg-error text-white hover:bg-red-800",
        link: "text-turmeric underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-4 text-sm rounded-lg",
        md: "h-11 px-6 text-base",
        lg: "h-13 px-8 text-lg rounded-2xl",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

type MotionButtonProps = HTMLMotionProps<"button">;

export interface ButtonProps
  extends Omit<MotionButtonProps, "ref">,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
