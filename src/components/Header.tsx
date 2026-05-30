import { Heart, Menu, Search, ShoppingCart, UserRound } from "lucide-react";

const navItems = [
  { label: "Phones", href: "#categories" },
  { label: "Laptops", href: "#categories" },
  { label: "Cameras", href: "#categories" },
  { label: "Deals", href: "#featured-products" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07111f]/95 text-white shadow-[0_14px_40px_rgba(2,6,23,0.22)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <a href="#" className="flex items-center gap-3" aria-label="CircuitHaus home">
          <span className="grid h-10 w-10 place-items-center rounded-lg border border-cyan-300/30 bg-cyan-300/10 text-sm font-black text-cyan-200">
            CH
          </span>
          <span>
            <span className="block text-lg font-black leading-none tracking-wide">
              CircuitHaus
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-200/80">
              Tech Market
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-6 pl-4 text-sm font-semibold text-slate-200 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="transition-colors hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <form className="ml-auto hidden flex-1 justify-center md:flex" role="search">
          <label className="relative w-full max-w-xl">
            <span className="sr-only">Search products</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search phones, laptops, cameras, parts..."
              className="h-11 w-full rounded-lg border border-white/10 bg-white/10 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-400 hover:bg-white/15 focus:border-cyan-300 focus:bg-white/15"
            />
          </label>
        </form>

        <div className="flex items-center gap-2">
          {/* TODO(Phase 4): Wire wishlist and cart buttons to persistent user state. */}
          <button
            type="button"
            className="hidden h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/10 text-slate-100 transition hover:border-cyan-300/60 hover:bg-cyan-300/10 md:grid"
            aria-label="Wishlist placeholder"
          >
            <Heart className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="relative grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/10 text-slate-100 transition hover:border-cyan-300/60 hover:bg-cyan-300/10"
            aria-label="Cart placeholder"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-emerald-400 px-1 text-[11px] font-black text-[#07111f]">
              0
            </span>
          </button>
          {/* TODO(Phase 3): Replace account placeholder with login/register menu. */}
          <button
            type="button"
            className="hidden h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/10 text-slate-100 transition hover:border-cyan-300/60 hover:bg-cyan-300/10 sm:grid"
            aria-label="Account placeholder"
          >
            <UserRound className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/10 text-slate-100 lg:hidden"
            aria-label="Open menu placeholder"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
