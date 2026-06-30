import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { dbService } from '@/services/db'
import { ProductCard } from '@/components/cards/ProductCard'

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 120

export async function generateStaticParams() {
  const categories = await dbService.getCategories()
  return categories.filter(c => c.status === 'active' && c.slug).map(c => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await dbService.getCategoryBySlug(slug)
  if (!category) return { title: 'Kateqoriya | TAPLA MARKETPLACE' }

  return {
    title: `${category.title} — TAPLA MARKETPLACE`,
    description: category.description || `${category.title} kateqoriyasında bütün məhsullar`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const [category, allCategories] = await Promise.all([
    dbService.getCategoryBySlug(slug),
    dbService.getCategories(),
  ])

  if (!category) notFound()

  // Find parent for breadcrumbs
  const parentCategory = category.parentId
    ? allCategories.find(c => c.id === category.parentId)
    : null

  // Get products for this category (includes subcategories)
  const products = await dbService.getProductsByCategory(slug)

  // Get sibling categories (same parent) as related links
  const siblingCategories = allCategories.filter(
    c => c.parentId === category.parentId && c.slug !== slug
  )

  // Get subcategories if any
  const subcategories = category.children?.filter(c => c.status === 'active') || []

  return (
    <div className="min-h-screen">
      {/* Breadcrumbs */}
      <div className="border-b border-neutral-100 bg-white">
        <div className="container mx-auto max-w-6xl px-4 py-3">
          <div className="flex items-center text-xs text-neutral-400 gap-2">
            <Link href="/" className="hover:text-neutral-900 transition-colors">Ana Səhifə</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-neutral-900 transition-colors">Məhsullar</Link>
            {parentCategory && (
              <>
                <span>/</span>
                <Link
                  href={`/category/${parentCategory.slug}`}
                  className="hover:text-neutral-900 transition-colors"
                >
                  {parentCategory.title}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-neutral-900 font-medium">{category.title}</span>
          </div>
        </div>
      </div>

      {/* Category Header */}
      <div className="bg-white border-b border-neutral-100">
        <div className="container mx-auto max-w-6xl px-1 py-10 sm:py-14">
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 font-serif">
            {category.title}
          </h1>
          {category.description && (
            <p className="mt-3 text-sm text-neutral-500 max-w-2xl leading-relaxed">
              {category.description}
            </p>
          )}
          <p className="mt-2 text-xs text-neutral-400">
            {products.length} məhsul
          </p>
        </div>
      </div>

      {/* Subcategories grid */}
      {subcategories.length > 0 && (
        <div className="bg-neutral-50 border-b border-neutral-100">
          <div className="container mx-auto max-w-6xl px-4 py-8">
            <h2 className="text-xs tracking-widest font-semibold text-neutral-400 uppercase mb-4">
              Alt Kateqoriyalar
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {subcategories.map((sub) => (
                <Link
                  key={sub.slug}
                  href={`/category/${sub.slug}`}
                  className="group bg-white border border-neutral-200 hover:border-neutral-900 rounded-lg p-4 transition-all"
                >
                  <h3 className="text-sm font-semibold text-neutral-900 group-hover:underline">
                    {sub.title}
                  </h3>
                  {sub.description && (
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                      {sub.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div>
        <div className="container mx-auto max-w-6xl px-1 py-10">
          {products.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xs tracking-widest font-semibold text-neutral-400 uppercase">
                  Bütün Məhsullar
                </h2>
                <span className="text-xs text-neutral-400">{products.length} ədəd</span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-px">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-neutral-400 text-sm">
                Bu kateqoriyada hələ məhsul yoxdur.
              </p>
              <Link
                href="/products"
                className="inline-block mt-4 text-xs tracking-widest font-semibold uppercase underline underline-offset-4 hover:text-neutral-900 transition-colors"
              >
                Bütün məhsullara bax
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Sibling categories navigation */}
      {siblingCategories.length > 0 && (
        <div className="bg-neutral-50 border-t border-neutral-100">
          <div className="container mx-auto max-w-6xl px-4 py-8">
            <h2 className="text-xs tracking-widest font-semibold text-neutral-400 uppercase mb-4">
              Digər Kateqoriyalar
            </h2>
            <div className="flex flex-wrap gap-2">
              {siblingCategories.map((sib) => (
                <Link
                  key={sib.slug}
                  href={`/category/${sib.slug}`}
                  className="text-xs px-4 py-2 bg-white border border-neutral-200 rounded-full hover:border-neutral-900 transition-colors"
                >
                  {sib.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
