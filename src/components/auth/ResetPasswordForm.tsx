"use client";

import Link from "next/link";
import { useActionState } from "react";
import { resetPasswordAction } from "@/lib/auth/actions";
import { initialAuthActionState } from "@/lib/auth/validation";
import { AuthFormMessage } from "./AuthFormMessage";
import { AuthSubmitButton } from "./AuthSubmitButton";
import { AuthTextField } from "./AuthTextField";

type ResetPasswordFormProps = {
  initialEmail?: string;
};

export function ResetPasswordForm({ initialEmail }: ResetPasswordFormProps) {
  const [state, formAction] = useActionState(
    resetPasswordAction,
    initialAuthActionState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f7fb3]">
          Reset password
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-normal text-[#1f2a44]">
          Set a new password
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#5f6f85]">
          Use the emailed reset code and choose a new password for your account.
        </p>
      </div>

      <AuthFormMessage message={state.formError} />

      <AuthTextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        defaultValue={state.values?.email ?? initialEmail}
        error={state.fieldErrors?.email?.[0]}
        placeholder="you@example.com"
      />
      <AuthTextField
        label="Reset code"
        name="verificationCode"
        type="text"
        autoComplete="one-time-code"
        inputMode="numeric"
        maxLength={6}
        error={state.fieldErrors?.verificationCode?.[0]}
        placeholder="6-digit code"
      />
      <AuthTextField
        label="New password"
        name="password"
        type="password"
        autoComplete="new-password"
        error={state.fieldErrors?.password?.[0]}
        placeholder="At least 8 characters"
      />
      <AuthTextField
        label="Confirm new password"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        error={state.fieldErrors?.confirmPassword?.[0]}
        placeholder="Repeat your new password"
      />

      <AuthSubmitButton pendingLabel="Resetting password...">
        Reset password
      </AuthSubmitButton>

      <div className="grid gap-3 text-center text-sm font-medium text-[#5f6f85]">
        <Link
          href="/forgot-password"
          className="font-black text-[#2f7fb3] hover:text-[#2f5f8f]"
        >
          Request a new code
        </Link>
        <Link href="/login" className="font-black text-[#2f7fb3] hover:text-[#2f5f8f]">
          Back to sign in
        </Link>
      </div>
    </form>
  );
}
