import type { Metadata } from 'next'
import { dbService } from '@/services/db'
import { ProductsClient } from './ProductsClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Məhsullar | TAPLA MARKETPLACE',
  description: 'Bütün kateqoriyalar üzrə məhsullarımızı kəşf edin.',
}

export default async function ProductsPage() {
  const products = await dbService.getProducts()

  return <ProductsClient products={products} />
}
