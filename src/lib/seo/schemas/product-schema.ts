import type { Product } from '@/types'

const SITE_URL = 'https://shop.tapla.az'

export function getProductSchema(product: Product) {
  const offers = {
    '@type': 'Offer' as const,
    price: product.price.toString(),
    priceCurrency: 'AZN',
    availability: 'https://schema.org/InStock',
    url: `${SITE_URL}/mehsullar/${product.slug}`,
  }

  if (product.originalPrice && product.originalPrice > product.price) {
    ;(offers as Record<string, unknown>).priceValidUntil = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split('T')[0]
  }

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description?.substring(0, 500) || product.name,
    image: product.images?.slice(0, 10) || [],
    sku: product.slug,
    offers,
  }

  // Brand
  const brandMatch = product.name?.match(/^([A-Za-z0-9]+)/)
  if (brandMatch) {
    schema.brand = {
      '@type': 'Brand',
      name: brandMatch[1],
    }
  }

  // Rating
  if (product.rating && product.rating > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating.toString(),
      reviewCount: product.reviewsCount?.toString() || '0',
    }
  }

  return schema
}
