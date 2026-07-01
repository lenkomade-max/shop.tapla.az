import type { MetadataRoute } from 'next'

const SITE_URL = 'https://shop.tapla.az'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/profile/',
          '/checkout/',
          '/_next/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/profile/',
          '/checkout/',
        ],
      },
      {
        userAgent: 'GPTBot',
        allow: ['/', '/mehsullar', '/kateqoriya', '/haqqimizda'],
        disallow: ['/admin/', '/api/', '/auth/', '/profile/', '/checkout/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: ['/', '/mehsullar', '/kateqoriya', '/haqqimizda'],
        disallow: ['/admin/', '/api/', '/auth/', '/profile/', '/checkout/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: ['/', '/mehsullar'],
        disallow: ['/admin/', '/api/', '/auth/', '/profile/', '/checkout/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: ['/', '/mehsullar', '/kateqoriya', '/haqqimizda'],
        disallow: ['/admin/', '/api/', '/auth/', '/profile/', '/checkout/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
      },
      {
        userAgent: 'Bytespider',
        allow: '/',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
