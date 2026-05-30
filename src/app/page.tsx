import { CategoryPreview } from "@/components/CategoryPreview";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { categories, products } from "@/data/products";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <CategoryPreview categories={categories} products={products} />
        <FeaturedProducts products={products} />
      </main>
      <Footer />
    </>
  );
}
