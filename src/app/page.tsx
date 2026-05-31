import { CategoryPreview } from "@/components/CategoryPreview";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import {
  getBestSellers,
  getFeaturedCategories,
  getFeaturedProducts,
  getNewArrivals,
} from "@/lib/catalog";

export default async function Home() {
  const [featuredCategories, featuredProducts, newArrivals, bestSellers] =
    await Promise.all([
      getFeaturedCategories(6),
      getFeaturedProducts(8),
      getNewArrivals(4),
      getBestSellers(4),
    ]);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <CategoryPreview categories={featuredCategories} />
        <FeaturedProducts
          id="featured-products"
          eyebrow="Featured deals"
          title="Premium picks with launch pricing"
          description="Launch selections spanning mobile, portable work, gaming systems, creator cameras, and desk upgrades."
          products={featuredProducts}
        />
        <FeaturedProducts
          id="new-arrivals"
          eyebrow="New arrivals"
          title="Fresh technology drops"
          description="Recently added products from the active catalog, ready for the next phase of shopping flows."
          products={newArrivals}
          alternate
        />
        <FeaturedProducts
          id="best-sellers"
          eyebrow="Best sellers"
          title="Customer-favorite setups"
          description="Popular phones, laptops, creator gear, and accessories from the seeded catalog."
          products={bestSellers}
        />
      </main>
      <Footer />
    </>
  );
}
