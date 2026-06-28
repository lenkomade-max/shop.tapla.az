import React from 'react';
import Link from 'next/link';
import { checkAuth } from '@/lib/auth';
import { logoutAction } from '@/lib/actions';
import { LoginForm } from './login-form';

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
            <Link href="/admin" className="text-sm font-bold uppercase tracking-wider">TAPLA Admin</Link>
            <nav className="flex gap-4 text-sm text-zinc-600">
              <Link href="/admin/products" className="hover:text-black">Товары</Link>
              <Link href="/admin/orders" className="hover:text-black">Заказы</Link>
              <Link href="/admin/tovar-ai" className="hover:text-black">Tovar.AI</Link>
              <Link href="/admin/categories" className="hover:text-black">Категории</Link>
            </nav>
          </div>
          <form action={logoutAction}>
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
