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
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-[#d7dfbd] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#b7c891] hover:shadow-2xl hover:shadow-[#435d2d]/10"
    >
      <div className="relative h-56 overflow-hidden bg-[#edf1df]">
        <Image
          src={product.featuredImage}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {product.isNewArrival ? (
            <span className="rounded-full bg-[#d8e978] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#253326]">
              New
            </span>
          ) : null}
          {product.isBestSeller ? (
            <span className="rounded-full bg-[#b8d892] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#253326]">
              Best seller
            </span>
          ) : null}
        </div>
        {/* TODO(Phase 4): Persist wishlist actions per authenticated user. */}
        <button
          type="button"
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-lg border border-white/70 bg-white/90 text-[#344554] shadow-sm transition hover:text-[#5f7d33]"
          aria-label={`Wishlist ${product.name} placeholder`}
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#5f7d33]">
              {product.brand}
            </p>
            <h3 className="mt-2 text-lg font-black tracking-normal text-[#253326]">
              {product.name}
            </h3>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-[#eef4df] px-2 py-1 text-xs font-black text-[#344554]">
            <Star className="h-3.5 w-3.5 fill-[#d8e978] text-[#6e8f3d]" />
            4.8
          </div>
        </div>

        <p className="mt-3 flex-1 text-sm leading-6 text-[#60705d]">
          {product.shortDescription}
        </p>

        <div className="mt-5 flex items-end justify-between gap-3 border-t border-[#edf1df] pt-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black tracking-normal text-[#253326]">
                {currencyFormatter.format(activePrice)}
              </span>
              {product.salePrice ? (
                <span className="text-sm font-bold text-[#89937c] line-through">
                  {currencyFormatter.format(product.price)}
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-xs font-bold text-[#5f7d33]">
              {product.stockQuantity > 0
                ? `${product.stockQuantity} in stock`
                : "Out of stock"}
            </p>
          </div>
          {/* TODO(Phase 4): Replace this placeholder with add-to-cart behavior. */}
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-lg bg-[#344554] text-white transition hover:bg-[#5f7d33]"
            aria-label={`Add ${product.name} to cart placeholder`}
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
