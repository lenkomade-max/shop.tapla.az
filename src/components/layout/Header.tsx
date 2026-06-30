'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Menu, X, ShoppingBag, Search, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '@/store/CartContext';
import { Drawer } from '@/components/ui/Drawer';
import { Badge } from '@/components/ui/Badge';
import { Container } from '@/components/ui/Container';
import { AnnouncementBar } from './AnnouncementBar';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { AuthButton } from '@/components/auth/AuthButton';
import type { Category } from '@/types';

interface HeaderProps {
  rootCategories?: Category[];
}

export function Header({ rootCategories = [] }: HeaderProps) {
  const router = useRouter();
  const {
    cartItems,
    cartCount,
    cartTotal,
    removeFromCart,
    updateQuantity,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  // Навигация: категории из БД + статические ссылки
  const navigationItems = useMemo(() => [
    {
      label: 'MƏHSULLAR',
      href: '/products',
      children: rootCategories.map(cat => ({
        label: cat.title,
        href: `/kateqoriya/${cat.slug}`,
      })),
    },
    {
      label: 'KAMPANİYALAR',
      href: '/#products',
      isBadge: true,
      badgeText: 'ENDİRİM',
    },
    {
      label: 'RƏYLƏR',
      href: '/#reviews',
    },
    {
      label: 'HAQQIMIZDA',
      href: '/about',
    },
    {
      label: 'FAQ / DƏSTƏK',
      href: '/#faq',
    },
  ], [rootCategories]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 50);
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCartOpen(false);
    router.push('/checkout');
  };

  return (
    <>
      <div className="absolute top-0 left-0 right-0 z-40">
        {isHomePage && !isScrolled && !isMobileMenuOpen && !isSearchOpen && <AnnouncementBar />}
        <header
          className={`transition-all duration-500 font-sans ${
            isHomePage && !isScrolled && !isMobileMenuOpen && !isSearchOpen
              ? 'relative bg-transparent text-white py-6'
              : 'fixed top-0 left-0 right-0 z-40 bg-white shadow-md py-4 text-neutral-900 border-b border-neutral-100'
          }`}
        >
        <Container>
          <div className="flex items-center justify-between">
            <div className="flex md:hidden items-center space-x-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1 cursor-pointer focus:outline-hidden"
                aria-label="Menyu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-1 cursor-pointer focus:outline-hidden"
                aria-label="Axtarış"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>

            <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold tracking-widest">
              {navigationItems.slice(0, 3).map((item) => (
                <div key={item.label} className="relative group">
                  <Link
                    href={item.href}
                    className="hover:opacity-75 transition-opacity py-2 flex items-center space-x-1 uppercase"
                  >
                    <span>{item.label}</span>
                    {item.isBadge && (
                      <span className="bg-neutral-900 text-white text-[8px] font-bold px-1.5 py-0.5 ml-1 select-none animate-pulse">
                        {item.badgeText}
                      </span>
                    )}
                  </Link>
                  {item.children && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-neutral-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-3 text-neutral-800">
                      {item.children.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="block px-4 py-2 hover:bg-neutral-50 hover:text-neutral-950 text-[11px] font-medium"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="flex justify-center text-center">
              <Link
                href="/"
                className="flex flex-col items-center hover:opacity-90 transition-opacity"
              >
                <span className="text-2xl sm:text-3xl font-serif tracking-[0.25em] font-light uppercase leading-none">
                  TAPLA
                </span>
                <span className="text-[10px] sm:text-xs tracking-[0.12em] font-sans font-medium uppercase text-neutral-500 leading-none mt-px">
                  MARKETPLACE
                </span>
              </Link>
            </div>

            <div className="flex items-center space-x-4 sm:space-x-6">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="hidden md:inline-block p-1 cursor-pointer hover:opacity-75 transition-opacity"
                aria-label="Axtar"
              >
                <Search className="h-5 w-5" />
              </button>

              <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold tracking-widest mr-4">
                {navigationItems.slice(3).map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="hover:opacity-75 transition-opacity uppercase"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <AuthButton />

              <button
                onClick={() => setIsCartOpen(true)}
                className="p-1 cursor-pointer hover:opacity-75 transition-opacity relative flex items-center space-x-1"
                aria-label="Səbət"
              >
                <ShoppingBag className="h-5 w-5" />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-neutral-950 text-white border border-white text-[8px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-bounce">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {isSearchOpen && (
            <div className="mt-4 border-t border-neutral-100 pt-4 flex items-center justify-between">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Məhsul, qulluq ritualları və ya texnologiya axtarın..."
                  className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 text-xs px-4 py-3 focus:outline-hidden focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950"
                  autoFocus
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 text-xs font-semibold cursor-pointer"
                >
                  BAĞLA
                </button>
              </div>
            </div>
          )}
        </Container>
      </header>
    </div>

      <Drawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} title="MENYU" position="left">
        <div className="flex flex-col space-y-6 pt-4">
          {navigationItems.map((item) => (
            <div key={item.label} className="border-b border-neutral-100 pb-3">
              <Link
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-semibold tracking-widest text-neutral-900 hover:text-neutral-600 block uppercase"
              >
                <div className="flex items-center justify-between">
                  <span>{item.label}</span>
                  {item.isBadge && (
                    <Badge variant="solid" size="sm">
                      {item.badgeText}
                    </Badge>
                  )}
                </div>
              </Link>
              {item.children && (
                <div className="mt-2 pl-3 space-y-2 flex flex-col text-xs text-neutral-500">
                  {item.children.map((sub) => (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="hover:text-neutral-900 block"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="pt-6">
            <p className="text-xs uppercase tracking-widest font-semibold text-neutral-500 block mb-2">
              Azərbaycan (AZN) | Bakı daxili pulsuz
            </p>
          </div>
        </div>
      </Drawer>

      <Drawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} title="SƏBƏTİNİZ">
        <div className="flex flex-col h-full justify-between pb-8">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20 space-y-4">
              <ShoppingBag className="h-10 w-10 text-neutral-300 stroke-1" />
              <div className="space-y-1">
                <p className="text-xs font-semibold tracking-widest text-neutral-900 uppercase">Səbətiniz boşdur</p>
                <p className="text-xs text-neutral-400 font-sans">Premium məhsulları kəşf edərək dərhal sifariş edin.</p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="bg-neutral-950 text-white text-[10px] tracking-widest uppercase px-6 py-3 font-semibold hover:bg-neutral-850 transition-colors duration-300 cursor-pointer"
              >
                ALIŞ-VERİŞƏ BAŞLA
              </button>
            </div>
          ) : (
            <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-1">
              {cartItems.map((item, index) => (
                <div key={`${item.product.id}-${item.selectedShade?.name || index}`} className="flex space-x-4 border-b border-neutral-100 pb-5">
                  <div className="relative h-20 w-16 bg-neutral-50 border border-neutral-100 flex-shrink-0">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-bold tracking-wider text-neutral-900 uppercase">{item.product.name}</h4>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedShade?.name)}
                          className="text-neutral-400 hover:text-neutral-900 cursor-pointer"
                          aria-label="Sil"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-[10px] text-neutral-400 mt-0.5 font-sans line-clamp-1">{item.product.subtitle}</p>
                      {item.selectedShade && (
                        <div className="flex items-center space-x-1.5 mt-1.5">
                          <span className="w-2.5 h-2.5 rounded-full border border-neutral-300" style={{ backgroundColor: item.selectedShade.colorHex }} />
                          <span className="text-[9px] text-neutral-500 uppercase tracking-widest">{item.selectedShade.name}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-neutral-200">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedShade?.name)}
                          className="p-1 hover:bg-neutral-50 text-neutral-500 cursor-pointer"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 text-xs font-mono font-semibold text-neutral-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedShade?.name)}
                          className="p-1 hover:bg-neutral-50 text-neutral-500 cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-xs font-semibold font-mono text-neutral-900">{(item.product.price * item.quantity).toFixed(2)} ₼</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {cartItems.length > 0 && (
            <div className="border-t border-neutral-100 pt-6 mt-6 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-500 tracking-wider">CƏMİ:</span>
                  <span className="font-semibold text-neutral-900 font-mono text-sm">{cartTotal.toFixed(2)} ₼</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-neutral-400 tracking-wider">ÇATDIRILMA (BAKI):</span>
                  <span className="font-semibold text-emerald-600 tracking-widest uppercase">PULSUZ</span>
                </div>
              </div>

              <form onSubmit={handleCheckout}>
                <button
                  type="submit"
                  className="w-full bg-neutral-950 text-white text-[10px] tracking-widest font-semibold uppercase py-4 border border-neutral-950 hover:bg-transparent hover:text-neutral-900 transition-colors duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>ÖDƏNİŞƏ KEÇ</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>
              <p className="text-[9px] text-neutral-400 font-sans text-center leading-relaxed">
                Təhlükəsiz ödəniş zəmanəti. Kredit kartı və Qapıda ödəniş (Nağd/Kart) mövcuddur.
              </p>
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
}
