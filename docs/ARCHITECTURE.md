# SHOP.TAPLA.AZ — Architecture

## Stack

- Next.js 16 + React 19
- TypeScript
- Tailwind CSS 4 + shadcn/ui
- Framer Motion (v12, animation)
- lucide-react (icons)
- Supabase (PostgreSQL + Auth)
- OpenRouter (Tovar.AI — единый AI API)

## Project Structure

```
src/
  app/
    layout.tsx                   — Root layout (Inter, AppProviders, Header, Footer, StickyMobileBar)
    page.tsx                     — Homepage
    not-found.tsx                — 404
    products/
      page.tsx                   — Product catalog
      [slug]/page.tsx            — Product detail (SSG)
      [slug]/ProductClient.tsx   — Client component
    checkout/page.tsx            — Checkout (3 payment methods)
    collections/                 — Collections
    admin/                       — Admin panel (JWT auth)
      page.tsx                   — Login + dashboard
      layout.tsx                 — Auth guard + nav
      products/                  — CRUD
      orders/                    — Order management
      tovar-ai/page.tsx          — AI card generation UI
    api/
      tovar-ai/generate/route.ts        — POST pipeline
      tovar-ai/regenerate-card/route.ts — POST single card
      orders/route.ts                   — POST create order
  components/
    ui/                          — Button, Container, Badge, Heading, Section, Input, Modal, Drawer, Accordion
    layout/                      — Header, Footer, AnnouncementBar, StickyMobileBar
    cards/                       — ProductCard, ReviewCard
    auth/                        — AuthModal, AuthButton, AuthContext, PhonePrompt
    checkout/                    — SecurePaymentAnimation, SecurePaymentTransition, PashaBankCard
    landings/                    — LandingRenderer, 9 section types
  store/
    CartContext.tsx               — Cart with localStorage (tapla_cart)
  providers/
    AppProviders.tsx              — CartProvider + AuthProvider
  services/
    db.ts                        — Data service (Supabase → static fallback)
  constants/
    data.ts                      — Static products, reviews, FAQs
  lib/
    tovar-ai/                    — AI card generation (4-stage pipeline)
      types.ts, stage1-vision.ts, stage2-planner.ts, stage3-generate.ts, stage4-qa.ts, pipeline.ts
      design/                    — 11 JSON design libraries
    supabase/                    — client, admin, server, middleware, types, queries, schema.sql
    api/                         — profile.ts, profile-server.ts
    auth.ts                      — JWT auth for admin panel
    actions.ts                   — Server Actions
    utils.ts                     — cn()
    animations.ts                — Framer Motion variants
  types/
    index.ts                     — Product, Review, FAQ, Benefit, etc.
```

## Routes

| Path | Type | Description |
|------|------|-------------|
| `/` | Static | Homepage |
| `/products` | Static | Catalog |
| `/products/{slug}` | SSG | Product detail |
| `/checkout` | Dynamic | Checkout with cart + payment |
| `/collections` | Static | Collections |
| `/admin` | Server | Login + dashboard |
| `/admin/products` | Server | Product CRUD |
| `/admin/orders` | Server | Orders |
| `/admin/tovar-ai` | Client | AI card generation |
| `/api/tovar-ai/generate` | API | POST full pipeline |
| `/api/tovar-ai/regenerate-card` | API | POST single card regen |
| `/api/orders` | API | POST create order |
| Legal pages | Static | 5 pages (return policy, terms, privacy, etc.) |

## Admin Panel

`ADMIN_PASSWORD` from `.env.local` → JWT (jose, httpOnly cookie, 24h).

Files: `src/lib/auth.ts` (Server Actions), `src/app/admin/layout.tsx` (auth check), `src/app/admin/page.tsx` (dashboard).

## Supabase

Connected to: `nzkqorbyexisnbyjhvdf.supabase.co`

Tables: products, landings, media, profiles, orders, order_items, reviews, faqs, collections, collection_products, leads, tovar_ai_generations

**DDL:** `src/lib/supabase/schema.sql` (single source of truth)

**Pattern:** Business logic in TypeScript (`lib/api/`), SQL for structure only.

## Tovar.AI (4-stage pipeline)

See `docs/TOVAR-AI.md` for full documentation.

- Stage 1: Vision analysis (Gemma 4 31B)
- Stage 2: Prompt planner with Brand Identity Lock (Gemini Flash Lite)
- Stage 3: Parallel image generation, 3 cards via Promise.all (Nano Banana 2)
- Stage 4: Quality check (Gemma 4 31B)

## Payment

Pasha Bank via tapla.az gateway. `GATEWAY_BASE_URL=https://tapla.az`, `GATEWAY_API_KEY` shared secret.

## Key Conventions

- `@/` alias → `./src/*`
- framer-motion (not motion/react)
- lucide-react v1.21.0
- Server Actions for admin CRUD
- Cart in localStorage (key: `tapla_cart`)
- Auth: Supabase Auth (customers) + JWT (admin)
