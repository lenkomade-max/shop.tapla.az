import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

const products: Record<string, { title: string; price: string; description: string }> = {
  'lash-serum': { title: 'Lash Serum', price: '29.90 ₼', description: 'Təbii kirpik uzadıcı serum' },
  'collagen-mask': { title: 'Collagen Mask', price: '35.90 ₼', description: 'Kollagen maska dəri bərpası üçün' },
}

export async function generateStaticParams() {
  return Object.keys(products).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = products[slug]
  if (!product) return {}
  return { title: product.title, description: product.description }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = products[slug]
  if (!product) notFound()

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <Link href="/products" className="text-sm opacity-60 hover:opacity-100 mb-8 inline-block">
          ← Bütün məhsullar
        </Link>
        <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
        <p className="text-xl mb-4">{product.description}</p>
        <p className="text-3xl font-bold">{product.price}</p>
        <Link
          href={`/landing/${slug}`}
          className="mt-8 inline-block px-8 py-4 rounded-xl text-white font-medium"
          style={{ backgroundColor: slug === 'lash-serum' ? '#db2777' : '#0891b2' }}
        >
          Səhifəyə keç
        </Link>
      </div>
    </div>
  )
}
