import React from 'react';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase/admin';

function NumberCard({ label, value, href }: { label: string; value: string | number; href: string }) {
  return (
    <Link href={href} className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="text-3xl font-bold">{value}</div>
      <div className="mt-1 text-sm text-zinc-500">{label}</div>
    </Link>
  );
}

export default async function AdminPage() {
  const [{ count: productsCount }, { count: ordersCount }] = await Promise.all([
    supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }),
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
