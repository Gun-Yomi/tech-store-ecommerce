export type ProductStatus = "active" | "draft" | "archived";

export type ProductCategory =
  | "Phones"
  | "Laptops"
  | "Desktops"
  | "Cameras"
  | "Accessories"
  | "Gaming"
  | "Smart Gadgets"
  | "Networking"
  | "Components"
  | "Repairs / Parts";

export type Category = {
  name: ProductCategory;
  slug: string;
  description: string;
  image: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  category: ProductCategory;
  shortDescription: string;
  fullDescription: string;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  featuredImage: string;
  tags: string[];
  specifications: Record<string, string>;
  warrantyInfo: string;
  status: ProductStatus;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
};
