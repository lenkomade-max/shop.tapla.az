'use client';

import { updateOrderStatus } from '@/lib/actions';

const STATUSES = ['new', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const;

const STATUS_LABELS: Record<string, string> = {
  new: 'Новый',
  confirmed: 'Подтверждён',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
};

const STATUS_CLASSES: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function StatusSelect({ id, currentStatus }: { id: string; currentStatus: string }) {
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
