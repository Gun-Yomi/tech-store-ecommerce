type ProductSearchProps = {
  defaultValue?: string;
};

export function ProductSearch({ defaultValue }: ProductSearchProps) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.14em] text-[#5f7d33]">
        Search
      </span>
      <input
        name="search"
        type="search"
        defaultValue={defaultValue}
        placeholder="Name, SKU, brand, tags..."
        className="mt-2 h-12 w-full rounded-lg border border-[#d7dfbd] bg-white px-4 text-sm font-semibold text-[#253326] outline-none transition placeholder:text-[#75806f] hover:border-[#b7c891] focus:border-[#6e8f3d] focus:ring-4 focus:ring-[#e5efcd]"
      />
    </label>
  );
}
