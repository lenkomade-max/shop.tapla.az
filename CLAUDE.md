@AGENTS.md

# shop.tapla.az — TAPLA MARKETPLACE (E-commerce)

**Стек:** Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui + Framer Motion + Supabase

**Домен:** shop.tapla.az (Азербайджан, маркетплейс)

---

## Документация (обязательна к прочтению)

| Файл | О чём |
|------|-------|
| `docs/ARCHITECTURE.md` | Полная архитектура: структура, роуты, темы, секции, Supabase |
| `docs/TOVAR-AI.md` | Tovar.AI — система AI-генерации карточек товаров (4 стадии) |

---

## Быстрый старт

```bash
npm run dev       # dev-сервер :3000
npm run build     # SSG + TypeScript check
npm run lint      # ESLint
```

---

## Архитектура проекта

```
src/
  app/
    layout.tsx                  — Root layout (Inter, AppProviders, Header, Footer, StickyMobileBar)
    page.tsx                    — Homepage (Hero → ProductGrid → Reviews → FAQ)
    not-found.tsx               — 404
    products/
      page.tsx                  — Каталог
      [slug]/page.tsx           — Детальная с generateStaticParams + generateMetadata
      [slug]/ProductClient.tsx  — Клиентский компонент продукта
    checkout/page.tsx           — Чекаут с корзиной и оплатой (3 способа: наличные, карта курьеру, online)
    collections/                — Коллекции
    admin/                      — Админ-панель (JWT auth)
      tovar-ai/page.tsx         — UI генерации карточек (Drag&Drop фото, прогресс, результат)
    api/
      tovar-ai/generate/route.ts        — POST запуск пайплайна
      tovar-ai/regenerate-card/route.ts — POST перегенерация одной карточки
  components/
    ui/                         — Button, Container, Badge, Heading, Section, Input, Modal, Drawer, Accordion
    layout/                     — Header, Footer, AnnouncementBar, StickyMobileBar
    cards/                      — ProductCard, ReviewCard
    auth/                       — AuthModal, AuthButton, AuthContext, PhonePrompt
    checkout/                   — SecurePaymentAnimation, SecurePaymentTransition, PashaBankCard
    landings/                   — landing-renderer, 9 секций (hero, benefits, ingredients, etc.)
  store/
    CartContext.tsx              — Корзина с localStorage (key: tapla_cart)
  providers/
    AppProviders.tsx             — CartProvider + AuthProvider wrapper
  services/
    db.ts                        — Data service: Supabase → static fallback
  constants/
    data.ts                      — Статические продукты, отзывы, FAQ
  lib/
    tovar-ai/                    — **AI subsystem (4-stage pipeline)**
      types.ts                   — Все типы (VisionOutput, CardPrompt, PromptsOutput, CardResult, QAResult)
      stage1-vision.ts           — Stage 1: Vision анализ фото (Gemma 4 31B / GPT-4o-mini)
      stage2-planner.ts          — Stage 2: Creative Director — 7 триад ролей, 12 композиций, дизайн-библиотеки
      stage3-generate.ts         — Stage 3: Параллельная генерация (Nano Banana 2, Promise.all)
      stage4-qa.ts               — Stage 4: Quality Check (Vision-модель, 5 проверок)
      pipeline.ts                — Оркестратор 4 стадий с callbacks
      index.ts                   — barrel export
      design/                    — Дизайн-библиотеки (11 JSON-файлов)
    supabase/                    — client, admin, server, middleware, types, queries, schema.sql
    api/                         — profile.ts, profile-server.ts
    auth.ts                      — JWT авторизация админки (jose, httpOnly cookie, 24ч)
    actions.ts                   — Server Actions (login, logout, CRUD товаров, submitOrder, updateOrderStatus)
    utils.ts                     — cn()
    animations.ts                — Framer Motion variants
  types/
    index.ts                     — Product, Review, FAQ, Benefit, LandingConfig, ThemeConfig
```

---

## Роуты (полные)

| Путь | Тип | Описание |
|------|-----|----------|
| `/` | Static | Homepage TAPLA MARKETPLACE |
| `/products` | Static | Каталог |
| `/products/{slug}` | SSG | Детальная товара |
| `/checkout` | Dynamic | Чекаут с корзиной (3 способа оплаты) |
| `/collections` | Static | Коллекции |
| `/admin` | Server | Админ-панель (логин + дашборд) |
| `/admin/products` | Server | CRUD товаров |
| `/admin/orders` | Server | Заказы со сменой статуса |
| `/admin/tovar-ai` | Client | Tovar.AI: генерация карточек |
| `/api/tovar-ai/generate` | API | POST — полный пайплайн |
| `/api/tovar-ai/regenerate-card` | API | POST — регенерация одной карточки |
| `/api/orders` | API | POST — создание заказа |
| Legal pages | Static | `/qaytarma-siyaseti`, `/satici-muqavilesi`, `/mexfilik-siyaseti`, `/istifade-sertleri`, `/huquqi-melumat` |

---

## Платёжная система (Pasha Bank)

Оплата через **tapla.az** (отдельный Next.js проект на Vercel, платёжный шлюз).

1. Чекаут → `submitOrder()` → если `online_card` → `POST tapla.az/api/payments/pasha/create`
2. Шлюз создаёт транзакцию (mTLS), возвращает `redirectUrl`
3. Браузер редиректится в Pasha Bank — пользователь вводит карту
4. Callback → `orders.status = 'paid'`
5. Возврат на `shop.tapla.az/checkout/success`

### Vercel env vars

```
GATEWAY_API_KEY=<общий секрет с tapla.az>
GATEWAY_BASE_URL=https://tapla.az
```

---

## Админ-панель

Авторизация: `ADMIN_PASSWORD` из `.env.local` → JWT (jose), httpOnly cookie, 24ч.

Файлы: `src/lib/auth.ts`, `src/app/admin/layout.tsx` (проверка auth), `src/app/admin/page.tsx` (дашборд).

CRUD товаров: `src/app/admin/products/*` (Server Actions в `lib/actions.ts`).

Заказы: `/admin/orders` — список + select смена статуса.

---

## Supabase

Подключена: `nzkqorbyexisnbyjhvdf.supabase.co`

Таблицы: products, landings, media, profiles, orders, order_items, reviews, faqs, collections, collection_products, leads

**Единый DDL:** `src/lib/supabase/schema.sql` (293 строки, все CREATE TABLE + индексы + RLS)

**Паттерн:** бизнес-логика в TypeScript (`lib/api/`), SQL только для структуры.

---

## Сборка и деплой

```bash
npm run build     # SSG — генерирует все статические страницы
npm run dev       # dev-сервер :3000
```

---

## PM2 (если запущено локально)

```bash
# В корне Mac-Server
pm2 list | grep shop
# Перезапуск после изменений
pm2 restart shop.tapla.az
```
