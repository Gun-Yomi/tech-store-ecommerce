"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/lib/auth/actions";
import { initialAuthActionState } from "@/lib/auth/validation";
import { AuthFormMessage } from "./AuthFormMessage";
import { AuthSubmitButton } from "./AuthSubmitButton";
import { AuthTextField } from "./AuthTextField";

type LoginFormProps = {
  successMessage?: string;
};

export function LoginForm({ successMessage }: LoginFormProps) {
  const [state, formAction] = useActionState(loginAction, initialAuthActionState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#5f7d33]">
          Welcome back
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-normal text-[#253326]">
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#60705d]">
          Access account details and prepare for future orders, wishlist, and saved items.
        </p>
      </div>

      <AuthFormMessage message={state.formError} />
      <AuthFormMessage
        message={state.successMessage ?? successMessage}
        variant="success"
      />

      <AuthTextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        defaultValue={state.values?.email}
        error={state.fieldErrors?.email?.[0]}
        placeholder="you@example.com"
      />
      <AuthTextField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        error={state.fieldErrors?.password?.[0]}
        placeholder="Enter your password"
      />

      <AuthSubmitButton pendingLabel="Signing in...">Sign in</AuthSubmitButton>

      <div className="text-center">
        <Link
          href="/forgot-password"
          className="text-sm font-black text-[#5f7d33] hover:text-[#435d2d]"
        >
          Forgot your password?
        </Link>
      </div>

      <p className="text-center text-sm font-medium text-[#60705d]">
        New here?{" "}
        <Link href="/register" className="font-black text-[#5f7d33] hover:text-[#435d2d]">
          Create an account
        </Link>
      </p>
    </form>
  );
}
