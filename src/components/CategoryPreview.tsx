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
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#5f7d33]">
              Shop by department
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-normal text-[#253326] sm:text-4xl">
              Tech categories built for every setup
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[#60705d]">
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
            className="inline-flex h-12 items-center justify-center rounded-lg border border-[#b7c891] bg-white px-6 text-sm font-black text-[#344554] transition hover:border-[#6e8f3d] hover:bg-[#eef4df]"
          >
            View all categories
          </Link>
        </div>
      </div>
    </section>
  );
}
