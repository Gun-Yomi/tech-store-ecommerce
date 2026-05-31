import { orderStatusLabel } from "@/lib/orders/validation";

type StatusPillProps = {
  status: string;
  tone?: "order" | "payment";
};

function statusClass(status: string, tone: "order" | "payment") {
  if (status === "CANCELLED" || status === "FAILED") {
    return "bg-[#fff4f1] text-[#9f2f28]";
  }

  if (status === "COMPLETED" || status === "PAID") {
    return "bg-[#eaf6ff] text-[#245a8d]";
  }

  if (status === "PROCESSING" || status === "SHIPPED" || status === "PENDING") {
    return "bg-[#f7f1d8] text-[#806010]";
  }

  if (tone === "payment" && status === "UNPAID") {
    return "bg-[#f1f1ef] text-[#5f6663]";
  }

  return "bg-[#eaf6ff] text-[#245a8d]";
}

export function StatusPill({ status, tone = "order" }: StatusPillProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${statusClass(
        status,
        tone,
      )}`}
    >
      {orderStatusLabel(status)}
    </span>
  );
}
