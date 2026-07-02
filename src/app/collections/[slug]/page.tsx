import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ProductCard } from '@/components/cards/ProductCard'
import { JsonLd } from '@/components/seo/JsonLd'
import { getBreadcrumbSchema } from '@/lib/seo/schemas/breadcrumb-schema'
import { getItemListSchema } from '@/lib/seo/schemas/itemlist-schema'
import { generateSEOMeta } from '@/lib/seo/meta-generator'

const SITE_URL = 'https://shop.tapla.az'

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 3600

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { getCollectionBySlug } = await import('@/lib/supabase/queries')
  const result = await getCollectionBySlug(slug)

  if (!result) return { title: 'Kolleksiya | TAPLA MARKETPLACE' }

  const rawCol = result.collection as unknown as Record<string, unknown>
  const title = rawCol.title as string
  const description = rawCol.description as string | null

  return generateSEOMeta({
    title,
    description: description || `${title} kolleksiyasında bütün məhsullar — ən sərfəli qiymətlər, sürətli çatdırılma.`,
    canonical: `${SITE_URL}/koleksiyalar/${slug}`,
    type: 'website',
  })
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params
  const { getCollectionBySlug } = await import('@/lib/supabase/queries')
  const result = await getCollectionBySlug(slug)

  if (!result) notFound()

  const { collection, products } = result
  const colTitle = (collection as unknown as Record<string, unknown>).title as string
  const colDescription = (collection as unknown as Record<string, unknown>).description as string | null | undefined

  // Map products (DB Product → app Product)
  const mappedProducts = (products as unknown as Record<string, unknown>[]).map((p) => ({
    id: p.id as string,
    slug: p.slug as string,
    name: (p.name as string) || (p.title as string) || '',
    subtitle: (p.subtitle as string) || '',
    description: (p.description as string) || '',
    price: Number(p.price) || 0,
    originalPrice: p.old_price != null ? Number(p.old_price) : undefined,
    rating: Number(p.rating) || 0,
    reviewsCount: Number(p.reviews_count) || 0,
    images: Array.isArray(p.images) ? p.images as string[] : [],
    category: (p.category as string) || '',
    categoryId: (p.category_id as string | null) || null,
    benefits: Array.isArray(p.benefits) ? p.benefits as string[] : [],
    howToUse: (p.how_to_use as string) || '',
    ingredients: p.ingredients as string | undefined,
    tags: Array.isArray(p.tags) ? p.tags as string[] : undefined,
    shades: Array.isArray(p.shades) ? p.shades as { name: string; colorHex: string; isHot?: boolean; label?: string }[] : undefined,
    isNew: Boolean(p.is_new) || undefined,
    tryOnEnabled: Boolean(p.try_on_enabled) || undefined,
    features: Array.isArray(p.features) ? p.features as string[] : undefined,
    idealFor: p.ideal_for as string | null ?? undefined,
    useCases: Array.isArray(p.use_cases) ? p.use_cases as string[] : undefined,
    careInstructions: p.care_instructions as string | null ?? undefined,
    compatibility: p.compatibility as string | null ?? undefined,
    faq: Array.isArray(p.faq) ? p.faq as { question: string; answer: string }[] : undefined,
    searchKeywords: Array.isArray(p.search_keywords) ? p.search_keywords as string[] : undefined,
  }))

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Ana Səhifə', url: SITE_URL },
    { name: 'Kolleksiyalar', url: `${SITE_URL}/koleksiyalar` },
    { name: colTitle, url: `${SITE_URL}/koleksiyalar/${slug}` },
  ])

  const itemListSchema = mappedProducts.length > 0
    ? getItemListSchema(
        mappedProducts.map(p => ({ name: p.name, slug: p.slug })),
        colTitle
      )
    : null

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={itemListSchema} />
      <div className="min-h-screen">
        {/* Breadcrumbs */}
        <div className="border-b border-neutral-100 bg-white">
          <div className="container mx-auto max-w-6xl px-4 py-3">
            <div className="flex items-center text-xs text-neutral-400 gap-2">
              <Link href="/" className="hover:text-neutral-900 transition-colors">Ana Səhifə</Link>
              <span>/</span>
              <Link href="/collections" className="hover:text-neutral-900 transition-colors">Kolleksiyalar</Link>
              <span>/</span>
              <span className="text-neutral-900 font-medium">{colTitle}</span>
            </div>
          </div>
        </div>

        {/* Collection Header */}
        <div className="bg-white border-b border-neutral-100">
          <div className="container mx-auto max-w-6xl px-1 py-10 sm:py-14">
            <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 font-serif">
              {colTitle}
            </h1>
            {colDescription && (
              <p className="mt-3 text-sm text-neutral-500 max-w-2xl leading-relaxed">
                {colDescription}
              </p>
            )}
            <p className="mt-2 text-xs text-neutral-400">
              {mappedProducts.length} məhsul
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div>
          <div className="container mx-auto max-w-6xl px-1 py-10">
            {mappedProducts.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xs tracking-widest font-semibold text-neutral-400 uppercase">
                    Bütün Məhsullar
                  </h2>
                  <span className="text-xs text-neutral-400">{mappedProducts.length} ədəd</span>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-px">
                  {mappedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-neutral-400 text-sm">
                  Bu kolleksiyada hələ məhsul yoxdur.
                </p>
                <Link
                  href="/collections"
                  className="inline-block mt-4 text-xs tracking-widest font-semibold uppercase underline underline-offset-4 hover:text-neutral-900 transition-colors"
                >
                  Bütün kolleksiyalara bax
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
