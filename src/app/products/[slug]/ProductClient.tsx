'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Star, 
  ChevronRight, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Sparkles, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Check, 
  Info,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, Shade } from '@/types';
import { useCart } from '@/store/CartContext';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { ProductCard } from '@/components/cards/ProductCard';

interface ProductClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductClient({ product, relatedProducts }: ProductClientProps) {
  const { addToCart } = useCart();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedShade, setSelectedShade] = useState<Shade | undefined>(
    product.shades && product.shades.length > 0 ? product.shades[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'benefits' | 'features' | 'howToUse' | 'ingredients'>('benefits');
  const [isAdded, setIsAdded] = useState(false);

  // Interactive LED simulator state
  const [simColor, setSimColor] = useState<'red' | 'blue' | 'green' | 'yellow' | null>(null);
  const [showSimulator, setShowSimulator] = useState(false);

  const handleQuantityChange = (val: number) => {
    if (val >= 1 && val <= 10) {
      setQuantity(val);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedShade);
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const ledDetails = {
    red: { name: 'Qırmızı İşıq (630nm)', action: 'Kollagen artımı, qırışların azaldılması və dəri bərpası.', bg: 'bg-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.6)]' },
    blue: { name: 'Göy İşıq (415nm)', action: 'Akne müalicəsi, antibakterial təsir və sebum nəzarəti.', bg: 'bg-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.6)]' },
    green: { name: 'Yaşıl İşıq (525nm)', action: 'Ləkələrin açılması, rəng tonu bərabərliyi və limfa drenajı.', bg: 'bg-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.6)]' },
    yellow: { name: 'Sarı İşıq (590nm)', action: 'Qızartıların aradan qaldırılması, həssas dərinin sakitləşdirilməsi.', bg: 'bg-amber-400/20 shadow-[0_0_40px_rgba(251,191,36,0.6)]' },
  };

  return (
    <div className="pt-28 pb-20 bg-[#FAF9F6] text-neutral-900 font-sans min-h-screen">
      <Container>
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-[11px] tracking-widest text-neutral-400 uppercase mb-8">
          <Link href="/" className="hover:text-neutral-900 transition-colors">Ana səhifə</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/#products" className="hover:text-neutral-900 transition-colors">Məhsullar</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-neutral-600 font-medium">{product.name}</span>
        </div>

        {/* Product Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Image Gallery & Simulator */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-neutral-100 p-2 relative aspect-[4/5] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={product.images[activeImageIndex] || product.images[0]}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-w-7xl): 50vw, 100vw"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Dynamic Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col space-y-1">
                {product.isNew && <Badge variant="solid">YENİ MƏHSUL</Badge>}
                {product.originalPrice && product.originalPrice > product.price && (
                  <Badge variant="accent">ÖZƏL ENDİRİM</Badge>
                )}
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`relative aspect-[4/5] border bg-white overflow-hidden cursor-pointer transition-all ${
                      activeImageIndex === i ? 'border-neutral-900 ring-1 ring-neutral-900' : 'border-neutral-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Interactive Try-On Simulator Block */}
            {product.tryOnEnabled && (
              <div className="border border-neutral-200/60 bg-white p-6 rounded-xl space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 text-neutral-800 animate-pulse" />
                    <h3 className="text-xs font-bold tracking-widest uppercase">INTERAKTİV LED GÖSTERİCİ</h3>
                  </div>
                  <button 
                    onClick={() => setShowSimulator(!showSimulator)}
                    className="text-[10px] tracking-widest font-bold uppercase underline cursor-pointer hover:text-neutral-600"
                  >
                    {showSimulator ? 'BAĞLA' : 'SINAQDAN KEÇİR'}
                  </button>
                </div>

                <p className="text-xs text-neutral-500 font-sans leading-relaxed">
                  Cihazın LED işıqlarının üz dərinizə təsirini interaktiv şəkildə yoxlayın.
                </p>

                {showSimulator && (
                  <div className="pt-4 border-t border-neutral-100 space-y-6">
                    <div className="flex justify-center">
                      <div className="relative w-48 h-48 bg-neutral-900 rounded-full flex items-center justify-center overflow-hidden border-2 border-neutral-800">
                        {/* Human Face Silhouette representation */}
                        <svg className="absolute w-32 h-32 text-neutral-600 z-10 opacity-70" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15.5h-2v-2h2v2zm0-4h-2V7h2v6.5z"/>
                        </svg>

                        {/* Animated Soft Light Glow */}
                        {simColor && (
                          <div className={`absolute inset-0 transition-all duration-700 z-0 rounded-full ${ledDetails[simColor].bg} animate-pulse`} />
                        )}

                        <div className="absolute bottom-2 z-20 text-[9px] uppercase tracking-wider text-neutral-400 font-mono">
                          {simColor ? ledDetails[simColor].name : 'İŞIĞI SEÇİN'}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center space-x-3">
                      {(['red', 'blue', 'green', 'yellow'] as const).map((color) => (
                        <button
                          key={color}
                          onClick={() => setSimColor(color)}
                          className={`px-3 py-1.5 text-[9px] font-semibold tracking-widest uppercase border transition-all cursor-pointer ${
                            simColor === color 
                              ? 'bg-neutral-950 text-white border-neutral-950' 
                              : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200'
                          }`}
                        >
                          {color === 'red' && 'QIRMIZI'}
                          {color === 'blue' && 'GÖY'}
                          {color === 'green' && 'YAŞIL'}
                          {color === 'yellow' && 'SARI'}
                        </button>
                      ))}
                    </div>

                    {simColor && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-neutral-50 p-3 text-center border border-neutral-100"
                      >
                        <p className="text-[11px] font-bold text-neutral-800 uppercase tracking-widest mb-1">{ledDetails[simColor].name}</p>
                        <p className="text-[11px] text-neutral-600 font-sans leading-relaxed">{ledDetails[simColor].action}</p>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Information & Actions */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="text-[10px] tracking-widest uppercase text-neutral-400 font-bold block">
                {product.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-widest uppercase text-neutral-900 leading-tight font-sans">
                {product.name}
              </h1>
              <p className="text-sm font-sans text-neutral-500 leading-relaxed">
                {product.subtitle}
              </p>

              {/* Reviews & Star Rating */}
              <div className="flex items-center space-x-3 pb-4 border-b border-neutral-100">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 fill-current ${
                        i < Math.floor(product.rating) ? 'text-amber-400' : 'text-neutral-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-neutral-800">
                  {product.rating} ({product.reviewsCount} müştəri rəyi)
                </span>
              </div>
            </div>

            {/* Price section */}
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-400 block">Qiymət</span>
              <div className="flex items-baseline space-x-3">
                <span className="text-2xl font-bold font-mono text-neutral-950">
                  {product.price.toFixed(2)} ₼
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-base text-neutral-400 line-through font-mono">
                      {product.originalPrice.toFixed(2)} ₼
                    </span>
                    <span className="text-[10px] bg-red-50 text-red-700 font-bold px-2 py-0.5 tracking-wider uppercase font-mono">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% ENDİRİM
                    </span>
                  </>
                )}
              </div>
              <p className="text-[10px] text-emerald-600 font-semibold tracking-wider uppercase">
                Bakı daxili pulsuz kuryer çatdırılması (24 saat ərzində)
              </p>
            </div>

            {/* Description */}
            <p className="text-xs text-neutral-600 font-sans leading-relaxed">
              {product.description}
            </p>

            {/* Kimlər üçün */}
            {product.idealFor && (
              <div className="space-y-2 pb-2">
                <span className="text-[10px] tracking-widest uppercase font-bold text-neutral-500 block">
                  KIMLƏR ÜÇÜN
                </span>
                <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                  {product.idealFor}
                </p>
              </div>
            )}

            {/* Color Shades Picker */}
            {product.shades && product.shades.length > 0 && (
              <div className="space-y-3">
                <span className="text-[10px] tracking-widest uppercase font-bold text-neutral-500 block">
                  Rəng Seçimi: <span className="text-neutral-900 font-semibold">{selectedShade?.name}</span>
                </span>
                <div className="flex items-center space-x-3">
                  {product.shades.map((shade) => (
                    <button
                      key={shade.name}
                      onClick={() => setSelectedShade(shade)}
                      className={`w-6 h-6 rounded-full border transition-all duration-300 relative cursor-pointer ${
                        selectedShade?.name === shade.name
                          ? 'border-neutral-900 scale-110 shadow-md'
                          : 'border-neutral-200 hover:scale-105'
                      }`}
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

            {/* Add to Cart Actions */}
            <div className="space-y-4 pt-4 border-t border-neutral-100">
              <div className="flex items-center space-x-4">
                {/* Quantity */}
                <div className="flex items-center border border-neutral-300 h-12 bg-white">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="px-3 h-full hover:bg-neutral-50 text-neutral-500 transition-colors cursor-pointer"
                    aria-label="Azalt"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="px-4 text-xs font-mono font-bold text-neutral-800 select-none min-w-[30px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="px-3 h-full hover:bg-neutral-50 text-neutral-500 transition-colors cursor-pointer"
                    aria-label="Artır"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 h-12 text-[10px] tracking-widest font-bold uppercase transition-all duration-300 border cursor-pointer ${
                    isAdded 
                      ? 'bg-emerald-600 text-white border-emerald-600' 
                      : 'bg-neutral-950 text-white border-neutral-950 hover:bg-transparent hover:text-neutral-900'
                  }`}
                >
                  {isAdded ? (
                    <span className="flex items-center justify-center space-x-2">
                      <Check className="h-4 w-4" />
                      <span>SƏBƏTƏ ƏLAVƏ EDİLDİ</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <ShoppingBag className="h-4 w-4" />
                      <span>SƏBƏTƏ ƏLAVƏ ET</span>
                    </span>
                  )}
                </button>
              </div>

              {/* Direct Checkout Button */}
              <Link href="/checkout" className="block">
                <button
                  className="w-full h-12 text-[10px] tracking-widest font-bold uppercase border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-950 hover:text-white hover:border-neutral-950 transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>BİRBAŞA SİFARİŞ ET</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </Link>
            </div>

            {/* Quick Guarantees Row */}
            <div className="grid grid-cols-3 gap-2 text-center border-t border-b border-neutral-100 py-4 text-neutral-500">
              <div className="flex flex-col items-center space-y-1">
                <ShieldCheck className="h-4 w-4 text-neutral-700" />
                <span className="text-[9px] tracking-wider uppercase font-semibold">2 İllik Zəmanət</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <Truck className="h-4 w-4 text-neutral-700" />
                <span className="text-[9px] tracking-wider uppercase font-semibold">Pulsuz Kuryer</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <RotateCcw className="h-4 w-4 text-neutral-700" />
                <span className="text-[9px] tracking-wider uppercase font-semibold">14 Günlük İadə</span>
              </div>
            </div>

            {/* Content Tabs (Benefits / How to use / Ingredients) */}
            <div className="space-y-4">
              <div className="flex border-b border-neutral-200">
                {(['benefits', 'features', 'howToUse', 'ingredients'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2.5 text-[10px] font-bold tracking-widest uppercase mr-6 border-b-2 transition-all cursor-pointer ${
                      activeTab === tab
                        ? 'border-neutral-950 text-neutral-950'
                        : 'border-transparent text-neutral-400 hover:text-neutral-700'
                    }`}
                  >
                    {tab === 'benefits' && 'FAYDALARI'}
                    {tab === 'features' && 'XÜSUSİYYƏTLƏR'}
                    {tab === 'howToUse' && 'İSTİFADƏ QAYDASI'}
                    {tab === 'ingredients' && 'MATERİAL / SERTİFİKAT'}
                  </button>
                ))}
              </div>

              <div className="pt-2 text-xs text-neutral-600 leading-relaxed font-sans min-h-[80px]">
                {activeTab === 'benefits' && (
                  <ul className="space-y-2">
                    {product.benefits?.map((benefit, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-neutral-950 font-bold mt-0.5">•</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {activeTab === 'features' && product.features && product.features.length > 0 && (
                  <ul className="space-y-2">
                    {product.features.map((f, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-neutral-950 font-bold mt-0.5">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {activeTab === 'howToUse' && (
                  <div className="space-y-4">
                    <div>
                      <p className="whitespace-pre-line leading-relaxed">{product.howToUse}</p>
                    </div>
                    {product.useCases && product.useCases.length > 0 && (
                      <div>
                        <h4 className="text-[10px] font-bold tracking-widest uppercase text-neutral-700 mb-2">ISTIFADE SSENARILERI</h4>
                        <ul className="space-y-1">
                          {product.useCases.map((u, i) => (
                            <li key={i} className="flex items-start space-x-2">
                              <span className="text-neutral-950 font-bold mt-0.5">•</span>
                              <span>{u}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {product.careInstructions && (
                      <div>
                        <h4 className="text-[10px] font-bold tracking-widest uppercase text-neutral-700 mb-2">QULLUQ TƏLİMATI</h4>
                        <p className="whitespace-pre-line leading-relaxed">{product.careInstructions}</p>
                      </div>
                    )}
                  </div>
                )}
                {activeTab === 'ingredients' && (
                  <p className="whitespace-pre-line leading-relaxed">{product.ingredients || 'Medical grade material, CE & RoHS certified.'}</p>
                )}
              </div>
            </div>
            {/* FAQ Accordion */}
            {product.faq && product.faq.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-neutral-100">
                <span className="text-[10px] tracking-widest uppercase font-bold text-neutral-500 block">
                  TEZ-TEZ VERILƏN SUALLAR
                </span>
                <div className="space-y-2">
                  {product.faq.map((item, i) => (
                    <details key={i} className="group border border-neutral-100 bg-white">
                      <summary className="flex items-center justify-between px-4 py-3 text-xs font-medium text-neutral-800 cursor-pointer list-none hover:bg-neutral-50 transition-colors">
                        {item.question}
                        <ChevronRight className="h-3 w-3 text-neutral-400 group-open:rotate-90 transition-transform shrink-0 ml-2" />
                      </summary>
                      <div className="px-4 pb-3 text-xs text-neutral-500 leading-relaxed border-t border-neutral-100 pt-3">
                        {item.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Reviews Segment for current product */}
        <div className="mt-24 border-t border-neutral-100 pt-16">
          <div className="mb-10 text-center max-w-lg mx-auto">
            <h2 className="text-lg font-bold tracking-widest uppercase text-neutral-950 mb-3">MÜŞTƏRİ RƏYLƏRİ</h2>
            <p className="text-xs text-neutral-400 font-sans">Məhsulumuz haqqında real müştərilərimizdən gələn rəylərlə tanış olun.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 border border-neutral-100 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-neutral-900">Nərmin Məmmədova</span>
                <span className="text-[10px] font-mono text-neutral-400">22 İyun 2026</span>
              </div>
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Bu məhsulu TAPLA MARKETPLACE-dən aldım və çox məmnun qaldım. Keyfiyyət mükəmməldir, çatdırılma isə çox sürətli idi. Hər kəsə tövsiyə edirəm!
              </p>
            </div>
            <div className="bg-white p-6 border border-neutral-100 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-neutral-900">Elnur Rzayev</span>
                <span className="text-[10px] font-mono text-neutral-400">14 İyun 2026</span>
              </div>
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Yoldaşıma hədiyyə olaraq sifariş vermişdim, çox bəyəndi. Xüsusilə çatdırılma sürəti inanılmazdır, sifarişdən bir neçə saat sonra ünvanımızda idi. Təşəkkürlər TAPLA!
              </p>
            </div>
          </div>
        </div>

        {/* Related Products Showcase */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 border-t border-neutral-100 pt-16">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-sm sm:text-base font-bold tracking-widest uppercase text-neutral-950">
                SİZİN ÜÇÜN SEÇDİKLƏRİMİZ
              </h2>
              <Link href="/#products" className="text-[10px] tracking-widest font-bold uppercase hover:opacity-70 underline transition-opacity">
                HAMISINI GÖR
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-6 gap-px">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
