"use client";

import { useFormStatus } from "react-dom";

type AuthSubmitButtonProps = {
  pendingLabel: string;
  children: React.ReactNode;
};

export function AuthSubmitButton({
  pendingLabel,
  children,
}: AuthSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#2f7fb3] px-6 text-sm font-black text-white shadow-[0_16px_40px_rgba(47,95,143,0.18)] transition hover:-translate-y-0.5 hover:bg-[#236b9f] disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-[#a7b7c8]"
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
