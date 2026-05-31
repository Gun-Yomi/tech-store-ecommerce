import Link from "next/link";
import type { CatalogProduct } from "@/lib/catalog";
import { ProductCard } from "./catalog/ProductCard";

type FeaturedProductsProps = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  products: CatalogProduct[];
  alternate?: boolean;
};

export function FeaturedProducts({
  id,
  eyebrow,
  title,
  description,
  products,
  alternate = false,
}: FeaturedProductsProps) {
  return (
    <section id={id} className={`${alternate ? "bg-white" : "bg-[#f5f7ee]"} py-16 sm:py-20`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#5f7d33]">
              {eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-normal text-[#253326] sm:text-4xl">
              {title}
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[#60705d]">
            {description}
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/products"
            className="inline-flex h-12 items-center justify-center rounded-lg border border-[#b7c891] bg-white px-6 text-sm font-black text-[#344554] transition hover:border-[#6e8f3d] hover:bg-[#eef4df]"
          >
            View full catalog
          </Link>
        </div>
      </div>
    </section>
  );
}
