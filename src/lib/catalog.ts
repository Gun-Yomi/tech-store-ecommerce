import "server-only";

import type {
  Brand,
  Category,
  Product,
  ProductImage,
  ProductStatus,
} from "@prisma/client";
import { prisma } from "@/lib/db";

export type ProductSort =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "best-sellers"
  | "name-asc";

export type ProductFilters = {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: ProductSort;
};

export type CatalogCategory = Category & {
  productCount: number;
};

export type CatalogBrand = Brand & {
  productCount: number;
};

export type CatalogProduct = Omit<
  Product,
  "tags" | "specifications" | "brandId" | "categoryId"
> & {
  tags: string[];
  specifications: Record<string, string>;
  brand: Brand;
  category: Category;
  images: ProductImage[];
};

const activeProductWhere = {
  status: "ACTIVE" as ProductStatus,
  brand: {
    status: "ACTIVE" as const,
  },
  category: {
    status: "ACTIVE" as const,
  },
};

function parseJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function parseJsonRecord(value: string): Record<string, string> {
  try {
    const parsed = JSON.parse(value);

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).filter(
        (entry): entry is [string, string] =>
          typeof entry[0] === "string" && typeof entry[1] === "string",
      ),
    );
  } catch {
    return {};
  }
}

function toCatalogProduct(
  product: Product & {
    brand: Brand;
    category: Category;
    images: ProductImage[];
  },
): CatalogProduct {
  return {
    ...product,
    tags: parseJsonArray(product.tags),
    specifications: parseJsonRecord(product.specifications),
  };
}

function getProductOrderBy(sort: ProductSort = "featured") {
  if (sort === "newest") {
    return [{ createdAt: "desc" as const }];
  }

  if (sort === "price-asc") {
    return [{ salePrice: "asc" as const }, { price: "asc" as const }];
  }

  if (sort === "price-desc") {
    return [{ salePrice: "desc" as const }, { price: "desc" as const }];
  }

  if (sort === "best-sellers") {
    return [
      { isBestSeller: "desc" as const },
      { isFeatured: "desc" as const },
      { createdAt: "desc" as const },
    ];
  }

  if (sort === "name-asc") {
    return [{ name: "asc" as const }];
  }

  return [
    { isFeatured: "desc" as const },
    { isBestSeller: "desc" as const },
    { isNewArrival: "desc" as const },
    { createdAt: "desc" as const },
  ];
}

function buildProductWhere(filters: ProductFilters = {}) {
  const search = filters.search?.trim();

  return {
    ...activeProductWhere,
    ...(filters.category
      ? {
          category: {
            status: "ACTIVE" as const,
            slug: filters.category,
          },
        }
      : {}),
    ...(filters.brand
      ? {
          brand: {
            status: "ACTIVE" as const,
            slug: filters.brand,
          },
        }
      : {}),
    ...(typeof filters.minPrice === "number" || typeof filters.maxPrice === "number"
      ? {
          price: {
            ...(typeof filters.minPrice === "number"
              ? { gte: filters.minPrice }
              : {}),
            ...(typeof filters.maxPrice === "number"
              ? { lte: filters.maxPrice }
              : {}),
          },
        }
      : {}),
    ...(filters.inStock
      ? {
          stockQuantity: {
            gt: 0,
          },
        }
      : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search } },
            { sku: { contains: search } },
            { shortDescription: { contains: search } },
            { tags: { contains: search } },
            { brand: { name: { contains: search } } },
            { category: { name: { contains: search } } },
          ],
        }
      : {}),
  };
}

export async function getProducts(filters: ProductFilters = {}) {
  const products = await prisma.product.findMany({
    where: buildProductWhere(filters),
    include: {
      brand: true,
      category: true,
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
    orderBy: getProductOrderBy(filters.sort),
  });

  return products.map(toCatalogProduct);
}

export async function searchProducts(filters: ProductFilters = {}) {
  return getProducts(filters);
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findFirst({
    where: {
      slug,
      ...activeProductWhere,
    },
    include: {
      brand: true,
      category: true,
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  return product ? toCatalogProduct(product) : null;
}

export async function getFeaturedProducts(limit = 8) {
  const products = await prisma.product.findMany({
    where: {
      ...activeProductWhere,
      isFeatured: true,
    },
    include: {
      brand: true,
      category: true,
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
    orderBy: getProductOrderBy("featured"),
    take: limit,
  });

  return products.map(toCatalogProduct);
}

export async function getNewArrivals(limit = 8) {
  const products = await prisma.product.findMany({
    where: {
      ...activeProductWhere,
      isNewArrival: true,
    },
    include: {
      brand: true,
      category: true,
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
    orderBy: getProductOrderBy("newest"),
    take: limit,
  });

  return products.map(toCatalogProduct);
}

export async function getBestSellers(limit = 8) {
  const products = await prisma.product.findMany({
    where: {
      ...activeProductWhere,
      isBestSeller: true,
    },
    include: {
      brand: true,
      category: true,
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
    orderBy: getProductOrderBy("best-sellers"),
    take: limit,
  });

  return products.map(toCatalogProduct);
}

export async function getRelatedProducts(product: CatalogProduct, limit = 4) {
  const products = await prisma.product.findMany({
    where: {
      ...activeProductWhere,
      categoryId: product.category.id,
      id: {
        not: product.id,
      },
    },
    include: {
      brand: true,
      category: true,
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
    orderBy: getProductOrderBy("featured"),
    take: limit,
  });

  return products.map(toCatalogProduct);
}

export async function getRecommendedProducts(product: CatalogProduct, limit = 4) {
  const products = await prisma.product.findMany({
    where: {
      ...activeProductWhere,
      brandId: product.brand.id,
      id: {
        not: product.id,
      },
    },
    include: {
      brand: true,
      category: true,
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
    orderBy: getProductOrderBy("newest"),
    take: limit,
  });

  return products.map(toCatalogProduct);
}

export async function getCategories() {
  const categories = await prisma.category.findMany({
    where: {
      status: "ACTIVE",
    },
    include: {
      products: {
        where: {
          status: "ACTIVE",
          brand: {
            status: "ACTIVE",
          },
        },
        select: {
          id: true,
        },
      },
    },
    orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { name: "asc" }],
  });

  return categories.map(({ products, ...category }) => ({
    ...category,
    productCount: products.length,
  }));
}

export async function getFeaturedCategories(limit = 6) {
  const categories = await getCategories();
  return categories.filter((category) => category.isFeatured).slice(0, limit);
}

export async function getCategoryBySlug(slug: string) {
  const category = await prisma.category.findFirst({
    where: {
      slug,
      status: "ACTIVE",
    },
    include: {
      products: {
        where: {
          status: "ACTIVE",
          brand: {
            status: "ACTIVE",
          },
        },
        select: {
          id: true,
        },
      },
    },
  });

  if (!category) {
    return null;
  }

  const { products, ...categoryData } = category;

  return {
    ...categoryData,
    productCount: products.length,
  };
}

export async function getBrands() {
  const brands = await prisma.brand.findMany({
    where: {
      status: "ACTIVE",
    },
    include: {
      products: {
        where: {
          status: "ACTIVE",
          category: {
            status: "ACTIVE",
          },
        },
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return brands.map(({ products, ...brand }) => ({
    ...brand,
    productCount: products.length,
  }));
}

export async function getBrandBySlug(slug: string) {
  const brand = await prisma.brand.findFirst({
    where: {
      slug,
      status: "ACTIVE",
    },
    include: {
      products: {
        where: {
          status: "ACTIVE",
          category: {
            status: "ACTIVE",
          },
        },
        select: {
          id: true,
        },
      },
    },
  });

  if (!brand) {
    return null;
  }

  const { products, ...brandData } = brand;

  return {
    ...brandData,
    productCount: products.length,
  };
}
