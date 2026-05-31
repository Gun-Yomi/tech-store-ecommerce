"use client";

import type { Category } from "@prisma/client";
import { useActionState, useState } from "react";
import {
  createCategoryAction,
  updateCategoryAction,
} from "@/lib/admin/actions";
import {
  initialAdminActionState,
  slugify,
} from "@/lib/admin/validation";
import { AdminActionMessage } from "./AdminActionMessage";
import {
  AdminCheckbox,
  AdminSelect,
  AdminTextarea,
  AdminTextInput,
  fieldError,
  stateValue,
} from "./AdminFields";
import { AdminSubmitButton } from "./AdminSubmitButton";

type CategoryFormProps = {
  category?: Category | null;
};

export function CategoryForm({ category }: CategoryFormProps) {
  const action = category
    ? updateCategoryAction.bind(null, category.id)
    : createCategoryAction;
  const [state, formAction] = useActionState(action, initialAdminActionState);
  const initialSlug = stateValue(state, "slug", category?.slug);
  const [slug, setSlug] = useState(String(initialSlug));
  const [slugEdited, setSlugEdited] = useState(Boolean(initialSlug));

  return (
    <form action={formAction} className="rounded-lg border border-[#d7dfbd] bg-white p-5 shadow-sm">
      <AdminActionMessage formError={state.formError} success={state.successMessage} />
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <label className="block">
          <span className="text-sm font-black text-[#253326]">Category name</span>
          <input
            name="name"
            type="text"
            required
            defaultValue={stateValue(state, "name", category?.name)}
            onChange={(event) => {
              if (!slugEdited) {
                setSlug(slugify(event.target.value));
              }
            }}
            className="mt-2 h-11 w-full rounded-lg border border-[#d7dfbd] bg-white px-3 text-sm font-semibold text-[#253326] outline-none transition focus:border-[#6e8f3d]"
          />
          {fieldError(state, "name") ? (
            <p className="mt-2 text-xs font-bold text-[#9f2f28]">
              {fieldError(state, "name")}
            </p>
          ) : null}
        </label>
        <label className="block">
          <span className="text-sm font-black text-[#253326]">Slug</span>
          <input
            name="slug"
            type="text"
            required
            value={slug}
            onChange={(event) => {
              setSlugEdited(true);
              setSlug(slugify(event.target.value));
            }}
            className="mt-2 h-11 w-full rounded-lg border border-[#d7dfbd] bg-white px-3 text-sm font-semibold text-[#253326] outline-none transition focus:border-[#6e8f3d]"
          />
          {fieldError(state, "slug") ? (
            <p className="mt-2 text-xs font-bold text-[#9f2f28]">
              {fieldError(state, "slug")}
            </p>
          ) : null}
        </label>
        <AdminTextInput
          label="Image URL"
          name="image"
          required
          defaultValue={stateValue(state, "image", category?.image)}
          error={fieldError(state, "image")}
        />
        <AdminTextInput
          label="Icon placeholder"
          name="icon"
          required
          defaultValue={stateValue(state, "icon", category?.icon)}
          error={fieldError(state, "icon")}
        />
        <AdminTextInput
          label="Sort order"
          name="sortOrder"
          type="number"
          defaultValue={stateValue(state, "sortOrder", category?.sortOrder ?? 0)}
          error={fieldError(state, "sortOrder")}
        />
        <AdminSelect
          label="Status"
          name="status"
          defaultValue={stateValue(state, "status", category?.status ?? "ACTIVE")}
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
          defaultValue={stateValue(state, "description", category?.description)}
          error={fieldError(state, "description")}
        />
      </div>
      <div className="mt-5">
        <AdminCheckbox
          label="Featured category"
          name="isFeatured"
          defaultChecked={state.values ? state.values.isFeatured === "on" : category?.isFeatured}
        />
      </div>
      <div className="mt-5">
        <AdminSubmitButton pendingLabel={category ? "Saving..." : "Creating..."}>
          {category ? "Save category" : "Create category"}
        </AdminSubmitButton>
      </div>
    </form>
  );
}
