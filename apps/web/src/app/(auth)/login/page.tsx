"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSendOtp } from "@/hooks/use-auth";
import { useUIStore } from "@/store/ui-store";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const sendOtp = useSendOtp();
  const { addToast } = useUIStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullPhone = phone.startsWith("+") ? phone : `+91${phone}`;

    try {
      await sendOtp.mutateAsync({ phone: fullPhone });
      // Store phone for verify page
      if (typeof window !== "undefined") {
        sessionStorage.setItem("gharka_phone", fullPhone);
      }
      router.push("/verify");
    } catch (err) {
      addToast(
        err instanceof Error ? err.message : "Failed to send OTP",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-turmeric-light/30 via-white to-coriander-light/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <Link href="/">
            <span className="font-heading text-3xl font-extrabold text-turmeric">
              GharKa
            </span>
          </Link>
          <p className="mt-2 font-body text-slate text-sm">
            Your neighbor&apos;s kitchen, one tap away
          </p>
        </div>

        <div className="rounded-2xl bg-white shadow-lg border border-mist/30 p-6 space-y-6">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-turmeric-light mb-4">
              <Phone className="h-7 w-7 text-turmeric" />
            </div>
            <h1 className="font-heading text-xl font-bold text-charcoal">
              Log in with your phone
            </h1>
            <p className="text-sm font-body text-slate mt-1">
              We&apos;ll send a one-time code to verify your number
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <div className="flex h-11 items-center rounded-xl border border-mist bg-cloud px-3 text-sm font-body text-charcoal shrink-0">
                +91
              </div>
              <Input
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                maxLength={10}
                aria-label="Phone number"
                className="flex-1"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={sendOtp.isPending}
              disabled={phone.length < 10}
            >
              Send OTP
            </Button>
          </form>

          <p className="text-xs text-center font-body text-ash">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
