import type { Metadata } from 'next'

const SITE_URL = 'https://shop.tapla.az'
const SITE_NAME = 'TAPLA MARKETPLACE'
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`

export interface SEOMetaParams {
  title: string
  description: string
  canonical: string
  ogImage?: string
  keywords?: string[]
  type?: 'website' | 'product' | 'article'
  noIndex?: boolean
  ogTitle?: string
  ogDescription?: string
}

export function generateSEOMeta(params: SEOMetaParams): Metadata {
  const {
    title,
    description,
    canonical,
    ogImage,
    keywords,
    type = 'website',
    noIndex = false,
    ogTitle,
    ogDescription,
  } = params

  if (!canonical.startsWith('https://')) {
    console.warn(`[SEO] canonical должен начинаться с https://, получено: ${canonical}`)
  }

  const ogImageUrl = ogImage || DEFAULT_OG_IMAGE
  const resolvedOgTitle = ogTitle || title
  const resolvedOgDescription = ogDescription || description

  const meta: Metadata = {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: resolvedOgTitle,
      description: resolvedOgDescription,
      url: canonical,
      siteName: SITE_NAME,
      locale: 'az_AZ',
      type: (type === 'product' ? 'website' : type) as 'website' | 'article',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: resolvedOgTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedOgTitle,
      description: resolvedOgDescription,
      images: [ogImageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  }

  if (keywords && keywords.length > 0) {
    meta.keywords = keywords.slice(0, 20).join(', ')
  }

  return meta
}
