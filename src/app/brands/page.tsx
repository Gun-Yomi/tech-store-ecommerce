import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { BrandCard } from "@/components/catalog/BrandCard";
import { EmptyState } from "@/components/catalog/EmptyState";
import { getBrands } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Brands",
  description:
    "Browse active technology brands, including mobile, workstation, creator, gaming, networking, and accessory makers.",
};

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <>
      <Header />
      <main className="bg-[#f5f9ff]">
        <section className="border-b border-[#cfe0f2] bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f7fb3]">
              Brands
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-normal text-[#1f2a44] sm:text-5xl">
              Makers in the catalog
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#5f6f85]">
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
