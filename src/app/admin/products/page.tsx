import React from 'react';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { DeleteButton } from './delete-button';
import { StatusCell } from './status-cell';
import { CategoryCell } from './category-cell';
import { fetchActiveCategories } from '@/lib/actions';

export default async function ProductsPage() {
  const [{ data: products, error }, categories] = await Promise.all([
    supabaseAdmin
      .from('products')
      .select('id, name, slug, title, price, status, category, supplier_url, created_at')
      .order('created_at', { ascending: false }),
    fetchActiveCategories(),
  ]);

  if (error) {
    console.error('Admin products fetch error:', error);
  }

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Ошибка Supabase: {error.message} (code: {error.code})
        </div>
      )}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Товары</h2>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          + Новый товар
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="border-b bg-zinc-50 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium">Название</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Цена</th>
              <th className="px-4 py-3 font-medium">Категория</th>
              <th className="px-4 py-3 font-medium">Статус</th>
              <th className="px-4 py-3 font-medium">Дата</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {(products ?? []).length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-zinc-400">
                  Нет товаров. <Link href="/admin/products/new" className="text-black underline">Создать первый</Link>
                </td>
              </tr>
            )}
            {(products ?? []).map(p => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-zinc-50">
                <td className="px-4 py-3 font-medium">
                  {p.name || p.title}
                  {(p as any).supplier_url && (
                    <span className="ml-1.5 inline-flex items-center rounded-full bg-purple-100 px-1.5 py-0.5 text-[10px] font-medium text-purple-700" title="AI ilə yaradılıb">
                      AI
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-400">{p.slug}</td>
                <td className="px-4 py-3">{p.price ? p.price.toLocaleString() + ' ₼' : '—'}</td>
                <td className="px-4 py-3">
                  <CategoryCell id={p.id} category={p.category} categories={categories} />
                </td>
                <td className="px-4 py-3">
                  <StatusCell id={p.id} status={p.status} />
                </td>
                <td className="px-4 py-3 text-xs text-zinc-400">
                  {new Date(p.created_at).toLocaleDateString('ru')}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="text-xs text-zinc-500 hover:text-black"
                    >
                      Redaktə
                    </Link>
                    <Link
                      href={`/admin/products/${p.id}/generate-cards`}
                      className="text-xs text-zinc-500 hover:text-black"
                    >
                      Kartlar
                    </Link>
                    <DeleteButton id={p.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
