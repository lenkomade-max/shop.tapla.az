// ============================================================================
// Watermark — накладывает полупрозрачный логотип TAPLA в центр изображения
// Используется для защиты фото товаров от кражи.
//
// Подход: рендерим SVG-текст на прозрачный холст, затем композитим на фото.
// Два шага надёжнее чем одношаговый composite(SVG) — не все версии librsvg
// корректно обрабатывают SVG при прямом composite.
// ============================================================================

import sharp from 'sharp'

const WATERMARK_OPACITY = 0.15 // 15%

/**
 * Создаёт SVG-строку с водяным знаком TAPLA.
 */
function buildSvg(width: number, height: number): string {
  const cx = Math.round(width / 2)
  const minDim = Math.min(width, height)

  const taplaSize = Math.round(minDim * 0.11)
  const subSize = Math.round(minDim * 0.05)
  const gap = Math.round(minDim * 0.02)

  const blockH = taplaSize + gap + subSize
  const blockTop = Math.round((height - blockH) / 2)
  const taplaY = blockTop + Math.round(taplaSize / 2)
  const subY = blockTop + taplaSize + gap + Math.round(subSize / 2)

  const O = WATERMARK_OPACITY

  // Два слоя текста: тёмный (тень) + белый (основной)
  // Это даёт контраст на ЛЮБОМ фоне (светлом и тёмном)
  const shadowOffset = Math.max(2, Math.round(minDim * 0.003))

  return [
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`,
    // ── Тень (чёрная, размытая) ──
    `<filter id="shadow"><feDropShadow dx="${shadowOffset}" dy="${shadowOffset}" stdDeviation="${shadowOffset}" flood-color="black" flood-opacity="0.5"/></filter>`,
    `<g filter="url(#shadow)">`,
    // TAPLA — тень
    `<text x="${cx}" y="${taplaY}" text-anchor="middle" dominant-baseline="central"`,
    ` font-family="Georgia,'Times New Roman',serif" font-size="${taplaSize}" font-weight="bold"`,
    ` letter-spacing="${Math.round(taplaSize * 0.25)}" fill="white" fill-opacity="${O}">TAPLA</text>`,
    // MARKETPLACE — тень
    `<text x="${cx}" y="${subY}" text-anchor="middle" dominant-baseline="central"`,
    ` font-family="Georgia,'Times New Roman',serif" font-size="${subSize}"`,
    ` letter-spacing="${Math.round(subSize * 0.35)}" fill="white" fill-opacity="${O * 0.85}">MARKETPLACE</text>`,
    `</g>`,
    // ── Основной текст (белый, без тени, чуть ярче) ──
    `<text x="${cx}" y="${taplaY}" text-anchor="middle" dominant-baseline="central"`,
    ` font-family="Georgia,'Times New Roman',serif" font-size="${taplaSize}" font-weight="bold"`,
    ` letter-spacing="${Math.round(taplaSize * 0.25)}" fill="white" fill-opacity="${O}">TAPLA</text>`,
    `<text x="${cx}" y="${subY}" text-anchor="middle" dominant-baseline="central"`,
    ` font-family="Georgia,'Times New Roman',serif" font-size="${subSize}"`,
    ` letter-spacing="${Math.round(subSize * 0.35)}" fill="white" fill-opacity="${O * 0.85}">MARKETPLACE</text>`,
    `</svg>`,
  ].join('')
}

/**
 * Накладывает водяной знак TAPLA на изображение.
 * Двухшаговый метод: SVG → прозрачный PNG → composite на фото.
 */
export async function addWatermark(
  base64: string,
  options?: { opacity?: number },
): Promise<string> {
  const inputBuffer = Buffer.from(base64, 'base64')

  const metadata = await sharp(inputBuffer).metadata()
  const width = metadata.width || 800
  const height = metadata.height || 800

  const svg = buildSvg(width, height)

  // Шаг 1: рендерим SVG на прозрачный холст того же размера
  const overlay = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .png()
    .toBuffer()

  // Шаг 2: композитим полученный оверлей на исходное изображение
  const result = await sharp(inputBuffer)
    .composite([{ input: overlay, top: 0, left: 0 }])
    .png()
    .toBuffer()

  return result.toString('base64')
}
