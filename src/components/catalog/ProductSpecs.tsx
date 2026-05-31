type ProductSpecsProps = {
  specifications: Record<string, string>;
};

export function ProductSpecs({ specifications }: ProductSpecsProps) {
  const entries = Object.entries(specifications);

  if (entries.length === 0) {
    return null;
  }

  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {entries.map(([label, value]) => (
        <div
          key={label}
          className="rounded-lg border border-[#d7dfbd] bg-[#f7f9ef] p-4"
        >
          <dt className="text-xs font-black uppercase tracking-[0.14em] text-[#5f7d33]">
            {label}
          </dt>
          <dd className="mt-2 text-sm font-bold text-[#253326]">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
