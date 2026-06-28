// ============================================================================
// Stage 2: Creative Director + Prompt Planner
// 12 стилей + 8 design-библиотек + авто-адаптация → в промпты
// LLM = Creative Director: выбирает угол, лэйаут, позицию, фон, эффекты
// ============================================================================

import * as fs from 'node:fs'
import * as path from 'node:path'
import { TOVAR_AI_CONFIG, type VisionOutput, type PromptsOutput } from './types'

// ─── ФОТО-СТИЛИ (12 шт, из JSON) ───────────────────────────────────────────

interface PhotoStyle {
  id: string; name: string; prompt_prefix: string; forbidden: string[]
  composition: string; lighting: string; use_for: string[]
  needs_model: boolean; needs_environment: boolean
}

const STYLES_DIR = path.join(__dirname, 'styles')
const DESIGN_DIR = path.join(__dirname, 'design')

function loadAllPhotoStyles(): PhotoStyle[] {
  return fs.readdirSync(STYLES_DIR)
    .filter(f => f.startsWith('s') && f.endsWith('.json'))
    .map(f => JSON.parse(fs.readFileSync(path.join(STYLES_DIR, f), 'utf-8')) as PhotoStyle)
}

function loadDesignLibrary(name: string): string {
  return fs.readFileSync(path.join(DESIGN_DIR, name), 'utf-8')
}

// ─── БАЗОВЫЙ ПРОМПТ (оригинал, без правок) ────────────────────────────────

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
Beauty products should receive skincare environments.
Electronics should receive modern technology environments.
Kitchen products should receive premium kitchens.
Automotive products should receive automotive environments.
Fitness products should receive sports environments.
Office products should receive office environments.
Pet products should receive home environments.`

// ─── SYSTEM PROMPT — Creative Director ─────────────────────────────────────

const SYSTEM_PROMPT = `You are a Creative Director for TAPLA MARKETPLACE (Azerbaijan). You design advertising creatives for e-commerce, not just images.

Given: product analysis + photo style per card + design libraries.
Your job: select marketing strategy, layout, positioning, background, effects for each of 3 cards.

## 3 CARDS

Card 1 (main_cover): Hero shot. Product dominant. STOP the scroll. Magazine quality. Large AZ headline.
Card 2 (usage_demo): Product in use. Lifestyle context. Create desire.
Card 3 (features_detail): Details, quality, features. Infographic style.

## TEXT RULES
- ALL visible text: AZERBAIJANI LATIN SCRIPT ONLY. NEVER English. NEVER Russian. NEVER Cyrillic.
- Short: 3-5 words per headline. Examples: "LED TERAPİYA", "3 REJİM", "ERQONOMİK DİZAYN"

## PROCESS
1. Pick ONE marketing angle per card (from marketing_angles library)
2. Pick ONE layout per card (from layouts library)
3. Select position, background, visual effects for each card
4. Run Creative Director self-review (all 6 questions MUST be YES)
5. If any question = NO, redesign and try again
6. Write the final image description

## PROMT RULES
- Each prompt_en under 300 words
- Full English sentences for Nano Banana 2
- Reference original photo for product shape/color fidelity
- CREATE A NEW IMAGE — do not edit the reference photo

Output ONLY valid JSON. No markdown.`

// ─── USER PROMPT (собирается динамически с design-библиотеками) ────────────

function buildUserPrompt(
  s1: PhotoStyle, s2: PhotoStyle, s3: PhotoStyle,
  analysis: VisionOutput,
  providerDescription?: string,
  characteristics?: Record<string, string>,
): string {
  const DESIGN = {
    marketing_angles: loadDesignLibrary('marketing-angles.json'),
    layouts: loadDesignLibrary('layouts.json'),
    positions: loadDesignLibrary('positions.json'),
    backgrounds: loadDesignLibrary('backgrounds.json'),
    visual_effects: loadDesignLibrary('visual-effects.json'),
    composition_rules: loadDesignLibrary('composition-rules.json'),
    marketplace_rules: loadDesignLibrary('marketplace-rules.json'),
    creative_director: loadDesignLibrary('creative-director.json'),
  }

  // Собираем через конкатенацию (JSON контент может ломать template literals)
  return [
    'Create 3 image prompts for this product. Act as Creative Director.',
    '',
    '## DESIGN LIBRARIES — use these to build each card',
    '',
    '### Marketing Angles (pick ONE per card)',
    DESIGN.marketing_angles,
    '',
    '### Layouts (pick ONE per card)',
    DESIGN.layouts,
    '',
    '### Product Positions',
    DESIGN.positions,
    '',
    '### Backgrounds',
    DESIGN.backgrounds,
    '',
    '### Visual Effects',
    DESIGN.visual_effects,
    '',
    '### Composition Rules (MUST follow)',
    DESIGN.composition_rules,
    '',
    '### Marketplace Rules (MUST follow)',
    DESIGN.marketplace_rules,
    '',
    '### Creative Director Self-Review (MUST pass all 6)',
    DESIGN.creative_director,
    '',
    '## PHOTO STYLES ASSIGNED',
    '',
    'CARD 1 STYLE: ' + s1.name + ' — ' + s1.prompt_prefix,
    'CARD 2 STYLE: ' + s2.name + ' — ' + s2.prompt_prefix,
    'CARD 3 STYLE: ' + s3.name + ' — ' + s3.prompt_prefix,
    '',
    '## Product Analysis',
    JSON.stringify(analysis, null, 2),
    '',
    '## Provider Description',
    providerDescription || 'Not provided',
    '',
    '## Characteristics',
    (characteristics && Object.keys(characteristics).length > 0 ? JSON.stringify(characteristics) : 'None'),
    '',
    'Return JSON:',
    '{',
    '  "cards": [',
    '    {',
    '      "index": 1,',
    '      "purpose": "main_cover",',
    '      "marketing_angle": "premium",',
    '      "layout": "C",',
    '      "product_position": "45° rotated",',
    '      "background": "Soft white studio",',
    '      "visual_effects": ["soft_glow"],',
    '      "creative_director_passed": true,',
    '      "prompt_en": "Full product scene description in English. Under 300 words.",',
    '      "text_overlay_az": ["HEADLINE AZ"],',
    '      "needs_model": false',
    '    },',
    '    {',
    '      "index": 2,',
    '      "purpose": "usage_demo",',
    '      "marketing_angle": "lifestyle",',
    '      "layout": "G",',
    '      "product_position": "in hand",',
    '      "background": "Modern bathroom",',
    '      "visual_effects": [],',
    '      "creative_director_passed": true,',
    '      "prompt_en": "...",',
    '      "text_overlay_az": [],',
    '      "needs_model": true',
    '    },',
    '    {',
    '      "index": 3,',
    '      "purpose": "features_detail",',
    '      "marketing_angle": "features",',
    '      "layout": "features_row",',
    '      "product_position": "macro close-up",',
    '      "background": "Soft white studio",',
    '      "visual_effects": ["luxury_highlights"],',
    '      "creative_director_passed": true,',
    '      "prompt_en": "...",',
    '      "text_overlay_az": ["FEATURE 1 AZ", "FEATURE 2 AZ"],',
    '      "needs_model": false',
    '    }',
    '  ]',
    '}',
    '',
    'RULES:',
    '- text_overlay_az: AZERBAIJANI LATIN ONLY. Empty array [] if no text.',
    '- Every card must have creative_director_passed = true.',
    '- Do NOT invent new styles — use the assigned photo style.',
    '- One image = one marketing message.',
    '- prompt_en writes product scene only — style prefix, design libraries, and rules are added automatically.',
    '',
    'Respond ONLY with the JSON.',
  ].join('\n')
}

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

  const s1 = pickStyle('main_cover', analysis, styles)
  const s2 = pickStyle('usage_demo', analysis, styles)
  const s3 = pickStyle('features_detail', analysis, styles)

  console.log(`[Stage 2] Styles: card1=${s1.id}, card2=${s2.id}, card3=${s3.id}`)

  const userPrompt = buildUserPrompt(s1, s2, s3, analysis, providerDescription, characteristics)

  const body = {
    model: config.PLANNER_MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
    max_tokens: 8192,
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
  const parsed = parseJSON<{
    cards: Array<PromptsOutput['cards'][number] & {
      marketing_angle?: string; layout?: string
      product_position?: string; background?: string
      visual_effects?: string[]; creative_director_passed?: boolean
    }>
  }>(raw)

  if (!Array.isArray(parsed.cards) || parsed.cards.length < 3) {
    throw new Error(`Stage 2: Expected 3 cards, got ${parsed.cards?.length || 0}`)
  }

  // Сборка финального промпта: [BASE] + [дизайн-решения] + [стиль] + [контент]
  const styleMap = [s1, s2, s3]

  for (const card of parsed.cards) {
    const style = styleMap[card.index - 1]

    const designDecisions = [
      card.marketing_angle ? `Marketing angle: ${card.marketing_angle}.` : '',
      card.layout ? `Layout: ${card.layout}.` : '',
      card.product_position ? `Product position: ${card.product_position}.` : '',
      card.background ? `Background: ${card.background}.` : '',
      Array.isArray(card.visual_effects) && card.visual_effects.length > 0
        ? `Visual effects: ${card.visual_effects.join(', ')}.` : '',
    ].filter(Boolean).join(' ')

    const textInstruction = card.text_overlay_az.length > 0
      ? `Render this text on the image: ${card.text_overlay_az.join(' — ')}.`
      : ''

    card.prompt_en = [
      BASE_PROMPT,
      designDecisions,
      `STYLE: ${style.name}. ${style.prompt_prefix}`,
      `Composition: ${style.composition}. Lighting: ${style.lighting}.`,
      textInstruction,
      card.prompt_en,
    ].filter(Boolean).join(' ')
  }

  // Убираем design-поля из cards (не нужны дальше)
  const cleanCards = parsed.cards.map(c => ({
    index: c.index,
    purpose: c.purpose,
    prompt_en: c.prompt_en,
    text_overlay_az: c.text_overlay_az,
    needs_model: c.needs_model,
    composition: c.layout || 'center',
    reference_weight: c.purpose === 'main_cover' ? 0.8 : c.needs_model ? 0.5 : 0.8,
  }))

  return { style_name: `${s1.id}+${s2.id}+${s3.id}`, cards: cleanCards }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function parseJSON<T>(raw: string): T {
  let cleaned = raw.trim()
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '')
  }
  return JSON.parse(cleaned) as T
}
