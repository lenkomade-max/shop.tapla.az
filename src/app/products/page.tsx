import Link from 'next/link'
import type { Metadata } from 'next'
import { dbService } from '@/services/db'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Məhsullar',
  description: 'Bütün məhsullarımız',
}

export default async function ProductsPage() {
  const products = await dbService.getProducts()

  const debug = await dbService.debugProducts()

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold mb-8">Məhsullar</h1>
        {debug && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 whitespace-pre-wrap font-mono">
            {debug}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product.slug || product.id}
              href={`/products/${product.slug || product.id}`}
              className="group p-6 rounded-xl border border-gray-200 hover:border-gray-400 transition-colors"
            >
              <span className="text-xs uppercase tracking-widest text-gray-500">{product.category}</span>
              <h2 className="text-xl font-semibold mt-2 group-hover:underline">{product.name}</h2>
              <p className="text-lg font-bold mt-2">{product.price} ₼</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
