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

export interface CardPrompt {
  index: number // 1, 2, 3
  purpose: 'main_cover' | 'usage_demo' | 'features_detail'
  prompt_en: string // полный промпт на английском для Nano Banana (style уже вшит)
  text_overlay_az: string[] // тексты для карточки на азербайджанском
  composition: string // описание композиции
  needs_model: boolean
  reference_weight: number // 0.0–1.0
}

export interface PromptsOutput {
  style_name: string // имя выбранного стиля (из папки styles/)
  cards: CardPrompt[]
}

// ─── Stage 3: Image Generation ──────────────────────────────────────────────

export interface CardResult {
  index: number
  purpose: CardPrompt['purpose']
  promptUsed: string
  imageBase64: string // base64-encoded PNG
  attempt: number // сколько попыток потребовалось
}

// ─── Stage 4: Quality Check ─────────────────────────────────────────────────

export interface QACheck {
  product_fidelity: boolean // товар выглядит как оригинал
  text_readable: boolean // текст читается и правильный
  no_hallucinations: boolean // нет лишних деталей
  composition_ok: boolean // композиция соответствует purpose
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

export interface PipelineInput {
  photoUrl: string // URL загруженного фото
  photoBase64?: string // или сразу base64 (для CLI)
  providerDescription?: string // описание поставщика
  characteristics?: Record<string, string> // доп. характеристики
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
  created_at: string
  updated_at: string
}

export interface PipelineResult {
  generationId: string
  status: GenerationStatus
  product_analysis: VisionOutput
  prompts: PromptsOutput
  cards: CardResult[]
  qa_results: QAResult[]
  cost: number
}

// ─── Конфигурация (хардкод, только ключ из .env) ────────────────────────────

export const TOVAR_AI_CONFIG = {
  /** Менять здесь при смене моделей */
  VISION_MODEL: 'google/gemma-4-31b-it' as const,   // Gemini + Vision + текст
  PLANNER_MODEL: 'google/gemini-3.1-flash-lite' as const,
  IMAGE_MODEL: 'google/gemini-3.1-flash-image-preview' as const, // Nano Banana 2
  QA_MODEL: 'openai/gpt-4o-mini' as const,

  // Настройки генерации
  DEFAULT_CARD_COUNT: 3,
  IMAGE_SIZE: '1K' as '1K' | '2K',
  ASPECT_RATIO: '1:1',
  MAX_RETRIES: 2,

  // OpenRouter
  OPENROUTER_BASE_URL: 'https://openrouter.ai/api/v1',

  /** Единственное что берётся из .env */
  get API_KEY() {
    return process.env.OPENROUTER_API_KEY || ''
  },
} as const
