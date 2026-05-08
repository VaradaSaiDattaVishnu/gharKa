"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
import type {
  ApiResponse,
  UserResponse,
  SendOtpInput,
  OnboardInput,
} from "@gharka/shared";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}

export function useSendOtp() {
  return useMutation({
    mutationFn: (data: SendOtpInput) =>
      api.post<ApiResponse<{ message: string }>>("/api/auth/send-otp", data),
  });
}

export function useVerifyOtp() {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: (data: { firebaseToken: string }) =>
      api.post<ApiResponse<AuthTokens>>("/api/auth/verify", data),
    onSuccess: (response) => {
      const { accessToken, refreshToken, user } = response.data;
      api.setAuthTokens(accessToken, refreshToken);
      login(accessToken, refreshToken, user);
    },
  });
}

export function useOnboard() {
  const { setUser, setOnboarded } = useAuthStore();

  return useMutation({
    mutationFn: (data: OnboardInput) =>
      api.post<ApiResponse<UserResponse>>("/api/auth/onboard", data),
    onSuccess: (response) => {
      setUser(response.data);
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
