"use client";

import Link from "next/link";
import type { ShoppingActionState } from "@/lib/shopping-actions";

type ActionMessageProps = {
  state: ShoppingActionState;
};

export function ActionMessage({ state }: ActionMessageProps) {
  const message = state.formError ?? state.successMessage;

  if (!message) {
    return null;
  }

  const isError = Boolean(state.formError);

  return (
    <div
      role="status"
      className={`rounded-lg border px-3 py-2 text-xs font-bold ${
        isError
          ? "border-[#e7b5ae] bg-[#fff3f1] text-[#9f2f28]"
          : "border-[#bfd69a] bg-[#f1f7df] text-[#425b2d]"
      }`}
    >
      <span>{message}</span>
      {isError && message.includes("Sign in") ? (
        <Link href="/login" className="ml-2 font-black underline">
          Login
        </Link>
      ) : null}
    </div>
  );
}
