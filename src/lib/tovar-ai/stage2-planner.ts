// ============================================================================
// Stage 2: Prompt Planner
// Дизайн — из фиксированного style JSON (наш).
// LLM — только контент: текст на AZ, композиция, что показать.
// ============================================================================

import * as fs from 'node:fs'
import * as path from 'node:path'
import { TOVAR_AI_CONFIG, type VisionOutput, type PromptsOutput, type StylePreset } from './types'

// ─── SYSTEM PROMPT (статичный, без правил дизайна) ──────────────────────────

const SYSTEM_PROMPT = `You are a product content writer for TAPLA MARKETPLACE (Azerbaijan).

Your ONLY job: given a product analysis AND a fixed design style, create 3 product-card prompts for Nano Banana 2 image generation.

YOU DO NOT DESIGN THE STYLE. The style is FIXED and provided to you. Your task:
1. Write product-specific content within the given style
2. Decide what to show on each card based on the product
3. Write text overlays in AZERBAIJANI LATIN SCRIPT

## CARD PURPOSES

Card 1 (main_cover):
- Product hero shot, fills 60-70% of frame
- Magazine-cover quality
- Large headline in AZ, optional subtitle badge
- Goal: STOP the scroll

Card 2 (usage_demo):
- Show product being used
- If product needs human model: person using it naturally
- If needs lifestyle scene: product in beautiful interior
- Goal: create desire through context

Card 3 (features_detail):
- Close-ups, details, macro shots
- Infographic style: callouts, labels, highlight key features
- Goal: communicate quality and features

## TEXT RULES
- ALL visible text MUST be in AZERBAIJANI LATIN SCRIPT
- NEVER English. NEVER Russian. NEVER Cyrillic.
- Short phrases: 3-5 words max per headline
- Examples: "3 REJİM", "LED TERAPİYA", "ERQONOMİK DİZAYN", "SÜRƏTLİ QURUTMA"
- Numbers, badges, benefit bullets are OK

## PROMPT RULES
- Each prompt_en must be under 200 words
- Write in full English sentences (Nano Banana works best with English)
- Reference the original product photo for visual fidelity
- Include the card purpose context

Output ONLY valid JSON. No markdown, no code fences.`

const USER_PROMPT_TEMPLATE = `Create 3 image generation prompts for this product.

## FIXED DESIGN STYLE (DO NOT CHANGE)
{STYLE_BLOCK}

## Product Analysis
{ANALYSIS}

## Provider Info
Description: {DESCRIPTION}
Characteristics: {CHARACTERISTICS}

## STYLE PICK
Selected style: {STYLE_NAME}
Reason: {STYLE_REASON}

Return JSON:
{
  "cards": [
    {
      "index": 1,
      "purpose": "main_cover",
      "prompt_en": "English prompt for Nano Banana 2. Include composition, product position, what text to render.",
      "text_overlay_az": ["HEADLINE IN AZ LATIN"],
      "composition": "short description of composition",
      "needs_model": false,
      "reference_weight": 0.7
    },
    {
      "index": 2,
      "purpose": "usage_demo",
      "prompt_en": "...",
      "text_overlay_az": [],
      "composition": "...",
      "needs_model": true,
      "reference_weight": 0.5
    },
    {
      "index": 3,
      "purpose": "features_detail",
      "prompt_en": "...",
      "text_overlay_az": ["FEATURE 1 AZ", "FEATURE 2 AZ"],
      "composition": "...",
      "needs_model": false,
      "reference_weight": 0.8
    }
  ]
}

RULES:
- reference_weight: 0.7-0.9 for cards showing product alone, 0.4-0.6 for lifestyle scenes
- text_overlay_az: AZERBAIJANI LATIN ONLY. Empty array if no text needed.
- Every prompt_en must begin with the FIXED DESIGN STYLE description above plus "E-commerce product card for TAPLA marketplace, 1:1 square format."
- Do NOT invent new colors, fonts, or mood — use ONLY what's in the FIXED DESIGN STYLE.

Respond ONLY with the JSON.`

// ─── STYLE LOADER ──────────────────────────────────────────────────────────

const STYLES_DIR = path.join(__dirname, 'styles')

function loadStylePreset(name: string): StylePreset {
  const filePath = path.join(STYLES_DIR, `${name}.json`)
  if (!fs.existsSync(filePath)) {
    throw new Error(`Style preset not found: ${name}.json at ${filePath}`)
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as StylePreset
}

function selectStyle(vision: VisionOutput): { preset: StylePreset; reason: string } {
  // Выбираем стиль по категории и premium_level
  const available = listAvailableStyles()

  // P1: exact category match
  for (const s of available) {
    if (s.applies_to.includes(vision.category)) {
      return { preset: s, reason: `Category match: ${vision.category}` }
    }
  }

  // P2: premium_level match
  const levelMap: Record<string, string> = {
    luxury: 'tapla-dark-premium',
    premium: 'tapla-premium-light',
    mid: 'tapla-premium-light',
    budget: 'tapla-premium-light',
  }
  const targetName = levelMap[vision.premium_level] || 'tapla-premium-light'
  const fallback = available.find(s => s.name === targetName)
  if (fallback) {
    return { preset: fallback, reason: `Premium level: ${vision.premium_level}` }
  }

  // P3: дефолт
  return { preset: available[0], reason: 'Default' }
}

function listAvailableStyles(): StylePreset[] {
  const files = fs.readdirSync(STYLES_DIR).filter(f => f.endsWith('.json'))
  return files.map(f => JSON.parse(fs.readFileSync(path.join(STYLES_DIR, f), 'utf-8')))
}

function styleToTextBlock(p: StylePreset): string {
  const d = p.design_spec
  return [
    `COLOR PALETTE: ${d.color_palette}`,
    `BACKGROUND: ${d.background}`,
    `LIGHTING: ${d.lighting}`,
    `COMPOSITION: ${d.composition}`,
    `MANDATORY: ${d.mandatory_elements.join('; ')}.`,
    `FORBIDDEN: ${d.forbidden.join('; ')}.`,
    `TEXT: ${p.text_rules.language}. Tone: ${p.text_rules.tone}. Max headline ${p.text_rules.max_headline_chars} chars.`,
  ].join(' ')
}

// ─── MAIN ──────────────────────────────────────────────────────────────────

export async function planCardPrompts(
  analysis: VisionOutput,
  providerDescription?: string,
  characteristics?: Record<string, string>,
): Promise<PromptsOutput> {
  const config = TOVAR_AI_CONFIG

  // 1. Выбираем стиль на основе VisionOutput (НЕ LLM!)
  const { preset: style, reason } = selectStyle(analysis)
  const styleBlock = styleToTextBlock(style)

  console.log(`[Stage 2] Style: ${style.name} — ${reason}`)

  // 2. Отправляем LLM: фиксированный стиль + анализ товара
  const userPrompt = USER_PROMPT_TEMPLATE
    .replace('{STYLE_BLOCK}', styleBlock)
    .replace('{STYLE_NAME}', style.name)
    .replace('{STYLE_REASON}', reason)
    .replace('{ANALYSIS}', JSON.stringify(analysis, null, 2))
    .replace('{DESCRIPTION}', providerDescription || 'Not provided')
    .replace(
      '{CHARACTERISTICS}',
      characteristics && Object.keys(characteristics).length > 0
        ? JSON.stringify(characteristics, null, 2)
        : 'None provided',
    )

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
      `Stage 2 Planner API error ${response.status}: ${errText.slice(0, 500)}`,
    )
  }

  const data = await response.json()
  const raw = data.choices?.[0]?.message?.content || ''

  const parsed = parseJSON<{ cards: PromptsOutput['cards'] }>(raw)

  if (!Array.isArray(parsed.cards) || parsed.cards.length < 3) {
    throw new Error(`Stage 2: Expected 3 cards, got ${parsed.cards?.length || 0}`)
  }

  // 3. ПРИНУДИТЕЛЬНО вшиваем FIXED стиль в каждый prompt_en
  for (const card of parsed.cards) {
    if (!card.prompt_en.includes('COLOR PALETTE:')) {
      card.prompt_en = styleBlock + '. ' + card.prompt_en
    }
  }

  return {
    style_name: style.name,
    cards: parsed.cards,
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function parseJSON<T>(raw: string): T {
  let cleaned = raw.trim()
  if (cleaned.startsWith('```')) {
    cleaned = cleaned
      .replace(/^```(?:json)?\s*\n?/, '')
      .replace(/\n?```\s*$/, '')
  }
  return JSON.parse(cleaned) as T
}
