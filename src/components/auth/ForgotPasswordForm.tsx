"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordResetAction } from "@/lib/auth/actions";
import { initialAuthActionState } from "@/lib/auth/validation";
import { AuthFormMessage } from "./AuthFormMessage";
import { AuthSubmitButton } from "./AuthSubmitButton";
import { AuthTextField } from "./AuthTextField";

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(
    requestPasswordResetAction,
    initialAuthActionState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f7fb3]">
          Password help
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-normal text-[#1f2a44]">
          Request a reset code
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#5f6f85]">
          Enter your account email. If it matches an active account, a 6-digit
          reset code will be sent.
        </p>
      </div>

      <AuthFormMessage message={state.formError} />
      <AuthFormMessage message={state.successMessage} variant="success" />

      <AuthTextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        defaultValue={state.values?.email}
        error={state.fieldErrors?.email?.[0]}
        placeholder="you@example.com"
      />

      <AuthSubmitButton pendingLabel="Sending reset code...">
        Send reset code
      </AuthSubmitButton>

      <div className="grid gap-3 text-center text-sm font-medium text-[#5f6f85]">
        <Link href="/reset-password" className="font-black text-[#2f7fb3] hover:text-[#2f5f8f]">
          Already have a code?
        </Link>
        <Link href="/login" className="font-black text-[#2f7fb3] hover:text-[#2f5f8f]">
          Back to sign in
        </Link>
      </div>
    </form>
  );
}
