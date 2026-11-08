# WatchGuru.pk — Buy 100% Original Luxury Watches Online in Pakistan

A complete, operational luxury watch e-commerce storefront: homepage, collections,
product pages, cart drawer, checkout, customer accounts, order tracking, policies
and a full admin dashboard — styled as a premium boutique with a charcoal, ivory
and warm-gold palette, serif display typography and generous spacing.

**Brand:** WatchGuru.pk · **Currency:** PKR (catalogue prices were authored in USD, converted at
**1 USD = PKR 276.53**) · **Market:** Pakistan (Cash on Delivery nationwide)

> **Fulfilment is simulated in the browser.** Checkout, COD calls, newsletter and the
> verification tool run client-side; no parcel is dispatched and no card is charged.
> The architecture (repositories + contexts) is built so a real backend can
> replace `localStorage` without touching components.

---

## Getting started (Windows)

```cmd
cd /d D:\laragon\www\guru-watch
npm install
npm run dev
```

Open the printed URL (usually <http://localhost:5173>).

Production build & preview:

```cmd
npm run build
npm run preview
```

| Command | Description |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
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
| `/account` · `/account/login` · `/account/register` | Customer dashboard · sign in · register |
| `/policies/refund-policy` · `/policies/shipping-policy` · `/policies/terms-of-service` · `/policies/warranty` | Customer-care pages (warranty page includes an instant serial verifier) |
| `/admin` · `/admin/orders` · `/admin/products` | **Store admin** — overview, order manager, full catalogue CRUD |
| `/about` · `/contact` · `*` | About · Contact · styled 404 |

Canonical URLs are slug-based and SEO-friendly; every page ships its own
`title`, meta description, Open Graph/Twitter tags and canonical link
(`src/hooks/useDocumentMeta.ts`). `sitemap.xml` and `robots.txt` live in `public/`.

---

## Demo credentials

| Role | Email | Password |
| --- | --- | --- |
| Store admin | `admin@watchguru.pk` | `admin123` |
| Customer | `demo@watchguru.pk` | `demo1234` |

The admin dashboard (`/admin`) shows seeded KPIs, lets you move orders through
fulfilment (Processing → Confirmed → Shipped → Out for Delivery → Delivered /
Cancelled), and edit/add/restock/delete products — every change is live on the
storefront instantly and persists on this device.

**Try the demo order tracking:** on `/track-order`, use `WG-DEMO2041` or
`WG-DEMO2098` with `demo@watchguru.pk` (two sample orders are seeded on first run).

### Demo coupon codes

| Code | Effect |
| --- | --- |
| `WATCHGURU10` | 10% off |
| `WELCOME50` | PKR 13,826 off |
| `NOUVEAU` | 15% off |

---

## Architecture (SOLID, layered)

```
src/
├─ types/index.ts          Domain types (Product, Order, Account…)
├─ lib/                    Pure, framework-free logic
│  ├─ catalog.ts           selectors: premium / new / sale / search / related / bounds
│  ├─ shop.ts              filter + sort + page-size rules
│  ├─ cart.ts              coupons + totals
│  ├─ orders.ts            status flow, payment methods, order numbers
│  ├─ navigation.ts        single source of truth for header/footer links
│  ├─ storage.ts           namespaced, failure-safe localStorage helpers
│  ├─ product.ts           materials & care copy generated from the spec
│  └─ validation.ts        zod schemas (checkout, auth, admin…)
├─ data/
│  ├─ products.ts          Factory catalogue (seed) — authored in USD → PKR
│  ├─ collections.ts       Collection registry (slug, copy, matcher) — data, not code
│  └─ repositories/        Product / Order / Account repositories behind
│                          interfaces; localStorage impls + demo seeds.
│                          Swap for an API with zero component changes.
├─ store/                  React contexts — one per concern (SRP)
│  ├─ catalog.tsx          Live catalogue: products, search, admin CRUD, bounds
│  ├─ cart.tsx · wishlist.tsx · orders.tsx · auth.tsx · toast.tsx
│  └─ AppProviders.tsx     Provider composition
├─ hooks/                  useShopFilters (URL-driven), useDocumentMeta, useLocalStorage
├─ components/             layout (Header/Footer/drawers) · collection · home ·
│                          product · shop · order · policies · admin · ui
└─ pages/                  Route components (lazy-loaded) + /admin/*
public/
└─ watches/                The generated originals served as product images
```

**Principles in practice**

- **S** — each context/module/repository has exactly one job.
- **O** — new collections are config entries, not new pages.
- **L** — `ProductRepository` impls are interchangeable.
- **I** — small focused hooks (`useCart` ≠ `useWishlist` ≠ `useAuth`).
- **D** — UI depends on contexts & repository interfaces, never on storage.

---

## Demo data

- 23 watches across 6 partner maisons + the in-house **WatchGuru Atelier** (3 pieces),
  tagged into Men / Women / Executive / Fashion / Signature collections.
- Orders, accounts, cart, wishlist and the admin-edited catalogue persist in
  `localStorage` under `watchguru-pk:*` keys — clear via DevTools (Application →
  Local Storage) or the admin “Reset catalogue” button.
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

- Replace the localStorage repositories with API implementations of the same
  interfaces (`src/data/repositories/*`) — components stay untouched.
- Wire real payments (COD + Easypaisa/JazzCash/bank transfer are current) and a
  courier API for live tracking; the order model already carries
  `statusHistory` for it.
- Put the site behind HTTPS; account hashing is demo-grade (SHA-256 + salt).
- Swap `robots.txt`/`sitemap.xml` domain and the demo contact details
  (WhatsApp +92 322 2242389) and social URLs in `src/components/layout/*`.
