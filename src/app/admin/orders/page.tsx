import Link from "next/link";
import { AdminActionMessage } from "@/components/admin/AdminActionMessage";
import { StatusPill } from "@/components/orders/StatusPill";
import { formatCurrency } from "@/lib/format";
import { getAdminOrders } from "@/lib/orders/data";
import { orderStatuses, paymentStatuses } from "@/lib/orders/validation";

type AdminOrdersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function stringParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const params = await searchParams;
  const filters = {
    search: stringParam(params.search) ?? "",
    status: stringParam(params.status) ?? "ALL",
    paymentStatus: stringParam(params.paymentStatus) ?? "ALL",
  };
  const orders = await getAdminOrders(filters);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-[#cfe0f2] bg-white p-6 shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f7fb3]">
          Orders
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-normal text-[#1f2a44]">
          Order management
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5f6f85]">
          Search manual checkout orders, review customer details, and update
          fulfillment and payment status.
        </p>
      </section>

      <AdminActionMessage success={params.success} error={params.error} />

      <section className="rounded-lg border border-[#cfe0f2] bg-white p-4 shadow-sm">
        <form className="grid gap-3 lg:grid-cols-[1fr_220px_220px_auto]">
          <input
            name="search"
            type="search"
            aria-label="Search orders"
            defaultValue={filters.search}
            placeholder="Search order number, customer, or email"
            className="h-11 rounded-lg border border-[#cfe0f2] bg-white px-3 text-sm font-semibold text-[#1f2a44] outline-none focus:border-[#4f9ed8]"
          />
          <select
            name="status"
            aria-label="Order status"
            defaultValue={filters.status}
            className="h-11 rounded-lg border border-[#cfe0f2] bg-white px-3 text-sm font-semibold text-[#1f2a44] outline-none focus:border-[#4f9ed8]"
          >
            <option value="ALL">All order statuses</option>
            {orderStatuses.map((status) => (
              <option key={status} value={status}>
                {status.replaceAll("_", " ")}
              </option>
            ))}
          </select>
          <select
            name="paymentStatus"
            aria-label="Payment status"
            defaultValue={filters.paymentStatus}
            className="h-11 rounded-lg border border-[#cfe0f2] bg-white px-3 text-sm font-semibold text-[#1f2a44] outline-none focus:border-[#4f9ed8]"
          >
            <option value="ALL">All payment statuses</option>
            {paymentStatuses.map((status) => (
              <option key={status} value={status}>
                {status.replaceAll("_", " ")}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="h-11 rounded-lg bg-[#334155] px-5 text-sm font-black text-white transition hover:bg-[#2f7fb3]"
          >
            Apply
          </button>
        </form>
      </section>

      <section className="overflow-hidden rounded-lg border border-[#cfe0f2] bg-white shadow-sm">
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#edf6ff] text-left">
              <thead className="bg-[#f7fbff] text-xs font-black uppercase tracking-[0.14em] text-[#5f6f85]">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf6ff]">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-4">
                      <p className="font-black text-[#1f2a44]">
                        {order.orderNumber}
                      </p>
                      <p className="mt-1 text-xs font-bold text-[#5f6f85]">
                        {order._count.items} items
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-black text-[#1f2a44]">
                        {order.customerName}
                      </p>
                      <p className="mt-1 text-xs font-bold text-[#5f6f85]">
                        {order.customerEmail}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-[#5f6f85]">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <StatusPill status={order.status} />
                    </td>
                    <td className="px-4 py-4">
                      <StatusPill status={order.paymentStatus} tone="payment" />
                    </td>
                    <td className="px-4 py-4 text-sm font-black text-[#1f2a44]">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link
                        href={`/admin/orders/${order.orderNumber}`}
                        className="inline-flex h-10 items-center justify-center rounded-lg border border-[#9fc5e8] bg-white px-4 text-sm font-black text-[#334155] transition hover:border-[#4f9ed8] hover:bg-[#eaf6ff]"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center">
            <h2 className="text-2xl font-black tracking-normal text-[#1f2a44]">
              No orders found
            </h2>
            <p className="mt-3 text-sm font-semibold text-[#5f6f85]">
              Orders will appear here after customers submit checkout.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
