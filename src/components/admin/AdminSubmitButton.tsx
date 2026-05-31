"use client";

import { useFormStatus } from "react-dom";

type AdminSubmitButtonProps = {
  children: React.ReactNode;
  pendingLabel: string;
  className?: string;
  disabled?: boolean;
};

export function AdminSubmitButton({
  children,
  pendingLabel,
  className = "inline-flex h-11 items-center justify-center rounded-lg bg-[#344554] px-5 text-sm font-black text-white transition hover:bg-[#5f7d33]",
  disabled = false,
}: AdminSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={`${className} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
