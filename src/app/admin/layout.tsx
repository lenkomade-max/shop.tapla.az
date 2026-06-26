import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { checkAuth, login, logout } from '@/lib/auth';

function LoginForm() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <form
        action={async (formData: FormData) => {
          'use server';
          const ok = await login(formData.get('password') as string);
          if (ok) redirect('/admin');
          else redirect('/admin');
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

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAuth = await checkAuth();
  if (!isAuth) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-sm font-bold uppercase tracking-wider">Aluna Admin</Link>
            <nav className="flex gap-4 text-sm text-zinc-600">
              <Link href="/admin/products" className="hover:text-black">Товары</Link>
              <Link href="/admin/orders" className="hover:text-black">Заказы</Link>
            </nav>
          </div>
          <form action={logout}>
            <button type="submit" className="text-xs text-zinc-400 hover:text-red-500">Выйти</button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">
        {children}
      </main>
    </div>
  );
}
