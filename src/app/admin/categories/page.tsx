import { supabaseAdmin } from '@/lib/supabase/admin'
import { saveCategory } from '@/lib/actions'
import Link from 'next/link'
import DeleteCategoryButton from './delete-button'

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
  } catch {
    console.warn('Failed to fetch categories from DB')
  }
  return []
}

function buildTree(flat: CatRow[]): TreeNode[] {
  const map = new Map<string, TreeNode>()
  for (const c of flat) {
    map.set(c.id, { ...c, children: [] })
  }
  const roots: TreeNode[] = []
  for (const c of map.values()) {
    if (c.parent_id && map.has(c.parent_id)) {
      map.get(c.parent_id)!.children.push(c)
    } else {
      roots.push(c)
    }
  }
  return roots.sort((a, b) => a.sort_order - b.sort_order)
}

type TreeNode = CatRow & { children: TreeNode[] }

function renderTreeRows(
  nodes: TreeNode[],
  allCatRows: CatRow[],
  depth = 0
): React.ReactNode[] {
  const rows: React.ReactNode[] = []
  for (const cat of nodes) {
    rows.push(
      <tr key={cat.id} className="border-b border-neutral-100 hover:bg-neutral-50">
        <td className="px-4 py-3 font-mono text-xs">{cat.slug}</td>
        <td className={`px-4 py-3 ${depth === 0 ? 'font-bold' : 'font-medium'}`}>
          <span style={{ marginLeft: `${depth * 16}px` }}>
            {depth > 0 && <span className="text-neutral-300 mr-1">└</span>}
            {cat.title}
          </span>
          {depth === 0 && <span className="ml-2 text-[10px] text-neutral-400">(root)</span>}
        </td>
        <td className="px-4 py-3 text-xs text-neutral-500">
          {cat.parent_id
            ? allCatRows.find(c => c.id === cat.parent_id)?.title || '-'
            : '-'}
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
        <td className="px-4 py-3 text-right whitespace-nowrap">
          <details className="inline-block relative">
            <summary className="text-xs text-neutral-500 cursor-pointer hover:text-neutral-900 px-2 py-1">
              Redaktə
            </summary>
            <div className="absolute right-0 mt-1 w-80 bg-white border border-neutral-200 shadow-xl rounded-lg p-4 z-10">
              <CategoryForm allCats={allCatRows} existing={cat} />
            </div>
          </details>
          <DeleteCategoryButton id={cat.id} />
        </td>
      </tr>
    )
    if (cat.children.length > 0) {
      rows.push(...renderTreeRows(cat.children, allCatRows, depth + 1))
    }
  }
  return rows
}

export default async function AdminCategoriesPage() {
  const cats = await getCats()
  const tree = buildTree(cats)

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

      {/* New category form */}
      <details className="mb-8 border border-neutral-200 rounded-lg overflow-hidden" id="new-form">
        <summary className="px-4 py-3 bg-neutral-50 text-sm font-semibold cursor-pointer hover:bg-neutral-100">
          Yeni kateqoriya əlavə et
        </summary>
        <div className="p-4 border-t border-neutral-200">
          <CategoryForm allCats={cats} />
        </div>
      </details>

      {/* Categories tree table */}
      {cats.length === 0 ? (
        <div className="border border-neutral-200 rounded-lg p-8 text-center text-sm text-neutral-400">
          Hələ kateqoriya yoxdur. Yuxarıdan yenisini əlavə edin.
        </div>
      ) : (
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
              {renderTreeRows(tree, cats)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ——— Category form component ———
interface CategoryFormProps {
  allCats: CatRow[]
  existing?: CatRow
}

function CategoryForm({ allCats, existing }: CategoryFormProps) {
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
          <select
            name="parentId"
            defaultValue={existing?.parent_id || ''}
            className="w-full border border-neutral-200 rounded px-2 py-1.5 text-xs"
          >
            <option value="">— Root —</option>
            {renderParentOptions(allCats, existing?.id)}
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

function renderParentOptions(cats: CatRow[], excludeId?: string, depth = 0): React.ReactNode[] {
  const roots = cats.filter(c => !c.parent_id)
  const options: React.ReactNode[] = []

  function addChildren(parentId: string, currentDepth: number) {
    const children = cats.filter(c => c.parent_id === parentId)
    for (const child of children) {
      if (child.id === excludeId) continue
      options.push(
        <option key={child.id} value={child.id}>
          {'  '.repeat(currentDepth + 1)}└ {child.title}
        </option>
      )
      addChildren(child.id, currentDepth + 1)
    }
  }

  for (const root of roots) {
    if (root.id === excludeId) continue
    options.push(
      <option key={root.id} value={root.id}>{root.title}</option>
    )
    addChildren(root.id, depth + 1)
  }

  return options
}
