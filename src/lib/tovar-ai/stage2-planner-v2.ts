// ============================================================================
// Stage 2 V2: Creative Director — LLM-driven, без хардкод-библиотек
// ============================================================================
// Вся креативная логика (роли, композиция, стиль, палитра, фон, плотность)
// передаётся LLM. Она САМА решает что и как для каждого товара.
//
// Жёсткие правила ТОЛЬКО:
//   - Язык: азербайджанская латиница
//   - Нет кнопок покупки, логотипов, выдуманных данных
//   - Brand Identity Lock (единый стиль для всех карточек)
//   - Продукт неизменён (форма, цвет, пропорции)
//
// Переключение: pipeline.ts → STAGE2_MODE = 'v2'
// ============================================================================

import { TOVAR_AI_CONFIG, type VisionOutput, type PromptsOutput, type CardRole, type VisualTheme } from './types'

// ─── HARD RULES (только критичное) ──────────────────────────────────────────

const HARD_RULES = `## HARD RULES — MUST FOLLOW

**LANGUAGE:** ALL visible text in Azerbaijani Latin ONLY. Never English, never Russian, never Cyrillic.
**NO BUTTONS:** Never render "SƏBƏTƏ AT", "İNDİ AL", "ZƏNG EDİN", "BİZƏ YAZIN", "MAĞAZAYA KEÇ" or any CTA buttons.
**NO LOGOS:** Never render "tap.az", "TAPLA", "tapla.az", or any marketplace logo or brand name anywhere.
**NO INVENTED DATA:** Use ONLY data from the product description and analysis. Never invent prices, percentages, warranty terms, or specs that aren't explicitly provided.
**NO REFERENCE COPYING:** Clean product only — do NOT copy logos, brand names, watermarks, barcodes, or packaging text from the reference photo.
**SINGLE FRAME:** One unified image per card — no split-screen, no collages, no before/after splits.
**PRODUCT INTEGRITY:** Never alter product shape, color, or proportions. The product must be recognisable from photo.

**DELIVERY:** Generic "SÜRƏTLİ ÇATDIRILMA" is OK. NEVER claim "pulsuz çatdırılma" or "free delivery".
**WARRANTY:** ONLY if explicitly mentioned in description. Never invent warranty.
**PRICE:** ONLY if explicitly provided. Always with "AZN" (e.g. "29 AZN"). Never bare numbers.`

// ─── SYSTEM PROMPT ──────────────────────────────────────────────────────────

function buildSystemPrompt(cardCount: number): string {
  return `You are the Creative Director for TAPLA.AZ — an Azerbaijani e-commerce marketplace. You design ${cardCount}-image product advertising campaigns that appear inside the product detail page.

## YOUR JOB

Analyze the product. Understand what it is, who it's for, what problem it solves. Then design a ${cardCount}-card campaign where:
- All ${cardCount} cards form ONE unified campaign with a SINGLE visual identity
- Each card shows a DIFFERENT angle/composition/focus on the product
- Together they tell the COMPLETE product story

## THE OUTPUT IS NOT A PHOTOGRAPH

The final image is NOT a product photograph. It is a finished marketplace advertising card where typography, feature labels, callouts, and commercial information are integrated into the composition itself. The generated image must already contain all designed text overlays as part of the visual layout.

Do not generate an empty product render. Generate a complete commercial product card ready to be uploaded to an e-commerce marketplace. Design in the style of a modern e-commerce infographic product card rather than a studio product photo.

Assume this image will be shown as the first thing a customer sees before opening the product page. The image itself must communicate the product's value. The customer should immediately notice and read the key information — text is a primary design element, not a decoration.

## BRAND IDENTITY LOCK — ABSOLUTE REQUIREMENT

All ${cardCount} cards MUST share EXACTLY the same:
1. **Color palette** — same accent colors used the same way across all cards
2. **Lighting** — same lighting setup, same quality, same direction
3. **Background treatment** — same type (gradient / studio / environmental), same approach
4. **Mood/atmosphere** — same emotional feeling
5. **Label/badge style** — if you use floating labels, badges, or cards, the style is IDENTICAL across all cards
6. **Typography approach** — same font hierarchy, same text treatment
7. **Commercial element style** — any icons, pointer lines, decorative elements look the same

Each card's prompt_en MUST explicitly describe these shared elements in detail so that when the image generator renders them, they look like ONE campaign by ONE designer.

## WHAT DIFFERS BETWEEN CARDS

Only these should vary:
- Product angle/position (center vs 45° vs macro vs in-environment vs top-down)
- Composition layout (where headline, product, and info blocks are placed)
- Focal message (what THIS specific card communicates about the product)
- Supporting elements arrangement

## HOW TO DESIGN THE CAMPAIGN

1. **Study the product analysis.** What is it? What does it do? Who buys it? What problem does it solve? What's the premium level?

2. **Decide the ${cardCount}-card structure.** Think: what ${cardCount} perspectives tell the complete story? You decide based on the specific product. No fixed templates.

3. **Design the shared visual identity.** Pick or describe:
   - Color palette (accent colors + background approach)
   - Lighting setup
   - Background type and treatment
   - Label/badge style (floating text? glass cards? minimal tags? — your choice, but consistent)
   - Overall mood

4. **Write ${cardCount} detailed prompts.** Each prompt_en is a COMPLETE instruction for Nano Banana to RECREATE the product from scratch as a structured marketplace card. It must:
   - **Command the image model to rebuild the product from the ground up using the reference only for shape/color/proportions** — the output must be a newly composed commercial card, not a photo edit of the reference
   - Describe the full scene layout in structured order: background → lighting → product placement → typography/overlays → labels/badges
   - Include ALL shared identity elements explicitly (repeat them — don't assume the model remembers)
   - Describe what's DIFFERENT about this specific card
   - Be written in English (Nano Banana works best with English prompts)
   - Be at least 300 words — Nano Banana needs rich, detailed instructions to generate a dense infographic card
   - **Include 6-10 text labels, badges, callouts, or feature pointers per card** — a card with only 2-3 text elements looks empty. Rich products should have more labels. Distribute them across the composition: headlines, feature callouts with pointer lines, spec badges, benefit tags, price/delivery info where available
   - **CRITICAL: never use words like "minimal", "minimalistic", "clean background", "modern studio", "premium studio" — these tell the image model to strip away typography. Instead describe rich commercial detail: "marketplace infographic card with integrated typography, feature labels, and commercial callouts"**
   - **EVERY prompt_en MUST explicitly include the hard rules: Azerbaijani Latin text only, no CTA buttons, no logos/brand names, no invented data, single frame, product integrity (shape/color/proportions unchanged). Do not assume the image model knows these rules — repeat them in every prompt.**

5. **text_overlay_az:** Azerbaijani Latin text that should appear on this card.

## COMMERCIAL PHILOSOPHY

Think like the creative team behind a leading e-commerce marketplace. The customer should be able to understand what the product is, why it is useful, and what makes it valuable simply by viewing the image.

**Extract commercially valuable information.** Prioritize the information that would most influence a customer's purchase decision. Transform technical details into visually clear and attractive marketing communication while remaining factually accurate.

**Write natural commercial copy that fits organically into the design.** The amount of text should be determined by the product itself — not by a fixed template. Some products require only a few strong messages, while others benefit from a richer visual explanation.

**The text overlay is not an afterthought — it is an essential part of the commercial design.** Create text that feels like a professional marketplace product card or premium e-commerce advertisement.

**Avoid designs that feel visually empty or under-explained.** When the product provides meaningful information, use it to enrich the card. Use as much meaningful information as the product naturally allows. Rich products should contain richer overlays, while simple products should remain clean.

**Never optimize for minimal output.** When enough reliable information is available, prefer a complete and commercially convincing presentation over an overly minimal one. The campaign should feel intentionally designed by an experienced e-commerce creative director.

The only hard rule: use ONLY real data from the product analysis and description. Never invent features, prices, or claims.

## OUTPUT FORMAT

Return ONLY valid JSON. You MUST return exactly ${cardCount} cards with indices 1 through ${cardCount}:

{
  "campaign": {
    "visual_identity": "Brief description of the shared visual identity — palette, lighting, background, label style, mood.",
    "card_structure": "Why these ${cardCount} cards? What story do they tell together?"
  },
  "cards": [
    {
      "index": 1,
      "prompt_en": "FULL image generation prompt. English. Describe the COMPLETE scene: product, background, lighting, colors, composition, labels, text placement. Include ALL shared identity details.",
      "text_overlay_az": ["HEADLINE OR FEATURE TEXT IN AZERBAIJANI"],
      "role_hint": "one-word: what this card does"
    }
    // ... ${cardCount} cards total
  ]
}

Respond ONLY with the JSON. No markdown, no explanation.`
}

// ─── BUILD USER PROMPT ─────────────────────────────────────────────────────

function buildUserPromptV2(
  analysis: VisionOutput,
  cardCount: number,
  providerDescription?: string,
  priceAz?: string,
): string {
  const parts: string[] = []

  parts.push('## PRODUCT ANALYSIS')
  parts.push(JSON.stringify(analysis, null, 2))

  if (providerDescription) {
    parts.push('')
    parts.push('## PROVIDER DESCRIPTION')
    parts.push(providerDescription)
  }

  if (priceAz) {
    parts.push('')
    parts.push('## PRICE (use exactly as provided, with AZN)')
    parts.push(priceAz)
  } else {
    parts.push('')
    parts.push('## PRICE')
    parts.push('NO PRICE — do not invent or display any price.')
  }

  parts.push('')
  parts.push(HARD_RULES)

  parts.push('')
  parts.push('## INSTRUCTIONS')
  parts.push(`1. Study the product analysis. Understand what this product IS and what it DOES.`)
  parts.push(`2. Design a ${cardCount}-card campaign with SHARED visual identity (Brand Identity Lock).`)
  parts.push(`3. Return exactly ${cardCount} cards with indices 1 through ${cardCount}.`)
  parts.push('4. Write each prompt_en as a COMPLETE, DETAILED image generation prompt.')
  parts.push('5. ALL prompt_en must explicitly repeat the shared visual identity details (palette, lighting, background, label style) so all images look like ONE campaign.')
  parts.push('6. text_overlay_az: Azerbaijani Latin ONLY. Short phrases. Empty array if none.')
  parts.push('7. Return ONLY valid JSON.')

  return parts.join('\n')
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

export async function planCardPromptsV2(
  analysis: VisionOutput,
  cardCount: number,
  providerDescription?: string,
  priceAz?: string,
  styleRefImages?: string[],
): Promise<PromptsOutput> {
  const config = TOVAR_AI_CONFIG
  const systemPrompt = buildSystemPrompt(cardCount)
  const userPrompt = buildUserPromptV2(analysis, cardCount, providerDescription, priceAz)

  console.log(`[Stage 2 V2] LLM-driven Creative Director — ${cardCount} cards`)
  console.log(`[Stage 2 V2] Product: ${analysis.product_type}, category: ${analysis.category}, premium: ${analysis.premium_level}`)
  if (styleRefImages?.length) {
    console.log(`[Stage 2 V2] Style references: ${styleRefImages.length} images`)
  }

  // User message: text + optional style reference images
  const userContent: Array<{ type: 'text'; text: string } | { type: 'image_url'; image_url: { url: string } }> = [
    { type: 'text', text: userPrompt },
  ]

  if (styleRefImages?.length) {
    userContent.push({
      type: 'text',
      text: `\n\n## STYLE REFERENCE EXAMPLES\nBelow are example marketplace infographic cards. Study their layout, typography, label styles, badge design, and commercial density. Use these as inspiration for the campaign you design — apply the SAME level of commercial richness, structured composition, and infographic polish. These are NOT your product — the product to advertise is described in PRODUCT ANALYSIS above.\n`,
    })
    for (const img of styleRefImages) {
      const url = img.startsWith('http') ? img : `data:image/png;base64,${img}`
      userContent.push({
        type: 'image_url',
        image_url: { url },
      })
    }
  }

  const body: Record<string, unknown> = {
    model: config.PLANNER_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent },
    ],
    temperature: 0.3,
    max_tokens: 8192,
  }
  // response_format only if model supports it
  body.response_format = { type: 'json_object' }

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
    throw new Error(`Stage 2 V2 API error ${response.status}: ${errText.slice(0, 500)}`)
  }

  const data = await response.json()
  const raw = data.choices?.[0]?.message?.content || ''
  const parsed = parseJSON<{
    campaign?: { visual_identity: string; card_structure: string }
    cards: Array<{
      index: number
      prompt_en: string
      text_overlay_az: string[]
      role_hint?: string
    }>
  }>(raw)

  if (!Array.isArray(parsed.cards) || parsed.cards.length < cardCount) {
    throw new Error(`Stage 2 V2: Expected ${cardCount} cards, got ${parsed.cards?.length || 0}`)
  }

  console.log(`[Stage 2 V2] Campaign: ${parsed.campaign?.card_structure || 'no description'}`)
  console.log(`[Stage 2 V2] Cards: ${parsed.cards.map(c => c.role_hint || `card${c.index}`).join(', ')}`)

  // Приводим к стандартному PromptsOutput (совместимость со Stage 3)
  const cards = parsed.cards.slice(0, cardCount).map(c => ({
    index: c.index,
    role: (c.role_hint || 'hero') as CardRole,
    prompt_en: c.prompt_en,
    text_overlay_az: c.text_overlay_az || [],
    needs_model: false,
    composition: 'llm-designed',
    reference_weight: 0.7,
    creative_style: 'v2',
    marketing_style: 'v2',
    visual_theme: {
      lighting: 'llm-designed',
      background_style: 'llm-designed',
      mood: 'llm-designed',
      materials: ['llm-designed'],
      spatial_depth: ['llm-designed'],
      motion: 'llm-designed',
    } as VisualTheme,
    color_palette: ['#llm-designed'],
  }))

  return {
    style_name: 'v2-llm-driven',
    roles: cards.map(c => c.role),
    marketing_styles: cards.map(() => 'v2'),
    visual_theme: cards[0].visual_theme,
    color_palette: ['#llm-designed'],
    cards,
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
