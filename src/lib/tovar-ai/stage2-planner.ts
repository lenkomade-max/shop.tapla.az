// ============================================================================
// Stage 2: Creative Director + Prompt Planner
// 3-слойная система: Creative Style (40) + Marketing Style (30) + Visual Theme
// + 8 design-библиотек (layouts, positions, backgrounds, effects, rules, etc.)
// ============================================================================

import * as fs from 'node:fs'
import * as path from 'node:path'
import { TOVAR_AI_CONFIG, type VisionOutput, type PromptsOutput } from './types'

// ─── ТИПЫ ДЛЯ 3 СЛОЁВ ───────────────────────────────────────────────────────

interface CreativeStyle {
  id: string; name: string; description: string
  prompt_fragment: string; use_for: string[]
  needs_model: boolean; needs_environment: boolean
}

interface MarketingStyle {
  id: string; name: string; description: string
  tone: string; best_for: string[]; prompt_fragment: string
}

interface VisualThemeItem {
  id: string; name: string; description: string; prompt_fragment: string
}

interface VisualThemeCatalog {
  description: string; rule: string
  lighting: VisualThemeItem[]
  background_style: VisualThemeItem[]
  mood: VisualThemeItem[]
}

// ─── ЗАГРУЗКА БИБЛИОТЕК ─────────────────────────────────────────────────────

// __dirname не работает в Next.js (компилируется в /ROOT/).
const TOLER_AI_DIR = path.join(process.cwd(), 'src/lib/tovar-ai')
const DESIGN_DIR = path.join(TOLER_AI_DIR, 'design')

function loadCreativeStyles(): CreativeStyle[] {
  const raw = fs.readFileSync(path.join(DESIGN_DIR, 'creative-styles.json'), 'utf-8')
  return (JSON.parse(raw) as { styles: CreativeStyle[] }).styles
}

function loadMarketingStyles(): MarketingStyle[] {
  const raw = fs.readFileSync(path.join(DESIGN_DIR, 'marketing-styles.json'), 'utf-8')
  return (JSON.parse(raw) as { styles: MarketingStyle[] }).styles
}

function loadVisualThemes(): VisualThemeCatalog {
  const raw = fs.readFileSync(path.join(DESIGN_DIR, 'visual-themes.json'), 'utf-8')
  return JSON.parse(raw) as VisualThemeCatalog
}

function loadDesignLibrary(name: string): string {
  return fs.readFileSync(path.join(DESIGN_DIR, name), 'utf-8')
}

// ─── БАЗОВЫЙ ПРОМПТ (оригинал, без правок) ──────────────────────────────────

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

// ─── SYSTEM PROMPT — Creative Director (3 слоя) ─────────────────────────────

const SYSTEM_PROMPT = `You are a Creative Director for TAPLA MARKETPLACE (Azerbaijan). You design advertising creatives for e-commerce using a 3-layer style system.

## 3-LAYER SYSTEM

### Layer 1 — Creative Style (WHAT is in the frame)
Composition layout. You are ASSIGNED one creative style per card — do not change it. Your job is to execute it perfectly.

### Layer 2 — Marketing Style (WHAT message we communicate)
Pick ONE per card. The marketing style defines what we are selling:
- main_cover → Premium Brand, Premium Quality, Bestseller, New Arrival, Feature First
- usage_demo → Lifestyle, Easy To Use, Problem→Solution, Home Use, Comfort
- features_detail → Feature First, Premium Quality, Performance, Technology, Durability

### Layer 3 — Visual Theme (HOW it looks)
Pick ONE lighting + ONE background style + ONE mood per card. They must work together:
- Lighting sets the mood: soft studio, dramatic spotlight, natural daylight, dark moody, high contrast, golden hour
- Background style sets the stage: pure white, premium gradient, marble surface, dark studio, environmental, abstract tech, editorial backdrop
- Mood sets the feeling: minimal luxury, editorial/vogue, technology/innovation, warm & cozy, dynamic/action, clean & clinical

## 3 CARDS

Card 1 (main_cover): Hero shot. STOP the scroll. Magazine quality. Large AZ headline.
Card 2 (usage_demo): Product in use. Lifestyle context. Create desire.
Card 3 (features_detail): Details, quality, features. Infographic style.

## TEXT RULES
- ALL visible text: AZERBAIJANI LATIN SCRIPT ONLY. NEVER English. NEVER Russian. NEVER Cyrillic.
- Short: 3-5 words per headline. Examples: "LED TERAPİYA", "3 REJİM", "ERQONOMİK DİZAYN"

## PROCESS
1. You receive an assigned Creative Style per card — execute it
2. Pick ONE Marketing Style per card (from marketing_styles library)
3. Select lighting + background style + mood per card (from visual_themes library)
4. Pick layout, position, background, visual effects from design libraries
5. Run Creative Director self-review (all 6 questions MUST be YES)
6. If any question = NO, redesign and try again
7. Write the final image description

## PROMPT RULES
- Each prompt_en under 300 words
- Full English sentences for Nano Banana 2
- Reference original photo for product shape/color fidelity
- CREATE A NEW IMAGE — do not edit the reference photo

Output ONLY valid JSON. No markdown.`

// ─── USER PROMPT (собирается динамически) ───────────────────────────────────

function buildUserPrompt(
  cs1: CreativeStyle, cs2: CreativeStyle, cs3: CreativeStyle,
  analysis: VisionOutput,
  providerDescription?: string,
  characteristics?: Record<string, string>,
): string {
  const CREATIVE_STYLES = loadCreativeStyles()
  const MARKETING_STYLES = loadMarketingStyles()
  const VISUAL_THEMES = loadVisualThemes()

  const DESIGN = {
    layouts: loadDesignLibrary('layouts.json'),
    positions: loadDesignLibrary('positions.json'),
    backgrounds: loadDesignLibrary('backgrounds.json'),
    visual_effects: loadDesignLibrary('visual-effects.json'),
    composition_rules: loadDesignLibrary('composition-rules.json'),
    marketplace_rules: loadDesignLibrary('marketplace-rules.json'),
    creative_director: loadDesignLibrary('creative-director.json'),
  }

  // Собираем через конкатенацию (JSON контент ломает template literals)
  return [
    'Create 3 image prompts for this product. Act as Creative Director using the 3-layer system.',
    '',
    '## LAYER 1 — Creative Style Library (40 styles — WHAT is in frame)',
    JSON.stringify(CREATIVE_STYLES, null, 2),
    '',
    '## LAYER 2 — Marketing Style Library (30 styles — WHAT message we sell)',
    JSON.stringify(MARKETING_STYLES, null, 2),
    '',
    '## LAYER 3 — Visual Theme Library (HOW it looks)',
    JSON.stringify(VISUAL_THEMES, null, 2),
    '',
    '## SUPPORTING DESIGN LIBRARIES',
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
    '## CREATIVE STYLES ASSIGNED (do NOT change)',
    '',
    'CARD 1 CREATIVE STYLE: ' + cs1.id + ' — ' + cs1.name + ' — ' + cs1.prompt_fragment,
    'CARD 2 CREATIVE STYLE: ' + cs2.id + ' — ' + cs2.name + ' — ' + cs2.prompt_fragment,
    'CARD 3 CREATIVE STYLE: ' + cs3.id + ' — ' + cs3.name + ' — ' + cs3.prompt_fragment,
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
    '      "creative_style": "' + cs1.id + '",',
    '      "marketing_style": "ms04",',
    '      "visual_theme": {',
    '        "lighting": "soft_studio",',
    '        "background_style": "pure_white",',
    '        "mood": "minimal_luxury"',
    '      },',
    '      "layout": "C",',
    '      "product_position": "Center front",',
    '      "background": "Soft white studio",',
    '      "visual_effects": ["soft_glow"],',
    '      "creative_director_passed": true,',
    '      "prompt_en": "Full product scene description in English. Under 300 words.",',
    '      "text_overlay_az": ["HEADLINE AZ"],',
    '      "needs_model": ' + String(cs1.needs_model),
    '    },',
    '    {',
    '      "index": 2,',
    '      "purpose": "usage_demo",',
    '      "creative_style": "' + cs2.id + '",',
    '      "marketing_style": "ms20",',
    '      "visual_theme": {',
    '        "lighting": "natural_daylight",',
    '        "background_style": "environmental",',
    '        "mood": "warm_cozy"',
    '      },',
    '      "layout": "G",',
    '      "product_position": "In hand",',
    '      "background": "Modern bathroom",',
    '      "visual_effects": [],',
    '      "creative_director_passed": true,',
    '      "prompt_en": "...",',
    '      "text_overlay_az": [],',
    '      "needs_model": ' + String(cs2.needs_model),
    '    },',
    '    {',
    '      "index": 3,',
    '      "purpose": "features_detail",',
    '      "creative_style": "' + cs3.id + '",',
    '      "marketing_style": "ms03",',
    '      "visual_theme": {',
    '        "lighting": "soft_studio",',
    '        "background_style": "pure_white",',
    '        "mood": "clean_clinical"',
    '      },',
    '      "layout": "features_row",',
    '      "product_position": "Macro close-up (partial)",',
    '      "background": "Soft white studio",',
    '      "visual_effects": ["luxury_highlights"],',
    '      "creative_director_passed": true,',
    '      "prompt_en": "...",',
    '      "text_overlay_az": ["FEATURE 1 AZ", "FEATURE 2 AZ"],',
    '      "needs_model": ' + String(cs3.needs_model),
    '    }',
    '  ]',
    '}',
    '',
    'RULES:',
    '- creative_style: use the ASSIGNED id — do not change it.',
    '- marketing_style: pick from the Marketing Style Library (ms01-ms30).',
    '- visual_theme: pick lighting, background_style, mood from Visual Theme Library.',
    '- text_overlay_az: AZERBAIJANI LATIN ONLY. Empty array [] if no text.',
    '- Every card must have creative_director_passed = true.',
    '- One image = one marketing message.',
    '- prompt_en writes product scene only — style prefix, design libraries, and rules are added automatically.',
    '',
    'Respond ONLY with the JSON.',
  ].join('\n')
}

// ─── ВЫБОР CREATIVE STYLE (код, не LLM) ─────────────────────────────────────

function pickCreativeStyle(
  useFor: string,
  vision: VisionOutput,
  styles: CreativeStyle[],
): CreativeStyle {
  const candidates = styles.filter(s => s.use_for.includes(useFor))

  // Фильтруем по model/environment требованиям
  const filtered = candidates.filter(s => {
    if (!vision.needs_human_model && s.needs_model) return false
    if (!vision.needs_lifestyle_scene && s.needs_environment) return false
    return true
  })

  const pool = filtered.length > 0 ? filtered : candidates

  // main_cover: приоритеты по premium_level
  if (useFor === 'main_cover') {
    // luxury → cs37 Minimal Luxury, cs27 Premium Gradient, cs12 Premium Showcase
    if (vision.premium_level === 'luxury') {
      const luxuryPick = pool.find(s => s.id === 'cs37')
        || pool.find(s => s.id === 'cs27')
        || pool.find(s => s.id === 'cs12')
      if (luxuryPick) return luxuryPick
    }
    // premium → cs01 Hero Product, cs25 Premium Banner
    if (vision.premium_level === 'premium') {
      const premiumPick = pool.find(s => s.id === 'cs01')
        || pool.find(s => s.id === 'cs25')
        || pool.find(s => s.id === 'cs04')
      if (premiumPick) return premiumPick
    }
    // budget/mid → cs02 Product + Price, cs26 Clean Marketplace
    if (vision.premium_level === 'budget' || vision.premium_level === 'mid') {
      const valuePick = pool.find(s => s.id === 'cs26')
        || pool.find(s => s.id === 'cs02')
        || pool.find(s => s.id === 'cs01')
      if (valuePick) return valuePick
    }
    // дефолт: cs01 Hero Product
    const hero = pool.find(s => s.id === 'cs01')
    if (hero) return hero
  }

  // usage_demo с моделью → cs07 Product In Use, cs06 In Hand
  if (useFor === 'usage_demo' && vision.needs_human_model) {
    const inUse = pool.find(s => s.id === 'cs07')
      || pool.find(s => s.id === 'cs06')
    if (inUse) return inUse
  }

  // usage_demo без модели → cs11 Lifestyle Hero, cs08 Premium Interior, cs29 Environmental Scene
  if (useFor === 'usage_demo' && !vision.needs_human_model) {
    const life = pool.find(s => s.id === 'cs11')
      || pool.find(s => s.id === 'cs08')
      || pool.find(s => s.id === 'cs29')
    if (life) return life
  }

  // features_detail с макро → cs10 Macro Detail
  if (useFor === 'features_detail' && vision.needs_macro_shots) {
    const macro = pool.find(s => s.id === 'cs10')
    if (macro) return macro
  }

  // features_detail с exploded → cs21 Exploded View
  if (useFor === 'features_detail' && vision.needs_exploded_view) {
    const exp = pool.find(s => s.id === 'cs21')
    if (exp) return exp
  }

  // features_detail дефолт → cs04 Premium Feature, cs22 Benefits Around
  if (useFor === 'features_detail') {
    const feat = pool.find(s => s.id === 'cs04')
      || pool.find(s => s.id === 'cs22')
      || pool.find(s => s.id === 'cs16')
    if (feat) return feat
  }

  // Дефолт: первая подходящая
  return pool[0] || candidates[0] || styles[0]
}

// ─── ВЫБОР MARKETING STYLE (код даёт дефолт, LLM может переопределить) ──────

function pickMarketingStyle(
  useFor: string,
  _vision: VisionOutput,
  styles: MarketingStyle[],
): MarketingStyle {
  const candidates = styles.filter(s => s.best_for.includes(useFor))

  if (useFor === 'main_cover') {
    // Приоритет: Premium Brand > Premium Quality > Feature First
    const pick = candidates.find(s => s.id === 'ms27')  // Premium Brand
      || candidates.find(s => s.id === 'ms04')           // Premium Quality
      || candidates.find(s => s.id === 'ms06')           // Bestseller
    if (pick) return pick
  }

  if (useFor === 'usage_demo') {
    const pick = candidates.find(s => s.id === 'ms20')   // Lifestyle
      || candidates.find(s => s.id === 'ms09')           // Easy To Use
      || candidates.find(s => s.id === 'ms11')           // Home Use
    if (pick) return pick
  }

  if (useFor === 'features_detail') {
    const pick = candidates.find(s => s.id === 'ms03')   // Feature First
      || candidates.find(s => s.id === 'ms04')           // Premium Quality
      || candidates.find(s => s.id === 'ms15')           // Performance
    if (pick) return pick
  }

  return candidates[0] || styles[0]
}

// ─── ВЫБОР VISUAL THEME (код даёт дефолт, LLM может переопределить) ─────────

function pickVisualTheme(
  useFor: string,
  vision: VisionOutput,
  themes: VisualThemeCatalog,
): { lighting: string; background_style: string; mood: string } {
  if (useFor === 'main_cover') {
    if (vision.premium_level === 'luxury' || vision.premium_level === 'premium') {
      return { lighting: 'soft_studio', background_style: 'premium_gradient', mood: 'minimal_luxury' }
    }
    return { lighting: 'soft_studio', background_style: 'pure_white', mood: 'clean_clinical' }
  }

  if (useFor === 'usage_demo') {
    return { lighting: 'natural_daylight', background_style: 'environmental', mood: 'warm_cozy' }
  }

  if (useFor === 'features_detail') {
    if (vision.premium_level === 'luxury' || vision.premium_level === 'premium') {
      return { lighting: 'softbox_diffused', background_style: 'dark_studio', mood: 'tech_innovation' }
    }
    return { lighting: 'soft_studio', background_style: 'pure_white', mood: 'clean_clinical' }
  }

  return { lighting: 'soft_studio', background_style: 'pure_white', mood: 'minimal_luxury' }
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

export async function planCardPrompts(
  analysis: VisionOutput,
  providerDescription?: string,
  characteristics?: Record<string, string>,
): Promise<PromptsOutput> {
  const config = TOVAR_AI_CONFIG
  const creativeStyles = loadCreativeStyles()
  const marketingStyles = loadMarketingStyles()
  const visualThemes = loadVisualThemes()

  // Код выбирает creative styles (структурное решение)
  const cs1 = pickCreativeStyle('main_cover', analysis, creativeStyles)
  const cs2 = pickCreativeStyle('usage_demo', analysis, creativeStyles)
  const cs3 = pickCreativeStyle('features_detail', analysis, creativeStyles)

  // Код даёт дефолты для marketing и visual theme (LLM может переопределить)
  const ms1 = pickMarketingStyle('main_cover', analysis, marketingStyles)
  const ms2 = pickMarketingStyle('usage_demo', analysis, marketingStyles)
  const ms3 = pickMarketingStyle('features_detail', analysis, marketingStyles)

  const vt1 = pickVisualTheme('main_cover', analysis, visualThemes)
  const vt2 = pickVisualTheme('usage_demo', analysis, visualThemes)
  const vt3 = pickVisualTheme('features_detail', analysis, visualThemes)

  const styleMap = [cs1, cs2, cs3]
  const msMap = [ms1, ms2, ms3]
  const vtMap = [vt1, vt2, vt3]

  console.log(`[Stage 2] Creative Styles: card1=${cs1.id} (${cs1.name}), card2=${cs2.id} (${cs2.name}), card3=${cs3.id} (${cs3.name})`)
  console.log(`[Stage 2] Marketing Styles: card1=${ms1.id} (${ms1.name}), card2=${ms2.id} (${ms2.name}), card3=${ms3.id} (${ms3.name})`)
  console.log(`[Stage 2] Visual Themes: card1=${vt1.mood}, card2=${vt2.mood}, card3=${vt3.mood}`)

  const userPrompt = buildUserPrompt(cs1, cs2, cs3, analysis, providerDescription, characteristics)

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
    cards: Array<{
      index: number; purpose: string
      creative_style?: string; marketing_style?: string
      visual_theme?: { lighting: string; background_style: string; mood: string }
      layout?: string; product_position?: string; background?: string
      visual_effects?: string[]; creative_director_passed?: boolean
      prompt_en: string; text_overlay_az: string[]; needs_model: boolean
    }>
  }>(raw)

  if (!Array.isArray(parsed.cards) || parsed.cards.length < 3) {
    throw new Error(`Stage 2: Expected 3 cards, got ${parsed.cards?.length || 0}`)
  }

  // Сборка финального промпта: [BASE] + [Creative Style] + [Marketing Style] + [Visual Theme] + [LLM content]
  for (const card of parsed.cards) {
    const cs = styleMap[card.index - 1]
    const ms = card.marketing_style
      ? marketingStyles.find(m => m.id === card.marketing_style) || msMap[card.index - 1]
      : msMap[card.index - 1]
    const vt = card.visual_theme || vtMap[card.index - 1]

    // Находим lighting, background_style, mood описания из каталога
    const lightingItem = visualThemes.lighting.find(l => l.id === vt.lighting)
    const bgItem = visualThemes.background_style.find(b => b.id === vt.background_style)
    const moodItem = visualThemes.mood.find(m => m.id === vt.mood)

    const designDecisions = [
      `Creative Style: ${cs.name}. ${cs.prompt_fragment}`,
      `Marketing Style: ${ms.name}. ${ms.prompt_fragment}`,
      `Visual Theme — Lighting: ${lightingItem?.prompt_fragment || vt.lighting}.`,
      `Visual Theme — Background: ${bgItem?.prompt_fragment || vt.background_style}.`,
      `Visual Theme — Mood: ${moodItem?.prompt_fragment || vt.mood}.`,
      card.layout ? `Layout: ${card.layout}.` : '',
      card.product_position ? `Product position: ${card.product_position}.` : '',
      card.background ? `Environment: ${card.background}.` : '',
      Array.isArray(card.visual_effects) && card.visual_effects.length > 0
        ? `Visual effects: ${card.visual_effects.join(', ')}.` : '',
    ].filter(Boolean).join(' ')

    const textInstruction = card.text_overlay_az.length > 0
      ? `Render this text on the image: ${card.text_overlay_az.join(' — ')}.`
      : ''

    card.prompt_en = [
      BASE_PROMPT,
      designDecisions,
      textInstruction,
      card.prompt_en,
    ].filter(Boolean).join(' ')
  }

  // Убираем design-поля из cards, оставляем нужное для генерации
  const cleanCards = parsed.cards.map(c => ({
    index: c.index,
    purpose: c.purpose as 'main_cover' | 'usage_demo' | 'features_detail',
    prompt_en: c.prompt_en,
    text_overlay_az: c.text_overlay_az,
    needs_model: c.needs_model,
    composition: c.layout || 'center',
    reference_weight: c.purpose === 'main_cover' ? 0.8 : c.needs_model ? 0.5 : 0.8,
    creative_style: c.creative_style || styleMap[c.index - 1].id,
    marketing_style: c.marketing_style || msMap[c.index - 1].id,
    visual_theme: c.visual_theme || vtMap[c.index - 1],
  }))

  return {
    style_name: `${cs1.id}+${cs2.id}+${cs3.id}`,
    marketing_styles: [ms1.id, ms2.id, ms3.id],
    visual_themes: [vt1, vt2, vt3],
    cards: cleanCards,
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseJSON<T>(raw: string): T {
  let cleaned = raw.trim()
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '')
  }
  return JSON.parse(cleaned) as T
}
