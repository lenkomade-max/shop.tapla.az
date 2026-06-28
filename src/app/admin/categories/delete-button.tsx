'use client';

import { deleteCategory } from '@/lib/actions';

export default function DeleteCategoryButton({ id }: { id: string }) {
  return (
    <form action={deleteCategory} className="inline ml-2">
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-xs text-red-500 hover:text-red-700 px-2 py-1"
        onClick={e => { if (!confirm('Silinsin?')) e.preventDefault() }}
      >
        Sil
      </button>
    </form>
  );
}
