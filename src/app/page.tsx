import { CategoryPreview } from "@/components/CategoryPreview";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { getSitePreferences } from "@/lib/admin/data";
import {
  getBestSellers,
  getCategories,
  getFeaturedCategories,
  getFeaturedProducts,
  getNewArrivals,
} from "@/lib/catalog";

function parseFeaturedCategorySlugs(value: string) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const preferences = await getSitePreferences();
  const selectedCategorySlugs = parseFeaturedCategorySlugs(
    preferences.featuredCategorySlugs,
  );
  const categoryPromise =
    selectedCategorySlugs.length > 0
      ? getCategories().then((categories) =>
          selectedCategorySlugs
            .flatMap((slug) => {
              const category = categories.find((item) => item.slug === slug);
              return category ? [category] : [];
            })
            .slice(0, 6),
        )
      : getFeaturedCategories(6);
  const [featuredCategories, featuredProducts, newArrivals, bestSellers] =
    await Promise.all([
      categoryPromise,
      getFeaturedProducts(8),
      getNewArrivals(4),
      getBestSellers(4),
    ]);

  return (
    <>
      <Header />
      <main>
        <Hero
          title={preferences.heroTitle}
          subtitle={preferences.heroSubtitle}
          imageUrl={preferences.heroImageUrl}
          ctaText={preferences.heroCtaText}
          ctaLink={preferences.heroCtaLink}
          announcementText={preferences.announcementText}
        />
        <TrustBar />
        {preferences.announcementEnabled && preferences.homepageBannerText ? (
          <section className="border-y border-[#cfe0f2] bg-white py-4">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div
                className="rounded-lg border border-[#cfe0f2] bg-[#f7fbff] px-5 py-4 text-sm font-black text-[#1f2a44]"
                style={{ borderLeftColor: preferences.themeAccentColor }}
              >
                {preferences.homepageBannerText}
              </div>
            </div>
          </section>
        ) : null}
        <CategoryPreview categories={featuredCategories} />
        <FeaturedProducts
          id="featured-products"
          eyebrow="Featured deals"
          title={preferences.featuredProductsTitle}
          description={preferences.featuredProductsDescription}
          products={featuredProducts}
        />
        <FeaturedProducts
          id="new-arrivals"
          eyebrow="New arrivals"
          title={preferences.newArrivalsTitle}
          description={preferences.newArrivalsDescription}
          products={newArrivals}
          alternate
        />
        <FeaturedProducts
          id="best-sellers"
          eyebrow="Best sellers"
          title={preferences.bestSellersTitle}
          description={preferences.bestSellersDescription}
          products={bestSellers}
        />
      </main>
      <Footer />
    </>
  );
}
