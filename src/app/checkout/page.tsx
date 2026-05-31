import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { CheckoutForm } from "@/components/orders/CheckoutForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { requireUser } from "@/lib/auth/guards";
import { formatCurrency } from "@/lib/format";
import { getCheckoutCart } from "@/lib/orders/data";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Submit a manual order for store products.",
};

function itemIsPurchasable(item: NonNullable<Awaited<ReturnType<typeof getCheckoutCart>>>["items"][number]) {
  return (
    item.product.status === "ACTIVE" &&
    item.product.brand.status === "ACTIVE" &&
    item.product.category.status === "ACTIVE" &&
    item.product.stockQuantity >= item.quantity &&
    item.quantity > 0
  );
}

export default async function CheckoutPage() {
  const user = await requireUser();
  const cart = await getCheckoutCart(user.id);
  const items = cart?.items ?? [];
  const subtotal = items.reduce((total, item) => {
    const unitPrice = item.product.salePrice ?? item.product.price;
    return total + unitPrice * item.quantity;
  }, 0);
  const blockingItems = items.filter((item) => !itemIsPurchasable(item));

  return (
    <>
      <Header />
      <main className="bg-[#f5f9ff]">
        <section className="border-b border-[#cfe0f2] bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-sm font-black text-[#2f7fb3] hover:text-[#2f5f8f]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to cart
            </Link>
            <p className="mt-5 text-sm font-black uppercase tracking-[0.18em] text-[#2f7fb3]">
              Checkout
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-normal text-[#1f2a44] sm:text-5xl">
              Manual order checkout
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#5f6f85]">
              Submit your cart for manual confirmation. Payment gateway
              integration is reserved for a later phase.
            </p>
          </div>
        </section>

        <section className="py-10 sm:py-12">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
            {items.length > 0 ? (
              <CheckoutForm user={user} disabled={blockingItems.length > 0} />
            ) : (
              <div className="rounded-lg border border-dashed border-[#9fc5e8] bg-white p-8 text-center shadow-sm">
                <h2 className="text-2xl font-black tracking-normal text-[#1f2a44]">
                  Your cart is empty
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#5f6f85]">
                  Add active products before starting checkout.
                </p>
                <Link
                  href="/products"
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[#334155] px-5 text-sm font-black text-white transition hover:bg-[#2f7fb3]"
                >
                  Browse products
                </Link>
              </div>
            )}

            <aside className="h-fit rounded-lg border border-[#cfe0f2] bg-white p-6 shadow-sm">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f7fb3]">
                Order summary
              </p>
              <div className="mt-5 space-y-4">
                {items.map((item) => {
                  const unitPrice = item.product.salePrice ?? item.product.price;
                  const blocked = !itemIsPurchasable(item);

                  return (
                    <article key={item.id} className="flex gap-3">
                      <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-[#edf6ff]">
                        <Image
                          src={item.product.featuredImage}
                          alt={item.product.name}
                          fill
                          unoptimized
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-black text-[#1f2a44]">
                          {item.product.name}
                        </p>
                        <p className="mt-1 text-xs font-bold text-[#5f6f85]">
                          Qty {item.quantity} / {formatCurrency(unitPrice)}
                        </p>
                        {blocked ? (
                          <p className="mt-2 flex items-center gap-1 text-xs font-black text-[#9f2f28]">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            Review stock or availability in cart
                          </p>
                        ) : null}
                      </div>
                      <p className="text-sm font-black text-[#1f2a44]">
                        {formatCurrency(unitPrice * item.quantity)}
                      </p>
                    </article>
                  );
                })}
              </div>
              <div className="mt-6 space-y-3 border-t border-[#edf6ff] pt-5 text-sm font-bold text-[#5f6f85]">
                <div className="flex justify-between gap-4">
                  <span>Subtotal</span>
                  <span className="text-[#1f2a44]">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Shipping</span>
                  <span className="text-[#1f2a44]">Manual quote later</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Tax</span>
                  <span className="text-[#1f2a44]">Manual review</span>
                </div>
                <div className="flex justify-between gap-4 border-t border-[#edf6ff] pt-3 text-base">
                  <span>Estimated total</span>
                  <span className="text-[#1f2a44]">{formatCurrency(subtotal)}</span>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
