import Image from "next/image";
import Link from "next/link";
import { Archive, Pencil, Plus, Trash2 } from "lucide-react";
import { AdminActionMessage } from "@/components/admin/AdminActionMessage";
import { AdminConfirmButton } from "@/components/admin/AdminConfirmButton";
import {
  archiveProductAction,
  deleteProductAction,
} from "@/lib/admin/actions";
import {
  getAdminCategoryOptions,
  getAdminProducts,
  type AdminProductSort,
} from "@/lib/admin/data";
import { formatCurrency } from "@/lib/format";

type ProductsAdminPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function stringParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function statusClass(status: string) {
  if (status === "ACTIVE") {
    return "bg-[#eaf6ff] text-[#245a8d]";
  }

  if (status === "DRAFT") {
    return "bg-[#f7f1d8] text-[#806010]";
  }

  return "bg-[#f1f1ef] text-[#5f6663]";
}

export default async function AdminProductsPage({
  searchParams,
}: ProductsAdminPageProps) {
  const params = await searchParams;
  const filters = {
    search: stringParam(params.search) ?? "",
    status: stringParam(params.status) ?? "ALL",
    categoryId: stringParam(params.categoryId) ?? "ALL",
    sort: (stringParam(params.sort) ?? "newest") as AdminProductSort,
  };
  const [products, categories] = await Promise.all([
    getAdminProducts(filters),
    getAdminCategoryOptions(),
  ]);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-[#cfe0f2] bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f7fb3]">
              Products
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-normal text-[#1f2a44]">
              Product management
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5f6f85]">
              Search, filter, publish, archive, and safely delete products.
              Archived and draft products stay hidden from the public storefront.
            </p>
          </div>
          <Link
            href="/admin/products/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#334155] px-5 text-sm font-black text-white transition hover:bg-[#2f7fb3]"
          >
            <Plus className="h-4 w-4" />
            Add product
          </Link>
        </div>
      </section>

      <AdminActionMessage success={params.success} error={params.error} />

      <section className="rounded-lg border border-[#cfe0f2] bg-white p-4 shadow-sm">
        <form className="grid gap-3 lg:grid-cols-[1fr_180px_220px_180px_auto]">
          <input
            name="search"
            type="search"
            aria-label="Search products"
            defaultValue={filters.search}
            placeholder="Search name, SKU, brand, category"
            className="h-11 rounded-lg border border-[#cfe0f2] bg-white px-3 text-sm font-semibold text-[#1f2a44] outline-none focus:border-[#4f9ed8]"
          />
          <select
            name="status"
            aria-label="Product status"
            defaultValue={filters.status}
            className="h-11 rounded-lg border border-[#cfe0f2] bg-white px-3 text-sm font-semibold text-[#1f2a44] outline-none focus:border-[#4f9ed8]"
          >
            <option value="ALL">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          <select
            name="categoryId"
            aria-label="Product category"
            defaultValue={filters.categoryId}
            className="h-11 rounded-lg border border-[#cfe0f2] bg-white px-3 text-sm font-semibold text-[#1f2a44] outline-none focus:border-[#4f9ed8]"
          >
            <option value="ALL">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            name="sort"
            aria-label="Product sort"
            defaultValue={filters.sort}
            className="h-11 rounded-lg border border-[#cfe0f2] bg-white px-3 text-sm font-semibold text-[#1f2a44] outline-none focus:border-[#4f9ed8]"
          >
            <option value="newest">Newest</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="stock">Stock</option>
          </select>
          <button
            type="submit"
            className="h-11 rounded-lg bg-[#334155] px-5 text-sm font-black text-white transition hover:bg-[#2f7fb3]"
          >
            Apply
          </button>
        </form>
      </section>

      <section className="overflow-hidden rounded-lg border border-[#cfe0f2] bg-white shadow-sm">
        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#edf6ff] text-left">
              <thead className="bg-[#f7fbff] text-xs font-black uppercase tracking-[0.14em] text-[#5f6f85]">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">References</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf6ff]">
                {products.map((product) => (
                  <tr key={product.id} className="align-top">
                    <td className="px-4 py-4">
                      <div className="flex min-w-[320px] gap-3">
                        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-[#edf6ff]">
                          <Image
                            src={product.featuredImage}
                            alt={product.name}
                            fill
                            unoptimized
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-black text-[#1f2a44]">
                            {product.name}
                          </p>
                          <p className="mt-1 text-xs font-bold text-[#5f6f85]">
                            SKU {product.sku}
                          </p>
                          <p className="mt-1 text-xs font-bold text-[#5f6f85]">
                            {product.brand.name} / {product.category.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-black text-[#1f2a44]">
                      <div>{formatCurrency(product.salePrice ?? product.price)}</div>
                      {product.salePrice ? (
                        <div className="text-xs font-bold text-[#8b96a8] line-through">
                          {formatCurrency(product.price)}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-4 py-4 text-sm font-black text-[#1f2a44]">
                      {product.stockQuantity}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${statusClass(
                          product.status,
                        )}`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs font-bold leading-5 text-[#5f6f85]">
                      Cart {product._count.cartItems}
                      <br />
                      Wishlist {product._count.wishlistItems}
                      <br />
                      Saved {product._count.savedItems}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="grid h-9 w-9 place-items-center rounded-lg border border-[#cfe0f2] bg-white text-[#334155] transition hover:border-[#4f9ed8] hover:bg-[#eaf6ff]"
                          aria-label={`Edit ${product.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <form action={archiveProductAction}>
                          <input type="hidden" name="productId" value={product.id} />
                          <AdminConfirmButton
                            ariaLabel={`Archive ${product.name}`}
                            message={`Archive ${product.name}? It will disappear from the storefront.`}
                            pendingLabel="..."
                            className="grid h-9 w-9 place-items-center rounded-lg border border-[#cfe0f2] bg-white text-[#334155] transition hover:border-[#4f9ed8] hover:bg-[#eaf6ff]"
                          >
                            <Archive className="h-4 w-4" />
                          </AdminConfirmButton>
                        </form>
                        <form action={deleteProductAction}>
                          <input type="hidden" name="productId" value={product.id} />
                          <AdminConfirmButton
                            ariaLabel={`Permanently delete ${product.name}`}
                            message={`Permanently delete ${product.name}? This is blocked if shopping references exist.`}
                            pendingLabel="..."
                            className="grid h-9 w-9 place-items-center rounded-lg border border-[#e5b2a8] bg-white text-[#9f2f28] transition hover:bg-[#fff4f1]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </AdminConfirmButton>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center">
            <h2 className="text-2xl font-black tracking-normal text-[#1f2a44]">
              No products found
            </h2>
            <p className="mt-3 text-sm font-semibold text-[#5f6f85]">
              Adjust filters or add a new product to the catalog.
            </p>
            <Link
              href="/admin/products/new"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[#334155] px-5 text-sm font-black text-white transition hover:bg-[#2f7fb3]"
            >
              Add product
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
