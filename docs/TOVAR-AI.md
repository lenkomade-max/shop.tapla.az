# Tovar.AI — AI генерация карточек товаров

## Обзор

Tovar.AI — подсистема автоматической генерации профессиональных продающих карточек товаров для маркетплейса TAPLA на основе одной исходной фотографии товара.

**Pipeline:** 4 стадии → от фото до 3 готовых карточек за ~30-60 сек.

**Стек:** OpenRouter (единый API), модели заменяются через конфиг.

---

## Архитектура (4 стадии)

```
Фото товара (Base64)
       │
       ▼
┌─────────────────────────────────────┐
│ STAGE 1: Vision Analysis            │
│ Gemma 4 31B / GPT-4o-mini           │
│ Извлекает: тип, цвет, материал,     │
│ форму, функции, сценарии,           │
│ комплектацию, бренд, premium-уровень │
│ Выход: VisionOutput (JSON)          │
└─────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ STAGE 2: Creative Director          │
│ Gemini 3.1 Flash Lite / GPT-4o      │
│ Выбирает: триаду ролей, палитру,    │
│ визуальную тему, creative стили,    │
│ композицию                          │
│ Выход: 3 кастомных промпта          │
│ + Brand Identity Lock (общий стиль) │
└─────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ STAGE 3: Parallel Generation        │
│ Nano Banana 2 (gemini-3.1-flashimg) │
│ Promise.all — 3 запроса ОДНОВРЕМЕННО│
│ Retry при 429 + safety refusal      │
│ Выход: 3 изображения (PNG, Base64)  │
└─────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ STAGE 4: Quality Check              │
│ Gemma 4 31B / GPT-4o-mini           │
│ 5 проверок: fidelity, текст,        │
│ галлюцинации, композиция, стиль     │
│ Score 0-100, флаг passed            │
│ (без авто-регенерации — админ решает)│
└─────────────────────────────────────┘
       │
       ▼
   3 готовых карточки
```

---

## Модели (через OpenRouter)

| Стадия | Модель | Цена | Назначение |
|--------|--------|------|------------|
| Stage 1 | `google/gemma-4-31b-it` | Бесплатно | Vision анализ фото |
| Stage 2 | `google/gemini-3.1-flash-lite` | ~$0.001 | Сборка промптов |
| Stage 3 | `google/gemini-3.1-flash-image-preview` | $0.008-0.015/шт | Генерация изображений |
| Stage 4 | `google/gemma-4-31b-it` | Бесплатно | Проверка качества |

**Общая стоимость:** ~$0.025-0.05 за 3 карточки.

Все модели настраиваются в `src/lib/tovar-ai/types.ts` (константа `TOVAR_AI_CONFIG`).

---

## Файловая структура

```
src/lib/tovar-ai/
  types.ts                — Все типы (VisionOutput, CardPrompt, PromptsOutput, CardResult, QAResult, PipelineResult)
  stage1-vision.ts        — analyzeProductImage(photoBase64, description?, characteristics?) → VisionOutput
  stage2-planner.ts       — planCardPrompts(analysis, description?, characteristics?, price?) → PromptsOutput
  stage3-generate.ts      — generateSingleCard(card, photoBase64) → CardResult
                          — generateAllCards(cards[], photoBase64) → CardResult[]
  stage4-qa.ts            — checkCardQuality(analysis, cards[], description?) → QAResult[]
  pipeline.ts             — runTovarAIPipeline(input, callbacks?) → PipelineResult
  index.ts                — barrel export
  design/                 — Дизайн-библиотеки (11 JSON-файлов)
    creative-styles.json      — 40 стилей: что в кадре (cs01-cs40)
    marketing-styles.json     — 30 стилей: какое сообщение (ms01-ms30)
    visual-themes.json        — Каталог визуальных тем: освещение, фон, настроение, материалы, глубина, движение
    creative-director.json    — 6 правил саморецензии
    marketing-angles.json     — Маркетинговые углы
    layouts.json              — Варианты компоновки
    positions.json            — Позиции продукта
    backgrounds.json          — Фоны и окружения
    composition-rules.json    — Правила композиции
    marketplace-rules.json    — Правила маркетплейса
    visual-effects.json       — Визуальные эффекты

src/app/api/tovar-ai/
  generate/route.ts           — POST /api/tovar-ai/generate (полный пайплайн)
  regenerate-card/route.ts    — POST /api/tovar-ai/regenerate-card (одна карточка)

src/app/admin/tovar-ai/page.tsx  — UI: Drag&Drop, прогресс, просмотр, регенерация, скачивание

scripts/test-tovar-ai.ts     — CLI тест: npx tsx scripts/test-tovar-ai.ts <photo> [description]
```

---

## Stage 1: Vision Analysis (`stage1-vision.ts`)

- Принимает Base64 фото + опционально описание поставщика и характеристики
- Определяет MIME-тип по сигнатуре (JPEG, PNG, GIF, WebP)
- Шлёт запрос с `response_format: json_object`, `temperature: 0.1`
- Парсит JSON с очисткой code fences
- Валидирует все поля (заполняет дефолты для missing)
- **Выход:** `VisionOutput` — 25+ полей: тип, категория, бренд, цвета, форма, материал, функции, сценарии, аудитория, premium_level

## Stage 2: Prompt Planner (`stage2-planner.ts`)

**Ключевая фича — Brand Identity Lock:** все 3 карточки одной кампании имеют ОБЩИЙ визуальный стиль (цветовая палитра, освещение, фон, настроение, материалы), но РАЗНЫЕ композиции.

### 7 триад ролей

| Триада | Card 1 | Card 2 | Card 3 |
|--------|--------|--------|--------|
| product | hero | usage | close_up |
| quality | hero | quality | materials |
| features | hero | benefits | power |
| trust | hero | comparison | review |
| premium | hero | lifestyle | gift |
| offer | hero | bundle | cta |
| problem_solution | hero | problem | solution |

Триада выбирается случайно из всех 7, финальный выбор происходит в LLM.

### Механизм работы

1. **selectTriad** — случайный выбор триады из 7
2. **selectColorPalette** — по premium_level (luxury/premium/mid/budget) + категория товара → 12 палитр
3. **pickSharedVisualTheme** — общее освещение, фон, настроение, материалы (Brand Identity Lock)
4. **pickCreativeStyleForRole** — 40 стилей, уникальные для каждой карточки (не повторяются)
5. **pickMarketingStyleForRole** — 30 стилей под роль
6. **buildUserPrompt** — сборка полного контекста для LLM
7. LLM возвращает 3 промпта → постобработка: BASE_PROMPT + design decisions + коммерческая плотность

### 12 композиционных вариаций

asymmetric_left, asymmetric_right, diagonal_flow, diagonal_reverse, product_oversized, grid_cards, vertical_stack, product_left_strip, floating_chaos, top_heavy, framed_product, exploded_technical

Каждая карточка получает УНИКАЛЬНУЮ композицию (не повторяются между 3 карточками).

### Коммерческая плотность

Каждая карточка обязана содержать 3-8 коммерческих блоков (feature badges с pointer lines, цену, доставку и т.д.) в зависимости от роли. Минималистичные карточки без блоков REJECTED.

### BASE_PROMPT — жёсткие правила для Nano Banana

- Язык: только азербайджанская латиница
- Запрещены: кнопки покупки, логотипы, водяные знаки, выдуманные цены/гарантии
- Продукт занимает 65-75% кадра
- Стиль меток: иконка + текст НАПРЯМУЮ на градиенте (без боксов/панелей/pill-форм)
- Тонкие pointer lines (1px) к точкам на продукте
- Глубокий комплементарный градиент (никогда того же цвета что продукт)

---

## Stage 3: Image Generation (`stage3-generate.ts`)

- **3 параллельных запроса** через `Promise.allSettled`
- Модель: Nano Banana 2 (`google/gemini-3.1-flash-image-preview`)
- Каждый запрос: промпт + reference-фото (Base64)
- Retry логика:
  - **429 Rate Limit:** exponential backoff (2s, 4s, 8s, 16s) — до MAX_RETRIES (2)
  - **5xx:** ретрай с задержкой
  - **Safety Refusal:** случайная задержка 2-5s + ретрай (Google safety filter срабатывает случайно)
- Извлечение изображения из ответа: 3 варианта формата (images[], content array, data URI)

---

## Stage 4: Quality Check (`stage4-qa.ts`)

- 5 проверок: product_fidelity, text_readable, no_hallucinations, composition_ok, style_consistent
- Score 0-100, passed = score >= 60 AND product_fidelity = true
- При ошибке API или парсинга → optimistic pass (пайплайн не валится из-за QA)
- **Нет авто-регенерации.** Решение о перегенерации принимает админ через UI

---

## Pipeline (`pipeline.ts`)

- Оркестратор: Stage 1 → Stage 2 → Stage 3 → Stage 4
- Callbacks: `onStageChange(status, message)`, `onCardGenerated(index, total)`
- Фетчит фото по URL если передан URL вместо Base64
- Сохраняет все промежуточные результаты
- При фейле на любой стадии возвращает частичный результат + ошибка
- Приблизительный подсчёт стоимости

---

## API Routes

### POST `/api/tovar-ai/generate`

```json
// Request
{ "photoBase64": "...", "providerDescription": "...", "priceAz": "29 AZN" }

// Response (200)
{
  "success": true,
  "cards": [{ "index": 1, "role": "hero", "imageBase64": "...", "attempt": 1 }, ...],
  "cardPrompts": [{ "index": 1, "role": "hero", "prompt_en": "...", ... }],
  "product_analysis": { ... VisionOutput },
  "qa_results": [{ ... QAResult }],
  "cost": 0.034,
  "status": "done"
}
```

### POST `/api/tovar-ai/regenerate-card`

```json
// Request
{ "photoBase64": "...", "cardPrompt": { ... CardPrompt } }

// Response
{ "success": true, "card": { "index": 1, "role": "hero", "imageBase64": "...", "attempt": 1 } }
```

---

## UI (`/admin/tovar-ai`)

React-компонент на странице `/admin/tovar-ai`:

1. **Drag & Drop** фото (JPG/PNG/WebP, до 20MB)
2. Поля: описание поставщика, цена (опционально)
3. Кнопка «3 kart şəkli yarat»
4. Прогресс: анализ → промпты → генерация (или статус-бар)
5. Результат: 3 превью с labels (на азербайджанском)
6. Каждую карточку можно: скачать, перегенерировать индивидуально
7. Кнопка «Hamısını yüklə» — скачать все 3

---

## CLI тест

```bash
npx tsx scripts/test-tovar-ai.ts ./test-photo.jpg "Профессиональный фен 2000W"
```

Результат сохраняется в `.tovar-ai-output/`:
- `product_analysis.json` — Vision анализ
- `prompts.json` — Промпты для всех карточек
- `card_1_hero.png`, `card_2_usage.png`, `card_3_features.png` — карточки
- `qa_results.json` — Результаты проверки качества

---

## Дизайн-библиотеки (11 JSON)

Расположены в `src/lib/tovar-ai/design/`:

| Файл | Содержание |
|------|-----------|
| `creative-styles.json` | 40 стилей — что в кадре (cs01-cs40) |
| `marketing-styles.json` | 30 стилей — какое сообщение (ms01-ms30) |
| `visual-themes.json` | Каталог: 8 светов, 9 фонов, 9 настроений, 10 материалов, 12 глубин, 9 движений |
| `creative-director.json` | 6 чеков для саморецензии каждой карточки |
| `layouts.json` | 8 типов макетов |
| `positions.json` | Позиции продукта в кадре |
| `backgrounds.json` | Варианты фонов |
| `composition-rules.json` | Правила композиции |
| `marketplace-rules.json` | Правила для маркетплейса |
| `visual-effects.json` | Визуальные эффекты |
| `marketing-angles.json` | Маркетинговые углы |

---

## Таблица в БД

```sql
tovar_ai_generations (
  id UUID PK,
  product_id UUID → products(id) ON DELETE SET NULL,
  source_photo TEXT NOT NULL,
  product_analysis JSONB,     -- VisionOutput
  prompts_json JSONB,          -- PromptsOutput
  cards JSONB DEFAULT '[]',    -- CardResult[]
  qa_results JSONB DEFAULT '[]', -- QAResult[]
  status TEXT: pending|analyzing|planning|generating|checking|done|failed,
  error TEXT,
  cost DECIMAL(10,4),
  created_at, updated_at
)
```

Миграция: `src/lib/supabase/migrations/004_tovar_ai_generations.sql`

---

## .env.local

```bash
OPENROUTER_API_KEY=sk-or-v1-...
```

Модели конфигурируются в `src/lib/tovar-ai/types.ts` → `TOVAR_AI_CONFIG`. Для смены модели достаточно изменить строку в конфиге, код не меняется.

---

## Что НЕ реализовано (из оригинального плана)

- API routes: `/api/tovar-ai/status` (polling статуса) — не нужен т.к. пайплайн синхронный
- Привязка к продукту в админке (кнопка «Сгенерировать карточки» в форме товара)
- Сохранение результатов в Supabase (`tovar_ai_generations`)
- Автоматическое обновление `images` товара сгенерированными карточками
- Очередь массовой генерации (при >10 RPM)
- Страница `/admin/products/[id]/generate-cards`
