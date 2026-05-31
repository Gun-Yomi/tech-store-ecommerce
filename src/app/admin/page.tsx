import Link from "next/link";
import {
  Boxes,
  Building2,
  FolderTree,
  PackageCheck,
  PackageMinus,
  PackageX,
  Settings,
  ShoppingCart,
  UsersRound,
} from "lucide-react";
import { getAdminDashboardStats } from "@/lib/admin/data";

const quickLinks = [
  { label: "Manage Products", href: "/admin/products" },
  { label: "Add Product", href: "/admin/products/new" },
  { label: "Manage Categories", href: "/admin/categories" },
  { label: "Manage Brands", href: "/admin/brands" },
  { label: "Site Preferences", href: "/admin/preferences" },
  { label: "Users", href: "/admin/users" },
];

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();
  const cards = [
    {
      label: "Total products",
      value: stats.totalProducts,
      icon: Boxes,
    },
    {
      label: "Active products",
      value: stats.activeProducts,
      icon: PackageCheck,
    },
    {
      label: "Draft products",
      value: stats.draftProducts,
      icon: PackageMinus,
    },
    {
      label: "Archived products",
      value: stats.archivedProducts,
      icon: PackageX,
    },
    {
      label: "Categories",
      value: stats.totalCategories,
      icon: FolderTree,
    },
    {
      label: "Brands",
      value: stats.totalBrands,
      icon: Building2,
    },
    {
      label: "Users",
      value: stats.totalUsers,
      icon: UsersRound,
    },
    {
      label: "Cart placeholders",
      value: stats.cartItems + stats.wishlistItems + stats.savedItems,
      icon: ShoppingCart,
    },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-[#d7dfbd] bg-white p-6 shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#5f7d33]">
          Dashboard
        </p>
        <div className="mt-3 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-normal text-[#253326]">
              Admin command center
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#60705d]">
              Manage catalog content, user access, homepage messaging, and Phase
              6 order placeholders from one secure area.
            </p>
          </div>
          <Link
            href="/admin/products/new"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-[#344554] px-5 text-sm font-black text-white transition hover:bg-[#5f7d33]"
          >
            Add product
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.label}
              className="rounded-lg border border-[#d7dfbd] bg-white p-5 shadow-sm"
            >
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#eef4df] text-[#344554]">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-5 text-3xl font-black text-[#253326]">
                {card.value}
              </p>
              <p className="mt-1 text-sm font-bold text-[#60705d]">
                {card.label}
              </p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-[#d7dfbd] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#eef4df] text-[#344554]">
              <Settings className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-black tracking-normal text-[#253326]">
                Quick links
              </h2>
              <p className="text-sm font-semibold text-[#60705d]">
                Jump into the most common admin workflows.
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg border border-[#d7dfbd] bg-[#f7f9ef] px-4 py-3 text-sm font-black text-[#344554] transition hover:border-[#6e8f3d] hover:bg-[#eef4df]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <aside className="rounded-lg border border-[#d7dfbd] bg-white p-6 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#5f7d33]">
            Orders
          </p>
          <h2 className="mt-3 text-2xl font-black tracking-normal text-[#253326]">
            Phase 6 placeholder
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#60705d]">
            Checkout, payments, order creation, and admin order management are
            intentionally not built in Phase 5.
          </p>
        </aside>
      </section>
    </div>
  );
}
