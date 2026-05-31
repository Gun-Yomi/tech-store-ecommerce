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
  return (
    <label className="block">
      <span className="text-sm font-black text-[#253326]">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        required={required}
        className={inputClass}
      />
      {error ? <p className="mt-2 text-xs font-bold text-[#9f2f28]">{error}</p> : null}
    </label>
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
  return (
    <label className="block">
      <span className="text-sm font-black text-[#253326]">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className={textareaClass}
      />
      {error ? <p className="mt-2 text-xs font-bold text-[#9f2f28]">{error}</p> : null}
    </label>
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
  return (
    <label className="block">
      <span className="text-sm font-black text-[#253326]">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        className={inputClass}
      >
        {children}
      </select>
      {error ? <p className="mt-2 text-xs font-bold text-[#9f2f28]">{error}</p> : null}
    </label>
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
