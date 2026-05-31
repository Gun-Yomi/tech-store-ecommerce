import { Heart, Menu, Search, ShoppingCart, UserRound } from "lucide-react";
import Link from "next/link";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { getCurrentUser } from "@/lib/auth/session";

const navItems = [
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Brands", href: "/brands" },
  { label: "Deals", href: "/products?sort=featured" },
];

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 border-b border-[#d7dfbd] bg-[#f7f9ef]/95 text-[#344554] shadow-[0_14px_40px_rgba(67,93,45,0.12)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="CircuitHaus home">
          <span className="grid h-10 w-10 place-items-center rounded-lg border border-[#9ab46a]/45 bg-[#e8efd8] text-sm font-black text-[#3b5b2b]">
            CH
          </span>
          <span>
            <span className="block text-lg font-black leading-none tracking-wide">
              CircuitHaus
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#6f7f49]">
              Tech Market
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 pl-4 text-sm font-semibold text-[#3c4f44] lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="transition-colors hover:text-[#5f7d33] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8ea95c]"
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
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#344554]" />
            <input
              name="search"
              type="search"
              placeholder="Search phones, laptops, cameras, parts..."
              className="h-11 w-full rounded-lg border border-[#d7dfbd] bg-white/75 pl-11 pr-4 text-sm text-[#253326] outline-none transition placeholder:text-[#75806f] hover:bg-white focus:border-[#7f9a4b] focus:bg-white"
            />
          </label>
        </form>

        <div className="flex items-center gap-2">
          {/* TODO(Phase 4): Wire wishlist and cart buttons to persistent user state. */}
          <button
            type="button"
            className="hidden h-10 w-10 place-items-center rounded-lg border border-[#d7dfbd] bg-white/70 text-[#344554] transition hover:border-[#8ea95c] hover:bg-[#edf4de] md:grid"
            aria-label="Wishlist placeholder"
          >
            <Heart className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="relative grid h-10 w-10 place-items-center rounded-lg border border-[#d7dfbd] bg-white/70 text-[#344554] transition hover:border-[#8ea95c] hover:bg-[#edf4de]"
            aria-label="Cart placeholder"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#d8e978] px-1 text-[11px] font-black text-[#253326]">
              0
            </span>
          </button>

          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              {user.role === "ADMIN" ? (
                <Link
                  href="/admin"
                  className="hidden h-10 items-center justify-center rounded-lg border border-[#aac17e] bg-[#e8efd8] px-3 text-sm font-black text-[#3f5b25] transition hover:bg-[#dde9c8] xl:inline-flex"
                >
                  Admin
                </Link>
              ) : null}
              <Link
                href="/account"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#d7dfbd] bg-white/70 px-3 text-sm font-black text-[#344554] transition hover:border-[#8ea95c] hover:bg-[#edf4de]"
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
                className="inline-flex h-10 items-center justify-center rounded-lg border border-[#d7dfbd] bg-white/70 px-3 text-sm font-black text-[#344554] transition hover:border-[#8ea95c] hover:bg-[#edf4de]"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-[#6e8f3d] px-3 text-sm font-black text-white transition hover:bg-[#5f7d33]"
              >
                Create Account
              </Link>
            </div>
          )}

          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-lg border border-[#d7dfbd] bg-white/70 text-[#344554] lg:hidden"
            aria-label="Open menu placeholder"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="border-t border-[#d7dfbd] px-4 py-3 sm:hidden">
        {user ? (
          <div className="mx-auto flex max-w-7xl items-center gap-2">
            <Link
              href="/account"
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-[#d7dfbd] bg-white/70 px-3 text-sm font-black text-[#344554]"
            >
              <UserRound className="h-4 w-4" />
              Account
            </Link>
            {user.role === "ADMIN" ? (
              <Link
                href="/admin"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-[#aac17e] bg-[#e8efd8] px-3 text-sm font-black text-[#3f5b25]"
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
              className="inline-flex h-10 items-center justify-center rounded-lg border border-[#d7dfbd] bg-white/70 px-3 text-sm font-black text-[#344554]"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-[#6e8f3d] px-3 text-sm font-black text-white"
            >
              Create Account
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
