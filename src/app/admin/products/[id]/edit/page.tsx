import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import {
  getAdminBrandOptions,
  getAdminCategoryOptions,
  getAdminProductById,
} from "@/lib/admin/data";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function EditProductPage({
  params,
  searchParams,
}: EditProductPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const [product, categories, brands] = await Promise.all([
    getAdminProductById(id),
    getAdminCategoryOptions(),
    getAdminBrandOptions(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-lg border border-[#d7dfbd] bg-white p-6 shadow-sm lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#5f7d33]">
            Products
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-normal text-[#253326]">
            Edit product
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#60705d]">
            Update catalog details for {product.name}. Use archive for products
            that should disappear from the storefront without breaking existing
            shopping references.
          </p>
        </div>
        <Link
          href="/admin/products"
          className="inline-flex h-11 items-center justify-center rounded-lg border border-[#b7c891] bg-white px-5 text-sm font-black text-[#344554] transition hover:border-[#6e8f3d] hover:bg-[#eef4df]"
        >
          Back to products
        </Link>
      </div>
      <ProductForm
        product={product}
        categories={categories}
        brands={brands}
        successMessage={query.success}
      />
    </div>
  );
}
