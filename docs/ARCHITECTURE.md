# SHOP.TAPLA.AZ — Architecture

## Stack

- Next.js 16 + React 19
- TypeScript
- Tailwind CSS 4 + shadcn/ui
- **Framer Motion** (v12, replaces `motion/react`)
- Supabase (PostgreSQL)
- **lucide-react** (icons)

## Project Structure

```
src/
  app/
    layout.tsx              — Root layout (Inter, AppProviders, Header, Footer, StickyMobileBar)
    page.tsx                — Homepage (Aluna landing)
    not-found.tsx           — 404
    landing/[slug]/         — Landing pages (SSG)
    products/
      page.tsx              — Product catalog
      [slug]/               — Product detail + ProductClient
    collections/            — Collections
    checkout/               — Checkout page
  components/
    ui/                     — Button, Container, Badge, Heading, Section, Input, Modal, Drawer, Accordion
    layout/                 — Header, Footer, AnnouncementBar, StickyMobileBar
    cards/                  — ProductCard, ReviewCard
    sections/               — Aluna premium sections (Hero, ProductGrid, ValueProps, FeaturesStep, PromoBanners, Benefits, ReviewsSection, FAQ)
    landings/
      sections/             — Landing blocks (9 sections)
      landing-renderer.tsx  — Assembles landing from section config
  landings/
    themes.ts               — 6 theme presets
    registry.ts             — Local landing registry
    {slug}/                 — Individual landing modules
  lib/
    supabase/
      client.ts             — Supabase client (anon)
      admin.ts              — Supabase admin (service_role)
      types.ts              — TS interfaces (Product, Landing, Order, Lead...)
      queries.ts            — DB query functions
      migrations/           — SQL migrations
    utils.ts                — cn() (clsx + tailwind-merge)
    animations.ts           — Framer Motion variants
  store/
    CartContext.tsx          — Cart with localStorage persistence
  providers/
    AppProviders.tsx         — CartProvider wrapper
  services/
    db.ts                   — Data service (Supabase → static fallback)
  constants/
    data.ts                 — Aluna products, reviews, FAQs, ritual steps, benefits
  types/
    index.ts                — Shared types (v1 + v2 Aluna types merged)
```

## How Landing Pages Work (v1 — preserved)

Each landing is defined in `src/landings/{slug}/config.ts` as a config object.

The `LandingRenderer` reads sections array and renders each block. The `[slug]` page pulls from registry.

9 standard sections: hero, benefits, ingredients, howToUse, beforeAfter, testimonials, faq, offer, checkout

## Aluna Premium Sections (v2 — new)

| Section | File | Description |
|---------|------|-------------|
| Hero | `sections/Hero.tsx` | Editorial slider (3 slides, auto-rotate) |
| ProductGrid | `sections/ProductGrid.tsx` | Category filter + product cards + QuickView modal |
| ValueProps | `sections/ValueProps.tsx` | Skin quiz, device comparison, AI advisor, consultation |
| FeaturesStep | `sections/FeaturesStep.tsx` | Evening ritual interactive deck |
| PromoBanners | `sections/PromoBanners.tsx` | Dual banners + spotlight + category grid |
| Benefits | `sections/Benefits.tsx` | 4-column benefit cards |
| ReviewsSection | `sections/ReviewsSection.tsx` | Rating snapshot, filters, write-review modal |
| FAQ | `sections/FAQ.tsx` | Searchable accordion + contact cards |

## Routes

| Path | Type | Description |
|------|------|-------------|
| `/` | Static | Aluna homepage (full landing) |
| `/landing/{slug}` | SSG | Product landing (v1) |
| `/products` | Static | Catalog |
| `/products/{slug}` | SSG | Product detail (Aluna + v1) |
| `/checkout` | Dynamic | Checkout with cart + payment |
| `/collections` | Static | Collections |
| `/collections/{slug}` | SSG | Collection detail |
| `/admin` | Dynamic | Админ-панель: логин + дашборд |
| `/admin/products` | Dynamic | CRUD товаров (все Aluna-поля) |
| `/admin/products/new` | Dynamic | Создание товара |
| `/admin/products/[id]/edit` | Dynamic | Редактирование товара |
| `/admin/orders` | Dynamic | Заказы со сменой статуса |

## Админ-панель

`ADMIN_PASSWORD` из `.env.local` → JWT (jose, httpOnly cookie, 24ч).

| Файл | Назначение |
|------|-----------|
| `src/lib/auth.ts` | Server Actions: login/logout/checkAuth |
| `src/app/admin/layout.tsx` | Проверка auth + навигация |
| `src/app/admin/page.tsx` | Логин + дашборд (счётчики товаров/заказов) |
| `src/app/admin/products/page.tsx` | Список с удалением |
| `src/app/admin/products/new/page.tsx` | Создание |
| `src/app/admin/products/[id]/edit/page.tsx` | Редактирование |
| `src/app/admin/products/product-form.tsx` | Клиентский компонент формы (все Aluna-поля) |
| `src/app/admin/orders/page.tsx` | Список + select смена статуса (Server Action) |

## Supabase

Connected to `nzkqorbyexisnbyjhvdf.supabase.co`.

Tables:
- **v1 (landings system):** `products`, `landings`, `media`, `orders`, `leads`, `collections`, `collection_products`
- **v2 (Aluna):** `products`, `reviews`, `faqs`

Data flow: `services/db.ts` → queries Supabase → falls back to `constants/data.ts` static data.

All tables exist and are queryable. Seed scripts in `src/lib/supabase/seed/`.

## Key Integration Notes

- `@/` alias mapped to `./src/*`
- `framer-motion` replaces v2's `motion/react` (same API)
- `lucide-react` v1.21.0 — social icons: `Globe`, `ExternalLink`, `CirclePlay` (Twitter/Youtube removed upstream)
- All v2 imports converted from relative (`../ui/`) to alias (`@/components/ui/`)
- `[id]` route merged into existing `[slug]` to avoid Next.js ambiguous route error
