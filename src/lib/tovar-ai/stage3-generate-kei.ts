// ============================================================================
// Stage 3: Image Generation via Kei Proxy (n1leads.tapla.az)
// Nano Banana 2 через Kei Proxy. Promise.all для параллельной генерации.
// Асинхронный протокол: upload photo → createTask → polling → download.
//
// RETRY LOGIC (строгая — не жжём токены впустую):
//   Пересоздать задачу ТОЛЬКО если:
//     1. createTask: HTTP 5xx / 429
//     2. createTask: API code 500
//     3. Polling:  state === 'fail'
//   Всё остальное — сразу ошибка, без ретраев.
// ============================================================================

import { TOVAR_AI_CONFIG, type CardPrompt, type CardResult } from './types'
import { createSignedHeaders, createPollingToken } from './proxy-security'

/** Максимум попыток пересоздания задачи (только при явном fail) */
const MAX_RETRIES = 2

/**
 * Генерация одного изображения через Kei Proxy (Nano Banana 2).
 */
export async function generateSingleCard(
  card: CardPrompt,
  photoBase64: string,
  attempt: number = 1,
  referenceUrl?: string,
): Promise<CardResult> {
  const config = TOVAR_AI_CONFIG

  if (!config.PROXY_SECRET) {
    throw new Error('PROXY_SECRET is not set in .env.local')
  }

  // ─── 0. Upload reference photo если URL не передан ──────────────────────
  if (!referenceUrl) {
    referenceUrl = await uploadReferencePhoto(photoBase64)
  }

  const hardRules = `[HARD RULES - MUST FOLLOW]
- LANGUAGE: ALL visible text in Azerbaijani Latin ONLY. Never English, Russian, or Cyrillic.
- NO BUTTONS: Never render any CTA buttons ("SƏBƏTƏ AT", "İNDİ AL", etc.).
- NO MARKETPLACE LOGOS: Never render any marketplace logo, shop logo, or brand watermark (TAPLA, shop.tapla.az, etc.).
- KEEP PRODUCT LOGO: The product's own manufacturer logo (if physically on the product) MUST stay visible and accurate — it's part of the product identity.
- REMOVE OVERLAYS: Strip any text overlays, watermarks, or stickers that are NOT physically printed on the product itself.
- NO INVENTED DATA: Use ONLY data from the prompt below. Never invent prices, percentages, or specs.
- NO REFERENCE COPYING: Do NOT copy logos, brand names, watermarks, barcodes, or packaging text from the reference photo.
- SINGLE FRAME: One unified image per card — no split-screen, no collages.
- PRODUCT INTEGRITY: Never alter product shape, color, or proportions. The product must be recognisable from the reference photo.
- PRICE: Only if explicitly provided, always with "AZN".
- WARRANTY/DELIVERY: Only if explicitly mentioned. Never invent.`

  // ─── 1. Создать задачу ──────────────────────────────────────────────────
  const createTaskBody = JSON.stringify({
    model: 'nano-banana-2',
    input: {
      prompt: `${hardRules}\n\n${card.prompt_en}`,
      aspect_ratio: config.ASPECT_RATIO,
      resolution: config.IMAGE_SIZE,
      output_format: 'png',
      image_input: [referenceUrl],
    },
  })

  const createTaskPath = '/api/kei-ai/createTask'
  const headers = createSignedHeaders(createTaskPath, 'POST', createTaskBody)

  let createResponse: Response
  try {
    createResponse = await fetch(`${config.KEI_PROXY_URL}${createTaskPath}`, {
      method: 'POST',
      headers,
      body: createTaskBody,
    })
  } catch (fetchErr) {
    // Сетевая ошибка (DNS, connection refused, etc.)
    throw new Error(`Kei Proxy unreachable: ${fetchErr instanceof Error ? fetchErr.message : String(fetchErr)}`)
  }

  // ─── Обработка HTTP-статуса createTask ──────────────────────────────────
  if (!createResponse.ok) {
    const status = createResponse.status

    // 5xx — серверная ошибка Kei.ai, можно пересоздать
    if (status >= 500 && attempt < MAX_RETRIES) {
      console.warn(`[Stage 3 Kei] Card ${card.index} — HTTP ${status}, retry ${attempt}/${MAX_RETRIES}`)
      await sleep(2000 * attempt)
      return generateSingleCard(card, photoBase64, attempt + 1, referenceUrl)
    }

    // 429 — rate limit, можно пересоздать с задержкой
    if (status === 429 && attempt < MAX_RETRIES) {
      const retryAfter = createResponse.headers.get('retry-after')
      const waitMs = retryAfter ? Number(retryAfter) * 1000 : 5000 * attempt
      console.warn(`[Stage 3 Kei] Card ${card.index} — rate limited, wait ${waitMs}ms retry ${attempt}/${MAX_RETRIES}`)
      await sleep(waitMs)
      return generateSingleCard(card, photoBase64, attempt + 1, referenceUrl)
    }

    // 4xx (кроме 429) — ошибка запроса, НЕ ретраить
    const errText = await createResponse.text().catch(() => '')
    throw new Error(`Kei Proxy createTask HTTP ${status}: ${errText.slice(0, 300)}`)
  }

  const createData = await createResponse.json()

  // ─── Обработка API-кода createTask ──────────────────────────────────────
  if (createData.code !== 200 || !createData.data?.taskId) {
    const apiCode = createData.code

    // 500 от API — внутренняя ошибка, можно пересоздать
    if (apiCode === 500 && attempt < MAX_RETRIES) {
      console.warn(`[Stage 3 Kei] Card ${card.index} — API 500, retry ${attempt}/${MAX_RETRIES}`)
      await sleep(2000 * attempt)
      return generateSingleCard(card, photoBase64, attempt + 1, referenceUrl)
    }

    // 400, 401, 402, 404, 422 — ошибка запроса, НЕ ретраить
    throw new Error(`Kei Proxy createTask API error ${apiCode}: ${createData.msg || 'no message'}`)
  }

  const taskId: string = createData.data.taskId
  const pollingToken: string = createPollingToken(taskId)

  console.log(`[Stage 3 Kei] Card ${card.index} — taskId: ${taskId}`)

  // ─── 2. Polling ─────────────────────────────────────────────────────────
  const pollResult = await pollTaskStatus(taskId, pollingToken, card.index)

  // state = 'fail' → пересоздать задачу (единственный случай ретрая при polling)
  if (pollResult.state === 'fail') {
    if (attempt < MAX_RETRIES) {
      console.warn(`[Stage 3 Kei] Card ${card.index} — state=fail (${pollResult.failMsg || 'no msg'}), retry ${attempt}/${MAX_RETRIES}`)
      await sleep(3000 * attempt)
      return generateSingleCard(card, photoBase64, attempt + 1, referenceUrl)
    }
    throw new Error(`Kei.ai generation failed after ${MAX_RETRIES} attempts: ${pollResult.failMsg || 'unknown'}`)
  }

  // state = 'success' — качаем
  if (!pollResult.resultUrls || pollResult.resultUrls.length === 0) {
    throw new Error(`Kei Proxy returned no images for card ${card.index}`)
  }

  const imageBase64 = await downloadImageAsBase64(pollResult.resultUrls[0])

  return {
    index: card.index,
    role: card.role,
    promptUsed: card.prompt_en,
    imageBase64,
    attempt,
  }
}

/**
 * Параллельная генерация всех карточек через Kei Proxy.
 */
export async function generateAllCards(
  cards: CardPrompt[],
  photoBase64: string,
): Promise<CardResult[]> {
  console.log(`[Stage 3 Kei] Generating ${cards.length} cards in parallel via Kei Proxy...`)

  // ─── Upload reference photo ONCE ────────────────────────────────────────
  let referenceUrl: string
  try {
    referenceUrl = await uploadReferencePhoto(photoBase64)
    console.log(`[Stage 3 Kei] Reference photo uploaded: ${referenceUrl}`)
  } catch (uploadErr) {
    console.error(`[Stage 3 Kei] Upload failed:`, uploadErr instanceof Error ? uploadErr.message : String(uploadErr))
    return []
  }

  // ─── Parallel generation ────────────────────────────────────────────────
  const results = await Promise.allSettled(
    cards.map(card => generateSingleCard(card, photoBase64, 1, referenceUrl)),
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

async function uploadReferencePhoto(photoBase64: string): Promise<string> {
  const config = TOVAR_AI_CONFIG
  const mimeType = detectMimeType(photoBase64)
  const dataUrl = `data:${mimeType};base64,${photoBase64}`

  const body = JSON.stringify({ image: dataUrl })
  const path = '/api/upload'
  const headers = createSignedHeaders(path, 'POST', body)

  const response = await fetch(`${config.KEI_PROXY_URL}${path}`, {
    method: 'POST',
    headers,
    body,
  })

  if (!response.ok) {
    const errText = await response.text().catch(() => '')
    throw new Error(`Upload failed: HTTP ${response.status} — ${errText.slice(0, 300)}`)
  }

  const data = await response.json()

  if (!data.success || !data.url) {
    throw new Error(`Upload failed: ${data.error || 'no url returned'}`)
  }

  return data.url as string
}

function detectMimeType(base64: string): string {
  const head = Buffer.from(base64.slice(0, 16), 'base64')
  if (head[0] === 0xff && head[1] === 0xd8) return 'image/jpeg'
  if (head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e && head[3] === 0x47) return 'image/png'
  if (head[0] === 0x52 && head[1] === 0x49 && head[2] === 0x46 && head[3] === 0x46) return 'image/webp'
  if (head[0] === 0x47 && head[1] === 0x49 && head[2] === 0x46) return 'image/gif'
  return 'image/jpeg'
}

interface PollSuccess {
  state: 'success'
  resultUrls: string[]
}

interface PollFail {
  state: 'fail'
  failMsg?: string
}

type PollResult = PollSuccess | PollFail

/**
 * Polling статуса задачи с exponential backoff.
 * Поллит БЕЗ таймаута пока не придёт success или fail.
 * Сетевые ошибки и не-200 при polling — ждём и пробуем снова, задачу НЕ пересоздаём.
 */
async function pollTaskStatus(
  taskId: string,
  token: string,
  cardIndex: number,
): Promise<PollResult> {
  const config = TOVAR_AI_CONFIG
  let delay = 2000

  while (true) {
    const url = `${config.KEI_PROXY_URL}/api/public/status?taskId=${encodeURIComponent(taskId)}&token=${encodeURIComponent(token)}`

    let res: Response
    try {
      res = await fetch(url)
    } catch {
      // Сетевая ошибка — ждём и пробуем снова
      await sleep(delay)
      delay = Math.min(delay * 2, 10000)
      continue
    }

    if (!res.ok) {
      // Не-200 — ждём и пробуем снова
      await sleep(delay)
      delay = Math.min(delay * 2, 10000)
      continue
    }

    const data = await res.json()

    if (data.data?.state === 'success') {
      const resultJson = data.data.resultJson
      if (!resultJson) {
        throw new Error('Missing resultJson in success response')
      }
      const parsed = JSON.parse(resultJson)
      return {
        state: 'success',
        resultUrls: parsed.resultUrls as string[],
      }
    }

    if (data.data?.state === 'fail') {
      return {
        state: 'fail',
        failMsg: data.data.failMsg || undefined,
      }
    }

    // waiting / processing
    await sleep(delay)
    delay = Math.min(delay * 2, 10000)
  }
}

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
