import { supabaseAdmin } from '@/lib/supabase/admin';
import { PRODUCTS, REVIEWS, FAQS, RITUAL_STEPS, BENEFITS_LIST, CATEGORIES } from '@/constants/data';
import { Product, Review, FAQ, Benefit, Category } from '@/types';

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

function mapProduct(row: Record<string, unknown>): Product {
  const name = (row.name as string) || (row.title as string) || '';
  return {
    id: row.id as string,
    slug: (row.slug as string) || slugify(name) || (row.id as string),
    name: (row.name as string) || (row.title as string) || '',
    subtitle: (row.subtitle as string) || '',
    description: (row.description as string) || '',
    price: Number(row.price) || 0,
    originalPrice: row.old_price != null ? Number(row.old_price) : undefined,
    rating: Number(row.rating) || 0,
    reviewsCount: Number(row.reviews_count) || 0,
    images: Array.isArray(row.images) ? row.images as string[] : [],
    category: (row.category as string) || '',
    categoryId: (row.category_id as string | null) || null,
    benefits: Array.isArray(row.benefits) ? row.benefits as string[] : [],
    howToUse: (row.how_to_use as string) || '',
    ingredients: row.ingredients as string | undefined,
    tags: Array.isArray(row.tags) ? row.tags as string[] : undefined,
    shades: Array.isArray(row.shades) ? row.shades as { name: string; colorHex: string; isHot?: boolean; label?: string }[] : undefined,
    isNew: Boolean(row.is_new) || undefined,
    tryOnEnabled: Boolean(row.try_on_enabled) || undefined,
    // Stage 1.5 enrichment
    features: Array.isArray(row.features) ? row.features as string[] : undefined,
    idealFor: row.ideal_for as string | null ?? undefined,
    useCases: Array.isArray(row.use_cases) ? row.use_cases as string[] : undefined,
    careInstructions: row.care_instructions as string | null ?? undefined,
    compatibility: row.compatibility as string | null ?? undefined,
    faq: Array.isArray(row.faq) ? row.faq as { question: string; answer: string }[] : undefined,
    searchKeywords: Array.isArray(row.search_keywords) ? row.search_keywords as string[] : undefined,
  };
}

function mapReview(row: Record<string, unknown>): Review {
  return {
    id: row.id as string,
    reviewerName: row.reviewer_name as string,
    rating: Number(row.rating) || 5,
    title: (row.title as string) || '',
    comment: row.comment as string,
    date: (row.date as string) || new Date().toISOString(),
    location: row.location as string | undefined,
    productCategory: row.product_category as string | undefined,
    usagePurpose: row.usage_purpose as string | undefined,
    verifiedBuyer: Boolean(row.verified_buyer),
    images: Array.isArray(row.images) ? row.images as string[] : undefined,
    likes: Number(row.likes) || 0,
    dislikes: Number(row.dislikes) || 0,
  };
}

function mapFAQ(row: Record<string, unknown>): FAQ {
  return {
    id: row.id as string,
    question: row.question as string,
    answer: row.answer as string,
    category: row.category as string,
  };
}

function mapCategory(row: Record<string, unknown>): Category {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    description: row.description as string | undefined,
    image: row.image as string | undefined,
    parentId: row.parent_id as string | null,
    sortOrder: Number(row.sort_order) || 0,
    status: (row.status as 'active' | 'draft') || 'active',
    productCount: row.product_count != null ? Number(row.product_count) : undefined,
  };
}

function buildCategoryTree(flat: Category[]): Category[] {
  const map = new Map<string, Category>();
  const roots: Category[] = [];

  for (const cat of flat) {
    map.set(cat.id, { ...cat, children: [] });
  }

  for (const cat of map.values()) {
    if (cat.parentId && map.has(cat.parentId)) {
      map.get(cat.parentId)!.children!.push(cat);
    } else if (!cat.parentId) {
      roots.push(cat);
    }
  }

  return roots.sort((a, b) => a.sortOrder - b.sortOrder);
}

export const dbService = {
  async getProducts(category?: string): Promise<Product[]> {
    try {
      if (supabaseAdmin) {
        let query = supabaseAdmin.from('products').select('*').eq('status', 'active');
        if (category) {
          query = query.eq('category', category);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return (data as Record<string, unknown>[]).map(mapProduct);
        }
      }
    } catch (err) {
      console.warn('DB products fetch failed, using local fallback:', err);
    }

    return [];
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      if (supabaseAdmin) {
        const { data, error } = await supabaseAdmin
          .from('products')
          .select('*')
          .eq('id', id)
          .eq('status', 'active')
          .maybeSingle();
        if (!error && data) {
          return mapProduct(data as Record<string, unknown>);
        }
      }
    } catch (err) {
      console.warn(`DB product fetch for ID ${id} failed, using local fallback:`, err);
    }

    return null;
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      if (supabaseAdmin) {
        let { data, error } = await supabaseAdmin
          .from('products')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'active')
          .maybeSingle();
        if (!error && data) {
          return mapProduct(data as Record<string, unknown>);
        }
        if (!error && !data) {
          ({ data, error } = await supabaseAdmin
            .from('products')
            .select('*')
            .eq('id', slug)
            .eq('status', 'active')
            .maybeSingle());
          if (!error && data) {
            return mapProduct(data as Record<string, unknown>);
          }
        }
      }
    } catch (err) {
      console.warn(`DB product fetch for slug ${slug} failed, using local fallback:`, err);
    }

    return null;
  },

  async getReviews(): Promise<Review[]> {
    try {
      if (supabaseAdmin) {
        const { data, error } = await supabaseAdmin
          .from('reviews')
          .select('*')
          .order('date', { ascending: false });
        if (!error && data && data.length > 0) {
          return (data as Record<string, unknown>[]).map(mapReview);
        }
      }
    } catch (err) {
      console.warn('DB reviews fetch failed, using local fallback:', err);
    }

    return [];
  },

  async getFAQs(category?: string): Promise<FAQ[]> {
    try {
      if (supabaseAdmin) {
        let query = supabaseAdmin.from('faqs').select('*').order('sort_order', { ascending: true });
        if (category) {
          query = query.eq('category', category);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return (data as Record<string, unknown>[]).map(mapFAQ);
        }
      }
    } catch (err) {
      console.warn('DB FAQs fetch failed, using local fallback:', err);
    }

    return [];
  },

  // ——— Категории (из Supabase) ———

  async getCategories(): Promise<Category[]> {
    try {
      if (supabaseAdmin) {
        const { data, error } = await supabaseAdmin
          .from('categories')
          .select('*')
          .eq('status', 'active')
          .order('sort_order', { ascending: true });
        if (!error && data && data.length > 0) {
          return (data as Record<string, unknown>[]).map(mapCategory);
        }
      }
    } catch (err) {
      console.warn('DB categories fetch failed, using local fallback:', err);
    }
    // Fallback — если БД недоступна, используем константу
    return CATEGORIES.filter(c => c.status === 'active');
  },

  async getCategoryTree(): Promise<Category[]> {
    const flat = await this.getCategories();
    return buildCategoryTree(flat);
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      if (supabaseAdmin) {
        const { data, error } = await supabaseAdmin
          .from('categories')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'active')
          .maybeSingle();
        if (!error && data) {
          const cat = mapCategory(data as Record<string, unknown>);

          // Get children
          const { data: children } = await supabaseAdmin
            .from('categories')
            .select('*')
            .eq('parent_id', cat.id)
            .eq('status', 'active')
            .order('sort_order', { ascending: true });
          if (children) {
            cat.children = (children as Record<string, unknown>[]).map(mapCategory);
          }

          return cat;
        }
      }
    } catch (err) {
      console.warn(`DB category fetch for slug ${slug} failed, using local fallback:`, err);
    }

    // Fallback — если БД недоступна
    const all = CATEGORIES.filter(c => c.status === 'active');
    const cat = all.find(c => c.slug === slug) ?? null;
    if (cat) {
      cat.children = all.filter(c => c.parentId === cat.id);
    }
    return cat;
  },

  async getProductsByCategory(categorySlug: string): Promise<Product[]> {
    try {
      if (supabaseAdmin) {
        // Find the category
        const { data: catData } = await supabaseAdmin
          .from('categories')
          .select('id')
          .eq('slug', categorySlug)
          .eq('status', 'active')
          .maybeSingle();

        if (catData) {
          // Level 1: direct children
          const { data: directChildren } = await supabaseAdmin
            .from('categories')
            .select('id')
            .eq('status', 'active')
            .eq('parent_id', catData.id);

          const level1Ids = directChildren?.map(c => c.id) || [];

          // Level 2: grandchildren (children of direct children)
          let level2Ids: string[] = [];
          if (level1Ids.length > 0) {
            const { data: grandchildren } = await supabaseAdmin
              .from('categories')
              .select('id')
              .eq('status', 'active')
              .in('parent_id', level1Ids);
            level2Ids = grandchildren?.map(c => c.id) || [];
          }

          // Combine all: self + children + grandchildren
          const catIds = [catData.id, ...level1Ids, ...level2Ids];

          const { data, error } = await supabaseAdmin
            .from('products')
            .select('*')
            .eq('status', 'active')
            .in('category_id', catIds);
          if (!error && data && data.length > 0) {
            return (data as Record<string, unknown>[]).map(mapProduct);
          }
        }
      }
    } catch (err) {
      console.warn(`DB products by category fetch for ${categorySlug} failed, using local fallback:`, err);
    }

    return [];
  },

  async getRitualSteps() {
    return RITUAL_STEPS;
  },

  async getBenefits(): Promise<Benefit[]> {
    return BENEFITS_LIST;
  },
};
