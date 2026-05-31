"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import {
  getActiveProductForShopping,
  getOrCreateCart,
} from "@/lib/shopping";

export type ShoppingActionState = {
  formError?: string;
  successMessage?: string;
};

const SIGN_IN_MESSAGE = "Sign in to use your cart and wishlist.";

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getPositiveInteger(formData: FormData, key: string, fallback = 1) {
  const value = Number(getStringValue(formData, key));
  return Number.isInteger(value) && value >= 1 ? value : fallback;
}

async function getActionUser() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      ok: false as const,
      state: {
        formError: SIGN_IN_MESSAGE,
      },
    };
  }

  return {
    ok: true as const,
    user,
  };
}

function revalidateShoppingPaths(productSlug?: string) {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/cart");
  revalidatePath("/wishlist");

  if (productSlug) {
    revalidatePath(`/products/${productSlug}`);
  }
}

async function addProductToCart(userId: string, productId: string, quantity: number) {
  const product = await getActiveProductForShopping(productId);

  if (!product) {
    return {
      ok: false as const,
      state: {
        formError: "This product is not available.",
      },
    };
  }

  if (product.stockQuantity < 1) {
    return {
      ok: false as const,
      product,
      state: {
        formError: `${product.name} is out of stock.`,
      },
    };
  }

  const cart = await getOrCreateCart(userId);
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId: product.id,
      },
    },
    select: {
      id: true,
      quantity: true,
    },
  });
  const nextQuantity = (existingItem?.quantity ?? 0) + quantity;

  if (nextQuantity > product.stockQuantity) {
    return {
      ok: false as const,
      product,
      state: {
        formError: `Only ${product.stockQuantity} available. Adjust the quantity and try again.`,
      },
    };
  }

  if (existingItem) {
    await prisma.cartItem.update({
      where: {
        id: existingItem.id,
      },
      data: {
        quantity: nextQuantity,
      },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: product.id,
        quantity,
      },
    });
  }

  return {
    ok: true as const,
    product,
    state: {
      successMessage: `${product.name} added to cart.`,
    },
  };
}

async function addProductToSaved(userId: string, productId: string, quantity: number) {
  const product = await getActiveProductForShopping(productId);

  if (!product) {
    return {
      ok: false as const,
      state: {
        formError: "This product is not available.",
      },
    };
  }

  const existingItem = await prisma.savedItem.findUnique({
    where: {
      userId_productId: {
        userId,
        productId: product.id,
      },
    },
    select: {
      id: true,
      quantity: true,
    },
  });
  const nextQuantity = Math.max(1, existingItem ? existingItem.quantity + quantity : quantity);

  if (existingItem) {
    await prisma.savedItem.update({
      where: {
        id: existingItem.id,
      },
      data: {
        quantity: nextQuantity,
      },
    });
  } else {
    await prisma.savedItem.create({
      data: {
        userId,
        productId: product.id,
        quantity,
      },
    });
  }

  return {
    ok: true as const,
    product,
    state: {
      successMessage: `${product.name} saved for later.`,
    },
  };
}

export async function addToCartAction(
  _previousState: ShoppingActionState,
  formData: FormData,
): Promise<ShoppingActionState> {
  const auth = await getActionUser();

  if (!auth.ok) {
    return auth.state;
  }

  const productId = getStringValue(formData, "productId");
  const quantity = getPositiveInteger(formData, "quantity", 1);
  const result = await addProductToCart(auth.user.id, productId, quantity);

  if (result.product) {
    revalidateShoppingPaths(result.product.slug);
  }

  return result.state;
}

export async function addToWishlistAction(
  _previousState: ShoppingActionState,
  formData: FormData,
): Promise<ShoppingActionState> {
  const auth = await getActionUser();

  if (!auth.ok) {
    return auth.state;
  }

  const productId = getStringValue(formData, "productId");
  const product = await getActiveProductForShopping(productId);

  if (!product) {
    return {
      formError: "This product is not available.",
    };
  }

  await prisma.wishlistItem.upsert({
    where: {
      userId_productId: {
        userId: auth.user.id,
        productId: product.id,
      },
    },
    update: {},
    create: {
      userId: auth.user.id,
      productId: product.id,
    },
  });

  revalidateShoppingPaths(product.slug);

  return {
    successMessage: `${product.name} added to wishlist.`,
  };
}

export async function saveProductForLaterAction(
  _previousState: ShoppingActionState,
  formData: FormData,
): Promise<ShoppingActionState> {
  const auth = await getActionUser();

  if (!auth.ok) {
    return auth.state;
  }

  const productId = getStringValue(formData, "productId");
  const quantity = getPositiveInteger(formData, "quantity", 1);
  const result = await addProductToSaved(auth.user.id, productId, quantity);

  if (result.product) {
    revalidateShoppingPaths(result.product.slug);
  }

  return result.state;
}

export async function updateCartItemQuantityAction(
  _previousState: ShoppingActionState,
  formData: FormData,
): Promise<ShoppingActionState> {
  const auth = await getActionUser();

  if (!auth.ok) {
    return auth.state;
  }

  const cartItemId = getStringValue(formData, "cartItemId");
  const quantity = getPositiveInteger(formData, "quantity", 1);
  const item = await prisma.cartItem.findFirst({
    where: {
      id: cartItemId,
      cart: {
        userId: auth.user.id,
      },
    },
    include: {
      product: {
        select: {
          name: true,
          slug: true,
          stockQuantity: true,
          status: true,
          brand: {
            select: {
              status: true,
            },
          },
          category: {
            select: {
              status: true,
            },
          },
        },
      },
    },
  });

  if (!item) {
    return {
      formError: "Cart item was not found.",
    };
  }

  if (
    item.product.status !== "ACTIVE" ||
    item.product.brand.status !== "ACTIVE" ||
    item.product.category.status !== "ACTIVE"
  ) {
    return {
      formError: "This product is no longer available.",
    };
  }

  if (quantity > item.product.stockQuantity) {
    return {
      formError: `Only ${item.product.stockQuantity} available.`,
    };
  }

  await prisma.cartItem.update({
    where: {
      id: item.id,
    },
    data: {
      quantity,
    },
  });

  revalidateShoppingPaths(item.product.slug);

  return {
    successMessage: `${item.product.name} quantity updated.`,
  };
}

export async function removeCartItemAction(
  _previousState: ShoppingActionState,
  formData: FormData,
): Promise<ShoppingActionState> {
  const auth = await getActionUser();

  if (!auth.ok) {
    return auth.state;
  }

  const cartItemId = getStringValue(formData, "cartItemId");
  const item = await prisma.cartItem.findFirst({
    where: {
      id: cartItemId,
      cart: {
        userId: auth.user.id,
      },
    },
    include: {
      product: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!item) {
    return {
      formError: "Cart item was not found.",
    };
  }

  await prisma.cartItem.delete({
    where: {
      id: item.id,
    },
  });

  revalidateShoppingPaths(item.product.slug);

  return {
    successMessage: `${item.product.name} removed from cart.`,
  };
}

export async function moveCartItemToSavedAction(
  _previousState: ShoppingActionState,
  formData: FormData,
): Promise<ShoppingActionState> {
  const auth = await getActionUser();

  if (!auth.ok) {
    return auth.state;
  }

  const cartItemId = getStringValue(formData, "cartItemId");
  const item = await prisma.cartItem.findFirst({
    where: {
      id: cartItemId,
      cart: {
        userId: auth.user.id,
      },
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          status: true,
          brand: {
            select: {
              status: true,
            },
          },
          category: {
            select: {
              status: true,
            },
          },
        },
      },
    },
  });

  if (!item) {
    return {
      formError: "Cart item was not found.",
    };
  }

  if (
    item.product.status !== "ACTIVE" ||
    item.product.brand.status !== "ACTIVE" ||
    item.product.category.status !== "ACTIVE"
  ) {
    return {
      formError: "This product is no longer available.",
    };
  }

  await prisma.$transaction(async (tx) => {
    const existingSavedItem = await tx.savedItem.findUnique({
      where: {
        userId_productId: {
          userId: auth.user.id,
          productId: item.product.id,
        },
      },
      select: {
        id: true,
        quantity: true,
      },
    });

    if (existingSavedItem) {
      await tx.savedItem.update({
        where: {
          id: existingSavedItem.id,
        },
        data: {
          quantity: existingSavedItem.quantity + item.quantity,
        },
      });
    } else {
      await tx.savedItem.create({
        data: {
          userId: auth.user.id,
          productId: item.product.id,
          quantity: item.quantity,
        },
      });
    }

    await tx.cartItem.delete({
      where: {
        id: item.id,
      },
    });
  });

  revalidateShoppingPaths(item.product.slug);

  return {
    successMessage: `${item.product.name} moved to save for later.`,
  };
}

export async function removeWishlistItemAction(
  _previousState: ShoppingActionState,
  formData: FormData,
): Promise<ShoppingActionState> {
  const auth = await getActionUser();

  if (!auth.ok) {
    return auth.state;
  }

  const wishlistItemId = getStringValue(formData, "wishlistItemId");
  const item = await prisma.wishlistItem.findFirst({
    where: {
      id: wishlistItemId,
      userId: auth.user.id,
    },
    include: {
      product: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!item) {
    return {
      formError: "Wishlist item was not found.",
    };
  }

  await prisma.wishlistItem.delete({
    where: {
      id: item.id,
    },
  });

  revalidateShoppingPaths(item.product.slug);

  return {
    successMessage: `${item.product.name} removed from wishlist.`,
  };
}

export async function moveWishlistItemToCartAction(
  _previousState: ShoppingActionState,
  formData: FormData,
): Promise<ShoppingActionState> {
  const auth = await getActionUser();

  if (!auth.ok) {
    return auth.state;
  }

  const wishlistItemId = getStringValue(formData, "wishlistItemId");
  const item = await prisma.wishlistItem.findFirst({
    where: {
      id: wishlistItemId,
      userId: auth.user.id,
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!item) {
    return {
      formError: "Wishlist item was not found.",
    };
  }

  const result = await addProductToCart(auth.user.id, item.product.id, 1);

  if (!result.ok) {
    if (result.product) {
      revalidateShoppingPaths(result.product.slug);
    }

    return result.state;
  }

  await prisma.wishlistItem.delete({
    where: {
      id: item.id,
    },
  });

  revalidateShoppingPaths(item.product.slug);

  return {
    successMessage: `${item.product.name} moved to cart.`,
  };
}

export async function moveSavedItemToCartAction(
  _previousState: ShoppingActionState,
  formData: FormData,
): Promise<ShoppingActionState> {
  const auth = await getActionUser();

  if (!auth.ok) {
    return auth.state;
  }

  const savedItemId = getStringValue(formData, "savedItemId");
  const item = await prisma.savedItem.findFirst({
    where: {
      id: savedItemId,
      userId: auth.user.id,
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!item) {
    return {
      formError: "Saved item was not found.",
    };
  }

  const result = await addProductToCart(auth.user.id, item.product.id, item.quantity);

  if (!result.ok) {
    if (result.product) {
      revalidateShoppingPaths(result.product.slug);
    }

    return result.state;
  }

  await prisma.savedItem.delete({
    where: {
      id: item.id,
    },
  });

  revalidateShoppingPaths(item.product.slug);

  return {
    successMessage: `${item.product.name} moved to cart.`,
  };
}

export async function removeSavedItemAction(
  _previousState: ShoppingActionState,
  formData: FormData,
): Promise<ShoppingActionState> {
  const auth = await getActionUser();

  if (!auth.ok) {
    return auth.state;
  }

  const savedItemId = getStringValue(formData, "savedItemId");
  const item = await prisma.savedItem.findFirst({
    where: {
      id: savedItemId,
      userId: auth.user.id,
    },
    include: {
      product: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!item) {
    return {
      formError: "Saved item was not found.",
    };
  }

  await prisma.savedItem.delete({
    where: {
      id: item.id,
    },
  });

  revalidateShoppingPaths(item.product.slug);

  return {
    successMessage: `${item.product.name} removed from saved items.`,
  };
}
