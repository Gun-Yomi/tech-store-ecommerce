import type { ProductFilters, ProductSort } from "@/lib/catalog";

export type CatalogSearchParams = Record<string, string | string[] | undefined>;

const productSorts = new Set<ProductSort>([
  "featured",
  "newest",
  "price-asc",
  "price-desc",
  "best-sellers",
  "name-asc",
]);

function getParam(params: CatalogSearchParams, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

function getPriceInCents(params: CatalogSearchParams, key: string) {
  const value = getParam(params, key);

  if (!value) {
    return undefined;
  }

  const dollars = Number(value);
  return Number.isFinite(dollars) && dollars >= 0
    ? Math.round(dollars * 100)
    : undefined;
}

export function parseProductFilters(
  params: CatalogSearchParams,
  overrides: Partial<ProductFilters> = {},
): ProductFilters {
  const sort = getParam(params, "sort");

  return {
    search: getParam(params, "search") || undefined,
    category: getParam(params, "category") || undefined,
    brand: getParam(params, "brand") || undefined,
    minPrice: getPriceInCents(params, "minPrice"),
    maxPrice: getPriceInCents(params, "maxPrice"),
    inStock: getParam(params, "inStock") === "true",
    sort: sort && productSorts.has(sort as ProductSort) ? (sort as ProductSort) : "featured",
    ...overrides,
  };
}
