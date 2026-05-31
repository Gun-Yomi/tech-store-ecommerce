type AuthTextFieldProps = {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  defaultValue?: string;
  error?: string;
  inputMode?: "email" | "numeric" | "search" | "tel" | "text" | "url";
  maxLength?: number;
  placeholder?: string;
};

export function AuthTextField({
  label,
  name,
  type = "text",
  autoComplete,
  defaultValue,
  error,
  inputMode,
  maxLength,
  placeholder,
}: AuthTextFieldProps) {
  const errorId = `${name}-error`;

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-black text-[#1f2a44]">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        inputMode={inputMode}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="mt-2 h-12 w-full rounded-lg border border-[#cfe0f2] bg-white px-4 text-sm font-medium text-[#1f2a44] outline-none transition placeholder:text-[#758398] hover:border-[#9fc5e8] focus:border-[#4f9ed8] focus:ring-4 focus:ring-[#dff0ff]"
      />
      {error ? (
        <p id={errorId} className="mt-2 text-sm font-semibold text-[#9f2f28]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
