// ============================================================================
// Stage 5: Kie.ai Image-to-Image — чистое фото товара
// grok-imagine/image-to-image через Kei Proxy (n1leads.tapla.az).
// Тот же протокол что Stage 3: upload → createTask → polling → download.
//
// ВСЕГДА 1 фото, не зависит от cardCount из UI (cardCount только для Stage 3).
//
// Назначение:
//   Убрать сторонние наложения (tap.az, TAPLA, водяные знаки, стикеры, ценники).
//   Сгенерировать чистое профессиональное фото товара:
//   - белый фон (#FFFFFF), изолированный продукт
//   - без текста, без ценников, без QR-кодов
//   - проф. предметная съёмка (e-commerce product photography)
//   - НЕ тривиальная сетка-коллаж — sophisticated multi-angle presentation
//     (если есть важные детали с разных сторон — показать через плавные переходы,
//     глубину, тени, а не тупо 2-3 квадратика в ряд)
//   - БРЕНД и ЛОГОТИП ПРОИЗВОДИТЕЛЯ (NARS, Dyson, Apple, и т.д.)
//     если физически на товаре — СОХРАНЯЕТСЯ. Это часть identity продукта.
//     Пример: NARS на упаковке/флаконе — оставить. tap.az стикер — убрать.
// ============================================================================

import { TOVAR_AI_CONFIG, type VisionOutput, type KieImageToImageResult } from './types'
import { createSignedHeaders, createPollingToken } from './proxy-security'

/**
 * Build Image-to-Image prompt: clean marketplace product photo.
 * English prompt — model works best with English.
 */
function buildCleanPhotoPrompt(analysis: VisionOutput): string {
  const brandLine = analysis.brand
    ? `Brand: ${analysis.brand}. The manufacturer logo/branding physically on the product MUST be preserved — it is part of the product identity.`
    : 'No visible brand. Do not add any logos or brand names.'

  return [
    // ── Product identity ──
    `Product type: ${analysis.product_type}`,
    `Category: ${analysis.category}`,
    `Primary color: ${analysis.primary_color}`,
    `Material: ${analysis.material}`,
    `Shape: ${analysis.shape}`,
    `Finish: ${analysis.finish}`,
    analysis.texture ? `Texture: ${analysis.texture}` : '',
    brandLine,
    '',
    // ── What to generate ──
    'Generate a professional e-commerce product photo for a premium marketplace listing.',
    '',
    // ── Background & lighting ──
    'BACKGROUND: Pure white (#FFFFFF). No gradients, no shadows on the background. The product is fully isolated.',
    'LIGHTING: Soft, even studio lighting from multiple angles. No harsh shadows on the product itself — use diffused light to reveal surface details and texture.',
    '',
    // ── Composition ──
    'COMPOSITION: Product centered, occupying 80-90% of the frame. Shot from the most recognizable and flattering angle that shows the product\'s key features.',
    'If the product has important details on multiple sides (front label, side texture, back panel), create a sophisticated multi-angle presentation. NOT a basic grid of separate boxes — use depth of field, smooth shadow transitions between views, floating arrangement with visual flow. Think high-end cosmetic ad layout, not security camera grid.',
    '',
    // ── What to KEEP ──
    'PRESERVE (do NOT remove):',
    '- Manufacturer brand name and logo physically printed, engraved, or embossed on the product itself',
    '- Product shape, color, proportions — exact match to reference photo',
    '- Surface texture, finish, material appearance',
    '- Any physical controls, buttons, ports, displays that are part of the product',
    '',
    // ── What to REMOVE ──
    'REMOVE (must strip completely):',
    '- All text overlays, labels, stickers, promotional badges added on top of the product',
    '- Watermarks and marketplace logos: tap.az, TAPLA, tapla.az, magazam az, shop.az, or any e-commerce platform branding',
    '- Price tags, barcodes, QR codes, discount stickers',
    '- Any packaging elements that are not the product itself (boxes, wraps, plastic trays)',
    '- Background elements from the original photo — replace entire background with pure white',
    '- Any text that is NOT physically part of the manufactured product',
    '',
    // ── Quality ──
    'QUALITY: High resolution, sharp focus, accurate colors matching the reference photo. Clean, crisp, commercial-grade product photography suitable for a premium marketplace main image.',
  ].filter(Boolean).join('\n')
}

/**
 * Stage 5: Генерация чистого фото товара через Kie.ai Image-to-Image.
 *
 * Использует тот же Kei Proxy (n1leads.tapla.az) что и Stage 3.
 * Протокол: upload reference photo → createTask → polling → download.
 */
export async function generateCleanProductPhoto(
  photoBase64: string,
  analysis: VisionOutput,
): Promise<KieImageToImageResult> {
  const config = TOVAR_AI_CONFIG

  if (!config.PROXY_SECRET) {
    return {
      success: false,
      taskId: '',
      error: 'PROXY_SECRET is not set in .env.local',
    }
  }

  try {
    // ─── 1. Upload reference photo ──────────────────────────────────────
    const referenceUrl = await uploadReferencePhoto(photoBase64)
    console.log(`[Stage 5 Kie] Reference photo uploaded: ${referenceUrl}`)

    // ─── 2. Build prompt ─────────────────────────────────────────────────
    const prompt = buildCleanPhotoPrompt(analysis)
    console.log(`[Stage 5 Kie] Prompt built for: ${analysis.product_type} (${analysis.primary_color} ${analysis.material})`)

    // ─── 3. Create task ──────────────────────────────────────────────────
    const createTaskBody = JSON.stringify({
      model: config.KIE_AI_MODEL,
      input: {
        prompt,
        image_urls: [referenceUrl],
        nsfw_checker: true,
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
      const errText = await createResponse.text().catch(() => '')
      throw new Error(`Kei Proxy createTask HTTP ${createResponse.status}: ${errText.slice(0, 300)}`)
    }

    const createData = await createResponse.json()

    if (createData.code !== 200 || !createData.data?.taskId) {
      throw new Error(`Kei Proxy createTask API error ${createData.code}: ${createData.msg || 'no message'}`)
    }

    const taskId: string = createData.data.taskId
    const pollingToken: string = createPollingToken(taskId)
    console.log(`[Stage 5 Kie] Task created: ${taskId}`)

    // ─── 4. Polling ─────────────────────────────────────────────────────
    const pollResult = await pollKieTask(taskId, pollingToken)

    if (pollResult.state === 'fail') {
      throw new Error(`Kie.ai generation failed: ${pollResult.failMsg || 'unknown'}`)
    }

    if (!pollResult.resultUrls || pollResult.resultUrls.length === 0) {
      throw new Error('Kie.ai returned no images')
    }

    const imageUrl = pollResult.resultUrls[0]
    console.log(`[Stage 5 Kie] Image generated: ${imageUrl}`)

    // ─── 5. Download as base64 ───────────────────────────────────────────
    const imageBase64 = await downloadImageAsBase64(imageUrl)

    return {
      success: true,
      imageUrl,
      imageBase64,
      taskId,
      costTime: pollResult.costTime,
    }
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err)
    console.error(`[Stage 5 Kie] ❌ ${error}`)
    return {
      success: false,
      taskId: '',
      error,
    }
  }
}

// ─── Helpers (тот же протокол что Stage 3) ──────────────────────────────────

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
  costTime?: number
}

interface PollFail {
  state: 'fail'
  failMsg?: string
}

type PollResult = PollSuccess | PollFail

async function pollKieTask(
  taskId: string,
  token: string,
): Promise<PollResult> {
  const config = TOVAR_AI_CONFIG
  let delay = 2000

  while (true) {
    const url = `${config.KEI_PROXY_URL}/api/public/status?taskId=${encodeURIComponent(taskId)}&token=${encodeURIComponent(token)}`

    let res: Response
    try {
      res = await fetch(url)
    } catch {
      await sleep(delay)
      delay = Math.min(delay * 2, 10000)
      continue
    }

    if (!res.ok) {
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
        costTime: data.data.costTime,
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
