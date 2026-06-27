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
  await supabaseAdmin.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
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

export async function saveProduct(formData: FormData): Promise<void> {
  if (!(await checkAuth())) redirect('/admin');

  const id = formData.get('id') as string | null;
  const name = formData.get('name') as string;
  let slug = formData.get('slug') as string;
  const errorBase = id ? `admin/products/${id}/edit` : 'admin/products/new';

  if (!name || !slug) {
    redirect(`/${errorBase}?error=Name+and+slug+required`);
  }

  const images = formData.getAll('images').filter(Boolean);
  const benefits = formData.getAll('benefits').filter(Boolean);
  const tags = formData.getAll('tags').filter(Boolean);

  let shades: unknown[] = [];
  try {
    const raw = formData.get('shades') as string;
    if (raw) shades = JSON.parse(raw);
  } catch {}

  // Check slug uniqueness, auto-generate unique slug if taken
  const { data: existing } = await supabaseAdmin
    .from('products')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();
  if (existing && existing.id !== id) {
    let counter = 2;
    while (true) {
      const candidate = `${slug}-${counter}`;
      const { data: dup } = await supabaseAdmin
        .from('products')
        .select('id')
        .eq('slug', candidate)
        .maybeSingle();
      if (!dup) { slug = candidate; break; }
      counter++;
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
    status: formData.get('status') || 'active',
    how_to_use: formData.get('howToUse') || '',
    ingredients: formData.get('ingredients') || null,
    is_new: formData.get('isNew') === 'true',
    try_on_enabled: formData.get('tryOnEnabled') === 'true',
    images,
    benefits,
    tags,
    shades,
  };

  const { error } = id
    ? await supabaseAdmin.from('products').update(payload).eq('id', id)
    : await supabaseAdmin.from('products').insert(payload);

  if (error) {
    console.error('Save product error:', error);
    redirect(`/${errorBase}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/admin/products');
  revalidatePath('/products');
  revalidatePath('/', 'layout');
  redirect('/admin/products');
}

export interface CheckoutFormData {
  firstName: string
  lastName: string
  phone: string
  email: string
  city: string
  address: string
  paymentMethod: string
  items: Array<{ productId: string; name: string; price: number; quantity: number; shade?: string }>
  total: number
}

export async function submitOrder(formData: CheckoutFormData) {
  let profileId: string
  const existingProfile = await getProfileByPhone(formData.phone)

  if (existingProfile) {
    profileId = existingProfile.id
    await supabaseAdmin.from('profiles').update({
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email || existingProfile.email,
    }).eq('id', profileId)
  } else {
    const newProfile = await createGuestProfile({
      phone: formData.phone,
      email: formData.email || undefined,
      first_name: formData.firstName,
      last_name: formData.lastName,
    })
    profileId = newProfile.id
  }

  const { data: order, error } = await supabaseAdmin.from('orders').insert({
    profile_id: profileId,
    customer_name: `${formData.firstName} ${formData.lastName}`,
    phone: formData.phone,
    email: formData.email || null,
    city: formData.city,
    address: formData.address,
    payment_method: formData.paymentMethod,
    total: formData.total,
    status: 'new',
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
  return {
    success: true as const,
    orderId: o.id as string,
    orderNumber: `TPL-${String(o.id).slice(0, 6).toUpperCase()}`,
    isGuest: !session?.user,
  }
}
