import { ArrowRight, BadgeCheck, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

const heroImage =
  "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1900&q=85";

export function Hero() {
  return (
    <section
      className="relative isolate overflow-hidden bg-[#253326] text-white"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(37,51,38,0.94) 0%, rgba(67,93,45,0.76) 50%, rgba(24,134,124,0.46) 100%), url(${heroImage})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/16 px-4 py-2 text-sm font-bold text-[#f8ffe8] shadow-[0_12px_36px_rgba(67,93,45,0.22)]">
            <Sparkles className="h-4 w-4" />
            Premium launch deals are live
          </div>
          <h1 className="text-4xl font-black tracking-normal text-white min-[360px]:text-5xl sm:text-6xl lg:text-7xl">
            CircuitHaus
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#edf4de] sm:text-xl">
            Premium phones, creator laptops, gaming systems, cameras, and workstation
            accessories selected for speed, reliability, and long-term value.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products?sort=featured"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#d8e978] px-6 text-sm font-black text-[#253326] shadow-[0_18px_45px_rgba(216,233,120,0.22)] transition hover:-translate-y-0.5 hover:bg-[#e7f39b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4ffd1]"
            >
              Shop featured
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/categories"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-white/25 bg-white/12 px-6 text-sm font-black text-white transition hover:-translate-y-0.5 hover:border-white/45 hover:bg-white/18 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4ffd1]"
            >
              Browse categories
            </Link>
          </div>
          <div className="mt-10 grid gap-3 text-sm font-semibold text-[#f7f9ef] sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
              <ShieldCheck className="h-5 w-5 text-[#d8e978]" />
              Secure shopping
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
              <BadgeCheck className="h-5 w-5 text-[#cfe6b6]" />
              Warranty-first products
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
              <Sparkles className="h-5 w-5 text-[#e8efd8]" />
              Curated tech drops
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
