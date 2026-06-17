"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVerifyOtp } from "@/hooks/use-auth";
import { sendOtp as firebaseResendOtp, setupRecaptcha } from "@/lib/firebase";
import { useUIStore } from "@/store/ui-store";

export default function VerifyPage() {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [resendTimer, setResendTimer] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const verifyOtp = useVerifyOtp();
  const { addToast } = useUIStore();

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleVerify = useCallback(
    async (code: string) => {
      try {
        const res = await verifyOtp.mutateAsync({ code });
        addToast("Verified successfully!", "success");
        // Decide routing from the fresh server response, not a stale store value:
        // returning users who already have a profile skip onboarding.
        const { isNew, user } = res.data;
        if (!isNew && user.name) {
          router.push("/feed");
        } else {
          router.push("/onboard");
        }
      } catch (err) {
        addToast(
          err instanceof Error ? err.message : "Verification failed",
          "error"
        );
        setOtp(Array(6).fill(""));
        inputRefs.current[0]?.focus();
      }
    },
    [verifyOtp, router, addToast]
  );

  const handleInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    const fullCode = newOtp.join("");
    if (fullCode.length === 6) {
      handleVerify(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      const newOtp = pasted.split("");
      setOtp(newOtp);
      handleVerify(pasted);
    }
  };

  const handleResend = async () => {
    const phone = sessionStorage.getItem("gharka_phone");
    if (!phone) {
      router.push("/login");
      return;
    }
    setIsResending(true);
    try {
      setupRecaptcha("resend-otp-btn");
      await firebaseResendOtp(phone);
      setResendTimer(30);
      addToast("OTP resent!", "info");
    } catch {
      addToast("Failed to resend OTP", "error");
    } finally {
      setIsResending(false);
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
        </div>

        <div className="rounded-2xl bg-white shadow-lg border border-mist/30 p-6 space-y-6">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-coriander-light mb-4">
              <ShieldCheck className="h-7 w-7 text-coriander" />
            </div>
            <h1 className="font-heading text-xl font-bold text-charcoal">
              Verify your number
            </h1>
            <p className="text-sm font-body text-slate mt-1">
              Enter the 6-digit code we sent to your phone
            </p>
          </div>

          <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInput(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="h-12 w-10 rounded-xl border border-mist bg-cloud text-center font-heading text-xl font-bold text-charcoal focus:outline-none focus:ring-2 focus:ring-turmeric/40 focus:border-turmeric transition-all"
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>

          {verifyOtp.isPending && (
            <p className="text-center text-sm font-body text-turmeric">
              Verifying...
            </p>
          )}

          <div className="text-center">
            {resendTimer > 0 ? (
              <p className="text-sm font-body text-ash">
                Resend code in{" "}
                <span className="font-medium text-charcoal">
                  {resendTimer}s
                </span>
              </p>
            ) : (
              <Button
                id="resend-otp-btn"
                variant="link"
                size="sm"
                onClick={handleResend}
                isLoading={isResending}
              >
                Resend OTP
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
