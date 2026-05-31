"use server";

import { randomBytes } from "crypto";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, requireUser } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";
import {
  adminOrderUpdateSchema,
  checkoutSchema,
  type CheckoutActionState,
  formDataToObject,
  initialCheckoutActionState,
  toFieldErrors,
} from "./validation";

class CheckoutError extends Error {}

function isUniqueConstraintError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

function redirectWithMessage(
  path: string,
  key: "success" | "error",
  message: string,
): never {
  redirect(`${path}?${key}=${encodeURIComponent(message)}`);
}

function generateOrderNumber() {
  const now = new Date();
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");
  const suffix = randomBytes(3).toString("hex").toUpperCase();

  return `ORD-${date}-${suffix}`;
}

function isPurchasableProduct(product: {
  status: string;
  brand: { status: string };
  category: { status: string };
}) {
  return (
    product.status === "ACTIVE" &&
    product.brand.status === "ACTIVE" &&
    product.category.status === "ACTIVE"
  );
}

export async function createOrderAction(
  _previousState: CheckoutActionState = initialCheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  void _previousState;
  const user = await requireUser();
  const rawValues = formDataToObject(formData);
  const parsed = checkoutSchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      fieldErrors: toFieldErrors(parsed.error),
      values: rawValues,
    };
  }

  let createdOrderNumber = "";

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const orderNumber = generateOrderNumber();

    try {
      await prisma.$transaction(async (tx) => {
        const cart = await tx.cart.findUnique({
          where: {
            userId: user.id,
          },
          include: {
            items: {
              include: {
                product: {
                  include: {
                    brand: true,
                    category: true,
                  },
                },
              },
            },
          },
        });

        const cartItems = cart?.items ?? [];

        if (!cart || cartItems.length === 0) {
          throw new CheckoutError("Your cart is empty.");
        }

        for (const item of cartItems) {
          if (!isPurchasableProduct(item.product)) {
            throw new CheckoutError(`${item.product.name} is no longer available.`);
          }

          if (item.quantity < 1) {
            throw new CheckoutError(`${item.product.name} has an invalid quantity.`);
          }

          if (item.quantity > item.product.stockQuantity) {
            throw new CheckoutError(
              `Only ${item.product.stockQuantity} of ${item.product.name} is available.`,
            );
          }
        }

        const subtotal = cartItems.reduce((total, item) => {
          const unitPrice = item.product.salePrice ?? item.product.price;
          return total + unitPrice * item.quantity;
        }, 0);
        const discountTotal = 0;
        const shippingTotal = 0;
        const taxTotal = 0;
        const total = subtotal + shippingTotal + taxTotal - discountTotal;

        for (const item of cartItems) {
          const update = await tx.product.updateMany({
            where: {
              id: item.productId,
              status: "ACTIVE",
              stockQuantity: {
                gte: item.quantity,
              },
              brand: {
                status: "ACTIVE",
              },
              category: {
                status: "ACTIVE",
              },
            },
            data: {
              stockQuantity: {
                decrement: item.quantity,
              },
            },
          });

          if (update.count !== 1) {
            throw new CheckoutError(
              `${item.product.name} stock changed while checking out. Review your cart and try again.`,
            );
          }
        }

        await tx.order.create({
          data: {
            orderNumber,
            userId: user.id,
            customerName: parsed.data.fullName,
            customerEmail: parsed.data.email,
            customerPhone: parsed.data.phone,
            shippingAddressLine1:
              parsed.data.deliveryMethod === "DELIVERY"
                ? parsed.data.addressLine1
                : "",
            shippingAddressLine2:
              parsed.data.deliveryMethod === "DELIVERY"
                ? parsed.data.addressLine2
                : "",
            cityParishState:
              parsed.data.deliveryMethod === "DELIVERY"
                ? parsed.data.cityParishState
                : "Pickup",
            country:
              parsed.data.deliveryMethod === "DELIVERY"
                ? parsed.data.country
                : "Pickup",
            deliveryMethod: parsed.data.deliveryMethod,
            notes: parsed.data.notes,
            subtotal,
            discountTotal,
            shippingTotal,
            taxTotal,
            total,
            status: "PENDING",
            paymentStatus: "UNPAID",
            items: {
              create: cartItems.map((item) => {
                const unitPrice = item.product.salePrice ?? item.product.price;

                return {
                  productId: item.productId,
                  productNameSnapshot: item.product.name,
                  productSkuSnapshot: item.product.sku,
                  priceSnapshot: item.product.price,
                  salePriceSnapshot: item.product.salePrice,
                  quantity: item.quantity,
                  lineTotal: unitPrice * item.quantity,
                };
              }),
            },
          },
        });

        await tx.cartItem.deleteMany({
          where: {
            cartId: cart.id,
            id: {
              in: cartItems.map((item) => item.id),
            },
          },
        });
      });
      createdOrderNumber = orderNumber;
      break;
    } catch (error) {
      if (error instanceof CheckoutError) {
        return {
          formError: error.message,
          values: rawValues,
        };
      }

      if (isUniqueConstraintError(error)) {
        continue;
      }

      return {
        formError: "Checkout could not be completed. Review your cart and try again.",
        values: rawValues,
      };
    }
  }

  if (createdOrderNumber) {
    revalidatePath("/");
    revalidatePath("/cart");
    revalidatePath("/checkout");
    revalidatePath("/account");
    revalidatePath("/account/orders");
    redirect(`/orders/${createdOrderNumber}`);
  }

  return {
    formError: "Could not create a unique order number. Try again.",
    values: rawValues,
  };
}

export async function updateAdminOrderAction(formData: FormData) {
  await requireAdmin();
  const parsed = adminOrderUpdateSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    redirectWithMessage("/admin/orders", "error", "Order update was invalid.");
  }

  const { orderId, orderNumber, status, paymentStatus } = parsed.data;

  try {
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: {
          id: orderId,
        },
        include: {
          items: {
            select: {
              productId: true,
              quantity: true,
            },
          },
        },
      });

      if (!order) {
        throw new Error("missing-order");
      }

      if (order.status === "COMPLETED" && status === "CANCELLED") {
        throw new Error("completed-cancel");
      }

      const shouldRestoreStock =
        status === "CANCELLED" &&
        order.status !== "CANCELLED" &&
        !order.stockRestoredAt;

      if (shouldRestoreStock) {
        for (const item of order.items) {
          await tx.product.update({
            where: {
              id: item.productId,
            },
            data: {
              stockQuantity: {
                increment: item.quantity,
              },
            },
          });
        }
      }

      await tx.order.update({
        where: {
          id: orderId,
        },
        data: {
          status,
          paymentStatus,
          ...(shouldRestoreStock
            ? {
                stockRestoredAt: new Date(),
              }
            : {}),
        },
      });
    });
  } catch (error) {
    if (error instanceof Error && error.message === "completed-cancel") {
      redirectWithMessage(
        `/admin/orders/${orderNumber}`,
        "error",
        "Completed orders cannot be cancelled here.",
      );
    }

    redirectWithMessage(
      `/admin/orders/${orderNumber}`,
      "error",
      "Order could not be updated.",
    );
  }

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderNumber}`);
  revalidatePath(`/orders/${orderNumber}`);
  revalidatePath("/account/orders");
  redirectWithMessage(`/admin/orders/${orderNumber}`, "success", "Order updated.");
}
