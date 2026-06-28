// ============================================================================
// Vision → Product Data — конвертация VisionOutput в поля товара
// ============================================================================

import type { VisionOutput, ProductDraftData } from './types'

// Re-export for convenience
export type { ProductDraftData } from './types'

/**
 * Конвертирует VisionOutput в ProductDraftData для предзаполнения формы товара.
 */
export function visionToProductData(
  analysis: VisionOutput,
  providerDescription?: string,
  priceAz?: string,
  supplierUrl?: string,
): ProductDraftData {
  // Название: из описания поставщика или тип товара
  const name = providerDescription || capitalizeFirst(analysis.product_type)

  // Title: тип товара + бренд если есть
  const title = analysis.brand
    ? `${analysis.brand} ${capitalizeFirst(analysis.product_type)}`
    : capitalizeFirst(analysis.product_type)

  // Подзаголовок: ключевое УТП
  const subtitle = analysis.key_selling_points.slice(0, 1).join(', ') || ''

  // Описание: собираем из intended_use + key_selling_points + характеристик
  const description = buildDescription(analysis)

  // Категория — как есть из Vision
  const category = analysis.category

  // Цена: из поля цены или оценка по premium_level
  const price = parsePrice(priceAz) || estimatePrice(analysis.premium_level)

  // Преимущества = key_selling_points
  const benefits = analysis.key_selling_points.slice(0, 6)

  // Как использовать = intended_use
  const how_to_use = analysis.intended_use

  // Ингредиенты — для косметики (если применимо)
  const ingredients = category === 'Kosmetika'
    ? analysis.package_contents.join(', ') || null
    : null

  // Теги: тип, категория, материал, функции
  const tags = [
    analysis.product_type,
    analysis.material,
    ...analysis.possible_functions.slice(0, 4),
  ].filter((v): v is string => !!v && v.length > 0)

  const slug = slugify(name)

  return {
    name,
    slug,
    title,
    subtitle,
    description,
    category,
    price,
    benefits,
    how_to_use,
    ingredients,
    tags,
    images: [],
    supplier_url: supplierUrl,
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function capitalizeFirst(s: string): string {
  if (!s) return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function buildDescription(analysis: VisionOutput): string {
  const parts: string[] = []

  if (analysis.intended_use) {
    parts.push(analysis.intended_use + '.')
  }
  if (analysis.key_selling_points.length > 0) {
    parts.push(
      'Əsas üstünlüklər: ' + analysis.key_selling_points.join(', ') + '.',
    )
  }
  if (analysis.material) {
    parts.push(`Material: ${analysis.material}.`)
  }
  if (analysis.package_contents.length > 0) {
    parts.push(
      'Dəstə daxildir: ' + analysis.package_contents.join(', ') + '.',
    )
  }
  if (analysis.possible_functions.length > 0) {
    parts.push(
      'Funksiyalar: ' + analysis.possible_functions.join(', ') + '.',
    )
  }

  return parts.join('\n\n') || `${analysis.product_type} — TAPLA Marketplace`
}

function parsePrice(priceStr?: string): number | null {
  if (!priceStr) return null
  // "29 AZN", "29₼", "29", "29.99"
  const match = priceStr.match(/(\d+(?:[.,]\d+)?)/)
  if (!match) return null
  return parseFloat(match[1].replace(',', '.'))
}

/**
 * Оценка цены на основе уровня премиальности.
 * Возвращает примерную цену в AZN (для справки админа).
 */
function estimatePrice(premiumLevel: VisionOutput['premium_level']): number {
  switch (premiumLevel) {
    case 'luxury':   return 199
    case 'premium':  return 79
    case 'mid':      return 29
    case 'budget':   return 9
    default:         return 0
  }
}
