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
          className="rounded-lg border border-[#cfe0f2] bg-[#f7fbff] p-4"
        >
          <dt className="text-xs font-black uppercase tracking-[0.14em] text-[#2f7fb3]">
            {label}
          </dt>
          <dd className="mt-2 text-sm font-bold text-[#1f2a44]">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
