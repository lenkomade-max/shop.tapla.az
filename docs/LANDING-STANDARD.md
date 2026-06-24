# LANDING STANDARD — Prompt for AI Agents

> Используй этот стандарт, когда создаёшь новый товарный лендинг для shop.tapla.az.
> Твоя задача — создать независимый лендинг-модуль внутри существующего Next.js проекта.
> **У тебя полная творческая свобода: цвета, шрифты, дизайн, анимации — без ограничений.**

---

## 0. Tech Stack

Проект использует:

| Технология | Причина |
|------------|---------|
| **Next.js 16** (App Router) | Роутинг, Server Components, SSG |
| **React 19** | UI |
| **TypeScript** | Типизация |
| **Tailwind CSS 4** | Стили (утилитарные классы) |
| **shadcn/ui** | Базовые UI-компоненты (Button и т.д.) |
| **Framer Motion** | Анимации (framer-motion) |
| **Lucide React** | Иконки (lucide-react) |
| **clsx + tailwind-merge** | Утилиты для классов (cn()) |

Импорты — через алиас `@/`:
```ts
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
```

Для кастомных секций используй `'use client'` (если нужны хуки/анимации/состояние).

---

## 1. Структура модуля

Создай папку `src/landings/{slug}/` с файлами:

```
src/landings/{slug}/
  ├── config.ts          — Обязательно. Конфиг секций лендинга
  └── sections/          — Опционально. Кастомные секции (если стандартных недостаточно)
```

## 2. config.ts — формат

```ts
import type { SectionConfig } from '@/types'

export const myProductConfig = {
  slug: 'my-product',          // URL: /landing/my-product
  title: 'Название продукта',   // H1, мета-тайтл
  subtitle: 'Короткий слоган',  // Подзаголовок
  theme: 'rose',               // Любая тема из themes.ts ИЛИ 'custom'
  sections: [
    {
      name: 'hero',
      title: 'Бестселлер',
      subtitle: 'Ограниченное предложение',
      props: {
        // УНИКАЛЬНЫЙ ДИЗАЙН НА ТВОЁ УСМОТРЕНИЕ
      },
    },
    // ... остальные секции
  ] satisfies SectionConfig[],
}
```

## 3. Доступные стандартные секции

| name | props | Когда использовать |
|------|-------|-------------------|
| `hero` | `description`, `image`, `ctaText` | Главный экран с заголовком |
| `benefits` | `benefits[]` ({ title, description }) | Список преимуществ |
| `ingredients` | `ingredients[]` ({ name, description }) | Состав / ингредиенты |
| `howToUse` | `steps[]` ({ title, description }) | Инструкция по применению |
| `beforeAfter` | `items[]` ({ before, after, label? }) | До/после результаты |
| `testimonials` | `testimonials[]` ({ name, text, rating? }) | Отзывы клиентов |
| `faq` | `items[]` ({ question, answer }) | Частые вопросы |
| `offer` | `price`, `oldPrice?`, `features[]` | Блок с ценой и УТП |
| `checkout` | `submitLabel?` | Форма заказа |

## 4. Свобода творчества

- **НЕТ ограничений по цветам** — используй любые цвета, градиенты, фон
- **НЕТ ограничений по шрифтам** — подключай любые Google Fonts
- **НЕТ ограничений по layout** — добавляй свои секции, меняй порядок, создавай уникальную структуру
- **Можно делать кастомные секции** — если стандартные блоки не подходят, создавай свои в `sections/`
- **Можно кастомизировать стандартные секции** — через `props` можно передать любые данные

## 5. Если стандартных секций недостаточно

Создай свою секцию в `src/landings/{slug}/sections/`:

```tsx
// src/landings/my-product/sections/my-custom-block.tsx
'use client'

export function MyCustomBlock({ data }: { data: any }) {
  return (
    <section className="...">
      {/* Твой уникальный дизайн */}
    </section>
  )
}
```

Затем импортируй и используй в `config.ts`:

```ts
{
  name: 'custom',
  props: { component: 'my-custom-block', ... },
}
```

## 6. Регистрация лендинга

После создания модуля — зарегистрируй его в `src/landings/registry.ts`:

```ts
import { myProductConfig } from './my-product/config'

// Добавь в объект localLandings:
'my-product': {
  slug: myProductConfig.slug,
  title: myProductConfig.title,
  subtitle: myProductConfig.subtitle,
  theme: myProductConfig.theme,
  sections: myProductConfig.sections,
}
```

## 7. После завершения

1. Запусти `npm run build` в корне проекта
2. Убедись что нет ошибок TypeScript
3. Страница будет доступна по адресу `/landing/{slug}`

---

**Главное правило: создавай уникальный, продающий дизайн без каких-либо рамок.**
Каждый лендинг должен выглядеть как отдельный премиальный сайт.
