"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { cn } from "@/lib/utils";
import { HeroScene } from "./hero-scene";

interface CanvasWrapperProps {
  className?: string;
}

function CanvasInner({ className }: CanvasWrapperProps) {
  return (
    <div className={cn("relative w-full h-full", className)}>
      <Canvas
        camera={{ position: [0, 2, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </Canvas>
    </div>
  );
}

export function HeroCanvas({ className }: CanvasWrapperProps) {
  // Check for reduced motion preference
  if (typeof window !== "undefined") {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      return <HeroFallback className={className} />;
    }
  }

  return <CanvasInner className={className} />;
}

export function HeroFallback({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative w-full h-full flex items-center justify-center bg-gradient-to-br from-turmeric-light via-white to-coriander-light",
        className
      )}
    >
      <div className="text-8xl animate-float select-none" aria-hidden="true">
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="60" cy="65" r="45" fill="#D4A574" opacity="0.3" />
          <circle cx="60" cy="65" r="40" fill="#E8913A" opacity="0.2" />
          <circle cx="60" cy="65" r="30" fill="#C47425" opacity="0.15" />
          <path
            d="M50 45 C50 35, 55 30, 60 25 C65 30, 70 35, 70 45"
            stroke="#90A4AE"
            strokeWidth="2"
            fill="none"
            opacity="0.4"
          />
          <path
            d="M55 50 C55 40, 58 35, 60 30 C62 35, 65 40, 65 50"
            stroke="#90A4AE"
            strokeWidth="1.5"
            fill="none"
            opacity="0.3"
          />
        </svg>
      </div>
    </div>
  );
}
