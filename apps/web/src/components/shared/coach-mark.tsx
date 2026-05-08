"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useCoachMarks } from "@/hooks/use-coach-marks";
import { cn } from "@/lib/utils";

interface CoachMarkProps {
  id: string;
  text: string;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
  children: React.ReactNode;
}

export function CoachMark({
  id,
  text,
  position = "bottom",
  className,
  children,
}: CoachMarkProps) {
  const { shouldShow, dismiss } = useCoachMarks();
  const isVisible = shouldShow(id);

  const positionClasses = {
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2",
  };

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-charcoal",
    bottom:
      "bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-charcoal",
    left: "left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-charcoal",
    right:
      "right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-charcoal",
  };

  return (
    <div className={cn("relative inline-block", className)}>
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={cn(
              "absolute z-50 w-56",
              positionClasses[position]
            )}
          >
            <div className="relative rounded-xl bg-charcoal text-white px-4 py-3 shadow-lg">
              <div
                className={cn(
                  "absolute w-0 h-0 border-[6px]",
                  arrowClasses[position]
                )}
              />
              <p className="text-xs font-body leading-relaxed pr-5">{text}</p>
              <button
                onClick={() => dismiss(id)}
                className="absolute top-2 right-2 p-0.5 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Dismiss tip"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
