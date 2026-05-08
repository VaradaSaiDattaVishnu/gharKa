"use client";

import Image from "next/image";
import { cn, getInitials } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  blob?: boolean;
}

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-xl",
};

const imageSizeMap = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

export function Avatar({
  src,
  name,
  size = "md",
  className,
  blob = false,
}: AvatarProps) {
  const initials = getInitials(name || null);

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden bg-turmeric-light flex items-center justify-center font-heading font-bold text-turmeric-dark",
        blob ? "rounded-[40%_60%_55%_45%/55%_45%_60%_40%]" : "rounded-full",
        sizeMap[size],
        className
      )}
      role="img"
      aria-label={name ? `Avatar of ${name}` : "User avatar"}
    >
      {src ? (
        <Image
          src={src}
          alt={name || "User avatar"}
          width={imageSizeMap[size]}
          height={imageSizeMap[size]}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
