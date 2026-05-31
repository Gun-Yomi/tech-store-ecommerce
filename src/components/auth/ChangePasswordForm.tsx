"use client";

import { useActionState } from "react";
import { changePasswordAction } from "@/lib/auth/actions";
import { initialAuthActionState } from "@/lib/auth/validation";
import { AuthFormMessage } from "./AuthFormMessage";
import { AuthSubmitButton } from "./AuthSubmitButton";
import { AuthTextField } from "./AuthTextField";

export function ChangePasswordForm() {
  const [state, formAction] = useActionState(
    changePasswordAction,
    initialAuthActionState,
  );

  return (
    <form action={formAction} className="rounded-lg border border-[#cfe0f2] bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f7fb3]">
          Security
        </p>
        <h2 className="mt-3 text-2xl font-black tracking-normal text-[#1f2a44]">
          Change password
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#5f6f85]">
          Choose a new password. Other active sessions will be signed out.
        </p>
      </div>

      <div className="mt-5 space-y-4">
        <AuthFormMessage message={state.formError} />
        <AuthFormMessage message={state.successMessage} variant="success" />

        <AuthTextField
          label="Current password"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          error={state.fieldErrors?.currentPassword?.[0]}
          placeholder="Enter your current password"
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
        <AuthSubmitButton pendingLabel="Updating password...">
          Update password
        </AuthSubmitButton>
      </div>
    </form>
  );
}
