"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getCurrentUser,
  login,
  logout,
  register,
  verifyEmail,
  resendOtp,
  forgotPassword,
  resetPassword,
  refreshToken,
} from "../api/auth.api";
import { authKeys } from "../api/auth.keys";
import type {
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "../types/auth.types";

// ── Current user ──────────────────────────────────────────────────────────

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: getCurrentUser,
    // Don't throw on 401 — that just means logged out
    retry: false,
    // Don't refetch on window focus — handled by refresh interceptor
    refetchOnWindowFocus: false,
  });
}

// ── Login ─────────────────────────────────────────────────────────────────

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: async () => {
      // Force a fresh /me fetch so AuthProvider has the user immediately
      await queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
    },
  });
}

// ── Register ──────────────────────────────────────────────────────────────

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
    // verificationToken is in data — caller stores it in sessionStorage
  });
}

// ── Verify Email ──────────────────────────────────────────────────────────

export function useVerifyEmail() {
  return useMutation({
    mutationFn: ({
      data,
      verificationToken,
    }: {
      data: VerifyEmailRequest;
      verificationToken: string;
    }) => verifyEmail(data, verificationToken),
  });
}

// ── Resend OTP ────────────────────────────────────────────────────────────

export function useResendOtp() {
  return useMutation({
    mutationFn: (verificationToken: string) => resendOtp(verificationToken),
  });
}

// ── Logout ────────────────────────────────────────────────────────────────

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Wipe all cached auth data immediately
      queryClient.removeQueries({ queryKey: authKeys.currentUser() });
    },
  });
}

// ── Token refresh (called by axios interceptor, not directly) ─────────────

export function useRefreshToken() {
  return useMutation({
    mutationFn: refreshToken,
  });
}

// ── Forgot / Reset password ───────────────────────────────────────────────

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => forgotPassword(data),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => resetPassword(data),
  });
}