import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PackageCheck } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProductGallery } from "@/components/catalog/ProductGallery";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { ProductSpecs } from "@/components/catalog/ProductSpecs";
import { ProductDetailActions } from "@/components/shopping/ProductDetailActions";
import {
  getProductBySlug,
  getRecommendedProducts,
  getRelatedProducts,
} from "@/lib/catalog";
import { calculateDiscountPercent, formatCurrency } from "@/lib/format";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [relatedProducts, recommendedProducts] = await Promise.all([
    getRelatedProducts(product),
    getRecommendedProducts(product),
  ]);
  const activePrice = product.salePrice ?? product.price;
  const discount = calculateDiscountPercent(product.price, product.salePrice);

  return (
    <>
      <Header />
      <main className="bg-[#f5f9ff]">
        <section className="border-b border-[#cfe0f2] bg-white py-5">
          <nav
            aria-label="Breadcrumb"
            className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 text-sm font-bold text-[#5f6f85] sm:px-6 lg:px-8"
          >
            <Link href="/" className="hover:text-[#2f7fb3]">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[#2f7fb3]">
              Products
            </Link>
            <span>/</span>
            <Link
              href={`/categories/${product.category.slug}`}
              className="hover:text-[#2f7fb3]"
            >
              {product.category.name}
            </Link>
            <span>/</span>
            <span className="text-[#1f2a44]">{product.name}</span>
          </nav>
        </section>

        <section className="py-10 sm:py-14">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
            <ProductGallery product={product} />

            <div>
              <div className="flex flex-wrap gap-2">
                {product.isNewArrival ? (
                  <span className="rounded-full bg-[#c7e8ff] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#1f2a44]">
                    New arrival
                  </span>
                ) : null}
                {product.isBestSeller ? (
                  <span className="rounded-full bg-[#b9e2ff] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#1f2a44]">
                    Best seller
                  </span>
                ) : null}
                {discount ? (
                  <span className="rounded-full bg-[#1f2a44] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-white">
                    {discount}% off
                  </span>
                ) : null}
              </div>

              <h1 className="mt-4 text-4xl font-black tracking-normal text-[#1f2a44] sm:text-5xl">
                {product.name}
              </h1>
              <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold text-[#5f6f85]">
                <Link href={`/brands/${product.brand.slug}`} className="hover:text-[#2f7fb3]">
                  {product.brand.name}
                </Link>
                <span>SKU {product.sku}</span>
                <Link
                  href={`/categories/${product.category.slug}`}
                  className="hover:text-[#2f7fb3]"
                >
                  {product.category.name}
                </Link>
              </div>

              <p className="mt-5 text-base leading-7 text-[#5f6f85]">
                {product.shortDescription}
              </p>

              <div className="mt-7 rounded-lg border border-[#cfe0f2] bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-end gap-3">
                  <span className="text-4xl font-black tracking-normal text-[#1f2a44]">
                    {formatCurrency(activePrice)}
                  </span>
                  {product.salePrice ? (
                    <span className="pb-1 text-lg font-bold text-[#8b96a8] line-through">
                      {formatCurrency(product.price)}
                    </span>
                  ) : null}
                </div>
                <p
                  className={`mt-3 flex items-center gap-2 text-sm font-black ${
                    product.stockQuantity > 0 ? "text-[#2f7fb3]" : "text-[#9f2f28]"
                  }`}
                >
                  <PackageCheck className="h-4 w-4" />
                  {product.stockQuantity > 0
                    ? `${product.stockQuantity} available`
                    : "Out of stock"}
                </p>

                <ProductDetailActions
                  productId={product.id}
                  productName={product.name}
                  stockQuantity={product.stockQuantity}
                />
              </div>

              <div className="mt-7 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#eaf6ff] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#5f6f85]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-10 sm:py-14">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f7fb3]">
                Product story
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-normal text-[#1f2a44]">
                Built for the modern tech setup
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#5f6f85]">
                {product.fullDescription}
              </p>
              <div className="mt-6 rounded-lg border border-[#cfe0f2] bg-[#f7fbff] p-5">
                <h3 className="text-lg font-black tracking-normal text-[#1f2a44]">
                  Warranty
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#5f6f85]">
                  {product.warrantyInfo}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f7fb3]">
                Specifications
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-normal text-[#1f2a44]">
                Key details
              </h2>
              <div className="mt-6">
                <ProductSpecs specifications={product.specifications} />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f7fb3]">
                Related
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-normal text-[#1f2a44]">
                More from {product.category.name}
              </h2>
            </div>
            <ProductGrid
              products={relatedProducts}
              emptyTitle="No related products yet"
              emptyMessage="This category does not have additional active products right now."
            />
          </div>
        </section>

        <section className="bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f7fb3]">
                Recommended
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-normal text-[#1f2a44]">
                More from {product.brand.name}
              </h2>
            </div>
            <ProductGrid
              products={recommendedProducts}
              emptyTitle="No more brand products yet"
              emptyMessage="This brand does not have additional active products right now."
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
