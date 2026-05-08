"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const slides = [
  {
    title: "Discover homemade food near you",
    description:
      "Browse delicious home-cooked meals made by talented cooks in your gated community.",
    bgClass: "bg-gradient-to-br from-turmeric-light to-white",
    iconColor: "text-turmeric",
  },
  {
    title: "Connect with neighborhood cooks",
    description:
      "Chat directly with cooks, request their dishes, and arrange convenient pickup times.",
    bgClass: "bg-gradient-to-br from-coriander-light to-white",
    iconColor: "text-coriander",
  },
  {
    title: "Simple & honest. No payments in app.",
    description:
      "GharKa just connects you. Payments are arranged directly between neighbors. No commissions, no hidden fees.",
    bgClass: "bg-gradient-to-br from-orange-50 to-white",
    iconColor: "text-terracotta",
  },
];

interface OnboardingSlidesProps {
  onComplete: () => void;
}

export function OnboardingSlides({ onComplete }: OnboardingSlidesProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const next = () => {
    if (currentSlide < slides.length - 1) {
      goTo(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const prev = () => {
    if (currentSlide > 0) {
      goTo(currentSlide - 1);
    }
  };

  const slide = slides[currentSlide];

  return (
    <div className={cn("min-h-screen flex flex-col", slide.bgClass)}>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center text-center max-w-md"
          >
            {/* Illustration Placeholder */}
            <div
              className={cn(
                "mb-8 h-48 w-48 rounded-full flex items-center justify-center",
                currentSlide === 0
                  ? "bg-turmeric/10"
                  : currentSlide === 1
                    ? "bg-coriander/10"
                    : "bg-terracotta/10"
              )}
            >
              <svg
                width="96"
                height="96"
                viewBox="0 0 96 96"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={slide.iconColor}
              >
                {currentSlide === 0 && (
                  <>
                    <circle
                      cx="48"
                      cy="52"
                      r="30"
                      fill="currentColor"
                      opacity="0.15"
                    />
                    <circle
                      cx="48"
                      cy="52"
                      r="22"
                      fill="currentColor"
                      opacity="0.1"
                    />
                    <path
                      d="M40 40 C40 28, 44 22, 48 16 C52 22, 56 28, 56 40"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      opacity="0.4"
                    />
                  </>
                )}
                {currentSlide === 1 && (
                  <>
                    <circle
                      cx="32"
                      cy="48"
                      r="18"
                      fill="currentColor"
                      opacity="0.12"
                    />
                    <circle
                      cx="64"
                      cy="48"
                      r="18"
                      fill="currentColor"
                      opacity="0.12"
                    />
                    <path
                      d="M38 48 L58 48"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      opacity="0.4"
                    />
                  </>
                )}
                {currentSlide === 2 && (
                  <>
                    <rect
                      x="20"
                      y="30"
                      width="56"
                      height="36"
                      rx="8"
                      fill="currentColor"
                      opacity="0.1"
                    />
                    <path
                      d="M36 48 L44 56 L60 40"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.5"
                    />
                  </>
                )}
              </svg>
            </div>

            <h2 className="font-heading text-2xl font-bold text-charcoal mb-3">
              {slide.title}
            </h2>
            <p className="font-body text-slate text-base leading-relaxed">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="px-6 pb-12 space-y-6">
        {/* Dots */}
        <div className="flex items-center justify-center gap-2" role="tablist">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === currentSlide
                  ? "w-6 bg-turmeric"
                  : "w-2 bg-ash/40"
              )}
              role="tab"
              aria-selected={i === currentSlide}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          {currentSlide > 0 ? (
            <Button variant="ghost" onClick={prev} size="md">
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back
            </Button>
          ) : (
            <Button
              variant="link"
              onClick={onComplete}
              size="md"
              className="text-slate"
            >
              Skip
            </Button>
          )}
          <Button variant="primary" onClick={next} size="md">
            {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
            {currentSlide < slides.length - 1 && (
              <ChevronRight className="h-5 w-5 ml-1" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
