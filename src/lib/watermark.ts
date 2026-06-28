// ============================================================================
// Watermark — накладывает полупрозрачный логотип TAPLA в центр изображения
// Используется для защиты фото товаров от кражи.
// ============================================================================

import sharp from 'sharp'

const WATERMARK_OPACITY = 0.15 // 15% — видно, но не отвлекает

/**
 * Создаёт SVG-строку с водяным знаком TAPLA.
 * Автоматически масштабируется под размер изображения.
 */
function createWatermarkSvg(width: number, height: number): string {
  const cx = Math.round(width / 2)
  const minDim = Math.min(width, height)

  // Размеры шрифтов — процент от меньшей стороны
  const taplaSize = Math.round(minDim * 0.11)   // TAPLA — крупно
  const subSize = Math.round(minDim * 0.05)      // MARKETPLACE — поменьше
  const gap = Math.round(minDim * 0.02)           // отступ между строками

  // Высота блока из 2 строк: TAPLA + gap + MARKETPLACE
  const blockH = taplaSize + gap + subSize

  // Верх блока — чтобы блок был строго по центру
  const blockTop = Math.round((height - blockH) / 2)

  // Y-позиции центров текста
  const taplaY = blockTop + Math.round(taplaSize / 2)
  const subY = blockTop + taplaSize + gap + Math.round(subSize / 2)

  const O = WATERMARK_OPACITY

  const svg =
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">` +
    // TAPLA
    `<text x="${cx}" y="${taplaY}" text-anchor="middle" dominant-baseline="central"` +
    ` font-family="Georgia,'Times New Roman',serif" font-size="${taplaSize}" font-weight="bold"` +
    ` letter-spacing="${Math.round(taplaSize * 0.25)}"` +
    ` fill="white" fill-opacity="${O}"` +
    ` stroke="white" stroke-opacity="${O * 0.4}" stroke-width="1">TAPLA</text>` +
    // MARKETPLACE (одна строка)
    `<text x="${cx}" y="${subY}" text-anchor="middle" dominant-baseline="central"` +
    ` font-family="Georgia,'Times New Roman',serif" font-size="${subSize}"` +
    ` letter-spacing="${Math.round(subSize * 0.35)}"` +
    ` fill="white" fill-opacity="${O * 0.85}"` +
    ` stroke="white" stroke-opacity="${O * 0.25}" stroke-width="0.5">MARKETPLACE</text>` +
    `</svg>`

  return svg
}

/**
 * Накладывает водяной знак TAPLA на изображение.
 *
 * @param base64  — изображение в base64 (без data: префикса)
 * @param options — опции (пока только opacity)
 * @returns base64 изображения с водяным знаком (PNG)
 */
export async function addWatermark(
  base64: string,
  options?: { opacity?: number },
): Promise<string> {
  const opacity = options?.opacity ?? WATERMARK_OPACITY

  // Если opacity = 0 — пропускаем
  if (opacity <= 0) return base64

  const inputBuffer = Buffer.from(base64, 'base64')

  // Получаем размеры исходного изображения
  const metadata = await sharp(inputBuffer).metadata()
  const width = metadata.width || 800
  const height = metadata.height || 800

  // Создаём SVG с водяным знаком
  const svg = createWatermarkSvg(width, height)
  const svgBuffer = Buffer.from(svg)

  // Накладываем SVG поверх изображения
  const result = await sharp(inputBuffer)
    .composite([
      {
        input: svgBuffer,
        top: 0,
        left: 0,
      },
    ])
    .png()
    .toBuffer()

  return result.toString('base64')
}

/**
 * Быстрая проверка — является ли строка валидным base64 изображения.
 */
export function isValidImageBase64(base64: string): boolean {
  return base64.length > 100
}
