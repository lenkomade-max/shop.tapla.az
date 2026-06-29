'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, ShoppingBag } from 'lucide-react';
import { Container } from '@/components/ui/Container';

interface LastOrder {
  orderNumber: string;
  items: Array<{ name: string; price: number; quantity: number; shade?: string }>;
  fullName: string;
  phone: string;
  city: string;
  address: string;
  total: number;
  depositMethod?: string;
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || '';
  const status = searchParams.get('status') || '';
  const isPaid = status === 'paid';

  const [lastOrder, setLastOrder] = useState<LastOrder | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('tapla_last_order');
    if (stored) {
      try {
        setLastOrder(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const whatsappUrl = lastOrder
    ? buildWhatsAppUrl({
        orderNumber: lastOrder.orderNumber,
        items: lastOrder.items,
        fullName: lastOrder.fullName,
        phone: lastOrder.phone,
        city: lastOrder.city,
        address: lastOrder.address,
        total: lastOrder.total,
        depositMethod: lastOrder.depositMethod,
      })
    : '';

  const isDeposit = lastOrder?.depositMethod === 'pasha_bank';

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
                  {isDeposit ? '5 AZN BEH ÖDƏNİLDİ!' : 'ÖDƏNİŞ UĞURLA TAMAMLANDI!'}
                </h1>
                <p className="text-xs text-neutral-500 font-sans leading-relaxed max-w-md mx-auto">
                  {isDeposit
                    ? 'Beh uğurla ödənildi. Qalan məbləği kuryerə çatdırılma zamanı nağd ödəyəcəksiniz.'
                    : 'TAPLA MARKETPLACE-dən etdiyiniz alış-veriş üçün təşəkkür edirik. Ödənişiniz təhlükəsiz şəkildə qəbul edildi.'}
                </p>
              </div>

              <div className="bg-white border border-neutral-100 p-6 sm:p-8 shadow-sm space-y-4 text-left rounded-xl">
                <div className="flex justify-between border-b border-neutral-200/60 pb-3">
                  <span className="text-neutral-400 uppercase tracking-wider font-semibold text-[10px]">Sifariş nömrəsi:</span>
                  <span className="font-bold text-neutral-900 font-mono text-xs">{orderId ? `TPL-${orderId.slice(0, 6).toUpperCase()}` : lastOrder?.orderNumber || '—'}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-200/60 pb-3">
                  <span className="text-neutral-400 uppercase tracking-wider font-semibold text-[10px]">Ödəniş statusu:</span>
                  <span className="font-bold text-emerald-600 text-xs">ÖDƏNİLDİ ✓</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400 uppercase tracking-wider font-semibold text-[10px]">Ödəniş üsulu:</span>
                  <span className="font-bold text-neutral-900 text-xs">
                    {isDeposit ? 'PASHA Bank (5 AZN Beh)' : 'PASHA Bank (Onlayn Kart)'}
                  </span>
                </div>
              </div>

              {/* WhatsApp button for deposit orders */}
              {isDeposit && lastOrder && (
                <div className="border border-amber-200/40 bg-amber-50/30 p-6 space-y-4 rounded-xl text-left">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-amber-800">
                    NÖVBƏTİ ADDIM: MENECERƏ MÜRACİƏT EDİN
                  </p>
                  <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                    Beh ödənildi. İndi WhatsApp vasitəsilə menecerə müraciət edərək sifarişinizi təsdiqlədin. Menecer sifariş nömrənizə əsasən sifarişi tapacaq.
                  </p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center space-x-2 bg-[#25D366] text-white w-full px-5 py-3.5 text-[9px] font-bold uppercase tracking-widest hover:bg-[#20ba56] transition-colors rounded-xl"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.023-5.115-2.887-6.979C16.58 1.898 14.1 1.842 11.983 1.842c-5.441 0-9.866 4.423-9.87 9.867 0 1.724.462 3.411 1.338 4.907L2.453 20.35l3.993-1.047c-.001-.001-.001-.001 0 0z"/></svg>
                    <span>MENECERLƏ WHATSAPP-DA ƏLAQƏ</span>
                  </a>
                </div>
              )}

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

// ——— Helpers ———

function buildWhatsAppUrl(opts: {
  orderNumber: string;
  items: Array<{ name: string; price: number; quantity: number; shade?: string }>;
  fullName: string;
  phone: string;
  city: string;
  address: string;
  total: number;
  depositMethod?: string;
}) {
  const lines = [
    `Salam! Mən TAPLA-dan sifariş etdim.`,
    `Sifariş nömrəm: ${opts.orderNumber}`,
    ``,
    `Məhsullar:`,
    ...opts.items.map(i => {
      const shade = i.shade ? ` (${i.shade})` : '';
      return `  • ${i.name}${shade} x${i.quantity} = ${(i.price * i.quantity).toFixed(2)} AZN`;
    }),
    `Cəmi: ${opts.total.toFixed(2)} AZN`,
    ``,
    `Ad: ${opts.fullName}`,
    `Tel: ${opts.phone}`,
    `Ünvan: ${opts.city}, ${opts.address}`,
  ];
  if (opts.depositMethod === 'whatsapp') {
    lines.push(``, `Beh ödənişi: WhatsApp (menecer)`);
  } else if (opts.depositMethod === 'pasha_bank') {
    lines.push(``, `Beh ödənişi: PASHA Bank (5 AZN)`);
  }
  return `https://wa.me/994503003030?text=${encodeURIComponent(lines.join('\n'))}`;
}