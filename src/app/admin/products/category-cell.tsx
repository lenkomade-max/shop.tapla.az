'use client';

import React, { useTransition } from 'react';
import { updateProductCategory } from '@/lib/actions';

interface CategoryOption {
  id: string;
  slug: string;
  title: string;
  parent_id: string | null;
}

export function CategoryCell({
  id,
  category,
  categories,
}: {
  id: string;
  category: string;
  categories: CategoryOption[];
}) {
  const [pending, startTransition] = useTransition();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    if (value === category) return;
    const fd = new FormData();
    fd.append('id', id);
    fd.append('category', value);
    const found = categories.find(c => c.title === value);
    if (found) fd.append('categoryId', found.id);
    startTransition(() => {
      updateProductCategory(fd);
    });
  }

  const roots = categories.filter(c => !c.parent_id);

  return (
    <select
      value={category || ''}
      onChange={onChange}
      disabled={pending}
      className={`rounded-lg border-0 px-2 py-1 text-xs outline-none cursor-pointer appearance-none ${pending ? 'opacity-50 cursor-wait' : 'hover:bg-zinc-100'} ${category ? 'text-zinc-700' : 'text-zinc-300'}`}
      style={{ minWidth: '160px' }}
    >
      <option value="" className="text-zinc-400">—</option>
      {roots.map(root => {
        const children = categories.filter(c => c.parent_id === root.id);
        return (
          <optgroup key={root.id} label={root.title}>
            <option value={root.title} className="text-zinc-900">{root.title}</option>
            {children.map(sub => {
              const grandkids = categories.filter(c => c.parent_id === sub.id);
              if (grandkids.length > 0) {
                return (
                  <React.Fragment key={sub.id}>
                    <option value={sub.title} className="text-zinc-600">&nbsp;&nbsp;─ {sub.title}</option>
                    {grandkids.map(gc => (
                      <option key={gc.id} value={gc.title} className="text-zinc-900">&nbsp;&nbsp;&nbsp;&nbsp;└ {gc.title}</option>
                    ))}
                  </React.Fragment>
                );
              }
              return (
                <option key={sub.id} value={sub.title} className="text-zinc-900">&nbsp;&nbsp;└ {sub.title}</option>
              );
            })}
          </optgroup>
        );
      })}
    </select>
  );
}
