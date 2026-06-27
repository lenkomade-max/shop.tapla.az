// ============================================================================
// Stage 2: Prompt Planner
// 12 стилей + авто-адаптация → в промпты. LLM → только контент и AZ текст.
// ============================================================================

import * as fs from 'node:fs'
import * as path from 'node:path'
import { TOVAR_AI_CONFIG, type VisionOutput, type PromptsOutput } from './types'

// ─── ФОТО-СТИЛИ (12 шт, из JSON) ───────────────────────────────────────────

interface PhotoStyle {
  id: string
  name: string
  prompt_prefix: string
  forbidden: string[]
  composition: string
  lighting: string
  use_for: string[]
  needs_model: boolean
  needs_environment: boolean
}

const STYLES_DIR = path.join(__dirname, 'styles')

function loadAllPhotoStyles(): PhotoStyle[] {
  return fs.readdirSync(STYLES_DIR)
    .filter(f => f.startsWith('s') && f.endsWith('.json'))
    .map(f => JSON.parse(fs.readFileSync(path.join(STYLES_DIR, f), 'utf-8')) as PhotoStyle)
}

// ─── БАЗОВЫЙ ПРОМПТ (из GPT— самая важная часть, вшивается в КАЖДЫЙ запрос) ──

const BASE_PROMPT = `Create a premium marketplace product image.

The image must look like a professional e-commerce product photograph suitable for Amazon, Trendyol, Temu, AliExpress Premium, Shopify or a modern online marketplace.

Generate ONE image only.
Never create collages.
Never create split layouts.
Never create multiple panels.
Never create infographic grids.
One image = one marketing message.

The product must occupy approximately 60-80% of the frame.
Use realistic premium photography.
Luxury commercial lighting.
Photorealistic.
Natural materials.
Studio quality.
Modern advertising style.
High-end product photography.
Ultra realistic.
8K.

The product is always the main subject.
Do not change the product shape.
Do not invent new product parts.
Remove all watermarks, stickers, logos and packaging unless requested.
Leave enough negative space for optional text placement.
Generate images suitable for Meta Ads and marketplace galleries.

CRITICAL — Analyze the uploaded product before generating the image. Determine automatically: product category, materials, intended use, target customer, suitable environment, appropriate lighting, realistic accessories, correct hand position if applicable, realistic usage scenario, luxury commercial style.

Do not reuse the same environment for every product.
Beauty products → skincare environments.
Electronics → modern technology environments.
Kitchen products → premium kitchens.
Fitness products → sports environments.
Office products → office environments.
Pet products → natural home settings.
Automotive → automotive environments.`

// ─── SYSTEM PROMPT ─────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a product content writer for TAPLA MARKETPLACE (Azerbaijan).

Given: product analysis + selected photo style for each card.
Your job: write product-specific image description + Azerbaijani text overlays.

## 3 CARDS

Card 1 (main_cover):
- Product hero shot, fills 60-70% of frame
- Magazine-cover quality, STOP the scroll
- Large headline in AZ, optional badge

Card 2 (usage_demo):
- Product being used naturally
- If product needs human: person using it
- If needs lifestyle: product in beautiful interior
- Create desire through context

Card 3 (features_detail):
- Close-ups, details, macro shots
- Infographic style: callouts, labels
- Communicate quality and features

## TEXT RULES
- ALL visible text: AZERBAIJANI LATIN SCRIPT ONLY
- NEVER English. NEVER Russian. NEVER Cyrillic.
- Short: 3-5 words max per headline
- Examples: "LED TERAPİYA", "3 REJİM", "ERQONOMİK DİZAYN"

## PROMPT RULES
- Each prompt_en under 250 words
- Full English sentences
- Reference original photo for product fidelity

Output ONLY valid JSON. No markdown.`

const USER_PROMPT_TEMPLATE = `Create 3 image prompts for this product.

## PHOTO STYLES ASSIGNED (use these exact prefixes in each card)

CARD 1 STYLE: {STYLE1_NAME} — {STYLE1_PREFIX}

CARD 2 STYLE: {STYLE2_NAME} — {STYLE2_PREFIX}

CARD 3 STYLE: {STYLE3_NAME} — {STYLE3_PREFIX}

## Product Analysis
{ANALYSIS}

## Provider Description
{DESCRIPTION}

## Characteristics
{CHARACTERISTICS}

## REQUIREMENTS
- Each card must be ONE IMAGE only. Never collages. Never split layouts. Never multiple panels. Never infographic grids.
- Product occupies 60-80% of frame.
- Realistic premium photography. Ultra realistic. 8K.
- Leave negative space for text placement.
- Remove all watermarks, stickers, logos, packaging.

Return JSON:
{
  "cards": [
    {
      "index": 1,
      "purpose": "main_cover",
      "prompt_en": "Product-specific scene description in English. Under 250 words. DO NOT include style prefix — it will be added automatically.",
      "text_overlay_az": ["HEADLINE AZ"],
      "needs_model": false
    },
    {
      "index": 2,
      "purpose": "usage_demo",
      "prompt_en": "...",
      "text_overlay_az": [],
      "needs_model": true
    },
    {
      "index": 3,
      "purpose": "features_detail",
      "prompt_en": "...",
      "text_overlay_az": ["FEATURE 1 AZ", "FEATURE 2 AZ"],
      "needs_model": false
    }
  ]
}

RULES:
- text_overlay_az: AZERBAIJANI LATIN ONLY. Empty array if no text.
- prompt_en: Write what to show — the style prefix is added automatically.
- Do NOT invent style changes — use the assigned photo style for each card.
- One image = one marketing message.

Respond ONLY with the JSON.`

// ─── ВЫБОР СТИЛЯ ДЛЯ КАЖДОЙ КАРТОЧКИ (код, не LLM) ────────────────────────

function pickStyle(useFor: string, vision: VisionOutput, styles: PhotoStyle[]): PhotoStyle {
  const candidates = styles.filter(s => s.use_for.includes(useFor))

  // Фильтруем по model/environment требованиям
  const filtered = candidates.filter(s => {
    if (!vision.needs_human_model && s.needs_model) return false
    if (!vision.needs_lifestyle_scene && s.needs_environment) return false
    return true
  })

  const pool = filtered.length > 0 ? filtered : candidates

  // s01 (white studio) — дефолт для main_cover
  if (useFor === 'main_cover') {
    const white = pool.find(s => s.id === 's01-white-studio')
    if (white) return white
  }

  // Для usage_demo с моделью — s03 (in-use) приоритет
  if (useFor === 'usage_demo' && vision.needs_human_model) {
    const inUse = pool.find(s => s.id === 's03-product-in-use')
    if (inUse) return inUse
  }

  // Для usage_demo без модели — s02 (lifestyle)
  if (useFor === 'usage_demo' && !vision.needs_human_model) {
    const life = pool.find(s => s.id === 's02-luxury-lifestyle')
    if (life) return life
  }

  // Для features_detail с макро — s06
  if (useFor === 'features_detail' && vision.needs_macro_shots) {
    const macro = pool.find(s => s.id === 's06-macro-detail')
    if (macro) return macro
  }

  // Для features_detail с exploded — s07
  if (useFor === 'features_detail' && vision.needs_exploded_view) {
    const exp = pool.find(s => s.id === 's07-exploded-view')
    if (exp) return exp
  }

  // Дефолт: первая подходящая
  return pool[0] || candidates[0] || styles[0]
}

// ─── MAIN ──────────────────────────────────────────────────────────────────

export async function planCardPrompts(
  analysis: VisionOutput,
  providerDescription?: string,
  characteristics?: Record<string, string>,
): Promise<PromptsOutput> {
  const config = TOVAR_AI_CONFIG
  const styles = loadAllPhotoStyles()

  // Выбираем стиль для каждой карточки
  const s1 = pickStyle('main_cover', analysis, styles)
  const s2 = pickStyle('usage_demo', analysis, styles)
  const s3 = pickStyle('features_detail', analysis, styles)

  console.log(`[Stage 2] Styles: card1=${s1.id}, card2=${s2.id}, card3=${s3.id}`)

  // Отправляем LLM: назначенные стили + анализ товара
  const userPrompt = USER_PROMPT_TEMPLATE
    .replace('{STYLE1_NAME}', s1.name)
    .replace('{STYLE1_PREFIX}', s1.prompt_prefix)
    .replace('{STYLE2_NAME}', s2.name)
    .replace('{STYLE2_PREFIX}', s2.prompt_prefix)
    .replace('{STYLE3_NAME}', s3.name)
    .replace('{STYLE3_PREFIX}', s3.prompt_prefix)
    .replace('{ANALYSIS}', JSON.stringify(analysis, null, 2))
    .replace('{DESCRIPTION}', providerDescription || 'Not provided')
    .replace('{CHARACTERISTICS}', characteristics && Object.keys(characteristics).length > 0 ? JSON.stringify(characteristics) : 'None')

  const body = {
    model: config.PLANNER_MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
    max_tokens: 4096,
  }

  const response = await fetch(`${config.OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`Stage 2 Planner API error ${response.status}: ${errText.slice(0, 500)}`)
  }

  const data = await response.json()
  const raw = data.choices?.[0]?.message?.content || ''
  const parsed = parseJSON<{ cards: PromptsOutput['cards'] }>(raw)

  if (!Array.isArray(parsed.cards) || parsed.cards.length < 3) {
    throw new Error(`Stage 2: Expected 3 cards, got ${parsed.cards?.length || 0}`)
  }

  // ПРИНУДИТЕЛЬНО вшиваем: [BASE] + [стиль] + [контент LLM] в каждом промпте
  const styleMap = [s1, s2, s3]
  for (const card of parsed.cards) {
    const style = styleMap[card.index - 1]
    card.prompt_en = [
      BASE_PROMPT,
      `STYLE: ${style.name}.`,
      style.prompt_prefix,
      `Composition: ${style.composition}. Lighting: ${style.lighting}.`,
      'TAPLA MARKETPLACE product card. 1:1 square format.',
      card.prompt_en,
    ].join(' ')
  }

  return {
    style_name: `${s1.id}+${s2.id}+${s3.id}`,
    cards: parsed.cards,
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function parseJSON<T>(raw: string): T {
  let cleaned = raw.trim()
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '')
  }
  return JSON.parse(cleaned) as T
}
