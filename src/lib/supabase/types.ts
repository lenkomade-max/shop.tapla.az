export interface Product {
  id: string
  slug: string
  title: string
  description: string | null
  price: number
  old_price: number | null
  status: 'active' | 'draft' | 'archived'
  category: string | null
  created_at: string
  updated_at: string
}

export interface Landing {
  id: string
  product_id: string
  slug: string
  title: string
  subtitle: string | null
  theme: string
  sections: unknown[]
  config: Record<string, unknown>
  status: 'active' | 'draft'
  created_at: string
  updated_at: string
}

export interface Media {
  id: string
  product_id: string
  type: 'image' | 'video'
  url: string
  alt: string | null
  sort_order: number
  created_at: string
}

export interface Order {
  id: string
  product_id: string
  customer_name: string
  phone: string
  city: string | null
  address: string | null
  quantity: number
  total: number
  status: 'new' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Lead {
  id: string
  landing_id: string | null
  product_id: string | null
  name: string | null
  phone: string | null
  source: string | null
  campaign: string | null
  pixel_data: Record<string, unknown>
  created_at: string
}

export interface Collection {
  id: string
  slug: string
  title: string
  description: string | null
  image: string | null
  status: 'active' | 'draft'
  created_at: string
}

export interface CollectionProduct {
  collection_id: string
  product_id: string
  sort_order: number
}

export interface Profile {
  id: string
  auth_user_id: string | null
  phone: string
  email: string | null
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  role: 'customer' | 'admin'
  is_guest: boolean
  created_at: string
  updated_at: string
}
