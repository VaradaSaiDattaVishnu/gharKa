import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface UIState {
  toasts: ToastItem[];
  onboardingCompleted: boolean;

  addToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
  setOnboardingCompleted: (completed: boolean) => void;
}

let toastCounter = 0;

export const useUIStore = create<UIState>((set) => ({
  toasts: [],
  onboardingCompleted: false,

  addToast: (type, message, duration = 3000) => {
    const id = `toast-${++toastCounter}`;
    set((state) => ({
      toasts: [...state.toasts, { id, type, message, duration }],
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

  setOnboardingCompleted: (completed) => set({ onboardingCompleted: completed }),
}));
