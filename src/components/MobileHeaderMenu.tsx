"use client";

import {
  Heart,
  LogOut,
  Menu,
  Search,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { logoutAction } from "@/lib/auth/actions";
import type { SafeUser } from "@/lib/auth/types";

type MobileHeaderUser = Pick<SafeUser, "email" | "name" | "role">;

type MobileHeaderMenuProps = {
  counts: {
    cartCount: number;
    wishlistCount: number;
  };
  navItems: Array<{
    label: string;
    href: string;
  }>;
  user: MobileHeaderUser | null;
};

export function MobileHeaderMenu({
  counts,
  navItems,
  user,
}: MobileHeaderMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        className="grid h-10 w-10 place-items-center rounded-lg border border-[#d7dfbd] bg-white/70 text-[#344554] transition hover:border-[#8ea95c] hover:bg-[#edf4de] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8ea95c] lg:hidden"
        aria-controls={panelId}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        onClick={() => setIsOpen((current) => !current)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isOpen ? (
        <div
          id={panelId}
          className="absolute left-4 right-4 top-full z-50 mt-3 overflow-hidden rounded-lg border border-[#c9d9a4] bg-[#fbfcf6] text-[#344554] shadow-[0_20px_50px_rgba(52,69,84,0.18)] lg:hidden"
        >
          <div className="space-y-4 p-4">
            <form
              action="/products"
              role="search"
              onSubmit={() => setIsOpen(false)}
            >
              <label className="relative block">
                <span className="sr-only">Search products</span>
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#344554]" />
                <input
                  name="search"
                  type="search"
                  placeholder="Search phones, laptops, cameras, parts..."
                  className="h-11 w-full rounded-lg border border-[#d7dfbd] bg-white pl-11 pr-4 text-sm text-[#253326] outline-none transition placeholder:text-[#75806f] focus:border-[#7f9a4b]"
                />
              </label>
            </form>

            <nav className="grid gap-2 text-sm font-black" aria-label="Mobile menu">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg border border-transparent px-3 py-2.5 transition hover:border-[#d7dfbd] hover:bg-[#edf4de] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8ea95c]"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/wishlist"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#d7dfbd] bg-white px-3 text-sm font-black text-[#344554] transition hover:border-[#8ea95c] hover:bg-[#edf4de]"
                onClick={() => setIsOpen(false)}
              >
                <Heart className="h-4 w-4" />
                Wishlist
                {counts.wishlistCount > 0 ? (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#d8e978] px-1 text-[11px] text-[#253326]">
                    {counts.wishlistCount}
                  </span>
                ) : null}
              </Link>
              <Link
                href="/cart"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#d7dfbd] bg-white px-3 text-sm font-black text-[#344554] transition hover:border-[#8ea95c] hover:bg-[#edf4de]"
                onClick={() => setIsOpen(false)}
              >
                <ShoppingCart className="h-4 w-4" />
                Cart
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#d8e978] px-1 text-[11px] text-[#253326]">
                  {counts.cartCount}
                </span>
              </Link>
            </div>

            {user ? (
              <div className="grid gap-2 border-t border-[#d7dfbd] pt-4">
                <Link
                  href="/account"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#d7dfbd] bg-white px-3 py-2 text-sm font-black text-[#344554] transition hover:border-[#8ea95c] hover:bg-[#edf4de]"
                  onClick={() => setIsOpen(false)}
                >
                  <UserRound className="h-4 w-4 shrink-0" />
                  <span className="min-w-0 truncate">{user.name}</span>
                </Link>
                {user.role === "ADMIN" ? (
                  <Link
                    href="/admin"
                    className="inline-flex h-11 items-center justify-center rounded-lg border border-[#aac17e] bg-[#e8efd8] px-3 text-sm font-black text-[#3f5b25] transition hover:bg-[#dde9c8]"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin
                  </Link>
                ) : null}
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#d7dfbd] bg-white px-3 text-sm font-black text-[#344554] transition hover:border-[#8ea95c] hover:bg-[#edf4de]"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </form>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 border-t border-[#d7dfbd] pt-4">
                <Link
                  href="/login"
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-[#d7dfbd] bg-white px-3 text-sm font-black text-[#344554] transition hover:border-[#8ea95c] hover:bg-[#edf4de]"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-[#6e8f3d] px-3 text-sm font-black text-white transition hover:bg-[#5f7d33]"
                  onClick={() => setIsOpen(false)}
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
