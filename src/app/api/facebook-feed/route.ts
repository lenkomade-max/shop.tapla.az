import { NextResponse } from 'next/server'
import { dbService } from '@/services/db'
import type { Category } from '@/types'

const BASE_URL = 'https://shop.tapla.az'

function normalize(s: string): string {
  return s.toLowerCase().replace(/ı/g, 'i').replace(/i̇/g, 'i').trim()
}

function googleCategory(leafName: string, tags?: string[]): string {
  const cat = normalize(leafName)

  // Try tags as fallback for better granularity
  const tryTags = (arr: string[]): string | null => {
    for (const t of arr) {
      const n = normalize(t)
      const r = matchGoogleCategory(n)
      if (r) return r
    }
    return null
  }

  const r = matchGoogleCategory(cat)
  if (r) return r
  if (tags && tags.length > 0) {
    const fromTags = tryTags(tags)
    if (fromTags) return fromTags
  }
  return 'Electronics'
}

function matchGoogleCategory(cat: string): string | null {
  if (cat.includes('notebook') || cat.includes('ultrabook') || cat.includes('noutbuk')) return 'Electronics > Computers > Notebooks'
  if (cat.includes('smartfon') || cat.includes('telefon') || cat.includes('phone')) return 'Electronics > Communications > Smartphones'
  if (cat.includes('planset') || cat.includes('tablet') || cat.includes('ipad')) return 'Electronics > Computers > Tablet Computers'
  if (cat.includes('qulaqliq') || cat.includes('audio') || cat.includes('qulaqüstü')) return 'Electronics > Audio > Headphones'
  if (cat.includes('saat') || cat.includes('watch') || cat.includes('gadget') || cat.includes('aqilli')) return 'Electronics > Wearables'
  if (cat.includes('powerbank') || cat.includes('enerji') || cat.includes('batareya')) return 'Electronics > Computers > Computer Accessories'
  if (cat.includes('aksesuar') || cat.includes('accessory') || cat.includes('kabel') || cat.includes('qoruyucu')) return 'Electronics > Accessories'
  if (cat.includes('fen') || cat.includes('serinkes') || cat.includes('saç') || cat.includes('düzəldən')) return 'Home & Garden > Household Appliances > Hair Care Appliances'
  if (cat.includes('temizlik') || cat.includes('tozsoran') || cat.includes('vacuum') || cat.includes('robot')) return 'Home & Garden > Household Appliances > Vacuums'
  if (cat.includes('metbex') || cat.includes('mətbəx') || cat.includes('kitchen') || cat.includes('məişət')) return 'Home & Garden > Household Appliances > Kitchen Appliances'
  if (cat.includes('kamera') || cat.includes('dji') || cat.includes('drone')) return 'Electronics > Camera & Optics'
  if (cat.includes('idman') || cat.includes('saglamliq') || cat.includes('masaj') || cat.includes('fitness') || cat.includes('sağlamlıq')) return 'Health & Beauty > Exercise & Fitness'
  if (cat.includes('utü') || cat.includes('ütü') || cat.includes('buxar')) return 'Home & Garden > Household Appliances > Kitchen Appliances'
  if (cat.includes('oyun') || cat.includes('game') || cat.includes('gaming')) return 'Electronics > Video Game Consoles & Accessories'
  if (cat.includes('musiqi') || cat.includes('kolonka') || cat.includes('speaker')) return 'Electronics > Audio > Speakers'
  if (cat.includes('monitor') || cat.includes('ekran')) return 'Electronics > Computers > Monitors'
  if (cat.includes('printer') || cat.includes('mfp')) return 'Electronics > Computers > Printers & Scanners'
  if (cat.includes('elektronika')) return 'Electronics'
  return null
}

// Builds full path from leaf category up to root, e.g. "Elektronika > Qulaqlıq > Simsiz Qulaqlıq"
function buildCategoryPath(catId: string | null | undefined, catMap: Map<string, Category>): string[] {
  const parts: string[] = []
  let current = catId
  while (current && catMap.has(current)) {
    const cat = catMap.get(current)!
    parts.unshift(cat.title)
    current = cat.parentId || null
  }
  return parts
}

export async function GET() {
  let categories: Category[] = []
  try {
    categories = await dbService.getCategories()
  } catch { /* ignore — fallback to empty */ }

  const catMap = new Map<string, Category>()
  for (const c of categories) {
    catMap.set(c.id, c)
  }

  const products = await dbService.getProducts()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || BASE_URL

  const items = products.map((p) => {
    const imageUrl = p.images[0] || ''

    const additionalImages = p.images
      .slice(1)
      .filter(Boolean)
      .map((img) => escapeXml(img))

    const hasDiscount = p.originalPrice != null && Math.abs(p.originalPrice - p.price) > 0.01
    const regularPrice = hasDiscount ? `      <g:price>${p.originalPrice!.toFixed(2)} AZN</g:price>` : `      <g:price>${p.price.toFixed(2)} AZN</g:price>`
    const salePrice = hasDiscount ? `      <g:sale_price>${p.price.toFixed(2)} AZN</g:sale_price>` : ''

    const color = p.shades && p.shades.length > 0
      ? `      <g:color>${escapeXml(p.shades[0].name)}</g:color>`
      : ''

    const itemGroupId = p.shades && p.shades.length > 0
      ? `      <g:item_group_id>${escapeXml(p.id)}</g:item_group_id>`
      : ''

    const tags = p.tags && p.tags.length > 0
      ? p.tags.map((tag) => `      <g:custom_label_0>${escapeXml(tag)}</g:custom_label_0>`).join('\n')
      : ''

    // Resolve full category path from category_id
    const catPath = buildCategoryPath(p.categoryId, catMap)
    const fullPath = catPath.length > 0 ? catPath.join(' > ') : p.category || ''
    // Use the leaf (deepest subcategory) for Google Shopping category matching
    const leafCategory = catPath.length > 0 ? catPath[catPath.length - 1] : p.category || ''

    return `
    <item>
      <g:id>${escapeXml(p.id)}</g:id>
      <title>${escapeXml(p.name || '')}</title>
      <description>${escapeXml(p.description || '')}</description>
      <link>${siteUrl}/products/${escapeXml(p.slug)}</link>
      <image_link>${escapeXml(imageUrl)}</image_link>
      ${additionalImages.length > 0 ? `<additional_image_link>${additionalImages.join(', ')}</additional_image_link>` : ''}
      ${regularPrice}
      ${salePrice}
      <g:availability>in_stock</g:availability>
      <g:brand>TAPLA MARKETPLACE</g:brand>
      <g:condition>new</g:condition>
      <g:google_product_category>${escapeXml(googleCategory(leafCategory, p.tags || []))}</g:google_product_category>
      <g:product_type>${escapeXml(fullPath || p.category || '')}</g:product_type>
      ${tags}
      ${color}
      ${itemGroupId}
    </item>`
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>TAPLA MARKETPLACE — Facebook Feed</title>
    <link>${siteUrl}</link>
    <description>Product feed for Meta Dynamic Ads</description>
    ${items.join('\n')}
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
