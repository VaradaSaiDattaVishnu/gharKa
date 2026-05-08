"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CATEGORY_DISPLAY_NAMES, type FoodCategory } from "@gharka/shared";

const ALL_OPTION = "ALL" as const;
type FilterValue = typeof ALL_OPTION | FoodCategory;

interface CategoryFilterProps {
  selected: FilterValue;
  onSelect: (category: FilterValue) => void;
  className?: string;
}

const categories: { value: FilterValue; label: string }[] = [
  { value: ALL_OPTION, label: "All" },
  ...Object.entries(CATEGORY_DISPLAY_NAMES).map(([key, label]) => ({
    value: key as FoodCategory,
    label,
  })),
];

export function CategoryFilter({
  selected,
  onSelect,
  className,
}: CategoryFilterProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className={cn(
        "flex gap-2 overflow-x-auto scrollbar-hide py-2 px-1 -mx-1",
        className
      )}
      role="tablist"
      aria-label="Food categories"
    >
      {categories.map((cat) => {
        const isActive = selected === cat.value;
        return (
          <button
            key={cat.value}
            onClick={() => onSelect(cat.value)}
            className={cn(
              "relative shrink-0 rounded-full px-4 py-2 text-sm font-body font-medium transition-colors whitespace-nowrap",
              isActive
                ? "text-white"
                : "text-slate hover:text-charcoal hover:bg-mist/50"
            )}
            role="tab"
            aria-selected={isActive}
          >
            {isActive && (
              <motion.span
                layoutId="category-pill"
                className="absolute inset-0 rounded-full bg-turmeric"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export type { FilterValue };
