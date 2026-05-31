import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { BrandCard } from "@/components/catalog/BrandCard";
import { EmptyState } from "@/components/catalog/EmptyState";
import { getBrands } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Brands | CircuitHaus",
  description:
    "Browse active technology brands stocked by CircuitHaus, including mobile, workstation, creator, gaming, networking, and accessory makers.",
};

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <>
      <Header />
      <main className="bg-[#f5f7ee]">
        <section className="border-b border-[#d7dfbd] bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#5f7d33]">
              Brands
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-normal text-[#253326] sm:text-5xl">
              Makers in the catalog
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#60705d]">
              Explore active brands and jump into products from each maker.
            </p>
          </div>
        </section>

        <section className="py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {brands.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {brands.map((brand) => (
                  <BrandCard key={brand.id} brand={brand} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No active brands"
                message="Brands have not been published yet."
              />
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
