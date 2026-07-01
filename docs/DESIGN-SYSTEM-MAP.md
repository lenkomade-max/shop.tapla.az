# Карта дизайн-системы Tovar.AI

## Общая архитектура: как из фото получается 3 карточки

```
ФОТО ТОВАРА (Base64)
    │
    ▼
┌─────────────────────────────────────────────────┐
│ STAGE 1 — Vision Analysis                        │
│ Модель: Gemma 4 31B (бесплатно)                  │
│ Файл: stage1-vision.ts                           │
│                                                   │
│ Что делает: смотрит на фото → описывает товар     │
│ Выход: VisionOutput (25+ полей)                   │
│  • product_type, category, brand, colors          │
│  • material, finish, shape                        │
│  • possible_functions, key_selling_points         │
│  • needs_human_model, needs_lifestyle_scene       │
│  • premium_level: budget | mid | premium | luxury │
│  • target_audience, recommended_scenes            │
└─────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────┐
│ STAGE 2 — Creative Director + Prompt Planner      │
│ Модель: Gemini 3.1 Flash Lite (~$0.001)           │
│ Файл: stage2-planner.ts (1097 строк)              │
│                                                   │
│ Это СЕРДЦЕ системы. Здесь собираются промпты.     │
│ См. детальную схему Stage 2 ниже.                 │
│                                                   │
│ Выход: PromptsOutput                              │
│  • 3 кастомных промпта для Nano Banana            │
│  • Общий Brand Identity Lock (палитра, тема)      │
└─────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────┐
│ STAGE 3 — Image Generation (PARALLEL)             │
│ Модель: Nano Banana 2 ($0.008/шт)                 │
│ Файл: stage3-generate.ts                          │
│                                                   │
│ 3 запроса ОДНОВРЕМЕННО (Promise.allSettled)       │
│ Каждый: промпт + reference-фото                   │
│ Ретраи: 429 (rate limit), safety refusal          │
│ Выход: 3 PNG Base64                               │
└─────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────┐
│ STAGE 4 — Quality Check                           │
│ Модель: Gemma 4 31B (бесплатно)                   │
│ Файл: stage4-qa.ts                                │
│                                                   │
│ 5 проверок: fidelity, text, hallucinations,       │
│ composition, style. Score 0-100.                   │
│ БЕЗ авто-регенерации (админ решает сам)           │
└─────────────────────────────────────────────────┘
    │
    ▼
  3 готовых карточки (PNG)
```

---

## Детальная схема Stage 2 (самая сложная часть)

```
VisionOutput (из Stage 1)
    │
    ├──→ selectTriad()          — выбор триады ролей
    ├──→ selectColorPalette()   — выбор цветовой палитры
    ├──→ pickSharedVisualTheme()— выбор ОБЩЕГО visual theme
    ├──→ pickCreativeStyle()    — выбор creative style на каждую роль
    └──→ pickMarketingStyle()   — выбор marketing style на каждую роль
    │
    ▼
buildUserPrompt() — собирает ОГРОМНЫЙ промпт для LLM
    │
    ├── Система ролей (триады)
    ├── Цветовая палитра (из COLOR_PALETTES)
    ├── Visual Theme (из visual-themes.json)
    ├── Creative Styles (из creative-styles.json)
    ├── Marketing Styles (из marketing-styles.json)
    ├── Layouts (из layouts.json)
    ├── Positions (из positions.json)
    ├── Backgrounds (из backgrounds.json)
    ├── Visual Effects (из visual-effects.json)
    ├── Composition Rules (из composition-rules.json)
    ├── Marketplace Rules (из marketplace-rules.json)
    ├── Creative Director (из creative-director.json)
    └── COMPOSITION_VARIATIONS (хардкод в stage2-planner.ts)
    │
    ▼
LLM (Gemini Flash Lite) возвращает JSON с 3 карточками
    │
    ▼
Постобработка: каждый промпт = BASE_PROMPT + design decisions + LLM-контент
```

---

## ТРИАДЫ РОЛЕЙ (7 штук, хардкод в stage2-planner.ts)

Это КАМПАНИИ. Одна триада = одна генерация (3 карточки). Card 1 ВСЕГДА 'hero'.

| Триада | Card 1 | Card 2 | Card 3 | Когда используется |
|--------|--------|--------|--------|-------------------|
| product | hero | usage | close_up | Универсальная |
| quality | hero | quality | materials | Премиум-товары |
| features | hero | benefits | power | Техника, электроника |
| trust | hero | comparison | review | Социальное доказательство |
| premium | hero | lifestyle | gift | Люкс, подарки |
| offer | hero | bundle | cta | Акции, промо |
| problem_solution | hero | problem | solution | Товары-решатели проблем |
| relief_solution | hero | problem | solution | То же, но эмоциональнее (NEW) |

**Как выбирается:** случайно из всех 8 (если template=auto и товар problem_solver → 60% шанс problem/relief)

---

## 23 РОЛИ (CardRole)

Каждая роль определяет ЧТО карточка должна коммуницировать:

| Роль | Описание | Пример товара |
|------|----------|--------------|
| hero | Главный промо-шот, продукт доминирует | Любой |
| problem | Визуализация проблемы (before) | Вентилятор (жара) |
| solution | Продукт как решение (after) | Вентилятор (прохлада) |
| benefits | Карточки преимуществ вокруг продукта | Техника |
| usage | Реальное использование человеком | Фен, инструмент |
| lifestyle | Красивая среда, журнальный стиль | Декор, косметика |
| quality | Материалы и крафтsmanship | Premium товары |
| materials | Экстремальный фокус на материалах | Кожа, металл |
| close_up | Макро-деталь | Текстура, кнопки |
| power | Производительность, скорость, энергия | Электроника |
| premium | Люкс-позиционирование | High-end |
| gift | Подарочная презентация | Подарки |
| offer | Промо-карточка, скидка | Акции |
| bundle | Всё включено, комплект | Наборы |
| cta | Конверсионная инфографика | SALE |
| comparison | Сравнение с альтернативой | Любой |
| review | Отзывы, социальное доказательство | Популярные |
| delivery | Быстрая доставка | Любой |
| warranty | Гарантия и надёжность | Электроника |
| accessories | Аксессуары в комплекте | Наборы |
| dimensions | Размер и масштаб | Портативное |
| new_arrival | Новинка | Новые |
| best_seller | Хит продаж | Популярные |

---

## КАК СОБИРАЕТСЯ ФИНАЛЬНЫЙ ПРОМПТ

Каждый из 3 промптов собирается так:

```
[1] BASE_PROMPT          — жёсткие правила: язык, запреты, стиль лейблов, фон
[2] colorInstruction      — как использовать палитру (мягче для окружения)
[3] CAMPAIGN IDENTITY     — Lighting, Background, Mood (ОБЩИЕ на все 3)
[4] blurredBgInstruction  — если фон blurred_* → 3-слойная композиция
[5] Scene Materials       — материалы сцены из visual-themes
[6] Spatial Depth         — глубина пространства
[7] Motion Energy         — динамика
[8] COMPOSITION VARIATION — уникальный комп. приём (12 вариантов, не повторяются)
[9] COMMERCIAL DENSITY    — сколько блоков, какие (3-8 для любой роли)
[10] Price / Warranty     — если заданы
[11] ADVERTISING ROLE     — роль + описание
[12] Creative Style       — cs01..cs41
[13] Marketing Style      — ms01..ms31
[14] commercialBlocks      — что рисовать на плашках
[15] distinctFromOthers    — чем отличается от других карточек
[16] text_overlay_az       — азербайджанский текст
[17] LLM prompt_en         — то что LLM сам придумал
```

---

## ДИЗАЙН-БИБЛИОТЕКИ (11 JSON + хардкод)

### 1. creative-styles.json — ЧТО в кадре (41 стиль)
Файл: `src/lib/tovar-ai/design/creative-styles.json`

Это композиция кадра. Примеры:
- cs01 Hero Product — большой продукт в центре, 70-80% кадра
- cs05 Floating Labels — продукт + указательные линии к лейблам
- cs06 Product In Hand — реалистичная рука держит продукт
- cs07 Product In Use — человек использует продукт
- cs09 Before & After — split-сцена до/после
- cs41 Solution Relief — продукт-спаситель с размытым After-фоном (NEW)

**Механизм выбора:** для каждой роли есть список разрешённых стилей (`ROLE_CREATIVE_STYLES`). Выбирается первый подходящий (без модели если товар без человека, без окружения если не нужно).

### 2. marketing-styles.json — КАКОЕ сообщение (31 стиль)
Файл: `src/lib/tovar-ai/design/marketing-styles.json`

Это маркетинговый угол. Примеры:
- ms03 Feature First — одна фича как герой
- ms04 Premium Quality — люкс, материалы, крафт
- ms21 Before/After — трансформация
- ms27 Hero Product — продукт как главный герой
- ms30 Call To Action — мягкий призыв к действию
- ms31 Problem Solver — товар решает проблему (NEW)

**Механизм выбора:** `ROLE_MARKETING_STYLES` для каждой роли. Первый совпавший.

### 3. visual-themes.json — КАК выглядит (освещение, фон, настроение, материалы, глубина, движение)
Файл: `src/lib/tovar-ai/design/visual-themes.json`

6 компонентов visual theme:

**Lighting (8 вариантов):**
soft_studio, dramatic_spotlight, natural_daylight, dark_moody, high_contrast, golden_hour, rim_light, softbox_diffused

**Background Style (13 вариантов):**
pure_white, premium_gradient, dark_studio, marble_surface, wood_surface, metal_surface, glass_surface, environmental, abstract_tech, editorial_backdrop, blurred_lifestyle (NEW), blurred_usage_context (NEW), blurred_lifestyle_holding (NEW)

**Mood (10 вариантов):**
minimal_luxury, editorial_vogue, tech_innovation, warm_cozy, dynamic_action, clean_clinical, industrial_premium, scandinavian, classic_luxury, modern_sleek

**Materials (12 вариантов):**
matte_glass, clear_acrylic, brushed_chrome, liquid_metal, carbon_fiber, satin_fabric, polished_aluminum, ceramic, glossy_lacquer, natural_stone, walnut_wood, soft_rubber

**Spatial Depth (9 вариантов):**
multi_layer_glass, volumetric_light, floating_geometric, liquid_abstract_forms, neon_glow_depth, soft_mist_layers, acrylic_light_halos, reflection_infinity, particle_atmosphere

**Motion (8 вариантов):**
dynamic_diagonals, floating_ascending, frozen_motion, swirling_flow, radial_burst, gentle_drift, wave_pulse, still_precision

**Category Matching:** для каждой из 9 категорий товаров заданы предпочтительные lighting/background/mood/materials/depth/motion + общая атмосфера.

**Механизм выбора (Brand Identity Lock):**
1. Берётся anchor-роль (первая в триаде = hero)
2. Из `ROLE_VISUAL_THEMES` берутся дефолтные lighting/background/mood для hero
3. Если они есть в category_matching для категории товара → используются
4. Если нет → случайный выбор из category_matching
5. Materials, spatial_depth, motion — всегда из category_matching
6. **Результат ОДИН на все 3 карточки** — это Brand Identity Lock

### 4. layouts.json — СТРУКТУРА макета (8 вариантов)
Файл: `src/lib/tovar-ai/design/layouts.json`

A: Vertical Stack (заголовок→продукт→3 карточки→CTA)
B: Split Left-Right (продукт слева 55%, инфо справа 45%)
C: Floating Hero (огромный продукт, лейблы вокруг)
D: Headline + Product + Offer
F: Price First
G: Problem → Solution
H: Pure Product (только продукт 75% + 1 строка)
features_row: Feature Row (продукт 45% + 4 иконки)

### 5. positions.json — ПОЗИЦИЯ продукта (18 вариантов)
Файл: `src/lib/tovar-ai/design/positions.json`

Center front, Slightly left/right, 45° rotated, Floating mid-air, On surface, In hand, Macro close-up, Top-down flat lay, Side profile, Front/Back 3/4...

### 6. backgrounds.json — ФОНЫ по категориям
Файл: `src/lib/tovar-ai/design/backgrounds.json`

9 категорий с 3-5 вариантами фонов для каждой (beauty, electronics, kitchen, fitness, office, automotive, home_decor, pet, fashion_accessories + universal).

### 7. visual-effects.json — ЭФФЕКТЫ (17 вариантов)
Файл: `src/lib/tovar-ai/design/visual-effects.json`

soft_glow, reflection, water_splash, steam, spark, motion_blur, particles, light_rays, bubbles, luxury_highlights, energy_glow, foam, ice_frost, lens_flare, smoke_mist, none.

### 8. composition-rules.json — ПРАВИЛА композиции
Файл: `src/lib/tovar-ai/design/composition-rules.json`

### 9. marketplace-rules.json — ПРАВИЛА маркетплейса
Файл: `src/lib/tovar-ai/design/marketplace-rules.json`

### 10. creative-director.json — 6 ЧЕКОВ саморецензии
Файл: `src/lib/tovar-ai/design/creative-director.json`

### 11. marketing-angles.json — МАРКЕТИНГОВЫЕ УГЛЫ
Файл: `src/lib/tovar-ai/design/marketing-angles.json`

### 12. COMPOSITION_VARIATIONS — хардкод в stage2-planner.ts (13 вариантов)

Это НЕ компоновка как layouts, а КОМПОЗИЦИОННЫЙ ПРИЁМ — как организовано пространство:
- asymmetric_left/right — асимметрия
- diagonal_flow/reverse — диагональный поток
- product_oversized — продукт 80% кадра
- grid_cards — продукт сверху, сетка карточек снизу
- vertical_stack — всё вертикально
- product_left_strip — продукт слева 30%
- floating_chaos — хаотично разбросанные карточки
- top_heavy — заголовок+карточки сверху, продукт снизу
- framed_product — карточки рамкой вокруг продукта
- exploded_technical — техническая схема с линиями
- blurred_after_background — размытый After-фон (NEW)

**Каждая из 3 карточек получает УНИКАЛЬНЫЙ приём (без повторений).**

---

## ЦВЕТОВЫЕ ПАЛИТРЫ (хардкод в stage2-planner.ts)

По premium_level (из Stage 1):

| Уровень | Палитры |
|---------|---------|
| luxury | Dark Gold, Midnight Sapphire, Emerald Prestige, Platinum |
| premium | Electric Blue, Crimson Bold, Violet Impact, Teal Modern |
| mid | Orange Fresh, Sky Blue, Green Natural |
| budget | Clean Blue, Warm Red |

**Механизм выбора:** фильтр по категории товара (best_for), если нет совпадения → случайная.

---

## КОММЕРЧЕСКАЯ ПЛОТНОСТЬ (хардкод в stage2-planner.ts)

`ROLE_COMMERCIAL_DENSITY` — для каждой роли задано сколько коммерческих блоков (3-8) и какие.

```
benefits/power: 5-8 блоков (максимум)
hero/premium/quality: 4-6 блоков
offer/cta/delivery: 4-6 блоков
usage/lifestyle: 3-5 блоков
problem/solution/gift: 3-5 блоков
```

**Минимум 3 блока на ЛЮБУЮ карточку.** Нет пустых зон.

---

## BASE_PROMPT — жёсткие правила (хардкод в stage2-planner.ts)

Это основа каждого промпта. Приоритеты Nano Banana:

1. **ЗАПРЕТЫ** (94% compliance): язык AZ, нет кнопок, нет логотипов, нет выдуманных цен, нет копирования с reference-фото, нет hex-кодов, один фрейм
2. **ПРОДУКТ**: 65-75% кадра, форма/цвет/пропорции неизменны
3. **СТИЛЬ ЛЕЙБЛОВ**: иконка + текст НАПРЯМУЮ на фоне — БЕЗ боксов, панелей, pill-форм, glassmorphism-контейнеров. Тонкие pointer lines 1px
4. **ФОН**: глубокий комплементарный градиент (не цвета продукта). ИЛИ размытая реальная сцена для solution/usage/lifestyle
5. **ТИПОГРАФИЯ**: заголовок — крупный bold sans-serif; лейблы — меньше, прямо на фоне
6. **ЦВЕТ**: палитра = акцент (линии, иконки, декор), НЕ заливка фона

---

## SYSTEM_PROMPT — Creative Director (хардкод в stage2-planner.ts)

LLM получает роль «Senior Visual Designer for TAPLA MARKETPLACE». Инструкции:
1. MESSAGE → LAYOUT → DESIGN (в этом порядке)
2. Все 3 карточки = ОДНА кампания (общая палитра, свет, фон, mood)
3. Но РАЗНЫЕ композиции, позиции продукта, фокусные точки
4. Запрещены: шаблон «заголовок→продукт→2 карточки» для всех 3, продукт <60%, кнопки, пустые постеры

---

## ПОТОК ВЫБОРА ФОНА (как система решает какой фон использовать)

```
selectTriad(analysis, template)
    │
    ├── template='benefit_solution' → problem_solution ИЛИ relief_solution
    ├── template='default' → случайная из 8 триад
    └── template='auto' →
        ├── isProblemSolver() → 60% problem/relief, 40% остальные
        └── не problem_solver → случайная из 8
    │
    ▼
pickSharedVisualTheme(triad, vision, visualThemes)
    │
    ├── anchorRole = triad.roles[0] (ВСЕГДА 'hero')
    ├── roleDefaults = ROLE_VISUAL_THEMES['hero']
    │   → { lighting: 'soft_studio', background_style: 'premium_gradient', mood: 'minimal_luxury' }
    ├── categoryMatch = visualThemes.category_matching[vision.category]
    ├── Если roleDefaults.lighting ЕСТЬ в categoryMatch.lighting → используют roleDefaults
    ├── Если НЕТ → случайный из categoryMatch.lighting
    ├── ТО ЖЕ для background_style и mood
    ├── materials, depth, motion → ВСЕГДА из categoryMatch
    │
    ▼
ОДИН VisualTheme НА ВСЕ 3 КАРТОЧКИ (Brand Identity Lock)
```

**Ключевой момент:** фон определяется hero-ролью через category_matching. Если premium_gradient есть в списке для категории → используется premium_gradient для ВСЕЙ кампании. Если нет → случайный из списка категории.

---

##