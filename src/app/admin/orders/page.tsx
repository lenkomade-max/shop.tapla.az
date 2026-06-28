import React from 'react';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { OrderStatusSelect, PaymentStatusSelect } from './status-select';

const PAYMENT_LABELS: Record<string, string> = {
  cash_delivery: 'Наличные (курьер)',
  card_delivery: 'Карта курьеру',
  online_card: 'Онлайн карта (Pasha)',
};

export default async function OrdersPage() {
  const { data: orders, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) console.error('Admin orders fetch error:', error);

  // Fetch product names for orders that have product_id
  const productIds = [...new Set((orders ?? []).map(o => o.product_id).filter(Boolean))];
  const { data: products } = productIds.length > 0
    ? await supabaseAdmin.from('products').select('id, name, title').in('id', productIds)
    : { data: [] };

  const productMap = new Map((products ?? []).map(p => [p.id, p.name || p.title]));

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold">Заказы</h2>

      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-zinc-50 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium">Клиент</th>
              <th className="px-4 py-3 font-medium">Телефон</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Город</th>
              <th className="px-4 py-3 font-medium">Адрес</th>
              <th className="px-4 py-3 font-medium">Способ оплаты</th>
              <th className="px-4 py-3 font-medium">Товар</th>
              <th className="px-4 py-3 font-medium">Кол-во</th>
              <th className="px-4 py-3 font-medium">Сумма</th>
              <th className="px-4 py-3 font-medium">Статус оплаты</th>
              <th className="px-4 py-3 font-medium">Статус заказа</th>
              <th className="px-4 py-3 font-medium">Дата</th>
            </tr>
          </thead>
          <tbody>
            {(orders ?? []).length === 0 && (
              <tr>
                <td colSpan={13} className="px-4 py-12 text-center text-zinc-400">
                  Нет заказов
                </td>
              </tr>
            )}
            {(orders ?? []).map(o => (
              <tr key={o.id} className="border-b last:border-0 hover:bg-zinc-50">
                <td className="px-4 py-3 font-medium whitespace-nowrap">{o.customer_name}</td>
                <td className="px-4 py-3 whitespace-nowrap">{o.phone}</td>
                <td className="px-4 py-3 text-zinc-500 text-xs">{o.email || '—'}</td>
                <td className="px-4 py-3 text-zinc-500">{o.city || '—'}</td>
                <td className="px-4 py-3 text-zinc-500 text-xs max-w-[120px] truncate" title={o.address}>
                  {o.address || '—'}
                </td>
                <td className="px-4 py-3 text-xs">
                  {o.payment_method ? (
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-600">
                      {PAYMENT_LABELS[o.payment_method] || o.payment_method}
                    </span>
                  ) : '—'}
                </td>
                <td className="px-4 py-3 text-zinc-600 text-xs max-w-[140px] truncate" title={productMap.get(o.product_id)}>
                  {productMap.get(o.product_id) || '—'}
                </td>
                <td className="px-4 py-3">{o.quantity}</td>
                <td className="px-4 py-3 font-medium whitespace-nowrap">{Number(o.total).toLocaleString()} ₼</td>
                <td className="px-4 py-3">
                  <PaymentStatusSelect id={o.id} currentStatus={o.payment_status} />
                </td>
                <td className="px-4 py-3">
                  <OrderStatusSelect id={o.id} currentStatus={o.status} />
                </td>
                <td className="px-4 py-3 text-xs text-zinc-400 whitespace-nowrap">
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
