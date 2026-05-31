import { ArrowRight, BadgeCheck, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

const defaultHeroImage =
  "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1900&q=85";

type HeroProps = {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  announcementText?: string;
};

export function Hero({
  title = "CircuitHaus",
  subtitle = "Premium phones, creator laptops, gaming systems, cameras, and workstation accessories selected for speed, reliability, and long-term value.",
  imageUrl = defaultHeroImage,
  ctaText = "Shop featured",
  ctaLink = "/products?sort=featured",
  announcementText = "Premium launch deals are live",
}: HeroProps) {
  return (
    <section
      className="relative isolate overflow-hidden bg-[#1f2a44] text-white"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(31,42,68,0.94) 0%, rgba(47,95,143,0.76) 50%, rgba(42,166,214,0.46) 100%), url(${imageUrl || defaultHeroImage})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/16 px-4 py-2 text-sm font-bold text-[#eff8ff] shadow-[0_12px_36px_rgba(47,95,143,0.22)]">
            <Sparkles className="h-4 w-4" />
            {announcementText}
          </div>
          <h1 className="text-4xl font-black tracking-normal text-white min-[360px]:text-5xl sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#e8f4ff] sm:text-xl">
            {subtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={ctaLink}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#c7e8ff] px-6 text-sm font-black text-[#1f2a44] shadow-[0_18px_45px_rgba(79,158,216,0.2)] transition hover:-translate-y-0.5 hover:bg-[#dbf1ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#eff8ff]"
            >
              {ctaText}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/categories"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-white/25 bg-white/12 px-6 text-sm font-black text-white transition hover:-translate-y-0.5 hover:border-white/45 hover:bg-white/18 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#eff8ff]"
            >
              Browse categories
            </Link>
          </div>
          <div className="mt-10 grid gap-3 text-sm font-semibold text-[#f7fbff] sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
              <ShieldCheck className="h-5 w-5 text-[#c7e8ff]" />
              Secure shopping
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
              <BadgeCheck className="h-5 w-5 text-[#d7eaff]" />
              Warranty-first products
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
              <Sparkles className="h-5 w-5 text-[#e5f2ff]" />
              Curated tech drops
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
