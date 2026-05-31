import Image from "next/image";
import Link from "next/link";
import { getSitePreferences } from "@/lib/admin/data";

const footerSections = [
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
    title: "Support",
    links: [
      { label: "Warranty", href: "#" },
      { label: "Shipping", href: "#" },
      { label: "Returns", href: "#" },
      { label: "Repairs", href: "/categories/repairs-parts" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Accessibility", href: "#" },
    ],
  },
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

export async function Footer() {
  const preferences = await getSitePreferences();
  const siteInitials = getInitials(preferences.siteName);

  return (
    <footer className="bg-[#253326] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_2fr] lg:px-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-3"
            aria-label={`${preferences.siteName} home`}
          >
            <span className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-lg border border-[#d8e978]/35 bg-white/10 text-sm font-black text-[#d8e978]">
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
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#d7dfbd]">
                {preferences.storeTagline}
              </span>
            </span>
          </Link>
          <p className="mt-5 max-w-md text-sm leading-6 text-[#dfe8d0]">
            A focused commerce foundation for premium devices, upgrade parts,
            creator gear, and support-ready technology products.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-black uppercase tracking-[0.16em] text-[#d8e978]">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-[#dfe8d0]">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d8e978]"
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
      <div className="border-t border-white/10 px-4 py-5 text-center text-sm text-[#bac7ac]">
        (c) 2026 {preferences.siteName}. {preferences.storeTagline}.
      </div>
    </footer>
  );
}
