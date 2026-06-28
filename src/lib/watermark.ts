// ============================================================================
// Watermark — накладывает полупрозрачный логотип TAPLA в центр изображения
//
// ПОДХОД: пререндеренный PNG (public/images/wm-overlay.png)
//   → ресайз под размер фото → composite в центр
//
// Почему не SVG на лету? Vercel serverless НЕ ИМЕЕТ системных шрифтов.
// librsvg рендерит <text> пустым → watermark невидим.
// Пререндеренный PNG: только composite, без текстового рендера.
// ============================================================================

import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

// ─── Кеш оверлея (читаем с диска один раз) ─────────────────────────────────

let _overlayBuffer: Buffer | null = null

function loadOverlayBuffer(): Buffer {
  if (_overlayBuffer) return _overlayBuffer

  const candidates = [
    path.join(process.cwd(), 'public/images/wm-overlay.png'),
    path.join(process.cwd(), '.next/standalone/public/images/wm-overlay.png'),
  ]

  for (const p of candidates) {
    try {
      _overlayBuffer = fs.readFileSync(p)
      console.log('[Watermark] Loaded overlay:', p, `(${(_overlayBuffer.length / 1024).toFixed(1)} KB)`)
      return _overlayBuffer
    } catch { /* next */ }
  }

  throw new Error(`[Watermark] wm-overlay.png not found. Checked: ${candidates.join(', ')}`)
}

// ─── Основная функция ──────────────────────────────────────────────────────

export async function addWatermark(base64: string): Promise<string> {
  const inputBuffer = Buffer.from(base64, 'base64')
  const meta = await sharp(inputBuffer).metadata()
  const imgW = meta.width || 800
  const imgH = meta.height || 800
  const minDim = Math.min(imgW, imgH)

  // Загружаем пререндеренный оверлей
  const overlayRaw = loadOverlayBuffer()
  const overlayMeta = await sharp(overlayRaw).metadata()
  const ovW = overlayMeta.width || 2400
  const ovH = overlayMeta.height || 400

  // Ресайз оверлея: ширина = 85% от меньшей стороны фото
  const targetW = Math.round(minDim * 0.85)
  const targetH = Math.round(targetW * (ovH / ovW))

  const overlay = await sharp(overlayRaw)
    .resize(targetW, targetH)
    .png()
    .toBuffer()

  // Позиция: геометрический центр
  const left = Math.round((imgW - targetW) / 2)
  const top = Math.round((imgH - targetH) / 2)

  // Композит
  const result = await sharp(inputBuffer)
    .composite([{ input: overlay, top, left }])
    .png()
    .toBuffer()

  return result.toString('base64')
}
