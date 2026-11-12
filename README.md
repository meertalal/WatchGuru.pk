# WatchGuru.pk — Buy 100% Original Luxury Watches Online in Pakistan

A complete luxury watch e-commerce storefront: homepage, collections, product pages,
cart drawer, checkout, order tracking, policies and a staff-only admin dashboard —
styled as a premium boutique with a charcoal, ivory and warm-gold palette, serif
display typography and generous spacing.

**Brand:** WatchGuru.pk · **Currency:** PKR (catalogue prices were authored in USD,
converted at **1 USD = PKR 276.53**) · **Market:** Pakistan (Cash on Delivery nationwide)

The React storefront is backed by a real PHP API in [`api/`](api/README.md): **Slim 4**,
**PHP-DI**, **Doctrine ORM 3**, **Doctrine Migrations** and **MySQL**. The storefront is
guest-only; a single admin account manages the catalogue and orders. Orders, newsletter
signups, contact messages and warranty serials are stored server-side.

---

## Getting started (Windows)

### 1. Start the API

```cmd
cd api
copy .env.example .env
composer install
composer console migrations:migrate
composer console app:seed --fresh
composer start
```

The API listens on <http://127.0.0.1:8090>. See [`api/README.md`](api/README.md) for
database setup, environment variables and the full route map.

### 2. Start the storefront

```cmd
copy .env.example .env
npm install
npm run dev
```

Open the printed URL (usually <http://localhost:5173>). During development Vite proxies
`/api` to `http://127.0.0.1:8090`, so no CORS setup is needed. Override the target with
`VITE_API_PROXY_TARGET`, or point the built app at a deployed API with `VITE_API_URL`
(defaults to `/api`).

Production build & preview:

```cmd
npm run build
npm run preview
```

| Command | Description |
| --- | --- |
| `npm run dev` | Vite dev server with HMR + API proxy |
| `npm run build` | Type-check (`tsc -b`) and build for production |
| `npm run preview` | Serve the production build |
| `npm run lint` | Run Oxlint |

---

## Routes

| Route | Page |
| --- | --- |
| `/` | **Home** — promotional hero slider, brand story, premium / fashion / executive / own-brand carousels, shop by brand, COD & warranty benefits, testimonials, newsletter |
| `/collections/all` | **All Watches** — sort, filter, chips, pagination |
| `/collections/men` · `/collections/women` | Men's / Women's watches |
| `/collections/executive` | **The Executive Edit** — grand complications & numbered pieces |
| `/collections/original` | **Original Watches** — authenticated partner-maison pieces |
| `/collections/fashion` | **The Fashion Edit** |
| `/collections/brand/:brandSlug` | Individual maison (meridian, beaumont, aurelian, halcyon, nordvik, delacroix, watchguru-atelier) |
| `/products/:slug` | **Product details** — gallery, specs, materials & care, shipping & warranty, related pieces |
| `/shop`, `/product/:id` | Legacy aliases — redirect to canonical routes |
| `/search` | Live search (shareable `?q=`) |
| `/cart` · `/checkout` · `/order-confirmation` | Cart page · secure checkout · confirmation with live timeline |
| `/track-order` | Track by order number + email (deep-linkable) |
| `/policies/refund-policy` · `/policies/shipping-policy` · `/policies/terms-of-service` · `/policies/warranty` | Customer-care pages (warranty page verifies serials against the API) |
| `/admin/login` | Staff sign in |
| `/admin` · `/admin/orders` · `/admin/products` | **Store admin** — overview, order manager, full catalogue CRUD |
| `/about` · `/contact` · `*` | About · Contact · styled 404 |

Canonical URLs are slug-based and SEO-friendly; every page ships its own `title`, meta
description, Open Graph/Twitter tags and canonical link (`src/hooks/useDocumentMeta.ts`).
`sitemap.xml` and `robots.txt` live in `public/`.

---

## Demo credentials

| Role | Email | Password |
| --- | --- | --- |
| Store admin | `admin@watchguru.pk` | `admin123` |

There are no customer accounts. The admin dashboard (`/admin`) shows live KPIs, moves
orders through fulfilment (Processing → Confirmed → Shipped → Out for Delivery →
Delivered / Cancelled) and edits/adds/restocks/deletes products. Every change is written
to MySQL and appears on the storefront immediately.

**Try order tracking:** place an order through checkout, then use its order number and
the email entered at checkout on `/track-order`.

### Demo coupon codes

| Code | Effect |
| --- | --- |
| `WATCHGURU10` | 10% off |
| `WELCOME50` | PKR 13,826 off |
| `NOUVEAU` | 15% off |

### Demo warranty serials

Seeded serials look like `WG-2026-1001` … `WG-2026-1012` and verify on
`/policies/warranty`.

---

## Architecture (SOLID, layered)

### Frontend

```
src/
├─ types/index.ts          Domain types (Product, Order, AdminAccount…)
├─ lib/                    Pure, framework-free logic
│  ├─ api.ts               Typed API client, envelope unwrapping, admin token storage
│  ├─ catalog.ts           selectors: premium / new / sale / search / related / bounds
│  ├─ shop.ts              filter + sort + page-size rules
│  ├─ cart.ts              coupons + totals (mirrors the API)
│  ├─ orders.ts            status flow, payment methods, labels
│  ├─ navigation.ts        single source of truth for header/footer links
│  ├─ product.ts           materials & care copy generated from the spec
│  └─ validation.ts        zod schemas (checkout, admin, contact…)
├─ data/
│  ├─ products.ts          Factory catalogue (used for brand/colour vocabularies)
│  ├─ collections.ts       Collection registry (slug, copy, matcher) — data, not code
│  └─ repositories/        API repositories behind interfaces:
│                          product, order, coupon, support
├─ store/                  React contexts — one per concern (SRP)
│  ├─ catalog.tsx          Async catalogue: load, search, admin CRUD, bounds
│  ├─ orders.tsx           Order placement, tracking, admin status updates
│  ├─ auth.tsx             Admin-only session (bearer token in localStorage)
│  ├─ cart.tsx · wishlist.tsx · toast.tsx
│  └─ AppProviders.tsx     Provider composition
├─ hooks/                  useShopFilters (URL-driven), useDocumentMeta, useLocalStorage
├─ components/             layout (Header/Footer/drawers) · collection · home ·
│                          product · shop · order · policies · admin · ui
└─ pages/                  Route components (lazy-loaded) + /admin/*
public/
└─ watches/                The generated originals served as product images
```

### Backend

See [`api/README.md`](api/README.md) for the full breakdown. The request path is
`Route → Middleware → Controller → Service → Repository → Entity`, with JSON columns for
nested product data (`highlights`, `images`, `collections`, `features`, `specs`,
`variants`). Responses use a consistent envelope:

```json
{ "data": { } }
{ "error": { "code": "…", "message": "…", "fields": { } } }
```

**Principles in practice**

- **S** — each context/module/repository has exactly one job.
- **O** — new collections are config entries, not new pages.
- **L** — repository implementations are interchangeable; the UI never calls `fetch`.
- **I** — small focused hooks (`useCart` ≠ `useWishlist` ≠ `useAuth`).
- **D** — UI depends on contexts and repository interfaces, never on transport details.

---

## Catalogue data

- 23 watches across 6 partner maisons + the in-house **WatchGuru Atelier** (3 pieces),
  tagged into Men / Women / Executive / Fashion / Signature collections.
- The seed catalogue lives in `api/config/seeds/products.json` and is imported by
  `composer console app:seed --fresh`. Admin edits persist in MySQL; the admin
  “Reset catalogue” button re-imports the seed file.
- Product imagery is 100% original — every image is generated artwork stored as
  `public/watches/<slug>.svg`, per the product spec (case material, dial, strap,
  complication). No stock photos, no third-party brand logos. Hero artwork lives in
  `public/heroes/*.svg`, and `public/og.png` is the social share image.

---

## Design system

Defined in `src/index.css` (Tailwind v4 `@theme`).

| Token | Value | Use |
| --- | --- | --- |
| Charcoal | `#171717` | Text, dark sections, buttons |
| Ivory | `#F7F6F3` | Page background |
| Warm gold | `#B58A62` | Accents, prices, CTAs |
| White | `#FFFFFF` | Cards & surfaces |

Typography: Playfair Display (logo/hero) · Cormorant Garamond (headings) ·
Montserrat (labels/nav) · Inter (body) · Lato (inputs).

---

## Notes for going live

- Deploy the API behind HTTPS and set `VITE_API_URL` to its public `/api` URL at build
  time. Keep admin tokens out of source control; they are stored hashed in
  `admin_tokens` with a 7-day TTL.
- Wire real payments (COD + Easypaisa/JazzCash/bank transfer are current) and a courier
  API for live tracking; the order model already carries `statusHistory` for it.
- Configure transactional email for contact/newsletter notifications (messages are
  currently persisted only) and rotate the seeded admin password.
- Swap `robots.txt`/`sitemap.xml` domain and the demo contact details
  (WhatsApp +92 322 2242389) and social URLs in `src/components/layout/*`.
