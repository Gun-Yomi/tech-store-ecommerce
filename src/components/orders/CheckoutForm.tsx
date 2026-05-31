"use client";

import { useActionState } from "react";
import { createOrderAction } from "@/lib/orders/actions";
import { initialCheckoutActionState } from "@/lib/orders/validation";
import type { SafeUser } from "@/lib/auth/types";
import { SubmitButton } from "@/components/shopping/SubmitButton";

type CheckoutFormProps = {
  user: SafeUser;
  disabled?: boolean;
};

function fieldError(
  state: typeof initialCheckoutActionState,
  name: string,
) {
  return state.fieldErrors?.[name]?.[0];
}

function stateValue(
  state: typeof initialCheckoutActionState,
  name: string,
  fallback = "",
) {
  return state.values?.[name] ?? fallback;
}

function TextInput({
  label,
  name,
  type = "text",
  defaultValue,
  error,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
}) {
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
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="mt-2 h-11 w-full rounded-lg border border-[#cfe0f2] bg-white px-3 text-sm font-semibold text-[#1f2a44] outline-none transition placeholder:text-[#8795a8] focus:border-[#4f9ed8]"
      />
      {error ? (
        <p id={errorId} className="mt-2 text-xs font-bold text-[#9f2f28]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function CheckoutForm({ user, disabled = false }: CheckoutFormProps) {
  const [state, formAction] = useActionState(
    createOrderAction,
    initialCheckoutActionState,
  );

  return (
    <form action={formAction} className="space-y-5">
      {state.formError ? (
        <div
          role="alert"
          className="rounded-lg border border-[#e5b2a8] bg-[#fff4f1] px-4 py-3 text-sm font-bold text-[#9f2f28]"
        >
          {state.formError}
        </div>
      ) : null}

      <div className="rounded-lg border border-[#cfe0f2] bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-black tracking-normal text-[#1f2a44]">
          Customer details
        </h2>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <TextInput
            label="Full name"
            name="fullName"
            required
            defaultValue={stateValue(state, "fullName", user.name)}
            error={fieldError(state, "fullName")}
          />
          <TextInput
            label="Email"
            name="email"
            type="email"
            required
            defaultValue={stateValue(state, "email", user.email)}
            error={fieldError(state, "email")}
          />
          <TextInput
            label="Phone number"
            name="phone"
            required
            defaultValue={stateValue(state, "phone", user.phone ?? "")}
            error={fieldError(state, "phone")}
            placeholder="+1 555 0100"
          />
          <div>
            <label
              htmlFor="deliveryMethod"
              className="block text-sm font-black text-[#1f2a44]"
            >
              Delivery option
            </label>
            <select
              id="deliveryMethod"
              name="deliveryMethod"
              defaultValue={stateValue(state, "deliveryMethod", "DELIVERY")}
              aria-invalid={Boolean(fieldError(state, "deliveryMethod"))}
              aria-describedby={
                fieldError(state, "deliveryMethod")
                  ? "deliveryMethod-error"
                  : undefined
              }
              className="mt-2 h-11 w-full rounded-lg border border-[#cfe0f2] bg-white px-3 text-sm font-semibold text-[#1f2a44] outline-none transition focus:border-[#4f9ed8]"
            >
              <option value="DELIVERY">Delivery</option>
              <option value="PICKUP">Pickup / manual confirmation</option>
            </select>
            {fieldError(state, "deliveryMethod") ? (
              <p
                id="deliveryMethod-error"
                className="mt-2 text-xs font-bold text-[#9f2f28]"
              >
                {fieldError(state, "deliveryMethod")}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-[#cfe0f2] bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-black tracking-normal text-[#1f2a44]">
          Delivery address
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#5f6f85]">
          Address is required for delivery. Pickup orders can leave address
          fields blank.
        </p>
        <div className="mt-5 grid gap-5">
          <TextInput
            label="Address line 1"
            name="addressLine1"
            defaultValue={stateValue(state, "addressLine1")}
            error={fieldError(state, "addressLine1")}
          />
          <TextInput
            label="Address line 2"
            name="addressLine2"
            defaultValue={stateValue(state, "addressLine2")}
            error={fieldError(state, "addressLine2")}
          />
          <div className="grid gap-5 lg:grid-cols-2">
            <TextInput
              label="City / Town / Parish / State"
              name="cityParishState"
              defaultValue={stateValue(state, "cityParishState")}
              error={fieldError(state, "cityParishState")}
            />
            <TextInput
              label="Country"
              name="country"
              defaultValue={stateValue(state, "country")}
              error={fieldError(state, "country")}
            />
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-black text-[#1f2a44]">
              Order notes
            </label>
            <textarea
              id="notes"
              name="notes"
              defaultValue={stateValue(state, "notes")}
              rows={4}
              aria-invalid={Boolean(fieldError(state, "notes"))}
              aria-describedby={fieldError(state, "notes") ? "notes-error" : undefined}
              className="mt-2 w-full rounded-lg border border-[#cfe0f2] bg-white px-3 py-3 text-sm font-semibold text-[#1f2a44] outline-none transition placeholder:text-[#8795a8] focus:border-[#4f9ed8]"
              placeholder="Delivery notes, pickup preference, or anything the team should know."
            />
            {fieldError(state, "notes") ? (
              <p id="notes-error" className="mt-2 text-xs font-bold text-[#9f2f28]">
                {fieldError(state, "notes")}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-[#cfe0f2] bg-[#f7fbff] p-5">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-[#2f7fb3]">
          Payment placeholder
        </p>
        <p className="mt-2 text-sm leading-6 text-[#5f6f85]">
          Online payment is coming soon. Your order will be submitted for manual
          confirmation, and payment status will start as unpaid.
        </p>
      </div>

      <SubmitButton
        pendingLabel="Submitting order..."
        disabled={disabled}
        className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#334155] px-6 text-sm font-black text-white transition hover:bg-[#2f7fb3]"
      >
        Submit order for confirmation
      </SubmitButton>
    </form>
  );
}
