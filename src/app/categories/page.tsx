import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CategoryCard } from "@/components/catalog/CategoryCard";
import { EmptyState } from "@/components/catalog/EmptyState";
import { getCategories } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Categories",
  description:
    "Explore active departments for phones, laptops, desktops, cameras, tablets, gaming, accessories, smart gadgets, networking, components, and repair parts.",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <>
      <Header />
      <main className="bg-[#f5f7ee]">
        <section className="border-b border-[#d7dfbd] bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#5f7d33]">
              Departments
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-normal text-[#253326] sm:text-5xl">
              Shop by category
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#60705d]">
              Featured departments appear first, followed by the rest of the
              active catalog.
            </p>
          </div>
        </section>

        <section className="py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {categories.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No active categories"
                message="Categories have not been published yet."
              />
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
