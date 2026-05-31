import "server-only";

import type { OrderStatus, PaymentStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export type AdminOrderFilters = {
  search?: string;
  status?: string;
  paymentStatus?: string;
};

const orderDetailInclude = {
  items: {
    include: {
      product: {
        select: {
          slug: true,
          featuredImage: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc" as const,
    },
  },
};

export async function getCheckoutCart(userId: string) {
  return prisma.cart.findUnique({
    where: {
      userId,
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              brand: true,
              category: true,
              images: {
                orderBy: {
                  sortOrder: "asc",
                },
              },
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      },
    },
  });
}

export async function getCustomerOrders(userId: string) {
  return prisma.order.findMany({
    where: {
      userId,
    },
    include: {
      _count: {
        select: {
          items: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCustomerOrderByNumber(userId: string, orderNumber: string) {
  return prisma.order.findFirst({
    where: {
      userId,
      orderNumber,
    },
    include: orderDetailInclude,
  });
}

function buildAdminOrderWhere(filters: AdminOrderFilters) {
  const search = filters.search?.trim();

  return {
    ...(filters.status && filters.status !== "ALL"
      ? {
          status: filters.status as OrderStatus,
        }
      : {}),
    ...(filters.paymentStatus && filters.paymentStatus !== "ALL"
      ? {
          paymentStatus: filters.paymentStatus as PaymentStatus,
        }
      : {}),
    ...(search
      ? {
          OR: [
            { orderNumber: { contains: search } },
            { customerName: { contains: search } },
            { customerEmail: { contains: search } },
          ],
        }
      : {}),
  } satisfies Prisma.OrderWhereInput;
}

export async function getAdminOrders(filters: AdminOrderFilters = {}) {
  return prisma.order.findMany({
    where: buildAdminOrderWhere(filters),
    include: {
      _count: {
        select: {
          items: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getAdminOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: {
      orderNumber,
    },
    include: {
      ...orderDetailInclude,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
        },
      },
    },
  });
}
