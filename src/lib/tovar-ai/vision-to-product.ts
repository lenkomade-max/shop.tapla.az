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

  // Цена поставщика (для админки), цена продажи = 0 (админ ставит вручную)
  const supplier_price = parsePrice(priceAz) || undefined
  const price = 0

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

  const slug = seoSlug(analysis, providerDescription)

  return {
    name,
    slug,
    title,
    subtitle,
    description,
    category,
    price,
    supplier_price,
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

/**
 * SEO-оптимизированный slug для азербайджанского (и турецкого).
 *
 * Правила:
 * - Берём brand + product_type + 1 ключевую фичу (макс 4-5 слов)
 * - Ограничение ~60 символов
 * - Убираем стоп-слова (və, ilə, üçün, bu, bir, də, ki, ...)
 * - Транслитерируем специфичные символы для чистого URL
 */
function seoSlug(
  analysis: VisionOutput,
  providerDescription?: string,
): string {
  // Собираем ключевые слова: brand → product_type → 1-2 key features
  const keywords: string[] = []

  // 1. Бренд (если есть и не太长)
  if (analysis.brand && analysis.brand.length < 20) {
    keywords.push(analysis.brand)
  }

  // 2. Тип товара
  if (analysis.product_type) {
    keywords.push(analysis.product_type)
  }

  // 3. 1-2 ключевых фичи (короткие)
  const shortFeatures = analysis.key_selling_points
    .filter(f => f.length < 25)
    .slice(0, 2)
  keywords.push(...shortFeatures)

  // Если ничего не собрали — берём providerDescription или product_type
  let raw = keywords.length >= 2
    ? keywords.join(' ')
    : (providerDescription || analysis.product_type)

  // Ограничиваем до ~5 слов
  const words = raw.split(/\s+/).filter(w => w.length > 1)
  const limitedWords = words.slice(0, 5)
  raw = limitedWords.join(' ')

  // Чистим: az chars → ASCII, стоп-слова, спецсимволы
  return cleanSlug(raw)
}

/** Азербайджанские стоп-слова */
const AZ_STOP_WORDS = new Set([
  'və', 'ilə', 'üçün', 'bu', 'bir', 'də', 'ki', 'o', 'öz',
  'var', 'yox', 'amma', 'lakin', 'hər', 'hansı', 'necə', 'nə',
  'harada', 'niyə', 'kim', 'çox', 'az', 'daha', 'ən', 'artıq',
  'sonra', 'indi', 'belə', 'elə', 'ancaq', 'bütün', 'digər',
  'həm', 'həmçinin', 'hələ', 'heç', 'isə', 'görə', 'kimi',
  'qədər', 'haqqında', 'barədə', 'sizə', 'mənə', 'ona', 'bunu',
  'bilər', 'olsun', 'edir', 'olur', 'edən', 'olan', 'ilə',
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been',
  'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of',
  'with', 'from', 'by', 'as', 'it', 'its', 'no', 'not',
])

function cleanSlug(raw: string): string {
  // Транслитерация азербайджанских символов
  const transliterated = raw
    .toLowerCase()
    .trim()
    .replace(/ə/g, 'e')
    .replace(/ç/g, 'c')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ı/g, 'i')
    // Убираем всё кроме букв, цифр, пробелов, дефисов
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  // Убираем стоп-слова
  const words = transliterated.split(' ').filter(w => !AZ_STOP_WORDS.has(w))

  // Склеиваем дефисами, убираем дубли дефисов
  let slug = words.join('-').replace(/-+/g, '-').replace(/^-|-$/g, '')

  // Обрезаем до 60 символов, но не режем слово
  if (slug.length > 60) {
    slug = slug.slice(0, 60).replace(/-[^-]*$/, '')
  }

  // Fallback если всё отфильтровалось
  if (!slug || slug.length < 2) {
    slug = 'mehsul'
  }

  return slug
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

