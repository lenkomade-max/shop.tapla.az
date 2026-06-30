// ============================================================================
// Stage 3: Image Generation via Kei Proxy (n1leads.tapla.az)
// Nano Banana 2 через Kei Proxy. Promise.all для параллельной генерации.
// Асинхронный протокол: upload photo → createTask → polling → download.
// ============================================================================

import { TOVAR_AI_CONFIG, type CardPrompt, type CardResult } from './types'
import { createSignedHeaders, createPollingToken } from './proxy-security'

/**
 * Генерация одного изображения через Kei Proxy (Nano Banana 2).
 * Асинхронный протокол: createTask → polling → download image → base64.
 *
 * @param referenceUrl — URL уже загруженного reference фото (если есть).
 *   Если не передан — фото НЕ будет загружено; предполагается что вызыватель
 *   предварительно загрузил фото через uploadReferencePhoto().
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

  // Жёсткие правила для Nano Banana — всегда в начале промпта
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

  // ─── 1. Создать задачу через Kei Proxy ──────────────────────────────────
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

  const createResponse = await fetch(`${config.KEI_PROXY_URL}${createTaskPath}`, {
    method: 'POST',
    headers,
    body: createTaskBody,
  })

  if (!createResponse.ok) {
    if (createResponse.status >= 500 && attempt <= config.MAX_RETRIES) {
      console.warn(`[Stage 3 Kei] Server error ${createResponse.status}, retrying (${attempt}/${config.MAX_RETRIES})`)
      await sleep(1000 * attempt)
      return generateSingleCard(card, photoBase64, attempt + 1, referenceUrl)
    }
    const errText = await createResponse.text()
    throw new Error(`Kei Proxy createTask error ${createResponse.status}: ${errText.slice(0, 500)}`)
  }

  const createData = await createResponse.json()

  if (createData.code !== 200 || !createData.data?.taskId) {
    if (attempt <= config.MAX_RETRIES) {
      console.warn(`[Stage 3 Kei] createTask failed (code=${createData.code}), retrying (${attempt}/${config.MAX_RETRIES})`)
      await sleep(2000 * attempt)
      return generateSingleCard(card, photoBase64, attempt + 1, referenceUrl)
    }
    throw new Error(`Kei Proxy createTask failed: ${createData.msg || JSON.stringify(createData).slice(0, 300)}`)
  }

  const taskId: string = createData.data.taskId
  const pollingToken: string = createPollingToken(taskId)

  console.log(`[Stage 3 Kei] Card ${card.index} — taskId: ${taskId}`)

  // ─── 2. Polling статуса ─────────────────────────────────────────────────
  let resultUrls: string[]
  try {
    resultUrls = await pollTaskStatus(taskId, pollingToken)
  } catch (pollErr) {
    const msg = pollErr instanceof Error ? pollErr.message : String(pollErr)
    console.error(`[Stage 3 Kei] Card ${card.index} — polling failed: ${msg}`)

    if (attempt <= config.MAX_RETRIES) {
      console.warn(`[Stage 3 Kei] Retrying card ${card.index} (${attempt}/${config.MAX_RETRIES})`)
      await sleep(2000 * attempt)
      return generateSingleCard(card, photoBase64, attempt + 1, referenceUrl)
    }
    throw pollErr
  }

  if (!resultUrls || resultUrls.length === 0) {
    if (attempt <= config.MAX_RETRIES) {
      console.warn(`[Stage 3 Kei] Card ${card.index} — empty resultUrls, retrying (${attempt}/${config.MAX_RETRIES})`)
      await sleep(2000 * attempt)
      return generateSingleCard(card, photoBase64, attempt + 1, referenceUrl)
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
      return generateSingleCard(card, photoBase64, attempt + 1, referenceUrl)
    }
    throw new Error(`Failed to download image for card ${card.index}: ${msg}`)
  }
}

/**
 * Параллельная генерация всех карточек через Kei Proxy.
 * Reference фото загружается ОДИН раз, затем все карточки используют тот же URL.
 * generateSingleCard САМ делает ретраи (MAX_RETRIES=2).
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

/**
 * Загружает reference фото в kei-proxy и возвращает публичный URL.
 * POST /api/upload  { image: "data:image/...;base64,..." }
 */
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
    const errText = await response.text()
    throw new Error(`Upload failed: HTTP ${response.status} — ${errText.slice(0, 300)}`)
  }

  const data = await response.json()

  if (!data.success || !data.url) {
    throw new Error(`Upload failed: ${data.error || 'no url returned'}`)
  }

  return data.url as string
}

/**
 * Определяет MIME-тип изображения по первым байтам base64-строки.
 */
function detectMimeType(base64: string): string {
  const head = Buffer.from(base64.slice(0, 16), 'base64')
  // JPEG: FF D8 FF
  if (head[0] === 0xff && head[1] === 0xd8) return 'image/jpeg'
  // PNG: 89 50 4E 47
  if (head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e && head[3] === 0x47) return 'image/png'
  // WebP: 52 49 46 46 ... 57 45 42 50
  if (head[0] === 0x52 && head[1] === 0x49 && head[2] === 0x46 && head[3] === 0x46) return 'image/webp'
  // GIF: 47 49 46 38
  if (head[0] === 0x47 && head[1] === 0x49 && head[2] === 0x46) return 'image/gif'
  // fallback
  return 'image/jpeg'
}

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
