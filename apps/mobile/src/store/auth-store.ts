import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import type { UserResponse } from '@gharka/shared';

interface AuthState {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isOnboarded: boolean;

  setUser: (user: UserResponse | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  setOnboarded: (onboarded: boolean) => void;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isOnboarded: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
  setLoading: (loading) => set({ isLoading: loading }),
  setOnboarded: (onboarded) => set({ isOnboarded: onboarded }),

  logout: async () => {
    try {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      await SecureStore.deleteItemAsync('user');
    } catch {
      // Ignore secure store errors during logout
    }
    set({ user: null, isAuthenticated: false, isOnboarded: false });
  },

  hydrate: async () => {
    set({ isLoading: true });
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      const userJson = await SecureStore.getItemAsync('user');
      const onboarded = await SecureStore.getItemAsync('onboarded');

      if (token && userJson) {
        const user = JSON.parse(userJson) as UserResponse;
        set({
          user,
          isAuthenticated: true,
          isOnboarded: onboarded === 'true',
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },
}));

export async function persistUser(user: UserResponse): Promise<void> {
  await SecureStore.setItemAsync('user', JSON.stringify(user));
}

export async function persistOnboarded(): Promise<void> {
  await SecureStore.setItemAsync('onboarded', 'true');
}
