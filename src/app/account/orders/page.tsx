import type { Metadata } from "next";
import Link from "next/link";
import { PackageCheck } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StatusPill } from "@/components/orders/StatusPill";
import { requireUser } from "@/lib/auth/guards";
import { formatCurrency } from "@/lib/format";
import { getCustomerOrders } from "@/lib/orders/data";

export const metadata: Metadata = {
  title: "My Orders",
  description: "Review your order history.",
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

export default async function AccountOrdersPage() {
  const user = await requireUser();
  const orders = await getCustomerOrders(user.id);

  return (
    <>
      <Header />
      <main className="bg-[#f5f7ee]">
        <section className="border-b border-[#d7dfbd] bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#5f7d33]">
              Account
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-normal text-[#253326] sm:text-5xl">
              My orders
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#60705d]">
              View submitted manual orders, payment status, and fulfillment
              progress.
            </p>
          </div>
        </section>

        <section className="py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {orders.length > 0 ? (
              <div className="overflow-hidden rounded-lg border border-[#d7dfbd] bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[#edf1df] text-left">
                    <thead className="bg-[#f7f9ef] text-xs font-black uppercase tracking-[0.14em] text-[#60705d]">
                      <tr>
                        <th className="px-4 py-3">Order</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Payment</th>
                        <th className="px-4 py-3">Total</th>
                        <th className="px-4 py-3 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#edf1df]">
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-4 py-4">
                            <p className="font-black text-[#253326]">
                              {order.orderNumber}
                            </p>
                            <p className="mt-1 text-xs font-bold text-[#60705d]">
                              {order._count.items} items
                            </p>
                          </td>
                          <td className="px-4 py-4 text-sm font-bold text-[#60705d]">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="px-4 py-4">
                            <StatusPill status={order.status} />
                          </td>
                          <td className="px-4 py-4">
                            <StatusPill status={order.paymentStatus} tone="payment" />
                          </td>
                          <td className="px-4 py-4 text-sm font-black text-[#253326]">
                            {formatCurrency(order.total)}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <Link
                              href={`/account/orders/${order.orderNumber}`}
                              className="inline-flex h-10 items-center justify-center rounded-lg border border-[#b7c891] bg-white px-4 text-sm font-black text-[#344554] transition hover:border-[#6e8f3d] hover:bg-[#eef4df]"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-[#b7c891] bg-white p-8 text-center shadow-sm">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-[#eef4df] text-[#344554]">
                  <PackageCheck className="h-7 w-7" />
                </span>
                <h2 className="mt-5 text-2xl font-black tracking-normal text-[#253326]">
                  No orders yet
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#60705d]">
                  Orders will appear here after checkout.
                </p>
                <Link
                  href="/products"
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[#344554] px-5 text-sm font-black text-white transition hover:bg-[#5f7d33]"
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
