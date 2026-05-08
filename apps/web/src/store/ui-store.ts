import { create } from "zustand";

export type ToastVariant = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
}

interface UIState {
  toasts: Toast[];
  mobileNavVisible: boolean;
  onboardingCompleted: boolean;
  addToast: (
    message: string,
    variant?: ToastVariant,
    duration?: number
  ) => void;
  removeToast: (id: string) => void;
  setMobileNavVisible: (visible: boolean) => void;
  setOnboardingCompleted: (completed: boolean) => void;
}

let toastCounter = 0;

export const useUIStore = create<UIState>()((set) => ({
  toasts: [],
  mobileNavVisible: true,
  onboardingCompleted: false,

  addToast: (message, variant = "info", duration = 4000) => {
    const id = `toast-${++toastCounter}`;
    set((state) => ({
      toasts: [...state.toasts, { id, message, variant, duration }],
    }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  setMobileNavVisible: (visible) => set({ mobileNavVisible: visible }),

  setOnboardingCompleted: (completed) =>
    set({ onboardingCompleted: completed }),
}));
