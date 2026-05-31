type AdminActionMessageProps = {
  success?: string | string[];
  error?: string | string[];
  formError?: string;
};

function firstMessage(message?: string | string[]) {
  if (Array.isArray(message)) {
    return message[0];
  }

  return message;
}

export function AdminActionMessage({
  success,
  error,
  formError,
}: AdminActionMessageProps) {
  const successMessage = firstMessage(success);
  const errorMessage = formError ?? firstMessage(error);

  if (!successMessage && !errorMessage) {
    return null;
  }

  return (
    <div className="space-y-3">
      {successMessage ? (
        <div className="rounded-lg border border-[#b7c891] bg-[#eef4df] px-4 py-3 text-sm font-bold text-[#3f5b25]">
          {successMessage}
        </div>
      ) : null}
      {errorMessage ? (
        <div className="rounded-lg border border-[#e5b2a8] bg-[#fff4f1] px-4 py-3 text-sm font-bold text-[#9f2f28]">
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
}
