"use client";

import type { Brand } from "@prisma/client";
import { useActionState, useState } from "react";
import { createBrandAction, updateBrandAction } from "@/lib/admin/actions";
import {
  initialAdminActionState,
  slugify,
} from "@/lib/admin/validation";
import { AdminActionMessage } from "./AdminActionMessage";
import {
  AdminSelect,
  AdminTextarea,
  AdminTextInput,
  fieldError,
  stateValue,
} from "./AdminFields";
import { AdminSubmitButton } from "./AdminSubmitButton";

type BrandFormProps = {
  brand?: Brand | null;
};

export function BrandForm({ brand }: BrandFormProps) {
  const action = brand ? updateBrandAction.bind(null, brand.id) : createBrandAction;
  const [state, formAction] = useActionState(action, initialAdminActionState);
  const initialSlug = stateValue(state, "slug", brand?.slug);
  const [slug, setSlug] = useState(String(initialSlug));
  const [slugEdited, setSlugEdited] = useState(Boolean(initialSlug));

  return (
    <form action={formAction} className="rounded-lg border border-[#cfe0f2] bg-white p-5 shadow-sm">
      <AdminActionMessage formError={state.formError} success={state.successMessage} />
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <label className="block">
          <span className="text-sm font-black text-[#1f2a44]">Brand name</span>
          <input
            name="name"
            type="text"
            required
            defaultValue={stateValue(state, "name", brand?.name)}
            onChange={(event) => {
              if (!slugEdited) {
                setSlug(slugify(event.target.value));
              }
            }}
            className="mt-2 h-11 w-full rounded-lg border border-[#cfe0f2] bg-white px-3 text-sm font-semibold text-[#1f2a44] outline-none transition focus:border-[#4f9ed8]"
          />
          {fieldError(state, "name") ? (
            <p className="mt-2 text-xs font-bold text-[#9f2f28]">
              {fieldError(state, "name")}
            </p>
          ) : null}
        </label>
        <label className="block">
          <span className="text-sm font-black text-[#1f2a44]">Slug</span>
          <input
            name="slug"
            type="text"
            required
            value={slug}
            onChange={(event) => {
              setSlugEdited(true);
              setSlug(slugify(event.target.value));
            }}
            className="mt-2 h-11 w-full rounded-lg border border-[#cfe0f2] bg-white px-3 text-sm font-semibold text-[#1f2a44] outline-none transition focus:border-[#4f9ed8]"
          />
          {fieldError(state, "slug") ? (
            <p className="mt-2 text-xs font-bold text-[#9f2f28]">
              {fieldError(state, "slug")}
            </p>
          ) : null}
        </label>
        <AdminTextInput
          label="Logo URL"
          name="logo"
          required
          defaultValue={stateValue(state, "logo", brand?.logo)}
          error={fieldError(state, "logo")}
        />
        <AdminSelect
          label="Status"
          name="status"
          defaultValue={stateValue(state, "status", brand?.status ?? "ACTIVE")}
          error={fieldError(state, "status")}
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </AdminSelect>
      </div>
      <div className="mt-5">
        <AdminTextarea
          label="Description"
          name="description"
          rows={3}
          required
          defaultValue={stateValue(state, "description", brand?.description)}
          error={fieldError(state, "description")}
        />
      </div>
      <div className="mt-5">
        <AdminSubmitButton pendingLabel={brand ? "Saving..." : "Creating..."}>
          {brand ? "Save brand" : "Create brand"}
        </AdminSubmitButton>
      </div>
    </form>
  );
}
