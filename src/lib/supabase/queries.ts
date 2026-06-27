import { supabaseAdmin } from './admin'
import type { Product, Media, Collection, Profile } from './types'
import type { CartItem } from '@/store/CartContext'

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
  const { data: landing } = await supabaseAdmin
    .from('landings')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (!landing) return null

  const landingRow = landing as Record<string, unknown>

  const { data: product } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('id', landingRow.product_id as string)
    .single()

  const { data: images } = await supabaseAdmin
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
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Product[]
}

export async function getProductBySlug(slug: string) {
  const { data: product, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (error || !product) return null

  const productRow = product as Record<string, unknown>

  const { data: images } = await supabaseAdmin
    .from('media')
    .select('*')
    .eq('product_id', productRow.id as string)
    .eq('type', 'image')
    .order('sort_order')

  return { product: product as Product, images: (images as Media[]) ?? [] }
}

export async function getCollections() {
  const { data, error } = await supabaseAdmin
    .from('collections')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Collection[]
}

export async function getCollectionBySlug(slug: string) {
  const { data: collection, error } = await supabaseAdmin
    .from('collections')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (error || !collection) return null

  const collectionRow = collection as Record<string, unknown>

  const { data: products } = await supabaseAdmin
    .from('collection_products')
    .select('product_id')
    .eq('collection_id', collectionRow.id as string)
    .order('sort_order')

  const productIds = ((products as Record<string, unknown>[]) ?? []).map((p) => p.product_id as string)

  const { data: items } = await supabaseAdmin
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
  const { data, error } = await supabaseAdmin
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
  const { data, error } = await supabaseAdmin
    .from('leads')
    .insert(lead)
    .select()
    .single()

  if (error) throw error
  return data
}

// --- Profile queries ---

export async function getProfileByPhone(phone: string): Promise<Profile | null> {
  const { data } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('phone', phone)
    .maybeSingle()
  return data as Profile | null
}

export async function createGuestProfile(data: {
  phone: string
  email?: string
  first_name?: string
  last_name?: string
}): Promise<Profile> {
  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .insert({ ...data, is_guest: true })
    .select()
    .single()
  if (error) throw error
  return profile as Profile
}

export async function getProfileByAuthUserId(authUserId: string): Promise<Profile | null> {
  const { data } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('auth_user_id', authUserId)
    .maybeSingle()
  return data as Profile | null
}

// --- Cart sync queries ---

export async function syncCartFromLocal(userId: string, items: CartItem[]) {
  let synced = 0
  for (const item of items) {
    const { error } = await supabaseAdmin
      .from('user_cart')
      .upsert({
        auth_user_id: userId,
        product_id: item.product.id,
        shade_name: item.selectedShade?.name || '',
        quantity: item.quantity,
      }, { onConflict: 'user_cart_auth_user_id_product_id_shade_name_key', ignoreDuplicates: false })
    if (!error) synced++
  }
  return { synced }
}

export async function getUserCart(userId: string): Promise<CartItem[] | null> {
  const { data } = await supabaseAdmin
    .from('user_cart')
    .select('*')
    .eq('auth_user_id', userId)
  return data as unknown as CartItem[] | null
}
