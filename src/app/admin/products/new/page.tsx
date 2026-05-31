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
      <div className="flex flex-col justify-between gap-4 rounded-lg border border-[#d7dfbd] bg-white p-6 shadow-sm lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#5f7d33]">
            Products
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-normal text-[#253326]">
            Add product
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#60705d]">
            Create a catalog product with pricing, images, tags,
            specifications, warranty details, and storefront visibility.
          </p>
        </div>
        <Link
          href="/admin/products"
          className="inline-flex h-11 items-center justify-center rounded-lg border border-[#b7c891] bg-white px-5 text-sm font-black text-[#344554] transition hover:border-[#6e8f3d] hover:bg-[#eef4df]"
        >
          Back to products
        </Link>
      </div>
      <ProductForm categories={categories} brands={brands} />
    </div>
  );
}
