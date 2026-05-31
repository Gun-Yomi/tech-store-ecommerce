import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProductFilters } from "@/components/catalog/ProductFilters";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import {
  getBrands,
  getCategories,
  searchProducts,
} from "@/lib/catalog";
import {
  type CatalogSearchParams,
  parseProductFilters,
} from "@/lib/catalog-params";

export const metadata: Metadata = {
  title: "Products | CircuitHaus",
  description:
    "Search and filter premium phones, laptops, desktops, cameras, gaming gear, accessories, networking, components, and repair parts.",
};

type ProductsPageProps = {
  searchParams: Promise<CatalogSearchParams>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const filters = parseProductFilters(params);
  const [categories, brands, products] = await Promise.all([
    getCategories(),
    getBrands(),
    searchProducts(filters),
  ]);

  return (
    <>
      <Header />
      <main className="bg-[#f5f7ee]">
        <section className="border-b border-[#d7dfbd] bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#5f7d33]">
              Product catalog
            </p>
            <div className="mt-3 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <h1 className="text-4xl font-black tracking-normal text-[#253326] sm:text-5xl">
                  Shop premium technology
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-[#60705d]">
                  Browse active products only, with filters for department, brand,
                  price, stock, search terms, and launch status.
                </p>
              </div>
              <div className="rounded-lg border border-[#d7dfbd] bg-[#f7f9ef] px-5 py-4 text-sm font-black text-[#344554]">
                {products.length} active products
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-10">
          <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
            <ProductFilters
              filters={filters}
              categories={categories}
              brands={brands}
            />
            <ProductGrid products={products} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
