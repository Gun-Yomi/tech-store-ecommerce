import type { ProductSort as ProductSortValue } from "@/lib/catalog";

const sortOptions: { label: string; value: ProductSortValue }[] = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price low to high", value: "price-asc" },
  { label: "Price high to low", value: "price-desc" },
  { label: "Best sellers", value: "best-sellers" },
  { label: "Name A-Z", value: "name-asc" },
];

type ProductSortProps = {
  defaultValue?: ProductSortValue;
};

export function ProductSort({ defaultValue = "featured" }: ProductSortProps) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.14em] text-[#2f7fb3]">
        Sort
      </span>
      <select
        name="sort"
        defaultValue={defaultValue}
        className="mt-2 h-12 w-full rounded-lg border border-[#cfe0f2] bg-white px-4 text-sm font-semibold text-[#1f2a44] outline-none transition hover:border-[#9fc5e8] focus:border-[#4f9ed8] focus:ring-4 focus:ring-[#dff0ff]"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
