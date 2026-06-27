'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquareCode, Gift, Flame, ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/store/CartContext';
import { useAuth } from '@/components/auth/AuthContext';

export function StickyMobileBar() {
  const { setIsCartOpen, cartCount } = useCart();
  const { user, openLogin } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const handleSupportClick = () => {
    alert('TAPLA MARKETPLACE Müştəri Xidmətləri: WhatsApp (+994 55 123-45-67) və ya Onlayn Çat vasitəsilə 24/7 xidmətinizdəyik!');
  };

  const handleDiscountClick = () => {
    alert('TAPLA MARKETPLACE-ə xoş gəldiniz! İlk sifarişinizə xüsusi endirim kodu mövcuddur.');
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-black text-white border-t border-neutral-900 grid grid-cols-4 h-14 text-[9px] tracking-widest font-semibold uppercase font-sans">

      <button
        onClick={handleSupportClick}
        className="flex flex-col items-center justify-center space-y-1.5 border-r border-neutral-900 active:bg-neutral-900 transition-colors cursor-pointer"
      >
        <MessageSquareCode className="h-4 w-4 text-neutral-300" />
        <span>YAZIN BİZƏ</span>
      </button>

      <button
        onClick={() => user ? window.location.href = '/profile' : openLogin()}
        className="flex flex-col items-center justify-center space-y-1.5 border-r border-neutral-900 active:bg-neutral-900 transition-colors cursor-pointer"
      >
        <User className="h-4 w-4 text-neutral-300" />
        <span>{user ? 'PROFİL' : 'DAXİL OL'}</span>
      </button>

      <a
        href="#products"
        className="flex flex-col items-center justify-center space-y-1.5 border-r border-neutral-900 active:bg-neutral-900 transition-colors"
      >
        <Flame className="h-4 w-4 text-red-400" />
        <span>KAMPANİYALAR</span>
      </a>

      <button
        onClick={() => setIsCartOpen(true)}
        className="flex flex-col items-center justify-center space-y-1.5 relative active:bg-neutral-900 transition-colors cursor-pointer"
      >
        <ShoppingCart className="h-4 w-4 text-neutral-300" />
        <span>SƏBƏT</span>
        {mounted && cartCount > 0 && (
          <span className="absolute top-2 right-4 bg-white text-black text-[8px] font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

    </div>
  );
}
