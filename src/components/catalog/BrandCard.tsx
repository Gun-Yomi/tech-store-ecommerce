import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CatalogBrand } from "@/lib/catalog";

type BrandCardProps = {
  brand: CatalogBrand;
};

export function BrandCard({ brand }: BrandCardProps) {
  return (
    <Link
      href={`/brands/${brand.slug}`}
      className="group rounded-lg border border-[#cfe0f2] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#9fc5e8] hover:shadow-2xl hover:shadow-[#2f5f8f]/10"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="relative h-16 w-24 overflow-hidden rounded-lg border border-[#cfe0f2] bg-[#f2f8ff]">
          <Image
            src={brand.logo}
            alt=""
            fill
            unoptimized
            sizes="96px"
            className="object-cover"
          />
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#eaf6ff] text-[#334155] transition group-hover:-translate-y-1 group-hover:translate-x-1">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
      <h3 className="mt-5 text-xl font-black tracking-normal text-[#1f2a44]">
        {brand.name}
      </h3>
      <p className="mt-2 text-sm leading-6 text-[#5f6f85]">{brand.description}</p>
      <p className="mt-4 text-xs font-black uppercase tracking-[0.14em] text-[#2f7fb3]">
        {brand.productCount} products
      </p>
    </Link>
  );
}
