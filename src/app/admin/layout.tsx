import Link from "next/link";
import {
  Boxes,
  Building2,
  ClipboardList,
  FolderTree,
  Gauge,
  House,
  Settings,
  UsersRound,
} from "lucide-react";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { getSitePreferences } from "@/lib/admin/data";
import { requireAdmin } from "@/lib/auth/guards";

const adminNav = [
  { label: "Dashboard", href: "/admin", icon: Gauge },
  { label: "Orders", href: "/admin/orders", icon: ClipboardList },
  { label: "Products", href: "/admin/products", icon: Boxes },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Brands", href: "/admin/brands", icon: Building2 },
  { label: "Preferences", href: "/admin/preferences", icon: Settings },
  { label: "Users", href: "/admin/users", icon: UsersRound },
];

function getInitials(value: string) {
  const words = value.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "CH";
  }

  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, preferences] = await Promise.all([
    requireAdmin(),
    getSitePreferences(),
  ]);

  return (
    <div className="min-h-screen bg-[#f5f7ee] text-[#253326]">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-[#d7dfbd] bg-[#253326] text-white lg:border-b-0 lg:border-r lg:border-[#344554]">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:block lg:px-6 lg:py-7">
            <Link href="/admin" className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg border border-white/15 bg-white/10">
                {getInitials(preferences.siteName)}
              </span>
              <span>
                <span className="block text-lg font-black leading-none">
                  {preferences.siteName}
                </span>
                <span className="text-xs font-black uppercase tracking-[0.18em] text-[#d8e978]">
                  Admin
                </span>
              </span>
            </Link>
            <Link
              href="/"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 text-sm font-black text-white transition hover:bg-white/15 lg:mt-7"
            >
              <House className="h-4 w-4" />
              Storefront
            </Link>
          </div>

          <nav className="flex gap-2 overflow-x-auto px-4 pb-4 sm:px-6 lg:block lg:space-y-2 lg:overflow-visible lg:px-6 lg:pb-0">
            {adminNav.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex h-11 shrink-0 items-center gap-3 rounded-lg px-3 text-sm font-black text-[#edf4de] transition hover:bg-white/10 hover:text-white lg:w-full"
                >
                  <Icon className="h-4 w-4 text-[#d8e978]" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden px-6 pb-7 pt-8 lg:block">
            <div className="rounded-lg border border-white/15 bg-white/10 p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d8e978]">
                Signed in
              </p>
              <p className="mt-2 text-sm font-black text-white">{user.name}</p>
              <p className="mt-1 text-xs font-semibold text-[#cfe6b6]">
                {user.email}
              </p>
              <div className="mt-4">
                <LogoutButton compact />
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="border-b border-[#d7dfbd] bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#5f7d33]">
                  Admin panel
                </p>
                <p className="mt-1 text-sm font-semibold text-[#60705d]">
                  Product, catalog, preference, and user controls
                </p>
              </div>
              <div className="hidden items-center gap-3 text-right sm:block">
                <p className="text-sm font-black text-[#253326]">{user.name}</p>
                <p className="text-xs font-bold text-[#60705d]">{user.role}</p>
              </div>
            </div>
          </header>
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
