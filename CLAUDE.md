@AGENTS.md

# shop.tapla.az — TAPLA MARKETPLACE (Электроника)

**Стек:** Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui + Framer Motion + Supabase

**Домен:** shop.tapla.az (Азербайджан, маркетплейс электроники)

**Бренд:** TAPLA MARKETPLACE — ноутбуки, смартфоны, планшеты, аксессуары

---

## Документация (обязательна к прочтению)

| Файл | О чём |
|------|-------|
| `docs/ARCHITECTURE.md` | Полная архитектура: структура, роуты, темы, секции, Supabase |

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
    page.tsx                      — Homepage (Hero → ProductGrid → ValueProps → ... → FAQ)
    not-found.tsx                 — 404
    products/
      page.tsx                    — Каталог
      [slug]/page.tsx             — Детальная с generateStaticParams + generateMetadata
      [slug]/ProductClient.tsx    — Клиентский компонент продукта
    checkout/page.tsx             — Чекаут с корзиной и оплатой
    collections/                  — Коллекции (v1)
    api/orders/route.ts           — API заказов (v1)
  components/
    ui/                           — Button, Container, Badge, Heading, Section, Input, Modal, Drawer, Accordion
    layout/                       — Header, Footer, AnnouncementBar, StickyMobileBar
    cards/                        — ProductCard, ReviewCard
    sections/                     — Hero, ProductGrid, ValueProps, FeaturesStep, PromoBanners, Benefits, ReviewsSection, FAQ
    landings/                     — (удалено, не используется)
  store/
    CartContext.tsx               — Корзина с localStorage (key: tapla_cart)
  providers/
    AppProviders.tsx              — CartProvider wrapper
  services/
    db.ts                         — Data service: Supabase → static fallback
  constants/
    data.ts                       — 4 electronics products, reviews, FAQs, steps, benefits
  lib/
    supabase/                     — client, admin, types, queries, migrations
    utils.ts                      — cn()
    animations.ts                 — Framer Motion variants
  types/
    index.ts                      — Product types + marketplace types
```

## Роуты (полные)

| Путь | Тип | Описание |
|------|-----|----------|
| `/` | Static | Homepage TAPLA MARKETPLACE (8 секций) |
| `/products` | Static | Каталог |
| `/products/{slug}` | SSG | Детальная товара |
| `/checkout` | Dynamic | Чекаут с корзиной и онлайн-оплатой |
| `/collections` | Static | Коллекции |
| `/collections/{slug}` | SSG | Детальная коллекции |
| `/api/orders` | API | POST create order |

## Секции главной

| Секция | Файл | Особенности |
|--------|------|-------------|
| Hero | `Hero.tsx` | 3 слайда, авто-ротация 6с, framer-motion |
| ProductGrid | `ProductGrid.tsx` | Фильтр по категориям, QuickView модалка |
| ValueProps | `ValueProps.tsx` | Тест подбора товара, сравнение, AI чат, поддержка |
| FeaturesStep | `FeaturesStep.tsx` | 4 шага покупки, интерактивный deck |
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
- **v2:** products, reviews, faqs (TAPLA MARKETPLACE data)

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
