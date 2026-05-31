import Link from "next/link";
import type { CatalogCategory } from "@/lib/catalog";
import { CategoryCard } from "./catalog/CategoryCard";

type CategoryPreviewProps = {
  categories: CatalogCategory[];
};

export function CategoryPreview({ categories }: CategoryPreviewProps) {
  return (
    <section id="categories" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f7fb3]">
              Shop by department
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-normal text-[#1f2a44] sm:text-4xl">
              Tech categories built for every setup
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[#5f6f85]">
            Explore curated departments for personal devices, creator studios,
            gaming rooms, home offices, and repair-ready workbenches.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/categories"
            className="inline-flex h-12 items-center justify-center rounded-lg border border-[#9fc5e8] bg-white px-6 text-sm font-black text-[#334155] transition hover:border-[#4f9ed8] hover:bg-[#eaf6ff]"
          >
            View all categories
          </Link>
        </div>
      </div>
    </section>
  );
}
