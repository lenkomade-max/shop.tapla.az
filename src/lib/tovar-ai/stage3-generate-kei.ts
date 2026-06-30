// ============================================================================
// Stage 3: Image Generation via Kei Proxy (n1leads.tapla.az)
// Nano Banana 2 через Kei Proxy. Promise.all для параллельной генерации.
// Асинхронный протокол: createTask → polling → download.
// ============================================================================

import { TOVAR_AI_CONFIG, type CardPrompt, type CardResult } from './types'
import { createSignedHeaders } from './proxy-security'

/**
 * Генерация одного изображения через Kei Proxy (Nano Banana 2).
 * Асинхронный протокол: createTask → polling → download image → base64.
 */
export async function generateSingleCard(
  card: CardPrompt,
  photoBase64: string,
  attempt: number = 1,
): Promise<CardResult> {
  const config = TOVAR_AI_CONFIG

  if (!config.PROXY_SECRET) {
    throw new Error('PROXY_SECRET is not set in .env.local')
  }

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

  // ─── 1. Создать задачу через Kei Proxy ──────────────────────────────────
  const createTaskBody = JSON.stringify({
    model: 'nano-banana-2',
    input: {
      prompt: `${hardRules}\n\n${card.prompt_en}`,
      aspect_ratio: config.ASPECT_RATIO,
      resolution: config.IMAGE_SIZE,
      output_format: 'png',
      image_input: [`data:image/jpeg;base64,${photoBase64}`],
    },
  })

  const createTaskPath = '/api/kei-ai/createTask'
  const headers = createSignedHeaders(createTaskPath, 'POST', createTaskBody)

  const createResponse = await fetch(`${config.KEI_PROXY_URL}${createTaskPath}`, {
    method: 'POST',
    headers,
    body: createTaskBody,
  })

  if (!createResponse.ok) {
    // 5xx — retryable
    if (createResponse.status >= 500 && attempt <= config.MAX_RETRIES) {
      console.warn(`[Stage 3 Kei] Server error ${createResponse.status}, retrying (${attempt}/${config.MAX_RETRIES})`)
      await sleep(1000 * attempt)
      return generateSingleCard(card, photoBase64, attempt + 1)
    }
    const errText = await createResponse.text()
    throw new Error(`Kei Proxy createTask error ${createResponse.status}: ${errText.slice(0, 500)}`)
  }

  const createData = await createResponse.json()

  if (createData.code !== 200 || !createData.data?.taskId) {
    // Retryable?
    if (attempt <= config.MAX_RETRIES) {
      console.warn(`[Stage 3 Kei] createTask failed (code=${createData.code}), retrying (${attempt}/${config.MAX_RETRIES})`)
      await sleep(2000 * attempt)
      return generateSingleCard(card, photoBase64, attempt + 1)
    }
    throw new Error(`Kei Proxy createTask failed: ${createData.msg || JSON.stringify(createData).slice(0, 300)}`)
  }

  const taskId: string = createData.data.taskId
  const pollingToken: string = createData._pollingToken || ''

  console.log(`[Stage 3 Kei] Card ${card.index} — taskId: ${taskId}`)

  // ─── 2. Polling статуса ─────────────────────────────────────────────────
  let resultUrls: string[]
  try {
    resultUrls = await pollTaskStatus(taskId, pollingToken)
  } catch (pollErr) {
    const msg = pollErr instanceof Error ? pollErr.message : String(pollErr)
    console.error(`[Stage 3 Kei] Card ${card.index} — polling failed: ${msg}`)

    // Retry если таймаут или сетевая ошибка
    if (attempt <= config.MAX_RETRIES) {
      console.warn(`[Stage 3 Kei] Retrying card ${card.index} (${attempt}/${config.MAX_RETRIES})`)
      await sleep(2000 * attempt)
      return generateSingleCard(card, photoBase64, attempt + 1)
    }
    throw pollErr
  }

  if (!resultUrls || resultUrls.length === 0) {
    if (attempt <= config.MAX_RETRIES) {
      console.warn(`[Stage 3 Kei] Card ${card.index} — empty resultUrls, retrying (${attempt}/${config.MAX_RETRIES})`)
      await sleep(2000 * attempt)
      return generateSingleCard(card, photoBase64, attempt + 1)
    }
    throw new Error(`Kei Proxy returned no images for card ${card.index}`)
  }

  // ─── 3. Скачать и конвертировать в base64 ───────────────────────────────
  try {
    const imageBase64 = await downloadImageAsBase64(resultUrls[0])

    return {
      index: card.index,
      role: card.role,
      promptUsed: card.prompt_en,
      imageBase64,
      attempt,
    }
  } catch (downloadErr) {
    const msg = downloadErr instanceof Error ? downloadErr.message : String(downloadErr)
    console.error(`[Stage 3 Kei] Card ${card.index} — download failed: ${msg}`)

    if (attempt <= config.MAX_RETRIES) {
      console.warn(`[Stage 3 Kei] Retrying card ${card.index} (${attempt}/${config.MAX_RETRIES})`)
      await sleep(1000 * attempt)
      return generateSingleCard(card, photoBase64, attempt + 1)
    }
    throw new Error(`Failed to download image for card ${card.index}: ${msg}`)
  }
}

/**
 * Параллельная генерация всех карточек через Kei Proxy.
 * Все запросы уходят ОДНОВРЕМЕННО через Promise.allSettled.
 * generateSingleCard САМ делает ретраи (MAX_RETRIES=2).
 * Здесь ретраев НЕТ — чтобы не было каскадных повторов.
 */
export async function generateAllCards(
  cards: CardPrompt[],
  photoBase64: string,
): Promise<CardResult[]> {
  console.log(`[Stage 3 Kei] Generating ${cards.length} cards in parallel via Kei Proxy...`)

  const results = await Promise.allSettled(
    cards.map(card => generateSingleCard(card, photoBase64)),
  )

  const finalResults: CardResult[] = []

  for (const [i, result] of results.entries()) {
    if (result.status === 'fulfilled') {
      finalResults.push(result.value)
      console.log(`[Stage 3 Kei] Card ${i + 1}/${cards.length} ✅ (attempt ${result.value.attempt})`)
    } else {
      console.error(`[Stage 3 Kei] Card ${i + 1}/${cards.length} ❌ ${String(result.reason).slice(0, 120)}`)
    }
  }

  finalResults.sort((a, b) => a.index - b.index)
  console.log(`[Stage 3 Kei] Done: ${finalResults.length}/${cards.length} cards`)
  return finalResults
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Polling статуса задачи с exponential backoff.
 * GET /api/public/status?taskId=<id>&token=<token>
 */
async function pollTaskStatus(
  taskId: string,
  token: string,
  maxWaitMs: number = 60000,
): Promise<string[]> {
  const config = TOVAR_AI_CONFIG
  const start = Date.now()
  let delay = 2000

  while (Date.now() - start < maxWaitMs) {
    const url = `${config.KEI_PROXY_URL}/api/public/status?taskId=${encodeURIComponent(taskId)}&token=${encodeURIComponent(token)}`
    const res = await fetch(url)

    if (!res.ok) {
      throw new Error(`Status polling HTTP ${res.status}`)
    }

    const data = await res.json()

    if (data.data?.state === 'success') {
      const resultJson = data.data.resultJson
      if (!resultJson) {
        throw new Error('Missing resultJson in success response')
      }
      const parsed = JSON.parse(resultJson)
      return parsed.resultUrls as string[]
    }

    if (data.data?.state === 'fail') {
      throw new Error(data.data.failMsg || 'Generation failed')
    }

    // waiting / processing — sleep and retry
    await sleep(delay)
    delay = Math.min(delay * 2, 10000) // exponential backoff, max 10s
  }

  throw new Error(`Polling timeout after ${maxWaitMs}ms for task ${taskId}`)
}

/**
 * Скачивает изображение по URL и возвращает как base64 строку (без data: префикса).
 */
async function downloadImageAsBase64(url: string): Promise<string> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Download failed: HTTP ${response.status}`)
  }
  const buffer = Buffer.from(await response.arrayBuffer())
  return buffer.toString('base64')
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
