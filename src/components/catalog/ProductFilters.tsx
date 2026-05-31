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
      className="rounded-lg border border-[#d7dfbd] bg-[#f7f9ef] p-4 shadow-sm sm:p-5"
    >
      <div className="grid gap-4 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <ProductSearch defaultValue={filters.search} />
        </div>

        {!hideCategoryFilter ? (
          <label className="block">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-[#5f7d33]">
              Category
            </span>
            <select
              name="category"
              defaultValue={filters.category ?? ""}
              className="mt-2 h-12 w-full rounded-lg border border-[#d7dfbd] bg-white px-4 text-sm font-semibold text-[#253326] outline-none transition hover:border-[#b7c891] focus:border-[#6e8f3d] focus:ring-4 focus:ring-[#e5efcd]"
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
            <span className="text-xs font-black uppercase tracking-[0.14em] text-[#5f7d33]">
              Brand
            </span>
            <select
              name="brand"
              defaultValue={filters.brand ?? ""}
              className="mt-2 h-12 w-full rounded-lg border border-[#d7dfbd] bg-white px-4 text-sm font-semibold text-[#253326] outline-none transition hover:border-[#b7c891] focus:border-[#6e8f3d] focus:ring-4 focus:ring-[#e5efcd]"
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
          <span className="text-xs font-black uppercase tracking-[0.14em] text-[#5f7d33]">
            Min price
          </span>
          <input
            name="minPrice"
            type="number"
            min="0"
            defaultValue={centsToDollars(filters.minPrice)}
            placeholder="$0"
            className="mt-2 h-12 w-full rounded-lg border border-[#d7dfbd] bg-white px-4 text-sm font-semibold text-[#253326] outline-none transition placeholder:text-[#75806f] hover:border-[#b7c891] focus:border-[#6e8f3d] focus:ring-4 focus:ring-[#e5efcd]"
          />
        </label>

        <label className="block">
          <span className="text-xs font-black uppercase tracking-[0.14em] text-[#5f7d33]">
            Max price
          </span>
          <input
            name="maxPrice"
            type="number"
            min="0"
            defaultValue={centsToDollars(filters.maxPrice)}
            placeholder="$3000"
            className="mt-2 h-12 w-full rounded-lg border border-[#d7dfbd] bg-white px-4 text-sm font-semibold text-[#253326] outline-none transition placeholder:text-[#75806f] hover:border-[#b7c891] focus:border-[#6e8f3d] focus:ring-4 focus:ring-[#e5efcd]"
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <ProductSort defaultValue={filters.sort} />
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#d7dfbd] bg-white px-4 text-sm font-black text-[#253326]">
            <input
              type="checkbox"
              name="inStock"
              value="true"
              defaultChecked={filters.inStock}
              className="h-4 w-4 accent-[#6e8f3d]"
            />
            In stock only
          </label>
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-[#344554] px-5 text-sm font-black text-white transition hover:bg-[#5f7d33]"
          >
            Apply filters
          </button>
          <Link
            href={basePath}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-[#b7c891] bg-white px-5 text-sm font-black text-[#344554] transition hover:border-[#6e8f3d] hover:bg-[#eef4df]"
          >
            Clear
          </Link>
        </div>
      </div>
    </form>
  );
}
