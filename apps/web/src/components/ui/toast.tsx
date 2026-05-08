"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { useUIStore, type Toast as ToastType } from "@/store/ui-store";
import { cn } from "@/lib/utils";

const variantStyles: Record<
  ToastType["variant"],
  { bg: string; icon: typeof CheckCircle2; iconColor: string }
> = {
  success: {
    bg: "bg-coriander-light border-coriander",
    icon: CheckCircle2,
    iconColor: "text-coriander",
  },
  error: {
    bg: "bg-red-50 border-error",
    icon: AlertCircle,
    iconColor: "text-error",
  },
  warning: {
    bg: "bg-yellow-50 border-warning",
    icon: AlertTriangle,
    iconColor: "text-warning",
  },
  info: {
    bg: "bg-blue-50 border-info",
    icon: Info,
    iconColor: "text-info",
  },
};

function ToastItem({ toast }: { toast: ToastType }) {
  const { removeToast } = useUIStore();
  const style = variantStyles[toast.variant];
  const Icon = style.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm",
        style.bg
      )}
      role="alert"
    >
      <Icon className={cn("h-5 w-5 shrink-0", style.iconColor)} />
      <p className="flex-1 text-sm font-body text-charcoal">{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className="shrink-0 rounded-full p-1 hover:bg-black/5 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4 text-slate" />
      </button>
    </motion.div>
  );
}

export function ToastContainer() {
  const { toasts } = useUIStore();

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-live="polite"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
