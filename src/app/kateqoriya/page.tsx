import Link from 'next/link'
import type { Metadata } from 'next'
import { dbService } from '@/services/db'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { JsonLd } from '@/components/seo/JsonLd'
import { getBreadcrumbSchema } from '@/lib/seo/schemas/breadcrumb-schema'
import { generateSEOMeta } from '@/lib/seo/meta-generator'

const SITE_URL = 'https://shop.tapla.az'

export const revalidate = 3600

export const metadata: Metadata = generateSEOMeta({
  title: 'Kateqoriyalar',
  description: 'Bütün məhsul kateqoriyalarımız — elektronika, telefon, notebook, aksesuar, kosmetika və daha çoxu. Ehtiyacınıza uyğun kateqoriyanı seçin.',
  canonical: `${SITE_URL}/kateqoriya`,
  type: 'website',
})

export default async function KateqoriyaPage() {
  const tree = await dbService.getCategoryTree()
  const allCategories = await dbService.getCategories()

  // Build root categories with product counts
  const rootsWithMeta = await Promise.all(
    tree.map(async (root) => {
      // Collect all descendant category IDs
      const descendantIds = new Set<string>([root.id])
      const collect = (cat: typeof root) => {
        for (const child of cat.children || []) {
          descendantIds.add(child.id)
          collect(child)
        }
      }
      collect(root)

      // Count products in this category + subcategories
      let productCount = 0
      try {
        if (supabaseAdmin && descendantIds.size > 0) {
          const { count } = await supabaseAdmin
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'active')
            .in('category_id', [...descendantIds])
          productCount = count ?? 0
        }
      } catch { /* ignore */ }

      const childrenCount = (root.children || []).length

      return { root, productCount, childrenCount }
    })
  )

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Ana Səhifə', url: SITE_URL },
    { name: 'Kateqoriyalar', url: `${SITE_URL}/kateqoriya` },
  ])

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <div className="min-h-screen">
        {/* Breadcrumbs */}
        <div className="border-b border-neutral-100 bg-white">
          <div className="container mx-auto max-w-6xl px-4 py-3">
            <div className="flex items-center text-xs text-neutral-400 gap-2">
              <Link href="/" className="hover:text-neutral-900 transition-colors">Ana Səhifə</Link>
              <span>/</span>
              <span className="text-neutral-900 font-medium">Kateqoriyalar</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white border-b border-neutral-100">
          <div className="container mx-auto max-w-6xl px-1 py-10 sm:py-14">
            <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 font-serif">
              Kateqoriyalar
            </h1>
            <p className="mt-3 text-sm text-neutral-500 max-w-2xl leading-relaxed">
              Bütün məhsul kateqoriyalarımız — ehtiyacınıza uyğun olanı seçin.
            </p>
            <p className="mt-2 text-xs text-neutral-400">
              {rootsWithMeta.length} əsas kateqoriya, {allCategories.length} cəmi
            </p>
          </div>
        </div>

        {/* Category Grid */}
        <div className="container mx-auto max-w-6xl px-1 py-10">
          {rootsWithMeta.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-neutral-400 text-sm">Hələ kateqoriya yoxdur.</p>
              <Link
                href="/mehsullar"
                className="inline-block mt-4 text-xs tracking-widest font-semibold uppercase underline underline-offset-4 hover:text-neutral-900 transition-colors"
              >
                Bütün məhsullara bax
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rootsWithMeta.map(({ root, productCount, childrenCount }) => (
                <Link
                  key={root.slug}
                  href={`/kateqoriya/${root.slug}`}
                  className="group block p-6 rounded-xl border border-neutral-200 hover:border-neutral-900 bg-white transition-all"
                >
                  <h2 className="text-lg font-semibold text-neutral-900 group-hover:underline">
                    {root.title}
                  </h2>
                  {root.description && (
                    <p className="mt-2 text-sm text-neutral-500 line-clamp-2">
                      {root.description}
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-4 text-xs text-neutral-400">
                    {childrenCount > 0 && (
                      <span>{childrenCount} alt kateqoriya</span>
                    )}
                    <span>{productCount} məhsul</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
