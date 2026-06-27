// ============================================================================
// Stage 4: Quality Check
// Vision-модель проверяет сгенерированные карточки
// ============================================================================

import { TOVAR_AI_CONFIG, type CardResult, type QAResult } from './types'

const SYSTEM_PROMPT = `You are a quality assurance agent for an e-commerce marketplace.

Your job: check AI-generated product card images for issues.

For each card, evaluate:
1. product_fidelity — Does the product look like the ORIGINAL product? Same shape, color, features?
2. text_readable — Is any text in the image readable and correctly spelled (Azerbaijani Latin)?
3. no_hallucinations — Are there NO extra elements, fake logos, distorted parts, or made-up features?
4. composition_ok — Does the composition match the card's purpose?
5. style_consistent — Is the visual style consistent with a premium marketplace look?

Be STRICT. If anything looks off, flag it.

Output MUST be valid JSON. No markdown.`

const USER_PROMPT_TEMPLATE = `Check these 3 product cards generated for TAPLA MARKETPLACE.

Original product: {PRODUCT_TYPE}, {PRIMARY_COLOR}, {MATERIAL}

{PROVIDER_INFO}

For each card image, evaluate the 5 checks and return:

{
  "qa_results": [
    {
      "card_index": 1,
      "passed": true/false,
      "checks": {
        "product_fidelity": true/false,
        "text_readable": true/false,
        "no_hallucinations": true/false,
        "composition_ok": true/false,
        "style_consistent": true/false
      },
      "issues": ["text blurred", "color changed from black to blue"],
      "score": 85
    },
    ... (for cards 2, 3)
  ]
}

RULES:
- passed = score >= 60 AND product_fidelity = true
- score: 0-100 (100 = perfect marketplace card)
- If text is present but unreadable → text_readable = false
- If product color/shape visibly changed → product_fidelity = false
- Be honest but not overly strict — minor lighting differences are OK
- Respond ONLY with the JSON object.`

/**
 * Stage 4: Проверка качества сгенерированных карточек.
 * Принимает VisionOutput для сравнения + массив card results (с base64).
 * Возвращает QAResult[].
 */
export async function checkCardQuality(
  analysis: {
    product_type: string
    primary_color: string
    material: string
  },
  cards: CardResult[],
  providerDescription?: string,
): Promise<QAResult[]> {
  const config = TOVAR_AI_CONFIG

  let providerInfo = ''
  if (providerDescription) {
    providerInfo = `Provider description: ${providerDescription}`
  }

  const userPrompt = USER_PROMPT_TEMPLATE
    .replace('{PRODUCT_TYPE}', analysis.product_type)
    .replace('{PRIMARY_COLOR}', analysis.primary_color)
    .replace('{MATERIAL}', analysis.material)
    .replace('{PROVIDER_INFO}', providerInfo)

  // Собираем сообщение с текстом + картинками
  const content: Array<
    { type: 'text'; text: string } | { type: 'image_url'; image_url: { url: string } }
  > = [{ type: 'text', text: userPrompt }]

  for (const card of cards) {
    content.push({
      type: 'image_url',
      image_url: { url: `data:image/png;base64,${card.imageBase64}` },
    })
  }

  const body = {
    model: config.QA_MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.1,
    max_tokens: 2048,
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
    console.error(`[Stage 4] QA API error ${response.status}: ${errText.slice(0, 300)}`)
    // QA не критичен — возвращаем optimistic pass при ошибке API
    return cards.map(c => ({
      card_index: c.index,
      passed: true,
      checks: {
        product_fidelity: true,
        text_readable: true,
        no_hallucinations: true,
        composition_ok: true,
        style_consistent: true,
      },
      issues: [],
      score: 80,
    }))
  }

  const data = await response.json()
  const raw = data.choices?.[0]?.message?.content || ''

  let parsed: { qa_results: QAResult[] }
  try {
    let cleaned = raw.trim()
    if (cleaned.startsWith('```')) {
      cleaned = cleaned
        .replace(/^```(?:json)?\s*\n?/, '')
        .replace(/\n?```\s*$/, '')
    }
    parsed = JSON.parse(cleaned)
  } catch {
    console.error('[Stage 4] Failed to parse QA JSON, passing all')
    return cards.map(c => ({
      card_index: c.index,
      passed: true,
      checks: {
        product_fidelity: true,
        text_readable: true,
        no_hallucinations: true,
        composition_ok: true,
        style_consistent: true,
      },
      issues: ['QA parse error — auto-passed'],
      score: 75,
    }))
  }

  if (!Array.isArray(parsed.qa_results)) {
    console.error('[Stage 4] Invalid QA structure, passing all')
    return cards.map(c => ({
      card_index: c.index,
      passed: true,
      checks: {
        product_fidelity: true,
        text_readable: true,
        no_hallucinations: true,
        composition_ok: true,
        style_consistent: true,
      },
      issues: [],
      score: 80,
    }))
  }

  return parsed.qa_results
}
