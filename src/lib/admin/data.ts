import "server-only";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export type AdminProductSort = "newest" | "name" | "price" | "stock";

export type AdminProductFilters = {
  search?: string;
  status?: string;
  categoryId?: string;
  sort?: AdminProductSort;
};

export type AdminUserFilters = {
  search?: string;
};

const defaultPreferences = {
  siteName: "CircuitHaus",
  storeTagline: "Premium technology market",
  logoUrl: "",
  announcementText: "Premium launch deals are live",
  announcementEnabled: true,
  heroTitle: "CircuitHaus",
  heroSubtitle:
    "Premium phones, creator laptops, gaming systems, cameras, and workstation accessories selected for speed, reliability, and long-term value.",
  heroCtaText: "Shop featured",
  heroCtaLink: "/products?sort=featured",
  homepageBannerText:
    "Curated active catalog sections are controlled by product status and feature toggles.",
  contactEmail: "",
  contactPhone: "",
  whatsappNumber: "",
  storeAddress: "",
  themeAccentColor: "#6e8f3d",
  featuredCategorySlugs: "[]",
};

export async function getSitePreferences() {
  const preferences = await prisma.sitePreference.findFirst({
    orderBy: {
      createdAt: "asc",
    },
  });

  if (preferences) {
    return preferences;
  }

  return {
    id: "",
    ...defaultPreferences,
    createdAt: new Date(0),
    updatedAt: new Date(0),
  };
}

export async function getAdminDashboardStats() {
  const [
    totalProducts,
    activeProducts,
    draftProducts,
    archivedProducts,
    totalCategories,
    totalBrands,
    totalUsers,
    cartItems,
    wishlistItems,
    savedItems,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { status: "ACTIVE" } }),
    prisma.product.count({ where: { status: "DRAFT" } }),
    prisma.product.count({ where: { status: "ARCHIVED" } }),
    prisma.category.count(),
    prisma.brand.count(),
    prisma.user.count(),
    prisma.cartItem.count(),
    prisma.wishlistItem.count(),
    prisma.savedItem.count(),
  ]);

  return {
    totalProducts,
    activeProducts,
    draftProducts,
    archivedProducts,
    totalCategories,
    totalBrands,
    totalUsers,
    cartItems,
    wishlistItems,
    savedItems,
  };
}

function getProductOrderBy(sort: AdminProductSort = "newest") {
  if (sort === "name") {
    return [{ name: "asc" as const }];
  }

  if (sort === "price") {
    return [{ price: "desc" as const }];
  }

  if (sort === "stock") {
    return [{ stockQuantity: "asc" as const }];
  }

  return [{ createdAt: "desc" as const }];
}

function buildAdminProductWhere(filters: AdminProductFilters) {
  const search = filters.search?.trim();

  return {
    ...(filters.status && filters.status !== "ALL"
      ? {
          status: filters.status as Prisma.EnumProductStatusFilter["equals"],
        }
      : {}),
    ...(filters.categoryId && filters.categoryId !== "ALL"
      ? {
          categoryId: filters.categoryId,
        }
      : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search } },
            { sku: { contains: search } },
            { brand: { name: { contains: search } } },
            { category: { name: { contains: search } } },
          ],
        }
      : {}),
  } satisfies Prisma.ProductWhereInput;
}

export async function getAdminProducts(filters: AdminProductFilters) {
  return prisma.product.findMany({
    where: buildAdminProductWhere(filters),
    include: {
      brand: true,
      category: true,
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
      _count: {
        select: {
          cartItems: true,
          wishlistItems: true,
          savedItems: true,
        },
      },
    },
    orderBy: getProductOrderBy(filters.sort),
  });
}

export async function getAdminProductById(id: string) {
  return prisma.product.findUnique({
    where: {
      id,
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
}

export async function getAdminCategoryOptions() {
  return prisma.category.findMany({
    orderBy: [{ status: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function getAdminBrandOptions() {
  return prisma.brand.findMany({
    orderBy: [{ status: "asc" }, { name: "asc" }],
  });
}

export async function getAdminCategories() {
  return prisma.category.findMany({
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: [{ status: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function getAdminBrands() {
  return prisma.brand.findMany({
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: [{ status: "asc" }, { name: "asc" }],
  });
}

export async function getAdminUsers(filters: AdminUserFilters) {
  const search = filters.search?.trim();

  return prisma.user.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : undefined,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      emailVerified: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
