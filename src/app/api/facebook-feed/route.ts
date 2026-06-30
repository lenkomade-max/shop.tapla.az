import { NextResponse } from 'next/server'
import { dbService } from '@/services/db'

const BASE_URL = 'https://shop.tapla.az'

function googleCategory(category: string): string {
  const cat = (category || '').toLowerCase().replace(/ı/g, 'i').replace(/i̇/g, 'i')
  if (cat.includes('notebook') || cat.includes('ultrabook') || cat.includes('noutbuk')) return 'Electronics > Computers > Notebooks'
  if (cat.includes('smartfon') || cat.includes('telefon') || cat.includes('phone')) return 'Electronics > Communications > Smartphones'
  if (cat.includes('planset') || cat.includes('tablet') || cat.includes('ipad')) return 'Electronics > Computers > Tablet Computers'
  if (cat.includes('qulaqliq') || cat.includes('audio') || cat.includes('qulaqüstü')) return 'Electronics > Audio > Headphones'
  if (cat.includes('saat') || cat.includes('watch') || cat.includes('gadget')) return 'Electronics > Wearables'
  if (cat.includes('powerbank') || cat.includes('enerji')) return 'Electronics > Computers > Computer Accessories'
  if (cat.includes('aksesuar') || cat.includes('accessory') || cat.includes('kabel')) return 'Electronics > Accessories'
  if (cat.includes('fen') || cat.includes('serinkes') || cat.includes('saç')) return 'Home & Garden > Household Appliances > Hair Care Appliances'
  if (cat.includes('temizlik') || cat.includes('tozsoran') || cat.includes('vacuum')) return 'Home & Garden > Household Appliances > Vacuums'
  if (cat.includes('metbex') || cat.includes('mətbəx') || cat.includes('kitchen')) return 'Home & Garden > Household Appliances > Kitchen Appliances'
  if (cat.includes('kamera') || cat.includes('dji') || cat.includes('drone')) return 'Electronics > Camera & Optics'
  if (cat.includes('idman') || cat.includes('saglamliq') || cat.includes('masaj') || cat.includes('fitness')) return 'Health & Beauty > Exercise & Fitness'
  return 'Electronics'
}

export async function GET() {
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
      <g:google_product_category>${escapeXml(googleCategory(p.category))}</g:google_product_category>
      <g:product_type>${escapeXml(p.category || '')}</g:product_type>
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
