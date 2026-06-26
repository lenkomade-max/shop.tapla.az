'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from './supabase/admin';
import { login as authLogin, logout as authLogout, checkAuth } from './auth';

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
  await supabaseAdmin.from('products').delete().eq('id', id);
  revalidatePath('/admin/products');
}

export async function saveProduct(formData: FormData): Promise<void> {
  if (!(await checkAuth())) return;

  const id = formData.get('id') as string | null;
  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;
  if (!name || !slug) redirect(`/${id ? `admin/products/${id}/edit` : 'admin/products/new'}?error=Name+and+slug+required`);

  const images = formData.getAll('images').filter(Boolean);
  const benefits = formData.getAll('benefits').filter(Boolean);
  const tags = formData.getAll('tags').filter(Boolean);

  let shades: unknown[] = [];
  try {
    const raw = formData.get('shades') as string;
    if (raw) shades = JSON.parse(raw);
  } catch {}

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

  if (error) redirect(`/${id ? `admin/products/${id}/edit` : 'admin/products/new'}?error=${encodeURIComponent(error.message)}`);

  revalidatePath('/admin/products');
  redirect('/admin/products');
}
