'use client';

import React, { useState, useMemo } from 'react';
import { ProductCard } from '@/components/cards/ProductCard';
import { Container } from '@/components/ui/Container';
import { clsx } from 'clsx';
import { Product, Category } from '@/types';
import { getCategoryTabColors } from '@/lib/category-colors';

interface ProductsClientProps {
  products: Product[];
  categories: Category[];
}

export function ProductsClient({ products, categories }: ProductsClientProps) {
  const [selectedCategorySlug, setSelectedCategorySlug] = useState('all');

  const rootCategories = useMemo(() =>
    categories
      .filter(c => !c.parentId && c.status === 'active')
      .sort((a, b) => a.sortOrder - b.sortOrder),
    [categories]
  );

  // parentId → childIds for filtering
  const childrenMap = useMemo(() => {
    const map = new Map<string, string[]>();
    categories.forEach(c => {
      if (c.parentId) {
        if (!map.has(c.parentId)) map.set(c.parentId, []);
        map.get(c.parentId)!.push(c.id);
      }
    });
    return map;
  }, [categories]);

  const getAllDescendantIds = (catId: string): Set<string> => {
    const ids = new Set<string>([catId]);
    const children = childrenMap.get(catId) || [];
    for (const childId of children) {
      for (const id of getAllDescendantIds(childId)) {
        ids.add(id);
      }
    }
    return ids;
  };

  const filteredProducts = selectedCategorySlug === 'all'
    ? products
    : products.filter(p => {
        const rootCat = rootCategories.find(c => c.slug === selectedCategorySlug);
        if (!rootCat || !p.categoryId) return false;
        return getAllDescendantIds(rootCat.id).has(p.categoryId);
      });

  return (
    <div className="min-h-screen bg-neutral-50">
      <Container className="!px-1 sm:!px-1">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 pt-16 pb-2">
          <span className="text-[10px] tracking-[0.25em] font-bold text-neutral-400 uppercase">
            TAPLA MARKETPLACE
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-wide">
            MƏHSULLAR
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-sans max-w-lg mx-auto leading-relaxed">
            Bütün kateqoriyalar üzrə məhsullarımızı kəşf edin.
          </p>
        </div>

        {/* Category Filter Tabs — dynamic from DB, premium colors */}
        {rootCategories.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mb-8 border-b border-neutral-100 pb-4">
            <button
              onClick={() => setSelectedCategorySlug('all')}
              className={clsx(
                'text-[10px] sm:text-xs tracking-widest font-semibold uppercase relative py-2 transition-colors cursor-pointer',
                selectedCategorySlug === 'all'
                  ? 'text-neutral-950 font-bold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-neutral-950'
                  : 'text-neutral-400 hover:text-neutral-950'
              )}
            >
              HAMSINI GÖSTƏR
            </button>
            {rootCategories.map(cat => {
              const isActive = selectedCategorySlug === cat.slug;
              const colors = getCategoryTabColors(cat.slug);
              return (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategorySlug(cat.slug)}
                  className={clsx(
                    'text-[10px] sm:text-xs tracking-widest font-semibold uppercase relative py-2 transition-colors cursor-pointer',
                    isActive ? colors.active : colors.inactive
                  )}
                >
                  {cat.title}
                </button>
              );
            })}
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-xs text-neutral-400">
            Bu kateqoriyada heç bir məhsul tapılmadı.
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-px pb-16">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
