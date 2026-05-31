import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { CatalogProduct } from "@/lib/catalog";
import { calculateDiscountPercent, formatCurrency } from "@/lib/format";
import { ProductQuickActions } from "@/components/shopping/ProductQuickActions";

type ProductCardProps = {
  product: CatalogProduct;
};

export function ProductCard({ product }: ProductCardProps) {
  const activePrice = product.salePrice ?? product.price;
  const discount = calculateDiscountPercent(product.price, product.salePrice);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-[#d7dfbd] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#b7c891] hover:shadow-2xl hover:shadow-[#435d2d]/10">
      <Link
        href={`/products/${product.slug}`}
        className="relative block h-56 overflow-hidden bg-[#edf1df]"
        aria-label={`View ${product.name}`}
      >
        <Image
          src={product.featuredImage}
          alt={product.name}
          fill
          unoptimized
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
          {discount ? (
            <span className="rounded-full bg-[#253326] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-white">
              {discount}% off
            </span>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link
              href={`/brands/${product.brand.slug}`}
              className="text-xs font-black uppercase tracking-[0.14em] text-[#5f7d33] hover:text-[#435d2d]"
            >
              {product.brand.name}
            </Link>
            <h3 className="mt-2 text-lg font-black tracking-normal text-[#253326]">
              <Link href={`/products/${product.slug}`} className="hover:text-[#5f7d33]">
                {product.name}
              </Link>
            </h3>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-[#eef4df] px-2 py-1 text-xs font-black text-[#344554]">
            <Star className="h-3.5 w-3.5 fill-[#d8e978] text-[#6e8f3d]" />
            4.8
          </div>
        </div>

        <Link
          href={`/categories/${product.category.slug}`}
          className="mt-3 w-fit rounded-full bg-[#f1f6e6] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#60705d] transition hover:bg-[#e1edc0] hover:text-[#253326]"
        >
          {product.category.name}
        </Link>

        <p className="mt-3 flex-1 text-sm leading-6 text-[#60705d]">
          {product.shortDescription}
        </p>

        <div className="mt-5 border-t border-[#edf1df] pt-4">
          <div>
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-2xl font-black tracking-normal text-[#253326]">
                {formatCurrency(activePrice)}
              </span>
              {product.salePrice ? (
                <span className="text-sm font-bold text-[#89937c] line-through">
                  {formatCurrency(product.price)}
                </span>
              ) : null}
            </div>
            <p
              className={`mt-1 text-xs font-bold ${
                product.stockQuantity > 0 ? "text-[#5f7d33]" : "text-[#9f2f28]"
              }`}
            >
              {product.stockQuantity > 0
                ? `${product.stockQuantity} in stock`
                : "Out of stock"}
            </p>
          </div>

          <div className="mt-4">
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#344554] px-4 text-sm font-black text-white transition hover:bg-[#5f7d33]"
            >
              View details
            </Link>
          </div>
          <div className="mt-3">
            <ProductQuickActions
              productId={product.id}
              productName={product.name}
              outOfStock={product.stockQuantity < 1}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
