"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { sendOtp as firebaseSendOtp, verifyOtp as firebaseVerifyOtp } from "@/lib/firebase";
import { useAuthStore } from "@/store/auth-store";
import type {
  ApiResponse,
  UserResponse,
  OnboardInput,
} from "@gharka/shared";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
  isNew: boolean;
}

export function useSendOtp() {
  return useMutation({
    mutationFn: (data: { phone: string }) => firebaseSendOtp(data.phone),
  });
}

export function useVerifyOtp() {
  const { login, setOnboarded } = useAuthStore();

  return useMutation({
    mutationFn: async (data: { code: string }) => {
      const firebaseToken = await firebaseVerifyOtp(data.code);
      const response = await api.post<ApiResponse<AuthTokens>>(
        "/api/auth/verify-firebase",
        { firebaseToken }
      );
      return response;
    },
    onSuccess: (response) => {
      const { accessToken, refreshToken, user, isNew } = response.data;
      api.setAuthTokens(accessToken, refreshToken);
      login(accessToken, refreshToken, user);
      if (!isNew && user.name) {
        setOnboarded(true);
      }
    },
  });
}

export function useOnboard() {
  const { setUser, setOnboarded } = useAuthStore();

  return useMutation({
    mutationFn: (data: OnboardInput) =>
      api.post<ApiResponse<{ user: UserResponse; accessToken: string }>>(
        "/api/auth/onboard",
        data
      ),
    onSuccess: (response) => {
      const { user, accessToken } = response.data;
      // Onboarding can change the role (everyone starts as BUYER, then may pick
      // SELLER), so the API mints a fresh JWT with the new role claim. Persist it
      // — otherwise the old token is sent and SELLER-only routes 403.
      api.setAuthTokens(accessToken);
      setUser(user);
      setOnboarded(true);
    },
  });
}

export function useMe() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["me"],
    queryFn: () => api.get<ApiResponse<UserResponse>>("/api/users/me"),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateProfile() {
  const { updateProfile } = useAuthStore();

  return useMutation({
    mutationFn: (data: { name?: string; avatarUrl?: string }) =>
      api.patch<ApiResponse<UserResponse>>("/api/users/me", data),
    onSuccess: (response) => {
      updateProfile(response.data);
    },
  });
}
