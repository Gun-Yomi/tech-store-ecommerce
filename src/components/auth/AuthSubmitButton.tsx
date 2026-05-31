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
      className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#5f7d33] px-6 text-sm font-black text-white shadow-[0_16px_40px_rgba(67,93,45,0.18)] transition hover:-translate-y-0.5 hover:bg-[#4f6f2d] disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-[#a9b59a]"
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
