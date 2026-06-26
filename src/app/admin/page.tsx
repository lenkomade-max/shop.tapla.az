import React from 'react';
import { redirect } from 'next/navigation';
import { checkAuth, login } from '@/lib/auth';
import Link from 'next/link';

function LoginForm() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <form
        action={async (formData: FormData) => {
          'use server';
          const ok = await login(formData.get('password') as string);
          if (ok) redirect('/admin');
          else redirect('/admin?login=1&error=1');
        }}
        className="w-full max-w-sm rounded-xl border bg-white p-8 shadow-sm"
      >
        <h1 className="mb-6 text-center text-lg font-bold uppercase tracking-wider">Aluna Admin</h1>
        <input
          name="password"
          type="password"
          placeholder="Пароль"
          required
          autoFocus
          className="mb-4 block w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none focus:border-black"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-black py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Войти
        </button>
      </form>
    </div>
  );
}

function NumberCard({ label, value, href }: { label: string; value: string | number; href: string }) {
  return (
    <Link href={href} className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="text-3xl font-bold">{value}</div>
      <div className="mt-1 text-sm text-zinc-500">{label}</div>
    </Link>
  );
}

export default async function AdminPage() {
  const isAuth = await checkAuth();
  if (!isAuth) return <LoginForm />;

  const supabase = (await import('@/lib/supabase/client')).supabase;
  const [{ count: productsCount }, { count: ordersCount }] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
  ]);

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold">Дашборд</h2>
      <div className="grid grid-cols-3 gap-4">
        <NumberCard label="Товаров" value={productsCount ?? 0} href="/admin/products" />
        <NumberCard label="Заказов" value={ordersCount ?? 0} href="/admin/orders" />
      </div>
    </div>
  );
}
