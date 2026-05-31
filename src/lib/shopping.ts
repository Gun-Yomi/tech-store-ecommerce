import "server-only";

import type {
  Brand,
  CartItem,
  Category,
  Product,
  ProductImage,
  SavedItem,
  WishlistItem,
} from "@prisma/client";
import { prisma } from "@/lib/db";

export type ShoppingProduct = Product & {
  brand: Brand;
  category: Category;
  images: ProductImage[];
};

export type CartLineItem = CartItem & {
  product: ShoppingProduct;
};

export type SavedLineItem = SavedItem & {
  product: ShoppingProduct;
};

export type WishlistLineItem = WishlistItem & {
  product: ShoppingProduct;
};

export type CartPageData = {
  cartItems: CartLineItem[];
  savedItems: SavedLineItem[];
  subtotal: number;
  itemCount: number;
};

const activeProductWhere = {
  status: "ACTIVE" as const,
  brand: {
    status: "ACTIVE" as const,
  },
  category: {
    status: "ACTIVE" as const,
  },
};

const shoppingProductInclude = {
  brand: true,
  category: true,
  images: {
    orderBy: {
      sortOrder: "asc" as const,
    },
  },
};

export async function getOrCreateCart(userId: string) {
  return prisma.cart.upsert({
    where: {
      userId,
    },
    update: {},
    create: {
      userId,
    },
    select: {
      id: true,
    },
  });
}

export async function getShoppingCounts(userId?: string | null) {
  if (!userId) {
    return {
      cartCount: 0,
      wishlistCount: 0,
    };
  }

  const [cart, wishlistCount] = await Promise.all([
    prisma.cart.findUnique({
      where: {
        userId,
      },
      include: {
        items: {
          select: {
            quantity: true,
          },
        },
      },
    }),
    prisma.wishlistItem.count({
      where: {
        userId,
      },
    }),
  ]);

  return {
    cartCount: cart?.items.reduce((total, item) => total + item.quantity, 0) ?? 0,
    wishlistCount,
  };
}

export async function getCartPageData(userId: string): Promise<CartPageData> {
  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
    include: {
      items: {
        include: {
          product: {
            include: shoppingProductInclude,
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      },
    },
  });

  const savedItems = await prisma.savedItem.findMany({
    where: {
      userId,
    },
    include: {
      product: {
        include: shoppingProductInclude,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const cartItems = cart?.items ?? [];
  const subtotal = cartItems.reduce((total, item) => {
    const price = item.product.salePrice ?? item.product.price;
    return total + price * item.quantity;
  }, 0);
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return {
    cartItems,
    savedItems,
    subtotal,
    itemCount,
  };
}

export async function getWishlistPageData(userId: string) {
  return prisma.wishlistItem.findMany({
    where: {
      userId,
    },
    include: {
      product: {
        include: shoppingProductInclude,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getActiveProductForShopping(productId: string) {
  return prisma.product.findFirst({
    where: {
      id: productId,
      ...activeProductWhere,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      stockQuantity: true,
    },
  });
}
