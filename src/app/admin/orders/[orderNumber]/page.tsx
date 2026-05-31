import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminActionMessage } from "@/components/admin/AdminActionMessage";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import { OrderDetailView } from "@/components/orders/OrderDetailView";
import { StatusPill } from "@/components/orders/StatusPill";
import { updateAdminOrderAction } from "@/lib/orders/actions";
import { getAdminOrderByNumber } from "@/lib/orders/data";
import {
  orderStatusLabel,
  orderStatuses,
  paymentStatuses,
} from "@/lib/orders/validation";

type AdminOrderDetailPageProps = {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminOrderDetailPage({
  params,
  searchParams,
}: AdminOrderDetailPageProps) {
  const [{ orderNumber }, query] = await Promise.all([params, searchParams]);
  const order = await getAdminOrderByNumber(orderNumber);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-lg border border-[#cfe0f2] bg-white p-6 shadow-sm lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f7fb3]">
            Order detail
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-normal text-[#1f2a44]">
            {order.orderNumber}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5f6f85]">
            Review the full order and update manual fulfillment or payment
            status.
          </p>
        </div>
        <Link
          href="/admin/orders"
          className="inline-flex h-11 items-center justify-center rounded-lg border border-[#9fc5e8] bg-white px-5 text-sm font-black text-[#334155] transition hover:border-[#4f9ed8] hover:bg-[#eaf6ff]"
        >
          Back to orders
        </Link>
      </div>

      <AdminActionMessage
        success={firstParam(query.success)}
        error={firstParam(query.error)}
      />

      <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <OrderDetailView order={order} showCustomerLinks={false} />

        <aside className="h-fit space-y-5 rounded-lg border border-[#cfe0f2] bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f7fb3]">
              Admin controls
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <StatusPill status={order.status} />
              <StatusPill status={order.paymentStatus} tone="payment" />
            </div>
          </div>

          <form action={updateAdminOrderAction} className="space-y-4">
            <input type="hidden" name="orderId" value={order.id} />
            <input type="hidden" name="orderNumber" value={order.orderNumber} />
            <label className="block">
              <span className="text-sm font-black text-[#1f2a44]">
                Order status
              </span>
              <select
                name="status"
                defaultValue={order.status}
                className="mt-2 h-11 w-full rounded-lg border border-[#cfe0f2] bg-white px-3 text-sm font-semibold text-[#1f2a44] outline-none focus:border-[#4f9ed8]"
              >
                {orderStatuses.map((status) => (
                  <option key={status} value={status}>
                    {orderStatusLabel(status)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-black text-[#1f2a44]">
                Payment status
              </span>
              <select
                name="paymentStatus"
                defaultValue={order.paymentStatus}
                className="mt-2 h-11 w-full rounded-lg border border-[#cfe0f2] bg-white px-3 text-sm font-semibold text-[#1f2a44] outline-none focus:border-[#4f9ed8]"
              >
                {paymentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {orderStatusLabel(status)}
                  </option>
                ))}
              </select>
            </label>
            <AdminSubmitButton pendingLabel="Saving...">
              Save order status
            </AdminSubmitButton>
          </form>

          <div className="rounded-lg border border-[#cfe0f2] bg-[#f7fbff] p-4 text-sm leading-6 text-[#5f6f85]">
            Cancelling a non-completed order restores stock once. If a cancelled
            order is reopened later, stock is not decremented again in this
            phase.
          </div>
        </aside>
      </section>
    </div>
  );
}
