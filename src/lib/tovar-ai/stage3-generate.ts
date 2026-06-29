// ============================================================================
// Stage 3: Image Generation
// Nano Banana 2 через OpenRouter. Promise.all для параллельной генерации.
// ============================================================================

import { TOVAR_AI_CONFIG, type CardPrompt, type CardResult } from './types'

/**
 * Генерация одного изображения через Nano Banana 2.
 */
export async function generateSingleCard(
  card: CardPrompt,
  photoBase64: string,
  attempt: number = 1,
): Promise<CardResult> {
  const config = TOVAR_AI_CONFIG

  // Жёсткие правила для Nano Banana — всегда в начале промпта
  const hardRules = `[HARD RULES - MUST FOLLOW]
- LANGUAGE: ALL visible text in Azerbaijani Latin ONLY. Never English, Russian, or Cyrillic.
- NO BUTTONS: Never render any CTA buttons ("SƏBƏTƏ AT", "İNDİ AL", etc.).
- NO LOGOS: Never render any marketplace logo or brand name.
- NO INVENTED DATA: Use ONLY data from the prompt below. Never invent prices, percentages, or specs.
- NO REFERENCE COPYING: Do NOT copy logos, brand names, watermarks, barcodes, or packaging text from the reference photo.
- SINGLE FRAME: One unified image per card — no split-screen, no collages.
- PRODUCT INTEGRITY: Never alter product shape, color, or proportions. The product must be recognisable from the reference photo.
- PRICE: Only if explicitly provided, always with "AZN".
- WARRANTY/DELIVERY: Only if explicitly mentioned. Never invent.`

  // Nano Banana 2 использует Gemini chat completions API
  // с image generation модальностью
  const body = {
    model: config.IMAGE_MODEL,
    messages: [
      {
        role: 'user' as const,
        content: [
          {
            type: 'text' as const,
            text: `${hardRules}\n\n${card.prompt_en}`,
          },
          {
            type: 'image_url' as const,
            image_url: {
              // Отправляем reference-фото для fidelity продукта
              url: `data:image/jpeg;base64,${photoBase64}`,
            },
          },
        ],
      },
    ],
    // Nano Banana 2 specific: указываем что хотим изображение
    modalities: ['image', 'text'],
    image_config: {
      aspect_ratio: config.ASPECT_RATIO,
      image_size: config.IMAGE_SIZE,
    },
    temperature: 0.7, // креативность для визуального разнообразия
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

  // Обработка rate limit
  if (response.status === 429) {
    const retryAfter = response.headers.get('retry-after')
    const waitMs = retryAfter
      ? Number(retryAfter) * 1000
      : Math.min(1000 * Math.pow(2, attempt), 16000) // exponential backoff: 2s, 4s, 8s, 16s
    console.warn(`[Stage 3] Rate limited, waiting ${waitMs}ms (attempt ${attempt})`)
    await sleep(waitMs)
    if (attempt <= config.MAX_RETRIES) {
      return generateSingleCard(card, photoBase64, attempt + 1)
    }
    throw new Error(`Stage 3: Rate limit exceeded after ${attempt} retries`)
  }

  if (!response.ok) {
    const errText = await response.text()
    // Если retryable ошибка (5xx)
    if (response.status >= 500 && attempt <= config.MAX_RETRIES) {
      console.warn(`[Stage 3] Server error ${response.status}, retrying (${attempt}/${config.MAX_RETRIES})`)
      await sleep(1000 * attempt)
      return generateSingleCard(card, photoBase64, attempt + 1)
    }
    throw new Error(
      `Stage 3 Image API error ${response.status}: ${errText.slice(0, 500)}`,
    )
  }

  const data = await response.json()

  const imageBase64 = extractImageBase64(data)

  if (!imageBase64) {
    // Проверяем — Google safety refusal или реальная ошибка
    const msgContent = (data as Record<string,unknown>).choices as Array<Record<string,unknown>> | undefined
    const text = msgContent?.[0]?.message as Record<string,unknown> | undefined
    const refusal = typeof text?.content === 'string' ? text.content : ''
    const isSafetyRefusal = refusal.includes("can't help with that") || refusal.includes('language model')

    if (isSafetyRefusal && attempt <= config.MAX_RETRIES) {
      // Safety filter сработал случайно — ретрай с задержкой
      const waitMs = 2000 + Math.random() * 3000
      console.warn(`[Stage 3] Card ${card.index} - safety filter (attempt ${attempt}/${config.MAX_RETRIES}), waiting ${(waitMs/1000).toFixed(1)}s...`)
      await sleep(waitMs)
      return generateSingleCard(card, photoBase64, attempt + 1)
    }

    console.error('[Stage 3] Model returned no image for card', card.index)
    console.error('[Stage 3] Response keys:', Object.keys(data as Record<string,unknown>))
    throw new Error(`Stage 3: No image in response for card ${card.index}`)
  }

  return {
    index: card.index,
    role: card.role,
    promptUsed: card.prompt_en,
    imageBase64,
    attempt,
  }
}

/**
 * Параллельная генерация всех карточек.
 * Все запросы уходят ОДНОВРЕМЕННО через Promise.allSettled.
 * generateSingleCard САМ делает ретраи (MAX_RETRIES=2).
 * Здесь ретраев НЕТ — чтобы не было каскадных повторов (15+ запросов).
 */
export async function generateAllCards(
  cards: CardPrompt[],
  photoBase64: string,
): Promise<CardResult[]> {
  console.log(`[Stage 3] Generating ${cards.length} cards in parallel...`)

  const results = await Promise.allSettled(
    cards.map(card => generateSingleCard(card, photoBase64)),
  )

  const finalResults: CardResult[] = []

  for (const [i, result] of results.entries()) {
    if (result.status === 'fulfilled') {
      finalResults.push(result.value)
      console.log(`[Stage 3] Card ${i + 1}/${cards.length} ✅ (attempt ${result.value.attempt})`)
    } else {
      console.error(`[Stage 3] Card ${i + 1}/${cards.length} ❌ ${String(result.reason).slice(0, 120)}`)
    }
  }

  finalResults.sort((a, b) => a.index - b.index)
  console.log(`[Stage 3] Done: ${finalResults.length}/${cards.length} cards`)
  return finalResults
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Извлекает base64 изображения из ответа OpenRouter.
 *
 * Формат Nano Banana 2 через OpenRouter:
 *   choices[0].message.images[] → image_url.url (data:image/png;base64,...)
 */
function extractImageBase64(data: unknown): string | null {
  const d = data as Record<string, unknown>
  const choices = d.choices as Array<Record<string, unknown>> | undefined
  const message = choices?.[0]?.message as Record<string, unknown> | undefined

  // Вариант 1: images[] внутри message (основной формат OpenRouter для NB2)
  const images = message?.images as Array<Record<string, unknown>> | undefined
  if (Array.isArray(images)) {
    for (const img of images) {
      const imageUrl = img.image_url as Record<string, string> | undefined
      if (imageUrl?.url?.startsWith('data:image')) {
        return imageUrl.url.replace(/^data:image\/\w+;base64,/, '')
      }
    }
  }

  // Вариант 2: content как массив частей (Gemini формат)
  const content = message?.content
  if (Array.isArray(content)) {
    for (const part of content as Array<Record<string, unknown>>) {
      const inlineData = part.inline_data as Record<string, string> | undefined
      if (inlineData?.data) return inlineData.data
      const imageUrl = part.image_url as Record<string, string> | undefined
      if (imageUrl?.url?.startsWith('data:image')) {
        return imageUrl.url.replace(/^data:image\/\w+;base64,/, '')
      }
    }
  }

  // Вариант 3: content строка с data: URI
  if (typeof content === 'string' && content.startsWith('data:image')) {
    return content.replace(/^data:image\/\w+;base64,/, '')
  }

  return null
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
