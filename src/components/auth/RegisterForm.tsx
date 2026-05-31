"use client";

import Link from "next/link";
import { type MouseEvent, useActionState, useState } from "react";
import { registerAction } from "@/lib/auth/actions";
import { initialAuthActionState } from "@/lib/auth/validation";
import { AuthFormMessage } from "./AuthFormMessage";
import { AuthSubmitButton } from "./AuthSubmitButton";
import { AuthTextField } from "./AuthTextField";

export function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, initialAuthActionState);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [codeMessage, setCodeMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  async function handleSendCode(event: MouseEvent<HTMLButtonElement>) {
    const form = event.currentTarget.form;

    if (!form) {
      return;
    }

    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim();

    if (!email) {
      setCodeMessage({
        type: "error",
        message: "Enter your email address first.",
      });
      return;
    }

    setIsSendingCode(true);
    setCodeMessage(null);

    try {
      const response = await fetch("/api/auth/registration-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const payload = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;

      setCodeMessage({
        type: response.ok ? "success" : "error",
        message:
          payload?.message ??
          (response.ok
            ? "Verification code sent. Check your email."
            : "Could not send a verification code right now."),
      });
    } catch {
      setCodeMessage({
        type: "error",
        message: "Could not reach the email service right now.",
      });
    } finally {
      setIsSendingCode(false);
    }
  }

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#5f7d33]">
          Customer account
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-normal text-[#253326]">
          Create your account
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#60705d]">
          Enter your email, send a 6-digit code, then paste that code here to
          create your secure customer profile.
        </p>
      </div>

      <AuthFormMessage message={state.formError} />

      <AuthTextField
        label="Name"
        name="name"
        autoComplete="name"
        defaultValue={state.values?.name}
        error={state.fieldErrors?.name?.[0]}
        placeholder="Your name"
      />
      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <AuthTextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={state.values?.email}
          error={state.fieldErrors?.email?.[0]}
          placeholder="you@example.com"
        />
        <button
          type="button"
          onClick={handleSendCode}
          disabled={isSendingCode}
          className="h-12 rounded-lg border border-[#9fb56d] bg-[#eef5db] px-5 text-sm font-black text-[#384d2c] transition hover:border-[#6e8f3d] hover:bg-[#e1edc0] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSendingCode ? "Sending..." : "Email code"}
        </button>
      </div>
      {codeMessage ? (
        <p
          aria-live="polite"
          className={`rounded-lg border px-4 py-3 text-sm font-bold ${
            codeMessage.type === "success"
              ? "border-[#bfd69a] bg-[#f1f7df] text-[#425b2d]"
              : "border-[#e7b5ae] bg-[#fff3f1] text-[#9f2f28]"
          }`}
        >
          {codeMessage.message}
        </p>
      ) : null}
      <AuthTextField
        label="Verification code"
        name="verificationCode"
        type="text"
        autoComplete="one-time-code"
        inputMode="numeric"
        maxLength={6}
        error={state.fieldErrors?.verificationCode?.[0]}
        placeholder="6-digit code"
      />
      <AuthTextField
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        error={state.fieldErrors?.password?.[0]}
        placeholder="At least 8 characters"
      />
      <AuthTextField
        label="Confirm password"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        error={state.fieldErrors?.confirmPassword?.[0]}
        placeholder="Repeat your password"
      />

      <AuthSubmitButton pendingLabel="Creating account...">
        Create account
      </AuthSubmitButton>

      <p className="text-center text-sm font-medium text-[#60705d]">
        Already have an account?{" "}
        <Link href="/login" className="font-black text-[#5f7d33] hover:text-[#435d2d]">
          Sign in
        </Link>
      </p>
    </form>
  );
}
