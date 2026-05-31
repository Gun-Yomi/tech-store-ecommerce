import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { StatusPill } from "./StatusPill";

type OrderDetailViewProps = {
  order: {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddressLine1: string;
    shippingAddressLine2: string;
    cityParishState: string;
    country: string;
    deliveryMethod: string;
    notes: string;
    subtotal: number;
    discountTotal: number;
    shippingTotal: number;
    taxTotal: number;
    total: number;
    status: string;
    paymentStatus: string;
    createdAt: Date;
    items: Array<{
      id: string;
      productNameSnapshot: string;
      productSkuSnapshot: string;
      priceSnapshot: number;
      salePriceSnapshot: number | null;
      quantity: number;
      lineTotal: number;
      product: {
        slug: string;
        featuredImage: string;
      };
    }>;
  };
  confirmation?: boolean;
  showCustomerLinks?: boolean;
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

export function OrderDetailView({
  order,
  confirmation = false,
  showCustomerLinks = true,
}: OrderDetailViewProps) {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-lg bg-[#1f2a44] p-6 text-white shadow-2xl shadow-[#2f5f8f]/18 sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#c7e8ff]">
              {confirmation ? "Order submitted" : "Order details"}
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-normal">
              {order.orderNumber}
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#e4f1ff]">
              {confirmation
                ? "Your order has been submitted for manual confirmation. Online payment will be added in a later phase."
                : "Review your order status, payment status, items, and customer details."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusPill status={order.status} />
            <StatusPill status={order.paymentStatus} tone="payment" />
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div className="rounded-lg border border-[#cfe0f2] bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-black tracking-normal text-[#1f2a44]">
              Items
            </h2>
            <div className="mt-5 space-y-4">
              {order.items.map((item) => {
                const unitPrice = item.salePriceSnapshot ?? item.priceSnapshot;

                return (
                  <article
                    key={item.id}
                    className="grid gap-4 rounded-lg border border-[#edf6ff] bg-[#f7fbff] p-4 sm:grid-cols-[110px_1fr_auto]"
                  >
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#edf6ff]"
                    >
                      <Image
                        src={item.product.featuredImage}
                        alt={item.productNameSnapshot}
                        fill
                        unoptimized
                        sizes="110px"
                        className="object-cover"
                      />
                    </Link>
                    <div>
                      <h3 className="font-black text-[#1f2a44]">
                        {item.productNameSnapshot}
                      </h3>
                      <p className="mt-1 text-xs font-bold text-[#5f6f85]">
                        SKU {item.productSkuSnapshot}
                      </p>
                      <p className="mt-2 text-sm font-bold text-[#5f6f85]">
                        Qty {item.quantity} x {formatCurrency(unitPrice)}
                      </p>
                    </div>
                    <p className="text-lg font-black text-[#1f2a44]">
                      {formatCurrency(item.lineTotal)}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg border border-[#cfe0f2] bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-black tracking-normal text-[#1f2a44]">
              Customer details
            </h2>
            <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-black text-[#1f2a44]">Name</dt>
                <dd className="mt-1 font-semibold text-[#5f6f85]">
                  {order.customerName}
                </dd>
              </div>
              <div>
                <dt className="font-black text-[#1f2a44]">Email</dt>
                <dd className="mt-1 font-semibold text-[#5f6f85]">
                  {order.customerEmail}
                </dd>
              </div>
              <div>
                <dt className="font-black text-[#1f2a44]">Phone</dt>
                <dd className="mt-1 font-semibold text-[#5f6f85]">
                  {order.customerPhone}
                </dd>
              </div>
              <div>
                <dt className="font-black text-[#1f2a44]">Delivery option</dt>
                <dd className="mt-1 font-semibold text-[#5f6f85]">
                  {order.deliveryMethod === "PICKUP" ? "Pickup" : "Delivery"}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="font-black text-[#1f2a44]">Address</dt>
                <dd className="mt-1 font-semibold text-[#5f6f85]">
                  {order.deliveryMethod === "PICKUP"
                    ? "Pickup order"
                    : [
                        order.shippingAddressLine1,
                        order.shippingAddressLine2,
                        order.cityParishState,
                        order.country,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                </dd>
              </div>
              {order.notes ? (
                <div className="sm:col-span-2">
                  <dt className="font-black text-[#1f2a44]">Notes</dt>
                  <dd className="mt-1 font-semibold text-[#5f6f85]">
                    {order.notes}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>
        </div>

        <aside className="h-fit rounded-lg border border-[#cfe0f2] bg-white p-6 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f7fb3]">
            Summary
          </p>
          <p className="mt-2 text-sm font-semibold text-[#5f6f85]">
            Placed {formatDate(order.createdAt)}
          </p>
          <div className="mt-5 space-y-3 border-b border-[#edf6ff] pb-5 text-sm font-bold text-[#5f6f85]">
            <div className="flex justify-between gap-4">
              <span>Subtotal</span>
              <span className="text-[#1f2a44]">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Discount</span>
              <span className="text-[#1f2a44]">
                {formatCurrency(order.discountTotal)}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Shipping</span>
              <span className="text-[#1f2a44]">
                {formatCurrency(order.shippingTotal)}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Tax</span>
              <span className="text-[#1f2a44]">{formatCurrency(order.taxTotal)}</span>
            </div>
            <div className="flex justify-between gap-4 border-t border-[#edf6ff] pt-3 text-base">
              <span>Total</span>
              <span className="text-[#1f2a44]">{formatCurrency(order.total)}</span>
            </div>
          </div>
          <div className="mt-5 rounded-lg border border-[#cfe0f2] bg-[#f7fbff] p-4 text-sm leading-6 text-[#5f6f85]">
            <span className="font-black text-[#1f2a44]">Next steps:</span> The
            store team will manually confirm product availability, delivery or
            pickup details, and payment instructions.
          </div>
          {showCustomerLinks ? (
            <div className="mt-5 grid gap-3">
              <Link
                href="/products"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#334155] px-5 text-sm font-black text-white transition hover:bg-[#2f7fb3]"
              >
                Continue shopping
                <ShoppingBag className="h-4 w-4" />
              </Link>
              <Link
                href="/account/orders"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#9fc5e8] bg-white px-5 text-sm font-black text-[#334155] transition hover:border-[#4f9ed8] hover:bg-[#eaf6ff]"
              >
                View account orders
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : null}
        </aside>
      </section>
    </div>
  );
}
