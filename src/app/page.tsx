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
          ctaText={preferences.heroCtaText}
          ctaLink={preferences.heroCtaLink}
          announcementText={preferences.announcementText}
        />
        <TrustBar />
        {preferences.announcementEnabled && preferences.homepageBannerText ? (
          <section className="border-y border-[#d7dfbd] bg-white py-4">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div
                className="rounded-lg border border-[#d7dfbd] bg-[#f7f9ef] px-5 py-4 text-sm font-black text-[#253326]"
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
