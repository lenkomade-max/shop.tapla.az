@AGENTS.md

# shop.tapla.az — карта знаний

**Стек:** Next.js 16 + React 19 + TS + Tailwind 4 + shadcn/ui + Framer Motion + Supabase + OpenRouter

**Домен:** shop.tapla.az (маркетплейс электроники, Азербайджан)

---

## Документация (читать сначала)

| Файл | О чём |
|------|-------|
| `docs/ARCHITECTURE.md` | Архитектура: структура, роуты, подсистемы, Supabase, деплой |
| `docs/TOVAR-AI.md` | Tovar.AI: 4-стадийный пайплайн генерации карточек |
| `docs/DESIGN-SYSTEM-MAP.md` | Дизайн-система Tovar.AI: триады, библиотеки, палитры |
| `docs/AUTH.md` | Аутентификация: клиенты (Supabase Auth), админ (JWT), Guest Checkout |
| `docs/LANDING-STANDARD.md` | Стандарт создания лендингов |

## Команды

```bash
npm run dev      # :3000
npm run build    # SSG
npm run lint     # ESLint
```

## Структура (src/)

```
src/
  app/                    — Страницы App Router
  components/             — UI, layout, sections, auth, checkout, landings
  lib/                    — tovar-ai/, supabase/, actions.ts, auth.ts, r2/
  landings/               — registry.ts, themes.ts
  providers/              — AppProviders (Auth → Cart)
  store/                  — CartContext (localStorage tapla_cart)
  services/               — db.ts (Supabase → static fallback)
  types/                  — Product, Review, FAQ, Category...
  constants/              — data.ts (статичные товары, отзывы, FAQ)
```

## Маршруты

| Путь | Описание |
|------|----------|
| `/` | Homepage |
| `/products` / `/products/{slug}` | Каталог / Детальная (SSG) |
| `/checkout` | Чекаут (3 способа оплаты) |
| `/collections` | Коллекции |
| `/about` | О нас |
| `/profile` | Профиль (защищён) |
| `/landing/{slug}` | Лендинги |
| `/category/{slug}` | Категории |
| `/admin/*` | Админка (JWT) |
| Legal | `/qaytarma-siyaseti`, `/satici-muqavilesi`, `/mexfilik-siyaseti`, `/istifade-sertleri`, `/huquqi-melumat` |

## Подсистемы

- **Tovar.AI** — AI-генерация карточек (4+ стадии, OpenRouter) → `docs/TOVAR-AI.md`
- **Auth** — Supabase Auth (Email/Google) + JWT админка → `docs/AUTH.md`
- **Checkout** — 3 способа, Pasha Bank через tapla.az gateway
- **Landing System** — модульные лендинги, 9 типов секций
- **Admin** — CRUD товаров/заказов/категорий, Tovar.AI UI, Hero-слайды

## Supabase

`nzkqorbyexisnbyjhvdf.supabase.co` | DDL: `src/lib/supabase/schema.sql`

**Таблицы:** products, categories, orders, order_items, profiles, reviews, faqs, landings, media, collections, collection_products, leads, tovar_ai_generations, hero_slides

## .env.local (нужное)

```env
NEXT_PUBLIC_SUPABASE_URL / ANON_KEY
SUPABASE_SECRET_KEY
ADMIN_PASSWORD
OPENROUTER_API_KEY
GATEWAY_API_KEY / GATEWAY_BASE_URL
R2_ENDPOINT / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY / R2_BUCKET_NAME
```
