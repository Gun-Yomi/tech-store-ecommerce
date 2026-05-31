import Image from "next/image";
import { Heart, ShoppingBag, Star } from "lucide-react";
import type { Product } from "@/types/product";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const activePrice = product.salePrice ?? product.price;

  return (
    <article
      id={`product-${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-[#cfe0f2] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#9fc5e8] hover:shadow-2xl hover:shadow-[#2f5f8f]/10"
    >
      <div className="relative h-56 overflow-hidden bg-[#edf6ff]">
        <Image
          src={product.featuredImage}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {product.isNewArrival ? (
            <span className="rounded-full bg-[#c7e8ff] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#1f2a44]">
              New
            </span>
          ) : null}
          {product.isBestSeller ? (
            <span className="rounded-full bg-[#b9e2ff] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#1f2a44]">
              Best seller
            </span>
          ) : null}
        </div>
        {/* TODO(Phase 4): Persist wishlist actions per authenticated user. */}
        <button
          type="button"
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-lg border border-white/70 bg-white/90 text-[#334155] shadow-sm transition hover:text-[#2f7fb3]"
          aria-label={`Wishlist ${product.name} placeholder`}
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#2f7fb3]">
              {product.brand}
            </p>
            <h3 className="mt-2 text-lg font-black tracking-normal text-[#1f2a44]">
              {product.name}
            </h3>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-[#eaf6ff] px-2 py-1 text-xs font-black text-[#334155]">
            <Star className="h-3.5 w-3.5 fill-[#c7e8ff] text-[#4f9ed8]" />
            4.8
          </div>
        </div>

        <p className="mt-3 flex-1 text-sm leading-6 text-[#5f6f85]">
          {product.shortDescription}
        </p>

        <div className="mt-5 flex items-end justify-between gap-3 border-t border-[#edf6ff] pt-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black tracking-normal text-[#1f2a44]">
                {currencyFormatter.format(activePrice)}
              </span>
              {product.salePrice ? (
                <span className="text-sm font-bold text-[#8b96a8] line-through">
                  {currencyFormatter.format(product.price)}
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-xs font-bold text-[#2f7fb3]">
              {product.stockQuantity > 0
                ? `${product.stockQuantity} in stock`
                : "Out of stock"}
            </p>
          </div>
          {/* TODO(Phase 4): Replace this placeholder with add-to-cart behavior. */}
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-lg bg-[#334155] text-white transition hover:bg-[#2f7fb3]"
            aria-label={`Add ${product.name} to cart placeholder`}
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
