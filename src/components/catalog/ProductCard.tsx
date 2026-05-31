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
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-[#cfe0f2] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#9fc5e8] hover:shadow-2xl hover:shadow-[#2f5f8f]/10">
      <Link
        href={`/products/${product.slug}`}
        className="relative block h-56 overflow-hidden bg-[#edf6ff]"
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
            <span className="rounded-full bg-[#c7e8ff] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#1f2a44]">
              New
            </span>
          ) : null}
          {product.isBestSeller ? (
            <span className="rounded-full bg-[#b9e2ff] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#1f2a44]">
              Best seller
            </span>
          ) : null}
          {discount ? (
            <span className="rounded-full bg-[#1f2a44] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-white">
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
              className="text-xs font-black uppercase tracking-[0.14em] text-[#2f7fb3] hover:text-[#2f5f8f]"
            >
              {product.brand.name}
            </Link>
            <h3 className="mt-2 text-lg font-black tracking-normal text-[#1f2a44]">
              <Link href={`/products/${product.slug}`} className="hover:text-[#2f7fb3]">
                {product.name}
              </Link>
            </h3>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-[#eaf6ff] px-2 py-1 text-xs font-black text-[#334155]">
            <Star className="h-3.5 w-3.5 fill-[#c7e8ff] text-[#4f9ed8]" />
            4.8
          </div>
        </div>

        <Link
          href={`/categories/${product.category.slug}`}
          className="mt-3 w-fit rounded-full bg-[#eef7ff] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#5f6f85] transition hover:bg-[#dbeeff] hover:text-[#1f2a44]"
        >
          {product.category.name}
        </Link>

        <p className="mt-3 flex-1 text-sm leading-6 text-[#5f6f85]">
          {product.shortDescription}
        </p>

        <div className="mt-5 border-t border-[#edf6ff] pt-4">
          <div>
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-2xl font-black tracking-normal text-[#1f2a44]">
                {formatCurrency(activePrice)}
              </span>
              {product.salePrice ? (
                <span className="text-sm font-bold text-[#8b96a8] line-through">
                  {formatCurrency(product.price)}
                </span>
              ) : null}
            </div>
            <p
              className={`mt-1 text-xs font-bold ${
                product.stockQuantity > 0 ? "text-[#2f7fb3]" : "text-[#9f2f28]"
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
              className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#334155] px-4 text-sm font-black text-white transition hover:bg-[#2f7fb3]"
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
