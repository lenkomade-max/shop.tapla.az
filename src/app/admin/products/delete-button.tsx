'use client';

import { deleteProduct } from '@/lib/actions';

export function DeleteButton({ id }: { id: string }) {
  return (
    <form
      action={deleteProduct}
      onSubmit={(e) => { if (!confirm('Удалить товар?')) e.preventDefault(); }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-xs text-zinc-400 hover:text-red-500">
        Удалить
      </button>
    </form>
  );
}
