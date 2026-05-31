import { Heart, Search, ShoppingCart, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { MobileHeaderMenu } from "@/components/MobileHeaderMenu";
import { getSitePreferences } from "@/lib/admin/data";
import { getCurrentUser } from "@/lib/auth/session";
import { getShoppingCounts } from "@/lib/shopping";

const navItems = [
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Brands", href: "/brands" },
  { label: "Deals", href: "/products?sort=featured" },
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

export async function Header() {
  const [user, preferences] = await Promise.all([
    getCurrentUser(),
    getSitePreferences(),
  ]);
  const counts = await getShoppingCounts(user?.id);
  const siteInitials = getInitials(preferences.siteName);

  return (
    <header className="sticky top-0 z-50 border-b border-[#cfe0f2] bg-[#f7fbff]/95 text-[#334155] shadow-[0_14px_40px_rgba(47,95,143,0.12)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label={`${preferences.siteName} home`}
        >
          <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-lg border border-[#8dbde8]/45 bg-[#e5f2ff] text-sm font-black text-[#245a8d]">
            {preferences.logoUrl ? (
              <Image
                src={preferences.logoUrl}
                alt=""
                fill
                unoptimized
                sizes="40px"
                className="object-cover"
              />
            ) : (
              siteInitials
            )}
          </span>
          <span>
            <span className="block text-lg font-black leading-none tracking-wide">
              {preferences.siteName}
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#61748c]">
              {preferences.storeTagline}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 pl-4 text-sm font-semibold text-[#37475f] lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="transition-colors hover:text-[#2f7fb3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#76b7e5]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form
          action="/products"
          className="ml-auto hidden flex-1 justify-center md:flex"
          role="search"
        >
          <label className="relative w-full max-w-xl">
            <span className="sr-only">Search products</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#334155]" />
            <input
              name="search"
              type="search"
              placeholder="Search phones, laptops, cameras, parts..."
              className="h-11 w-full rounded-lg border border-[#cfe0f2] bg-white/75 pl-11 pr-4 text-sm text-[#1f2a44] outline-none transition placeholder:text-[#758398] hover:bg-white focus:border-[#65a9d8] focus:bg-white"
            />
          </label>
        </form>

        <div className="flex items-center gap-2">
          <Link
            href="/wishlist"
            className="relative hidden h-10 w-10 place-items-center rounded-lg border border-[#cfe0f2] bg-white/70 text-[#334155] transition hover:border-[#76b7e5] hover:bg-[#e8f4ff] md:grid"
            aria-label="Wishlist"
          >
            <Heart className="h-4 w-4" />
            {counts.wishlistCount > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#c7e8ff] px-1 text-[11px] font-black text-[#1f2a44]">
                {counts.wishlistCount}
              </span>
            ) : null}
          </Link>
          <Link
            href="/cart"
            className="relative grid h-10 w-10 place-items-center rounded-lg border border-[#cfe0f2] bg-white/70 text-[#334155] transition hover:border-[#76b7e5] hover:bg-[#e8f4ff]"
            aria-label="Cart"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#c7e8ff] px-1 text-[11px] font-black text-[#1f2a44]">
              {counts.cartCount}
            </span>
          </Link>

          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              {user.role === "ADMIN" ? (
                <Link
                  href="/admin"
                  className="hidden h-10 items-center justify-center rounded-lg border border-[#9cc8e8] bg-[#e5f2ff] px-3 text-sm font-black text-[#245a8d] transition hover:bg-[#d8ecff] xl:inline-flex"
                >
                  Admin
                </Link>
              ) : null}
              <Link
                href="/account"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#cfe0f2] bg-white/70 px-3 text-sm font-black text-[#334155] transition hover:border-[#76b7e5] hover:bg-[#e8f4ff]"
              >
                <UserRound className="h-4 w-4" />
                <span className="hidden xl:inline">{user.name}</span>
                <span className="xl:hidden">Account</span>
              </Link>
              <LogoutButton compact />
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/login"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-[#cfe0f2] bg-white/70 px-3 text-sm font-black text-[#334155] transition hover:border-[#76b7e5] hover:bg-[#e8f4ff]"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-[#4f9ed8] px-3 text-sm font-black text-white transition hover:bg-[#2f7fb3]"
              >
                Create Account
              </Link>
            </div>
          )}

          <MobileHeaderMenu
            counts={counts}
            navItems={navItems}
            user={
              user
                ? {
                    email: user.email,
                    name: user.name,
                    role: user.role,
                  }
                : null
            }
          />
        </div>
      </div>
      <div className="border-t border-[#cfe0f2] px-4 py-3 sm:hidden">
        {user ? (
          <div className="mx-auto flex max-w-7xl items-center gap-2">
            <Link
              href="/account"
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-[#cfe0f2] bg-white/70 px-3 text-sm font-black text-[#334155]"
            >
              <UserRound className="h-4 w-4" />
              Account
            </Link>
            {user.role === "ADMIN" ? (
              <Link
                href="/admin"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-[#9cc8e8] bg-[#e5f2ff] px-3 text-sm font-black text-[#245a8d]"
              >
                Admin
              </Link>
            ) : null}
            <LogoutButton compact />
          </div>
        ) : (
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2">
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-[#cfe0f2] bg-white/70 px-3 text-sm font-black text-[#334155]"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-[#4f9ed8] px-3 text-sm font-black text-white"
            >
              Create Account
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
