import React from 'react';
import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase/client';
import { checkAuth } from '@/lib/auth';

const STATUSES = ['new', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const;

async function updateStatus(formData: FormData) {
  'use server';
  if (!(await checkAuth())) return;
  const id = formData.get('id') as string;
  const status = formData.get('status') as string;
  if (!id || !status) return;
  await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
  revalidatePath('/admin/orders');
}

export default async function OrdersPage() {
  const { data: orders } = await supabase
    .from('orders')
    .select('*, products!inner(name, slug)')
    .order('created_at', { ascending: false });

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold">Заказы</h2>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-zinc-50 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium">Клиент</th>
              <th className="px-4 py-3 font-medium">Телефон</th>
              <th className="px-4 py-3 font-medium">Товар</th>
              <th className="px-4 py-3 font-medium">Кол-во</th>
              <th className="px-4 py-3 font-medium">Сумма</th>
              <th className="px-4 py-3 font-medium">Статус</th>
              <th className="px-4 py-3 font-medium">Дата</th>
            </tr>
          </thead>
          <tbody>
            {(orders ?? []).length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-zinc-400">
                  Нет заказов
                </td>
              </tr>
            )}
            {(orders ?? []).map(o => (
              <tr key={o.id} className="border-b last:border-0 hover:bg-zinc-50">
                <td className="px-4 py-3 font-medium">{o.customer_name}</td>
                <td className="px-4 py-3">{o.phone}</td>
                <td className="px-4 py-3 text-zinc-500">
                  {o.products?.name || '—'}
                  {o.city && <span className="block text-xs text-zinc-400">{o.city}</span>}
                </td>
                <td className="px-4 py-3">{o.quantity}</td>
                <td className="px-4 py-3 font-medium">{Number(o.total).toLocaleString()} ₼</td>
                <td className="px-4 py-3">
                  <form action={updateStatus}>
                    <input type="hidden" name="id" value={o.id} />
                    <select
                      name="status"
                      defaultValue={o.status}
                      onChange={e => { e.target.form?.requestSubmit(); }}
                      className={`cursor-pointer rounded-full px-2 py-0.5 text-xs font-medium outline-none ${
                        o.status === 'new' ? 'bg-blue-100 text-blue-700'
                        : o.status === 'confirmed' ? 'bg-yellow-100 text-yellow-700'
                        : o.status === 'shipped' ? 'bg-purple-100 text-purple-700'
                        : o.status === 'delivered' ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {STATUSES.map(s => (
                        <option key={s} value={s}>
                          {s === 'new' ? 'Новый' : s === 'confirmed' ? 'Подтверждён' : s === 'shipped' ? 'Отправлен' : s === 'delivered' ? 'Доставлен' : 'Отменён'}
                        </option>
                      ))}
                    </select>
                  </form>
                </td>
                <td className="px-4 py-3 text-xs text-zinc-400">
                  {new Date(o.created_at).toLocaleDateString('ru')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
