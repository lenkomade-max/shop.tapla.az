'use client';

import React, { useState, useEffect } from 'react';
import { ProductCard } from '@/components/cards/ProductCard';
import { Container } from '@/components/ui/Container';
import { clsx } from 'clsx';
import { Product, Category } from '@/types';

// Цвета для табов (циклично)
const TAB_COLORS = [
  { active: 'text-emerald-600 after:bg-emerald-600', inactive: 'text-emerald-600' },
  { active: 'text-blue-600 after:bg-blue-600', inactive: 'text-blue-600' },
  { active: 'text-amber-600 after:bg-amber-500', inactive: 'text-amber-600' },
  { active: 'text-violet-600 after:bg-violet-600', inactive: 'text-violet-600' },
  { active: 'text-rose-600 after:bg-rose-600', inactive: 'text-rose-600' },
  { active: 'text-cyan-600 after:bg-cyan-600', inactive: 'text-cyan-600' },
  { active: 'text-orange-600 after:bg-orange-600', inactive: 'text-orange-600' },
  { active: 'text-lime-600 after:bg-lime-600', inactive: 'text-lime-600' },
];

interface CategoryTab {
  label: string;
  value: string;
  colorIndex: number;
}

function buildTabsAndMaps(cats: Category[]): {
  tabs: CategoryTab[];
  slugById: Map<string, string>;
  slugByName: Map<string, string>;
} {
  const tabs: CategoryTab[] = [{ label: 'HAMSINI GÖSTƏR', value: 'all', colorIndex: -1 }];
  const slugById = new Map<string, string>();
  const slugByName = new Map<string, string>();
  let colorIdx = 0;

  function walk(list: Category[]) {
    for (const cat of list) {
      slugById.set(cat.id, cat.slug);
      slugByName.set(cat.title.toLowerCase(), cat.slug);
      if (!cat.parentId) {
        tabs.push({ label: cat.title.toUpperCase(), value: cat.slug, colorIndex: colorIdx++ });
      }
      if (cat.children) walk(cat.children);
    }
  }
  walk(cats);
  return { tabs, slugById, slugByName };
}

interface ProductsClientProps {
  products: Product[];
}

export function ProductsClient({ products }: ProductsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Динамическая загрузка категорий из БД
  const [tabs, setTabs] = useState<CategoryTab[]>([]);
  const [slugById, setSlugById] = useState<Map<string, string>>(new Map());
  const [slugByName, setSlugByName] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    import('@/services/db').then(({ dbService }) => {
      dbService.getCategoryTree().then((cats) => {
        const { tabs: loaded, slugById: byId, slugByName: byName } = buildTabsAndMaps(cats);
        setTabs(loaded);
        setSlugById(byId);
        setSlugByName(byName);
      });
    });
  }, []);

  const getProductCategorySlug = (product: Product): string => {
    if (product.categoryId && slugById.has(product.categoryId)) {
      return slugById.get(product.categoryId)!;
    }
    if (product.category && slugByName.has(product.category.toLowerCase())) {
      return slugByName.get(product.category.toLowerCase())!;
    }
    return '';
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => getProductCategorySlug(p) === selectedCategory);

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

        {/* Category Filter Tabs — динамические из БД, premium rəngli */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mb-8 border-b border-neutral-100 pb-4">
          {tabs.map((tab) => {
            const isActive = selectedCategory === tab.value;
            const isAll = tab.value === 'all';
            const color = TAB_COLORS[tab.colorIndex % TAB_COLORS.length];

            const activeClass = isAll
              ? 'text-neutral-950 font-bold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-neutral-950'
              : `font-bold ${color.active} after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full`;

            const inactiveClass = isAll
              ? 'text-neutral-400 hover:text-neutral-950'
              : color.inactive;

            return (
              <button
                key={tab.value}
                onClick={() => setSelectedCategory(tab.value)}
                className={clsx(
                  'text-[10px] sm:text-xs tracking-widest font-semibold uppercase relative py-2 transition-all duration-300 cursor-pointer',
                  isActive ? activeClass : inactiveClass,
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

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
