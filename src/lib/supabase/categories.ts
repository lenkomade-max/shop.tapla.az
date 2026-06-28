// ============================================================================
// Categories — работа с иерархической таблицей categories
// ============================================================================

import { supabaseAdmin } from './admin'

export interface Category {
  id: string
  slug: string
  title: string
  description: string | null
  image: string | null
  parent_id: string | null
  sort_order: number
  status: 'active' | 'draft'
}

export interface CategoryTree extends Category {
  children: CategoryTree[]
}

// ─── Получение категорий ──────────────────────────────────────────────────────

/**
 * Возвращает все активные категории (плоский список).
 */
export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .eq('status', 'active')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('[Categories] fetch error:', error)
    return []
  }
  return (data as Category[]) || []
}

/**
 * Возвращает дерево категорий (родители → дети).
 */
export async function fetchCategoryTree(): Promise<CategoryTree[]> {
  const all = await fetchCategories()
  const roots = all.filter(c => !c.parent_id)
  const tree: CategoryTree[] = roots.map(root => ({
    ...root,
    children: all
      .filter(c => c.parent_id === root.id)
      .map(c => ({ ...c, children: [] })),
  }))
  return tree
}

// ─── Матчинг AI-категории → БД ─────────────────────────────────────────────────

/**
 * Пытается сопоставить строку категории от AI с записью в таблице categories.
 * Ищет по точному совпадению title, потом по slug, потом по частичному совпадению.
 * Возвращает category_id или null если не найдено.
 */
export async function matchCategoryFromAI(aiCategory: string): Promise<{
  id: string
  title: string
  slug: string
} | null> {
  if (!aiCategory) return null

  const categories = await fetchCategories()
  if (categories.length === 0) {
    console.warn('[Categories] No categories in DB, skipping match')
    return null
  }

  const aiLower = aiCategory.toLowerCase().trim()

  // 1. Точное совпадение по title
  const exactTitle = categories.find(
    c => c.title.toLowerCase() === aiLower,
  )
  if (exactTitle) {
    console.log(`[Categories] Exact title match: "${aiCategory}" → ${exactTitle.title} (${exactTitle.id})`)
    return { id: exactTitle.id, title: exactTitle.title, slug: exactTitle.slug }
  }

  // 2. Точное совпадение по slug
  const exactSlug = categories.find(c => c.slug === aiLower.replace(/\s+/g, '-'))
  if (exactSlug) {
    console.log(`[Categories] Slug match: "${aiCategory}" → ${exactSlug.title} (${exactSlug.id})`)
    return { id: exactSlug.id, title: exactSlug.title, slug: exactSlug.slug }
  }

  // 3. Частичное совпадение (AI категория содержится в title ИЛИ title содержится в AI)
  const partial = categories.find(c => {
    const catLower = c.title.toLowerCase()
    return catLower.includes(aiLower) || aiLower.includes(catLower)
  })
  if (partial) {
    console.log(`[Categories] Partial match: "${aiCategory}" → ${partial.title} (${partial.id})`)
    return { id: partial.id, title: partial.title, slug: partial.slug }
  }

  // 4. Совпадение по ключевым словам
  const keywordMap: Record<string, string[]> = {
    'telefon': ['telefonlar', 'smartfon', 'telefon'],
    'smartfon': ['smartfon', 'telefonlar'],
    'saat': ['smart-saat', 'aqilli-saat'],
    'qulaqliq': ['qulaqliq', 'tws', 'audio'],
    'fen': ['fen', 'serinkes'],
    'masaj': ['masaj', 'saglamliq'],
    'tozsoran': ['temizlik', 'tozsoran'],
    'utü': ['metbex'],
    'powerbank': ['powerbank'],
    'noutbuk': ['elektronika'],
    'kamera': ['elektronika'],
    'oyun': ['oyun-aksesuari'],
    'planset': ['planset'],
  }

  for (const [keyword, targetSlugs] of Object.entries(keywordMap)) {
    if (aiLower.includes(keyword)) {
      for (const targetSlug of targetSlugs) {
        const match = categories.find(c => c.slug === targetSlug)
        if (match) {
          console.log(`[Categories] Keyword match: "${aiCategory}" (keyword: ${keyword}) → ${match.title} (${match.id})`)
          return { id: match.id, title: match.title, slug: match.slug }
        }
      }
    }
  }

  console.log(`[Categories] No match for: "${aiCategory}"`)
  return null
}
