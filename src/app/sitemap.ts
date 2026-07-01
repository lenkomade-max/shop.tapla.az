import type { MetadataRoute } from 'next'
import { supabaseAdmin } from '@/lib/supabase/admin'

const SITE_URL = 'https://shop.tapla.az'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  // --- Static pages ---
  const staticPages: { url: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { url: SITE_URL, priority: 1.0, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/mehsullar`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/kolleksiyalar`, priority: 0.7, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/haqqimizda`, priority: 0.6, changeFrequency: 'monthly' },
    { url: `${SITE_URL}/qaytarma-siyaseti`, priority: 0.4, changeFrequency: 'yearly' },
    { url: `${SITE_URL}/satici-muqavilesi`, priority: 0.4, changeFrequency: 'yearly' },
    { url: `${SITE_URL}/mexfilik-siyaseti`, priority: 0.4, changeFrequency: 'yearly' },
    { url: `${SITE_URL}/istifade-sertleri`, priority: 0.4, changeFrequency: 'yearly' },
    { url: `${SITE_URL}/huquqi-melumat`, priority: 0.4, changeFrequency: 'yearly' },
  ]

  for (const page of staticPages) {
    entries.push({
      url: page.url,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })
  }

  // --- Products (priority 0.9) ---
  try {
    if (supabaseAdmin) {
      const { data: products } = await supabaseAdmin
        .from('products')
        .select('slug, updated_at, images')
        .eq('status', 'active')
        .limit(5000)

      if (products) {
        for (const p of products as Record<string, unknown>[]) {
          const slug = p.slug as string
          const updatedAt = p.updated_at ? new Date(p.updated_at as string) : new Date()
          const images = Array.isArray(p.images) ? (p.images as string[]) : []

          const entry: MetadataRoute.Sitemap[number] = {
            url: `${SITE_URL}/mehsullar/${slug}`,
            lastModified: updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.9,
          }

          // Add product images to sitemap
          if (images.length > 0) {
            ;(entry as Record<string, unknown>).images = images.slice(0, 5).map((img: string) => img)
          }

          entries.push(entry)
        }
      }
    }
  } catch (err) {
    console.warn('[sitemap] Products fetch failed:', err)
  }

  // --- Categories (priority 0.8) ---
  try {
    if (supabaseAdmin) {
      const { data: categories } = await supabaseAdmin
        .from('categories')
        .select('slug, updated_at')
        .eq('status', 'active')
        .limit(1000)

      if (categories) {
        for (const c of categories as Record<string, unknown>[]) {
          entries.push({
            url: `${SITE_URL}/kateqoriya/${c.slug}`,
            lastModified: c.updated_at ? new Date(c.updated_at as string) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
          })
        }
      }
    }
  } catch (err) {
    console.warn('[sitemap] Categories fetch failed:', err)
  }

  // --- Collections (priority 0.7) ---
  try {
    if (supabaseAdmin) {
      const { data: collections } = await supabaseAdmin
        .from('collections')
        .select('slug, updated_at')
        .eq('status', 'active')
        .limit(500)

      if (collections) {
        for (const col of collections as Record<string, unknown>[]) {
          entries.push({
            url: `${SITE_URL}/kolleksiyalar/${col.slug}`,
            lastModified: col.updated_at ? new Date(col.updated_at as string) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
          })
        }
      }
    }
  } catch (err) {
    console.warn('[sitemap] Collections fetch failed:', err)
  }

  return entries
}
