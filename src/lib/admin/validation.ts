import { z } from "zod";

export type AdminActionState = {
  formError?: string;
  successMessage?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  values?: Record<string, string>;
};

export const initialAdminActionState: AdminActionState = {};

const productStatuses = ["ACTIVE", "DRAFT", "ARCHIVED"] as const;
const catalogStatuses = ["ACTIVE", "INACTIVE"] as const;
const userRoles = ["CUSTOMER", "ADMIN"] as const;
const userStatuses = ["ACTIVE", "DISABLED"] as const;

const optionalText = z.string().trim().optional().default("");

const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required.")
  .max(120, "Slug must be 120 characters or fewer.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens.");

const imageUrlSchema = z
  .string()
  .trim()
  .min(1, "Image URL is required.")
  .max(600, "Image URL must be 600 characters or fewer.")
  .refine(
    (value) =>
      value.startsWith("/") ||
      value.startsWith("https://") ||
      value.startsWith("http://"),
    "Use a public path or full image URL.",
  );

const optionalUrlSchema = z
  .string()
  .trim()
  .max(600, "URL must be 600 characters or fewer.")
  .optional()
  .default("")
  .refine(
    (value) =>
      !value ||
      value.startsWith("/") ||
      value.startsWith("https://") ||
      value.startsWith("http://"),
    "Use a public path or full URL.",
  );

const moneySchema = z
  .string()
  .trim()
  .min(1, "Price is required.")
  .refine((value) => {
    const amount = Number(value.replace(/[$,]/g, ""));
    return Number.isFinite(amount) && amount >= 0;
  }, "Enter a valid non-negative price.")
  .transform((value) => Math.round(Number(value.replace(/[$,]/g, "")) * 100));

const optionalMoneySchema = z
  .string()
  .trim()
  .optional()
  .default("")
  .refine((value) => {
    if (!value) {
      return true;
    }

    const amount = Number(value.replace(/[$,]/g, ""));
    return Number.isFinite(amount) && amount >= 0;
  }, "Enter a valid non-negative sale price.")
  .transform((value) =>
    value ? Math.round(Number(value.replace(/[$,]/g, "")) * 100) : null,
  );

const nonNegativeIntegerSchema = z
  .string()
  .trim()
  .min(1, "Stock quantity is required.")
  .refine((value) => Number.isInteger(Number(value)), "Enter a whole number.")
  .transform((value) => Number(value))
  .refine((value) => value >= 0, "Stock quantity cannot be negative.");

const sortOrderSchema = z
  .string()
  .trim()
  .optional()
  .default("0")
  .refine((value) => Number.isInteger(Number(value || "0")), "Enter a whole number.")
  .transform((value) => Number(value || "0"));

function splitList(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseSpecifications(value: string) {
  return Object.fromEntries(
    value
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const separatorIndex = line.indexOf(":");

        if (separatorIndex === -1) {
          return [line, ""] as const;
        }

        return [
          line.slice(0, separatorIndex).trim(),
          line.slice(separatorIndex + 1).trim(),
        ] as const;
      })
      .filter(([key]) => key.length > 0),
  );
}

export const productFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Product name is required.")
      .max(160, "Product name must be 160 characters or fewer."),
    slug: slugSchema,
    sku: z
      .string()
      .trim()
      .min(1, "SKU is required.")
      .max(80, "SKU must be 80 characters or fewer."),
    brandId: z.string().trim().min(1, "Brand is required."),
    categoryId: z.string().trim().min(1, "Category is required."),
    shortDescription: z
      .string()
      .trim()
      .min(1, "Short description is required.")
      .max(240, "Short description must be 240 characters or fewer."),
    fullDescription: z
      .string()
      .trim()
      .min(1, "Full description is required.")
      .max(3000, "Full description must be 3000 characters or fewer."),
    price: moneySchema,
    salePrice: optionalMoneySchema,
    stockQuantity: nonNegativeIntegerSchema,
    featuredImage: imageUrlSchema,
    productImages: z.string().trim().optional().default("").transform(splitList),
    tags: z.string().trim().optional().default("").transform(splitList),
    specifications: z
      .string()
      .trim()
      .optional()
      .default("")
      .transform(parseSpecifications),
    warrantyInfo: z
      .string()
      .trim()
      .min(1, "Warranty info is required.")
      .max(1000, "Warranty info must be 1000 characters or fewer."),
    status: z.enum(productStatuses),
    isFeatured: z.boolean().default(false),
    isNewArrival: z.boolean().default(false),
    isBestSeller: z.boolean().default(false),
  })
  .refine((data) => data.salePrice === null || data.salePrice < data.price, {
    message: "Sale price must be less than price.",
    path: ["salePrice"],
  });

export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Category name is required.")
    .max(120, "Category name must be 120 characters or fewer."),
  slug: slugSchema,
  description: z
    .string()
    .trim()
    .min(1, "Description is required.")
    .max(1000, "Description must be 1000 characters or fewer."),
  image: imageUrlSchema,
  icon: z.string().trim().min(1, "Icon placeholder is required.").max(80),
  isFeatured: z.boolean().default(false),
  sortOrder: sortOrderSchema,
  status: z.enum(catalogStatuses),
});

export const brandFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Brand name is required.")
    .max(120, "Brand name must be 120 characters or fewer."),
  slug: slugSchema,
  description: z
    .string()
    .trim()
    .min(1, "Description is required.")
    .max(1000, "Description must be 1000 characters or fewer."),
  logo: imageUrlSchema,
  status: z.enum(catalogStatuses),
});

export const preferenceFormSchema = z.object({
  siteName: z.string().trim().min(1, "Site name is required.").max(100),
  storeTagline: z.string().trim().min(1, "Store tagline is required.").max(180),
  logoUrl: optionalUrlSchema,
  announcementText: optionalText,
  announcementEnabled: z.boolean().default(false),
  heroTitle: z.string().trim().min(1, "Hero title is required.").max(120),
  heroSubtitle: z.string().trim().min(1, "Hero subtitle is required.").max(500),
  heroImageUrl: optionalUrlSchema,
  heroCtaText: z.string().trim().min(1, "Hero CTA text is required.").max(80),
  heroCtaLink: optionalUrlSchema.refine((value) => !!value, {
    message: "Hero CTA link is required.",
  }),
  homepageBannerText: optionalText,
  featuredProductsTitle: z
    .string()
    .trim()
    .min(1, "Featured products title is required.")
    .max(120),
  featuredProductsDescription: z
    .string()
    .trim()
    .min(1, "Featured products description is required.")
    .max(500),
  newArrivalsTitle: z
    .string()
    .trim()
    .min(1, "New arrivals title is required.")
    .max(120),
  newArrivalsDescription: z
    .string()
    .trim()
    .min(1, "New arrivals description is required.")
    .max(500),
  bestSellersTitle: z
    .string()
    .trim()
    .min(1, "Best sellers title is required.")
    .max(120),
  bestSellersDescription: z
    .string()
    .trim()
    .min(1, "Best sellers description is required.")
    .max(500),
  footerDescription: z
    .string()
    .trim()
    .min(1, "Footer description is required.")
    .max(500),
  featuredCategorySlugs: z.string().trim().optional().default("").transform(splitList),
  contactEmail: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine((value) => !value || z.string().email().safeParse(value).success, {
      message: "Enter a valid contact email.",
    }),
  contactPhone: optionalText,
  whatsappNumber: optionalText,
  storeAddress: optionalText,
  themeAccentColor: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, "Use a hex color like #4f9ed8."),
});

export const userAdminUpdateSchema = z.object({
  userId: z.string().trim().min(1, "User is required."),
  role: z.enum(userRoles),
  status: z.enum(userStatuses),
});

export function formDataToObject(formData: FormData) {
  return Object.fromEntries(
    Array.from(formData.entries()).map(([key, value]) => [
      key,
      typeof value === "string" ? value : "",
    ]),
  ) as Record<string, string>;
}

export function formDataWithBooleans(formData: FormData) {
  const values = formDataToObject(formData);

  return {
    ...values,
    isFeatured: formData.get("isFeatured") === "on",
    isNewArrival: formData.get("isNewArrival") === "on",
    isBestSeller: formData.get("isBestSeller") === "on",
    announcementEnabled: formData.get("announcementEnabled") === "on",
  };
}

export function toFieldErrors(error: z.ZodError) {
  return error.flatten().fieldErrors as Record<string, string[] | undefined>;
}

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatCentsInput(value?: number | null) {
  if (typeof value !== "number") {
    return "";
  }

  return (value / 100).toFixed(2);
}

export function formatSpecificationsInput(value: string) {
  try {
    const parsed = JSON.parse(value);

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return "";
    }

    return Object.entries(parsed)
      .map(([key, specValue]) => `${key}: ${String(specValue)}`)
      .join("\n");
  } catch {
    return "";
  }
}

export function formatJsonListInput(value: string) {
  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return "";
    }

    return parsed.filter((item) => typeof item === "string").join("\n");
  } catch {
    return "";
  }
}
