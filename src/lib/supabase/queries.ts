import { supabase } from './client'
import type { Product, Media, Collection } from './types'

export interface LandingData {
  id: string
  slug: string
  title: string
  subtitle: string | null
  theme: string
  sections: unknown[]
  config: Record<string, unknown>
  product: Product | null
  images: Media[]
}

export async function getLandingBySlug(slug: string): Promise<LandingData | null> {
  const { data: landing } = await supabase
    .from('landings')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (!landing) return null

  const landingRow = landing as Record<string, unknown>

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', landingRow.product_id as string)
    .single()

  const { data: images } = await supabase
    .from('media')
    .select('*')
    .eq('product_id', landingRow.product_id as string)
    .eq('type', 'image')
    .order('sort_order')

  return {
    id: landingRow.id as string,
    slug: landingRow.slug as string,
    title: landingRow.title as string,
    subtitle: landingRow.subtitle as string | null,
    theme: landingRow.theme as string,
    sections: landingRow.sections as unknown[],
    config: landingRow.config as Record<string, unknown>,
    product: (product as Product) ?? null,
    images: (images as Media[]) ?? [],
  }
}

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Product[]
}

export async function getProductBySlug(slug: string) {
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (error || !product) return null

  const productRow = product as Record<string, unknown>

  const { data: images } = await supabase
    .from('media')
    .select('*')
    .eq('product_id', productRow.id as string)
    .eq('type', 'image')
    .order('sort_order')

  return { product: product as Product, images: (images as Media[]) ?? [] }
}

export async function getCollections() {
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Collection[]
}

export async function getCollectionBySlug(slug: string) {
  const { data: collection, error } = await supabase
    .from('collections')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (error || !collection) return null

  const collectionRow = collection as Record<string, unknown>

  const { data: products } = await supabase
    .from('collection_products')
    .select('product_id')
    .eq('collection_id', collectionRow.id as string)
    .order('sort_order')

  const productIds = ((products as Record<string, unknown>[]) ?? []).map((p) => p.product_id as string)

  const { data: items } = await supabase
    .from('products')
    .select('*')
    .in('id', productIds)
    .eq('status', 'active')

  return { collection: collection as Collection, products: (items as Product[]) ?? [] }
}

export async function createOrder(order: {
  product_id: string
  customer_name: string
  phone: string
  city?: string
  address?: string
  quantity?: number
  total: number
}) {
  const { data, error } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function createLead(lead: {
  landing_id?: string
  product_id?: string
  name?: string
  phone?: string
  source?: string
  campaign?: string
}) {
  const { data, error } = await supabase
    .from('leads')
    .insert(lead)
    .select()
    .single()

  if (error) throw error
  return data
}
