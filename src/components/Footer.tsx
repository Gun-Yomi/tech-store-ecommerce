import Image from "next/image";
import Link from "next/link";
import { getSitePreferences } from "@/lib/admin/data";

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

function getFooterSections(contactEmail: string) {
  return [
    {
      title: "Shop",
      links: [
        { label: "Products", href: "/products" },
        { label: "Categories", href: "/categories" },
        { label: "Brands", href: "/brands" },
        { label: "Phones", href: "/categories/phones" },
        { label: "Laptops", href: "/categories/laptops" },
      ],
    },
    {
      title: "Orders",
      links: [
        { label: "Cart", href: "/cart" },
        { label: "Wishlist", href: "/wishlist" },
        { label: "Saved items", href: "/cart#saved-items" },
        { label: "Checkout", href: "/checkout" },
        { label: "Order history", href: "/account/orders" },
      ],
    },
    {
      title: "Account",
      links: [
        { label: "Account home", href: "/account" },
        { label: "Login", href: "/login" },
        { label: "Create account", href: "/register" },
        { label: "Admin", href: "/admin" },
        {
          label: "Contact",
          href: contactEmail ? `mailto:${contactEmail}` : "/products",
        },
      ],
    },
  ];
}

export async function Footer() {
  const preferences = await getSitePreferences();
  const siteInitials = getInitials(preferences.siteName);
  const footerSections = getFooterSections(preferences.contactEmail);

  return (
    <footer className="bg-[#1f2a44] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_2fr] lg:px-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-3"
            aria-label={`${preferences.siteName} home`}
          >
            <span className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-lg border border-[#c7e8ff]/35 bg-white/10 text-sm font-black text-[#c7e8ff]">
              {preferences.logoUrl ? (
                <Image
                  src={preferences.logoUrl}
                  alt=""
                  fill
                  unoptimized
                  sizes="44px"
                  className="object-cover"
                />
              ) : (
                siteInitials
              )}
            </span>
            <span>
              <span className="block text-xl font-black leading-none tracking-wide">
                {preferences.siteName}
              </span>
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#cfe0f2]">
                {preferences.storeTagline}
              </span>
            </span>
          </Link>
          <p className="mt-5 max-w-md text-sm leading-6 text-[#e4f1ff]">
            {preferences.footerDescription}
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-black uppercase tracking-[0.16em] text-[#c7e8ff]">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-[#e4f1ff]">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c7e8ff]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-sm text-[#b8c8da]">
        (c) 2026 {preferences.siteName}. {preferences.storeTagline}.
      </div>
    </footer>
  );
}
