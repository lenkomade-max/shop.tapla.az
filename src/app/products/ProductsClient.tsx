'use client';

import React, { useState } from 'react';
import { ProductCard } from '@/components/cards/ProductCard';
import { Container } from '@/components/ui/Container';
import { clsx } from 'clsx';
import { Product } from '@/types';

// Карта: старые category names → новые root slugs (для демо-товаров)
const CATEGORY_NAME_MAP: Record<string, string> = {
  'Notebook / Ultrabook': 'elektronika',
  'Smartfon / Planşet': 'telefonlar-ve-plansetler',
  'Aksesuar / Qadjet': 'aqilli-saat-ve-gadget',
  'Planşet': 'telefonlar-ve-plansetler',
};

const CATEGORIES = [
  { label: 'HAMSINI GÖSTƏR', value: 'all' },
  { label: 'QULAQLIQ & AUDIO', value: 'qulaqliq-ve-audio' },
  { label: 'TELEFON & PLANŞET', value: 'telefonlar-ve-plansetler' },
  { label: 'MƏİŞƏT TEXNİKASI', value: 'kicik-meiset-texnikasi' },
  { label: 'SAAT & GADGET', value: 'aqilli-saat-ve-gadget' },
  { label: 'ELEKTRONIKA', value: 'elektronika' },
];

const TAB_COLOR_CLASSES: Record<string, { active: string; inactive: string }> = {
  'qulaqliq-ve-audio': {
    active: 'text-emerald-600 font-bold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-emerald-600',
    inactive: 'text-emerald-600',
  },
  'telefonlar-ve-plansetler': {
    active: 'text-blue-600 font-bold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-blue-600',
    inactive: 'text-blue-600',
  },
  'kicik-meiset-texnikasi': {
    active: 'text-amber-600 font-bold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-amber-500',
    inactive: 'text-amber-600',
  },
  'aqilli-saat-ve-gadget': {
    active: 'text-violet-600 font-bold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-violet-600',
    inactive: 'text-violet-600',
  },
  'elektronika': {
    active: 'text-rose-600 font-bold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-rose-600',
    inactive: 'text-rose-600',
  },
};

function getProductCategoryValue(product: Product): string {
  const mapped = CATEGORY_NAME_MAP[product.category];
  return mapped || '';
}

interface ProductsClientProps {
  products: Product[];
}

export function ProductsClient({ products }: ProductsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => getProductCategoryValue(p) === selectedCategory);

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

        {/* Category Filter Tabs — premium rəngli */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mb-8 border-b border-neutral-100 pb-4">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.value;
            const colors = TAB_COLOR_CLASSES[cat.value];
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={clsx(
                  'text-[10px] sm:text-xs tracking-widest font-semibold uppercase relative py-2 transition-colors cursor-pointer',
                  cat.value === 'all'
                    ? (isActive
                        ? 'text-neutral-950 font-bold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-neutral-950'
                        : 'text-neutral-400 hover:text-neutral-950')
                    : (isActive ? colors.active : colors.inactive),
                )}
              >
                {cat.label}
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
