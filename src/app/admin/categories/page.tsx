import { supabaseAdmin } from '@/lib/supabase/admin'
import { CATEGORIES } from '@/constants/data'
import { deleteCategory, saveCategory } from '@/lib/actions'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface CatRow {
  id: string
  slug: string
  title: string
  description: string | null
  parent_id: string | null
  sort_order: number
  status: string
}

async function getCats(): Promise<CatRow[]> {
  try {
    if (supabaseAdmin) {
      const { data } = await supabaseAdmin
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })
      if (data && data.length > 0) return data as CatRow[]
    }
  } catch {}
  // fallback with static ids
  return CATEGORIES.map(c => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    description: c.description || null,
    parent_id: c.parentId,
    sort_order: c.sortOrder,
    status: c.status,
  }))
}

export default async function AdminCategoriesPage() {
  const cats = await getCats()

  // Build parent map
  const parentMap = new Map<string, string>()
  for (const c of cats) {
    if (c.parent_id) {
      const parent = cats.find(p => p.id === c.parent_id)
      if (parent) parentMap.set(c.id, parent.title)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Kateqoriyalar</h1>
          <p className="text-neutral-500 text-sm mt-1">Ümumi: {cats.length}</p>
        </div>
        <a
          href="#new-form"
          className="bg-neutral-950 text-white text-xs px-4 py-2 rounded hover:bg-neutral-800 transition-colors inline-block"
        >
          + YENI KATEQORIYA
        </a>
      </div>

      {/* New category form — inline */}
      <details className="mb-8 border border-neutral-200 rounded-lg overflow-hidden" id="new-form">
        <summary className="px-4 py-3 bg-neutral-50 text-sm font-semibold cursor-pointer hover:bg-neutral-100">
          Yeni kateqoriya əlavə et
        </summary>
        <div className="p-4 border-t border-neutral-200">
          <CategoryForm cats={cats} />
        </div>
      </details>

      {/* Categories table */}
      <div className="overflow-x-auto border border-neutral-200 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-xs tracking-wider">Slug</th>
              <th className="text-left px-4 py-3 font-semibold text-xs tracking-wider">Başlıq</th>
              <th className="text-left px-4 py-3 font-semibold text-xs tracking-wider">Parent</th>
              <th className="text-left px-4 py-3 font-semibold text-xs tracking-wider">Sıra</th>
              <th className="text-left px-4 py-3 font-semibold text-xs tracking-wider">Status</th>
              <th className="text-right px-4 py-3 font-semibold text-xs tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cats.map(cat => (
              <tr key={cat.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="px-4 py-3 font-mono text-xs">{cat.slug}</td>
                <td className={`px-4 py-3 font-medium ${!cat.parent_id ? 'font-bold' : ''}`}>
                  {cat.title}
                  {!cat.parent_id && <span className="ml-2 text-[10px] text-neutral-400">(root)</span>}
                </td>
                <td className="px-4 py-3 text-xs text-neutral-500">
                  {parentMap.get(cat.id) || '-'}
                </td>
                <td className="px-4 py-3 text-xs">{cat.sort_order}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    cat.status === 'active'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-neutral-100 text-neutral-500'
                  }`}>
                    {cat.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <details className="inline-block">
                    <summary className="text-xs text-neutral-500 cursor-pointer hover:text-neutral-900 px-2 py-1">
                      Redaktə
                    </summary>
                    <div className="absolute right-0 mt-1 w-80 bg-white border border-neutral-200 shadow-xl rounded-lg p-4 z-10">
                      <CategoryForm cats={cats} existing={cat} />
                    </div>
                  </details>
                  <form action={deleteCategory} className="inline ml-2">
                    <input type="hidden" name="id" value={cat.id} />
                    <button
                      type="submit"
                      className="text-xs text-red-500 hover:text-red-700 px-2 py-1"
                      onClick={e => { if (!confirm('Silinsin?')) e.preventDefault() }}
                    >
                      Sil
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function CategoryForm({ cats, existing }: { cats: CatRow[]; existing?: CatRow }) {
  const rootCats = cats.filter(c => !c.parent_id)
  return (
    <form action={saveCategory} className="space-y-3">
      {existing && <input type="hidden" name="id" value={existing.id} />}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] tracking-wider font-semibold text-neutral-500 mb-1">Slug</label>
          <input
            name="slug"
            defaultValue={existing?.slug || ''}
            required
            className="w-full border border-neutral-200 rounded px-2 py-1.5 text-xs"
          />
        </div>
        <div>
          <label className="block text-[10px] tracking-wider font-semibold text-neutral-500 mb-1">Başlıq</label>
          <input
            name="title"
            defaultValue={existing?.title || ''}
            required
            className="w-full border border-neutral-200 rounded px-2 py-1.5 text-xs"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] tracking-wider font-semibold text-neutral-500 mb-1">Açıqlama</label>
        <input
          name="description"
          defaultValue={existing?.description || ''}
          className="w-full border border-neutral-200 rounded px-2 py-1.5 text-xs"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-[10px] tracking-wider font-semibold text-neutral-500 mb-1">Parent</label>
          <select name="parentId" defaultValue={existing?.parent_id || ''} className="w-full border border-neutral-200 rounded px-2 py-1.5 text-xs">
            <option value="">— Root —</option>
            {rootCats.map(rc => (
              <option key={rc.id} value={rc.id} disabled={rc.id === existing?.id}>
                {rc.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] tracking-wider font-semibold text-neutral-500 mb-1">Sıra</label>
          <input
            name="sortOrder"
            type="number"
            defaultValue={existing?.sort_order || 0}
            className="w-full border border-neutral-200 rounded px-2 py-1.5 text-xs"
          />
        </div>
        <div>
          <label className="block text-[10px] tracking-wider font-semibold text-neutral-500 mb-1">Status</label>
          <select name="status" defaultValue={existing?.status || 'active'} className="w-full border border-neutral-200 rounded px-2 py-1.5 text-xs">
            <option value="active">Active</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-neutral-950 text-white text-xs py-2 rounded hover:bg-neutral-800 transition-colors"
      >
        {existing ? 'Yadda saxla' : 'Əlavə et'}
      </button>
    </form>
  )
}
