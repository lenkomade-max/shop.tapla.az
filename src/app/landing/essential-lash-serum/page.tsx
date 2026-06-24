'use client';

import { LuxuryHero } from '@/landings/essential-lash-serum/sections/luxury-hero';
import { BenefitsStats } from '@/landings/essential-lash-serum/sections/benefits-stats';
import { GrowthTimeline } from '@/landings/essential-lash-serum/sections/growth-timeline';
import { IngredientStory } from '@/landings/essential-lash-serum/sections/ingredient-story';
import { BeforeAfter } from '@/landings/essential-lash-serum/sections/before-after';
import { HowToUse } from '@/landings/essential-lash-serum/sections/how-to-use';
import { Faq } from '@/landings/essential-lash-serum/sections/faq';
import { CheckoutOffer } from '@/landings/essential-lash-serum/sections/checkout-offer';
import { Phone, ShoppingBag } from 'lucide-react';

export default function Home() {
  const scrollToCheckout = () => {
    const el = document.getElementById('checkout-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToFaq = () => {
    const el = document.getElementById('faq-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1613] font-sans antialiased selection:bg-[#C5A880]/30 selection:text-[#1C1613]">
      
      {/* Premium Elegant Sticky Navigation */}
      <header className="sticky top-0 z-50 bg-[#FAF8F5]/85 backdrop-blur-md border-b border-[#1C1613]/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-[#1C1613] flex items-center justify-center text-white font-serif italic text-sm">
              E
            </div>
            <div className="leading-tight">
              <span className="text-sm font-sans tracking-widest uppercase font-semibold text-[#1C1613]">ESSENTIAL</span>
              <span className="block text-[10px] font-mono tracking-wider text-[#8A6E45] uppercase">BEAUTÉ LASH</span>
            </div>
          </div>

          {/* Center navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-widest uppercase text-[#1C1613]/70">
            <a href="#hero-section" className="hover:text-[#8A6E45] transition-colors">Ana Səhifə</a>
            <a href="#timeline-section" className="hover:text-[#8A6E45] transition-colors">Böyümə Ritualı</a>
            <a href="#checkout-section" className="hover:text-[#8A6E45] transition-colors">Paketlər</a>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <a 
              href="tel:+994501234567" 
              className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-[#1C1613]/70 hover:text-[#8A6E45] transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>ƏLAQƏ</span>
            </a>
            
            <button
              onClick={scrollToCheckout}
              className="bg-[#1C1613] text-[#FAF8F5] hover:bg-[#8A6E45] px-5 py-2.5 text-xs font-mono tracking-widest uppercase transition-colors flex items-center gap-2"
              id="header-cta-btn"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>SİFARİŞ ET</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Sequential Landing Sections */}
      <main>
        {/* 1. Immersive Hero Section */}
        <LuxuryHero />

        {/* 2. Bento Grid Stats / Study Metrics */}
        <BenefitsStats />

        {/* 3. Interactive Eyelash Growth Step Timeline */}
        <GrowthTimeline />

        {/* 4. Active Premium Ingredients Bento Grid */}
        <IngredientStory />

        {/* 5. Drag-Before-After Comparer */}
        <BeforeAfter />

        {/* 6. Nightly Self-care Ritual Steps */}
        <HowToUse />

        {/* 7. Stateful objection handling FAQ Accordion */}
        <Faq />

        {/* 8. Conversion checkout offering stack with nested dynamic Checkout Form */}
        <CheckoutOffer />
      </main>

      {/* Luxury Brand Footer */}
      <footer className="bg-[#1C1613] text-[#FAF8F5] pt-20 pb-12 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-white/10">
            {/* Branding col */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#1C1613] font-serif italic text-sm">
                  E
                </div>
                <span className="text-sm font-sans tracking-widest uppercase font-semibold text-white">ESSENTIAL BEAUTÉ</span>
              </div>
              <p className="text-xs text-[#FAF8F5]/60 leading-relaxed max-w-xs font-sans">
                Fransız formulası ilə hazırlanan premium gözəllik məhsulları. shop.tapla.az rəsmi lisenziyalı distribütoru.
              </p>
            </div>

            {/* Quick links */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono tracking-widest uppercase text-[#C5A880]">Keçidlər</h4>
              <ul className="space-y-2 text-xs font-sans text-white/70">
                <li><a href="#hero-section" className="hover:text-[#C5A880] transition-colors">Ana Səhifə</a></li>
                <li><a href="#timeline-section" className="hover:text-[#C5A880] transition-colors">Böyümə Ritualı</a></li>
                <li><a href="#checkout-section" className="hover:text-[#C5A880] transition-colors">Qiymətlər & Paketlər</a></li>
              </ul>
            </div>

            {/* Guarantee */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono tracking-widest uppercase text-[#C5A880]">Güvən Zəmanəti</h4>
              <p className="text-xs text-white/70 leading-relaxed font-sans">
                Bütün sifarişlər Bakı daxilində 24 saat ərzində kuryer vasitəsilə, digər bölgələrə isə 2-3 gün ərzində poçtla pulsuz çatdırılır.
              </p>
            </div>

            {/* Legal / Contact */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono tracking-widest uppercase text-[#C5A880]">Dəstək</h4>
              <p className="text-xs text-white/70 font-sans leading-relaxed">
                Hər hansı bir sualınız və ya çətinliyiniz var? Müştəri xidmətimiz mütəmadi olaraq fəaliyyət göstərir.<br />
                <strong>Tel:</strong> +994 50 123 45 67<br />
                <strong>Email:</strong> support@tapla.az
              </p>
            </div>
          </div>

          {/* Sub footer */}
          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-white/40 uppercase tracking-widest">
            <p>© 2026 SHOP.TAPLA.AZ. BÜTÜN HÜQUQLAR QORUNUR.</p>
            <p>DESIGNED & CRAFTED FOR PRESTIGE BEAUTY</p>
          </div>

        </div>
      </footer>

    </div>
  );
}
