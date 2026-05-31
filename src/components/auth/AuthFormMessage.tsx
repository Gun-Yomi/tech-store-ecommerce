type AuthFormMessageProps = {
  message?: string;
  variant?: "error" | "success";
};

export function AuthFormMessage({
  message,
  variant = "error",
}: AuthFormMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      role="alert"
      className={`rounded-lg border px-4 py-3 text-sm font-semibold ${
        variant === "success"
          ? "border-[#bfd69a] bg-[#f1f7df] text-[#425b2d]"
          : "border-[#f0c7bd] bg-[#fff5f1] text-[#9f2f28]"
      }`}
    >
      {message}
    </div>
  );
}
