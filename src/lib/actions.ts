'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from './supabase/admin';
import { login as authLogin, logout as authLogout, checkAuth } from './auth';
import { createClient } from './supabase/server';
import { getProfileByPhone, createGuestProfile } from './supabase/queries';

export async function loginAction(password: string) {
  const ok = await authLogin(password);
  if (ok) redirect('/admin');
  return ok;
}

export async function logoutAction() {
  await authLogout();
}

export async function updateOrderStatus(formData: FormData) {
  if (!(await checkAuth())) return;
  const id = formData.get('id') as string;
  const status = formData.get('status') as string;
  if (!id || !status) return;

  // Read old value for logging
  const { data: old } = await supabaseAdmin.from('orders').select('status').eq('id', id).single();
  const oldStatus = (old as Record<string, unknown> | null)?.status as string | undefined;

  await supabaseAdmin.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id);

  // Log the change
  await supabaseAdmin.from('order_activity_log').insert({
    order_id: id,
    field: 'status',
    old_value: oldStatus || null,
    new_value: status,
    changed_by: 'admin',
  });

  revalidatePath('/admin/orders');
}

export async function updatePaymentStatus(formData: FormData) {
  if (!(await checkAuth())) return;
  const id = formData.get('id') as string;
  const payment_status = formData.get('payment_status') as string;
  if (!id || !payment_status) return;

  // Read old value for logging
  const { data: old } = await supabaseAdmin.from('orders').select('payment_status').eq('id', id).single();
  const oldPaymentStatus = (old as Record<string, unknown> | null)?.payment_status as string | undefined;

  await supabaseAdmin.from('orders').update({ payment_status, updated_at: new Date().toISOString() }).eq('id', id);

  // Log the change
  await supabaseAdmin.from('order_activity_log').insert({
    order_id: id,
    field: 'payment_status',
    old_value: oldPaymentStatus || null,
    new_value: payment_status,
    changed_by: 'admin',
  });

  revalidatePath('/admin/orders');
}

export async function updateDepositStatus(formData: FormData) {
  if (!(await checkAuth())) return;
  const id = formData.get('id') as string;
  const deposit_status = formData.get('deposit_status') as string;
  if (!id || !deposit_status) return;

  const { data: old } = await supabaseAdmin.from('orders').select('deposit_status').eq('id', id).single();
  const oldDepositStatus = (old as Record<string, unknown> | null)?.deposit_status as string | undefined;

  await supabaseAdmin.from('orders').update({ deposit_status, updated_at: new Date().toISOString() }).eq('id', id);

  await supabaseAdmin.from('order_activity_log').insert({
    order_id: id,
    field: 'deposit_status',
    old_value: oldDepositStatus || null,
    new_value: deposit_status,
    changed_by: 'admin',
  });

  revalidatePath('/admin/orders');
}

export async function deleteProduct(formData: FormData) {
  if (!(await checkAuth())) return;
  const id = formData.get('id') as string;
  if (!id) return;
  const { error } = await supabaseAdmin.from('products').delete().eq('id', id);
  if (error) console.error('Delete product error:', error);
  revalidatePath('/admin/products');
  revalidatePath('/', 'layout');
}

export type SaveProductResult = {
  success: boolean
  error?: string
  errorCode?: string
  productId?: string
  slug?: string
}

export async function saveProduct(formData: FormData): Promise<SaveProductResult> {
  if (!(await checkAuth())) return { success: false, error: 'İcazə yoxdur', errorCode: 'AUTH' }

  const id = formData.get('id') as string | null
  const name = formData.get('name') as string
  let slug = formData.get('slug') as string

  if (!name || !slug) {
    return { success: false, error: 'Ad və slug mütləqdir', errorCode: 'VALIDATION' }
  }

  const images = formData.getAll('images').filter(Boolean) as string[]
  const benefits = formData.getAll('benefits').filter(Boolean) as string[]
  const tags = formData.getAll('tags').filter(Boolean) as string[]

  let shades: unknown[] = []
  try {
    const raw = formData.get('shades') as string
    if (raw) shades = JSON.parse(raw)
  } catch {}

  // Check slug uniqueness, auto-generate unique slug if taken
  const { data: existing } = await supabaseAdmin
    .from('products')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()
  if (existing && existing.id !== id) {
    let counter = 2
    while (true) {
      const candidate = `${slug}-${counter}`
      const { data: dup } = await supabaseAdmin
        .from('products')
        .select('id')
        .eq('slug', candidate)
        .maybeSingle()
      if (!dup) { slug = candidate; break }
      counter++
    }
  }

  const payload: Record<string, unknown> = {
    name,
    slug,
    title: name,
    subtitle: formData.get('subtitle') || '',
    description: formData.get('description') || '',
    price: Number(formData.get('price')) || 0,
    old_price: formData.get('originalPrice') ? Number(formData.get('originalPrice')) : null,
    rating: Number(formData.get('rating')) || 0,
    reviews_count: Number(formData.get('reviewsCount')) || 0,
    category: formData.get('category') || '',
    category_id: formData.get('categoryId') || null,
    status: formData.get('status') || 'active',
    how_to_use: formData.get('howToUse') || '',
    ingredients: formData.get('ingredients') || null,
    supplier_url: formData.get('supplierUrl') || null,
    is_new: formData.get('isNew') === 'true',
    try_on_enabled: formData.get('tryOnEnabled') === 'true',
    images,
    benefits,
    tags,
    shades,
    updated_at: new Date().toISOString(),
  }

  // Сохраняем старый slug ДО обновления (для ревалидации)
  let oldSlug: string | null = null
  if (id) {
    const { data: oldProduct } = await supabaseAdmin
      .from('products')
      .select('slug')
      .eq('id', id)
      .maybeSingle()
    oldSlug = (oldProduct as Record<string, unknown> | null)?.slug as string | null
  }

  const { data: savedProduct, error } = id
    ? await supabaseAdmin.from('products').update(payload).eq('id', id).select('id, slug').single()
    : await supabaseAdmin.from('products').insert(payload).select('id, slug').single()

  if (error) {
    console.error('Save product error:', error)
    return { success: false, error: error.message, errorCode: 'DB_ERROR' }
  }

  const savedRow = savedProduct as Record<string, unknown> | null
  const savedId = savedRow?.id as string
  const savedSlug = savedRow?.slug as string

  if (!savedId || !savedSlug) {
    return { success: false, error: 'Məhsul yaradıla bilmədi', errorCode: 'DB_ERROR' }
  }

  // Ревалидация: все страницы где показывается товар
  revalidatePath('/admin/products')
  if (id) revalidatePath(`/admin/products/${id}/edit`)
  revalidatePath('/products')
  revalidatePath(`/products/${savedSlug}`)
  if (oldSlug && oldSlug !== savedSlug) revalidatePath(`/products/${oldSlug}`)
  revalidatePath('/', 'layout')

  return { success: true, productId: savedId, slug: savedSlug }
}

/**
 * Создаёт товар из AI-сгенерированных данных (Tovar.AI product mode).
 * Возвращает ID созданного товара.
 */
export async function createProductFromAI(
  productData: {
    name: string
    slug: string
    title: string
    subtitle: string
    description: string
    category: string
    category_id?: string | null
    category_slug?: string | null
    price: number
    benefits: string[]
    how_to_use: string
    ingredients?: string | null
    tags: string[]
    images: string[]
    supplier_url?: string
    is_new?: boolean
    shades?: Array<{ name: string; colorHex: string; isHot?: boolean; label?: string }>
    try_on_enabled?: boolean
    features?: string[]
    ideal_for?: string | null
    use_cases?: string[]
    care_instructions?: string | null
    compatibility?: string | null
    faq?: { question: string; answer: string }[]
    search_keywords?: string[]
  },
  status: 'active' | 'draft' = 'draft',
): Promise<string | null> {
  if (!(await checkAuth())) return null

  // Проверка уникальности slug
  let slug = productData.slug
  const { data: existing } = await supabaseAdmin
    .from('products')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()
  if (existing) {
    let counter = 2
    while (true) {
      const candidate = `${slug}-${counter}`
      const { data: dup } = await supabaseAdmin
        .from('products')
        .select('id')
        .eq('slug', candidate)
        .maybeSingle()
      if (!dup) { slug = candidate; break }
      counter++
    }
  }

  const { data: product, error } = await supabaseAdmin
    .from('products')
    .insert({
      name: productData.name,
      slug,
      title: productData.title,
      subtitle: productData.subtitle,
      description: productData.description,
      category: productData.category,
      category_id: productData.category_id || null,
      price: productData.price,
      status,
      benefits: productData.benefits,
      how_to_use: productData.how_to_use,
      ingredients: productData.ingredients || null,
      tags: productData.tags,
      images: productData.images,
      supplier_url: productData.supplier_url || null,
      is_new: productData.is_new ?? true,
      shades: productData.shades || [],
      try_on_enabled: productData.try_on_enabled ?? false,
      features: productData.features || [],
      ideal_for: productData.ideal_for || null,
      use_cases: productData.use_cases || [],
      care_instructions: productData.care_instructions || null,
      compatibility: productData.compatibility || null,
      faq: productData.faq || [],
      search_keywords: productData.search_keywords || [],
      rating: 5, // новый AI-товар — сразу 5 звёзд
    })
    .select('id')
    .single()

  if (error) {
    console.error('createProductFromAI error:', error)
    return null
  }

  revalidatePath('/admin/products')
  revalidatePath('/products')
  revalidatePath('/', 'layout')

  return (product as unknown as { id: string }).id
}

/**
 * Возвращает список активных категорий (для селектора в формах).
 * Доступно без авторизации (только чтение).
 */
export async function fetchActiveCategories(): Promise<
  Array<{ id: string; slug: string; title: string; parent_id: string | null }>
> {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('id, slug, title, parent_id')
    .eq('status', 'active')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('fetchActiveCategories error:', error)
    return []
  }
  return (data as any[]) || []
}

/**
 * Меняет статус товара на 'active' (публикация).
 */
export async function publishProduct(productId: string): Promise<boolean> {
  if (!(await checkAuth())) return false

  const { error } = await supabaseAdmin
    .from('products')
    .update({ status: 'active', updated_at: new Date().toISOString() })
    .eq('id', productId)

  if (error) {
    console.error('publishProduct error:', error)
    return false
  }

  revalidatePath('/admin/products')
  revalidatePath('/products')
  revalidatePath('/', 'layout')
  return true
}

export interface CheckoutFormData {
  fullName: string
  phone: string
  email: string
  city: string
  address: string
  paymentMethod: string
  depositMethod?: 'pasha_bank' | 'whatsapp'
  items: Array<{ productId: string; name: string; price: number; quantity: number; shade?: string }>
  total: number
}

export async function submitOrder(formData: CheckoutFormData) {
  let profileId: string
  const existingProfile = await getProfileByPhone(formData.phone)

  if (existingProfile) {
    profileId = existingProfile.id
    await supabaseAdmin.from('profiles').update({
      first_name: formData.fullName,
      email: formData.email || existingProfile.email,
      city: formData.city,
      address: formData.address,
    }).eq('id', profileId)
  } else {
    const newProfile = await createGuestProfile({
      phone: formData.phone,
      email: formData.email || undefined,
      first_name: formData.fullName,
      city: formData.city,
      address: formData.address,
    })
    profileId = newProfile.id
  }

  const depositMethod = formData.paymentMethod === 'cash_delivery' ? (formData.depositMethod || 'whatsapp') : null

  const { data: order, error } = await supabaseAdmin.from('orders').insert({
    profile_id: profileId,
    product_id: formData.items[0]?.productId || null,
    customer_name: formData.fullName,
    phone: formData.phone,
    email: formData.email || null,
    city: formData.city,
    address: formData.address,
    payment_method: formData.paymentMethod,
    deposit_method: depositMethod,
    deposit_status: depositMethod ? 'pending' : null,
    items: formData.items,
    total: formData.total,
    status: 'new',
    payment_status: 'pending',
    quantity: formData.items.reduce((s, i) => s + i.quantity, 0),
  }).select().single()

  if (error) {
    console.error('Order error:', error)
    return { success: false, error: error.message }
  }

  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.user) {
    await supabaseAdmin.from('orders').update({ auth_user_id: session.user.id }).eq('id', (order as Record<string, unknown>).id)
    await supabaseAdmin.from('profiles').update({
      auth_user_id: session.user.id,
      is_guest: false,
    }).eq('id', profileId)
  }

  revalidatePath('/admin/orders')
  const o = order as Record<string, unknown>

  // Online_card: full payment via Pasha Bank (unchanged)
  if (formData.paymentMethod === 'online_card') {
    const gatewayUrl = process.env.GATEWAY_BASE_URL || 'https://tapla.az'
    const apiKey = process.env.GATEWAY_API_KEY || ''

    try {
      const gwResponse = await fetch(`${gatewayUrl}/api/payments/pasha/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({
          orderId: o.id,
          profileId,
          amount: formData.total,
          items: formData.items.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      })

      if (!gwResponse.ok) {
        const errData = await gwResponse.json().catch(() => ({}))
        return { success: false, error: (errData as any).error || 'Ödəniş yaradılması xətası' }
      }

      const gwData = await gwResponse.json()
      return {
        success: true as const,
        orderId: o.id as string,
        orderNumber: `TPL-${String(o.id).slice(0, 6).toUpperCase()}`,
        isGuest: !session?.user,
        redirectUrl: (gwData as any).redirectUrl as string,
      }
    } catch (err) {
      console.error('Gateway error:', err)
      return { success: false, error: `Ödəniş şlyuzu xətası: ${err instanceof Error ? err.message : 'Naməlum xəta'}` }
    }
  }

  // Cash_delivery + Pasha Bank deposit (5 AZN)
  if (formData.paymentMethod === 'cash_delivery' && depositMethod === 'pasha_bank') {
    const gatewayUrl = process.env.GATEWAY_BASE_URL || 'https://tapla.az'
    const apiKey = process.env.GATEWAY_API_KEY || ''

    try {
      const gwResponse = await fetch(`${gatewayUrl}/api/payments/pasha/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({
          orderId: o.id,
          profileId,
          amount: 5,
          items: [{ name: `${formData.fullName} — Depozit (beh)`, price: 5, quantity: 1 }],
        }),
      })

      if (!gwResponse.ok) {
        return { success: false, error: 'Depozit ödənişi yaradılması xətası' }
      }

      const gwData = await gwResponse.json()
      return {
        success: true as const,
        orderId: o.id as string,
        orderNumber: `TPL-${String(o.id).slice(0, 6).toUpperCase()}`,
        depositMethod: 'pasha_bank' as const,
        items: formData.items,
        isGuest: !session?.user,
        redirectUrl: (gwData as any).redirectUrl as string,
      }
    } catch (err) {
      console.error('Gateway error:', err)
      return { success: false, error: `Depozit ödənişi xətası: ${err instanceof Error ? err.message : 'Naməlum xəta'}` }
    }
  }

  // Cash_delivery + WhatsApp: order saved, no payment redirect
  return {
    success: true as const,
    orderId: o.id as string,
    orderNumber: `TPL-${String(o.id).slice(0, 6).toUpperCase()}`,
    depositMethod: 'whatsapp' as const,
    items: formData.items,
    isGuest: !session?.user,
  }
}

// ——— Category CRUD ———

export async function saveCategory(formData: FormData): Promise<void> {
  if (!(await checkAuth())) redirect('/admin')

  const id = formData.get('id') as string | null
  const slug = formData.get('slug') as string
  const title = formData.get('title') as string
  const parentId = formData.get('parentId') as string | null
  const sortOrder = Number(formData.get('sortOrder')) || 0
  const status = (formData.get('status') as string) || 'active'
  const description = (formData.get('description') as string) || null
  const errorBase = 'admin/categories'

  if (!slug || !title) {
    redirect(`/${errorBase}?error=Slug+and+title+required`)
  }

  const payload: Record<string, unknown> = {
    slug,
    title,
    description,
    parent_id: parentId || null,
    sort_order: sortOrder,
    status,
  }

  const { error } = id
    ? await supabaseAdmin.from('categories').update(payload).eq('id', id)
    : await supabaseAdmin.from('categories').insert(payload)

  if (error) {
    console.error('Save category error:', error)
    redirect(`/${errorBase}?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/admin/categories')
  revalidatePath('/', 'layout')
  redirect('/admin/categories')
}

export async function deleteCategory(formData: FormData) {
  if (!(await checkAuth())) return
  const id = formData.get('id') as string
  if (!id) return
  await supabaseAdmin.from('categories').delete().eq('id', id)
  revalidatePath('/admin/categories')
  revalidatePath('/', 'layout')
}

// ——— Hero Slides CRUD ———

export interface HeroSlideData {
  sort_order: number
  tag: string
  title: string
  subtitle: string
  description: string
  image: string
  image_mobile: string
  action_text: string
  href: string
  overlay: boolean
  is_active: boolean
}

export async function saveHeroSlide(formData: FormData): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!(await checkAuth())) return { ok: false, error: 'Not authenticated' }

  const id = formData.get('id') as string | null

  const payload: HeroSlideData = {
    sort_order: Number(formData.get('sort_order')) || 0,
    tag: (formData.get('tag') as string) || '',
    title: (formData.get('title') as string) || '',
    subtitle: (formData.get('subtitle') as string) || '',
    description: (formData.get('description') as string) || '',
    image: (formData.get('image') as string) || '',
    image_mobile: (formData.get('image_mobile') as string) || '',
    action_text: (formData.get('action_text') as string) || 'MƏHSULLARI GÖR',
    href: (formData.get('href') as string) || '/#products',
    overlay: formData.get('overlay') === 'on',
    is_active: formData.get('is_active') === 'on',
  }

  const { error } = id
    ? await supabaseAdmin.from('hero_slides').update(payload).eq('id', id)
    : await supabaseAdmin.from('hero_slides').insert(payload)

  if (error) {
    console.error('Save hero slide error:', error)
    return { ok: false, error: error.message }
  }

  return { ok: true }
}

export async function deleteHeroSlide(formData: FormData): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!(await checkAuth())) return { ok: false, error: 'Not authenticated' }
  const id = formData.get('id') as string
  if (!id) return { ok: false, error: 'No id' }
  const { error } = await supabaseAdmin.from('hero_slides').delete().eq('id', id)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function reorderHeroSlides(formData: FormData): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!(await checkAuth())) return { ok: false, error: 'Not authenticated' }
  const ids = formData.getAll('ids') as string[]
  const orders = formData.getAll('orders') as string[]

  if (ids.length !== orders.length) return { ok: false, error: 'Mismatch' }

  for (let i = 0; i < ids.length; i++) {
    const { error } = await supabaseAdmin
      .from('hero_slides')
      .update({ sort_order: Number(orders[i]) })
      .eq('id', ids[i])
    if (error) return { ok: false, error: error.message }
  }

  return { ok: true }
}
