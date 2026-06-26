@AGENTS.md

# shop.tapla.az — Интернет-магазин (Beauty & Wellness)

**Стек:** Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui + Framer Motion + Supabase

**Домен:** shop.tapla.az (Азербайджан, товары красоты)

---

## Документация (обязательна к прочтению)

| Файл | О чём |
|------|-------|
| `docs/ARCHITECTURE.md` | Полная архитектура: структура, роуты, темы, как работают лендинги |
| `docs/LANDING-STANDARD.md` | Стандарт создания лендингов. **Читать перед созданием нового лендинга** |

Оба файла — основной источник истины.

---

## Быстрый старт

```bash
npm run dev       # dev-сервер :3000
npm run build     # SSG + проверка TypeScript
npm run lint      # ESLint
```

---

## Структура проекта

```
src/
  app/
    layout.tsx                    — Root layout (Inter, мета-теги)
    page.tsx                      — Главная (ссылки на лендинги)
    not-found.tsx                 — 404
    landing/[slug]/page.tsx       — SSG лендинги (из registry.ts)
    landing/essential-lash-serum/ — Отдельная кастомная страница (full custom)
    products/page.tsx             — Каталог
    products/[slug]/page.tsx      — Детальная товара
    collections/page.tsx          — Коллекции
    collections/[slug]/page.tsx   — Детальная коллекции
    api/orders/route.ts           — API заказов
  components/
    ui/                           — shadcn/ui компоненты
    landings/
      landing-renderer.tsx        — Сборщик лендинга из конфига
      sections/                   — 9 стандартных блоков (hero, benefits, ingredients...)
  landings/
    themes.ts                     — 6 тем: rose, luxuryGold, medical, minimal, organic, beautyPremium
    registry.ts                   — Реестр лендингов (локальные, без Supabase)
    {slug}/config.ts              — Конфиг секций для лендинга
    {slug}/sections/              — Кастомные секции (опционально)
  lib/
    utils.ts                      — cn() (clsx + tailwind-merge)
    animations.ts                 — Framer Motion варианты (fadeIn, staggerContainer, scaleIn)
    supabase/
      client.ts                   — Supabase клиент (анонимный)
      admin.ts                    — Supabase admin (service_role)
      types.ts                    — TypeScript интерфейсы (Product, Landing, Order, Lead...)
      queries.ts                  — Функции запросов (getLandingBySlug, createOrder...)
      migrations/001_init.sql     — Схема БД
  types/
    index.ts                      — SectionConfig, ThemeConfig, SectionName
```

## Роуты

| Путь | Тип | Описание |
|------|-----|----------|
| `/` | Static | Главная со ссылками на продукты |
| `/landing/{slug}` | SSG | Лендинг товара (из registry.ts) |
| `/landing/essential-lash-serum` | Static* | Полностью кастомный лендинг (своя page.tsx) |
| `/products` | Static | Каталог |
| `/products/{slug}` | SSG | Детальная товара |
| `/collections` | Static | Коллекции |
| `/collections/{slug}` | SSG | Детальная коллекции |
| `/api/orders` | API | Создание заказа (POST) |

## Архитектура лендингов

**Два подхода:**

1. **Через конфиг** — `src/landings/{slug}/config.ts` + `[slug]/page.tsx` (SSG, 9 стандартных секций)
2. **Полностью кастомная** — своя `app/landing/{slug}/page.tsx` (essential-lash-serum)

После создания лендинга — зарегистрировать в `src/landings/registry.ts`.

## 9 стандартных секций

hero, benefits, ingredients, howToUse, beforeAfter, testimonials, faq, offer, checkout

## Темы

6 пресетов: rose, luxuryGold, medical, minimal, organic, beautyPremium

## Supabase

Таблицы: products, landings, media, orders, leads, collections, collection_products

`.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SECRET_KEY=...
```

Без подключения — данные из локальных конфигов.

## Добавление нового лендинга

1. Создать `src/landings/{slug}/config.ts`
2. Добавить в `src/landings/registry.ts`
3. При необходимости — кастомные секции в `{slug}/sections/`
4. `npm run build` — проверка

## Новый лендинг (через AI)

Используй `docs/LANDING-STANDARD.md` как промпт для AI-агента.
