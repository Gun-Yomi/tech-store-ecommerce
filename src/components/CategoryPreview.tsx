import { ArrowUpRight } from "lucide-react";
import type { Category, Product } from "@/types/product";

type CategoryPreviewProps = {
  categories: Category[];
  products: Product[];
};

export function CategoryPreview({ categories, products }: CategoryPreviewProps) {
  const highlightedCategories = categories.slice(0, 6);

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
          {highlightedCategories.map((category) => {
            const count = products.filter(
              (product) => product.category === category.name,
            ).length;

            return (
              <a
                key={category.slug}
                href="#featured-products"
                className="group relative min-h-60 overflow-hidden rounded-lg bg-[#253326] p-6 text-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#435d2d]/18 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8ea95c]"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(37,51,38,0.18) 0%, rgba(37,51,38,0.88) 100%), url(${category.image})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              >
                <div className="relative flex h-full min-h-48 flex-col justify-between">
                  <span className="w-fit rounded-full border border-white/18 bg-white/16 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-[#f4ffd1] backdrop-blur">
                    {count || "Soon"} products
                  </span>
                  <div>
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <h3 className="text-2xl font-black tracking-normal">
                        {category.name}
                      </h3>
                      <span className="grid h-10 w-10 place-items-center rounded-lg bg-white text-[#344554] transition group-hover:-translate-y-1 group-hover:translate-x-1">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                    <p className="max-w-sm text-sm leading-6 text-[#edf4de]">
                      {category.description}
                    </p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
