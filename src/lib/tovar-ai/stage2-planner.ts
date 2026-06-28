// ============================================================================
// Stage 2: Creative Director + Prompt Planner
// Рекламная философия: Meta Ads креативы, а не «красивые карточки»
// 3-слойная система + 24 рекламные роли + 8 design-библиотек
// ============================================================================

import * as fs from 'node:fs'
import * as path from 'node:path'
import { TOVAR_AI_CONFIG, type VisionOutput, type PromptsOutput, type CardRole } from './types'

// ─── ТИПЫ ДЛЯ БИБЛИОТЕК ─────────────────────────────────────────────────────

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

// ─── ВСЕ РЕКЛАМНЫЕ РОЛИ ─────────────────────────────────────────────────────

const ALL_ROLES: CardRole[] = [
  'hero', 'price', 'problem', 'solution', 'benefits', 'usage',
  'lifestyle', 'offer', 'bundle', 'delivery', 'comparison', 'quality',
  'materials', 'warranty', 'accessories', 'close_up', 'cta',
  'dimensions', 'power', 'premium', 'review', 'gift',
  'new_arrival', 'best_seller',
]

// ─── РОЛЬ → CREATIVE STYLES ─────────────────────────────────────────────────

const ROLE_CREATIVE_STYLES: Record<CardRole, string[]> = {
  hero:         ['cs01', 'cs12', 'cs25', 'cs37', 'cs27'],
  price:        ['cs02', 'cs15'],
  problem:      ['cs09'],
  solution:     ['cs09', 'cs01'],
  benefits:     ['cs04', 'cs05', 'cs22'],
  usage:        ['cs06', 'cs07'],
  lifestyle:    ['cs08', 'cs11', 'cs29', 'cs34'],
  offer:        ['cs02', 'cs15', 'cs23'],
  bundle:       ['cs13', 'cs30'],
  delivery:     ['cs03'],
  comparison:   ['cs17'],
  quality:      ['cs10', 'cs18', 'cs28'],
  materials:    ['cs18', 'cs10'],
  warranty:     ['cs04', 'cs22', 'cs01'],
  accessories:  ['cs13', 'cs30'],
  close_up:     ['cs10', 'cs16'],
  cta:          ['cs23', 'cs01'],
  dimensions:   ['cs06', 'cs34'],
  power:        ['cs19', 'cs20', 'cs32'],
  premium:      ['cs37', 'cs27', 'cs12', 'cs28'],
  review:       ['cs40', 'cs11'],
  gift:         ['cs31', 'cs24'],
  new_arrival:  ['cs07', 'cs19', 'cs01'],
  best_seller:  ['cs14', 'cs01', 'cs12'],
}

// ─── РОЛЬ → MARKETING STYLES ────────────────────────────────────────────────

const ROLE_MARKETING_STYLES: Record<CardRole, string[]> = {
  hero:         ['ms27', 'ms04', 'ms06'],
  price:        ['ms01', 'ms02', 'ms28'],
  problem:      ['ms21'],
  solution:     ['ms21', 'ms22'],
  benefits:     ['ms03', 'ms04', 'ms05'],
  usage:        ['ms09', 'ms20', 'ms11'],
  lifestyle:    ['ms20', 'ms11'],
  offer:        ['ms02', 'ms29', 'ms30'],
  bundle:       ['ms05', 'ms28'],
  delivery:     ['ms08'],
  comparison:   ['ms03', 'ms15'],
  quality:      ['ms04', 'ms14'],
  materials:    ['ms04', 'ms14'],
  warranty:     ['ms18', 'ms26'],
  accessories:  ['ms05'],
  close_up:     ['ms03', 'ms04'],
  cta:          ['ms30', 'ms29'],
  dimensions:   ['ms12', 'ms09'],
  power:        ['ms15', 'ms16', 'ms17'],
  premium:      ['ms27', 'ms04'],
  review:       ['ms06', 'ms26'],
  gift:         ['ms23', 'ms24'],
  new_arrival:  ['ms07', 'ms16'],
  best_seller:  ['ms06', 'ms29'],
}

// ─── РОЛЬ → VISUAL THEME ────────────────────────────────────────────────────

const ROLE_VISUAL_THEMES: Record<CardRole, { lighting: string; background_style: string; mood: string }> = {
  hero:         { lighting: 'soft_studio', background_style: 'premium_gradient', mood: 'minimal_luxury' },
  price:        { lighting: 'high_contrast', background_style: 'pure_white', mood: 'dynamic_action' },
  problem:      { lighting: 'dark_moody', background_style: 'environmental', mood: 'industrial_premium' },
  solution:     { lighting: 'golden_hour', background_style: 'environmental', mood: 'warm_cozy' },
  benefits:     { lighting: 'softbox_diffused', background_style: 'dark_studio', mood: 'tech_innovation' },
  usage:        { lighting: 'natural_daylight', background_style: 'environmental', mood: 'warm_cozy' },
  lifestyle:    { lighting: 'golden_hour', background_style: 'environmental', mood: 'editorial_vogue' },
  offer:        { lighting: 'high_contrast', background_style: 'premium_gradient', mood: 'dynamic_action' },
  bundle:       { lighting: 'soft_studio', background_style: 'pure_white', mood: 'clean_clinical' },
  delivery:     { lighting: 'soft_studio', background_style: 'pure_white', mood: 'clean_clinical' },
  comparison:   { lighting: 'softbox_diffused', background_style: 'pure_white', mood: 'clean_clinical' },
  quality:      { lighting: 'dramatic_spotlight', background_style: 'dark_studio', mood: 'classic_luxury' },
  materials:    { lighting: 'dramatic_spotlight', background_style: 'marble_surface', mood: 'classic_luxury' },
  warranty:     { lighting: 'soft_studio', background_style: 'pure_white', mood: 'clean_clinical' },
  accessories:  { lighting: 'soft_studio', background_style: 'pure_white', mood: 'clean_clinical' },
  close_up:     { lighting: 'rim_light', background_style: 'dark_studio', mood: 'modern_sleek' },
  cta:          { lighting: 'high_contrast', background_style: 'premium_gradient', mood: 'dynamic_action' },
  dimensions:   { lighting: 'soft_studio', background_style: 'pure_white', mood: 'clean_clinical' },
  power:        { lighting: 'dramatic_spotlight', background_style: 'abstract_tech', mood: 'tech_innovation' },
  premium:      { lighting: 'soft_studio', background_style: 'premium_gradient', mood: 'minimal_luxury' },
  review:       { lighting: 'natural_daylight', background_style: 'editorial_backdrop', mood: 'editorial_vogue' },
  gift:         { lighting: 'golden_hour', background_style: 'editorial_backdrop', mood: 'warm_cozy' },
  new_arrival:  { lighting: 'rim_light', background_style: 'abstract_tech', mood: 'tech_innovation' },
  best_seller:  { lighting: 'soft_studio', background_style: 'premium_gradient', mood: 'minimal_luxury' },
}

// ─── ЗАГРУЗКА БИБЛИОТЕК ─────────────────────────────────────────────────────

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

// ─── BASE PROMPT — рекламный, не каталожный ─────────────────────────────────

const BASE_PROMPT = `Create a high-converting e-commerce advertisement image.

The image must look like a paid Meta Ads creative, not a product catalog photo. It should resemble the best-performing ads on Facebook, Instagram, Trendyol, Shopify, and modern marketplaces.

Generate ONE image only.
Never create collages.
Never create split layouts.
Never create multiple panels.
Never create infographic grids.
One image = one clear advertising message.

## PRODUCT DOMINANCE
The product should dominate the composition — occupy approximately 60-70% of the frame.
It must be the undisputed hero. Never make the product small or secondary.

## ADVERTISING STYLE
Do NOT generate luxury Apple-style posters.
Do NOT create minimal premium editorials with lots of empty space.
Prefer high-converting e-commerce advertisements over minimal catalog images.
The design should maximize click-through rate.
The advertisement should immediately feel promotional — like a paid Meta Ads creative.

## LAYOUT & HIERARCHY
Always build a strong visual hierarchy:
Headline first → Product dominant → Benefits/info blocks → Offer/promotion → CTA.
Do not leave large empty areas.
The advertisement should contain enough commercial information.
Prefer multiple short information cards over long paragraphs.

## COMMERCIAL BLOCKS
Use premium rounded commercial blocks for: Prices, Features, Delivery, Warranty, Discounts, Specifications, Buttons.
Cards should have soft shadows and rounded corners.
Cards should naturally surround the product.
Do not leave floating text without visual containers.
Generate floating rounded information blocks when appropriate.

## COLORS
Prefer vibrant commercial backgrounds.
Use bold gradients.
Use high contrast between background and product.
Avoid pale minimalist color palettes.

## DEPTH & LAYERS
Create layered compositions with foreground and background depth.
Use floating shapes, soft glows, reflections, gradient lighting.
Add large geometric background elements and subtle decorative graphics.
Achieve commercial visual depth — not flat minimalism.

## QUALITY
Photorealistic. Studio quality. Modern advertising style. Ultra realistic. 8K.
The product is always the main subject.
Do not change the product shape. Do not invent new product parts.
Remove all watermarks, stickers, logos and packaging unless requested.

## SELF-REVIEW
Before finalizing: would a professional e-commerce designer approve this layout for a paid advertisement?
If the answer is no, redesign the composition before generating.

CRITICAL — Analyze the uploaded product before generating the image. Determine automatically: product category, materials, intended use, target customer, suitable environment, appropriate lighting, realistic accessories, correct hand position if applicable, realistic usage scenario.

Do not reuse the same environment for every product.
Beauty products → skincare environments.
Electronics → modern technology environments.
Kitchen products → premium kitchens.
Automotive → automotive environments.
Fitness → sports environments.
Office → office environments.
Pet → home environments.`

// ─── SYSTEM PROMPT — Creative Director как рекламщик ─────────────────────────

const SYSTEM_PROMPT = `You are a Creative Director for TAPLA MARKETPLACE (Azerbaijan). You design high-converting advertising creatives for e-commerce — not just product photos, but paid social media advertisements.

## YOUR GOAL
Maximize click-through rate (CTR). Every image should make someone STOP scrolling and CLICK.
The image must feel like a professional Meta Ads / Trendyol / Shopify promotional creative.

## 3-LAYER SYSTEM

### Layer 1 — Creative Style (WHAT is in the frame)
You are ASSIGNED one creative style per card — execute it faithfully.

### Layer 2 — Marketing Style (WHAT message we communicate)
Pick ONE per card. The marketing style defines the primary selling message.

### Layer 3 — Visual Theme (HOW it looks)
Pick ONE lighting + ONE background style + ONE mood per card.

## CARD ROLES
Each card has an ASSIGNED advertising role (e.g., "hero", "price", "lifestyle", "offer", "benefits", etc.).
The role determines what the card is selling. Your job is to bring that role to life:
- hero → stunning first impression, scroll-stopper
- price → price is the hero, product supports it
- offer → discount/promotion, urgency
- benefits → feature cards around product
- usage → real person using the product
- lifestyle → aspirational beautiful context
- quality → materials and craftsmanship
- comparison → product vs alternative
- close_up → extreme detail shot
- cta → direct action, buy now
- And others... Each role = one clear advertising task.

## TEXT RULES
- ALL visible text: AZERBAIJANI LATIN SCRIPT ONLY. NEVER English. NEVER Russian. NEVER Cyrillic.
- Short: 3-5 words per headline. Examples: "LED TERAPİYA", "3 REJİM", "PULSUZ ÇATDIRILMA"
- Text goes inside rounded commercial blocks/cards — never floating without container

## PROCESS
1. Understand the assigned role for each card
2. Execute the assigned Creative Style
3. Pick ONE Marketing Style per card
4. Select lighting + background style + mood per card
5. Pick layout, position, background, visual effects
6. Design commercial information blocks (price cards, feature cards, delivery badges, etc.)
7. Run Creative Director self-review (all 6 questions MUST be YES)
8. If any question = NO, redesign and try again
9. Write the final image description

## PROMPT RULES
- Each prompt_en under 300 words
- Full English sentences for Nano Banana 2
- Reference original photo for product shape/color fidelity
- CREATE A NEW IMAGE — do not edit the reference photo
- The prompt must describe a commercial advertisement, not a product catalog photo

Output ONLY valid JSON. No markdown.`

// ─── USER PROMPT ────────────────────────────────────────────────────────────

function buildUserPrompt(
  roles: CardRole[],
  cs: CreativeStyle[],
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

  // Собираем роли в читаемый формат
  const roleDescriptions = roles.map((r, i) =>
    `CARD ${i + 1} ROLE: "${r}" — ${ROLE_DESCRIPTIONS[r]}`
  ).join('\n')

  return [
    'Create 3 advertising image prompts for this product. Act as Creative Director using the 3-layer system with assigned advertising roles.',
    '',
    '## ASSIGNED ADVERTISING ROLES (do NOT change)',
    roleDescriptions,
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
    ...cs.map((s, i) => `CARD ${i + 1} CREATIVE STYLE: ${s.id} — ${s.name} — ${s.prompt_fragment}`),
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
    `    {`,
    `      "index": 1,`,
    `      "role": "${roles[0]}",`,
    `      "creative_style": "${cs[0].id}",`,
    `      "marketing_style": "ms04",`,
    `      "visual_theme": {`,
    `        "lighting": "soft_studio",`,
    `        "background_style": "premium_gradient",`,
    `        "mood": "minimal_luxury"`,
    `      },`,
    `      "layout": "C",`,
    `      "product_position": "Center front",`,
    `      "background": "Soft white studio",`,
    `      "visual_effects": ["soft_glow"],`,
    `      "creative_director_passed": true,`,
    `      "prompt_en": "Full advertising scene description in English. Under 300 words. Describe a commercial ad, not a catalog photo.",`,
    `      "text_overlay_az": ["HEADLINE AZ"],`,
    `      "commercial_blocks": ["price card", "delivery badge"],`,
    `      "needs_model": ${String(cs[0].needs_model)}`,
    `    },`,
    `    {`,
    `      "index": 2,`,
    `      "role": "${roles[1]}",`,
    `      "creative_style": "${cs[1].id}",`,
    `      "marketing_style": "ms20",`,
    `      "visual_theme": {`,
    `        "lighting": "natural_daylight",`,
    `        "background_style": "environmental",`,
    `        "mood": "warm_cozy"`,
    `      },`,
    `      "layout": "G",`,
    `      "product_position": "In hand",`,
    `      "background": "Modern bathroom",`,
    `      "visual_effects": [],`,
    `      "creative_director_passed": true,`,
    `      "prompt_en": "...",`,
    `      "text_overlay_az": [],`,
    `      "commercial_blocks": [],`,
    `      "needs_model": ${String(cs[1].needs_model)}`,
    `    },`,
    `    {`,
    `      "index": 3,`,
    `      "role": "${roles[2]}",`,
    `      "creative_style": "${cs[2].id}",`,
    `      "marketing_style": "ms03",`,
    `      "visual_theme": {`,
    `        "lighting": "softbox_diffused",`,
    `        "background_style": "dark_studio",`,
    `        "mood": "tech_innovation"`,
    `      },`,
    `      "layout": "features_row",`,
    `      "product_position": "Macro close-up (partial)",`,
    `      "background": "Dark premium studio",`,
    `      "visual_effects": ["luxury_highlights"],`,
    `      "creative_director_passed": true,`,
    `      "prompt_en": "...",`,
    `      "text_overlay_az": ["FEATURE 1 AZ", "FEATURE 2 AZ"],`,
    `      "commercial_blocks": ["feature cards", "spec badges"],`,
    `      "needs_model": ${String(cs[2].needs_model)}`,
    `    }`,
    '  ]',
    '}',
    '',
    'RULES:',
    '- role: use the ASSIGNED role — do not change it.',
    '- creative_style: use the ASSIGNED id — do not change it.',
    '- marketing_style: pick from the Marketing Style Library (ms01-ms30).',
    '- visual_theme: pick lighting, background_style, mood from Visual Theme Library.',
    '- text_overlay_az: AZERBAIJANI LATIN ONLY. Empty array [] if no text.',
    '- commercial_blocks: list which commercial blocks to include (price cards, delivery badges, feature cards, warranty badge, CTA button, etc.).',
    '- Every card must have creative_director_passed = true.',
    '- One image = one advertising message.',
    '- prompt_en writes the full advertising scene — style prefix, design libraries, and rules are added automatically.',
    '- The image must look like a paid Meta Ads / Trendyol creative, NOT a catalog photo.',
    '',
    'Respond ONLY with the JSON.',
  ].join('\n')
}

// ─── ОПИСАНИЯ РОЛЕЙ ─────────────────────────────────────────────────────────

const ROLE_DESCRIPTIONS: Record<CardRole, string> = {
  hero: 'Stunning first impression. Scroll-stopper. Magazine quality. Product dominant with headline.',
  price: 'Price is the hero. Large price card. Product supports the attractive price. Promotional.',
  problem: 'Show a common problem visually. The product is the answer. Creates recognition.',
  solution: 'The product as the immediate solution. Visible transformation or benefit.',
  benefits: 'Product centered with feature/benefit cards arranged around it. Icons and thin connection lines.',
  usage: 'Real person naturally using the product. Authentic interaction. Shows real-world application.',
  lifestyle: 'Beautiful aspirational environment. No people or subtle human presence. Magazine quality.',
  offer: 'Promotion card prominent. Discount emphasis. Urgency. Limited-time feeling.',
  bundle: 'Show everything included. All accessories visible. Complete package presentation.',
  delivery: 'Fast delivery message prominent. Product remains focus. Shipping iconography.',
  comparison: 'Product compared against standard alternative. Clean visual comparison showing superiority.',
  quality: 'Focus on materials and craftsmanship. Premium macro details. Luxury texture visible.',
  materials: 'Extreme focus on materials: metal, glass, leather, wood. Craftsmanship celebration.',
  warranty: 'Trust and reliability message. Warranty badge prominent. Professional confidence.',
  accessories: 'All included accessories displayed. Perfect alignment. Complete set presentation.',
  close_up: 'Extreme macro detail of key feature. Texture, materials, premium reflections. Very shallow depth of field.',
  cta: 'Large clear Call To Action. Minimal supporting text. Hero product. Designed for conversion.',
  dimensions: 'Show actual size and scale. Product in hand or with size reference. Portability emphasis.',
  power: 'Performance focus. Energy, speed, efficiency. Technology-inspired. Dynamic lighting.',
  premium: 'Luxury positioning. Minimal but vibrant. High-end brand aesthetic. Very expensive feeling.',
  review: 'Testimonial feeling. Trust and social proof. Magazine editorial quality with review stars.',
  gift: 'Gift-ready presentation. Premium packaging visible. Holiday or special occasion feeling.',
  new_arrival: 'Fresh and cutting-edge. Latest technology. Modern and innovative. Just launched feeling.',
  best_seller: 'Popular choice. Bestseller badge. Social proof through popularity. Most purchased.',
}

// ─── ВЫБОР РОЛЕЙ (случайно, с учётом VisionOutput) ───────────────────────────

function selectRoles(count: number, vision: VisionOutput): CardRole[] {
  // Роли, требующие модель — исключаем если товар без неё
  const availableRoles = ALL_ROLES.filter(role => {
    if (!vision.needs_human_model && ['usage', 'lifestyle'].includes(role)) {
      // lifestyle без модели — ок (cs11, cs29), usage — нет
      if (role === 'usage') return false
    }
    if (!vision.needs_macro_shots && ['close_up', 'materials', 'quality'].includes(role)) {
      // всё ещё доступны, просто меньше стилей подходит
    }
    return true
  })

  // Фишер-Йейтс shuffle
  const shuffled = [...availableRoles]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled.slice(0, count)
}

// ─── PICK FUNCTIONS — код даёт дефолт, LLM может переопределить ─────────────

function pickCreativeStyleForRole(
  role: CardRole,
  vision: VisionOutput,
  styles: CreativeStyle[],
): CreativeStyle {
  const preferredIds = ROLE_CREATIVE_STYLES[role] || ['cs01']
  const candidates = preferredIds
    .map(id => styles.find(s => s.id === id))
    .filter(Boolean) as CreativeStyle[]

  // Фильтруем по model/environment
  const filtered = candidates.filter(s => {
    if (!vision.needs_human_model && s.needs_model) return false
    if (!vision.needs_lifestyle_scene && s.needs_environment) return false
    return true
  })

  const pool = filtered.length > 0 ? filtered : candidates
  return pool[0] || styles[0]
}

function pickMarketingStyleForRole(
  role: CardRole,
  _vision: VisionOutput,
  styles: MarketingStyle[],
): MarketingStyle {
  const preferredIds = ROLE_MARKETING_STYLES[role] || ['ms04']
  for (const id of preferredIds) {
    const found = styles.find(s => s.id === id)
    if (found) return found
  }
  return styles[0]
}

function pickVisualThemeForRole(
  role: CardRole,
): { lighting: string; background_style: string; mood: string } {
  return ROLE_VISUAL_THEMES[role] || { lighting: 'soft_studio', background_style: 'pure_white', mood: 'minimal_luxury' }
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

  // Случайный выбор 3 разных ролей
  const roles = selectRoles(config.DEFAULT_CARD_COUNT, analysis)

  // Код выбирает creative styles, marketing, visual theme под каждую роль
  const cs = roles.map(r => pickCreativeStyleForRole(r, analysis, creativeStyles))
  const ms = roles.map(r => pickMarketingStyleForRole(r, analysis, marketingStyles))
  const vt = roles.map(r => pickVisualThemeForRole(r))

  console.log(`[Stage 2] Roles: ${roles.join(', ')}`)
  console.log(`[Stage 2] Creative Styles: ${cs.map((s, i) => `${i + 1}=${s.id} (${s.name})`).join(', ')}`)
  console.log(`[Stage 2] Marketing Styles: ${ms.map((s, i) => `${i + 1}=${s.id} (${s.name})`).join(', ')}`)
  console.log(`[Stage 2] Visual Themes: ${vt.map((v, i) => `${i + 1}=${v.mood}`).join(', ')}`)

  const userPrompt = buildUserPrompt(roles, cs, analysis, providerDescription, characteristics)

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
      index: number; role: string
      creative_style?: string; marketing_style?: string
      visual_theme?: { lighting: string; background_style: string; mood: string }
      layout?: string; product_position?: string; background?: string
      visual_effects?: string[]; commercial_blocks?: string[]
      creative_director_passed?: boolean
      prompt_en: string; text_overlay_az: string[]; needs_model: boolean
    }>
  }>(raw)

  if (!Array.isArray(parsed.cards) || parsed.cards.length < 3) {
    throw new Error(`Stage 2: Expected 3 cards, got ${parsed.cards?.length || 0}`)
  }

  // Сборка финального промпта: [BASE] + [Creative Style] + [Marketing Style] + [Visual Theme] + [LLM content]
  for (const card of parsed.cards) {
    const cardCs = card.creative_style
      ? creativeStyles.find(s => s.id === card.creative_style) || cs[card.index - 1]
      : cs[card.index - 1]
    const cardMs = card.marketing_style
      ? marketingStyles.find(m => m.id === card.marketing_style) || ms[card.index - 1]
      : ms[card.index - 1]
    const cardVt = card.visual_theme || vt[card.index - 1]

    const lightingItem = visualThemes.lighting.find(l => l.id === cardVt.lighting)
    const bgItem = visualThemes.background_style.find(b => b.id === cardVt.background_style)
    const moodItem = visualThemes.mood.find(m => m.id === cardVt.mood)

    const commercialBlocks = Array.isArray(card.commercial_blocks) && card.commercial_blocks.length > 0
      ? `Commercial blocks to include: ${card.commercial_blocks.join(', ')}. Use premium rounded cards with soft shadows for each block.`
      : ''

    const designDecisions = [
      `ADVERTISING ROLE: ${card.role}. ${ROLE_DESCRIPTIONS[card.role as CardRole] || card.role}.`,
      `Creative Style: ${cardCs.name}. ${cardCs.prompt_fragment}`,
      `Marketing Style: ${cardMs.name}. ${cardMs.prompt_fragment}`,
      `Visual Theme — Lighting: ${lightingItem?.prompt_fragment || cardVt.lighting}.`,
      `Visual Theme — Background: ${bgItem?.prompt_fragment || cardVt.background_style}.`,
      `Visual Theme — Mood: ${moodItem?.prompt_fragment || cardVt.mood}.`,
      commercialBlocks,
      card.layout ? `Layout: ${card.layout}.` : '',
      card.product_position ? `Product position: ${card.product_position}.` : '',
      card.background ? `Environment: ${card.background}.` : '',
      Array.isArray(card.visual_effects) && card.visual_effects.length > 0
        ? `Visual effects: ${card.visual_effects.join(', ')}.` : '',
    ].filter(Boolean).join(' ')

    const textInstruction = card.text_overlay_az.length > 0
      ? `Render this text on the image inside rounded commercial blocks: ${card.text_overlay_az.join(' — ')}.`
      : ''

    card.prompt_en = [
      BASE_PROMPT,
      designDecisions,
      textInstruction,
      card.prompt_en,
    ].filter(Boolean).join(' ')
  }

  // Clean cards — только нужное для генерации
  const cleanCards = parsed.cards.map(c => ({
    index: c.index,
    role: (c.role || roles[c.index - 1]) as CardRole,
    prompt_en: c.prompt_en,
    text_overlay_az: c.text_overlay_az,
    needs_model: c.needs_model,
    composition: c.layout || 'center',
    reference_weight: c.role === 'hero' ? 0.7 : c.needs_model ? 0.5 : 0.7,
    creative_style: c.creative_style || cs[c.index - 1].id,
    marketing_style: c.marketing_style || ms[c.index - 1].id,
    visual_theme: c.visual_theme || vt[c.index - 1],
  }))

  return {
    style_name: cs.map(s => s.id).join('+'),
    roles: roles,
    marketing_styles: ms.map(s => s.id),
    visual_themes: vt,
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
