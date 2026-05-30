import { ArrowRight, BadgeCheck, ShieldCheck, Sparkles } from "lucide-react";

const heroImage =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1900&q=85";

export function Hero() {
  return (
    <section
      className="relative isolate overflow-hidden bg-[#07111f] text-white"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(7,17,31,0.96) 0%, rgba(7,17,31,0.82) 48%, rgba(7,17,31,0.28) 100%), url(${heroImage})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100 shadow-[0_12px_36px_rgba(20,184,166,0.18)]">
            <Sparkles className="h-4 w-4" />
            Premium launch deals are live
          </div>
          <h1 className="text-4xl font-black tracking-normal text-white min-[360px]:text-5xl sm:text-6xl lg:text-7xl">
            CircuitHaus
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
            Premium phones, creator laptops, gaming systems, cameras, and workstation
            accessories selected for speed, reliability, and long-term value.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#featured-products"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-cyan-300 px-6 text-sm font-black text-[#07111f] shadow-[0_18px_45px_rgba(103,232,249,0.25)] transition hover:-translate-y-0.5 hover:bg-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-100"
            >
              Shop featured
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#categories"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-white/20 bg-white/10 px-6 text-sm font-black text-white transition hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-100"
            >
              Browse categories
            </a>
          </div>
          <div className="mt-10 grid gap-3 text-sm font-semibold text-slate-100 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
              Secure shopping
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
              <BadgeCheck className="h-5 w-5 text-cyan-300" />
              Warranty-first products
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
              <Sparkles className="h-5 w-5 text-violet-300" />
              Curated tech drops
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
