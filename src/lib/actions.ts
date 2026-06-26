'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { supabase } from './supabase/client';
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
  await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
  revalidatePath('/admin/orders');
}

export async function deleteProduct(formData: FormData) {
  if (!(await checkAuth())) return;
  const id = formData.get('id') as string;
  if (!id) return;
  await supabase.from('products').delete().eq('id', id);
  revalidatePath('/admin/products');
}
