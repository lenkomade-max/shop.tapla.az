'use client';

import { updateOrderStatus, updatePaymentStatus } from '@/lib/actions';

const STATUSES = ['new', 'paid', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const;

const STATUS_LABELS: Record<string, string> = {
  new: 'Новый',
  paid: 'Оплачен',
  confirmed: 'Подтверждён',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
};

const STATUS_CLASSES: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  paid: 'bg-emerald-100 text-emerald-700',
  confirmed: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'] as const;

const PAYMENT_LABELS: Record<string, string> = {
  pending: '⏳ Ожидает',
  paid: '✓ Оплачено',
  failed: '✗ Ошибка',
  refunded: '↩ Возврат',
};

const PAYMENT_CLASSES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-zinc-100 text-zinc-500',
};

export function OrderStatusSelect({ id, currentStatus }: { id: string; currentStatus: string }) {
  return (
    <form action={updateOrderStatus}>
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        defaultValue={currentStatus}
        onChange={e => { e.target.form?.requestSubmit(); }}
        className={`cursor-pointer rounded-full px-2 py-0.5 text-xs font-medium outline-none ${STATUS_CLASSES[currentStatus] || ''}`}
      >
        {STATUSES.map(s => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
    </form>
  );
}

export function PaymentStatusSelect({ id, currentStatus }: { id: string; currentStatus: string }) {
  return (
    <form action={updatePaymentStatus}>
      <input type="hidden" name="id" value={id} />
      <select
        name="payment_status"
        defaultValue={currentStatus || 'pending'}
        onChange={e => { e.target.form?.requestSubmit(); }}
        className={`cursor-pointer rounded-full px-2 py-0.5 text-xs font-medium outline-none ${PAYMENT_CLASSES[currentStatus] || ''}`}
      >
        {PAYMENT_STATUSES.map(s => (
          <option key={s} value={s}>
            {PAYMENT_LABELS[s]}
          </option>
        ))}
      </select>
    </form>
  );
}
