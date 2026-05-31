import { z } from "zod";

export type CheckoutActionState = {
  formError?: string;
  successMessage?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  values?: Record<string, string>;
};

export const initialCheckoutActionState: CheckoutActionState = {};

export const deliveryMethods = ["DELIVERY", "PICKUP"] as const;
export const orderStatuses = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "READY_FOR_PICKUP",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
] as const;
export const paymentStatuses = [
  "UNPAID",
  "PENDING",
  "PAID",
  "REFUNDED",
  "FAILED",
] as const;

const requiredText = (label: string, max = 160) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(max, `${label} must be ${max} characters or fewer.`);

const optionalText = (max = 600) =>
  z
    .string()
    .trim()
    .max(max, `Must be ${max} characters or fewer.`)
    .optional()
    .default("");

export const checkoutSchema = z
  .object({
    fullName: requiredText("Full name", 120),
    email: z
      .string()
      .trim()
      .email("Enter a valid email address.")
      .transform((email) => email.toLowerCase()),
    phone: requiredText("Phone number", 40),
    deliveryMethod: z.enum(deliveryMethods),
    addressLine1: optionalText(180),
    addressLine2: optionalText(180),
    cityParishState: optionalText(120),
    country: optionalText(120),
    notes: optionalText(1000),
  })
  .superRefine((data, context) => {
    if (data.deliveryMethod !== "DELIVERY") {
      return;
    }

    if (!data.addressLine1) {
      context.addIssue({
        code: "custom",
        message: "Address line 1 is required for delivery.",
        path: ["addressLine1"],
      });
    }

    if (!data.cityParishState) {
      context.addIssue({
        code: "custom",
        message: "City, town, parish, or state is required for delivery.",
        path: ["cityParishState"],
      });
    }

    if (!data.country) {
      context.addIssue({
        code: "custom",
        message: "Country is required for delivery.",
        path: ["country"],
      });
    }
  });

export const adminOrderUpdateSchema = z.object({
  orderId: z.string().trim().min(1, "Order is required."),
  orderNumber: z.string().trim().min(1, "Order number is required."),
  status: z.enum(orderStatuses),
  paymentStatus: z.enum(paymentStatuses),
});

export function formDataToObject(formData: FormData) {
  return Object.fromEntries(
    Array.from(formData.entries()).map(([key, value]) => [
      key,
      typeof value === "string" ? value : "",
    ]),
  ) as Record<string, string>;
}

export function toFieldErrors(error: z.ZodError) {
  return error.flatten().fieldErrors as Record<string, string[] | undefined>;
}

export function orderStatusLabel(status: string) {
  return status
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}
