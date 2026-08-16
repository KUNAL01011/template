"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";

import { useResetPassword } from "../hooks/useAuth";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "../schemas/auth.schemas";
import { FormField, ErrorBanner, SubmitButton } from "./FormField";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const mutation = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  async function onSubmit(data: ResetPasswordFormData) {
    try {
      await mutation.mutateAsync({ token, password: data.password });
      router.replace("/login?reset=1");
    } catch {
      // Error shown via mutation.error
    }
  }

  if (!token) {
    return (
      <p className="text-sm text-[var(--destructive)]">
        Invalid or missing reset token. Please request a new link.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <ErrorBanner
        message={
          mutation.isError
            ? isAxiosError(mutation.error) &&
              mutation.error.response?.status === 400
              ? "This link has expired. Request a new one."
              : "Something went wrong. Please try again."
            : null
        }
      />

      <FormField
        id="password"
        label="New password"
        type="password"
        autoComplete="new-password"
        placeholder="Min. 8 characters"
        error={errors.password?.message}
        disabled={mutation.isPending}
        {...register("password")}
      />

      <FormField
        id="confirmPassword"
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        disabled={mutation.isPending}
        {...register("confirmPassword")}
      />

      <SubmitButton
        loading={mutation.isPending}
        label="Set new password"
        loadingLabel="Saving…"
      />
    </form>
  );
}