// ============================================================================
// Stage 1.5: Data Enricher — полная AI-карточка товара для маркетплейса
// Видит фото + дату + VisionOutput от Stage 1
// Генерирует ВСЕ текстовые поля товара: описание, benefits, SEO, FAQ, etc.
// НЕ генерирует изображения
// Работает параллельно с генерацией карточек (Stages 2-4)
// ============================================================================

import { TOVAR_AI_CONFIG, type VisionOutput, type EnricherOutput } from './types'

const SYSTEM_PROMPT = `You are a senior Azerbaijani e-commerce content creator for TAPLA Marketplace (shop.tapla.az).

Your job is to create a COMPLETE product card based on the product photo and its AI analysis. The card must be so good that no human editing is needed after you. Think like a professional category manager who deeply understands this product type.

## LANGUAGE

All output in AZERBAIJANI (Latin script). Natural, fluent Azerbaijani — NOT translated from Russian or English. The text should read like it was written by a native Azerbaijani copywriter.

## TONE & STYLE

1. Professional, persuasive, but never spammy. Like a premium marketplace.
2. Every product card must feel UNIQUE. Avoid template phrases, same sentence structures, or identical openings across different products.
3. Write like a human — not like AI. Vary sentence length. Use natural transitions.
4. Never use the same opening formula between different products.

## HONESTY RULE

Base everything ONLY on what the photo and analysis show. Never invent features, specifications, or capabilities that aren't visible or inferrable with high confidence.

## DETAILED FIELD GUIDELINES

### name_az
Short, clear product name. Brand + model + type. Example: "Dyson Supersonic saç qurudan"

### title_az (~60-70 characters)
Natural, search-friendly title. Longer than name. Include search phrases real users type. NOT just "Satılır" + name. Example: "Dyson Supersonic Saç Qurudan — İonizasiyalı Peşəkar Fen 2000W" NOT "Dyson Supersonic saç qurudan satılır"

### subtitle_az (string or null)
The SINGLE most compelling reason to buy this product. Not a slogan — a real benefit. Helps the customer understand why THIS product. Example: "İonizasiya texnologiyası saçları zərərsiz qurutur və parlaqlıq verir"

### description_az (300-800 words)
MAXIMUM DETAIL. Write like a category manager who knows everything about this product.

Structure (flexible, adapt to the product):
- Hook: what is this product, who is it for, what problem does it solve
- Design & build: materials, finish, colors, ergonomics, build quality
- Features deep-dive: explain EACH feature with benefit context (not just listing)
- What's in the box: exactly what the customer receives
- Why TAPLA Marketplace: warranty, delivery, authenticity

Use bullet lists where they help readability. Explain benefits of features, not just features.

Example good description (for a hair dryer):
"Peşəkar saç qurutma maşını axtarırsınız? Dyson Supersonic məhz sizin üçün hazırlanıb. 2000W gücü ilə saçları sürətlə qurudur, ionizasiya texnologiyası isə statik elektriki aradan qaldırır və saçlara təbii parlaqlıq verir.

Kompakt və yüngül dizaynı sayəsində uzun müddət istifadədə belə əliniz yorulmur. Məxməri toxunuşlu tutacaq və düşünülmüş erqonomika hər hərəkəti rahat edir...

Dəstə daxildir: fen, 3 konsentrator nozzle, diffuzor, asma halqası, istiliyədavamlı döşək."

### benefits_az (6-12 items)
Each benefit = a COMPLETE thought. Not "Yüngül çəki" but "Yüngül çəkisi sayəsində uzun müddət istifadədə belə əliniz yorulmur"
Each item should answer: "what does this mean for the customer?"

### how_to_use_az
Detailed instructions. For complex products: step-by-step guide. For simple products: tips for best results, what to avoid, when to use it. 1-3 paragraphs.

### ingredients_az
Only for cosmetics/skincare/beauty products. List ingredients as visible on packaging. null for everything else.

### features_az (8-20 items)
Key technical and design features. Short, factual, each is one clear point.
Examples: "2000W güc", "3 temperatur rejimi", "İonizasiya texnologiyası", "Çıxarıla bilən filtr"

### ideal_for_az
Who is this product for? Describe the target customer naturally. Example: "Ev şəraitində peşəkar saç qurutma maşını axtaran qadınlar üçün idealdır. Həmçinin kiçik salonlarda istifadə üçün uyğundur."

### use_cases_az (3-8 items)
Real usage scenarios. Examples for a hair dryer:
- "Səhər tez işə hazırlaşarkən sürətli qurutma"
- "Həcmli üslub yaratmaq üçün diffuzor ilə"
- "Səyahətdə yığcam qurutma"

### care_instructions_az (string or null)
How to care for the product. Only if applicable (electronics, appliances, etc.). null for consumables.

### compatibility_az (string or null)
Compatibility info. For electronics: ports, standards, OS support, etc. null if not applicable.

### faq_az (3-8 pairs)
Frequently asked questions with real answers. Think about what a customer would ask before buying. Include practical concerns: "Is it loud?", "Can I use it with wet hair?", "Does it come with a warranty?"
Questions in Azerbaijani, answers thorough but concise.

### tags_az (15-40 tags)
SEO tags on Azerbaijani. Cover: product type, brand, category, material, color, use case, target audience, features.
Examples for a hair dryer: "fen", "saç qurutma maşını", "Dyson", "Dyson Supersonic", "peşəkar fen", "ionizasiyalı fen", "2000W fen", "saç üçün", "qadınlar üçün", "ev üçün", "salon üçün", "sürətli qurutma", "həcmli saç", "saç aksesuarı", "keyfiyyətli fen", "ucuz fen", "sifariş fen", "Bakıda fen", "online fen", "TAPLA fen"

### search_keywords_az (30-100 phrases)
In ENGLISH. For internal search engine indexing. Cover: product searches, category searches, brand searches, problem-solution searches, competitor product names, misspellings.
Examples: "hair dryer", "blow dryer", "professional hair dryer", "ionic hair dryer", "Dyson hair dryer", "Dyson Supersonic", "hair dryer 2000W", "hair dryer for salon", "best hair dryer", "cheap hair dryer", "fast hair drying", "hair volumizer", "hair styling tools", "hair care", "beauty tools"

### slug (string or null)
SEO-friendly URL. Only override if the auto-generated slug would be poor. Short, readable. Max 60 chars. ə→e, ç→c, ş→s, ğ→g, ü→u, ö→o, ı→i. Lowercase, hyphens.

### shades (array of objects)
Product color variants. Each shade MUST have:
- name: Color name in Azerbaijani (e.g. "Qara", "Ağ", "Qırmızı", "Mavi", "Yaşıl", "Çəhrayı", "Bənövşəyi", "Boz", "Qəhvəyi", "Narıncı", "Sarı", "Gümüşü", "Qızılı")
- colorHex: Exact hex color code (e.g. "#000000", "#FFFFFF", "#FF0000", "#0000FF")
- isHot: true for the most popular/default color (only ONE should be true)
If product has only one color — return array with that single color. Max 8 shades.
If product color is not in the list — use the closest match and write actual color as name.
Examples: [{"name": "Qara", "colorHex": "#1A1A1A", "isHot": true}, {"name": "Ağ", "colorHex": "#FAFAFA"}]

## OUTPUT SCHEMA

Respond with ONLY valid JSON. No markdown, no code fences, no extra text.

{
  "name_az": "string",
  "title_az": "string",
  "subtitle_az": "string | null",
  "description_az": "string",
  "benefits_az": ["string", ...],
  "how_to_use_az": "string",
  "ingredients_az": "string | null",
  "features_az": ["string", ...],
  "ideal_for_az": "string",
  "use_cases_az": ["string", ...],
  "care_instructions_az": "string | null",
  "compatibility_az": "string | null",
  "faq_az": [{"question": "string", "answer": "string"}, ...],
  "tags_az": ["string", ...],
  "search_keywords_az": ["string", ...],
  "slug": "string | null",
  "shades": [{"name": "string", "colorHex": "#hex", "isHot": false}, ...],
  "try_on_enabled": false
}`

const USER_PROMPT_TEMPLATE = `Create a complete Azerbaijani product card for TAPLA Marketplace.

Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

## Product analysis (from AI vision):

Product type: {{product_type}}
Category: {{category}}
Subcategory: {{subcategory}}
Brand: {{brand}}
Model: {{model}}
Primary color: {{primary_color}}
Secondary colors: {{secondary_colors}}
Material: {{material}}
Finish: {{finish}}
Shape: {{shape}}
Texture: {{texture}}
Estimated dimensions: {{dimensions}}
Construction features: {{construction_features}}
Controls: {{controls}}
Buttons: {{buttons}}
Ports: {{ports}}
Display: {{display}}
Indicators: {{indicators}}
Functions: {{possible_functions}}
Intended use: {{intended_use}}
Key selling points: {{key_selling_points}}
Target audience: {{target_audience}}
Premium level: {{premium_level}}
Package contents: {{package_contents}}
Accessories: {{accessories}}
Inscriptions on product: {{inscriptions}}
Logo visible: {{logo_visible}}
Needs human model: {{needs_human_model}}
Recommended scenes: {{recommended_scenes}}

{{providerDescription}}

{{characteristics}}

Respond with ONLY valid JSON matching the schema exactly. No markdown, no code fences.`

/**
 * Stage 1.5: Полная AI-карточка товара на основе фото + Vision анализа.
 * Работает параллельно с генерацией изображений (Stage 2→3→4).
 */
export async function enrichProductData(
  photoBase64: string,
  analysis: VisionOutput,
  providerDescription?: string,
  characteristics?: Record<string, string>,
): Promise<EnricherOutput> {
  const config = TOVAR_AI_CONFIG
  const mimeType = detectMimeType(photoBase64) || 'image/jpeg'

  // Собираем user prompt с подстановкой полей VisionOutput
  const userMessage = USER_PROMPT_TEMPLATE
    .replace('{{product_type}}', analysis.product_type || 'unknown')
    .replace('{{category}}', analysis.category || 'unknown')
    .replace('{{subcategory}}', analysis.subcategory || 'unknown')
    .replace('{{brand}}', analysis.brand || 'unknown')
    .replace('{{model}}', analysis.model || 'unknown')
    .replace('{{primary_color}}', analysis.primary_color || 'unknown')
    .replace('{{secondary_colors}}', analysis.secondary_colors?.join(', ') || 'none')
    .replace('{{material}}', analysis.material || 'unknown')
    .replace('{{finish}}', analysis.finish || 'unknown')
    .replace('{{shape}}', analysis.shape || 'unknown')
    .replace('{{texture}}', analysis.texture || 'none')
    .replace('{{dimensions}}', analysis.dimensions_estimated || 'unknown')
    .replace('{{construction_features}}', analysis.construction_features?.join(', ') || 'none')
    .replace('{{controls}}', analysis.controls?.join(', ') || 'none')
    .replace('{{buttons}}', analysis.buttons?.join(', ') || 'none')
    .replace('{{ports}}', analysis.ports?.join(', ') || 'none')
    .replace('{{display}}', analysis.display || 'none')
    .replace('{{indicators}}', analysis.indicators?.join(', ') || 'none')
    .replace('{{possible_functions}}', analysis.possible_functions?.join(', ') || 'none')
    .replace('{{intended_use}}', analysis.intended_use || 'none')
    .replace('{{key_selling_points}}', analysis.key_selling_points?.join(', ') || 'none')
    .replace('{{target_audience}}', analysis.target_audience || 'general')
    .replace('{{premium_level}}', analysis.premium_level || 'mid')
    .replace('{{package_contents}}', analysis.package_contents?.join(', ') || 'none')
    .replace('{{accessories}}', analysis.accessories?.join(', ') || 'none')
    .replace('{{inscriptions}}', analysis.inscriptions?.join(', ') || 'none')
    .replace('{{logo_visible}}', String(analysis.logo_visible ?? false))
    .replace('{{needs_human_model}}', String(analysis.needs_human_model ?? false))
    .replace('{{recommended_scenes}}', analysis.recommended_scenes?.join(', ') || 'none')
    .replace('{{providerDescription}}', providerDescription ? `\nSupplier description: ${providerDescription}` : '')
    .replace('{{characteristics}}', characteristics && Object.keys(characteristics).length > 0
      ? `\nCharacteristics: ${JSON.stringify(characteristics)}`
      : '')

  const body = {
    model: config.ENRICHER_MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: [
          { type: 'text', text: userMessage },
          {
            type: 'image_url',
            image_url: { url: `data:${mimeType};base64,${photoBase64}` },
          },
        ],
      },
    ],
    response_format: { type: 'json_object' } as const,
    temperature: 0.3,
    max_tokens: 16384,
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
      `Stage 1.5 Enricher API error ${response.status}: ${errText.slice(0, 500)}`,
    )
  }

  const data = await response.json() as {
    choices?: Array<{ message?: { role: string; content: string } }>
  }
  const raw = data.choices?.[0]?.message?.content || ''

  // Парсим JSON
  const json = parseJSON<EnricherOutput>(raw)

  // Валидация
  validateEnricherOutput(json)

  return json
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function detectMimeType(base64: string): string | null {
  if (base64.startsWith('/9j/')) return 'image/jpeg'
  if (base64.startsWith('iVBORw0')) return 'image/png'
  if (base64.startsWith('R0lGOD')) return 'image/gif'
  if (base64.startsWith('UklGR')) return 'image/webp'
  return null
}

function parseJSON<T>(raw: string): T {
  let cleaned = raw.trim()
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '')
  }
  return JSON.parse(cleaned) as T
}

function validateEnricherOutput(obj: EnricherOutput): void {
  // ─── Строки ─────────────────────────────────────────────────────
  if (!obj.name_az || typeof obj.name_az !== 'string' || obj.name_az.length < 2) {
    obj.name_az = obj.name_az || 'Məhsul'
  }
  if (!obj.title_az || typeof obj.title_az !== 'string' || obj.title_az.length < 5) {
    obj.title_az = obj.name_az
  }
  if (!obj.description_az || typeof obj.description_az !== 'string' || obj.description_az.length < 50) {
    obj.description_az = obj.name_az + ' — TAPLA Marketplace tərəfindən təklif olunan keyfiyyətli məhsul.'
  }
  if (!obj.how_to_use_az || typeof obj.how_to_use_az !== 'string' || obj.how_to_use_az.length < 10) {
    obj.how_to_use_az = 'İstifadə qaydası üçün məhsulun qablaşdırmasındakı təlimata riayət edin.'
  }
  if (!obj.ideal_for_az || typeof obj.ideal_for_az !== 'string') {
    obj.ideal_for_az = 'Bu məhsul geniş istifadəçi kütləsi üçün nəzərdə tutulub.'
  }

  // ─── Опциональные строки ────────────────────────────────────────
  if (typeof obj.subtitle_az !== 'string' || obj.subtitle_az.length < 3) obj.subtitle_az = null
  if (typeof obj.ingredients_az !== 'string' || obj.ingredients_az.length < 2) obj.ingredients_az = null
  if (typeof obj.care_instructions_az !== 'string' || obj.care_instructions_az.length < 3) obj.care_instructions_az = null
  if (typeof obj.compatibility_az !== 'string' || obj.compatibility_az.length < 3) obj.compatibility_az = null
  if (typeof obj.slug !== 'string' || obj.slug.length < 3) obj.slug = null

  // ─── Массивы ───────────────────────────────────────────────────
  if (!Array.isArray(obj.benefits_az)) obj.benefits_az = []
  if (!Array.isArray(obj.features_az)) obj.features_az = []
  if (!Array.isArray(obj.use_cases_az)) obj.use_cases_az = []
  if (!Array.isArray(obj.tags_az)) obj.tags_az = obj.tags_az || [obj.name_az]
  if (!Array.isArray(obj.search_keywords_az)) obj.search_keywords_az = obj.search_keywords_az || [obj.name_az]
  if (!Array.isArray(obj.shades)) { obj.shades = [] }
  else {
    obj.shades = obj.shades
      .filter((s: unknown) => s && typeof s === 'object' && typeof (s as Record<string,unknown>).name === 'string' && typeof (s as Record<string,unknown>).colorHex === 'string')
      .map((s: Record<string,unknown>) => ({ name: s.name as string, colorHex: s.colorHex as string, isHot: s.isHot === true }))
  }

  // ─── FAQ ────────────────────────────────────────────────────────
  if (!Array.isArray(obj.faq_az)) {
    obj.faq_az = []
  } else {
    obj.faq_az = obj.faq_az
      .filter(f => f && typeof f.question === 'string' && typeof f.answer === 'string')
      .slice(0, 20) // не больше 20 на случай перебора
  }

  // ─── Булевы ─────────────────────────────────────────────────────
  if (typeof obj.try_on_enabled !== 'boolean') obj.try_on_enabled = false
}
