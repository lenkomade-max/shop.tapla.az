// ============================================================================
// Stage 1: Vision Analysis
// Дешёвая Vision-модель анализирует фото товара → строгий JSON
// ============================================================================

import { TOVAR_AI_CONFIG, type VisionOutput } from './types'

const SYSTEM_PROMPT = `You are a product image analyzer for an Azerbaijani e-commerce marketplace.

Analyze the product photo in extreme detail. Your output MUST be valid JSON following the exact schema.

RULES:
1. Extract EVERYTHING visible: type, brand, color, material, shape, controls, buttons, ports, display, packaging, accessories, inscriptions, indicators — everything.
2. Determine if the product needs a human model in marketing images (e.g. wearable items, items used by a person = yes; standalone objects = no).
3. Determine if lifestyle scenes are needed (e.g. lamp in interior = yes; USB cable = no).
4. Identify realistic usage scenarios for this product.
5. Identify key selling points based on visible features.
6. Estimate premium level from visual quality: budget / mid / premium / luxury.
7. All text fields in English. Arrays can be empty [] but strings should have values.
8. For fields you genuinely cannot determine, use null for strings, false for booleans, [] for arrays.
9. BUT try to infer reasonable values — if it looks like a hair dryer, say "fen" for product_type.
10. Return ONLY valid JSON, no markdown, no code fences, no extra text.`

const USER_PROMPT_TEMPLATE = `Analyze this product photo and return a JSON object with ALL of the following fields.

product_type: string — specific type (e.g. "fen", "smartfon", "massajer", "lampa", "toaster", "qulaqlıq", "powerbank", "çaydan", "üstü", "qarışdırıcı", "ütü", "tozsoran", "soyuducu", "paltaryuyan", "televizor", "planşet", "noutbuk", "saat", "qulaqcıq", "klaviatura", "siçan", "monitor", "printer", "kamera", "oyun konsolu", "router", "modem")
category: string — broad category (e.g. "Elektronika", "Məişət texnikası", "Kosmetika", "Mətbəx", "İdman", "Aksesuarlar", "Uşaq malları")
subcategory: string | null — narrower subcategory if visible
brand: string | null — brand name if visible on the product
model: string | null — model name/number if visible
logo_visible: boolean — is a brand logo visible?
inscriptions: string[] — any text/inscriptions visible on the product or packaging
primary_color: string — main color of the product
secondary_colors: string[] — additional colors
finish: string — surface finish: "mat", "parlaq", "metalik", "şəffaf", "teksturalı"
shape: string — overall shape description
material: string — main material: "plastik", "metal", "şüşə", "rezin", "parça", "keramika", "dəri", "ABS-plastik", "alüminium", "paslanmaz polad"
texture: string | null — surface texture if notable: "hamar", "yivli", "soft-touch", "dənəli"
dimensions_estimated: string | null — rough size estimate if possible: "təxminən 25×20×10 sm"
construction_features: string[] — notable construction details: "qatlanan tutacaq", "çıxarılan nozzlə", "tənzimlənən hündürlük"
controls: string[] — control types: "düymə", "sensor panel", "fırlanan tənzimləyici", "sürüşdürmə açarı"
buttons: string[] — individual button labels: "power", "mode", "+", "-", "start", "stop"
ports: string[] — connectors/ports: "USB-C", "microUSB", "DC giriş", "3.5mm jak", "HDMI", "SD kart"
display: string | null — display type if present: "LED displey", "rəqəmsal ekran", "sensor ekran"
indicators: string[] — indicator lights: "qırmızı güc indikatoru", "mavi bluetooth işığı"
package_contents: string[] — what's in the box/visible: "fen", "nozzle", "diffuzor", "təlimat"
accessories: string[] — accessories visible: "qutu", "USB kabel", "enstruksiya", "zaryadka"
possible_functions: string[] — what this product can do: "saç qurutma", "üslub", "ionizasiya", "soyuq hava"
intended_use: string — primary use case: "saç qurutmaq və üslub vermək üçün ev şəraitində"
needs_human_model: boolean — does this product need a human model for demonstration? (clothes/headphones/watches/hair tools = yes; lamps/cables/chargers = no)
needs_lifestyle_scene: boolean — does it need an interior/scene background? (furniture/lamps/decor = yes; cables/adapters = no)
recommended_scenes: string[] — recommended scene types: "vanna otağı", "salon", "yataq otağı", "ofis", "mətbəx"
needs_macro_shots: boolean — would macro close-ups of details be useful?
needs_size_comparison: boolean — would showing size relative to something be useful?
needs_exploded_view: boolean — would an exploded/breakdown view be useful?
target_audience: string — target audience: "qadınlar 20-45", "peşəkarlar", "bütün yaşlar", "uşaqlar"
key_selling_points: string[] — 3-5 key selling points visible or inferrable from the product
premium_level: "budget" | "mid" | "premium" | "luxury" — estimate from visual quality, materials, packaging

Respond ONLY with the JSON object. No markdown, no code fences, no explanation.`

/**
 * Stage 1: Анализ фото товара через дешёвую Vision-модель.
 * Возвращает структурированный VisionOutput.
 */
export async function analyzeProductImage(
  photoBase64: string,
  providerDescription?: string,
  characteristics?: Record<string, string>,
): Promise<VisionOutput> {
  const config = TOVAR_AI_CONFIG

  // Определяем MIME-тип по сигнатуре base64
  const mimeType = detectMimeType(photoBase64) || 'image/jpeg'

  let userMessage = USER_PROMPT_TEMPLATE
  if (providerDescription) {
    userMessage += `\n\nProvider description: ${providerDescription}`
  }
  if (characteristics && Object.keys(characteristics).length > 0) {
    userMessage += `\n\nCharacteristics: ${JSON.stringify(characteristics)}`
  }

  const body: OpenRouterRequest = {
    model: config.VISION_MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: userMessage,
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:${mimeType};base64,${photoBase64}`,
            },
          },
        ],
      },
    ],
    // Принуждаем JSON-ответ через response_format
    response_format: { type: 'json_object' },
    temperature: 0.1, // минимальная температура для стабильного JSON
    max_tokens: 4096,
  }

  const response = await fetch(
    `${config.OPENROUTER_BASE_URL}/chat/completions`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  )

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(
      `Stage 1 Vision API error ${response.status}: ${errText.slice(0, 500)}`,
    )
  }

  const data: OpenRouterResponse = await response.json()
  const raw = data.choices?.[0]?.message?.content || ''

  // Парсим JSON, очищая возможные code fences
  const json = parseJSON<VisionOutput>(raw)

  // Валидация обязательных полей
  validateVisionOutput(json)

  return json
}

// ─── OpenRouter raw types ────────────────────────────────────────────────────

interface OpenRouterRequest {
  model: string
  messages: Array<{
    role: 'system' | 'user'
    content: string | Array<
      | { type: 'text'; text: string }
      | { type: 'image_url'; image_url: { url: string } }
    >
  }>
  response_format?: { type: 'json_object' }
  temperature?: number
  max_tokens?: number
}

interface OpenRouterResponse {
  choices?: Array<{
    message?: { role: string; content: string }
  }>
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function detectMimeType(base64: string): string | null {
  // JPEG: /9j/
  if (base64.startsWith('/9j/')) return 'image/jpeg'
  // PNG: iVBORw0
  if (base64.startsWith('iVBORw0')) return 'image/png'
  // GIF: R0lGOD
  if (base64.startsWith('R0lGOD')) return 'image/gif'
  // WebP: UklGR
  if (base64.startsWith('UklGR')) return 'image/webp'
  return null
}

function parseJSON<T>(raw: string): T {
  // Убираем markdown code fences если есть
  let cleaned = raw.trim()
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '')
  }
  return JSON.parse(cleaned) as T
}

function validateVisionOutput(obj: VisionOutput): void {
  const requiredStrings: (keyof VisionOutput)[] = [
    'product_type',
    'category',
    'primary_color',
    'finish',
    'shape',
    'material',
    'intended_use',
    'target_audience',
    'premium_level',
  ]
  for (const key of requiredStrings) {
    if (!obj[key] || typeof obj[key] !== 'string') {
      ;(obj as unknown as Record<string, unknown>)[key] =
        key === 'premium_level' ? 'mid' : 'неизвестно'
    }
  }
  const requiredArrays: (keyof VisionOutput)[] = [
    'secondary_colors',
    'inscriptions',
    'construction_features',
    'controls',
    'buttons',
    'ports',
    'indicators',
    'package_contents',
    'accessories',
    'possible_functions',
    'recommended_scenes',
    'key_selling_points',
  ]
  for (const key of requiredArrays) {
    if (!Array.isArray(obj[key])) {
      ;(obj as unknown as Record<string, unknown>)[key] = []
    }
  }
  const requiredBools: (keyof VisionOutput)[] = [
    'logo_visible',
    'needs_human_model',
    'needs_lifestyle_scene',
    'needs_macro_shots',
    'needs_size_comparison',
    'needs_exploded_view',
  ]
  for (const key of requiredBools) {
    if (typeof obj[key] !== 'boolean') {
      ;(obj as unknown as Record<string, unknown>)[key] = false
    }
  }
  if (typeof obj.premium_level !== 'string' ||
      !['budget', 'mid', 'premium', 'luxury'].includes(obj.premium_level)) {
    obj.premium_level = 'mid'
  }
}
