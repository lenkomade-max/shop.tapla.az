'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  CheckCircle2, 
  CreditCard, 
  Truck, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useCart } from '@/store/CartContext';
import { Container } from '@/components/ui/Container';
import { useAuth } from '@/components/auth/AuthContext';
import * as pixel from '@/lib/fbpixel';
import SecurePaymentTransition from '@/components/checkout/SecurePaymentTransition';
import SecurePaymentAnimation from '@/components/checkout/SecurePaymentAnimation';

interface CheckoutForm {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  paymentMethod: 'cash_delivery' | 'card_delivery' | 'online_card';
  depositMethod: 'pasha_bank' | 'whatsapp';
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, profile } = useAuth();
  const [mounted, setMounted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const submitSentinelRef = useRef<HTMLDivElement>(null);
  const [showStickySubmit, setShowStickySubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('');
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [generatedOrderNumber, setGeneratedOrderNumber] = useState('');
  const [orderError, setOrderError] = useState('');
  const [orderItems, setOrderItems] = useState<Array<{ name: string; price: number; quantity: number; shade?: string }>>([]);

  // Local form state
  const [form, setForm] = useState<CheckoutForm>({
    fullName: '',
    phone: '',
    email: '',
    city: 'Bakı',
    address: '',
    paymentMethod: 'online_card',
    depositMethod: 'whatsapp',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CheckoutForm, string>>>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted || cartItems.length === 0) return
    pixel.event('InitiateCheckout', {
      value: cartTotal,
      currency: 'AZN',
      content_ids: cartItems.map(i => i.product.id),
      content_type: 'product',
    })
  }, [mounted])

  // Страница ВСЕГДА открывается сверху — запрещаем браузеру восстанавливать скролл
  useEffect(() => {
    if (!mounted) return;
    // «manual» отключает встроенное восстановление скролла браузером
    // Страница открывается на самом верху, а не там где был пользователь
    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    // Возвращаем 'auto' при уходе со страницы, чтобы не ломать другие страницы
    return () => {
      history.scrollRestoration = 'auto';
    };
  }, [mounted]);

  // Авто-заполнение из профиля при загрузке (только если поля ещё пустые)
  useEffect(() => {
    if (mounted && profile) {
      // Собираем fullName из first_name + last_name
      const profileFullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ').trim();
      setForm(prev => ({
        ...prev,
        fullName: prev.fullName || profileFullName,
        phone: prev.phone || profile.phone || '',
        email: prev.email || profile.email || '',
        city: prev.city !== 'Bakı' ? prev.city : (profile.city || prev.city),
        address: profile.address || prev.address || '',
      }));
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });
    }
  }, [mounted, profile]);

  // Sticky submit button detection
  useEffect(() => {
    const sentinel = submitSentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickySubmit(!entry.isIntersecting),
      { rootMargin: '-1px 0px 0px 0px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [mounted]);

  useEffect(() => {
    if (orderConfirmed) {
      pixel.event('Purchase', {
        value: cartTotal,
        currency: 'AZN',
        content_ids: cartItems.map(i => i.product.id),
        content_type: 'product',
      })
    }
  }, [orderConfirmed]);

  if (!mounted) {
    return <div className="min-h-screen bg-[#FAF9F6] pt-32 text-center text-xs uppercase tracking-widest font-mono">Yüklənir...</div>;
  }

  const validateForm = () => {
    const errors: Partial<Record<keyof CheckoutForm, string>> = {};
    if (!form.fullName.trim()) errors.fullName = 'Ad və soyadınızı daxil edin';
    if (!form.phone.trim()) errors.phone = 'Əlaqə nömrənizi daxil edin';
    if (!form.address.trim()) errors.address = 'Çatdırılma ünvanını daxil edin';
    
    // online_card: card is entered on Pasha Bank's secure page — no client-side validation needed

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Auto formatting for card number (xxxx xxxx xxxx xxxx)
    if (name === 'cardNumber') {
      const formatted = value
        .replace(/\D/g, '')
        .substring(0, 16)
        .replace(/(\d{4})(?=\d)/g, '$1 ');
      setForm(prev => ({ ...prev, [name]: formatted }));
      return;
    }

    // Auto formatting for expiry date (MM/YY)
    if (name === 'cardExpiry') {
      const formatted = value
        .replace(/\D/g, '')
        .substring(0, 4)
        .replace(/(\d{2})(?=\d)/g, '$1/');
      setForm(prev => ({ ...prev, [name]: formatted }));
      return;
    }

    // CVV max length 3
    if (name === 'cardCvv') {
      const formatted = value.replace(/\D/g, '').substring(0, 3);
      setForm(prev => ({ ...prev, [name]: formatted }));
      return;
    }

    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setOrderError('');

    const { submitOrder } = await import('@/lib/actions');

    const result = await submitOrder({
      fullName: form.fullName,
      phone: form.phone,
      email: form.email,
      city: form.city,
      address: form.address,
      paymentMethod: form.paymentMethod,
      depositMethod: form.paymentMethod === 'cash_delivery' ? form.depositMethod : undefined,
      items: cartItems.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        shade: item.selectedShade?.name,
      })),
      total: cartTotal,
    });

    if (!result.success) {
      setOrderError(result.error || 'Sifariş zamanı xəta baş verdi');
      setIsSubmitting(false);
      return;
    }

    // Сохраняем данные заказа для WhatsApp на экране успеха
    const orderItemData = cartItems.map(item => ({
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      shade: item.selectedShade?.name,
    }));
    setOrderItems(orderItemData);

    // For online_card or cash_delivery+pasha_bank: redirect to Pasha Bank
    if (result.redirectUrl) {
      localStorage.setItem('tapla_last_order', JSON.stringify({
        orderNumber: result.orderNumber,
        items: orderItemData,
        fullName: form.fullName,
        phone: form.phone,
        city: form.city,
        address: form.address,
        total: cartTotal,
        depositMethod: form.paymentMethod === 'cash_delivery' ? form.depositMethod : undefined,
      }));
      setRedirectUrl(result.redirectUrl);
      setIsRedirecting(true);
      window.scrollTo({ top: document.querySelector('form')?.offsetTop || 300, behavior: 'smooth' });
      return;
    }

    setGeneratedOrderNumber(result.orderNumber!);
    setIsSubmitting(false);
    setOrderConfirmed(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinish = () => {
    clearCart();
    // Redirect to home
    window.location.href = '/';
  };

  // If order is successfully confirmed
  if (orderConfirmed) {
    return (
      <div className="pt-32 pb-20 bg-[#FAF9F6] min-h-screen flex items-center">
        <Container>
          <div className="max-w-2xl mx-auto bg-white border border-neutral-100 p-8 sm:p-12 text-center space-y-8 shadow-sm rounded-2xl">
            <div className="flex justify-center">
              <div className="relative">
                <CheckCircle2 className="h-16 w-16 text-emerald-600 animate-bounce" />
                <div className="absolute inset-0 bg-emerald-100 rounded-full scale-110 -z-10 animate-ping opacity-25" />
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-xl sm:text-2xl font-bold tracking-widest text-neutral-900 uppercase">
                SİFARİŞİNİZ TƏSDİQLƏNDİ!
              </h1>
              <p className="text-xs text-neutral-500 font-sans leading-relaxed max-w-md mx-auto">
                Təbrik edirik! TAPLA MARKETPLACE-dən etdiyiniz alış-veriş üçün təşəkkür edirik.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="bg-neutral-50 p-6 border border-neutral-100 text-left space-y-4 font-sans text-xs rounded-xl">
              <div className="flex justify-between border-b border-neutral-200/60 pb-3">
                <span className="text-neutral-400 uppercase tracking-wider font-semibold">Sifariş nömrəsi:</span>
                <span className="font-bold text-neutral-900 font-mono">{generatedOrderNumber}</span>
              </div>

              <div className="flex justify-between border-b border-neutral-200/60 pb-3">
                <span className="text-neutral-400 uppercase tracking-wider font-semibold">Müştəri:</span>
                <span className="font-bold text-neutral-900 uppercase">{form.fullName}</span>
              </div>

              <div className="flex justify-between border-b border-neutral-200/60 pb-3">
                <span className="text-neutral-400 uppercase tracking-wider font-semibold">Əlaqə nömrəsi:</span>
                <span className="font-bold text-neutral-900 font-mono">{form.phone}</span>
              </div>

              <div className="flex justify-between border-b border-neutral-200/60 pb-3">
                <span className="text-neutral-400 uppercase tracking-wider font-semibold">Ünvan:</span>
                <span className="font-bold text-neutral-900">{form.city}, {form.address}</span>
              </div>

              <div className="flex justify-between border-b border-neutral-200/60 pb-3">
                <span className="text-neutral-400 uppercase tracking-wider font-semibold">Ödəniş üsulu:</span>
                <span className="font-bold text-neutral-900 uppercase text-[9px] text-right">
                  {form.paymentMethod === 'cash_delivery' && form.depositMethod === 'pasha_bank' && 'Nağd (Qapıda) — Beh: PASHA Bank'}
                  {form.paymentMethod === 'cash_delivery' && form.depositMethod === 'whatsapp' && 'Nağd (Qapıda) — Beh: WhatsApp'}
                  {form.paymentMethod === 'card_delivery' && 'Kartla ödəniş (Qapıda)'}
                  {form.paymentMethod === 'online_card' && 'Onlayn ödəniş (Uğurlu)'}
                </span>
              </div>

              <div className="pt-2">
                <span className="text-neutral-400 uppercase tracking-wider font-semibold block mb-2">Sifariş edilən məhsullar:</span>
                <div className="space-y-2">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-neutral-700">
                      <span>{item.product.name} {item.selectedShade ? `(${item.selectedShade.name})` : ''} x{item.quantity}</span>
                      <span className="font-mono">{(item.product.price * item.quantity).toFixed(2)} ₼</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-3 flex justify-between font-bold text-sm text-neutral-900">
                <span>ÖDƏNİLƏN ÜMUMİ MƏBLƏĞ:</span>
                <span className="font-mono">{cartTotal.toFixed(2)} ₼</span>
              </div>
            </div>

            {/* WhatsApp deposit info for cash_delivery */}
            {form.depositMethod === 'whatsapp' && (
              <div className="border border-amber-200/40 bg-amber-50/30 p-6 space-y-4 rounded-xl text-left">
                <p className="text-[10px] font-bold tracking-widest uppercase text-amber-800">
                  ⚠️ 5 AZN BEH (REZERVASİYA) HAQQINDA
                </p>
                <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                  Sifarişinizin rezerv edilməsi üçün <strong>5 AZN beh</strong> tələb olunur. Menecerimiz WhatsApp vasitəsilə sizinlə əlaqə saxlayacaq və ödəniş üçün kart nömrəsi təqdim edəcək. Bu məbləğ ümumi sifariş məbləğindən çıxılacaq.
                </p>
                <p className="text-[10px] text-neutral-500 font-sans">
                  Behi ödədikdən sonra sifariş təsdiqlənəcək və kuryer çatdırılma üçün yola düşəcək.
                </p>
                <a
                  href={buildWhatsAppUrl({
                    orderNumber: generatedOrderNumber,
                    items: orderItems,
                    fullName: form.fullName,
                    phone: form.phone,
                    city: form.city,
                    address: form.address,
                    total: cartTotal,
                    depositMethod: 'whatsapp',
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 bg-[#25D366] text-white w-full px-5 py-3.5 text-[9px] font-bold uppercase tracking-widest hover:bg-[#20ba56] transition-colors rounded-xl"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.023-5.115-2.887-6.979C16.58 1.898 14.1 1.842 11.983 1.842c-5.441 0-9.866 4.423-9.87 9.867 0 1.724.462 3.411 1.338 4.907L2.453 20.35l3.993-1.047c-.001-.001-.001-.001 0 0z"/></svg>
                  <span>MENECERLƏ WHATSAPP-DA ƏLAQƏ</span>
                </a>
              </div>
            )}

            {/* Deposit paid via Pasha Bank — show WhatsApp too */}
            {form.paymentMethod === 'cash_delivery' && form.depositMethod === 'pasha_bank' && (
              <div className="border border-emerald-200/40 bg-emerald-50/30 p-6 space-y-4 rounded-xl text-left">
                <p className="text-[10px] font-bold tracking-widest uppercase text-emerald-800">
                  ✅ 5 AZN BEH ÖDƏNİLDİ!
                </p>
                <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                  Beh uğurla ödənildi. Qalan məbləği kuryerə çatdırılma zamanı nağd şəkildə ödəyəcəksiniz.
                </p>
              </div>
            )}

            <div className="space-y-4">
              <p className="text-[11px] text-neutral-400 leading-relaxed font-sans max-w-sm mx-auto">
                Kuryerimiz sifarişi təsdiqləmək və çatdırılma vaxtını dəqiqləşdirmək üçün yaxın 15 dəqiqə ərzində sizinlə əlaqə saxlayacaqdır.
              </p>
              
              {!user && (
                <div className="border border-neutral-200 bg-neutral-50 p-5 space-y-3 rounded-xl">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-900">
                    Sifarişlərinizi izləmək üçün hesab yaradın
                  </p>
                  <p className="text-[9px] text-neutral-500 font-sans leading-relaxed">
                    Sifariş statusunuzu izləmək, əvvəlki sifarişlərinizə baxmaq və daha sürətli alış-veriş etmək üçün qeydiyyatdan keçin.
                  </p>
                  <button
                    onClick={() => window.location.href = '/?register=1'}
                    className="w-full bg-neutral-950 text-white text-[10px] font-bold tracking-widest uppercase py-3 border border-neutral-950 hover:bg-transparent hover:text-neutral-900 transition-colors cursor-pointer"
                  >
                    QEYDİYYATDAN KEÇ
                  </button>
                </div>
              )}

              <button
                onClick={handleFinish}
                className="w-full sm:w-auto bg-neutral-950 text-white text-[10px] tracking-widest font-bold uppercase px-8 py-4 border border-neutral-950 hover:bg-transparent hover:text-neutral-900 transition-colors duration-300 cursor-pointer"
              >
                MAĞAZAYA QAYIT
              </button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-[#FAF9F6] text-neutral-900 min-h-screen font-sans">
      <Container>
        {/* Navigation back */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center space-x-2 text-[10px] tracking-widest text-neutral-400 hover:text-neutral-900 uppercase font-bold mb-8 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
          <span>ALIŞ-VERİŞƏ DAVAM ET</span>
        </button>

        <h1 className="text-xl sm:text-2xl font-bold tracking-widest uppercase text-neutral-900 mb-10 text-center sm:text-left">
          SİFARİŞİN TAMAMLANMASI VƏ TƏSDİQLƏNMƏSİ
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center bg-white border border-neutral-100 p-12 py-20 space-y-6 max-w-md mx-auto rounded-xl">
            <ShoppingBag className="h-12 w-12 text-neutral-200 mx-auto stroke-1" />
            <div className="space-y-1">
              <h3 className="text-xs font-bold tracking-widest uppercase text-neutral-900">Səbətiniz boşdur</h3>
              <p className="text-xs text-neutral-400">Ödəniş etmək üçün səbətinizə məhsul əlavə etməlisiniz.</p>
            </div>
            <Link href="/" className="block">
              <button className="bg-neutral-950 text-white text-[10px] tracking-widest font-bold uppercase py-3.5 px-6 border border-neutral-950 hover:bg-transparent hover:text-neutral-900 transition-colors duration-300">
                MƏHSULLARI KƏŞF ET
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left: Input Form details */}
            <div className="lg:col-span-7 bg-white border border-neutral-100 p-6 sm:p-8 space-y-8 shadow-xs rounded-xl">
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
                {/* Section 1: Customer Details */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 border-b border-neutral-100 pb-2">
                    <User className="h-4 w-4 text-neutral-800" />
                    <h2 className="text-xs font-bold tracking-widest uppercase text-neutral-900">1. ŞƏXSİ MƏLUMATLAR</h2>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] tracking-wider uppercase font-semibold text-neutral-500">AD VƏ SOYADINIZ *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleInputChange}
                      placeholder="Məs. Aytən Məmmədova"
                      className={`w-full bg-neutral-50 border ${formErrors.fullName ? 'border-red-500' : 'border-neutral-200'} text-xs px-4 py-3 focus:outline-hidden focus:border-neutral-950 rounded-xl`}
                    />
                    {formErrors.fullName && <span className="text-[9px] font-semibold text-red-500 uppercase">{formErrors.fullName}</span>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] tracking-wider uppercase font-semibold text-neutral-500">TELEFON NÖMRƏSİ *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleInputChange}
                          placeholder="+994702453060"
                          className={`w-full bg-neutral-50 border ${formErrors.phone ? 'border-red-500' : 'border-neutral-200'} text-xs pl-10 pr-4 py-3 focus:outline-hidden focus:border-neutral-950 rounded-xl`}
                        />
                      </div>
                      {formErrors.phone && <span className="text-[9px] font-semibold text-red-500 uppercase">{formErrors.phone}</span>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] tracking-wider uppercase font-semibold text-neutral-500">E-POÇT ÜNVANI (OPSİONAL)</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleInputChange}
                          placeholder="ayten@gmail.com"
                          className="w-full bg-neutral-50 border border-neutral-200 text-xs pl-10 pr-4 py-3 focus:outline-hidden focus:border-neutral-950 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Shipping details */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 border-b border-neutral-100 pb-2">
                    <MapPin className="h-4 w-4 text-neutral-800" />
                    <h2 className="text-xs font-bold tracking-widest uppercase text-neutral-900">2. ÇATDIRILMA ÜNVANI</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1 sm:col-span-1">
                      <label className="text-[10px] tracking-wider uppercase font-semibold text-neutral-500">ŞƏHƏR / RAYON *</label>
                      <select
                        name="city"
                        value={form.city}
                        onChange={handleInputChange}
                        className="w-full bg-neutral-50 border border-neutral-200 text-xs px-3 py-3 focus:outline-hidden focus:border-neutral-950 cursor-pointer rounded-xl"
                      >
                        <option value="Bakı">Bakı (Pulsuz)</option>
                        <option value="Sumqayıt">Sumqayıt (Pulsuz)</option>
                        <option value="Xırdalan">Xırdalan (Pulsuz)</option>
                        <option value="Gəncə">Gəncə (Azərpoçt)</option>
                        <option value="Naxçıvan">Naxçıvan (Azərpoçt)</option>
                        <option value="Lənkəran">Lənkəran (Azərpoçt)</option>
                        <option value="Quba">Quba (Azərpoçt)</option>
                        <option value="Şəki">Şəki (Azərpoçt)</option>
                      </select>
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[10px] tracking-wider uppercase font-semibold text-neutral-500">TAM ÜNVAN *</label>
                      <input
                        type="text"
                        name="address"
                        value={form.address}
                        onChange={handleInputChange}
                        placeholder="Məs. Yasamal r., Mətbuat pr. ev 15, m. 42"
                        className={`w-full bg-neutral-50 border ${formErrors.address ? 'border-red-500' : 'border-neutral-200'} text-xs px-4 py-3 focus:outline-hidden focus:border-neutral-950 rounded-xl`}
                      />
                      {formErrors.address && <span className="text-[9px] font-semibold text-red-500 uppercase">{formErrors.address}</span>}
                    </div>
                  </div>
                </div>

                {/* Section 3: Payment details */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 border-b border-neutral-100 pb-2">
                    <CreditCard className="h-4 w-4 text-neutral-800" />
                    <h2 className="text-xs font-bold tracking-widest uppercase text-neutral-900">3. ÖDƏNİŞ ÜSULU</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Online payment */}
                    <label className={`border p-5 flex flex-col justify-between space-y-3 cursor-pointer transition-all duration-300 relative rounded-xl ${
                      form.paymentMethod === 'online_card'
                        ? 'border-neutral-950 bg-neutral-50/50 shadow-xs sm:col-span-2'
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online_card"
                        checked={form.paymentMethod === 'online_card'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold tracking-wider uppercase flex items-center space-x-1.5">
                          <span>KARTLA ONLAYN</span>
                        </span>
                        {form.paymentMethod === 'online_card' ? (
                          <span className="w-2.5 h-2.5 rounded-full bg-neutral-950 animate-pulse" />
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full border border-neutral-300" />
                        )}
                      </div>
                      <span className="text-xs sm:text-sm text-emerald-600 font-bold tracking-wide text-center font-display">
                        Visa, MasterCard, BirKart və ya Tamkart ilə dərhal və tam təhlükəsiz ödəniş.
                      </span>

                      {/* When NOT selected: mini badge only */}
                      {form.paymentMethod !== 'online_card' && (
                        <div className="pt-2.5 border-t border-neutral-200/60 flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M2.166 4.9L10 1.154l7.834 3.746A1 1 0 0118.5 5.8v4.962a9 9 0 01-5.367 8.232l-2.766 1.155a1 1 0 01-.734 0l-2.766-1.155A9 9 0 011.5 10.762V5.8a1 1 0 01.666-.9zM10 3.146L3.5 6.257V10.76a7 7 0 004.174 6.403l2.326.97 2.326-.97a7 7 0 004.174-6.403V6.257L10 3.146zM13.707 8.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-[8.5px] font-bold text-neutral-500 tracking-wider">PASHA Bank Acquiring</span>
                          </div>
                          <Image src="/images/pashabank-logo.svg" alt="PASHA Bank" width={55} height={14} className="h-3.5 w-auto opacity-70" />
                        </div>
                      )}

                      {/* When selected + redirecting: transition animation */}
                      {form.paymentMethod === 'online_card' && isRedirecting && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="pt-2 border-t border-neutral-200/60"
                        >
                          <SecurePaymentTransition redirectUrl={redirectUrl} />
                        </motion.div>
                      )}

                      {/* When selected + NOT redirecting: live animated card */}
                      {form.paymentMethod === 'online_card' && !isRedirecting && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.35 }}
                          className="pt-2 border-t border-neutral-200/60"
                        >
                          <SecurePaymentAnimation />
                        </motion.div>
                      )}
                    </label>

                    {/* COD Cash — QAPIDA NAĞD */}
                    <label className={`border p-5 flex flex-col space-y-3 cursor-pointer transition-all duration-300 relative rounded-xl ${
                      form.paymentMethod === 'cash_delivery'
                        ? 'border-neutral-950 bg-neutral-50/50 shadow-xs sm:col-span-2'
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash_delivery"
                        checked={form.paymentMethod === 'cash_delivery'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold tracking-wider uppercase">QAPIDA NAĞD</span>
                        {form.paymentMethod === 'cash_delivery' ? (
                          <span className="w-2.5 h-2.5 rounded-full bg-neutral-950" />
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full border border-neutral-300" />
                        )}
                      </div>
                      <span className="text-[10px] text-neutral-500 leading-normal font-sans">
                        Kuryer ünvanınıza yaxınlaşdıqda nağd ödəniş. Rezerv üçün 5 AZN beh tələb olunur.
                      </span>

                      {/* Cash delivery reservation note info row */}
                      <div className="pt-2.5 border-t border-neutral-200/60 flex items-center justify-between text-amber-700">
                        <div className="flex items-center space-x-1">
                          <span className="text-[8.5px] font-bold uppercase tracking-wider flex items-center space-x-1">
                            <span>⚠️ 5 AZN Öncədən Ödəniş (Beh)</span>
                          </span>
                        </div>
                        <span className="text-[8px] text-neutral-400 font-sans tracking-wide">Rezervasiya tələb olunur</span>
                      </div>

                      {/* Sub-options when cash_delivery selected */}
                      {form.paymentMethod === 'cash_delivery' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="pt-3 border-t border-neutral-200/60 space-y-2"
                        >
                          <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-2">BEH ÖDƏNİŞ ÜSULUNU SEÇİN:</p>

                          {/* Pasha Bank deposit option */}
                          <label onClick={e => e.stopPropagation()} className={`flex items-center gap-3 p-3 border cursor-pointer transition-all rounded-xl ${
                            form.depositMethod === 'pasha_bank'
                              ? 'border-emerald-400 bg-emerald-50/30'
                              : 'border-neutral-200 hover:border-neutral-400'
                          }`}>
                            <input
                              type="radio"
                              name="depositMethod"
                              value="pasha_bank"
                              checked={form.depositMethod === 'pasha_bank'}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              form.depositMethod === 'pasha_bank' ? 'border-emerald-600' : 'border-neutral-300'
                            }`}>
                              {form.depositMethod === 'pasha_bank' && <div className="w-2 h-2 rounded-full bg-emerald-600" />}
                            </div>
                            <div className="flex-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-900 block">PASHA Bank — 5 AZN</span>
                              <span className="text-[9px] text-neutral-500 font-sans">Behi onlayn kartla ödəyin, qalanı qapıda nağd</span>
                            </div>
                            <Image src="/images/pashabank-logo.svg" alt="PASHA Bank" width={55} height={14} className="h-3 w-auto opacity-60" />
                          </label>

                          {/* WhatsApp deposit option */}
                          <label onClick={e => e.stopPropagation()} className={`flex items-center gap-3 p-3 border cursor-pointer transition-all rounded-xl ${
                            form.depositMethod === 'whatsapp'
                              ? 'border-emerald-400 bg-emerald-50/30'
                              : 'border-neutral-200 hover:border-neutral-400'
                          }`}>
                            <input
                              type="radio"
                              name="depositMethod"
                              value="whatsapp"
                              checked={form.depositMethod === 'whatsapp'}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              form.depositMethod === 'whatsapp' ? 'border-emerald-600' : 'border-neutral-300'
                            }`}>
                              {form.depositMethod === 'whatsapp' && <div className="w-2 h-2 rounded-full bg-emerald-600" />}
                            </div>
                            <div className="flex-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-900 block">WhatsApp — Menecer kart-karta</span>
                              <span className="text-[9px] text-neutral-500 font-sans">Sifariş yaradılsın, menecer WhatsApp-da əlaqə saxlasın</span>
                            </div>
                            <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.023-5.115-2.887-6.979C16.58 1.898 14.1 1.842 11.983 1.842c-5.441 0-9.866 4.423-9.87 9.867 0 1.724.462 3.411 1.338 4.907L2.453 20.35l3.993-1.047c-.001-.001-.001-.001 0 0z"/></svg>
                          </label>

                          {/* Info block based on selection */}
                          {form.depositMethod === 'pasha_bank' && (
                            <div className="bg-white border border-emerald-100/70 p-3 text-[10px] text-neutral-600 leading-relaxed font-sans rounded-xl">
                              <strong className="text-emerald-700">5 AZN</strong> beh PASHA Bank ilə onlayn ödəniləcək. Qalan məbləği ({cartTotal >= 5 ? (cartTotal - 5).toFixed(2) : '0.00'} ₼) kuryerə çatdırılma zamanı nağd ödəyəcəksiniz.
                            </div>
                          )}
                          {form.depositMethod === 'whatsapp' && (
                            <div className="bg-white border border-amber-100/70 p-3 text-[10px] text-neutral-600 leading-relaxed font-sans rounded-xl">
                              Sifariş yaradıldıqdan sonra menecerimiz <strong>WhatsApp</strong> vasitəsilə sizinlə əlaqə saxlayacaq və 5 AZN beh üçün kart nömrəsi təqdim edəcək.
                            </div>
                          )}
                        </motion.div>
                      )}
                    </label>
                  </div>

                </div>

                {orderError && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
                    <p className="text-[10px] font-semibold text-red-600 uppercase tracking-wider">{orderError}</p>
                  </div>
                )}

                {/* Sentinel for sticky submit detection */}
                <div ref={submitSentinelRef} className="h-1" />

                {/* Form Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-neutral-950 text-white text-[10px] tracking-widest font-bold uppercase py-4 border border-neutral-950 hover:bg-transparent hover:text-neutral-900 transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center space-x-2">
                      <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                      <span>SİFARİŞ GÖNDƏRİLİR...</span>
                    </span>
                  ) : (
                    <span>SİFARİŞİ TƏSDİQLƏ VƏ TAMAMLA</span>
                  )}
                </button>
              </form>
            </div>

            {/* Fixed bottom submit bar */}
            <div className={`fixed bottom-14 md:bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 p-3 shadow-lg transition-opacity duration-300 ${
              showStickySubmit ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}>
              <button
                onClick={() => formRef.current?.requestSubmit()}
                disabled={isSubmitting}
                className="w-full bg-neutral-950 text-white text-[10px] tracking-widest font-bold uppercase py-3.5 border border-neutral-950 hover:bg-transparent hover:text-neutral-900 transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center space-x-2">
                    <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                    <span>SİFARİŞ GÖNDƏRİLİR...</span>
                  </span>
                ) : (
                  <span>SİFARİŞİ TƏSDİQLƏ VƏ TAMAMLA</span>
                )}
              </button>
            </div>

            {/* Right: Cart Summary Column */}
            <div className="lg:col-span-5 bg-white border border-neutral-100 p-6 space-y-6 shadow-xs sticky top-28 rounded-xl">
              <h2 className="text-xs font-bold tracking-widest uppercase text-neutral-900 border-b border-neutral-100 pb-3">
                SƏBƏTİNİZİN XÜLASƏSİ
              </h2>

              <div className="divide-y divide-neutral-100 max-h-[300px] overflow-y-auto pr-1">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex space-x-4 py-3.5 first:pt-0">
                    <div className="relative h-16 w-12 bg-neutral-50 flex-shrink-0 border border-neutral-100">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between text-xs">
                      <div>
                        <h4 className="font-bold uppercase text-neutral-900 tracking-wide">{item.product.name}</h4>
                        <p className="text-[10px] text-neutral-400 font-sans line-clamp-1">{item.product.subtitle}</p>
                        {item.selectedShade && (
                          <div className="flex items-center space-x-1.5 mt-1">
                            <span className="w-2 h-2 rounded-full border border-neutral-200" style={{ backgroundColor: item.selectedShade.colorHex }} />
                            <span className="text-[8px] text-neutral-500 uppercase tracking-widest">{item.selectedShade.name}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-baseline pt-1 font-sans">
                        <span className="text-neutral-400">Miqdar: <span className="font-bold text-neutral-800">{item.quantity}</span></span>
                        <span className="font-semibold font-mono text-neutral-900">{(item.product.price * item.quantity).toFixed(2)} ₼</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals Section */}
              <div className="border-t border-neutral-100 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-500">
                  <span className="tracking-wider uppercase">CƏMİ:</span>
                  <span className="font-mono font-semibold text-neutral-950">{cartTotal.toFixed(2)} ₼</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span className="tracking-wider uppercase">ÇATDIRILMA:</span>
                  <span className="font-semibold text-emerald-600 tracking-wider">PULSUZ</span>
                </div>

                {form.paymentMethod === 'cash_delivery' && (
                  <>
                    <div className="flex justify-between text-amber-700 bg-amber-50/50 p-2 border border-amber-100/50">
                      <span className="tracking-wider uppercase font-semibold">⚠️ ÖNCƏDƏN REZERVASİYA BEHİ:</span>
                      <span className="font-mono font-bold">5.00 ₼</span>
                    </div>
                    <div className="flex justify-between text-neutral-500">
                      <span className="tracking-wider uppercase">QAPIDA ÖDƏNİLƏCƏK QALIQ:</span>
                      <span className="font-mono font-semibold text-neutral-950">
                        {cartTotal >= 5 ? (cartTotal - 5).toFixed(2) : "0.00"} ₼
                      </span>
                    </div>
                  </>
                )}

                <div className="border-t border-neutral-100 pt-3 flex justify-between font-bold text-sm text-neutral-950">
                  <span>ÜMUMİ SİFARİŞ MƏBLƏĞİ:</span>
                  <span className="font-mono text-base">{cartTotal.toFixed(2)} ₼</span>
                </div>
              </div>

              {/* Secure Checkout Banner */}
              <div className="bg-[#FAF9F6] p-4 border border-neutral-150/60 flex items-start space-x-3 text-[11px] text-neutral-500 leading-relaxed font-sans rounded-xl">
                <ShieldCheck className="h-5 w-5 text-neutral-800 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-neutral-800">100% GÜVƏNLİ ALIŞ-VERİŞ</p>
                  <p>TAPLA MARKETPLACE-də bütün əməliyyatlarınız SSL təhlükəsizlik protokolları ilə tam şifrələnir və qorunur.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
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
