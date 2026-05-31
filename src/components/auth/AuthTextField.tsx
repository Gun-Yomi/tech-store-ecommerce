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
      <label htmlFor={name} className="block text-sm font-black text-[#253326]">
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
        className="mt-2 h-12 w-full rounded-lg border border-[#d7dfbd] bg-white px-4 text-sm font-medium text-[#253326] outline-none transition placeholder:text-[#75806f] hover:border-[#b7c891] focus:border-[#6e8f3d] focus:ring-4 focus:ring-[#e5efcd]"
      />
      {error ? (
        <p id={errorId} className="mt-2 text-sm font-semibold text-[#9f2f28]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
