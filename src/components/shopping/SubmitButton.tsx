"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  children: React.ReactNode;
  pendingLabel: string;
  className: string;
  disabled?: boolean;
  title?: string;
  ariaLabel?: string;
};

export function SubmitButton({
  children,
  pendingLabel,
  className,
  disabled = false,
  title,
  ariaLabel,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      title={title}
      aria-label={ariaLabel}
      className={`${className} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
