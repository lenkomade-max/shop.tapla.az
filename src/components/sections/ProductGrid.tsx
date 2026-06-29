'use client';

import React, { useState, useEffect } from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { ProductCard } from '@/components/cards/ProductCard';
import { Product, Shade } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { useCart } from '@/store/CartContext';
import { Star, CheckCircle, ShoppingBag, Minimize2, ZoomIn, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { clsx } from 'clsx';
import Link from 'next/link';

interface ProductGridProps {
  products: Product[];
}

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

function getProductCategoryValue(product: Product): string {
  const mapped = CATEGORY_NAME_MAP[product.category];
  return mapped || '';
}

export function ProductGrid({ products }: ProductGridProps) {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedShade, setSelectedShade] = useState<Shade | undefined>(undefined);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);

  useEffect(() => {
    const savedScroll = sessionStorage.getItem('tapla_scroll');
    if (savedScroll) {
      sessionStorage.removeItem('tapla_scroll');
      requestAnimationFrame(() => window.scrollTo(0, Number(savedScroll)));
    }
  }, []);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => getProductCategoryValue(p) === selectedCategory);

  const handleOpenQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setActiveImageIndex(0);
    setPurchaseQuantity(1);
    setSelectedShade(product.shades && product.shades.length > 0 ? product.shades[0] : undefined);
  };

  const handleCloseQuickView = () => {
    setQuickViewProduct(null);
  };

  const handleAddToCartQuick = () => {
    if (quickViewProduct) {
      addToCart(quickViewProduct, selectedShade, purchaseQuantity);
      setQuickViewProduct(null);
    }
  };

  return (
    <Section id="products" variant="neutral" py="lg">
      <Container className="!px-1 sm:!px-1">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <span className="text-[10px] tracking-[0.25em] font-bold text-neutral-400 uppercase">
            TAPLA MARKETPLACE
          </span>
          <Heading level={2} align="center" className="font-serif">
            MƏHSUL KATEQORİYALARIMIZ
          </Heading>
          <p className="text-xs sm:text-sm text-neutral-500 font-sans max-w-lg mx-auto leading-relaxed">
            Elektronika dünyasının ən sevilən məhsulları ilə tanış olun və ehtiyacınıza uyğun olanı seçin.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mb-8 sm:mb-12 border-b border-neutral-100 pb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={clsx(
                'text-[10px] sm:text-xs tracking-widest font-semibold uppercase relative py-2 transition-colors cursor-pointer',
                selectedCategory === cat.value
                  ? 'text-neutral-950 font-bold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-neutral-950'
                  : 'text-neutral-400 hover:text-neutral-950'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Link to all category pages */}
        <div className="text-center mb-10">
          <Link
            href="/products"
            className="text-[10px] tracking-widest font-semibold uppercase underline underline-offset-4 text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Bütün kateqoriyalara bax
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-px">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={handleOpenQuickView}
            />
          ))}
        </div>

        {/* QUICK VIEW OVERLAY MODAL */}
        <Modal
          isOpen={!!quickViewProduct}
          onClose={handleCloseQuickView}
          size="3xl"
        >
          {quickViewProduct && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start font-sans">
              {/* Product Gallery (Left) */}
              <div className="md:col-span-6 space-y-3">
                <div className="relative aspect-[4/5] bg-neutral-50 border border-neutral-100 overflow-hidden">
                  <Image
                    src={quickViewProduct.images[activeImageIndex] || quickViewProduct.images[0]}
                    alt={quickViewProduct.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[9px] px-2 py-1 tracking-widest uppercase font-mono">
                    {activeImageIndex + 1} / {quickViewProduct.images.length}
                  </div>
                </div>

                {/* Micro thumbnails row */}
                {quickViewProduct.images.length > 1 && (
                  <div className="flex items-center space-x-2">
                    {quickViewProduct.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={clsx(
                          'relative h-16 w-14 bg-neutral-50 border transition-all cursor-pointer',
                          activeImageIndex === idx ? 'border-neutral-900 scale-105' : 'border-neutral-200'
                        )}
                      >
                        <Image
                          src={img}
                          alt={`${quickViewProduct.name} thumbnail ${idx}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Core parameters (Right) */}
              <div className="md:col-span-6 flex flex-col justify-between h-full space-y-5">
                <div>
                  <span className="text-[10px] tracking-widest text-neutral-400 uppercase font-bold block mb-1">
                    KOLLEKSİYA / {quickViewProduct.category.toUpperCase()}
                  </span>
                  
                  {/* Title heading */}
                  <h3 className="text-xl font-bold tracking-widest text-neutral-900 uppercase font-serif mb-1">
                    {quickViewProduct.name}
                  </h3>
                  <p className="text-xs text-neutral-500 font-medium mb-3.5 leading-relaxed">
                    {quickViewProduct.subtitle}
                  </p>

                  {/* Rating snapshot */}
                  <div className="flex items-center space-x-1.5 mb-5 pb-4 border-b border-neutral-100">
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={clsx(
                            'h-3.5 w-3.5 fill-current',
                            i < Math.floor(quickViewProduct.rating) ? 'text-amber-400' : 'text-neutral-200'
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-neutral-500 font-mono">
                      {quickViewProduct.rating.toFixed(1)} ({quickViewProduct.reviewsCount} müştəri rəyi)
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-neutral-600 leading-relaxed font-sans mb-3 line-clamp-4">
                    {quickViewProduct.description}
                  </p>

                  {/* Ideal for */}
                  {quickViewProduct.idealFor && (
                    <div className="mb-4">
                      <span className="text-[10px] tracking-widest uppercase font-bold text-neutral-500 block mb-1">
                        KIMLƏR ÜÇÜN
                      </span>
                      <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                        {quickViewProduct.idealFor}
                      </p>
                    </div>
                  )}

                  {/* Shade selectors */}
                  {quickViewProduct.shades && quickViewProduct.shades.length > 0 && (
                    <div className="mb-5">
                      <span className="text-[10px] tracking-widest uppercase font-semibold text-neutral-400 block mb-2">
                        RƏNG SEÇİMİ: <span className="text-neutral-900">{selectedShade?.name}</span>
                      </span>
                      <div className="flex items-center space-x-2">
                        {quickViewProduct.shades.map((shade) => (
                          <button
                            key={shade.name}
                            onClick={() => setSelectedShade(shade)}
                            className={clsx(
                              'w-5 h-5 rounded-full border transition-all relative cursor-pointer',
                              selectedShade?.name === shade.name
                                ? 'border-neutral-900 scale-110'
                                : 'border-neutral-200 hover:scale-105'
                            )}
                            style={{ backgroundColor: shade.colorHex }}
                          >
                            {selectedShade?.name === shade.name && (
                              <span className="absolute inset-0.5 rounded-full border border-white" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price info */}
                  <div className="flex items-baseline space-x-3 mb-5">
                    <span className="text-lg font-bold font-mono text-neutral-900">
                      {quickViewProduct.price.toFixed(2)} ₼
                    </span>
                    {quickViewProduct.originalPrice && (
                      <span className="text-xs text-neutral-400 line-through font-mono">
                        {quickViewProduct.originalPrice.toFixed(2)} ₼
                      </span>
                    )}
                  </div>

                  {/* Features highlights */}
                  <div className="bg-neutral-50 p-4 border border-neutral-100 mb-5 space-y-2">
                    <span className="text-[10px] tracking-widest font-semibold text-neutral-400 uppercase block mb-1">
                      ÖZƏL FAYDALARI:
                    </span>
                    {quickViewProduct.benefits.map((b, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-[11px] text-neutral-600">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>

                  {/* Features */}
                  {quickViewProduct.features && quickViewProduct.features.length > 0 && (
                    <div className="mb-4">
                      <span className="text-[10px] tracking-widest font-semibold text-neutral-400 uppercase block mb-2">
                        XÜSUSİYYƏTLƏR
                      </span>
                      <ul className="space-y-1">
                        {quickViewProduct.features.map((f, i) => (
                          <li key={i} className="flex items-start space-x-2 text-[11px] text-neutral-600">
                            <span className="text-neutral-950 font-bold mt-0.5">•</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* How to use */}
                  {quickViewProduct.howToUse && (
                    <div className="mb-4">
                      <span className="text-[10px] tracking-widest font-semibold text-neutral-400 uppercase block mb-2">
                        İSTİFADƏ QAYDASI
                      </span>
                      <p className="text-xs text-neutral-600 leading-relaxed whitespace-pre-line">{quickViewProduct.howToUse}</p>
                      {quickViewProduct.useCases && quickViewProduct.useCases.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-[9px] font-bold tracking-widest uppercase text-neutral-700 mb-1">ISTIFADE SSENARILERI</h4>
                          <ul className="space-y-1">
                            {quickViewProduct.useCases.map((u, i) => (
                              <li key={i} className="flex items-start space-x-2 text-[11px] text-neutral-600">
                                <span className="text-neutral-950 font-bold mt-0.5">•</span>
                                <span>{u}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {quickViewProduct.careInstructions && (
                        <div className="mt-3">
                          <h4 className="text-[9px] font-bold tracking-widest uppercase text-neutral-700 mb-1">QULLUQ TƏLİMATI</h4>
                          <p className="text-xs text-neutral-600 leading-relaxed whitespace-pre-line">{quickViewProduct.careInstructions}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Ingredients / Material */}
                  {quickViewProduct.ingredients && (
                    <div className="mb-4">
                      <span className="text-[10px] tracking-widest font-semibold text-neutral-400 uppercase block mb-2">
                        MATERİAL / SERTİFİKAT
                      </span>
                      <p className="text-xs text-neutral-600 leading-relaxed whitespace-pre-line">{quickViewProduct.ingredients}</p>
                    </div>
                  )}

                  {/* FAQ */}
                  {quickViewProduct.faq && quickViewProduct.faq.length > 0 && (
                    <div className="mb-5 space-y-2">
                      <span className="text-[10px] tracking-widest font-semibold text-neutral-400 uppercase block">
                        TEZ-TEZ VERILƏN SUALLAR
                      </span>
                      <div className="space-y-1">
                        {quickViewProduct.faq.slice(0, 3).map((item, i) => (
                          <details key={i} className="group border border-neutral-100 bg-white">
                            <summary className="flex items-center justify-between px-3 py-2 text-[11px] font-medium text-neutral-800 cursor-pointer list-none hover:bg-neutral-50 transition-colors">
                              {item.question}
                              <ChevronRight className="h-2.5 w-2.5 text-neutral-400 group-open:rotate-90 transition-transform shrink-0 ml-2" />
                            </summary>
                            <div className="px-3 pb-2 text-[10px] text-neutral-500 leading-relaxed border-t border-neutral-100 pt-2">
                              {item.answer}
                            </div>
                          </details>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Quantity and Cart Submit */}
                <div className="flex items-center space-x-3">
                  {/* Quantity */}
                  <div className="flex items-center border border-neutral-200 h-12">
                    <button
                      onClick={() => setPurchaseQuantity(q => Math.max(1, q - 1))}
                      className="px-3 h-full hover:bg-neutral-50 text-neutral-500 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-4 font-mono font-semibold text-neutral-800 text-xs">
                      {purchaseQuantity}
                    </span>
                    <button
                      onClick={() => setPurchaseQuantity(q => q + 1)}
                      className="px-3 h-full hover:bg-neutral-50 text-neutral-500 cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* Add action */}
                  <button
                    onClick={handleAddToCartQuick}
                    className="flex-1 bg-neutral-950 text-white h-12 text-[10px] tracking-widest font-semibold uppercase hover:bg-neutral-800 transition-colors flex items-center justify-center space-x-2.5 cursor-pointer"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>SƏBƏTƏ ƏLAVƏ ET</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </Container>
    </Section>
  );
}
