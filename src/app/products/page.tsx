import type { Metadata } from 'next'
import { dbService } from '@/services/db'
import { ProductsClient } from './ProductsClient'

export const revalidate = 120

export const metadata: Metadata = {
  title: 'Məhsullar | TAPLA MARKETPLACE',
  description: 'Bütün kateqoriyalar üzrə məhsullarımızı kəşf edin.',
}

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    dbService.getProducts(),
    dbService.getCategories(),
  ])

  return <ProductsClient products={products} categories={categories} />
}
