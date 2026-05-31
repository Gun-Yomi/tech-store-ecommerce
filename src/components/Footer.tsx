const footerSections = [
  {
    title: "Shop",
    links: ["Phones", "Laptops", "Desktops", "Cameras", "Accessories"],
  },
  {
    title: "Support",
    links: ["Warranty", "Shipping", "Returns", "Repairs", "Contact"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Privacy", "Terms", "Accessibility"],
  },
];

export function Footer() {
  return (
    <footer className="bg-[#253326] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_2fr] lg:px-8">
        <div>
          <a href="#" className="inline-flex items-center gap-3" aria-label="CircuitHaus home">
            <span className="grid h-11 w-11 place-items-center rounded-lg border border-[#d8e978]/35 bg-white/10 text-sm font-black text-[#d8e978]">
              CH
            </span>
            <span>
              <span className="block text-xl font-black leading-none tracking-wide">
                CircuitHaus
              </span>
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#d7dfbd]">
                Premium Tech Market
              </span>
            </span>
          </a>
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
                  <li key={link}>
                    <a
                      href="#"
                      className="transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d8e978]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-sm text-[#bac7ac]">
        (c) 2026 CircuitHaus. Premium technology market.
      </div>
    </footer>
  );
}
