import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Məhsullar',
  description: 'Bütün məhsullarımız',
}

const placeholderProducts = [
  { slug: 'lash-serum', title: 'Lash Serum', price: '29.90 ₼', category: 'Kirpik baxımı' },
  { slug: 'collagen-mask', title: 'Collagen Mask', price: '35.90 ₼', category: 'Dəri baxımı' },
]

export default async function ProductsPage() {
  // TODO: fetch from Supabase when connected
  const products = placeholderProducts

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold mb-8">Məhsullar</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group p-6 rounded-xl border border-gray-200 hover:border-gray-400 transition-colors"
            >
              <span className="text-xs uppercase tracking-widest text-gray-500">{product.category}</span>
              <h2 className="text-xl font-semibold mt-2 group-hover:underline">{product.title}</h2>
              <p className="text-lg font-bold mt-2">{product.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
