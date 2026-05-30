import type { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

type FeaturedProductsProps = {
  products: Product[];
};

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const featuredProducts = products.filter((product) => product.isFeatured).slice(0, 8);

  return (
    <section id="featured-products" className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-700">
              Featured deals
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-normal text-slate-950 sm:text-4xl">
              Premium picks with launch pricing
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-600">
            Launch selections spanning mobile, portable work, gaming systems,
            creator cameras, and desk upgrades.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
