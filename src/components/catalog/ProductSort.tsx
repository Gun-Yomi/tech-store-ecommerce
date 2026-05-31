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
      <span className="text-xs font-black uppercase tracking-[0.14em] text-[#5f7d33]">
        Sort
      </span>
      <select
        name="sort"
        defaultValue={defaultValue}
        className="mt-2 h-12 w-full rounded-lg border border-[#d7dfbd] bg-white px-4 text-sm font-semibold text-[#253326] outline-none transition hover:border-[#b7c891] focus:border-[#6e8f3d] focus:ring-4 focus:ring-[#e5efcd]"
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
