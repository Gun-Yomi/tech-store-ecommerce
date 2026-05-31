# Premium Tech E-commerce Demo

A Next.js, TypeScript, Tailwind CSS, Prisma, and SQLite e-commerce demo for a premium technology store. The app includes a branded storefront, product catalog, authentication, cart and wishlist workflows, admin management, and manual checkout/order tracking.

## Current Phase Summary

- Phase 0-1: Next.js foundation, Tailwind design system, homepage shell.
- Phase 2: Product catalog, categories, brands, filtering, sorting, and product detail pages.
- Phase 3: Authentication, registration verification codes, login, password reset, account profile.
- Phase 4: Cart, wishlist, save-for-later, stock-aware shopping actions.
- Phase 5: Admin dashboard, product/category/brand/user management, site preferences.
- Phase 6: Manual checkout, order creation, customer order history, admin order management.
- Phase 7: Polish, loading/error states, accessibility improvements, security review, basic tests, and documentation.

## Requirements

- Node.js 20 or newer.
- npm.
- SQLite through Prisma.

## Environment

Copy `.env.example` to `.env` and update values for your machine.

```bash
cp .env.example .env
```

Required:

- `DATABASE_URL`: local SQLite database path, for example `file:./dev.db`.
- `AUTH_CODE_PEPPER`: long random secret used when hashing email verification codes.
- `VERIFICATION_CODE_TTL_MINUTES`: verification code expiry window.

Optional:

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`: email delivery for registration and password reset codes.
- `DEFAULT_ADMIN_NAME`, `DEFAULT_ADMIN_EMAIL`, `DEFAULT_ADMIN_PASSWORD`: local seed admin. Use only local/demo credentials here.

## Commands

Install dependencies:

```bash
npm install
```

Generate Prisma client:

```bash
npm run db:generate
```

Apply local migrations:

```bash
npm run db:migrate
```

Seed local data:

```bash
npm run db:seed
```

Run migrations and seed together:

```bash
npm run db:setup
```

Start development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Run lint:

```bash
npm run lint
```

Run tests:

```bash
npm test
```

Run production build:

```bash
npm run build
```

Start production server after build:

```bash
npm run start
```

## Local Demo Access

If `DEFAULT_ADMIN_EMAIL` and `DEFAULT_ADMIN_PASSWORD` are set before `npm run db:seed`, the seed script creates or updates a local admin account. These credentials are for local demo only and must not be reused in production.

Customer accounts can be created through `/register` once SMTP is configured. Without SMTP, registration code delivery is intentionally blocked.

## Manual QA Checklist

- Homepage: hero, category preview, featured products, responsive header, footer links.
- Product listing: search, category/brand filters, stock filter, price filter, sorting, empty results.
- Product detail: gallery, price/sale display, stock label, add-to-cart, wishlist, related sections.
- Register: email code request, validation errors, code verification.
- Login: failed login message, successful login redirect, forgot-password link.
- Account: profile update, password change, account order links.
- Cart: quantity updates, remove, save for later, blocking low-stock/unavailable checkout.
- Wishlist: move to cart, remove, empty state.
- Save for later: move to cart, remove, empty state.
- Checkout: delivery validation, pickup flow, empty cart state, blocked stock state.
- Order confirmation: customer can view own order only.
- Customer order history: empty and populated states.
- Admin dashboard: stats, quick links, responsive sidebar.
- Admin product CRUD: create, edit, archive, delete-blocking checks.
- Admin categories/brands: create, edit, deactivate, delete-blocking checks.
- Admin preferences: site name, tagline, hero copy, contact settings.
- Admin orders: filters, status update, cancellation stock restore.
- Unauthorized access: logged-out users redirect to login, customers redirect away from admin.
- Mobile layout: header menu, product cards, cart, checkout, admin tables.

## Security Notes

- Passwords are hashed with bcrypt before storage.
- Session tokens are random, hashed in the database, and stored in HTTP-only cookies.
- Admin routes and admin server actions verify the current user is an admin.
- Customer order detail queries are scoped to the current user.
- Checkout totals and stock validation are calculated server-side.
- Product, brand, and category active statuses are respected on public storefront queries.
- `.env` files and local SQLite databases are ignored by Git.
- Destructive admin actions use confirmation prompts and server-side reference checks.
- The app does not include real payment processing or file uploads yet.

## Performance Notes

- Public product sections are server-rendered.
- Homepage product sections use limited queries.
- Product images use stable dimensions to reduce layout shift.
- Admin and catalog tables are horizontally scrollable on narrow screens.
- Future production work should add pagination for large product, order, and user tables.

## Known Limitations

- Checkout is manual; there is no real payment gateway.
- Shipping, tax, and discounts are placeholders for later phases.
- Email requires SMTP configuration.
- Images are URL-based; there is no managed upload pipeline.
- Admin product/order/user lists do not yet paginate.
- SQLite is suitable for local/demo work, not production scale.
- Footer support/legal links point to available app flows rather than full policy pages.

## Recommended Next Features

- Real payment gateway.
- Shipping/tax integrations.
- Upload-backed media management.
- Paginated admin tables.
- Transactional order emails.
- Policy/support pages.
- More automated browser or integration tests.
