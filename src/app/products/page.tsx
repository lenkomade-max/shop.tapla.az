import type { Metadata } from 'next'
import { dbService } from '@/services/db'
import { ProductCard } from '@/components/cards/ProductCard'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Məhsullar',
  description: 'Bütün məhsullarımız',
}

export default async function ProductsPage() {
  const products = await dbService.getProducts()

  return (
    <div className="min-h-screen py-20 px-2 sm:px-3">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold mb-8 px-2">Məhsullar</h1>
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}
