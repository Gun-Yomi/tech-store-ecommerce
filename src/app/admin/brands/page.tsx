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
      <section className="rounded-lg border border-[#d7dfbd] bg-white p-6 shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#5f7d33]">
          Brands
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-normal text-[#253326]">
          Brand management
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#60705d]">
          Add, edit, deactivate, and safely delete brand records. Inactive
          brands hide their products from public catalog results.
        </p>
      </section>

      <AdminActionMessage success={params.success} error={params.error} />

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-black tracking-normal text-[#253326]">
            {editingBrand ? "Edit brand" : "Add brand"}
          </h2>
          {editingBrand ? (
            <Link
              href="/admin/brands"
              className="text-sm font-black text-[#5f7d33] hover:text-[#435d2d]"
            >
              Cancel edit
            </Link>
          ) : null}
        </div>
        <BrandForm brand={editingBrand} />
      </section>

      <section className="overflow-hidden rounded-lg border border-[#d7dfbd] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#edf1df] text-left">
            <thead className="bg-[#f7f9ef] text-xs font-black uppercase tracking-[0.14em] text-[#60705d]">
              <tr>
                <th className="px-4 py-3">Brand</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Products</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf1df]">
              {brands.map((brand) => (
                <tr key={brand.id} className="align-top">
                  <td className="px-4 py-4">
                    <div className="flex min-w-[260px] gap-3">
                      <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-[#edf1df]">
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
                        <p className="font-black text-[#253326]">{brand.name}</p>
                        <p className="mt-1 line-clamp-2 text-xs font-bold text-[#60705d]">
                          {brand.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm font-bold text-[#60705d]">
                    {brand.slug}
                  </td>
                  <td className="px-4 py-4 text-sm font-black text-[#253326]">
                    {brand._count.products}
                  </td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-[#eef4df] px-3 py-1 text-xs font-black text-[#3f5b25]">
                      {brand.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/brands?edit=${brand.id}`}
                        className="grid h-9 w-9 place-items-center rounded-lg border border-[#d7dfbd] bg-white text-[#344554] transition hover:border-[#6e8f3d] hover:bg-[#eef4df]"
                        aria-label={`Edit ${brand.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <form action={archiveBrandAction}>
                        <input type="hidden" name="brandId" value={brand.id} />
                        <AdminConfirmButton
                          message={`Set ${brand.name} inactive? Active products from this brand will disappear from public catalog results.`}
                          pendingLabel="..."
                          className="grid h-9 w-9 place-items-center rounded-lg border border-[#d7dfbd] bg-white text-[#344554] transition hover:border-[#6e8f3d] hover:bg-[#eef4df]"
                        >
                          <Archive className="h-4 w-4" />
                        </AdminConfirmButton>
                      </form>
                      <form action={deleteBrandAction}>
                        <input type="hidden" name="brandId" value={brand.id} />
                        <AdminConfirmButton
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
      </section>
    </div>
  );
}
