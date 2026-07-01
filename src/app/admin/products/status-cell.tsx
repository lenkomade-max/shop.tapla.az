'use client';

import React, { useTransition } from 'react';
import { updateProductStatus } from '@/lib/actions';

const STATUS_OPTIONS = [
  { value: 'active', label: 'Активный', color: 'bg-green-100 text-green-700' },
  { value: 'draft', label: 'Черновик', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'archived', label: 'Архив', color: 'bg-red-100 text-red-700' },
];

export function StatusCell({ id, status }: { id: string; status: string }) {
  const [pending, startTransition] = useTransition();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    if (newStatus === status) return;
    const fd = new FormData();
    fd.append('id', id);
    fd.append('status', newStatus);
    startTransition(() => {
      updateProductStatus(fd);
    });
  }

  const current = STATUS_OPTIONS.find(o => o.value === status) || STATUS_OPTIONS[0];

  return (
    <select
      value={status}
      onChange={onChange}
      disabled={pending}
      className={`rounded-full px-2 py-0.5 text-xs font-medium border-0 outline-none cursor-pointer appearance-none text-center ${current.color} ${pending ? 'opacity-50 cursor-wait' : ''}`}
      style={{ minWidth: '90px' }}
    >
      {STATUS_OPTIONS.map(o => (
        <option key={o.value} value={o.value} className="bg-white text-zinc-900">
          {o.label}
        </option>
      ))}
    </select>
  );
}
