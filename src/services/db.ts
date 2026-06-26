import { supabase } from '@/lib/supabase/client';
import { PRODUCTS, REVIEWS, FAQS, RITUAL_STEPS, BENEFITS_LIST } from '@/constants/data';
import { Product, Review, FAQ, Benefit } from '@/types';

function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: (row.name as string) || (row.title as string) || '',
    subtitle: (row.subtitle as string) || '',
    description: (row.description as string) || '',
    price: Number(row.price) || 0,
    originalPrice: row.old_price != null ? Number(row.old_price) : undefined,
    rating: Number(row.rating) || 0,
    reviewsCount: Number(row.reviews_count) || 0,
    images: Array.isArray(row.images) ? row.images as string[] : [],
    category: (row.category as string) || '',
    benefits: Array.isArray(row.benefits) ? row.benefits as string[] : [],
    howToUse: (row.how_to_use as string) || '',
    ingredients: row.ingredients as string | undefined,
    tags: Array.isArray(row.tags) ? row.tags as string[] : undefined,
    shades: Array.isArray(row.shades) ? row.shades as { name: string; colorHex: string; isHot?: boolean; label?: string }[] : undefined,
    isNew: Boolean(row.is_new) || undefined,
    tryOnEnabled: Boolean(row.try_on_enabled) || undefined,
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
    ageRange: row.age_range as string | undefined,
    skinType: row.skin_type as string | undefined,
    skinTone: row.skin_tone as string | undefined,
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

export const dbService = {
  async getProducts(category?: string): Promise<Product[]> {
    try {
      if (supabase) {
        let query = supabase.from('products').select('*');
        if (category) {
          query = query.eq('category', category);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return (data as Record<string, unknown>[]).map(mapProduct);
        }
      }
    } catch (err) {
      console.warn('Supabase products fetch failed, using local fallback:', err);
    }

    if (category) {
      return PRODUCTS.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
    }
    return PRODUCTS;
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        if (!error && data) {
          return mapProduct(data as Record<string, unknown>);
        }
      }
    } catch (err) {
      console.warn(`Supabase product fetch for ID ${id} failed, using local fallback:`, err);
    }

    return PRODUCTS.find(p => p.id === id) || null;
  },

  async getReviews(): Promise<Review[]> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .order('date', { ascending: false });
        if (!error && data && data.length > 0) {
          return (data as Record<string, unknown>[]).map(mapReview);
        }
      }
    } catch (err) {
      console.warn('Supabase reviews fetch failed, using local fallback:', err);
    }

    return REVIEWS;
  },

  async getFAQs(category?: string): Promise<FAQ[]> {
    try {
      if (supabase) {
        let query = supabase.from('faqs').select('*').order('sort_order', { ascending: true });
        if (category) {
          query = query.eq('category', category);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return (data as Record<string, unknown>[]).map(mapFAQ);
        }
      }
    } catch (err) {
      console.warn('Supabase FAQs fetch failed, using local fallback:', err);
    }

    if (category) {
      return FAQS.filter(f => f.category.toLowerCase() === category.toLowerCase());
    }
    return FAQS;
  },

  async getRitualSteps() {
    return RITUAL_STEPS;
  },

  async getBenefits(): Promise<Benefit[]> {
    return BENEFITS_LIST;
  },
};
