import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, ArrowRight, ShoppingCart } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CartItemControls } from "@/components/shopping/CartItemControls";
import { SavedItemControls } from "@/components/shopping/SavedItemControls";
import { requireUser } from "@/lib/auth/guards";
import { formatCurrency } from "@/lib/format";
import { getCartPageData } from "@/lib/shopping";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your cart and save items for later.",
};

export default async function CartPage() {
  const user = await requireUser();
  const cart = await getCartPageData(user.id);
  const blockingItems = cart.cartItems.filter(
    (item) =>
      item.product.status !== "ACTIVE" ||
      item.product.brand.status !== "ACTIVE" ||
      item.product.category.status !== "ACTIVE" ||
      item.product.stockQuantity < item.quantity ||
      item.quantity < 1,
  );

  return (
    <>
      <Header />
      <main className="bg-[#f5f9ff]">
        <section className="border-b border-[#cfe0f2] bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f7fb3]">
              Cart
            </p>
            <div className="mt-3 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <h1 className="text-4xl font-black tracking-normal text-[#1f2a44] sm:text-5xl">
                  Your shopping cart
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-[#5f6f85]">
                  Manage quantities, remove products, or save items for later.
                  Checkout now submits a manual order for confirmation.
                </p>
              </div>
              <div className="rounded-lg border border-[#cfe0f2] bg-[#f7fbff] px-5 py-4 text-sm font-black text-[#334155]">
                {cart.itemCount} items
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-12">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
            <div className="space-y-8">
              {cart.cartItems.length > 0 ? (
                <div className="space-y-4">
                  {cart.cartItems.map((item) => {
                    const price = item.product.salePrice ?? item.product.price;
                    const lineTotal = price * item.quantity;

                    return (
                      <article
                        key={item.id}
                        className="grid gap-4 rounded-lg border border-[#cfe0f2] bg-white p-4 shadow-sm sm:grid-cols-[150px_1fr] sm:p-5"
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
                            sizes="150px"
                            className="object-cover"
                          />
                        </Link>
                        <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
                          <div>
                            <Link
                              href={`/products/${item.product.slug}`}
                              className="text-xl font-black tracking-normal text-[#1f2a44] hover:text-[#2f7fb3]"
                            >
                              {item.product.name}
                            </Link>
                            <p className="mt-2 text-sm font-bold text-[#5f6f85]">
                              {item.product.brand.name} / {item.product.category.name}
                            </p>
                            <div className="mt-4 flex flex-wrap items-baseline gap-2">
                              <span className="text-2xl font-black text-[#1f2a44]">
                                {formatCurrency(price)}
                              </span>
                              {item.product.salePrice ? (
                                <span className="text-sm font-bold text-[#8b96a8] line-through">
                                  {formatCurrency(item.product.price)}
                                </span>
                              ) : null}
                              <span className="text-sm font-bold text-[#5f6f85]">
                                Line: {formatCurrency(lineTotal)}
                              </span>
                            </div>
                            <p
                              className={`mt-2 text-xs font-black ${
                                item.product.stockQuantity >= item.quantity &&
                                item.product.status === "ACTIVE" &&
                                item.product.brand.status === "ACTIVE" &&
                                item.product.category.status === "ACTIVE"
                                  ? "text-[#2f7fb3]"
                                  : "text-[#9f2f28]"
                              }`}
                            >
                              {item.product.status !== "ACTIVE" ||
                              item.product.brand.status !== "ACTIVE" ||
                              item.product.category.status !== "ACTIVE"
                                ? "No longer available"
                                : item.product.stockQuantity >= item.quantity
                                  ? `${item.product.stockQuantity} in stock`
                                  : `Only ${item.product.stockQuantity} available`}
                            </p>
                          </div>
                          <CartItemControls
                            cartItemId={item.id}
                            initialQuantity={item.quantity}
                            maxQuantity={item.product.stockQuantity}
                          />
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-[#9fc5e8] bg-white p-8 text-center shadow-sm">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-[#eaf6ff] text-[#334155]">
                    <ShoppingCart className="h-7 w-7" />
                  </span>
                  <h2 className="mt-5 text-2xl font-black tracking-normal text-[#1f2a44]">
                    Your cart is empty
                  </h2>
                  <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#5f6f85]">
                    Add active products from the catalog to start building your
                    setup.
                  </p>
                  <Link
                    href="/products"
                    className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[#4f9ed8] px-5 text-sm font-black text-white transition hover:bg-[#2f7fb3]"
                  >
                    Continue shopping
                  </Link>
                </div>
              )}

              <section id="saved-items" className="scroll-mt-28 space-y-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f7fb3]">
                    Save for later
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-normal text-[#1f2a44]">
                    Saved items
                  </h2>
                </div>
                {cart.savedItems.length > 0 ? (
                  <div className="grid gap-4">
                    {cart.savedItems.map((item) => (
                      <article
                        key={item.id}
                        className="grid gap-4 rounded-lg border border-[#cfe0f2] bg-white p-4 shadow-sm sm:grid-cols-[120px_1fr] sm:p-5"
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
                            sizes="120px"
                            className="object-cover"
                          />
                        </Link>
                        <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
                          <div>
                            <Link
                              href={`/products/${item.product.slug}`}
                              className="text-lg font-black tracking-normal text-[#1f2a44] hover:text-[#2f7fb3]"
                            >
                              {item.product.name}
                            </Link>
                            <p className="mt-2 text-sm font-bold text-[#5f6f85]">
                              Qty saved: {item.quantity}
                            </p>
                          </div>
                          <SavedItemControls
                            savedItemId={item.id}
                            outOfStock={item.product.stockQuantity < 1}
                          />
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-[#9fc5e8] bg-white p-5 text-sm font-semibold text-[#5f6f85]">
                    No saved items yet.
                  </div>
                )}
              </section>
            </div>

            <aside className="h-fit rounded-lg border border-[#cfe0f2] bg-white p-6 shadow-sm">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f7fb3]">
                Summary
              </p>
              <div className="mt-5 space-y-3 border-b border-[#edf6ff] pb-5 text-sm font-bold text-[#5f6f85]">
                <div className="flex justify-between gap-4">
                  <span>Subtotal</span>
                  <span className="text-[#1f2a44]">{formatCurrency(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Estimated total</span>
                  <span className="text-[#1f2a44]">{formatCurrency(cart.subtotal)}</span>
                </div>
              </div>
              {blockingItems.length > 0 ? (
                <div className="mt-5 rounded-lg border border-[#e5b2a8] bg-[#fff4f1] p-4 text-sm font-bold text-[#9f2f28]">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Review unavailable or low-stock items before checkout.
                  </span>
                </div>
              ) : null}
              {cart.cartItems.length > 0 && blockingItems.length === 0 ? (
                <Link
                  href="/checkout"
                  className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#334155] px-5 text-sm font-black text-white transition hover:bg-[#2f7fb3]"
                >
                  Proceed to checkout
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="mt-5 inline-flex h-12 w-full cursor-not-allowed items-center justify-center rounded-lg bg-[#a7b7c8] px-5 text-sm font-black text-white"
                >
                  Checkout unavailable
                </button>
              )}
              <Link
                href="/products"
                className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-[#9fc5e8] bg-white px-5 text-sm font-black text-[#334155] transition hover:border-[#4f9ed8] hover:bg-[#eaf6ff]"
              >
                Continue shopping
                <ArrowRight className="h-4 w-4" />
              </Link>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
