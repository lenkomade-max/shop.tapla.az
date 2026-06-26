'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

interface CheckoutForm {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  paymentMethod: 'cash_delivery' | 'card_delivery' | 'online_card';
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
}

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [generatedOrderNumber, setGeneratedOrderNumber] = useState('');
  
  // Local form state
  const [form, setForm] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    city: 'Bakı',
    address: '',
    paymentMethod: 'cash_delivery',
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

  if (!mounted) {
    return <div className="min-h-screen bg-[#FAF9F6] pt-32 text-center text-xs uppercase tracking-widest font-mono">Yüklənir...</div>;
  }

  const validateForm = () => {
    const errors: Partial<Record<keyof CheckoutForm, string>> = {};
    if (!form.firstName.trim()) errors.firstName = 'Adınızı daxil edin';
    if (!form.lastName.trim()) errors.lastName = 'Soyadınızı daxil edin';
    if (!form.phone.trim()) errors.phone = 'Əlaqə nömrənizi daxil edin';
    if (!form.address.trim()) errors.address = 'Çatdırılma ünvanını daxil edin';
    
    if (form.paymentMethod === 'online_card') {
      if (form.cardNumber.replace(/\s/g, '').length !== 16) {
        errors.cardNumber = 'Düzgün kart nömrəsi daxil edin (16 rəqəm)';
      }
      if (!/^\d{2}\/\d{2}$/.test(form.cardExpiry)) {
        errors.cardExpiry = 'AA/İİ formatında daxil edin';
      }
      if (form.cardCvv.length !== 3) {
        errors.cardCvv = 'CVV 3 rəqəmli olmalıdır';
      }
    }

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate database record creation & stripe processing
    setTimeout(() => {
      const randomId = 'ALN-' + Math.floor(100000 + Math.random() * 900000);
      setGeneratedOrderNumber(randomId);
      setIsSubmitting(false);
      setOrderConfirmed(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
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
          <div className="max-w-2xl mx-auto bg-white border border-neutral-100 p-8 sm:p-12 text-center space-y-8 shadow-sm">
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
                Təbrik edirik! Aluna premium gözəllik cihazları ilə mükəmməl dəri qulluğu ritualına başlamaq üçün ilk addımı atdınız.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="bg-neutral-50 p-6 border border-neutral-100 text-left space-y-4 font-sans text-xs">
              <div className="flex justify-between border-b border-neutral-200/60 pb-3">
                <span className="text-neutral-400 uppercase tracking-wider font-semibold">Sifariş nömrəsi:</span>
                <span className="font-bold text-neutral-900 font-mono">{generatedOrderNumber}</span>
              </div>

              <div className="flex justify-between border-b border-neutral-200/60 pb-3">
                <span className="text-neutral-400 uppercase tracking-wider font-semibold">Müştəri:</span>
                <span className="font-bold text-neutral-900 uppercase">{form.firstName} {form.lastName}</span>
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
                <span className="font-bold text-neutral-900 uppercase">
                  {form.paymentMethod === 'cash_delivery' && 'Nağd ödəniş (Qapıda)'}
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

            <div className="space-y-4">
              <p className="text-[11px] text-neutral-400 leading-relaxed font-sans max-w-sm mx-auto">
                Kuryerimiz sifarişi təsdiqləmək və çatdırılma vaxtını dəqiqləşdirmək üçün yaxın 15 dəqiqə ərzində sizinlə əlaqə saxlayacaqdır.
              </p>
              
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
        <Link 
          href="/" 
          className="inline-flex items-center space-x-2 text-[10px] tracking-widest text-neutral-400 hover:text-neutral-900 uppercase font-bold mb-8 transition-colors"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
          <span>ALIŞ-VERİŞƏ DAVAM ET</span>
        </Link>

        <h1 className="text-xl sm:text-2xl font-bold tracking-widest uppercase text-neutral-900 mb-10 text-center sm:text-left">
          SİFARİŞİN TAMAMLANMASI VƏ TƏSDİQLƏNMƏSİ
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center bg-white border border-neutral-100 p-12 py-20 space-y-6 max-w-md mx-auto">
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
            <div className="lg:col-span-7 bg-white border border-neutral-100 p-6 sm:p-8 space-y-8 shadow-xs">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section 1: Customer Details */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 border-b border-neutral-100 pb-2">
                    <User className="h-4 w-4 text-neutral-800" />
                    <h2 className="text-xs font-bold tracking-widest uppercase text-neutral-900">1. ŞƏXSİ MƏLUMATLAR</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] tracking-wider uppercase font-semibold text-neutral-500">ADINIZ *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleInputChange}
                        placeholder="Məs. Aytən"
                        className={`w-full bg-neutral-50 border ${formErrors.firstName ? 'border-red-500' : 'border-neutral-200'} text-xs px-4 py-3 focus:outline-hidden focus:border-neutral-950`}
                      />
                      {formErrors.firstName && <span className="text-[9px] font-semibold text-red-500 uppercase">{formErrors.firstName}</span>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] tracking-wider uppercase font-semibold text-neutral-500">SOYADINIZ *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleInputChange}
                        placeholder="Məs. Məmmədova"
                        className={`w-full bg-neutral-50 border ${formErrors.lastName ? 'border-red-500' : 'border-neutral-200'} text-xs px-4 py-3 focus:outline-hidden focus:border-neutral-950`}
                      />
                      {formErrors.lastName && <span className="text-[9px] font-semibold text-red-500 uppercase">{formErrors.lastName}</span>}
                    </div>
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
                          placeholder="+994 (55) 123-45-67"
                          className={`w-full bg-neutral-50 border ${formErrors.phone ? 'border-red-500' : 'border-neutral-200'} text-xs pl-10 pr-4 py-3 focus:outline-hidden focus:border-neutral-950`}
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
                          className="w-full bg-neutral-50 border border-neutral-200 text-xs pl-10 pr-4 py-3 focus:outline-hidden focus:border-neutral-950"
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
                        className="w-full bg-neutral-50 border border-neutral-200 text-xs px-3 py-3 focus:outline-hidden focus:border-neutral-950 cursor-pointer"
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
                        className={`w-full bg-neutral-50 border ${formErrors.address ? 'border-red-500' : 'border-neutral-200'} text-xs px-4 py-3 focus:outline-hidden focus:border-neutral-950`}
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
                    <label className={`border p-5 flex flex-col justify-between space-y-3 cursor-pointer transition-all duration-300 relative ${
                      form.paymentMethod === 'online_card' ? 'border-neutral-950 bg-neutral-50/50 shadow-xs' : 'border-neutral-200 hover:border-neutral-400'
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
                      <span className="text-[10px] text-neutral-500 leading-normal font-sans">
                        Visa, MasterCard, BirKart və ya Tamkart ilə dərhal və tam təhlükəsiz ödəniş.
                      </span>

                      {/* Pasha Bank securing badge */}
                      <div className="pt-2.5 border-t border-neutral-200/60 flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M2.166 4.9L10 1.154l7.834 3.746A1 1 0 0118.5 5.8v4.962a9 9 0 01-5.367 8.232l-2.766 1.155a1 1 0 01-.734 0l-2.766-1.155A9 9 0 011.5 10.762V5.8a1 1 0 01.666-.9zM10 3.146L3.5 6.257V10.76a7 7 0 004.174 6.403l2.326.97 2.326-.97a7 7 0 004.174-6.403V6.257L10 3.146zM13.707 8.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-[8.5px] font-bold text-neutral-500 tracking-wider">PASHA Bank Acquiring</span>
                        </div>
                        {/* Pasha Bank Micro-logo SVG */}
                        <div className="flex items-center space-x-1 opacity-90 scale-95">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 50L40 20H55L35 50L55 80H40L20 50Z" fill="#0A3C94" />
                            <path d="M42 50L62 20H77L57 50L77 80H62L42 50Z" fill="#F0B800" />
                            <path d="M64 50L84 20H99L79 50L99 80H84L64 50Z" fill="#20C060" />
                          </svg>
                          <span className="text-[8.5px] font-black text-[#0E1E38] tracking-tight">PASHA Bank</span>
                        </div>
                      </div>
                    </label>

                    {/* COD Cash */}
                    <label className={`border p-5 flex flex-col justify-between space-y-3 cursor-pointer transition-all duration-300 relative ${
                      form.paymentMethod === 'cash_delivery' ? 'border-neutral-950 bg-neutral-50/50 shadow-xs' : 'border-neutral-200 hover:border-neutral-400'
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
                    </label>
                  </div>

                  {/* Cash Delivery Beh Info Block */}
                  {form.paymentMethod === 'cash_delivery' && (
                    <div className="bg-amber-50/30 border border-amber-200/40 p-5 space-y-3.5 transition-all duration-300 animate-fadeIn">
                      <p className="text-[10px] font-bold tracking-widest uppercase text-amber-800 flex items-center space-x-1.5">
                        <span className="bg-amber-100 px-1.5 py-0.5 rounded-sm">⚠️</span>
                        <span>SİFARİŞİN REZERVASİYASI (5 AZN BEH) SİSTEMİ</span>
                      </p>
                      <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                        Qapıda nağd ödəniş seçimində kuryerin ünvanınıza rezerv edilməsi üçün <strong>5 AZN beh</strong> (öncədən ödəniş) ödənilməlidir. Bu ödəniş ümumi məbləğdən çıxılacaqdır və qalan məbləği qapıda ödəyəcəksiniz.
                      </p>
                      <div className="bg-white p-3.5 border border-amber-100/70 space-y-2 text-[11px] text-neutral-700">
                        <p className="font-semibold text-neutral-800">Rezervasiya ödənişini necə edə bilərsiniz?</p>
                        <ul className="list-disc list-inside space-y-1.5 font-sans text-xs text-neutral-600">
                          <li>Sifarişi tamamladıqdan sonra menecerimiz <strong>WhatsApp</strong> vasitəsilə əlaqə saxlayaraq sizə beh üçün kart nömrəsi təqdim edəcək.</li>
                          <li>Və ya dərhal <strong>&quot;KARTLA ONLAYN&quot;</strong> seçimini edərək ümumi məbləği tam təhlükəsiz şəkildə onlayn ödəyə bilərsiniz.</li>
                        </ul>
                      </div>
                      <div className="pt-1 flex flex-col sm:flex-row gap-3">
                        <a
                          href="https://wa.me/994503003030?text=Salam,%20Aluna-da%20na%C4%9Fd%20sifari%C5%9Fi%20%C3%BC%C3%A7%C3%BCn%205%20AZN%20beh%20%C3%B6d%C9%99m%C9%99k%20ist%C9%99yir%C9%99m"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center space-x-2 bg-[#25D366] text-white px-5 py-3 text-[9px] font-bold uppercase tracking-widest hover:bg-[#20ba56] transition-colors"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.023-5.115-2.887-6.979C16.58 1.898 14.1 1.842 11.983 1.842c-5.441 0-9.866 4.423-9.87 9.867 0 1.724.462 3.411 1.338 4.907L2.453 20.35l3.993-1.047c-.001-.001-.001-.001 0 0z" />
                          </svg>
                          <span>WHATSAPP MENECERLƏ ƏLAQƏ</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {/* If Online Payment is chosen, reveal interactive card inputs */}
                  {form.paymentMethod === 'online_card' && (
                    <div className="bg-neutral-50 border border-neutral-200 p-5 space-y-4 transition-all duration-300 animate-fadeIn">
                      {/* Pasha Bank secure checkout banner */}
                      <div className="bg-white p-3.5 border border-neutral-200/80 flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-[9px] font-bold text-[#0E1E38] tracking-widest uppercase">PASHA Bank Acquiring</p>
                          <p className="text-[9px] text-neutral-500 font-sans leading-none">128-bit SSL Şifrələmə ilə Tam Təhlükəsiz Ödəniş Sistemi</p>
                        </div>
                        {/* Pasha Bank elegant logo in the payment form */}
                        <div className="flex items-center space-x-1.5 bg-neutral-950 px-2.5 py-1.5 rounded-none border border-neutral-850">
                          <svg className="w-4.5 h-4.5" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 50L40 20H55L35 50L55 80H40L20 50Z" fill="#20C060" />
                            <path d="M42 50L62 20H77L57 50L77 80H62L42 50Z" fill="#F0B800" />
                            <path d="M64 50L84 20H99L79 50L99 80H84L64 50Z" fill="#FFFFFF" />
                          </svg>
                          <div className="flex flex-col leading-none">
                            <span className="text-[8px] font-black text-white tracking-widest font-sans">PASHA</span>
                            <span className="text-[6px] font-bold text-[#20C060] font-sans tracking-wider">Bank</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-[10px] font-bold tracking-wider uppercase text-neutral-600 flex items-center space-x-1.5">
                        <CreditCard className="h-3.5 w-3.5 text-neutral-900" />
                        <span>KART MƏLUMATLARINI DAXİL EDİN</span>
                      </p>

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold tracking-widest text-neutral-400">KART NÖMRƏSİ</label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={form.cardNumber}
                            onChange={handleInputChange}
                            placeholder="0000 0000 0000 0000"
                            className={`w-full bg-white border ${formErrors.cardNumber ? 'border-red-500' : 'border-neutral-200'} text-xs font-mono px-4 py-3 focus:outline-hidden focus:border-neutral-950`}
                          />
                          {formErrors.cardNumber && <p className="text-[9px] font-semibold text-red-500 uppercase">{formErrors.cardNumber}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold tracking-widest text-neutral-400">SON İSTİFADƏ (AA/İİ)</label>
                            <input
                              type="text"
                              name="cardExpiry"
                              value={form.cardExpiry}
                              onChange={handleInputChange}
                              placeholder="MM/YY"
                              className={`w-full bg-white border ${formErrors.cardExpiry ? 'border-red-500' : 'border-neutral-200'} text-xs font-mono px-4 py-3 focus:outline-hidden focus:border-neutral-950`}
                            />
                            {formErrors.cardExpiry && <p className="text-[9px] font-semibold text-red-500 uppercase">{formErrors.cardExpiry}</p>}
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-bold tracking-widest text-neutral-400">CVV / CVC</label>
                            <input
                              type="password"
                              name="cardCvv"
                              value={form.cardCvv}
                              onChange={handleInputChange}
                              placeholder="***"
                              className={`w-full bg-white border ${formErrors.cardCvv ? 'border-red-500' : 'border-neutral-200'} text-xs font-mono px-4 py-3 focus:outline-hidden focus:border-neutral-950`}
                            />
                            {formErrors.cardCvv && <p className="text-[9px] font-semibold text-red-500 uppercase">{formErrors.cardCvv}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

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

            {/* Right: Cart Summary Column */}
            <div className="lg:col-span-5 bg-white border border-neutral-100 p-6 space-y-6 shadow-xs sticky top-28">
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
              <div className="bg-[#FAF9F6] p-4 border border-neutral-150/60 flex items-start space-x-3 text-[11px] text-neutral-500 leading-relaxed font-sans">
                <ShieldCheck className="h-5 w-5 text-neutral-800 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-neutral-800">100% GÜVƏNLİ ALIŞ-VERİŞ</p>
                  <p>ALUNA-da bütün əməliyyatlarınız SSL təhlükəsizlik protokolları ilə tam şifrələnir və qorunur.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
