# SHOP.TAPLA.AZ — Architecture

## Stack

- Next.js 16 + React 19
- TypeScript
- Tailwind CSS 4 + shadcn/ui
- Framer Motion
- Supabase (PostgreSQL)

## Project Structure

```
src/
  app/
    layout.tsx            — Root layout (fonts, metadata)
    page.tsx              — Homepage
    not-found.tsx         — 404
    landing/[slug]/       — Landing pages (SSG)
    products/             — Product catalog
    products/[slug]/      — Product detail
    collections/          — Collections
  components/
    ui/                   — shadcn/ui components
    landings/
      sections/           — Landing blocks (9 sections)
        hero.tsx
        benefits.tsx
        ingredients.tsx
        how-to-use.tsx
        before-after.tsx
        testimonials.tsx
        faq.tsx
        offer.tsx
        checkout.tsx
        index.ts
      landing-renderer.tsx — Assembles landing from section config
  landings/
    themes.ts             — 6 theme presets
    registry.ts           — Local landing registry
    {slug}/               — Individual landing modules
      config.ts           — Sections config (JSON-like)
  lib/
    supabase/
      client.ts           — Supabase client
      types.ts            — TypeScript interfaces
      queries.ts          — DB query functions
      migrations/         — SQL migrations
  types/
    index.ts              — Shared types
```

## How Landing Pages Work

Each landing is defined in `src/landings/{slug}/config.ts` as a config object with:

```ts
export const myProductConfig = {
  slug: 'my-product',
  title: 'Product Name',
  subtitle: 'Tagline',
  theme: 'rose', // or any theme name, or custom
  sections: [ /* array of section configs */ ],
}
```

The `LandingRenderer` reads the sections array and renders each block. The `[slug]` page pulls config from the registry and generates static HTML at build time.

## Available Sections

| Section | Component | Props |
|---------|-----------|-------|
| hero | `HeroSection` | description, image, ctaText |
| benefits | `BenefitsSection` | benefits[] ({ title, description }) |
| ingredients | `IngredientsSection` | ingredients[] ({ name, description }) |
| howToUse | `HowToUseSection` | steps[] ({ title, description }) |
| beforeAfter | `BeforeAfterSection` | items[] ({ before, after, label? }) |
| testimonials | `TestimonialsSection` | testimonials[] ({ name, text, rating? }) |
| faq | `FaqSection` | items[] ({ question, answer }) |
| offer | `OfferSection` | price, oldPrice?, features[] |
| checkout | `CheckoutSection` | submitLabel |

## Adding a New Landing

1. Create `src/landings/{slug}/config.ts`
2. Add to `src/landings/registry.ts`
3. Run `npm run build` (auto-generates static page)

OR create custom sections in `src/landings/{slug}/sections/` if the standard blocks don't fit.

## Routes

| Path | Type | Description |
|------|------|-------------|
| `/` | Static | Homepage |
| `/landing/{slug}` | SSG | Product landing |
| `/products` | Static | Catalog |
| `/products/{slug}` | SSG | Product detail |
| `/collections` | Static | Collections |

## Themes

6 presets available — `rose`, `luxuryGold`, `medical`, `minimal`, `organic`, `beautyPremium`.

Each theme defines: colors (primary, secondary, accent, background, etc.), fonts (heading + body), borderRadius.

## Supabase

When connected, data fetches from Supabase tables: `products`, `landings`, `media`, `orders`, `leads`, `collections`, `collection_products`.

Until connected, all data comes from local config files in `src/landings/`.

Run `src/lib/supabase/migrations/001_init.sql` in Supabase SQL Editor after creating the project.
