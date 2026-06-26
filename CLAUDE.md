@AGENTS.md

# shop.tapla.az — Интернет-магазин (Beauty & Wellness)

**Стек:** Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui + Framer Motion + Supabase

**Домен:** shop.tapla.az (Азербайджан, товары красоты)

**Бренды:** TAPLA (оригинальные лендинги) + **ALUNA** (премиум skincare UI, интегрирован из shop.taplaaz-v2)

---

## Документация (обязательна к прочтению)

| Файл | О чём |
|------|-------|
| `docs/ARCHITECTURE.md` | Полная архитектура: структура, роуты, темы, Aluna-секции, Supabase |
| `docs/LANDING-STANDARD.md` | Стандарт создания лендингов. **Читать перед созданием нового лендинга** |

---

## Быстрый старт

```bash
npm run dev       # dev-сервер :3000
npm run build     # SSG + TypeScript check
npm run lint      # ESLint
```

---

## Структура проекта

```
src/
  app/
    layout.tsx                    — Root layout (Inter, AppProviders, Header, Footer, StickyMobileBar)
    page.tsx                      — Aluna homepage (Hero → ProductGrid → ValueProps → ... → FAQ)
    not-found.tsx                 — 404
    landing/[slug]/               — SSG лендинги (v1, registry.ts)
    products/
      page.tsx                    — Каталог
      [slug]/page.tsx             — Детальная с generateStaticParams + generateMetadata
      [slug]/ProductClient.tsx    — Клиентский компонент продукта (Aluna)
    checkout/page.tsx             — Чекаут с корзиной и оплатой (Aluna)
    collections/                  — Коллекции (v1)
    api/orders/route.ts           — API заказов (v1)
  components/
    ui/                           — Button, Container, Badge, Heading, Section, Input, Modal, Drawer, Accordion
    layout/                       — Header, Footer, AnnouncementBar, StickyMobileBar (Aluna)
    cards/                        — ProductCard, ReviewCard (Aluna)
    sections/                     — Hero, ProductGrid, ValueProps, FeaturesStep, PromoBanners, Benefits, ReviewsSection, FAQ
    landings/                     — v1 landing system (landing-renderer, 9 sections)
  landings/                       — v1 themes, registry, configs
  store/
    CartContext.tsx               — Корзина с localStorage (Aluna)
  providers/
    AppProviders.tsx              — CartProvider wrapper
  services/
    db.ts                         — Data service: Supabase → static fallback
  constants/
    data.ts                       — Aluna: 4 products, 4 reviews, 5 FAQs, 4 ritual steps, 4 benefits
  lib/
    supabase/                     — client, admin, types, queries, migrations
    utils.ts                      — cn()
    animations.ts                 — Framer Motion variants
  types/
    index.ts                      — v1 + v2 Aluna types
```

## Роуты (полные)

| Путь | Тип | Описание |
|------|-----|----------|
| `/` | Static | Aluna homepage (8 секций) |
| `/landing/{slug}` | SSG | Лендинг товара (v1) |
| `/products` | Static | Каталог (v1) |
| `/products/{slug}` | SSG | Детальная товара (Aluna data, v1 fallback) |
| `/checkout` | Dynamic | Чекаут (Aluna, корзина + онлайн-оплата) |
| `/collections` | Static | Коллекции (v1) |
| `/collections/{slug}` | SSG | Детальная коллекции (v1) |
| `/api/orders` | API | POST create order (v1) |

## Aluna Premium Секции

| Секция | Файл | Особенности |
|--------|------|-------------|
| Hero | `Hero.tsx` | 3 слайда, авто-ротация 6с, framer-motion |
| ProductGrid | `ProductGrid.tsx` | Фильтр по категориям, QuickView модалка |
| ValueProps | `ValueProps.tsx` | Тест кожи, сравнение, AI чат, консультация |
| FeaturesStep | `FeaturesStep.tsx` | 4-шаговый ритуал, интерактивный deck |
| PromoBanners | `PromoBanners.tsx` | Dual banners + spotlight + category grid |
| Benefits | `Benefits.tsx` | 4 колонки с иконками |
| ReviewsSection | `ReviewsSection.tsx` | Snapshot 5.0, фильтры, форма отзыва |
| FAQ | `FAQ.tsx` | Поиск, accordion, контакты WhatsApp/Phone/Email |

## Ключевые решения интеграции

- **framer-motion** вместо `motion/react` (та же API)
- **lucide-react** v1.21.0 — соц-иконки: Globe, ExternalLink, CirclePlay
- Импорты: `@/components/ui/...` вместо `../ui/...`
- `[id]` → `[slug]` (чтобы избежать conflict в Next.js)
- Supabase: lazy init отменён, `supabase` всегда non-null, fallback через try/catch

## Supabase

Подключена: `nzkqorbyexisnbyjhvdf.supabase.co`

Таблицы:
- **v1:** products, landings, media, orders, leads, collections, collection_products
- **v2 (Aluna):** products, reviews, faqs

Данные: `services/db.ts` → пробует Supabase → падает на `constants/data.ts`

## Админ-панель

| Роут | Описание |
|------|---------|
| `/admin` | Логин (пароль из `ADMIN_PASSWORD`) + дашборд |
| `/admin/products` | Список товаров |
| `/admin/products/new` | Создание товара |
| `/admin/products/[id]/edit` | Редактирование |
| `/admin/orders` | Заказы со сменой статуса |

Авторизация: JWT (jose), httpOnly cookie, 24ч.

## Сборка

```bash
npm run build     # SSG — генерирует все страницы
npm run dev       # dev-сервер
```
