import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { OrderDetailView } from "@/components/orders/OrderDetailView";
import { requireUser } from "@/lib/auth/guards";
import { getCustomerOrderByNumber } from "@/lib/orders/data";

type AccountOrderDetailPageProps = {
  params: Promise<{ orderNumber: string }>;
};

export const metadata: Metadata = {
  title: "Order Details | CircuitHaus",
  description: "Review a CircuitHaus order from your account.",
};

export default async function AccountOrderDetailPage({
  params,
}: AccountOrderDetailPageProps) {
  const [{ orderNumber }, user] = await Promise.all([params, requireUser()]);
  const order = await getCustomerOrderByNumber(user.id, orderNumber);

  if (!order) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="bg-[#f5f7ee] py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <OrderDetailView order={order} />
        </div>
      </main>
      <Footer />
    </>
  );
}
