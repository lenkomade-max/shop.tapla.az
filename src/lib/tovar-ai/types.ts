// ============================================================================
// Tovar.AI — все типы для пайплайна генерации карточек товаров
// ============================================================================

// ─── Stage 1: Vision Analysis ───────────────────────────────────────────────

export interface VisionOutput {
  // Базовая идентификация
  product_type: string // "фен", "смартфон", "массажер", "лампа", ...
  category: string // "Бытовая техника", "Электроника", ...
  subcategory: string | null // "Фены", "Смартфоны", ...

  // Внешний вид
  brand: string | null // бренд если виден
  model: string | null // модель если читается
  logo_visible: boolean // виден ли логотип
  inscriptions: string[] // ["Model X200", "220V", ...]
  primary_color: string // основной цвет
  secondary_colors: string[] // дополнительные цвета
  finish: string // "матовый", "глянцевый", "металлик", ...
  shape: string // "овальный", "прямоугольный", "цилиндрический", ...
  material: string // "пластик", "металл", "ABS-пластик", ...
  texture: string | null // "гладкий", "рифленый", "soft-touch", ...

  // Конструкция
  dimensions_estimated: string | null // "примерно 25×20×10 см"
  construction_features: string[] // ["складная ручка", "съемная насадка", ...]
  controls: string[] // ["кнопка вкл/выкл", "регулятор температуры", ...]
  buttons: string[] // ["power", "mode", "+", "-", ...]
  ports: string[] // ["USB-C", "DC input", ...]
  display: string | null // "LED дисплей", ...
  indicators: string[] // ["красный индикатор питания", ...]

  // Комплектация
  package_contents: string[] // ["фен", "насадка-концентратор", ...]
  accessories: string[] // ["чехол", "кабель USB-C", ...]

  // Функциональность
  possible_functions: string[] // ["сушка волос", "укладка", "ионизация", ...]
  intended_use: string // "для сушки и укладки волос в домашних условиях"

  // Сценарии для генерации
  needs_human_model: boolean
  needs_lifestyle_scene: boolean
  recommended_scenes: string[] // ["ванная комната", "салон красоты", ...]
  needs_macro_shots: boolean
  needs_size_comparison: boolean
  needs_exploded_view: boolean

  // Маркетинговые аспекты
  target_audience: string // "женщины 20-45", ...
  key_selling_points: string[] // ["мощный мотор", "ионизация", ...]
  premium_level: 'budget' | 'mid' | 'premium' | 'luxury'
}

// ─── Stage 2: Prompt Planner ────────────────────────────────────────────────

/** Рекламная роль карточки — что она продаёт в этом креативе */
export type CardRole =
  | 'hero' | 'problem' | 'solution' | 'benefits' | 'usage'
  | 'lifestyle' | 'offer' | 'bundle' | 'delivery' | 'comparison' | 'quality'
  | 'materials' | 'warranty' | 'accessories' | 'close_up' | 'cta'
  | 'dimensions' | 'power' | 'premium' | 'review' | 'gift'
  | 'new_arrival' | 'best_seller'

/** Общий визуальный стиль кампании (один на все карточки) */
export interface VisualTheme {
  lighting: string // soft_studio, dramatic_spotlight, natural_daylight, ...
  background_style: string // pure_white, premium_gradient, marble_surface, ...
  mood: string // minimal_luxury, editorial_vogue, tech_innovation, ...
  materials: string[] // matte_glass, brushed_chrome, carbon_fiber, ...
  spatial_depth: string[] // multi_layer_glass, volumetric_light, floating_geometric, ...
  motion: string // dynamic_diagonals, floating_ascending, frozen_motion, ...
}

export interface CardPrompt {
  index: number // 1, 2, 3
  role: CardRole // рекламная роль карточки
  prompt_en: string // полный промпт на английском для Nano Banana
  text_overlay_az: string[] // тексты для карточки на азербайджанском
  composition: string // описание композиции (layout)
  needs_model: boolean
  reference_weight: number // 0.0–1.0
  // 3-слойная система стилей
  creative_style: string // cs01..cs40 — ЧТО в кадре
  marketing_style: string // ms01..ms30 — КАКОЕ сообщение
  visual_theme: VisualTheme // ОБЩИЙ на всю кампанию (одинаковый для всех карточек)
  color_palette: string[] // ["#1A1A2E", "#E94560", ...] общая палитра кампании
}

export interface PromptsOutput {
  style_name: string // строка с выбранными стилями: "cs01+cs07+cs10"
  roles: CardRole[] // выбранные роли для каждой карточки
  marketing_styles: string[] // ms01, ms07, ms03
  visual_theme: VisualTheme // ОДИН на всю кампанию (Brand Identity Lock)
  color_palette: string[] // общая цветовая палитра кампании
  cards: CardPrompt[]
}

// ─── Stage 3: Image Generation ──────────────────────────────────────────────

export interface CardResult {
  index: number
  role: CardRole
  promptUsed: string
  imageBase64: string // base64-encoded PNG
  attempt: number // сколько попыток потребовалось
}

// ─── Stage 4: Quality Check ─────────────────────────────────────────────────

export interface QACheck {
  product_fidelity: boolean // товар выглядит как оригинал
  text_readable: boolean // текст читается и правильный
  no_hallucinations: boolean // нет лишних деталей
  composition_ok: boolean // композиция соответствует рекламной роли
  style_consistent: boolean // стиль совпадает с другими
}

export interface QAResult {
  card_index: number
  passed: boolean
  checks: QACheck
  issues: string[]
  score: number // 0–100
}

// ─── Pipeline ────────────────────────────────────────────────────────────────

export type GenerationStatus =
  | 'pending'
  | 'analyzing'
  | 'planning'
  | 'generating'
  | 'checking'
  | 'done'
  | 'failed'

export type PipelineMode = 'test' | 'product'

export interface PipelineInput {
  photoUrl: string // URL загруженного фото
  photoBase64?: string // или сразу base64 (для CLI)
  providerDescription?: string // описание поставщика
  characteristics?: Record<string, string> // доп. характеристики
  priceAz?: string // цена (напр. "29 AZN") — только если задана юзером
  mode?: PipelineMode // 'test' (по умолч.) | 'product'
  supplierUrl?: string // URL поставщика (только в product mode)
  cardCount?: number // сколько карточек генерить (1-10, по умолч. 3)
  /** Шаблон генерации:
   * - 'auto' (по умолч.) — AI сам выбирает стиль на основе анализа товара
   * - 'default' — случайный выбор из всех триад
   * - 'benefit_solution' — форсирует problem_solution / relief_solution триаду */
  template?: 'auto' | 'default' | 'benefit_solution'
}

export interface GenerationRecord {
  id: string
  product_id: string | null
  source_photo: string
  product_analysis: VisionOutput | null
  prompts_json: PromptsOutput | null
  cards: CardResult[]
  qa_results: QAResult[]
  status: GenerationStatus
  error: string | null
  cost: number
  mode: PipelineMode
  supplier_url: string | null
  product_data: Record<string, unknown> | null
  image_urls: string[]
  ready_for_publish: boolean
  created_at: string
  updated_at: string
}

export interface ProductDraftData {
  name: string
  slug: string
  title: string
  subtitle: string
  description: string
  category: string
  category_id?: string | null     // UUID ссылка на categories.id
  category_slug?: string | null   // slug категории (для URL)
  price: number
  benefits: string[]
  how_to_use: string
  ingredients: string | null
  tags: string[]
  images: string[]
  supplier_url?: string
  // Stage 1.5 enrichment
  is_new?: boolean
  shades?: Array<{ name: string; colorHex: string; isHot?: boolean; label?: string }>
  try_on_enabled?: boolean
  features?: string[]             // 8-20 ключевых особенностей
  ideal_for?: string              // для кого подходит
  use_cases?: string[]            // сценарии использования
  care_instructions?: string | null
  compatibility?: string | null
  faq?: Array<{ question: string; answer: string }>
  search_keywords?: string[]      // 30-100 поисковых фраз (на английском)
}

/**
 * Stage 1.5: EnricherOutput — AI-сгенерированная карточка товара.
 * Возвращается из stage1.5-enricher.ts и мержится в ProductDraftData.
 * Все поля на азербайджанском (кроме search_keywords_az — на английском).
 */
export interface EnricherOutput {
  // ─── Заголовки ────────────────────────────────────────────────────
  name_az: string                 // "Dyson Supersonic saç qurudan"
  title_az: string                // ~60-70 символов, естественный, с поисковыми фразами
  subtitle_az: string | null      // Главное преимущество, не слоган

  // ─── Основной контент ─────────────────────────────────────────────
  description_az: string          // 300-800 слов, максимум деталей, списки, абзацы
  benefits_az: string[]           // 6-12 преимуществ, каждое — законченная мысль
  how_to_use_az: string           // Пошаговая инструкция (если сложный товар) или советы
  ingredients_az: string | null   // Только для косметики, иначе null

  // ─── Характеристики и детали ──────────────────────────────────────
  features_az: string[]           // 8-20 ключевых особенностей
  ideal_for_az: string            // Кому подходит этот товар
  use_cases_az: string[]          // 3-8 реальных сценариев использования
  care_instructions_az: string | null  // Уход за товаром (если применимо)
  compatibility_az: string | null      // Совместимость (если применимо)

  // ─── FAQ ──────────────────────────────────────────────────────────
  faq_az: Array<{ question: string; answer: string }>  // 3-8 частых вопросов

  // ─── SEO ──────────────────────────────────────────────────────────
  tags_az: string[]               // 15-40 тегов на азербайджанском
  search_keywords_az: string[]    // 30-100 поисковых фраз (на АНГЛИЙСКОМ, для внутреннего поиска)
  slug: string | null             // SEO-URL; null = стандартная генерация

  // ─── Визуальные варианты ──────────────────────────────────────────
  shades: Array<{ name: string; colorHex: string; isHot?: boolean }>  // цвета/оттенки
  try_on_enabled: boolean         // true для косметики/очков
}

export interface PipelineResult {
  generationId: string
  status: GenerationStatus
  product_analysis: VisionOutput
  prompts: PromptsOutput
  cards: CardResult[]
  qa_results: QAResult[]
  cost: number
  productData?: ProductDraftData // только в product mode
  imageUrls?: string[] // R2 URLs сгенерированных карточек
  enrichedData?: EnricherOutput // Stage 1.5 — данные до мержа с детерминированными полями
}

// ─── Конфигурация (хардкод, только ключ из .env) ────────────────────────────

export const TOVAR_AI_CONFIG = {
  /** Менять здесь при смене моделей */
  VISION_MODEL: 'google/gemma-4-31b-it' as const,   // Gemini + Vision + текст
  ENRICHER_MODEL: 'google/gemma-4-31b-it' as const,  // Stage 1.5: Data Enricher (та же Gemma)
  PLANNER_MODEL: 'google/gemini-3.1-flash-image-preview' as const,
  IMAGE_MODEL: 'google/gemini-3.1-flash-image-preview' as const, // Nano Banana 2
  QA_MODEL: 'google/gemma-4-31b-it' as const, // Vision-capable, free

  // Настройки генерации
  DEFAULT_CARD_COUNT: 3,
  IMAGE_SIZE: '1K' as '1K' | '2K',
  ASPECT_RATIO: '4:5', // портрет, совпадает с ProductCard aspect-[4/5]
  MAX_RETRIES: 2,

  // OpenRouter
  OPENROUTER_BASE_URL: 'https://openrouter.ai/api/v1',

  // Kei Proxy (n1leads.tapla.az) — Stage 3 image generation
  KEI_PROXY_URL: process.env.KEI_PROXY_URL || 'https://n1leads.tapla.az',
  PROXY_SECRET: process.env.PROXY_SECRET || '',

  /** Единственное что берётся из .env */
  get API_KEY() {
    return process.env.OPENROUTER_API_KEY || ''
  },
} as const
