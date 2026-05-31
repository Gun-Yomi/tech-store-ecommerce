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
  heroImageUrl:
    "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1900&q=85",
  heroCtaText: "Shop featured",
  heroCtaLink: "/products?sort=featured",
  homepageBannerText:
    "Curated active catalog sections are controlled by product status and feature toggles.",
  featuredProductsTitle: "Premium picks with launch pricing",
  featuredProductsDescription:
    "Launch selections spanning mobile, portable work, gaming systems, creator cameras, and desk upgrades.",
  newArrivalsTitle: "Fresh technology drops",
  newArrivalsDescription:
    "Recently added products from the active catalog, ready for the next phase of shopping flows.",
  bestSellersTitle: "Customer-favorite setups",
  bestSellersDescription:
    "Popular phones, laptops, creator gear, and accessories from the seeded catalog.",
  footerDescription:
    "A focused commerce foundation for premium devices, upgrade parts, creator gear, and support-ready technology products.",
  contactEmail: "",
  contactPhone: "",
  whatsappNumber: "",
  storeAddress: "",
  themeAccentColor: "#4f9ed8",
  featuredCategorySlugs: "[]",
};

function normalizePreferenceColors<T extends { themeAccentColor: string }>(
  preferences: T,
) {
  if (preferences.themeAccentColor.toLowerCase() !== "#6e8f3d") {
    return preferences;
  }

  return {
    ...preferences,
    themeAccentColor: defaultPreferences.themeAccentColor,
  };
}

export async function getSitePreferences() {
  const preferences = await prisma.sitePreference.findFirst({
    orderBy: {
      createdAt: "asc",
    },
  });

  if (preferences) {
    return normalizePreferenceColors(preferences);
  }

  return normalizePreferenceColors({
    id: "",
    ...defaultPreferences,
    createdAt: new Date(0),
    updatedAt: new Date(0),
  });
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
    totalOrders,
    pendingOrders,
    unpaidOrders,
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
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { paymentStatus: "UNPAID" } }),
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
    totalOrders,
    pendingOrders,
    unpaidOrders,
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
