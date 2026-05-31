import type { AdminActionState } from "@/lib/admin/validation";

type TextInputProps = {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number | null;
  error?: string;
  placeholder?: string;
  required?: boolean;
};

type TextareaProps = TextInputProps & {
  rows?: number;
};

type SelectProps = TextInputProps & {
  children: React.ReactNode;
};

const inputClass =
  "mt-2 h-11 w-full rounded-lg border border-[#d7dfbd] bg-white px-3 text-sm font-semibold text-[#253326] outline-none transition placeholder:text-[#8a957e] focus:border-[#6e8f3d]";

const textareaClass =
  "mt-2 w-full rounded-lg border border-[#d7dfbd] bg-white px-3 py-3 text-sm font-semibold text-[#253326] outline-none transition placeholder:text-[#8a957e] focus:border-[#6e8f3d]";

export function fieldError(state: AdminActionState, name: string) {
  return state.fieldErrors?.[name]?.[0];
}

export function stateValue(
  state: AdminActionState,
  name: string,
  fallback?: string | number | null,
) {
  return state.values?.[name] ?? (fallback ?? "");
}

export function AdminTextInput({
  label,
  name,
  type = "text",
  defaultValue,
  error,
  placeholder,
  required,
}: TextInputProps) {
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
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={inputClass}
      />
      {error ? (
        <p id={errorId} className="mt-2 text-xs font-bold text-[#9f2f28]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function AdminTextarea({
  label,
  name,
  defaultValue,
  error,
  placeholder,
  rows = 4,
  required,
}: TextareaProps) {
  const errorId = `${name}-error`;

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-black text-[#253326]">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        rows={rows}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={textareaClass}
      />
      {error ? (
        <p id={errorId} className="mt-2 text-xs font-bold text-[#9f2f28]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function AdminSelect({
  label,
  name,
  defaultValue,
  error,
  children,
  required,
}: SelectProps) {
  const errorId = `${name}-error`;

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-black text-[#253326]">
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={inputClass}
      >
        {children}
      </select>
      {error ? (
        <p id={errorId} className="mt-2 text-xs font-bold text-[#9f2f28]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function AdminCheckbox({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-3 rounded-lg border border-[#d7dfbd] bg-white px-3 py-3 text-sm font-black text-[#253326]">
      <input
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="h-4 w-4 accent-[#6e8f3d]"
      />
      {label}
    </label>
  );
}
