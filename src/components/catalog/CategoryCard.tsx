import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CatalogCategory } from "@/lib/catalog";

type CategoryCardProps = {
  category: CatalogCategory;
};

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative min-h-64 overflow-hidden rounded-lg bg-[#1f2a44] p-6 text-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#2f5f8f]/18 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#76b7e5]"
    >
      <Image
        src={category.image}
        alt=""
        fill
        unoptimized
        sizes="(min-width: 1024px) 33vw, 100vw"
        className="object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1f2a44]/10 to-[#1f2a44]/90" />
      <div className="relative flex h-full min-h-52 flex-col justify-between">
        <span className="w-fit rounded-full border border-white/18 bg-white/16 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-[#eff8ff] backdrop-blur">
          {category.productCount} products
        </span>
        <div>
          <div className="mb-3 flex items-center justify-between gap-4">
            <h3 className="text-2xl font-black tracking-normal">{category.name}</h3>
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-white text-[#334155] transition group-hover:-translate-y-1 group-hover:translate-x-1">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
          <p className="max-w-sm text-sm leading-6 text-[#e8f4ff]">
            {category.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
