'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, ShoppingBag } from 'lucide-react';
import { Container } from '@/components/ui/Container';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || '';
  const status = searchParams.get('status') || '';
  const isPaid = status === 'paid';

  return (
    <div className="pt-32 pb-20 bg-[#FAF9F6] min-h-screen flex items-center">
      <Container>
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {isPaid ? (
            <>
              {/* Success State */}
              <div className="flex justify-center">
                <div className="relative">
                  <CheckCircle2 className="h-16 w-16 text-emerald-600 animate-bounce" />
                  <div className="absolute inset-0 bg-emerald-100 rounded-full scale-110 -z-10 animate-ping opacity-25" />
                </div>
              </div>

              <div className="space-y-3">
                <h1 className="text-xl sm:text-2xl font-bold tracking-widest text-neutral-900 uppercase">
                  ÖDƏNİŞ UĞURLA TAMAMLANDI!
                </h1>
                <p className="text-xs text-neutral-500 font-sans leading-relaxed max-w-md mx-auto">
                  TAPLA MARKETPLACE-dən etdiyiniz alış-veriş üçün təşəkkür edirik. Ödənişiniz təhlükəsiz şəkildə qəbul edildi.
                </p>
              </div>

              <div className="bg-white border border-neutral-100 p-6 sm:p-8 shadow-sm space-y-4 text-left rounded-xl">
                <div className="flex justify-between border-b border-neutral-200/60 pb-3">
                  <span className="text-neutral-400 uppercase tracking-wider font-semibold text-[10px]">Sifariş nömrəsi:</span>
                  <span className="font-bold text-neutral-900 font-mono text-xs">{orderId ? `TPL-${orderId.slice(0, 6).toUpperCase()}` : '—'}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-200/60 pb-3">
                  <span className="text-neutral-400 uppercase tracking-wider font-semibold text-[10px]">Ödəniş statusu:</span>
                  <span className="font-bold text-emerald-600 text-xs">ÖDƏNİLDİ ✓</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400 uppercase tracking-wider font-semibold text-[10px]">Ödəniş üsulu:</span>
                  <span className="font-bold text-neutral-900 text-xs">PASHA Bank (Onlayn Kart)</span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[11px] text-neutral-400 leading-relaxed font-sans max-w-sm mx-auto">
                  Kuryerimiz sifarişi təsdiqləmək və çatdırılma vaxtını dəqiqləşdirmək üçün yaxın 15 dəqiqə ərzində sizinlə əlaqə saxlayacaqdır.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Pending State */}
              <div className="flex justify-center">
                <ShoppingBag className="h-16 w-16 text-amber-500" />
              </div>

              <div className="space-y-3">
                <h1 className="text-xl sm:text-2xl font-bold tracking-widest text-neutral-900 uppercase">
                  ÖDƏNİŞ GÖZLƏNİLİR
                </h1>
                <p className="text-xs text-neutral-500 font-sans leading-relaxed max-w-md mx-auto">
                  Ödənişiniz hələ təsdiqlənməyib. Bir neçə dəqiqə ərzində status yenilənəcək.
                </p>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center space-x-2 bg-neutral-950 text-white text-[10px] tracking-widest font-bold uppercase px-8 py-4 border border-neutral-950 hover:bg-transparent hover:text-neutral-900 transition-all duration-300 rounded-full"
            >
              <span>ANA SƏHİFƏYƏ QAYIT</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="pt-32 pb-20 bg-[#FAF9F6] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-neutral-900 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-xs uppercase tracking-widest text-neutral-400">Yüklənir...</p>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
