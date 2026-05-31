import Link from "next/link";
import type {
  CatalogBrand,
  CatalogCategory,
  ProductFilters as ProductFilterValues,
} from "@/lib/catalog";
import { ProductSearch } from "./ProductSearch";
import { ProductSort } from "./ProductSort";

type ProductFiltersProps = {
  basePath?: string;
  filters: ProductFilterValues;
  categories: CatalogCategory[];
  brands: CatalogBrand[];
  hideCategoryFilter?: boolean;
  hideBrandFilter?: boolean;
};

function centsToDollars(value?: number) {
  return typeof value === "number" ? String(Math.round(value / 100)) : "";
}

export function ProductFilters({
  basePath = "/products",
  filters,
  categories,
  brands,
  hideCategoryFilter = false,
  hideBrandFilter = false,
}: ProductFiltersProps) {
  return (
    <form
      action={basePath}
      className="rounded-lg border border-[#cfe0f2] bg-[#f7fbff] p-4 shadow-sm sm:p-5"
    >
      <div className="grid gap-4 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <ProductSearch defaultValue={filters.search} />
        </div>

        {!hideCategoryFilter ? (
          <label className="block">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-[#2f7fb3]">
              Category
            </span>
            <select
              name="category"
              defaultValue={filters.category ?? ""}
              className="mt-2 h-12 w-full rounded-lg border border-[#cfe0f2] bg-white px-4 text-sm font-semibold text-[#1f2a44] outline-none transition hover:border-[#9fc5e8] focus:border-[#4f9ed8] focus:ring-4 focus:ring-[#dff0ff]"
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        {!hideBrandFilter ? (
          <label className="block">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-[#2f7fb3]">
              Brand
            </span>
            <select
              name="brand"
              defaultValue={filters.brand ?? ""}
              className="mt-2 h-12 w-full rounded-lg border border-[#cfe0f2] bg-white px-4 text-sm font-semibold text-[#1f2a44] outline-none transition hover:border-[#9fc5e8] focus:border-[#4f9ed8] focus:ring-4 focus:ring-[#dff0ff]"
            >
              <option value="">All brands</option>
              {brands.map((brand) => (
                <option key={brand.slug} value={brand.slug}>
                  {brand.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <label className="block">
          <span className="text-xs font-black uppercase tracking-[0.14em] text-[#2f7fb3]">
            Min price
          </span>
          <input
            name="minPrice"
            type="number"
            min="0"
            defaultValue={centsToDollars(filters.minPrice)}
            placeholder="$0"
            className="mt-2 h-12 w-full rounded-lg border border-[#cfe0f2] bg-white px-4 text-sm font-semibold text-[#1f2a44] outline-none transition placeholder:text-[#758398] hover:border-[#9fc5e8] focus:border-[#4f9ed8] focus:ring-4 focus:ring-[#dff0ff]"
          />
        </label>

        <label className="block">
          <span className="text-xs font-black uppercase tracking-[0.14em] text-[#2f7fb3]">
            Max price
          </span>
          <input
            name="maxPrice"
            type="number"
            min="0"
            defaultValue={centsToDollars(filters.maxPrice)}
            placeholder="$3000"
            className="mt-2 h-12 w-full rounded-lg border border-[#cfe0f2] bg-white px-4 text-sm font-semibold text-[#1f2a44] outline-none transition placeholder:text-[#758398] hover:border-[#9fc5e8] focus:border-[#4f9ed8] focus:ring-4 focus:ring-[#dff0ff]"
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <ProductSort defaultValue={filters.sort} />
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#cfe0f2] bg-white px-4 text-sm font-black text-[#1f2a44]">
            <input
              type="checkbox"
              name="inStock"
              value="true"
              defaultChecked={filters.inStock}
              className="h-4 w-4 accent-[#4f9ed8]"
            />
            In stock only
          </label>
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-[#334155] px-5 text-sm font-black text-white transition hover:bg-[#2f7fb3]"
          >
            Apply filters
          </button>
          <Link
            href={basePath}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-[#9fc5e8] bg-white px-5 text-sm font-black text-[#334155] transition hover:border-[#4f9ed8] hover:bg-[#eaf6ff]"
          >
            Clear
          </Link>
        </div>
      </div>
    </form>
  );
}
