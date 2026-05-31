type AuthFormMessageProps = {
  message?: string;
};

export function AuthFormMessage({ message }: AuthFormMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      role="alert"
      className="rounded-lg border border-[#f0c7bd] bg-[#fff5f1] px-4 py-3 text-sm font-semibold text-[#9f2f28]"
    >
      {message}
    </div>
  );
}
