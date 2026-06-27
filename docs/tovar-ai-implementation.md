# Tovar.AI — исправленный план реализации

## Что не так с исходным планом

Nano Banana 2 (Gemini 3.1 Flash Image) генерирует **только 1 изображение за запрос**. Параметры `n`, `numberOfImages`, `number_of_images` игнорируются. Инструкция в промпте «сделай 5 фото» тоже не работает.

**Решение**: 3 параллельных запроса через `Promise.all` + `fetch`, каждый со своим промптом.

---

## Архитектура (4 стадии)

```
ЗАГРУЗКА ТОВАРА
  photo.jpg (обязательно)
  description_ru (опционально — описание поставщика)
  characteristics (опционально — доп. характеристики)
         │
         ▼
╔══════════════════════════════════════════════════╗
║  STAGE 1: Vision Analysis (дешёвая модель)       ║
║  ─────────────────────────────────────────────   ║
║  OpenRouter → GPT-4o-mini или Gemini Flash       ║
║  Вход: photo.jpg (base64)                        ║
║  Выход: product_analysis.json (строгая схема)     ║
║                                                  ║
║  Извлекает:                                      ║
║  - тип товара, категория, подкатегория            ║
║  - бренд, логотип, надписи                       ║
║  - форма, цвет, материал, текстура                ║
║  - размеры, комплектация, аксессуары              ║
║  - элементы управления, кнопки, разъёмы            ║
║  - дисплей, индикаторы, упаковка                   ║
║  - особенности конструкции, функции                ║
║  - сценарии использования                         ║
║  - нужен ли человек в кадре, lifestyle-сцены       ║
╚══════════════════════════════════════════════════╝
         │
         ▼
╔══════════════════════════════════════════════════╗
║  STAGE 2: Prompt Planner (LLM)                   ║
║  ─────────────────────────────────────────────   ║
║  OpenRouter → GPT-4o или Claude                  ║
║  Вход: product_analysis.json + description + chars║
║  Выход: prompts.json (3 промпта + style_lock)    ║
║                                                  ║
║  Собирает 3 уникальных промпта:                  ║
║  - card_1: главная обложка (крупно, премиально)   ║
║  - card_2: демонстрация использования             ║
║  - card_3: особенности / детали товара            ║
║                                                  ║
║  + Style Lock: единый блок стиля во всех промптах ║
╚══════════════════════════════════════════════════╝
         │
         ▼
╔══════════════════════════════════════════════════╗
║  STAGE 3: Parallel Image Generation              ║
║  ─────────────────────────────────────────────   ║
║  OpenRouter → Nano Banana 2                      ║
║  Promise.all → 3 одновременных запроса            ║
║                                                  ║
║  Каждый запрос:                                  ║
║  - свой промпт (из Stage 2)                      ║
║  - reference_image = photo.jpg (для fidelity)    ║
║  - aspect_ratio = 1:1                            ║
║  - image_size = 1K или 2K                        ║
║                                                  ║
║  Выход: card_1.png, card_2.png, card_3.png       ║
╚══════════════════════════════════════════════════╝
         │
         ▼
╔══════════════════════════════════════════════════╗
║  STAGE 4: Quality Check (Vision, опционально)    ║
║  ─────────────────────────────────────────────   ║
║  Vision-модель проверяет каждую карточку:         ║
║  - сохранён ли внешний вид товара                  ║
║  - читается ли текст                              ║
║  - нет ли галлюцинаций / искажений                 ║
║  - соответствует ли карточка своему назначению     ║
║                                                  ║
║  Если fail → регенерация (max 2 попытки)          ║
╚══════════════════════════════════════════════════╝
```

---

## OpenRouter конфигурация

```
BASE_URL = https://openrouter.ai/api/v1
AUTH = Authorization: Bearer ${OPENROUTER_API_KEY}

Модели:
  Stage 1 (Vision):  openai/gpt-4o-mini       (~$0.15/image)
                      или google/gemini-2.0-flash-001  (дешевле, ~$0.07/image)
  Stage 2 (Planner): openai/gpt-4o            (~$0.005/запрос)
                      или anthropic/claude-sonnet-4
  Stage 3 (Image):   google/gemini-3.1-flash-image-preview  (Nano Banana 2)
                      ~$0.067 за 1K, ~$0.101 за 2K
  Stage 4 (QA):      openai/gpt-4o-mini       (~$0.15/проверка)
                      или google/gemini-2.0-flash-001

Общая стоимость генерации 3 карточек: ~$0.25–0.50
```

---

## Файлы и структура

### Новые файлы (10 файлов)

```
src/
  app/
    api/
      tovar-ai/
        generate/route.ts          — POST: Stage 1→2→3→4 пайплайн
        generate-card/route.ts     — POST: Stage 3 одно изображение
        status/route.ts            — GET: статус генерации по ID
  lib/
    tovar-ai/
      types.ts                     — Все типы (VisionOutput, PromptsOutput, CardSpec, etc.)
      stage1-vision.ts             — Vision анализ → product_analysis.json
      stage2-planner.ts            — LLM сборка 3 промптов + style_lock
      stage3-generate.ts           — Nano Banana 2 одно изображение
      stage4-qa.ts                 — Проверка качества
      pipeline.ts                  — Оркестратор всего пайплайна
    supabase/
      migrations/
        004_tovar_ai_generations.sql  — Таблицы для хранения генераций
  app/
    admin/
      products/
        [id]/
          generate-cards/
            page.tsx               — UI страница генерации
            generate-client.tsx    — Клиентский компонент с прогрессом
```

### Таблицы в БД (добавить в schema.sql)

```sql
-- Генерации карточек товаров
CREATE TABLE IF NOT EXISTS tovar_ai_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  source_photo TEXT NOT NULL,                  -- URL/путь к оригинальному фото
  product_analysis JSONB,                      -- Stage 1 результат (VisionOutput)
  prompts_json JSONB,                          -- Stage 2 результат (PromptsOutput)
  cards JSONB DEFAULT '[]'::jsonb,            -- Stage 3 результат [{index, url, prompt}]
  qa_results JSONB DEFAULT '[]'::jsonb,       -- Stage 4 результат
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','analyzing','planning','generating','checking','done','failed')),
  error TEXT,
  cost DECIMAL(10,4) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tovar_ai_gen_product ON tovar_ai_generations(product_id);
```

---

## Stage 1: Vision Analysis (подробно)

### Модель
`openai/gpt-4o-mini` через OpenRouter

### Вход
```typescript
{
  imageBase64: string,   // оригинальное фото в base64
  providerDescription?: string,  // описание от поставщика
  characteristics?: Record<string, string>  // доп. характеристики
}
```

### Выход — строгий JSON по схеме

```typescript
interface VisionOutput {
  // --- Базовая идентификация ---
  product_type: string              // "фен", "смартфон", "массажер", "лампа", ...
  category: string                  // "Бытовая техника", "Электроника", "Кухня", ...
  subcategory: string | null        // "Фены", "Смартфоны", ...

  // --- Внешний вид ---
  brand: string | null              // бренд если виден
  model: string | null              // модель если читается
  logo_visible: boolean             // виден ли логотип
  inscriptions: string[]            // ["Model X200", "220V", ...]
  primary_color: string             // основной цвет
  secondary_colors: string[]        // дополнительные цвета ["черный", "серебристый"]
  finish: string                    // "матовый", "глянцевый", "металлик", ...
  shape: string                     // "овальный", "прямоугольный", "цилиндрический", ...
  material: string                  // "пластик", "металл", "ABS-пластик", ...
  texture: string | null            // "гладкий", "рифленый", "soft-touch", ...

  // --- Конструкция ---
  dimensions_estimated: string | null  // "примерно 25×20×10 см"
  construction_features: string[]     // ["складная ручка", "съемная насадка", ...]
  controls: string[]                  // ["кнопка вкл/выкл", "регулятор температуры", ...]
  buttons: string[]                   // ["power", "mode", "+", "-", ...]
  ports: string[]                     // ["USB-C", "micro-USB", "DC input", ...]
  display: string | null              // "LED дисплей", "цифровой экран", ...
  indicators: string[]                // ["красный индикатор питания", ...]

  // --- Комплектация ---
  package_contents: string[]          // ["фен", "насадка-концентратор", "диффузор", ...]
  accessories: string[]               // ["чехол", "кабель USB-C", "инструкция", ...]

  // --- Функциональность ---
  possible_functions: string[]        // ["сушка волос", "укладка", "ионизация", ...]
  intended_use: string                // "для сушки и укладки волос в домашних условиях"

  // --- Сценарии для генерации ---
  needs_human_model: boolean          // нужен ли человек в кадре
  needs_lifestyle_scene: boolean      // нужен ли lifestyle-фон
  recommended_scenes: string[]        // ["ванная комната", "салон красоты", ...]
  needs_macro_shots: boolean          // нужны ли макро-снимки деталей
  needs_size_comparison: boolean      // нужен ли показ размеров
  needs_exploded_view: boolean        // нужен ли разбор/схема

  // --- Маркетинговые аспекты ---
  target_audience: string             // "женщины 20-45", "профессионалы", ...
  key_selling_points: string[]        // ["мощный мотор", "ионизация", "3 режима", ...]
  premium_level: "budget" | "mid" | "premium" | "luxury"
}
```

**Важно**: этот JSON в будущем будет использоваться для автопарсинга товаров и заполнения таблицы `products`. Поэтому поля должны быть максимально полными и соответствовать структуре товара в БД.

---

## Stage 2: Prompt Planner (подробно)

### Модель
`openai/gpt-4o` или `anthropic/claude-sonnet-4` через OpenRouter

### Вход
```typescript
{
  analysis: VisionOutput,           // результат Stage 1
  providerDescription?: string,     // описание поставщика
  characteristics?: Record<string, string>,
  cardCount: 3                      // всегда 3 по умолчанию
}
```

### Выход
```typescript
interface PromptsOutput {
  style_lock: {
    // Единый блок стиля — вставляется в начало КАЖДОГО промпта
    color_palette: string        // "теплые тона, золотой + белый + серый"
    lighting: string             // "студийный свет, мягкие тени, 2 источника"
    background_style: string     // "светлый градиент, минимализм, без паттернов"
    typography_style: string     // "жирный sans-serif для заголовков, тонкий для подписей"
    overall_mood: string         // "премиальный, современный, чистый"
  },
  cards: [
    {
      index: 1,
      purpose: "main_cover",       // main_cover | usage_demo | features_detail
      prompt_az: string,           // полный промпт на английском для Nano Banana
      text_overlay_az: string[],   // ["SƏRİN HAVA", "3 REJİM", ...] — тексты для карточки
      composition: string,         // "крупный план, товар занимает 70% кадра, фронтальный ракурс"
      needs_model: boolean,
      reference_weight: number     // 0.0 - 1.0 насколько строго держаться reference-фото
    },
    {
      index: 2,
      purpose: "usage_demo",
      prompt_az: string,
      text_overlay_az: string[],
      composition: string,
      needs_model: boolean,
      reference_weight: number
    },
    {
      index: 3,
      purpose: "features_detail",
      prompt_az: string,
      text_overlay_az: string[],
      composition: string,
      needs_model: boolean,
      reference_weight: number
    }
  ]
}
```

### Как работает Prompt Planner

LLM получает инструкцию: для данного товара сгенерировать 3 промпта для Nano Banana 2.

**Card 1 (main_cover)** — главная обложка:
- Товар максимально крупно (60-70% кадра)
- Премиальная студийная композиция
- Хороший свет, чистый фон
- Допускаются крупные заголовки, бейджи, иконки
- Текст на азербайджанском

**Card 2 (usage_demo)** — демонстрация использования:
- Если `needs_human_model: true` — человек использует товар
- Если `needs_lifestyle_scene: true` — товар в интерьере/сцене
- Естественная обстановка, lifestyle-фотография

**Card 3 (features_detail)** — особенности:
- Детали, макро, функции
- Возможно несколько ракурсов
- Инфографика, подписи, стрелки
- Технические акценты

---

## Stage 3: Image Generation (подробно)

### Модель
`google/gemini-3.1-flash-image-preview` (Nano Banana 2) через OpenRouter

### API вызов

```typescript
// OpenRouter endpoint для image generation
const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "google/gemini-3.1-flash-image-preview",
    messages: [{
      role: "user",
      content: [
        {
          type: "text",
          text: cardPrompt   // полный промпт из Stage 2
        },
        {
          type: "image_url",
          image_url: {
            url: `data:image/jpeg;base64,${base64Photo}`
          }
        }
      ]
    }],
    // Параметры генерации
    image_config: {
      aspect_ratio: "1:1",
      image_size: "2K"       // 1K для скорости, 2K для качества
    }
  })
})
```

### Параллельный запуск

```typescript
// Promise.all — все 3 запроса уходят одновременно
const results = await Promise.allSettled(
  promptsOutput.cards.map(card =>
    generateSingleCard(card, base64Photo)
  )
)

// Если какой-то упал — ретрай
for (const [i, result] of results.entries()) {
  if (result.status === 'rejected') {
    results[i] = await retryGenerate(promptsOutput.cards[i], base64Photo, 2)
  }
}
```

### Rate Limits

OpenRouter для Nano Banana 2:
- ~10 запросов/мин (зависит от Google API tier)
- 3 параллельных запроса = ~3 секунды (уходят одновременно)
- При 429 → exponential backoff (1s, 2s, 4s)

---

## Stage 4: Quality Check (подробно)

### Модель
`openai/gpt-4o-mini` (дешёвая Vision)

### Проверка каждой карточки

```typescript
interface QAResult {
  card_index: number
  passed: boolean
  checks: {
    product_fidelity: boolean    // товар выглядит как оригинал
    text_readable: boolean       // текст читается и правильный
    no_hallucinations: boolean   // нет лишних деталей
    composition_ok: boolean      // композиция соответствует purpose
    style_consistent: boolean    // стиль совпадает с другими карточками
  }
  issues: string[]               // ["текст размыт", "цвет товара изменён", ...]
  score: number                  // 0-100
}

// Если score < 60 или product_fidelity = false → регенерация
// Максимум 2 попытки регенерации на карточку
```

---

## UI: страница генерации

### Роут
`/admin/products/[id]/generate-cards`

### Состояния

```
1. НАЧАЛО
   ┌──────────────────────────────────┐
   │  Генерация карточек товара        │
   │                                  │
   │  Товар: MacBook Pro 14"          │
   │  Исходное фото: [превью]         │
   │                                  │
   │  Описание поставщика (опц.):     │
   │  [textarea]                      │
   │                                  │
   │  Доп. характеристики (опц.):     │
   │  [ключ]: [значение] +добавить     │
   │                                  │
   │  [  Сгенерировать 3 карточки  ]  │
   └──────────────────────────────────┘

2. ПРОГРЕСС
   ┌──────────────────────────────────┐
   │  ⏳ Анализ товара...              │
   │  ✅ Анализ завершён               │
   │  ⏳ Создание промптов...          │
   │  ✅ Промпты готовы                │
   │  ⏳ Генерация карточки 1/3...    │
   │  ⏳ Генерация карточки 2/3...    │
   │  ⏳ Генерация карточки 3/3...    │
   │  ⏳ Проверка качества...          │
   └──────────────────────────────────┘

3. РЕЗУЛЬТАТ
   ┌──────────────────────────────────┐
   │  ✅ Готово! 3 карточки созданы    │
   │                                  │
   │  [card_1] [card_2] [card_3]     │
   │                                  │
   │  [  Скачать все  ]               │
   │  [  Применить к товару  ]         │
   │  [  Сгенерировать заново  ]       │
   └──────────────────────────────────┘
```

---

## API Routes

### POST `/api/tovar-ai/generate`
Запускает полный пайплайн.
```typescript
// Request
{
  productId: string,
  photoUrl: string,        // URL загруженного фото в Supabase Storage
  providerDescription?: string,
  characteristics?: Record<string, string>
}

// Response (200)
{
  generationId: string,
  status: "done",
  cards: [
    { index: 1, url: "https://...card_1.png", purpose: "main_cover" },
    { index: 2, url: "https://...card_2.png", purpose: "usage_demo" },
    { index: 3, url: "https://...card_3.png", purpose: "features_detail" }
  ],
  product_analysis: VisionOutput,
  cost: 0.34
}
```

### POST `/api/tovar-ai/generate-card`
Генерирует одно изображение (для регенерации конкретной карточки).
```typescript
// Request
{
  generationId: string,
  cardIndex: number,
  promptOverrides?: Partial<CardPrompt>
}

// Response (200)
{
  url: string,
  cardIndex: number
}
```

### GET `/api/tovar-ai/status?generationId=...`
Возвращает текущий статус генерации (для polling из UI).

---

## Server Action для админки

```typescript
// src/lib/actions.ts — добавить

export async function generateTovarCards(formData: FormData) {
  if (!(await checkAuth())) redirect('/admin')
  
  const productId = formData.get('productId') as string
  const photoFile = formData.get('photo') as File
  const description = formData.get('description') as string | null
  
  // 1. Загрузить фото в Supabase Storage
  // 2. Запустить пайплайн
  // 3. Сохранить результат в tovar_ai_generations
  // 4. Обновить images у товара
}
```

---

## Порядок реализации

### Шаг 1: Таблицы и типы
✅ Файлы: `schema.sql` (миграция), `src/lib/tovar-ai/types.ts`
- SQL: `tovar_ai_generations`
- TS: `VisionOutput`, `PromptsOutput`, `CardSpec`, `QAResult`, `GenerationStatus`

### Шаг 2: Stage 1 — Vision Analysis
✅ Файл: `src/lib/tovar-ai/stage1-vision.ts`
- Функция: `analyzeProductImage(photoBase64, opts?) → VisionOutput`
- Строгий JSON-промпт с указанием всех полей
- Retry при ошибке парсинга JSON
- Тест: 3-5 разных товаров

### Шаг 3: Stage 2 — Prompt Planner
✅ Файл: `src/lib/tovar-ai/stage2-planner.ts`
- Функция: `planCardPrompts(analysis, opts?) → PromptsOutput`
- Системный промпт с правилами для каждой карточки
- Style Lock — единый блок стиля
- Тест: проверить что промпты разные для разных категорий

### Шаг 4: Stage 3 — Image Generation
✅ Файл: `src/lib/tovar-ai/stage3-generate.ts`
- Функция: `generateSingleCard(prompt, referencePhoto) → base64Image`
- Функция: `generateAllCards(promptsOutput, photo) → CardResult[]` (Promise.all)
- Retry логика с exponential backoff
- Rate limit handling (429 → wait)

### Шаг 5: Pipeline
✅ Файл: `src/lib/tovar-ai/pipeline.ts`
- Функция: `runFullPipeline(input) → GenerationResult`
- Оркестрация всех 4 стадий
- Сохранение промежуточных результатов в БД (для возобновления)
- Подсчёт стоимости

### Шаг 6: API Routes
✅ Файлы:
- `src/app/api/tovar-ai/generate/route.ts`
- `src/app/api/tovar-ai/generate-card/route.ts`
- `src/app/api/tovar-ai/status/route.ts`

### Шаг 7: UI
✅ Файлы:
- `src/app/admin/products/[id]/generate-cards/page.tsx`
- `src/app/admin/products/[id]/generate-cards/generate-client.tsx`
- Добавить ссылку в список товаров

### Шаг 8: Интеграция с формой товара
✅ При создании товара → кнопка «Сгенерировать карточки»
✅ Готовые карточки → в `images` товара

---

## Заменяемость моделей

Все модели настраиваются через `.env.local`:

```bash
# OpenRouter
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# Stage 1: Vision модель
TOVAR_AI_VISION_MODEL=openai/gpt-4o-mini

# Stage 2: LLM планировщик
TOVAR_AI_PLANNER_MODEL=openai/gpt-4o

# Stage 3: Image генерация
TOVAR_AI_IMAGE_MODEL=google/gemini-3.1-flash-image-preview

# Stage 4: QA проверка
TOVAR_AI_QA_MODEL=openai/gpt-4o-mini

# Настройки генерации
TOVAR_AI_DEFAULT_CARD_COUNT=3
TOVAR_AI_IMAGE_SIZE=2K              # 1K | 2K
TOVAR_AI_ASPECT_RATIO=1:1
TOVAR_AI_MAX_RETRIES=2
```

Заменить модель = поменять строку в `.env.local`. Код не меняется.

---

## OpenRouter vs прямой API

| Параметр | OpenRouter | Прямой Gemini API |
|----------|-----------|-------------------|
| Гибкость смены моделей | ✅ Одна строка | ❌ Разные SDK/API |
| Цена | +5-10% наценка | Дешевле |
| Rate limits | Через OpenRouter | Tier 1: 10 RPM |
| Единый API key | ✅ | ❌ Нужны отдельные ключи |
| Доступ к Nano Banana 2 | ✅ (preview) | ✅ |

**Выбрали OpenRouter** — за гибкость и единый интерфейс.

---

## Ограничения и риски

1. **Nano Banana 2 — 1 изображение за запрос**. Решено через `Promise.all`.
2. **Rate limit 10 RPM**. 3 карточки = 3 запроса = ок. Но при массовой генерации нужна очередь.
3. **Текст на азербайджанском**. Nano Banana 2 хорошо рендерит латиницу. Кириллицу — хуже. Азербайджанский (латиница) должен работать.
4. **Fidelity товара**. Reference image помогает, но возможны искажения формы. QA-стадия отлавливает.
5. **Стоимость**. ~$0.30–0.50 за 3 карточки. При 100 товарах = $30–50. Нормально.
