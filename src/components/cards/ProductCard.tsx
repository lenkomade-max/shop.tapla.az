'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import type { Product, Shade } from '@/types';
import { useCart } from '@/store/CartContext';
import { Badge } from '@/components/ui/Badge';
import { clsx } from 'clsx';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart } = useCart();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedShade, setSelectedShade] = useState<Shade | undefined>(
    product.shades && product.shades.length > 0 ? product.shades[0] : undefined
  );
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedShade);
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative flex flex-col bg-white rounded-xl hover:shadow-xl transition-all duration-500 overflow-hidden"
      onMouseEnter={() => {
        setIsHovered(true);
        if (product.images.length > 1) {
          setActiveImageIndex(1);
        }
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setActiveImageIndex(0);
      }}
    >
      <div className="absolute top-2 left-2 z-10 flex flex-col space-y-1">
        {product.isNew && <Badge variant="solid">YENİ</Badge>}
        {hasDiscount && (
          <Badge variant="accent">ENDİRİM</Badge>
        )}
      </div>

      <div className="relative w-full aspect-[4/5] bg-neutral-50 overflow-hidden rounded-t-xl">
        <Link href={`/products/${product.slug}`} className="block w-full h-full relative">
          <Image
            src={product.images[activeImageIndex] || product.images[0]}
            alt={product.name}
            fill
            sizes="(max-w-7xl): 16vw, (max-w-md): 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            priority={product.id === 'macbook-air-m3'}
          />
        </Link>

        {/* Quick view: always visible on mobile, on hover on desktop */}
        <div className="md:hidden absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/40 to-transparent flex items-end justify-center pb-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView?.(product);
            }}
            className="bg-white/95 text-neutral-900 text-[10px] tracking-widest font-semibold uppercase px-3 py-2 rounded-md hover:bg-neutral-950 hover:text-white transition-colors duration-300 pointer-events-auto cursor-pointer"
          >
            SÜRƏTLİ BAXIŞ
          </button>
        </div>
        <div className="hidden md:flex absolute inset-0 z-10 pointer-events-none bg-neutral-950/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 items-end justify-center pb-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView?.(product);
            }}
            className="bg-white/95 text-neutral-900 text-[10px] tracking-widest font-semibold uppercase px-4 py-2.5 hover:bg-neutral-950 hover:text-white transition-colors duration-300 pointer-events-auto cursor-pointer"
          >
            SÜRƏTLİ BAXIŞ
          </button>
        </div>
      </div>

      <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between">
        <div>
          {/* Price + Stars row */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-baseline gap-1.5 min-w-0 shrink-0">
              <span
                className={clsx(
                  'text-base sm:text-xl font-bold tracking-tight whitespace-nowrap',
                  hasDiscount ? 'text-blue-600' : 'text-neutral-900'
                )}
              >
                {product.price.toFixed(2)} ₼
              </span>
              {hasDiscount && (
                <span className="text-xs sm:text-sm text-neutral-400 line-through shrink-0">
                  {product.originalPrice!.toFixed(2)} ₼
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={clsx(
                      'h-2.5 w-2.5 sm:h-3 sm:w-3 fill-current',
                      i < Math.floor(product.rating) ? 'text-amber-400' : 'text-neutral-200'
                    )}
                  />
                ))}
              </div>
              <span className="text-[10px] font-medium text-neutral-500 font-[family-name:var(--font-inter)]">
                ({product.reviewsCount})
              </span>
            </div>
          </div>

          <Link href={`/products/${product.slug}`} className="block group/title">
            <h4 className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-neutral-900 mb-0.5 hover:text-neutral-600 transition-colors line-clamp-3">
              {product.name}
            </h4>
          </Link>
          <p className="text-[11px] text-neutral-400 font-[family-name:var(--font-inter)] line-clamp-1 mb-2">
            {product.subtitle}
          </p>

          {product.shades && product.shades.length > 0 && (
            <div className="mb-3">
              <span className="text-[9px] tracking-widest uppercase font-semibold text-neutral-400 block mb-1 font-[family-name:var(--font-inter)]">
                RƏNG SEÇİMİ: {selectedShade?.name}
              </span>
              <div className="flex items-center space-x-1.5">
                {product.shades.map((shade) => (
                  <button
                    key={shade.name}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedShade(shade);
                    }}
                    className={clsx(
                      'w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border transition-all duration-300 relative cursor-pointer',
                      selectedShade?.name === shade.name
                        ? 'border-neutral-900 scale-110'
                        : 'border-neutral-200 hover:scale-105'
                    )}
                    style={{ backgroundColor: shade.colorHex }}
                    title={shade.name}
                  >
                    {selectedShade?.name === shade.name && (
                      <span className="absolute inset-0.5 rounded-full border border-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full bg-neutral-950 text-white text-[10px] tracking-widest font-semibold uppercase py-2.5 rounded-lg hover:bg-neutral-800 transition-colors duration-300 cursor-pointer"
        >
          SƏBƏTƏ ƏLAVƏ ET
        </button>
      </div>
    </div>
  );
}
