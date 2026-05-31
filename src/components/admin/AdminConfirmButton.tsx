"use client";

import { useFormStatus } from "react-dom";

type AdminConfirmButtonProps = {
  children: React.ReactNode;
  message: string;
  pendingLabel: string;
  className: string;
};

export function AdminConfirmButton({
  children,
  message,
  pendingLabel,
  className,
}: AdminConfirmButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
      className={`${className} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
