'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShieldCheck, Truck, Sparkles, Gift, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Bundle {
  id: string;
  name: string;
  bottles: number;
  price: number;
  originalPrice: number;
  popular: boolean;
  tag: string;
  delivery: string;
  gift: string | null;
}

export function CheckoutOffer() {
  const bundles: Bundle[] = [
    {
      id: 'starter',
      name: "Sınaq Paketi",
      bottles: 1,
      price: 49,
      originalPrice: 79,
      popular: false,
      tag: "Sınaq üçün",
      delivery: "Bakı daxili pulsuz",
      gift: null
    },
    {
      id: 'popular',
      name: "Qızıl Orta Kursu",
      bottles: 2,
      price: 79,
      originalPrice: 158,
      popular: true,
      tag: "ƏN ÇOX SİFARİŞ OLUNAN",
      delivery: "Ölkə daxili pulsuz çatdırılma",
      gift: "Hədiyyəlik Premium İpək Göz Maskası"
    },
    {
      id: 'royal',
      name: "Royal Gözəllik Kursu",
      bottles: 3,
      price: 99,
      originalPrice: 237,
      popular: false,
      tag: "MAKSİMUM EFFEKT & QƏNAƏT",
      delivery: "Ölkə daxili pulsuz çatdırılma",
      gift: "Premium Gözəllik Çantası + İpək Göz Maskası"
    }
  ];

  const [selectedBundle, setSelectedBundle] = useState<Bundle>(bundles[1]);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: 'Baku',
    paymentMethod: 'cash'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectBundle = (bundle: Bundle) => {
    setSelectedBundle(bundle);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!formData.fullName || !formData.phone || !formData.address) {
      setSubmitError('Zəhmət olmasa bütün sahələri doldurun.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_slug: 'essential-lash-serum',
          product_title: 'Essential Lash Serum',
          customer_name: formData.fullName,
          phone: formData.phone,
          city: formData.city,
          address: formData.address,
          quantity: selectedBundle.bottles,
          total: selectedBundle.price,
          notes: `Paket: ${selectedBundle.name} (${selectedBundle.bottles} flakon)${selectedBundle.gift ? `, Hədiyyə: ${selectedBundle.gift}` : ''}`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Sifariş göndərilmədi');
      }

      setOrderId(data.orderId);
      setIsSuccess(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Xəta baş verdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="checkout-section" className="bg-white text-[#1C1613] py-24 px-6 lg:px-12 relative overflow-hidden border-b border-[#1C1613]/5">
      <div className="absolute top-[20%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#FAF8F5] blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#FAF5F1] blur-3xl opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Title */}
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16 lg:mb-24">
          <p className="text-xs font-mono tracking-widest uppercase text-[#8A6E45]">Gözəlliyə İnvestisiya Edin</p>
          <h2 className="text-3xl sm:text-4xl font-serif tracking-tight font-normal text-[#1C1613]">
            Sizə Uyğun Paketi Seçin
          </h2>
          <p className="text-sm font-sans text-[#1C1613]/70">
            Süni qaynaqlara hər ay pul xərcləməyə son qoyun. Öz təbii kirpiklərinizi canlandırın və qoruyun.
          </p>
        </div>

        {/* Dynamic Offer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Bundle Selections Column (Left 7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {bundles.map((bundle) => {
              const isSelected = selectedBundle.id === bundle.id;
              return (
                <div
                  key={bundle.id}
                  onClick={() => handleSelectBundle(bundle)}
                  className={cn(
                    "p-6 lg:p-8 border transition-all duration-500 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden",
                    isSelected
                      ? "bg-[#FAF8F5] border-[#C5A880] shadow-xl scale-102"
                      : "bg-white border-[#1C1613]/5 opacity-80 hover:opacity-100 hover:border-[#1C1613]/20"
                  )}
                >
                  {/* Popular gold badge */}
                  {bundle.popular && (
                    <span className="absolute top-0 right-0 bg-[#8A6E45] text-white text-[8px] font-mono tracking-widest font-semibold px-4 py-1 uppercase rounded-bl-xs">
                      ƏN POPULYAR SEÇİM
                    </span>
                  )}

                  {/* Left block with details */}
                  <div className="space-y-4 flex-grow">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono tracking-wider text-[#8A6E45] uppercase">
                        {bundle.tag}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-serif text-[#1C1613] font-normal">
                        {bundle.name}
                      </h3>
                      <p className="text-xs font-sans text-[#1C1613]/60">
                        Hər biri 3 ml • {bundle.bottles} flakon kursu
                      </p>
                    </div>

                    {/* Features row */}
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-sans text-[#1C1613]/80">
                      <div className="flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-[#8A6E45]" />
                        <span>{bundle.delivery}</span>
                      </div>
                      {bundle.gift && (
                        <div className="flex items-center gap-1 text-[#8A6E45] font-medium">
                          <Gift className="w-3.5 h-3.5" />
                          <span>+ {bundle.gift}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right block with prices */}
                  <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-[#1C1613]/10 pt-4 sm:pt-0 sm:pl-8 shrink-0">
                    <span className="text-xs line-through text-[#1C1613]/40 font-sans">
                      {bundle.originalPrice} AZN
                    </span>
                    <span className="text-3xl sm:text-4xl font-serif text-[#1C1613] font-normal">
                      {bundle.price} <span className="text-lg">AZN</span>
                    </span>
                    <span className="text-[10px] font-mono uppercase bg-[#8A6E45]/10 text-[#8A6E45] px-2 py-0.5 rounded-full mt-1">
                      {Math.round(((bundle.originalPrice - bundle.price) / bundle.originalPrice) * 100)}% QƏNAƏT
                    </span>
                  </div>

                  {/* Selected check ring */}
                  <div className={cn(
                    "absolute left-0 top-0 h-full w-1 transition-all duration-300",
                    isSelected ? "bg-[#8A6E45]" : "bg-transparent"
                  )} />
                </div>
              );
            })}

            {/* Absolute Brand Trust Bar */}
            <div className="p-6 bg-[#FAF8F5] border border-[#1C1613]/5 flex items-center gap-4">
              <ShieldCheck className="w-8 h-8 text-[#8A6E45] shrink-0" />
              <div className="space-y-0.5">
                <p className="text-xs font-sans font-medium text-[#1C1613]">100% Razılıq Zəmanəti</p>
                <p className="text-[11px] font-sans text-[#1C1613]/60">Məhsulumuzun keyfiyyətinə tam inanırıq. Bizdən aldığınız hər bir məhsul rəsmi laboratoriya tərəfindən sertifikatlaşdırılıb.</p>
              </div>
            </div>
          </div>

          {/* Secure Interactive Checkout Column (Right 5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-[#FAF8F5] border border-[#1C1613]/5 p-8 shadow-xl relative min-h-[500px]">
              
              {/* Checkout ambient styling */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#8A6E45]" />

              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.div
                    key="checkout-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono tracking-widest text-[#8A6E45] uppercase font-semibold">Təhlükəsiz Sifariş</span>
                      <h3 className="text-xl font-serif text-[#1C1613]">Çatdırılma Məlumatları</h3>
                      <p className="text-xs text-[#1C1613]/60">Sifarişinizi tamamlamaq üçün aşağıdakı xanaları doldurun. Sifariş qapıda ödənilir.</p>
                    </div>

                    {/* Order summary pill / selector */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-[#1C1613]/60 flex justify-between">
                        <span>Seçilmiş Paket</span>
                        <span className="text-[#8A6E45] font-semibold">Ödəniş qapıda</span>
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {bundles.map((bundle) => {
                          const isSelected = selectedBundle.id === bundle.id;
                          return (
                            <button
                              key={bundle.id}
                              type="button"
                              onClick={() => handleSelectBundle(bundle)}
                              className={cn(
                                "flex flex-col items-center justify-center p-2.5 sm:p-3 border text-center transition-all rounded-none relative h-full cursor-pointer",
                                isSelected
                                  ? "bg-white border-[#8A6E45] text-[#1C1613] shadow-md ring-1 ring-[#8A6E45]"
                                  : "bg-white border-[#1C1613]/10 text-[#1C1613]/60 hover:text-[#1C1613] hover:border-[#1C1613]/30"
                              )}
                            >
                              {bundle.popular && (
                                <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#8A6E45] text-white text-[7px] font-mono tracking-wider px-1.5 py-0.5 rounded-full scale-90 whitespace-nowrap">
                                  POPULYAR
                                </span>
                              )}
                              <span className="text-[10px] font-sans font-medium leading-tight block">
                                {bundle.name}
                              </span>
                              <span className="text-xs font-serif font-bold text-[#8A6E45] mt-1">
                                {bundle.price} AZN
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Mini details for the selected package */}
                      <div className="bg-white p-3 border border-[#1C1613]/5 flex justify-between items-center text-xs">
                        <div className="space-y-0.5">
                          <p className="font-sans font-semibold text-[#1C1613] flex items-center gap-1.5 flex-wrap">
                            <span>{selectedBundle.name}</span>
                            <span className="text-[9px] font-mono bg-[#8A6E45]/10 text-[#8A6E45] px-1.5 py-0.5 rounded-none font-semibold uppercase">
                              {selectedBundle.bottles} FLAKON
                            </span>
                          </p>
                          <p className="text-[10px] text-[#1C1613]/60 font-sans leading-tight">
                            {selectedBundle.gift ? `🎁 Hədiyyə: ${selectedBundle.gift}` : '✨ Pulsuz sürətli çatdırılma'}
                          </p>
                        </div>
                        <p className="text-lg font-serif font-semibold text-[#8A6E45] shrink-0">
                          {selectedBundle.price} AZN
                        </p>
                      </div>
                    </div>

                    {submitError && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{submitError}</span>
                      </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Name Input */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-[#1C1613]/60">Ad, Soyad</label>
                        <input
                          type="text"
                          name="fullName"
                          required
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Məs: Günel Məmmədova"
                          className="w-full bg-white border border-[#1C1613]/10 px-4 py-3 text-xs sm:text-sm font-sans text-[#1C1613] focus:outline-none focus:border-[#8A6E45] transition-colors"
                        />
                      </div>

                      {/* Phone Input */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-[#1C1613]/60">Telefon Nömrəsi</label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Məs: +994 50 123 45 67"
                          className="w-full bg-white border border-[#1C1613]/10 px-4 py-3 text-xs sm:text-sm font-sans text-[#1C1613] focus:outline-none focus:border-[#8A6E45] transition-colors"
                        />
                      </div>

                      {/* City Select */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-[#1C1613]/60">Çatdırılma Bölgəsi</label>
                        <select
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-[#1C1613]/10 px-4 py-3 text-xs sm:text-sm font-sans text-[#1C1613] focus:outline-none focus:border-[#8A6E45] transition-colors"
                        >
                          <option value="Baku">Bakı (Sürətli çatdırılma - 24 saat)</option>
                          <option value="Sumqayit">Sumqayıt / Xırdalan</option>
                          <option value="Ganja">Gəncə</option>
                          <option value="Rayonlar">Digər Rayonlar (Poçt vasitəsilə)</option>
                        </select>
                      </div>

                      {/* Address Input */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-[#1C1613]/60">Çatdırılma Ünvanı</label>
                        <input
                          type="text"
                          name="address"
                          required
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Məs: Yasamal r., İnşaatçılar m., ev 12"
                          className="w-full bg-white border border-[#1C1613]/10 px-4 py-3 text-xs sm:text-sm font-sans text-[#1C1613] focus:outline-none focus:border-[#8A6E45] transition-colors"
                        />
                      </div>

                      {/* Payment Method Select */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-[#1C1613]/60">Ödəniş Üsulu</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setFormData(p => ({ ...p, paymentMethod: 'cash' }))}
                            className={cn(
                              "py-2.5 text-xs font-mono uppercase tracking-wider border transition-all",
                              formData.paymentMethod === 'cash'
                                ? "bg-[#1C1613] text-white border-[#1C1613]"
                                : "bg-white text-[#1C1613] border-[#1C1613]/10 hover:border-[#1C1613]/30"
                            )}
                          >
                            Nağd (Qapıda)
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData(p => ({ ...p, paymentMethod: 'card' }))}
                            className={cn(
                              "py-2.5 text-xs font-mono uppercase tracking-wider border transition-all",
                              formData.paymentMethod === 'card'
                                ? "bg-[#1C1613] text-white border-[#1C1613]"
                                : "bg-white text-[#1C1613] border-[#1C1613]/10 hover:border-[#1C1613]/30"
                            )}
                          >
                            Kartla (Qapıda)
                          </button>
                        </div>
                      </div>

                      {/* Submit Action Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#1C1613] text-white py-4 px-6 text-xs sm:text-sm font-mono uppercase tracking-widest font-semibold hover:bg-[#322823] transition-colors flex items-center justify-center gap-2 mt-4"
                        id="submit-order-btn"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-[#C5A880]" />
                            <span>Məlumatlar Yoxlanılır...</span>
                          </>
                        ) : (
                          <>
                            <span>Sifarişi Təsdiqlə ({selectedBundle.price} AZN)</span>
                          </>
                        )}
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="checkout-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                    className="space-y-6 text-center py-8 flex flex-col items-center justify-center h-full min-h-[450px]"
                  >
                    {/* Animated Check Container */}
                    <div className="w-16 h-16 rounded-full bg-[#8A6E45]/10 border border-[#8A6E45] flex items-center justify-center text-[#8A6E45] mb-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                      >
                        <Check className="w-8 h-8 stroke-[3]" />
                      </motion.div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-mono tracking-widest text-[#8A6E45] uppercase font-bold">Uğurlu Əməliyyat</span>
                      <h3 className="text-2xl font-serif text-[#1C1613]">Sifarişiniz Qəbul Olundu!</h3>
                      <p className="text-xs text-[#1C1613]/40 font-mono">Sifariş Nömrəsi: {orderId}</p>
                    </div>

                    <div className="bg-white border border-[#1C1613]/5 p-4 rounded-sm text-xs text-[#1C1613]/80 space-y-2 max-w-sm">
                      <p className="font-semibold text-[#8A6E45]">Təşəkkür edirik, {formData.fullName}!</p>
                      <p>Sifariş paketiniz <strong>({selectedBundle.name})</strong> uğurla qeydiyyata alındı.</p>
                      <p className="italic">Menecerimiz yaxın 15 dəqiqə ərzində çatdırılmanı təsdiqləmək üçün sizinlə <strong>{formData.phone}</strong> nömrəsi vasitəsilə əlaqə saxlayacaqdır.</p>
                    </div>

                    {/* Return back simulation button */}
                    <button
                      onClick={() => {
                        setIsSuccess(false);
                        setFormData({
                          fullName: '',
                          phone: '',
                          address: '',
                          city: 'Baku',
                          paymentMethod: 'cash'
                        });
                      }}
                      className="text-xs font-mono tracking-wider uppercase border border-[#1C1613]/20 px-6 py-2.5 text-[#1C1613] hover:bg-[#1C1613]/5 transition-colors"
                    >
                      Yeni Sifariş
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
