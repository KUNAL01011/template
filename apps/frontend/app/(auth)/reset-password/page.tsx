import type { Metadata } from "next";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

export const metadata: Metadata = { title: "New password" };

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Set new password"
      subtitle="Choose a strong password for your account"
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}