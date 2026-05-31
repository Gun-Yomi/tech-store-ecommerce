"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/guards";
import { deleteAllUserSessions } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import {
  type AdminActionState,
  brandFormSchema,
  categoryFormSchema,
  formDataToObject,
  formDataWithBooleans,
  initialAdminActionState,
  preferenceFormSchema,
  productFormSchema,
  toFieldErrors,
  userAdminUpdateSchema,
} from "./validation";

type ProductPayload = z.infer<typeof productFormSchema>;
type CategoryPayload = z.infer<typeof categoryFormSchema>;
type BrandPayload = z.infer<typeof brandFormSchema>;

function redirectWithMessage(
  path: string,
  key: "success" | "error",
  message: string,
): never {
  redirect(`${path}?${key}=${encodeURIComponent(message)}`);
}

function isUniqueConstraintError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

function isForeignKeyConstraintError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003";
}

async function assertUniqueProductIdentifiers(
  payload: ProductPayload,
  existingProductId?: string,
) {
  const conflict = await prisma.product.findFirst({
    where: {
      OR: [{ slug: payload.slug }, { sku: payload.sku }],
      ...(existingProductId
        ? {
            id: {
              not: existingProductId,
            },
          }
        : {}),
    },
    select: {
      slug: true,
      sku: true,
    },
  });

  if (!conflict) {
    return null;
  }

  return {
    fieldErrors: {
      ...(conflict.slug === payload.slug
        ? { slug: ["A product already uses this slug."] }
        : {}),
      ...(conflict.sku === payload.sku
        ? { sku: ["A product already uses this SKU."] }
        : {}),
    },
  };
}

function normalizeProductImages(payload: ProductPayload) {
  const imageUrls = Array.from(
    new Set([payload.featuredImage, ...payload.productImages].filter(Boolean)),
  );

  return imageUrls.map((url, index) => ({
    url,
    altText: `${payload.name} image ${index + 1}`,
    sortOrder: index,
  }));
}

function productDataFromPayload(payload: ProductPayload) {
  return {
    name: payload.name,
    slug: payload.slug,
    sku: payload.sku,
    brandId: payload.brandId,
    categoryId: payload.categoryId,
    shortDescription: payload.shortDescription,
    fullDescription: payload.fullDescription,
    price: payload.price,
    salePrice: payload.salePrice,
    stockQuantity: payload.stockQuantity,
    featuredImage: payload.featuredImage,
    tags: JSON.stringify(payload.tags),
    specifications: JSON.stringify(payload.specifications),
    warrantyInfo: payload.warrantyInfo,
    status: payload.status,
    isFeatured: payload.isFeatured,
    isNewArrival: payload.isNewArrival,
    isBestSeller: payload.isBestSeller,
  };
}

export async function createProductAction(
  _previousState: AdminActionState = initialAdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  void _previousState;
  await requireAdmin();

  const values = formDataToObject(formData);
  const parsed = productFormSchema.safeParse(formDataWithBooleans(formData));

  if (!parsed.success) {
    return {
      fieldErrors: toFieldErrors(parsed.error),
      values,
    };
  }

  const uniqueError = await assertUniqueProductIdentifiers(parsed.data);

  if (uniqueError) {
    return {
      ...uniqueError,
      values,
    };
  }

  let productId: string;

  try {
    const product = await prisma.product.create({
      data: {
        ...productDataFromPayload(parsed.data),
        images: {
          create: normalizeProductImages(parsed.data),
        },
      },
      select: {
        id: true,
      },
    });
    productId = product.id;
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        formError: "A product with this slug or SKU already exists.",
        values,
      };
    }

    return {
      formError: "Product could not be created. Review the fields and try again.",
      values,
    };
  }

  revalidatePath("/");
  revalidatePath("/products");
  redirect(`/admin/products/${productId}/edit?success=Product%20created.`);
}

export async function updateProductAction(
  productId: string,
  _previousState: AdminActionState = initialAdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  void _previousState;
  await requireAdmin();

  const values = formDataToObject(formData);
  const parsed = productFormSchema.safeParse(formDataWithBooleans(formData));

  if (!parsed.success) {
    return {
      fieldErrors: toFieldErrors(parsed.error),
      values,
    };
  }

  const uniqueError = await assertUniqueProductIdentifiers(parsed.data, productId);

  if (uniqueError) {
    return {
      ...uniqueError,
      values,
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: {
          id: productId,
        },
        data: productDataFromPayload(parsed.data),
      });

      await tx.productImage.deleteMany({
        where: {
          productId,
        },
      });

      await tx.productImage.createMany({
        data: normalizeProductImages(parsed.data).map((image) => ({
          ...image,
          productId,
        })),
      });
    });

  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        formError: "A product with this slug or SKU already exists.",
        values,
      };
    }

    return {
      formError: "Product could not be updated. Review the fields and try again.",
      values,
    };
  }

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/products/${parsed.data.slug}`);
  redirect(`/admin/products/${productId}/edit?success=Product%20updated.`);
}

export async function archiveProductAction(formData: FormData) {
  await requireAdmin();

  const productId = String(formData.get("productId") ?? "");
  const product = await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      status: "ARCHIVED",
    },
    select: {
      slug: true,
    },
  });

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/products/${product.slug}`);
  redirectWithMessage("/admin/products", "success", "Product archived.");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();

  const productId = String(formData.get("productId") ?? "");
  const relatedCount = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      _count: {
        select: {
          cartItems: true,
          wishlistItems: true,
          savedItems: true,
        },
      },
    },
  });

  if (!relatedCount) {
    redirectWithMessage("/admin/products", "error", "Product was not found.");
  }

  const hasReferences =
    relatedCount._count.cartItems > 0 ||
    relatedCount._count.wishlistItems > 0 ||
    relatedCount._count.savedItems > 0;

  if (hasReferences) {
    redirectWithMessage(
      "/admin/products",
      "error",
      "Product has cart, wishlist, or saved-item references. Archive it instead.",
    );
  }

  await prisma.product.delete({
    where: {
      id: productId,
    },
  });

  revalidatePath("/");
  revalidatePath("/products");
  redirectWithMessage("/admin/products", "success", "Product permanently deleted.");
}

async function assertUniqueCategorySlug(payload: CategoryPayload, categoryId?: string) {
  const conflict = await prisma.category.findFirst({
    where: {
      slug: payload.slug,
      ...(categoryId
        ? {
            id: {
              not: categoryId,
            },
          }
        : {}),
    },
    select: {
      id: true,
    },
  });

  return conflict ? { slug: ["A category already uses this slug."] } : null;
}

export async function createCategoryAction(
  _previousState: AdminActionState = initialAdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  void _previousState;
  await requireAdmin();

  const values = formDataToObject(formData);
  const parsed = categoryFormSchema.safeParse(formDataWithBooleans(formData));

  if (!parsed.success) {
    return {
      fieldErrors: toFieldErrors(parsed.error),
      values,
    };
  }

  const slugError = await assertUniqueCategorySlug(parsed.data);

  if (slugError) {
    return {
      fieldErrors: slugError,
      values,
    };
  }

  await prisma.category.create({
    data: parsed.data,
  });

  revalidatePath("/");
  revalidatePath("/categories");
  redirectWithMessage("/admin/categories", "success", "Category created.");
}

export async function updateCategoryAction(
  categoryId: string,
  _previousState: AdminActionState = initialAdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  void _previousState;
  await requireAdmin();

  const values = formDataToObject(formData);
  const parsed = categoryFormSchema.safeParse(formDataWithBooleans(formData));

  if (!parsed.success) {
    return {
      fieldErrors: toFieldErrors(parsed.error),
      values,
    };
  }

  const slugError = await assertUniqueCategorySlug(parsed.data, categoryId);

  if (slugError) {
    return {
      fieldErrors: slugError,
      values,
    };
  }

  await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: parsed.data,
  });

  revalidatePath("/");
  revalidatePath("/categories");
  revalidatePath(`/categories/${parsed.data.slug}`);
  redirectWithMessage("/admin/categories", "success", "Category updated.");
}

export async function archiveCategoryAction(formData: FormData) {
  await requireAdmin();

  const categoryId = String(formData.get("categoryId") ?? "");
  await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      status: "INACTIVE",
    },
  });

  revalidatePath("/");
  revalidatePath("/categories");
  redirectWithMessage("/admin/categories", "success", "Category set inactive.");
}

export async function deleteCategoryAction(formData: FormData) {
  await requireAdmin();

  const categoryId = String(formData.get("categoryId") ?? "");
  const activeProducts = await prisma.product.count({
    where: {
      categoryId,
      status: "ACTIVE",
    },
  });

  if (activeProducts > 0) {
    redirectWithMessage(
      "/admin/categories",
      "error",
      "Category has active products. Set it inactive or reassign products first.",
    );
  }

  try {
    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });
  } catch (error) {
    if (isForeignKeyConstraintError(error)) {
      redirectWithMessage(
        "/admin/categories",
        "error",
        "Category still has product records. Set it inactive or reassign products first.",
      );
    }

    redirectWithMessage("/admin/categories", "error", "Category could not be deleted.");
  }

  revalidatePath("/");
  revalidatePath("/categories");
  redirectWithMessage("/admin/categories", "success", "Category deleted.");
}

async function assertUniqueBrandSlug(payload: BrandPayload, brandId?: string) {
  const conflict = await prisma.brand.findFirst({
    where: {
      slug: payload.slug,
      ...(brandId
        ? {
            id: {
              not: brandId,
            },
          }
        : {}),
    },
    select: {
      id: true,
    },
  });

  return conflict ? { slug: ["A brand already uses this slug."] } : null;
}

export async function createBrandAction(
  _previousState: AdminActionState = initialAdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  void _previousState;
  await requireAdmin();

  const values = formDataToObject(formData);
  const parsed = brandFormSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return {
      fieldErrors: toFieldErrors(parsed.error),
      values,
    };
  }

  const slugError = await assertUniqueBrandSlug(parsed.data);

  if (slugError) {
    return {
      fieldErrors: slugError,
      values,
    };
  }

  await prisma.brand.create({
    data: parsed.data,
  });

  revalidatePath("/");
  revalidatePath("/brands");
  redirectWithMessage("/admin/brands", "success", "Brand created.");
}

export async function updateBrandAction(
  brandId: string,
  _previousState: AdminActionState = initialAdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  void _previousState;
  await requireAdmin();

  const values = formDataToObject(formData);
  const parsed = brandFormSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return {
      fieldErrors: toFieldErrors(parsed.error),
      values,
    };
  }

  const slugError = await assertUniqueBrandSlug(parsed.data, brandId);

  if (slugError) {
    return {
      fieldErrors: slugError,
      values,
    };
  }

  await prisma.brand.update({
    where: {
      id: brandId,
    },
    data: parsed.data,
  });

  revalidatePath("/");
  revalidatePath("/brands");
  revalidatePath(`/brands/${parsed.data.slug}`);
  redirectWithMessage("/admin/brands", "success", "Brand updated.");
}

export async function archiveBrandAction(formData: FormData) {
  await requireAdmin();

  const brandId = String(formData.get("brandId") ?? "");
  await prisma.brand.update({
    where: {
      id: brandId,
    },
    data: {
      status: "INACTIVE",
    },
  });

  revalidatePath("/");
  revalidatePath("/brands");
  redirectWithMessage("/admin/brands", "success", "Brand set inactive.");
}

export async function deleteBrandAction(formData: FormData) {
  await requireAdmin();

  const brandId = String(formData.get("brandId") ?? "");
  const activeProducts = await prisma.product.count({
    where: {
      brandId,
      status: "ACTIVE",
    },
  });

  if (activeProducts > 0) {
    redirectWithMessage(
      "/admin/brands",
      "error",
      "Brand has active products. Set it inactive or reassign products first.",
    );
  }

  try {
    await prisma.brand.delete({
      where: {
        id: brandId,
      },
    });
  } catch (error) {
    if (isForeignKeyConstraintError(error)) {
      redirectWithMessage(
        "/admin/brands",
        "error",
        "Brand still has product records. Set it inactive or reassign products first.",
      );
    }

    redirectWithMessage("/admin/brands", "error", "Brand could not be deleted.");
  }

  revalidatePath("/");
  revalidatePath("/brands");
  redirectWithMessage("/admin/brands", "success", "Brand deleted.");
}

export async function updatePreferencesAction(
  _previousState: AdminActionState = initialAdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  void _previousState;
  await requireAdmin();

  const values = formDataToObject(formData);
  const parsed = preferenceFormSchema.safeParse(formDataWithBooleans(formData));

  if (!parsed.success) {
    return {
      fieldErrors: toFieldErrors(parsed.error),
      values,
    };
  }

  const data = {
    ...parsed.data,
    featuredCategorySlugs: JSON.stringify(parsed.data.featuredCategorySlugs),
  };
  const existing = await prisma.sitePreference.findFirst({
    select: {
      id: true,
    },
  });

  if (existing) {
    await prisma.sitePreference.update({
      where: {
        id: existing.id,
      },
      data,
    });
  } else {
    await prisma.sitePreference.create({
      data,
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/preferences");
  return {
    successMessage: "Site preferences updated.",
  };
}

export async function updateUserAdminAction(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = userAdminUpdateSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    redirectWithMessage("/admin/users", "error", "User update was invalid.");
  }

  const targetUser = await prisma.user.findUnique({
    where: {
      id: parsed.data.userId,
    },
    select: {
      id: true,
      role: true,
      status: true,
    },
  });

  if (!targetUser) {
    redirectWithMessage("/admin/users", "error", "User was not found.");
  }

  if (targetUser.id === admin.id && parsed.data.status === "DISABLED") {
    redirectWithMessage("/admin/users", "error", "You cannot disable your own admin account.");
  }

  const demotingAdmin =
    targetUser.role === "ADMIN" && parsed.data.role !== "ADMIN";
  const disablingAdmin =
    targetUser.role === "ADMIN" && parsed.data.status === "DISABLED";

  if (demotingAdmin || disablingAdmin) {
    const adminCount = await prisma.user.count({
      where: {
        role: "ADMIN",
        status: "ACTIVE",
      },
    });

    if (adminCount <= 1) {
      redirectWithMessage(
        "/admin/users",
        "error",
        "Cannot remove or disable the last active admin.",
      );
    }
  }

  await prisma.user.update({
    where: {
      id: parsed.data.userId,
    },
    data: {
      role: parsed.data.role,
      status: parsed.data.status,
    },
  });

  if (parsed.data.status === "DISABLED") {
    await deleteAllUserSessions(parsed.data.userId);
  }

  revalidatePath("/admin/users");
  redirectWithMessage("/admin/users", "success", "User updated.");
}
