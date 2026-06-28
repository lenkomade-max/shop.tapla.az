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
      <div className="absolute top-3 left-3 z-10 flex flex-col space-y-1">
        {product.isNew && <Badge variant="solid">YENİ</Badge>}
        {product.originalPrice && product.originalPrice > product.price && (
          <Badge variant="accent">ENDİRİM</Badge>
        )}
      </div>

      <div className="relative w-full aspect-[4/5] bg-neutral-50 overflow-hidden rounded-t-xl">
        <Link href={`/products/${product.slug}`} className="block w-full h-full relative">
          <Image
            src={product.images[activeImageIndex] || product.images[0]}
            alt={product.name}
            fill
            sizes="(max-w-7xl): 33vw, (max-w-md): 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            priority={product.id === 'macbook-air-m3'}
          />
        </Link>

        <div className="absolute inset-0 bg-neutral-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 pointer-events-none">
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

      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-1 mb-2">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={clsx(
                    'h-3 w-3 fill-current',
                    i < Math.floor(product.rating) ? 'text-amber-400' : 'text-neutral-200'
                  )}
                />
              ))}
            </div>
            <span className="text-[10px] font-medium text-neutral-500 font-mono">
              ({product.reviewsCount})
            </span>
          </div>

          <Link href={`/products/${product.slug}`} className="block group/title">
            <h4 className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-neutral-900 mb-1 hover:text-neutral-600 transition-colors">
              {product.name}
            </h4>
          </Link>
          <p className="text-[11px] text-neutral-500 font-sans line-clamp-1 mb-3">
            {product.subtitle}
          </p>

          {product.shades && product.shades.length > 0 && (
            <div className="mb-4">
              <span className="text-[9px] tracking-widest uppercase font-semibold text-neutral-400 block mb-1.5">
                RƏNG SEÇİMİ: {selectedShade?.name}
              </span>
              <div className="flex items-center space-x-2">
                {product.shades.map((shade) => (
                  <button
                    key={shade.name}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedShade(shade);
                    }}
                    className={clsx(
                      'w-4 h-4 rounded-full border transition-all duration-300 relative cursor-pointer',
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

        <div>
          <div className="flex items-baseline space-x-2 mb-4">
            <span className="text-xs sm:text-sm font-semibold text-neutral-900 font-mono">
              {product.price.toFixed(2)} ₼
            </span>
            {product.originalPrice && (
              <span className="text-[10px] sm:text-xs text-neutral-400 line-through font-mono">
                {product.originalPrice.toFixed(2)} ₼
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-neutral-950 text-white text-[10px] tracking-widest font-semibold uppercase py-3 border border-neutral-950 hover:bg-transparent hover:text-neutral-900 transition-colors duration-300 cursor-pointer"
          >
            SƏBƏTƏ ƏLAVƏ ET
          </button>
        </div>
      </div>
    </div>
  );
}
