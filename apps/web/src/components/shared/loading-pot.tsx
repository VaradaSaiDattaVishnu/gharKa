"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingPotProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { pot: 48, viewBox: "0 0 64 64" },
  md: { pot: 80, viewBox: "0 0 80 80" },
  lg: { pot: 120, viewBox: "0 0 120 120" },
};

export function LoadingPot({ className, size = "md" }: LoadingPotProps) {
  const { pot, viewBox } = sizeMap[size];

  return (
    <div
      className={cn("flex flex-col items-center justify-center", className)}
      role="status"
      aria-label="Loading"
    >
      <svg
        width={pot}
        height={pot}
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Steam wisps */}
        {[0, 1, 2].map((i) => (
          <motion.path
            key={i}
            d={
              size === "lg"
                ? `M${50 + i * 10} 38 C${48 + i * 10} 28, ${52 + i * 10} 22, ${50 + i * 10} 12`
                : size === "md"
                  ? `M${32 + i * 8} 28 C${30 + i * 8} 20, ${34 + i * 8} 16, ${32 + i * 8} 8`
                  : `M${25 + i * 7} 22 C${23 + i * 7} 16, ${27 + i * 7} 12, ${25 + i * 7} 6`
            }
            stroke="#90A4AE"
            strokeWidth={size === "lg" ? 2 : 1.5}
            strokeLinecap="round"
            fill="none"
            initial={{ opacity: 0, pathLength: 0, y: 0 }}
            animate={{
              opacity: [0, 0.6, 0],
              pathLength: [0, 1, 1],
              y: [0, -8, -16],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Pot body */}
        {size === "lg" ? (
          <>
            <rect
              x="30"
              y="50"
              width="60"
              height="40"
              rx="8"
              fill="#E8913A"
            />
            <rect
              x="26"
              y="44"
              width="68"
              height="10"
              rx="5"
              fill="#C47425"
            />
            <rect x="22" y="62" width="8" height="8" rx="4" fill="#C47425" />
            <rect x="90" y="62" width="8" height="8" rx="4" fill="#C47425" />
          </>
        ) : size === "md" ? (
          <>
            <rect
              x="20"
              y="38"
              width="40"
              height="28"
              rx="6"
              fill="#E8913A"
            />
            <rect
              x="17"
              y="33"
              width="46"
              height="8"
              rx="4"
              fill="#C47425"
            />
            <rect x="14" y="46" width="6" height="6" rx="3" fill="#C47425" />
            <rect x="60" y="46" width="6" height="6" rx="3" fill="#C47425" />
          </>
        ) : (
          <>
            <rect
              x="16"
              y="30"
              width="32"
              height="22"
              rx="5"
              fill="#E8913A"
            />
            <rect
              x="13"
              y="26"
              width="38"
              height="6"
              rx="3"
              fill="#C47425"
            />
            <rect x="10" y="36" width="5" height="5" rx="2.5" fill="#C47425" />
            <rect x="49" y="36" width="5" height="5" rx="2.5" fill="#C47425" />
          </>
        )}
      </svg>
      <motion.p
        className="text-sm font-body text-ash mt-2"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Cooking up something...
      </motion.p>
    </div>
  );
}
