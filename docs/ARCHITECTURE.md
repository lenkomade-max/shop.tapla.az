# SHOP.TAPLA.AZ — Architecture

## Stack

- **Framework:** Next.js 16.2.9 (App Router) + React 19.2.4
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4 + shadcn/ui (@base-ui/react, class-variance-authority)
- **Animation:** Framer Motion 12.41.0
- **Icons:** lucide-react 1.21.0
- **Database:** Supabase (PostgreSQL 17, `nzkqorbyexisnbyjhvdf.supabase.co`)
- **AI:** OpenRouter (единый API для всех моделей)
- **File storage:** Cloudflare R2 (S3-compatible)
- **Payment:** Pasha Bank (через шлюз tapla.az)
- **Auth (clients):** Supabase Auth (Email + Google OAuth) + Guest
- **Auth (admin):** JWT (jose, httpOnly cookie, 24h)

---

## Архитектурная схема

```
┌─────────────────────────────────────────────────────────────┐
│                    shop.tapla.az (Next.js 16)                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │  Страницы (SSG)  │  │  Dynamic     │  │   API Routes   │  │
│  │  /               │  │  /checkout   │  │   /api/orders  │  │
│  │  /products       │  │  /profile    │  │   /api/tovar-ai│  │
│  │  /product/[slug] │  │  /auth/*     │  │                │  │
│  │  /collections    │  │  /admin/*    │  │                │  │
│  │  /landing/[slug] │  │              │  │                │  │
│  │  /category/[slug]│  │              │  │                │  │
│  │  /about          │  │              │  │                │  │
│  │  Legal (5 стр)   │  │              │  │                │  │
│  └────────┬─────────┘  └──────┬───────┘  └───────┬────────┘  │
│           │                   │                   │           │
│           └───────────────────┼───────────────────┘           │
│                               │                               │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                    Data Layer                           │   │
│  │  ┌──────────────┐  ┌──────────┐  ┌──────────────────┐ │   │
│  │  │  Supabase    │  │  Redis   │  │  R2 (Cloudflare) │ │   │
│  │  │  (PostgreSQL)│  │  (кэш)   │  │  (images/files)  │ │   │
│  │  └──────────────┘  └──────────┘  └──────────────────┘ │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                    External Services                    │   │
│  │  ┌──────────────┐  ┌──────────┐  ┌──────────────────┐ │   │
│  │  │  OpenRouter  │  │Pasha Bank│  │ tapla.az (шлюз)  │ │   │
│  │  │  (AI API)    │  │(mTLS)    │  │ (Vercel)         │ │   │
│  │  └──────────────┘  └──────────┘  └──────────────────┘ │   │
│  └────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Project Structure (src/)

```
src/
├── app/                                    # App Router — все страницы
│   ├── layout.tsx                          # Root: Inter/Poppins, AppProviders, Header, Footer, StickyMobileBar
│   ├── page.tsx                            # Homepage (Hero → Benefits → ProductGrid → Reviews → FAQ)
│   ├── globals.css                         # Tailwind CSS 4 + @base-ui + кастомные стили
│   ├── not-found.tsx                       # 404
│   │
│   ├── about/                              # /about — О компании
│   ├── profile/                            # /profile — Личный кабинет (защищён)
│   ├── products/                           # /products — каталог + /products/[slug] детальная (SSG)
│   ├── checkout/                           # /checkout — 3 способа оплаты
│   ├── collections/                        # /collections — коллекции
│   ├── category/                           # /category/[slug] — страница категории
│   ├── landing/                            # /landing/[slug] — динамический роут лендингов
│   ├── auth/callback/                      # OAuth callback route handler
│   │
│   ├── admin/                              # /admin — админ-панель (JWT auth)
│   │   ├── layout.tsx                      # Auth guard + навигация
│   │   ├── login-form.tsx                  # Форма логина
│   │   ├── page.tsx                        # Дашборд (счётчики)
│   │   ├── products/                       # CRUD товаров
│   │   ├── orders/                         # Управление заказами
│   │   ├── categories/                     # Иерархические категории
│   │   ├── hero/                           # Hero-слайды
│   │   └── tovar-ai/                       # Tovar.AI UI (Drag&Drop, прогресс, результат)
│   │
│   └── api/                                # API Route handlers
│       ├── tovar-ai/generate/route.ts      # POST — полный пайплайн
│       ├── tovar-ai/regenerate-card/route.ts # POST — регенерация 1 карточки
│       └── orders/route.ts                 # POST — создание заказа
│
│   # Legal pages (статические)
│   ├── qaytarma-siyaseti/                  # Возврат
│   ├── satici-muqavilesi/                  # Договор продавца
│   ├── mexfilik-siyaseti/                  # Конфиденциальность
│   ├── istifade-sertleri/                  # Условия использования
│   └── huquqi-melumat/                     # Юридическая информация
│
├── components/
│   ├── ui/                                 # 10+ primitives: Button, Container, Badge, Heading, Section, Input, Modal, Drawer, Accordion, Skeleton, Spinner, Tabs
│   ├── layout/                             # Header, Footer, AnnouncementBar, StickyMobileBar, FacebookPixel
│   ├── cards/                              # ProductCard, ReviewCard
│   ├── sections/                           # Hero, Benefits, ProductGrid, ReviewsSection, FAQ, FeaturesStep, PromoBanners, ValueProps
│   ├── auth/                               # AuthContext, AuthModal, AuthButton, PhonePrompt
│   ├── checkout/                           # SecurePaymentAnimation, SecurePaymentTransition, PashaBankCard
│   └── landings/                           # LandingRenderer + 9 section components (hero, benefits, ingredients, howToUse, beforeAfter, testimonials, faq, offer, checkout)
│
├── landings/                               # Модули лендингов
│   ├── registry.ts                         # Реестр всех лендингов
│   └── themes.ts                           # Темизация (rose, luxuryGold, medical, minimal, organic)
│
├── lib/
│   ├── tovar-ai/                           # Tovar.AI — подсистема генерации карточек
│   │   ├── types.ts                        # Все типы пайплайна
│   │   ├── stage1-vision.ts               # Stage 1: Vision (Gemma 4 31B)
│   │   ├── stage1.5-enricher.ts           # Stage 1.5: Обогащение данных товара
│   │   ├── stage2-planner.ts              # Stage 2: Creative Director (Gemini Flash Lite)
│   │   ├── stage2-planner-v2.ts           # Stage 2 v2: улучшенная версия
│   │   ├── stage3-generate.ts             # Stage 3: Image Generation (Nano Banana 2)
│   │   ├── stage3-generate-kei.ts         # Stage 3: KEI-прокси (альтернативный провайдер)
│   │   ├── stage4-qa.ts                   # Stage 4: Quality Check (Gemma 4 31B)
│   │   ├── stage5-kie-image.ts            # Stage 5: KIE Image (экспериментальный)
│   │   ├── pipeline.ts                    # Оркестратор всех стадий
│   │   ├── index.ts                       # barrel export
│   │   ├── proxy-security.ts              # Безопасность прокси
│   │   ├── vision-to-product.ts           # Конвертация VisionOutput → Product
│   │   └── design/                        # 11 JSON дизайн-библиотек
│   │                                      # (creative-styles, marketing-styles, visual-themes, layouts,
│   │                                      #  positions, backgrounds, composition-rules, marketplace-rules,
│   │                                      #  creative-director, visual-effects, marketing-angles)
│   │
│   ├── supabase/                           # Supabase слой
│   │   ├── client.ts                       # Browser client (singleton, @supabase/ssr)
│   │   ├── server.ts                       # Server client (per-request)
│   │   ├── admin.ts                        # Service role client (Server Actions)
│   │   ├── middleware.ts                   # Cookie refresh + admin guard
│   │   ├── queries.ts                      # Типизированные запросы
│   │   ├── types.ts                        # Database типы
│   │   ├── schema.sql                      # Единый DDL (516 строк, все таблицы)
│   │   └── migrations/                     # Миграции (004_tovar_ai_generations, 005_profiles)
│   │
│   ├── api/                                # Бизнес-логика
│   │   ├── profile.ts                      # Создание/обновление профилей
│   │   └── profile-server.ts               # Server-side профили
│   │
│   ├── auth.ts                             # JWT для админки (jose)
│   ├── actions.ts                          # Server Actions (login, logout, CRUD товаров, submitOrder, updateOrderStatus)
│   ├── utils.ts                            # cn()
│   ├── animations.ts                       # Framer Motion variants
│   ├── category-colors.ts                  # Цвета категорий
│   ├── price-calculator.ts                 # Калькулятор цен
│   ├── fbpixel.ts                          # Facebook Pixel helpers
│   ├── watermark.ts                        # Водяные знаки
│   └── r2/                                 # Cloudflare R2 (S3) upload/download
│
├── providers/
│   └── AppProviders.tsx                    # AuthProvider → CartProvider (иерархия)
│
├── store/
│   └── CartContext.tsx                     # Корзина (localStorage key: tapla_cart)
│
├── services/
│   └── db.ts                               # Data service (Supabase → static fallback)
│
├── types/
│   └── index.ts                            # Product, Review, FAQ, Benefit, Category, NavigationItem, LandingConfig, ThemeConfig, Media, Shade, Feature
│
├── constants/
│   └── data.ts                             # Статические данные: товары, отзывы, FAQ, навигация, VALUE_PROPS
│
└── proxy.ts                                # Прокси-сервер (для dev-разработки)
```

---

## Routes

| Path | Type | Description |
|------|------|-------------|
| `/` | Static | Homepage |
| `/products` | Static | Catalog |
| `/products/{slug}` | SSG | Product detail with `generateStaticParams` + `generateMetadata` |
| `/checkout` | Dynamic | Checkout (3 payment methods) |
| `/collections` | Static | Collections |
| `/about` | Static | About page |
| `/profile` | Dynamic | Profile (auth-protected) |
| `/landing/{slug}` | SSG | Landing page (via LandingRenderer) |
| `/category/{slug}` | SSG | Category page |
| `/auth/callback` | Dynamic | OAuth callback |
| `/admin` | Server | Login + dashboard |
| `/admin/products` | Server | CRUD |
| `/admin/products/new` | Server | Create product |
| `/admin/products/{id}/edit` | Server | Edit product |
| `/admin/orders` | Server | Order management |
| `/admin/categories` | Server | Category tree |
| `/admin/hero` | Server | Hero slide management |
| `/admin/tovar-ai` | Client | AI card generation UI |
| `/api/tovar-ai/generate` | API | POST — full pipeline |
| `/api/tovar-ai/regenerate-card` | API | POST — single card regen |
| `/api/orders` | API | POST — create order |
| Legal pages | Static | `/qaytarma-siyaseti`, `/satici-muqavilesi`, `/mexfilik-siyaseti`, `/istifade-sertleri`, `/huquqi-melumat` |

---

## Admin Panel

**Auth:** `ADMIN_PASSWORD` from `.env.local` → JWT (jose, httpOnly cookie, 24h).

```
admin/layout.tsx           — Auth guard + nav (Products, Orders, Tovar.AI, Categories, Hero)
admin/login-form.tsx       — Password form
admin/page.tsx             — Dashboard (product count, order count)
admin/products/            — CRUD (list, create, edit forms)
admin/orders/              — Order list + status selector
admin/categories/          — Category tree (parent/child, sort, status)
admin/hero/                — Hero slides CRUD
admin/tovar-ai/            — AI card generation UI (Drag&Drop, progress, preview, download)
```

**Server Actions** (in `lib/actions.ts`):
- `loginAction`, `logoutAction` — JWT auth
- `createProductAction`, `updateProductAction`, `deleteProductAction` — CRUD
- `submitOrder`, `updateOrderStatus` — Orders
- `createCategoryAction`, `updateCategoryAction`, `deleteCategoryAction` — Categories

---

## Auth System (Clients)

Based on Supabase Auth (email + Google OAuth). See `docs/AUTH_PLAN.md` for full detail.

**Files:**
- `lib/supabase/client.ts` — Browser client (singleton, @supabase/ssr)
- `lib/supabase/server.ts` — Server client (per-request, cookies())
- `lib/supabase/middleware.ts` — Cookie refresh + admin guard (/admin/*)
- `components/auth/AuthContext.tsx` — React Context (user, profile, signOut, openLogin)
- `components/auth/AuthModal.tsx` — Login/Register modal (email + Google)
- `components/auth/AuthButton.tsx` — Header login button / avatar dropdown
- `components/auth/PhonePrompt.tsx` — Phone collection after Google auth
- `providers/AppProviders.tsx` — AuthProvider → CartProvider

**Guest Checkout:** No auth required. Profile created on submitOrder by phone.

---

## Tovar.AI (4+ stage pipeline)

See `docs/TOVAR-AI.md` for full documentation.  
See `docs/DESIGN-SYSTEM-MAP.md` for design libraries, triads, palettes.

**Pipeline:**
1. **Stage 1 — Vision:** `google/gemma-4-31b-it` — анализирует фото, извлекает 25+ полей
2. **Stage 1.5 — Enricher:** обогащает данные товара (features, use cases, ideal for)
3. **Stage 2 — Planner:** `google/gemini-3.1-flash-lite` — 7 триад, Brand Identity Lock, 12 композиций
4. **Stage 3 — Generate:** `google/gemini-3.1-flash-image-preview` (Nano Banana 2) — Promise.all, 3 параллельных
5. **Stage 4 — QA:** `google/gemma-4-31b-it` — 5 проверок, score 0-100
6. **Stage 5 — KIE Image (экспериментальный)**

**Design libraries:** 11 JSON-файлов в `lib/tovar-ai/design/`

---

## Payment System

Pasha Bank via tapla.az gateway (отдельный Next.js проект на Vercel).

**Flow:**
1. Checkout → `submitOrder()` with `payment_method='online_card'`
2. POST `tapla.az/api/payments/pasha/create` (mTLS, GATEWAY_API_KEY)
3. Gateway creates transaction → returns `redirectUrl`
4. Browser redirects to Pasha Bank → user enters card
5. Callback → `orders.status = 'paid'`
6. Return to `shop.tapla.az/checkout/success`

**3 payment methods:** cash_delivery, card_delivery, online_card

---

## Supabase

**Connected to:** `nzkqorbyexisnbyjhvdf.supabase.co`

### Tables

| Table | Purpose |
|-------|---------|
| `products` | Товары (поля: slug, name, price, images JSONB, shades JSONB, etc.) |
| `categories` | Иерархические категории (parent_id, sort_order) |
| `orders` | Заказы (profile_id, auth_user_id, payment_method, status) |
| `order_items` | Позиции заказа |
| `profiles` | Профили клиентов (auth_user_id, phone UNIQUE, is_guest, role) |
| `reviews` | Отзывы с рейтингом |
| `faqs` | Часто задаваемые вопросы |
| `landings` | Лендинги (sections JSONB, theme, status) |
| `media` | Медиа-файлы |
| `collections` | Коллекции товаров |
| `collection_products` | Связь коллекция-товар |
| `leads` | Лиды |
| `tovar_ai_generations` | Генерации карточек Tovar.AI |
| `user_cart` | Корзина на сервере (для авторизованных) |
| `hero_slides` | Слайды Hero (title, subtitle, image, link) |

**DDL:** `src/lib/supabase/schema.sql` — единый источник истины (516 строк).

**Pattern:** Business logic in TypeScript (`lib/api/`, `lib/actions.ts`), SQL only for structure.

---

## Landing System

9 типов секций: hero, benefits, ingredients, howToUse, beforeAfter, testimonials, faq, offer, checkout.

**Files:**
- `components/landings/LandingRenderer.tsx` — рендерит секции по конфигу
- `components/landings/` — компоненты для каждого типа секции
- `landings/registry.ts` — реестр всех лендингов
- `landings/themes.ts` — 5 тем (rose, luxuryGold, medical, minimal, organic)
- `app/landing/[slug]/page.tsx` — динамический роут

**Usage:** Создать `landings/{slug}/config.ts` + опционально `sections/`, зарегистрировать в `registry.ts`.

See `docs/LANDING-STANDARD.md` for full guide.

---

## Key Conventions

| Convention | Rule |
|-----------|------|
| `@/` alias | `./src/*` |
| Animation | framer-motion (not motion/react), v12 |
| Icons | lucide-react v1.21.0 |
| Admin CRUD | Server Actions (not API routes) |
| Cart | localStorage (key: `tapla_cart`) |
| Customer Auth | Supabase Auth (Email + Google OAuth) |
| Admin Auth | JWT (jose, httpOnly cookie) |
| Database | SQL for schema, TypeScript for business logic |
| Static data | `constants/data.ts` (fallback when Supabase unavailable) |
| UI primitives | shadcn/ui (@base-ui/react) |
| Styling | Tailwind CSS 4 + `cn()` |
| Checkout DB | Profiles created by phone, guest orders supported |

---

## External Services

| Service | Purpose | Integration |
|---------|---------|-------------|
| Supabase | PostgreSQL + Auth | `lib/supabase/*` |
| OpenRouter | AI API (Tovar.AI) | `lib/tovar-ai/*`, env: `OPENROUTER_API_KEY` |
| Pasha Bank | Online payments | Via tapla.az gateway |
| Cloudflare R2 | File storage (images) | `lib/r2/*`, env: `R2_*` |
| Vercel | Hosting + deployment | Auto-deploy from GitHub |
| tapla.az | Payment gateway proxy | `GATEWAY_BASE_URL`, `GATEWAY_API_KEY` |
| Facebook Pixel | Analytics | `FB_PIXEL_ID = '1880811039970349'` |

---

## Environment Variables (.env.local)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://nzkqorbyexisnbyjhvdf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SECRET_KEY=sb_secret_...

# Admin
ADMIN_PASSWORD=...

# OpenRouter (Tovar.AI)
OPENROUTER_API_KEY=sk-or-v1-...

# Pasha Bank Gateway
GATEWAY_API_KEY=...
GATEWAY_BASE_URL=https://tapla.az

# R2 (Cloudflare)
R2_ENDPOINT=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=tapla-shop-images

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
```

---

## Build & Deploy

```bash
npm run dev        # Dev server :3000
npm run build      # SSG (generateStaticParams for all static pages)
npm run lint       # ESLint
npm run start      # Production server :3000
```

Deployed on **Vercel** (project: `shop-tapla-az`), auto-deploy from GitHub.
