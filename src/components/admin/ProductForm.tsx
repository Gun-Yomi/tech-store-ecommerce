"use client";

import type { Brand, Category, Product, ProductImage } from "@prisma/client";
import Link from "next/link";
import { useActionState, useState } from "react";
import {
  createProductAction,
  updateProductAction,
} from "@/lib/admin/actions";
import {
  formatCentsInput,
  formatJsonListInput,
  formatSpecificationsInput,
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

type ProductForForm = Product & {
  images: ProductImage[];
};

type ProductFormProps = {
  product?: ProductForForm | null;
  categories: Category[];
  brands: Brand[];
  successMessage?: string | string[];
};

function checkedValue(
  values: Record<string, string> | undefined,
  key: string,
  fallback?: boolean,
) {
  if (!values) {
    return fallback ?? false;
  }

  return values[key] === "on";
}

export function ProductForm({
  product,
  categories,
  brands,
  successMessage,
}: ProductFormProps) {
  const action = product
    ? updateProductAction.bind(null, product.id)
    : createProductAction;
  const [state, formAction] = useActionState(action, initialAdminActionState);
  const initialSlug = stateValue(state, "slug", product?.slug);
  const [slug, setSlug] = useState(String(initialSlug));
  const [slugEdited, setSlugEdited] = useState(Boolean(initialSlug));

  return (
    <form action={formAction} className="space-y-6">
      <AdminActionMessage
        success={state.successMessage ?? successMessage}
        formError={state.formError}
      />

      <section className="rounded-lg border border-[#cfe0f2] bg-white p-5 shadow-sm">
        <div className="grid gap-5 lg:grid-cols-2">
          <label className="block">
            <span className="text-sm font-black text-[#1f2a44]" id="name-label">
              Product name
            </span>
            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={stateValue(state, "name", product?.name)}
              aria-labelledby="name-label"
              aria-invalid={Boolean(fieldError(state, "name"))}
              aria-describedby={fieldError(state, "name") ? "name-error" : undefined}
              onChange={(event) => {
                if (!slugEdited) {
                  setSlug(slugify(event.target.value));
                }
              }}
              className="mt-2 h-11 w-full rounded-lg border border-[#cfe0f2] bg-white px-3 text-sm font-semibold text-[#1f2a44] outline-none transition placeholder:text-[#8795a8] focus:border-[#4f9ed8]"
            />
            {fieldError(state, "name") ? (
              <p id="name-error" className="mt-2 text-xs font-bold text-[#9f2f28]">
                {fieldError(state, "name")}
              </p>
            ) : null}
          </label>

          <label className="block">
            <span className="text-sm font-black text-[#1f2a44]" id="slug-label">
              Slug
            </span>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              value={slug}
              aria-labelledby="slug-label"
              aria-invalid={Boolean(fieldError(state, "slug"))}
              aria-describedby={fieldError(state, "slug") ? "slug-error" : undefined}
              onChange={(event) => {
                setSlugEdited(true);
                setSlug(slugify(event.target.value));
              }}
              className="mt-2 h-11 w-full rounded-lg border border-[#cfe0f2] bg-white px-3 text-sm font-semibold text-[#1f2a44] outline-none transition placeholder:text-[#8795a8] focus:border-[#4f9ed8]"
            />
            {fieldError(state, "slug") ? (
              <p id="slug-error" className="mt-2 text-xs font-bold text-[#9f2f28]">
                {fieldError(state, "slug")}
              </p>
            ) : null}
          </label>

          <AdminTextInput
            label="SKU"
            name="sku"
            required
            defaultValue={stateValue(state, "sku", product?.sku)}
            error={fieldError(state, "sku")}
          />
          <AdminSelect
            label="Status"
            name="status"
            required
            defaultValue={stateValue(state, "status", product?.status ?? "DRAFT")}
            error={fieldError(state, "status")}
          >
            <option value="ACTIVE">Active</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </AdminSelect>
          <AdminSelect
            label="Brand"
            name="brandId"
            required
            defaultValue={stateValue(state, "brandId", product?.brandId)}
            error={fieldError(state, "brandId")}
          >
            <option value="">Select brand</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name} ({brand.status.toLowerCase()})
              </option>
            ))}
          </AdminSelect>
          <AdminSelect
            label="Category"
            name="categoryId"
            required
            defaultValue={stateValue(state, "categoryId", product?.categoryId)}
            error={fieldError(state, "categoryId")}
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name} ({category.status.toLowerCase()})
              </option>
            ))}
          </AdminSelect>
        </div>
      </section>

      <section className="rounded-lg border border-[#cfe0f2] bg-white p-5 shadow-sm">
        <div className="grid gap-5">
          <AdminTextarea
            label="Short description"
            name="shortDescription"
            rows={3}
            required
            defaultValue={stateValue(
              state,
              "shortDescription",
              product?.shortDescription,
            )}
            error={fieldError(state, "shortDescription")}
          />
          <AdminTextarea
            label="Full description"
            name="fullDescription"
            rows={6}
            required
            defaultValue={stateValue(state, "fullDescription", product?.fullDescription)}
            error={fieldError(state, "fullDescription")}
          />
        </div>
      </section>

      <section className="rounded-lg border border-[#cfe0f2] bg-white p-5 shadow-sm">
        <div className="grid gap-5 lg:grid-cols-3">
          <AdminTextInput
            label="Price"
            name="price"
            required
            defaultValue={stateValue(state, "price", formatCentsInput(product?.price))}
            error={fieldError(state, "price")}
            placeholder="1099.00"
          />
          <AdminTextInput
            label="Sale price"
            name="salePrice"
            defaultValue={stateValue(
              state,
              "salePrice",
              formatCentsInput(product?.salePrice),
            )}
            error={fieldError(state, "salePrice")}
            placeholder="999.00"
          />
          <AdminTextInput
            label="Stock quantity"
            name="stockQuantity"
            type="number"
            required
            defaultValue={stateValue(state, "stockQuantity", product?.stockQuantity ?? 0)}
            error={fieldError(state, "stockQuantity")}
          />
        </div>
      </section>

      <section className="rounded-lg border border-[#cfe0f2] bg-white p-5 shadow-sm">
        <div className="grid gap-5">
          <AdminTextInput
            label="Featured image URL"
            name="featuredImage"
            required
            defaultValue={stateValue(state, "featuredImage", product?.featuredImage)}
            error={fieldError(state, "featuredImage")}
            placeholder="/catalog/placeholders/laptops.svg"
          />
          <AdminTextarea
            label="Product images"
            name="productImages"
            rows={4}
            defaultValue={stateValue(
              state,
              "productImages",
              product?.images.map((image) => image.url).join("\n"),
            )}
            error={fieldError(state, "productImages")}
            placeholder="/catalog/placeholders/laptops.svg"
          />
          <p className="-mt-2 text-xs font-bold text-[#5f6f85]">
            TODO Phase 6+: replace URL fields with cloud-backed image storage.
          </p>
        </div>
      </section>

      <section className="rounded-lg border border-[#cfe0f2] bg-white p-5 shadow-sm">
        <div className="grid gap-5 lg:grid-cols-2">
          <AdminTextarea
            label="Tags"
            name="tags"
            rows={4}
            defaultValue={stateValue(
              state,
              "tags",
              product ? formatJsonListInput(product.tags) : "",
            )}
            error={fieldError(state, "tags")}
            placeholder="5g&#10;creator&#10;wireless charging"
          />
          <AdminTextarea
            label="Specifications"
            name="specifications"
            rows={4}
            defaultValue={stateValue(
              state,
              "specifications",
              product ? formatSpecificationsInput(product.specifications) : "",
            )}
            error={fieldError(state, "specifications")}
            placeholder="Display: 6.8 inch OLED&#10;Storage: 256GB"
          />
        </div>
        <div className="mt-5">
          <AdminTextarea
            label="Warranty info"
            name="warrantyInfo"
            rows={3}
            required
            defaultValue={stateValue(state, "warrantyInfo", product?.warrantyInfo)}
            error={fieldError(state, "warrantyInfo")}
          />
        </div>
      </section>

      <section className="rounded-lg border border-[#cfe0f2] bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-3">
          <AdminCheckbox
            label="Featured product"
            name="isFeatured"
            defaultChecked={checkedValue(
              state.values,
              "isFeatured",
              product?.isFeatured,
            )}
          />
          <AdminCheckbox
            label="New arrival"
            name="isNewArrival"
            defaultChecked={checkedValue(
              state.values,
              "isNewArrival",
              product?.isNewArrival,
            )}
          />
          <AdminCheckbox
            label="Best seller"
            name="isBestSeller"
            defaultChecked={checkedValue(
              state.values,
              "isBestSeller",
              product?.isBestSeller,
            )}
          />
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <AdminSubmitButton pendingLabel={product ? "Saving..." : "Creating..."}>
          {product ? "Save changes" : "Create product"}
        </AdminSubmitButton>
        <Link
          href="/admin/products"
          className="inline-flex h-11 items-center justify-center rounded-lg border border-[#9fc5e8] bg-white px-5 text-sm font-black text-[#334155] transition hover:border-[#4f9ed8] hover:bg-[#eaf6ff]"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
