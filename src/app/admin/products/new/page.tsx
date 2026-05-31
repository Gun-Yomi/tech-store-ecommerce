import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";
import {
  getAdminBrandOptions,
  getAdminCategoryOptions,
} from "@/lib/admin/data";

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([
    getAdminCategoryOptions(),
    getAdminBrandOptions(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-lg border border-[#cfe0f2] bg-white p-6 shadow-sm lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f7fb3]">
            Products
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-normal text-[#1f2a44]">
            Add product
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5f6f85]">
            Create a catalog product with pricing, images, tags,
            specifications, warranty details, and storefront visibility.
          </p>
        </div>
        <Link
          href="/admin/products"
          className="inline-flex h-11 items-center justify-center rounded-lg border border-[#9fc5e8] bg-white px-5 text-sm font-black text-[#334155] transition hover:border-[#4f9ed8] hover:bg-[#eaf6ff]"
        >
          Back to products
        </Link>
      </div>
      <ProductForm categories={categories} brands={brands} />
    </div>
  );
}
