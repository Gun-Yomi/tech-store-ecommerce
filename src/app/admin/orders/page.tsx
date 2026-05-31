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
      <section className="rounded-lg border border-[#d7dfbd] bg-white p-6 shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#5f7d33]">
          Orders
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-normal text-[#253326]">
          Order management
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#60705d]">
          Search manual checkout orders, review customer details, and update
          fulfillment and payment status.
        </p>
      </section>

      <AdminActionMessage success={params.success} error={params.error} />

      <section className="rounded-lg border border-[#d7dfbd] bg-white p-4 shadow-sm">
        <form className="grid gap-3 lg:grid-cols-[1fr_220px_220px_auto]">
          <input
            name="search"
            type="search"
            defaultValue={filters.search}
            placeholder="Search order number, customer, or email"
            className="h-11 rounded-lg border border-[#d7dfbd] bg-white px-3 text-sm font-semibold text-[#253326] outline-none focus:border-[#6e8f3d]"
          />
          <select
            name="status"
            defaultValue={filters.status}
            className="h-11 rounded-lg border border-[#d7dfbd] bg-white px-3 text-sm font-semibold text-[#253326] outline-none focus:border-[#6e8f3d]"
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
            defaultValue={filters.paymentStatus}
            className="h-11 rounded-lg border border-[#d7dfbd] bg-white px-3 text-sm font-semibold text-[#253326] outline-none focus:border-[#6e8f3d]"
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
            className="h-11 rounded-lg bg-[#344554] px-5 text-sm font-black text-white transition hover:bg-[#5f7d33]"
          >
            Apply
          </button>
        </form>
      </section>

      <section className="overflow-hidden rounded-lg border border-[#d7dfbd] bg-white shadow-sm">
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#edf1df] text-left">
              <thead className="bg-[#f7f9ef] text-xs font-black uppercase tracking-[0.14em] text-[#60705d]">
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
                    <td className="px-4 py-4">
                      <p className="font-black text-[#253326]">
                        {order.customerName}
                      </p>
                      <p className="mt-1 text-xs font-bold text-[#60705d]">
                        {order.customerEmail}
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
                        href={`/admin/orders/${order.orderNumber}`}
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
        ) : (
          <div className="p-10 text-center">
            <h2 className="text-2xl font-black tracking-normal text-[#253326]">
              No orders found
            </h2>
            <p className="mt-3 text-sm font-semibold text-[#60705d]">
              Orders will appear here after customers submit checkout.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
