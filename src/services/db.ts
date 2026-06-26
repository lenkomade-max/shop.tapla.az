import { supabase } from '@/lib/supabase/client';
import { PRODUCTS, REVIEWS, FAQS, RITUAL_STEPS, BENEFITS_LIST } from '@/constants/data';
import { Product, Review, FAQ, Benefit } from '@/types';

export const dbService = {
  /**
   * Fetches all products from Supabase if connected, otherwise falls back to static Azerbaijani dataset.
   */
  async getProducts(category?: string): Promise<Product[]> {
    try {
      if (supabase) {
        let query = supabase.from('products').select('*');
        if (category) {
          query = query.eq('category', category);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data as Product[];
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

  /**
   * Fetches a single product by ID.
   */
  async getProductById(id: string): Promise<Product | null> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        if (!error && data) {
          return data as Product;
        }
      }
    } catch (err) {
      console.warn(`Supabase product fetch for ID ${id} failed, using local fallback:`, err);
    }
    
    return PRODUCTS.find(p => p.id === id) || null;
  },

  /**
   * Fetches all reviews.
   */
  async getReviews(): Promise<Review[]> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .order('date', { ascending: false });
        if (!error && data && data.length > 0) {
          return data as Review[];
        }
      }
    } catch (err) {
      console.warn('Supabase reviews fetch failed, using local fallback:', err);
    }
    
    return REVIEWS;
  },

  /**
   * Fetches all FAQ items.
   */
  async getFAQs(category?: string): Promise<FAQ[]> {
    try {
      if (supabase) {
        let query = supabase.from('faqs').select('*');
        if (category) {
          query = query.eq('category', category);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data as FAQ[];
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

  /**
   * Fetches evening ritual steps.
   */
  async getRitualSteps() {
    return RITUAL_STEPS;
  },

  /**
   * Fetches value props / benefits.
   */
  async getBenefits(): Promise<Benefit[]> {
    return BENEFITS_LIST;
  }
};
