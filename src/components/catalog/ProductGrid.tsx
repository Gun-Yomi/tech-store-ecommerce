import type { CatalogProduct } from "@/lib/catalog";
import { EmptyState } from "./EmptyState";
import { ProductCard } from "./ProductCard";

type ProductGridProps = {
  products: CatalogProduct[];
  emptyTitle?: string;
  emptyMessage?: string;
};

export function ProductGrid({
  products,
  emptyTitle = "No products found",
  emptyMessage = "Try a different search, brand, category, price range, or availability filter.",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        message={emptyMessage}
        actionHref="/products"
        actionLabel="View all products"
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
