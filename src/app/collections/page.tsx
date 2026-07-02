import Link from 'next/link'
import type { Metadata } from 'next'
import { JsonLd } from '@/components/seo/JsonLd'
import { getBreadcrumbSchema } from '@/lib/seo/schemas/breadcrumb-schema'
import { supabaseAdmin } from '@/lib/supabase/admin'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Kolleksiyalar',
  description: 'Məhsul koleksiyalarımız — ən yaxşı seçimlər, xüsusi təkliflər və mövsümi endirimlər.',
  alternates: {
    canonical: 'https://shop.tapla.az/koleksiyalar',
  },
  openGraph: {
    title: 'Kolleksiyalar',
    description: 'Məhsul koleksiyalarımız — ən yaxşı seçimlər, xüsusi təkliflər və mövsümi endirimlər.',
    url: 'https://shop.tapla.az/koleksiyalar',
    siteName: 'TAPLA MARKETPLACE',
    locale: 'az_AZ',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kolleksiyalar',
    description: 'Məhsul koleksiyalarımız — ən yaxşı seçimlər, xüsusi təkliflər və mövsümi endirimlər.',
  },
}

export default async function CollectionsPage() {
  let collections: { slug: string; title: string; description: string | null; count: number }[] = []

  try {
    if (supabaseAdmin) {
      const { data } = await supabaseAdmin
        .from('collections')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (data) {
        const cols = data as Record<string, unknown>[]
        collections = await Promise.all(
          cols.map(async (col) => {
            const { count } = await supabaseAdmin
              .from('collection_products')
              .select('*', { count: 'exact', head: true })
              .eq('collection_id', col.id as string)
            return {
              slug: col.slug as string,
              title: col.title as string,
              description: col.description as string | null,
              count: count ?? 0,
            }
          })
        )
      }
    }
  } catch (err) {
    console.warn('Collections fetch failed:', err)
  }

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Ana Səhifə', url: 'https://shop.tapla.az' },
    { name: 'Kolleksiyalar', url: 'https://shop.tapla.az/koleksiyalar' },
  ])

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold mb-8">Kolleksiyalar</h1>
        {collections.length === 0 ? (
          <p className="text-neutral-400 text-sm">Hələ kolleksiya yoxdur.</p>
        ) : (
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
        )}
      </div>
    </div>
      </>
  )
}
