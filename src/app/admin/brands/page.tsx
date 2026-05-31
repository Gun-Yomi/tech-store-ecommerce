import Image from "next/image";
import Link from "next/link";
import { Archive, Pencil, Trash2 } from "lucide-react";
import { AdminActionMessage } from "@/components/admin/AdminActionMessage";
import { AdminConfirmButton } from "@/components/admin/AdminConfirmButton";
import { BrandForm } from "@/components/admin/BrandForm";
import { archiveBrandAction, deleteBrandAction } from "@/lib/admin/actions";
import { getAdminBrands } from "@/lib/admin/data";

type BrandsAdminPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function stringParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminBrandsPage({
  searchParams,
}: BrandsAdminPageProps) {
  const params = await searchParams;
  const brands = await getAdminBrands();
  const editingId = stringParam(params.edit);
  const editingBrand = brands.find((brand) => brand.id === editingId) ?? null;

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-[#cfe0f2] bg-white p-6 shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f7fb3]">
          Brands
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-normal text-[#1f2a44]">
          Brand management
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5f6f85]">
          Add, edit, deactivate, and safely delete brand records. Inactive
          brands hide their products from public catalog results.
        </p>
      </section>

      <AdminActionMessage success={params.success} error={params.error} />

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-black tracking-normal text-[#1f2a44]">
            {editingBrand ? "Edit brand" : "Add brand"}
          </h2>
          {editingBrand ? (
            <Link
              href="/admin/brands"
              className="text-sm font-black text-[#2f7fb3] hover:text-[#2f5f8f]"
            >
              Cancel edit
            </Link>
          ) : null}
        </div>
        <BrandForm brand={editingBrand} />
      </section>

      <section className="overflow-hidden rounded-lg border border-[#cfe0f2] bg-white shadow-sm">
        {brands.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#edf6ff] text-left">
              <thead className="bg-[#f7fbff] text-xs font-black uppercase tracking-[0.14em] text-[#5f6f85]">
                <tr>
                  <th className="px-4 py-3">Brand</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Products</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf6ff]">
                {brands.map((brand) => (
                  <tr key={brand.id} className="align-top">
                    <td className="px-4 py-4">
                      <div className="flex min-w-[260px] gap-3">
                        <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-[#edf6ff]">
                          <Image
                            src={brand.logo}
                            alt={brand.name}
                            fill
                            unoptimized
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-black text-[#1f2a44]">{brand.name}</p>
                          <p className="mt-1 line-clamp-2 text-xs font-bold text-[#5f6f85]">
                            {brand.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-[#5f6f85]">
                      {brand.slug}
                    </td>
                    <td className="px-4 py-4 text-sm font-black text-[#1f2a44]">
                      {brand._count.products}
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-[#eaf6ff] px-3 py-1 text-xs font-black text-[#245a8d]">
                        {brand.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/brands?edit=${brand.id}`}
                          className="grid h-9 w-9 place-items-center rounded-lg border border-[#cfe0f2] bg-white text-[#334155] transition hover:border-[#4f9ed8] hover:bg-[#eaf6ff]"
                          aria-label={`Edit ${brand.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <form action={archiveBrandAction}>
                          <input type="hidden" name="brandId" value={brand.id} />
                          <AdminConfirmButton
                            ariaLabel={`Set ${brand.name} inactive`}
                            message={`Set ${brand.name} inactive? Active products from this brand will disappear from public catalog results.`}
                            pendingLabel="..."
                            className="grid h-9 w-9 place-items-center rounded-lg border border-[#cfe0f2] bg-white text-[#334155] transition hover:border-[#4f9ed8] hover:bg-[#eaf6ff]"
                          >
                            <Archive className="h-4 w-4" />
                          </AdminConfirmButton>
                        </form>
                        <form action={deleteBrandAction}>
                          <input type="hidden" name="brandId" value={brand.id} />
                          <AdminConfirmButton
                            ariaLabel={`Permanently delete ${brand.name}`}
                            message={`Permanently delete ${brand.name}? This is blocked when active products exist.`}
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
              No brands yet
            </h2>
            <p className="mt-3 text-sm font-semibold text-[#5f6f85]">
              Add a brand above before creating storefront products.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
