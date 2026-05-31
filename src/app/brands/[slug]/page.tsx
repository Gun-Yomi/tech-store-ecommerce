import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProductFilters } from "@/components/catalog/ProductFilters";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import {
  getBrandBySlug,
  getBrands,
  getCategories,
  searchProducts,
} from "@/lib/catalog";
import {
  type CatalogSearchParams,
  parseProductFilters,
} from "@/lib/catalog-params";

type BrandPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<CatalogSearchParams>;
};

export async function generateMetadata({
  params,
}: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand) {
    return {
      title: "Brand Not Found | CircuitHaus",
    };
  }

  return {
    title: `${brand.name} | CircuitHaus`,
    description: brand.description,
  };
}

export default async function BrandDetailPage({
  params,
  searchParams,
}: BrandPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const brand = await getBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  const filters = parseProductFilters(query, { brand: slug });
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
              Brand
            </p>
            <div className="mt-3 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <h1 className="text-4xl font-black tracking-normal text-[#253326] sm:text-5xl">
                  {brand.name}
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-[#60705d]">
                  {brand.description}
                </p>
              </div>
              <div className="rounded-lg border border-[#d7dfbd] bg-[#f7f9ef] px-5 py-4 text-sm font-black text-[#344554]">
                {products.length} matching products
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-10">
          <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
            <ProductFilters
              basePath={`/brands/${brand.slug}`}
              filters={filters}
              categories={categories}
              brands={brands}
              hideBrandFilter
            />
            <ProductGrid
              products={products}
              emptyTitle={`No active ${brand.name} products`}
              emptyMessage="Try a different search, category, price range, or availability filter."
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
