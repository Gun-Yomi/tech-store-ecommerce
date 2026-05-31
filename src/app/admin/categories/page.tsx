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
      <section className="rounded-lg border border-[#cfe0f2] bg-white p-6 shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f7fb3]">
          Categories
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-normal text-[#1f2a44]">
          Category management
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5f6f85]">
          Add, edit, sort, feature, deactivate, and safely delete catalog
          categories. Inactive categories are hidden from the storefront.
        </p>
      </section>

      <AdminActionMessage success={params.success} error={params.error} />

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-black tracking-normal text-[#1f2a44]">
            {editingCategory ? "Edit category" : "Add category"}
          </h2>
          {editingCategory ? (
            <Link
              href="/admin/categories"
              className="text-sm font-black text-[#2f7fb3] hover:text-[#2f5f8f]"
            >
              Cancel edit
            </Link>
          ) : null}
        </div>
        <CategoryForm category={editingCategory} />
      </section>

      <section className="overflow-hidden rounded-lg border border-[#cfe0f2] bg-white shadow-sm">
        {categories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#edf6ff] text-left">
              <thead className="bg-[#f7fbff] text-xs font-black uppercase tracking-[0.14em] text-[#5f6f85]">
                <tr>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Products</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Featured</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf6ff]">
                {categories.map((category) => (
                  <tr key={category.id} className="align-top">
                    <td className="px-4 py-4">
                      <div className="flex min-w-[260px] gap-3">
                        <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-[#edf6ff]">
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
                          <p className="font-black text-[#1f2a44]">
                            {category.name}
                          </p>
                          <p className="mt-1 text-xs font-bold text-[#5f6f85]">
                            Icon: {category.icon}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-[#5f6f85]">
                      {category.slug}
                    </td>
                    <td className="px-4 py-4 text-sm font-black text-[#1f2a44]">
                      {category._count.products}
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-[#eaf6ff] px-3 py-1 text-xs font-black text-[#245a8d]">
                        {category.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm font-black text-[#1f2a44]">
                      {category.isFeatured ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/categories?edit=${category.id}`}
                          className="grid h-9 w-9 place-items-center rounded-lg border border-[#cfe0f2] bg-white text-[#334155] transition hover:border-[#4f9ed8] hover:bg-[#eaf6ff]"
                          aria-label={`Edit ${category.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <form action={archiveCategoryAction}>
                          <input type="hidden" name="categoryId" value={category.id} />
                          <AdminConfirmButton
                            ariaLabel={`Set ${category.name} inactive`}
                            message={`Set ${category.name} inactive? Active products in this category will disappear from public catalog filters.`}
                            pendingLabel="..."
                            className="grid h-9 w-9 place-items-center rounded-lg border border-[#cfe0f2] bg-white text-[#334155] transition hover:border-[#4f9ed8] hover:bg-[#eaf6ff]"
                          >
                            <Archive className="h-4 w-4" />
                          </AdminConfirmButton>
                        </form>
                        <form action={deleteCategoryAction}>
                          <input type="hidden" name="categoryId" value={category.id} />
                          <AdminConfirmButton
                            ariaLabel={`Permanently delete ${category.name}`}
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
        ) : (
          <div className="p-10 text-center">
            <h2 className="text-2xl font-black tracking-normal text-[#1f2a44]">
              No categories yet
            </h2>
            <p className="mt-3 text-sm font-semibold text-[#5f6f85]">
              Add a category above before creating storefront products.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
