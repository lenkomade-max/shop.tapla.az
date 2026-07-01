import type { Metadata } from 'next'
import { dbService } from '@/services/db'
import { ProductsClient } from './ProductsClient'
import { generateSEOMeta } from '@/lib/seo/meta-generator'

export const revalidate = 3600

export const metadata: Metadata = generateSEOMeta({
  title: 'Məhsullar',
  description: 'Bütün kateqoriyalar üzrə məhsullarımızı kəşf edin — elektronika, telefon, notebook, aksesuar və daha çoxu. Sərfəli qiymətlər, sürətli çatdırılma.',
  canonical: 'https://shop.tapla.az/mehsullar',
})

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    dbService.getProducts(),
    dbService.getCategories(),
  ])

  return <ProductsClient products={products} categories={categories} />
}
