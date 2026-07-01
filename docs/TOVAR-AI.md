# Tovar.AI — AI генерация карточек товаров

## Обзор

Tovar.AI — подсистема автоматической генерации карточек товаров для TAPLA MARKETPLACE. Одно фото → полный комплект: маркетинговые карточки + текстовое описание + чистое фото товара.

**Стек:** OpenRouter + Kei Proxy (n1leads.tapla.az), HMAC-SHA256 аутентификация.

---

## Актуальный пайплайн (5+ стадий, параллельные пути)

```
                          ┌──────────────────────────────┐
                          │   Фото товара (Base64)        │
                          └──────────────┬───────────────┘
                                         ▼
                          ┌──────────────────────────────┐
                          │  STAGE 1: Vision Analysis     │
                          │  Gemma 4 31B (free)           │
                          │  → VisionOutput (25+ полей)   │
                          └──────────────┬───────────────┘
                                         │
              ┌──────────────────────────┼──────────────────────────┐
              │                          │                          │
              ▼                          ▼                          ▼
  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
  │ STAGE 1.5: Enricher  │  │ STAGE 2: Planner     │  │ STAGE 5: Kie.ai I2I  │
  │ Gemma 4 31B          │  │ Gemini Flash Lite    │  │ grok-imagine/i2i     │
  │ Полная карточка:     │  │ (V2 LLM-driven)      │  │ Чистое фото товара   │
  │ описание, benefits,  │  │ → PromptsOutput      │  │ (белый фон, 1 шт)    │
  │ FAQ, SEO, shades,    │  │   (n промптов)       │  └──────────┬───────────┘
  │ tags, features...    │  └──────────┬───────────┘             │
  └──────────┬───────────┘             │                         │
             │                         ▼                         │
             │              ┌──────────────────────┐             │
             │              │ STAGE 3: Generate    │             │
             │              │ Kei Proxy → Nano Banana 2          │
             │              │ Promise.all, retry    │             │
             │              │ → n карточек (PNG)    │             │
             │              └──────────┬───────────┘             │
             │                         │                         │
             └──────────┬──────────────┴──────────────┬──────────┘
                        │                             │
                        ▼                             ▼
              ┌──────────────────┐          ┌──────────────────┐
              │ 3-5 карточек +   │          │ Чистое фото      │
              │ R2 upload        │          │ R2 upload        │
              └──────────────────┘          └──────────────────┘
```


## Режимы

| Режим (`mode`) | Что выполняется | Цель |
|----------------|-----------------|------|
| `test` (по умолч.) | Stage 1 → (Stage 2→3 + Stage 5 параллельно) | Быстрый тест, только карточки |
| `product` | Stage 1 → (Stage 1.5 + Stage 2→3 + Stage 5 параллельно) | Полный цикл: карточки + данные + чистое фото |

В режиме `product` после генерации:
- **Category matching** — AI-категория мапится на Supabase таблицу categories
- **R2 upload** — карточки + чистое фото загружаются в Cloudflare R2
- **ProductDraftData** — полный черновик товара (name, description, benefits, features, SEO tags, shades, FAQ...)

---

## Модели

| Стадия | Модель | Цена |
|--------|--------|------|
| Stage 1 Vision | `google/gemma-4-31b-it` | Бесплатно |
| Stage 1.5 Enricher | `google/gemma-4-31b-it` | Бесплатно |
| Stage 2 Planner | `google/gemini-3.1-flash-image-preview` | ~$0.001 |
| Stage 3 Generate | Nano Banana 2 (через Kei Proxy) | ~$0.008-0.015/шт |
| Stage 5 Kie I2I | `grok-imagine/image-to-image` (через Kei Proxy) | Зависит от провайдера |

Конфиг: `src/lib/tovar-ai/types.ts` → `TOVAR_AI_CONFIG`.

---

## Stage 1: Vision Analysis

`stage1-vision.ts`

Анализирует фото: тип, категория, бренд, цвета, форма, материал, функции, сценарии, аудитория, premium_level. JSON-выход, 25+ полей.

## Stage 1.5: Data Enricher

`stage1.5-enricher.ts`

Генерирует ПОЛНУЮ текстовую карточку товара на азербайджанском:
- name_az, title_az, subtitle_az, description_az
- benefits_az (6-12 шт), features_az (8-20 шт), use_cases_az, ideal_for_az
- how_to_use_az, ingredients_az, care_instructions_az, compatibility_az
- faq_az (3-8 пар), tags_az (15-40 шт), search_keywords_az (30-100 фраз)
- shades (с hex-цветами), slug, try_on_enabled

**SYSTEM_PROMPT** жёстко регламентирует: только азербайджанский, естественный язык (без шаблонов), честность (не выдумывать), SEO-оптимизация.

Работает **параллельно** с генерацией изображений.

## Stage 2: Prompt Planning

Переключение режима: `STAGE2_MODE` в `pipeline.ts` (`'v1'` | `'v2'`).

### V2 (LLM-driven, по умолчанию)
`stage2-planner-v2.ts` — **Вся креативная логика передаётся LLM.** Без хардкод-библиотек. LLM сама решает роли, композицию, стиль, палитру.

**Жёсткие правила (HARD_RULES):**
- Азербайджанская латиница
- Бренд производителя сохранять, маркетплейс-лого убирать
- Никаких CTA-кнопок, выдуманных данных, прайсов без указания
- Brand Identity Lock — единый стиль для всех карточек
- Продукт неизменён (форма, цвет, пропорции)
- Single frame (без коллажей/сплитов)
- 6-10 текстовых лейблов на каждую карточку

**Style Reference Images:** 8 примеров маркетплейс-карточек (из R2) передаются как визуальные референсы.

**Системный промпт:** Creative Director для TAPLA.AZ. Проектирует n-карточную кампанию:
- Brand Identity Lock: общая палитра, свет, фон, mood, стиль лейблов
- Разное: ракурс, композиция, фокальное сообщение
- Требование: промпты 300+ слов, полное описание сцены

### V1 (оригинальная, с JSON-библиотеками)
`stage2-planner.ts` — система с 7 триадами, 11 JSON-библиотеками, 23 ролями, 12 композициями.

См. `docs/DESIGN-SYSTEM-MAP.md` для деталей.

## Stage 3: Image Generation

`stage3-generate-kei.ts` — генерация через **Kei Proxy** (`n1leads.tapla.az`).

**Протокол:** upload photo → createTask → polling → download (асинхронный).

- **Параллельно:** Promise.allSettled — все карточки одновременно
- **Retry:** только при явных ошибках (HTTP 5xx/429, state=fail)
- **Модель:** `nano-banana-2`
- **Параметры:** aspect_ratio = 4:5, resolution = 1K/2K, output_format = png
- **HARD_RULES** вшиты в промпт генерации (язык, бренд, запреты)
- **HMAC-SHA256:** каждый запрос подписан (timestamp + nonce + signature)

## Stage 4: Quality Check

**ОТКЛЮЧЕН.** Код сохранён в `stage4-qa.ts`. Включить при необходимости.

## Stage 5: Kie.ai Image-to-Image

`stage5-kie-image.ts` — чистое профессиональное фото товара.

**Назначение:** убрать watermark'и, стикеры, ценники, фон. Сгенерировать изолированное фото на белом фоне (#FFFFFF).

- Всегда 1 фото (не зависит от cardCount)
- Тот же Kei Proxy протокол (upload → createTask → polling → download)
- Бренд производителя СОХРАНЯЕТСЯ (физически на товаре)
- Лого маркетплейсов УДАЛЯЕТСЯ
- Multi-angle presentation для товаров с деталями с разных сторон

---

## Оркестратор (pipeline.ts)

`pipeline.ts` — управляет всеми стадиями.

**Flow:**
1. Проверка API_KEY, загрузка фото (URL → base64)
2. Stage 1: Vision Analysis
3. Разветвление по `mode`:
   - **product:** Promise.all([Stage 1.5, (Stage 2 → Stage 3), Stage 5]) + R2 upload + category matching
   - **test:** Promise.all([(Stage 2 → Stage 3), Stage 5])
4. Подсчёт стоимости
5. Возврат PipelineResult (cards, prompts, enrichedData, cleanPhoto, productData, imageUrls)

**Category matching:** AI-категория → Supabase categories (через `matchCategoryFromAI`).

**R2 upload:** `uploadCardImages(cards, slug)` + `uploadImage(cleanPhoto)`.

**ProductDraftData:** мерж EnricherOutput + VisionOutput → полный черновик товара (name, slug, title, description, price, benefits, shades, features, FAQ, SEO tags...).

---

## Модели и API

Старые модели (stage3-generate.ts) заменены на Kei Proxy (stage3-generate-kei.ts). Замена прозрачна через TOVAR_AI_CONFIG.

**Kei Proxy:** `n1leads.tapla.az`
- `/api/kei-ai/createTask` — создание задачи с подписанными headers
- `/api/public/status?taskId=...&token=...` — polling статуса
- `/api/upload` — загрузка reference-фото

**HMAC-SHA256 подпись** (`createSignedHeaders`): method + path + timestamp + nonce + body.

---

## Файловая структура

```
src/lib/tovar-ai/
  types.ts              — Все типы (VisionOutput, EnricherOutput, PromptsOutput, CardResult, PipelineResult, KieImageToImageResult, TOVAR_AI_CONFIG)
  stage1-vision.ts      — Vision анализ фото
  stage1.5-enricher.ts  — Полная текстовая карточка товара (NEW)
  stage2-planner.ts     — Stage 2 V1 (хардкод-библиотеки, 7 триад)
  stage2-planner-v2.ts  — Stage 2 V2 (LLM-driven, по умолчанию)
  stage3-generate.ts    — Stage 3 V1 (прямой OpenRouter) — не используется
  stage3-generate-kei.ts — Stage 3 V2 (Kei Proxy, async protocol) — по умолчанию
  stage4-qa.ts          — Quality Check (ОТКЛЮЧЕН)
  stage5-kie-image.ts   — Чистое фото товара (Kie.ai Image-to-Image, всегда 1 шт)
  pipeline.ts           — Оркестратор всех стадий
  proxy-security.ts     — HMAC-SHA256 подпись запросов к Kei Proxy (NEW)
  vision-to-product.ts  — Конвертация VisionOutput → ProductDraftData
  index.ts              — barrel export
  design/               — 11 JSON библиотек (только для Stage 2 V1)
```

---

## API Routes

### POST `/api/tovar-ai/generate`

```
Request:
{
  photoBase64: string,
  photoUrl?: string,
  providerDescription?: string,
  priceAz?: string,           // цена поставщика (AI-ə GETMİR, admin üçün qeyd)
  cardCount?: number,        // 1-10, по умолч. 3
  characteristics?: Record<string, string>,
  template?: string,
  mode?: 'test' | 'product', // 'test' по умолч.
  supplierUrl?: string,
  checkAuth?: boolean        // проверка админ-сессии
}

Response:
{
  success: true,
  generationId: "",
  status: "done",
  cards: [{ index, role, imageBase64, attempt }, ...],
  cardPrompts: [{ index, role, prompt_en }, ...],
  product_analysis: VisionOutput,
  qa_results: QAResult[],
  cost: 0.034,
  productData?: ProductDraftData,
  imageUrls?: string[],
  enrichedData?: EnricherOutput,
  cleanPhoto?: KieImageToImageResult
}
```

### POST `/api/tovar-ai/regenerate-card`

```
Request:  { photoBase64: string, cardPrompt: CardPrompt }
Response: { success: true, card: CardResult }
```

---

## UI (`/admin/tovar-ai`)

React-компонент: Drag&Drop фото → поля (description, price) → кнопка генерации → прогресс-бар → 3 превью → индивидуальная регенерация / скачивание.

---

## Цена (priceAz)

**Цена НЕ передаётся в AI.** Поле `priceAz` сохраняется как `supplier_price` — справочная информация для админа. На сгенерированных карточках цена никогда не отображается. Цену продажи админ устанавливает вручную в карточке товара.

## CLI тест

```bash
npx tsx scripts/test-tovar-ai.ts ./photo.jpg "description" --price "29 AZN" --mode product   # price = supplier only, NOT sent to AI
```

Результат: `.tovar-ai-output/` (product_analysis.json, prompts.json, card_n.png, qa_results.json, enriched_data.json, clean_photo.png).

---

## .env.local

```bash
OPENROUTER_API_KEY=sk-or-v1-...

# Kei Proxy (Stage 3 + Stage 5)
KEI_PROXY_URL=https://n1leads.tapla.az
PROXY_SECRET=...
```

Модели конфигурируются в `src/lib/tovar-ai/types.ts` → `TOVAR_AI_CONFIG`.

---

## Что НЕ реализовано

- Stage 4 (Quality Check) — отключён
- Сохранение в `tovar_ai_generations` таблицу
- Привязка к форме создания товара в админке
- Очередь массовой генерации
