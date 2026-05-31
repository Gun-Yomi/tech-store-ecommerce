"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/lib/auth/actions";
import { initialAuthActionState } from "@/lib/auth/validation";
import { AuthFormMessage } from "./AuthFormMessage";
import { AuthSubmitButton } from "./AuthSubmitButton";
import { AuthTextField } from "./AuthTextField";

type ProfileFormProps = {
  user: {
    name: string;
    email: string;
    phone: string | null;
    avatarUrl: string | null;
  };
};

export function ProfileForm({ user }: ProfileFormProps) {
  const [state, formAction] = useActionState(
    updateProfileAction,
    initialAuthActionState,
  );

  return (
    <form action={formAction} className="rounded-lg border border-[#d7dfbd] bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#5f7d33]">
          Profile
        </p>
        <h2 className="mt-3 text-2xl font-black tracking-normal text-[#253326]">
          Account details
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#60705d]">
          Update your customer profile details. Email changes stay reserved for
          a verified email-change workflow.
        </p>
      </div>

      <div className="mt-5 space-y-4">
        <AuthFormMessage message={state.formError} />
        <AuthFormMessage message={state.successMessage} variant="success" />

        <AuthTextField
          label="Name"
          name="name"
          autoComplete="name"
          defaultValue={state.values?.name ?? user.name}
          error={state.fieldErrors?.name?.[0]}
          placeholder="Your name"
        />
        <AuthTextField
          label="Phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          defaultValue={state.values?.phone ?? user.phone ?? ""}
          error={state.fieldErrors?.phone?.[0]}
          placeholder="Optional phone number"
        />
        <AuthTextField
          label="Avatar URL"
          name="avatarUrl"
          type="url"
          autoComplete="url"
          defaultValue={state.values?.avatarUrl ?? user.avatarUrl ?? ""}
          error={state.fieldErrors?.avatarUrl?.[0]}
          placeholder="https://example.com/avatar.jpg"
        />
        <div className="rounded-lg border border-[#d7dfbd] bg-[#f7f9ef] px-4 py-3 text-sm font-semibold text-[#60705d]">
          Email: <span className="font-black text-[#253326]">{user.email}</span>
        </div>
        <AuthSubmitButton pendingLabel="Saving profile...">
          Save profile
        </AuthSubmitButton>
      </div>
    </form>
  );
}
