import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserResponse } from "@gharka/shared";

interface AuthState {
  user: UserResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  setUser: (user: UserResponse) => void;
  login: (token: string, refreshToken: string, user: UserResponse) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserResponse>) => void;
  setOnboarded: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isOnboarded: false,

      setUser: (user) => set({ user }),

      login: (token, refreshToken, user) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("gharka_token", token);
          localStorage.setItem("gharka_refresh", refreshToken);
        }
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("gharka_token");
          localStorage.removeItem("gharka_refresh");
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isOnboarded: false,
        });
      },

      updateProfile: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },

      setOnboarded: (value) => set({ isOnboarded: value }),
    }),
    {
      name: "gharka-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isOnboarded: state.isOnboarded,
      }),
    }
  )
);
