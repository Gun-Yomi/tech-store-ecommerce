ALTER TABLE "SitePreference" ADD COLUMN "heroImageUrl" TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1900&q=85';
ALTER TABLE "SitePreference" ADD COLUMN "featuredProductsTitle" TEXT NOT NULL DEFAULT 'Premium picks with launch pricing';
ALTER TABLE "SitePreference" ADD COLUMN "featuredProductsDescription" TEXT NOT NULL DEFAULT 'Launch selections spanning mobile, portable work, gaming systems, creator cameras, and desk upgrades.';
ALTER TABLE "SitePreference" ADD COLUMN "newArrivalsTitle" TEXT NOT NULL DEFAULT 'Fresh technology drops';
ALTER TABLE "SitePreference" ADD COLUMN "newArrivalsDescription" TEXT NOT NULL DEFAULT 'Recently added products from the active catalog, ready for the next phase of shopping flows.';
ALTER TABLE "SitePreference" ADD COLUMN "bestSellersTitle" TEXT NOT NULL DEFAULT 'Customer-favorite setups';
ALTER TABLE "SitePreference" ADD COLUMN "bestSellersDescription" TEXT NOT NULL DEFAULT 'Popular phones, laptops, creator gear, and accessories from the seeded catalog.';
ALTER TABLE "SitePreference" ADD COLUMN "footerDescription" TEXT NOT NULL DEFAULT 'A focused commerce foundation for premium devices, upgrade parts, creator gear, and support-ready technology products.';
UPDATE "SitePreference" SET "themeAccentColor" = '#4f9ed8' WHERE lower("themeAccentColor") = '#6e8f3d';
