import Link from 'next/link'
import type { Metadata } from 'next'
import { JsonLd } from '@/components/seo/JsonLd'
import { getBreadcrumbSchema } from '@/lib/seo/schemas/breadcrumb-schema'

export const metadata: Metadata = {
  title: 'Kolleksiyalar',
  description: 'Məhsul kolleksiyalarımız — ən yaxşı seçimlər, xüsusi təkliflər və mövsümi endirimlər.',
  alternates: {
    canonical: 'https://shop.tapla.az/kolleksiyalar',
  },
  openGraph: {
    title: 'Kolleksiyalar',
    description: 'Məhsul kolleksiyalarımız — ən yaxşı seçimlər, xüsusi təkliflər və mövsümi endirimlər.',
    url: 'https://shop.tapla.az/kolleksiyalar',
    siteName: 'TAPLA MARKETPLACE',
    locale: 'az_AZ',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kolleksiyalar',
    description: 'Məhsul kolleksiyalarımız — ən yaxşı seçimlər, xüsusi təkliflər və mövsümi endirimlər.',
  },
}

const placeholderCollections = [
  { slug: 'best-sellers', title: 'Best Sellers', description: 'Ən çox satılan məhsullar', count: 2 },
]

export default async function CollectionsPage() {
  // TODO: fetch from Supabase when connected
  const collections = placeholderCollections

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Ana Səhifə', url: 'https://shop.tapla.az' },
    { name: 'Kolleksiyalar', url: 'https://shop.tapla.az/kolleksiyalar' },
  ])

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold mb-8">Kolleksiyalar</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((col) => (
            <Link
              key={col.slug}
              href={`/collections/${col.slug}`}
              className="block p-8 rounded-xl border border-gray-200 hover:border-gray-400 transition-colors"
            >
              <h2 className="text-2xl font-semibold">{col.title}</h2>
              <p className="mt-2 opacity-60">{col.description}</p>
              <p className="mt-4 text-sm opacity-40">{col.count} məhsul</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
      </>
  )
}
