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
      className="group rounded-lg border border-[#d7dfbd] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#b7c891] hover:shadow-2xl hover:shadow-[#435d2d]/10"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="relative h-16 w-24 overflow-hidden rounded-lg border border-[#d7dfbd] bg-[#f3f7e8]">
          <Image
            src={brand.logo}
            alt=""
            fill
            unoptimized
            sizes="96px"
            className="object-cover"
          />
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#eef4df] text-[#344554] transition group-hover:-translate-y-1 group-hover:translate-x-1">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
      <h3 className="mt-5 text-xl font-black tracking-normal text-[#253326]">
        {brand.name}
      </h3>
      <p className="mt-2 text-sm leading-6 text-[#60705d]">{brand.description}</p>
      <p className="mt-4 text-xs font-black uppercase tracking-[0.14em] text-[#5f7d33]">
        {brand.productCount} products
      </p>
    </Link>
  );
}
