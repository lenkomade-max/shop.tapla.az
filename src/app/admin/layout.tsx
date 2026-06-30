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
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Link href="/admin" className="text-sm font-bold uppercase tracking-wider shrink-0">TAPLA Admin</Link>
            <nav className="flex gap-2 sm:gap-4 text-sm text-zinc-600 overflow-x-auto scrollbar-none ml-2">
              <Link href="/admin/products" className="hover:text-black whitespace-nowrap px-1">Товары</Link>
              <Link href="/admin/orders" className="hover:text-black whitespace-nowrap px-1">Заказы</Link>
              <Link href="/admin/tovar-ai" className="hover:text-black whitespace-nowrap px-1">Tovar.AI</Link>
              <Link href="/admin/categories" className="hover:text-black whitespace-nowrap px-1 hidden sm:block">Категории</Link>
              <Link href="/admin/hero" className="hover:text-black whitespace-nowrap px-1 hidden sm:block">Hero</Link>
            </nav>
          </div>
          <form action={logoutAction} className="shrink-0">
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
