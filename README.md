# WatchGuru.pk — Fine Luxury Watches

A polished, fully interactive **frontend-only** luxury watch storefront. WatchGuru.pk is designed to
feel like an established boutique: charcoal, ivory and warm-gold palette, serif display typography,
spacious layouts, refined product cards and responsive mobile navigation.

> **Demo project.** There is no backend, database, authentication or real payment processing.
> Checkout, newsletter, contact and cart interactions are simulated in the browser only — no data is
> transmitted and no order is ever placed.

**Brand:** WatchGuru.pk · **Currency:** PKR (catalogue prices were authored in USD and are
converted at an indicative rate of **1 USD = PKR 276.53** (open.er-api.com, 4 Nov 2026), rounded to
whole rupees).

---

## Getting started (Windows CMD)

Open **Command Prompt** (`cmd.exe`) and run:

```cmd
cd /d D:\laragon\www\guru-watch
npm install
npm run dev
```

Then open the printed URL (usually <http://localhost:5173>).

To create and preview a production build:

```cmd
npm run build
npm run preview
```

### If `npm` is blocked in PowerShell

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

---

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) and build for production into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run Oxlint |

---

## Pages (8)

| Route | Page | Highlights |
| --- | --- | --- |
| `/` | **Home** | Hero, service highlights, signature collection, promo banner, new arrivals, collections, brand strip, editorial quote |
| `/shop` | **Shop** | Filters (price, brand, collection, dial, strap, features), sorting, active-filter chips, pagination, wishlist buttons |
| `/product/:id` | **Product details** | Gallery, specs, feature list, quantity selector, add to cart / buy now, related products |
| `/cart` | **Shopping cart** | Line items, quantity controls, remove, clear, order summary (PKR) |
| `/checkout` | **Checkout** | Contact + shipping address form, coupon field, order summary, validated simulated order |
| `/about` | **About us** | Brand story, craftsmanship, values, statistics |
| `/contact` | **Contact us** | Contact details, opening hours, validated message form |
| `/order-confirmation` | **Order confirmation** | Demo order number, purchased items, totals (PKR), shipping details, print receipt |

Plus a styled 404 page for unknown routes.

---

## Features

- **Fully responsive** desktop, tablet and mobile layouts, including a slide-in mobile menu and a
  filter drawer for small screens.
- **WhatsApp chat button** — a floating button on every page opens a conversation with
  `+92 322 2242389` via WhatsApp.
- **Filtering and sorting** on the shop — by price range, brand, collection, dial colour, strap
  type and features.
- **URL-driven shop state** — filters, sort and page live in the query string, so results are
  shareable and the browser back button works.
- **Cart & wishlist** persisted to `localStorage` via React context, with a slide-over wishlist
  drawer and live badge counts.
- **Dynamic product pages** with image gallery, specifications and computed related products.
- **Checkout** collects contact + shipping details only (no payment is collected), applies coupon
  codes, and ends on the order confirmation page.
- **Toast feedback** for cart, wishlist, coupon, newsletter and contact submissions.
- **Resilient imagery** — if a remote product photo fails to load, an on-brand placeholder is shown
  instead of a broken image.

### Demo coupon codes

| Code | Effect |
| --- | --- |
| `WATCHGURU10` | 10% off |
| `WELCOME50` | PKR 13,826 off |
| `NOUVEAU` | 15% off |

### Demo data

- 20 sample watches across 6 fictional maisons (Meridian, Beaumont, Aurelian, Halcyon, Nordvik,
  Delacroix), priced in PKR.
- Cart, wishlist and last order persist across reloads via `localStorage` under the
  `watchguru-pk:*` keys. Clear them from the browser dev tools (Application → Local Storage) or the
  cart's **Clear cart**.

---

## Design system

Defined once in `src/index.css` using Tailwind v4's `@theme`.

| Token | Value | Use |
| --- | --- | --- |
| Charcoal | `#171717` | Primary text, dark sections, buttons |
| Ivory | `#F7F6F3` | Page background |
| Warm gold | `#B58A62` | Accents, prices, highlights |
| White | `#FFFFFF` | Cards and surfaces |
| Muted gray | `#777777` | Secondary text |

**Typography (7 families, all loaded from Google Fonts in `index.html`)**

| Element | Family |
| --- | --- |
| Logo / brand | Playfair Display 400 |
| Hero + key section headings | Playfair Display 400 |
| “New Arrivals” heading | DM Serif Display 400 |
| “Collections” heading | Cormorant Garamond 500 |
| Featured banner heading | Lora 400 |
| Brand-story / editorial headings + testimonial | Cormorant Garamond |
| Navigation links, labels, eyebrows, badges, buttons | Montserrat 500–600 |
| Body text, prices, descriptions | Inter 400–500 |
| Form inputs | Lato 400 |

---

## Project structure

```
src/
├─ components/
│  ├─ home/       Hero, ServiceHighlights, FeaturedWatches, PromoBanner,
│  │              NewArrivals, CollectionsShowcase, BrandStrip, EditorialQuote
│  ├─ layout/     Layout, Header, AnnouncementBar, Footer, MobileMenu,
│  │              WishlistDrawer, PageBanner, ScrollToTop, WhatsAppButton
│  ├─ product/    ProductCard, ProductGrid, ProductGallery
│  ├─ shop/       FilterPanel, FilterDrawer
│  └─ ui/         Button, Container, Rating, ProductImage, ProductBadgeTag,
│                 QuantityStepper, SectionHeading, Breadcrumbs, Pagination,
│                 EmptyState, Reveal, FormControls, SocialIcons
├─ data/          products.ts        (sample catalogue, brands, PKR conversion)
├─ hooks/         useLocalStorage.ts, useShopFilters.ts
├─ lib/           format.ts, ui.ts, shop.ts, cart.ts, validation.ts
├─ pages/         Home, Shop, ProductDetails, Cart, Checkout,
│                 About, Contact, OrderConfirmation, NotFound
├─ store/         contexts.ts (contexts + hooks), AppProviders.tsx
├─ types/         index.ts
├─ App.tsx        Router + routes
├─ main.tsx       Entry point
└─ index.css      Tailwind import + design tokens
```

---

## Notes

- **Imagery** is loaded from the Unsplash CDN. An internet connection gives the full experience;
  offline, product images fall back to an elegant branded placeholder.
- **No backend calls** are made. Forms resolve with a short delay and show demo feedback.
- Product photography is for demonstration only and is not affiliated with the sample brands.
- The floating WhatsApp button links to **+92 322 2242389**. Update the number in
  `src/components/layout/WhatsAppButton.tsx` if it changes.
