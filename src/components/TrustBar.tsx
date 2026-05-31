import { Headphones, ShieldCheck, Truck, Wrench } from "lucide-react";

const trustItems = [
  {
    label: "Secure Shopping",
    detail: "Clear pricing, clean product data, and privacy-minded foundations.",
    icon: ShieldCheck,
  },
  {
    label: "Fast Delivery",
    detail: "Launch-ready messaging for delivery promises and fulfillment tiers.",
    icon: Truck,
  },
  {
    label: "Warranty Support",
    detail: "Warranty information is modeled on every sample product.",
    icon: Wrench,
  },
  {
    label: "Expert Help",
    detail: "Support-ready structure for future service and account workflows.",
    icon: Headphones,
  },
];

export function TrustBar() {
  return (
    <section className="border-y border-[#d7dfbd] bg-white">
      <div className="mx-auto grid max-w-7xl gap-px bg-[#d7dfbd] sm:grid-cols-2 lg:grid-cols-4">
        {trustItems.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label} className="bg-white px-4 py-6 sm:px-6 lg:px-8">
              <div className="flex gap-4">
                <span className="grid h-12 w-12 flex-none place-items-center rounded-lg bg-[#eef4df] text-[#344554]">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-black tracking-normal text-[#253326]">
                    {item.label}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[#60705d]">
                    {item.detail}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
