type ProductSearchProps = {
  defaultValue?: string;
};

export function ProductSearch({ defaultValue }: ProductSearchProps) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.14em] text-[#2f7fb3]">
        Search
      </span>
      <input
        name="search"
        type="search"
        defaultValue={defaultValue}
        placeholder="Name, SKU, brand, tags..."
        className="mt-2 h-12 w-full rounded-lg border border-[#cfe0f2] bg-white px-4 text-sm font-semibold text-[#1f2a44] outline-none transition placeholder:text-[#758398] hover:border-[#9fc5e8] focus:border-[#4f9ed8] focus:ring-4 focus:ring-[#dff0ff]"
      />
    </label>
  );
}
