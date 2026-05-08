"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ChefHat, ShoppingBag, Utensils } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { OnboardingSlides } from "@/components/onboarding/onboarding-slides";
import { LocationPrompt } from "@/components/shared/location-prompt";
import { useOnboard } from "@/hooks/use-auth";
import { useLocationStore } from "@/store/location-store";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

type Step = "slides" | "profile" | "location";

export default function OnboardPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("slides");
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [role, setRole] = useState<"BUYER" | "SELLER" | null>(null);
  const onboard = useOnboard();
  const { hasPermission } = useLocationStore();
  const { addToast } = useUIStore();

  const handleSlidesComplete = () => setStep("profile");

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role) return;

    try {
      await onboard.mutateAsync({
        name: name.trim(),
        role,
        ...(avatarUrl ? { avatarUrl } : {}),
      });
      setStep("location");
    } catch (err) {
      addToast(
        err instanceof Error ? err.message : "Something went wrong",
        "error"
      );
    }
  };

  const handleFinish = () => {
    router.push("/feed");
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {step === "slides" && (
          <motion.div
            key="slides"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <OnboardingSlides onComplete={handleSlidesComplete} />
          </motion.div>
        )}

        {step === "profile" && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-turmeric-light/20 via-white to-coriander-light/10"
          >
            <div className="w-full max-w-sm space-y-8">
              <div className="text-center">
                <h1 className="font-heading text-2xl font-bold text-charcoal">
                  Set up your profile
                </h1>
                <p className="text-sm font-body text-slate mt-1">
                  Tell us a little about yourself
                </p>
              </div>

              <form
                onSubmit={handleProfileSubmit}
                className="space-y-6 rounded-2xl bg-white shadow-lg border border-mist/30 p-6"
              >
                {/* Avatar */}
                <div className="flex justify-center">
                  <div className="relative">
                    <Avatar
                      src={avatarUrl}
                      name={name}
                      size="xl"
                      blob
                    />
                    <label className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-turmeric text-white shadow-md hover:bg-turmeric-dark transition-colors">
                      <Camera className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setAvatarUrl(URL.createObjectURL(file));
                          }
                        }}
                        aria-label="Upload avatar"
                      />
                    </label>
                  </div>
                </div>

                <Input
                  label="Your name"
                  placeholder="What should we call you?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                {/* Role Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium font-body text-charcoal">
                    I want to...
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        value: "BUYER" as const,
                        label: "Buy Food",
                        icon: ShoppingBag,
                        desc: "Discover meals",
                      },
                      {
                        value: "SELLER" as const,
                        label: "Sell Food",
                        icon: ChefHat,
                        desc: "Share my cooking",
                      },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setRole(option.value)}
                        className={cn(
                          "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
                          role === option.value
                            ? "border-turmeric bg-turmeric-light/30"
                            : "border-mist hover:border-ash"
                        )}
                      >
                        <option.icon
                          className={cn(
                            "h-8 w-8",
                            role === option.value
                              ? "text-turmeric"
                              : "text-ash"
                          )}
                        />
                        <span className="font-heading font-bold text-sm text-charcoal">
                          {option.label}
                        </span>
                        <span className="text-xs font-body text-slate">
                          {option.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-center font-body text-ash mt-1">
                    You can always switch roles later
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  isLoading={onboard.isPending}
                  disabled={!name.trim() || !role}
                >
                  <Utensils className="mr-2 h-5 w-5" />
                  Let&apos;s go!
                </Button>
              </form>
            </div>
          </motion.div>
        )}

        {step === "location" && (
          <motion.div
            key="location"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="min-h-screen flex flex-col items-center justify-center px-4 gap-6 bg-gradient-to-br from-turmeric-light/20 via-white to-coriander-light/10"
          >
            <LocationPrompt />
            <Button
              variant={hasPermission ? "primary" : "ghost"}
              onClick={handleFinish}
              className="mt-4"
            >
              {hasPermission ? "Continue to GharKa" : "Skip for now"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
