import Image from "next/image";
import Link from "next/link";
import { Archive, Pencil, Trash2 } from "lucide-react";
import { AdminActionMessage } from "@/components/admin/AdminActionMessage";
import { AdminConfirmButton } from "@/components/admin/AdminConfirmButton";
import { CategoryForm } from "@/components/admin/CategoryForm";
import {
  archiveCategoryAction,
  deleteCategoryAction,
} from "@/lib/admin/actions";
import { getAdminCategories } from "@/lib/admin/data";

type CategoriesAdminPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function stringParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminCategoriesPage({
  searchParams,
}: CategoriesAdminPageProps) {
  const params = await searchParams;
  const categories = await getAdminCategories();
  const editingId = stringParam(params.edit);
  const editingCategory =
    categories.find((category) => category.id === editingId) ?? null;

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-[#d7dfbd] bg-white p-6 shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#5f7d33]">
          Categories
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-normal text-[#253326]">
          Category management
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#60705d]">
          Add, edit, sort, feature, deactivate, and safely delete catalog
          categories. Inactive categories are hidden from the storefront.
        </p>
      </section>

      <AdminActionMessage success={params.success} error={params.error} />

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-black tracking-normal text-[#253326]">
            {editingCategory ? "Edit category" : "Add category"}
          </h2>
          {editingCategory ? (
            <Link
              href="/admin/categories"
              className="text-sm font-black text-[#5f7d33] hover:text-[#435d2d]"
            >
              Cancel edit
            </Link>
          ) : null}
        </div>
        <CategoryForm category={editingCategory} />
      </section>

      <section className="overflow-hidden rounded-lg border border-[#d7dfbd] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#edf1df] text-left">
            <thead className="bg-[#f7f9ef] text-xs font-black uppercase tracking-[0.14em] text-[#60705d]">
              <tr>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Products</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf1df]">
              {categories.map((category) => (
                <tr key={category.id} className="align-top">
                  <td className="px-4 py-4">
                    <div className="flex min-w-[260px] gap-3">
                      <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-[#edf1df]">
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          unoptimized
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-black text-[#253326]">
                          {category.name}
                        </p>
                        <p className="mt-1 text-xs font-bold text-[#60705d]">
                          Icon: {category.icon}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm font-bold text-[#60705d]">
                    {category.slug}
                  </td>
                  <td className="px-4 py-4 text-sm font-black text-[#253326]">
                    {category._count.products}
                  </td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-[#eef4df] px-3 py-1 text-xs font-black text-[#3f5b25]">
                      {category.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm font-black text-[#253326]">
                    {category.isFeatured ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/categories?edit=${category.id}`}
                        className="grid h-9 w-9 place-items-center rounded-lg border border-[#d7dfbd] bg-white text-[#344554] transition hover:border-[#6e8f3d] hover:bg-[#eef4df]"
                        aria-label={`Edit ${category.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <form action={archiveCategoryAction}>
                        <input type="hidden" name="categoryId" value={category.id} />
                        <AdminConfirmButton
                          message={`Set ${category.name} inactive? Active products in this category will disappear from public catalog filters.`}
                          pendingLabel="..."
                          className="grid h-9 w-9 place-items-center rounded-lg border border-[#d7dfbd] bg-white text-[#344554] transition hover:border-[#6e8f3d] hover:bg-[#eef4df]"
                        >
                          <Archive className="h-4 w-4" />
                        </AdminConfirmButton>
                      </form>
                      <form action={deleteCategoryAction}>
                        <input type="hidden" name="categoryId" value={category.id} />
                        <AdminConfirmButton
                          message={`Permanently delete ${category.name}? This is blocked when active products exist.`}
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
