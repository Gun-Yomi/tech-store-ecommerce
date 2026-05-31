import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WishlistItemControls } from "@/components/shopping/WishlistItemControls";
import { requireUser } from "@/lib/auth/guards";
import { formatCurrency } from "@/lib/format";
import { getWishlistPageData } from "@/lib/shopping";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Review and move wishlist products into your cart.",
};

export default async function WishlistPage() {
  const user = await requireUser();
  const wishlistItems = await getWishlistPageData(user.id);

  return (
    <>
      <Header />
      <main className="bg-[#f5f9ff]">
        <section className="border-b border-[#cfe0f2] bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f7fb3]">
              Wishlist
            </p>
            <div className="mt-3 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <h1 className="text-4xl font-black tracking-normal text-[#1f2a44] sm:text-5xl">
                  Saved favorites
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-[#5f6f85]">
                  Keep track of products you want to revisit and move ready
                  items into your cart.
                </p>
              </div>
              <div className="rounded-lg border border-[#cfe0f2] bg-[#f7fbff] px-5 py-4 text-sm font-black text-[#334155]">
                {wishlistItems.length} items
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {wishlistItems.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {wishlistItems.map((item) => {
                  const price = item.product.salePrice ?? item.product.price;

                  return (
                    <article
                      key={item.id}
                      className="grid gap-4 rounded-lg border border-[#cfe0f2] bg-white p-4 shadow-sm sm:grid-cols-[140px_1fr] sm:p-5"
                    >
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#edf6ff]"
                      >
                        <Image
                          src={item.product.featuredImage}
                          alt={item.product.name}
                          fill
                          unoptimized
                          sizes="140px"
                          className="object-cover"
                        />
                      </Link>
                      <div className="space-y-4">
                        <div>
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="text-lg font-black tracking-normal text-[#1f2a44] hover:text-[#2f7fb3]"
                          >
                            {item.product.name}
                          </Link>
                          <p className="mt-2 text-sm font-bold text-[#5f6f85]">
                            {item.product.brand.name} / {item.product.category.name}
                          </p>
                          <div className="mt-3 flex flex-wrap items-baseline gap-2">
                            <span className="text-2xl font-black text-[#1f2a44]">
                              {formatCurrency(price)}
                            </span>
                            {item.product.salePrice ? (
                              <span className="text-sm font-bold text-[#8b96a8] line-through">
                                {formatCurrency(item.product.price)}
                              </span>
                            ) : null}
                          </div>
                          <p
                            className={`mt-2 text-xs font-black ${
                              item.product.stockQuantity > 0
                                ? "text-[#2f7fb3]"
                                : "text-[#9f2f28]"
                            }`}
                          >
                            {item.product.stockQuantity > 0
                              ? `${item.product.stockQuantity} in stock`
                              : "Out of stock"}
                          </p>
                        </div>
                        <WishlistItemControls
                          wishlistItemId={item.id}
                          outOfStock={item.product.stockQuantity < 1}
                        />
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-[#9fc5e8] bg-white p-8 text-center shadow-sm">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-[#eaf6ff] text-[#334155]">
                  <Heart className="h-7 w-7" />
                </span>
                <h2 className="mt-5 text-2xl font-black tracking-normal text-[#1f2a44]">
                  Your wishlist is empty
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#5f6f85]">
                  Add products from cards or detail pages to keep favorites in
                  one place.
                </p>
                <Link
                  href="/products"
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[#4f9ed8] px-5 text-sm font-black text-white transition hover:bg-[#2f7fb3]"
                >
                  Browse products
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
