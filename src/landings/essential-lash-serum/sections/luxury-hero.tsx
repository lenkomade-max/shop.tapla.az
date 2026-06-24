'use client';

import { motion } from 'framer-motion';
import { Sparkles, Star, ChevronRight, ShieldCheck, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LuxuryHero() {
  const scrollToCheckout = () => {
    const el = document.getElementById('checkout-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTimeline = () => {
    const el = document.getElementById('timeline-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero-section" className="relative min-h-screen bg-[#FAF8F5] text-[#1C1613] overflow-hidden flex flex-col justify-between">
      {/* Subtle organic shapes for ambient luxury look */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#F5EBE1] blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-[5%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-[#EFE6DC] blur-3xl opacity-50 pointer-events-none" />

      {/* Floating Trust Indicator Bar */}
      <div className="w-full bg-[#1C1613]/5 border-b border-[#1C1613]/5 py-2 px-4 text-center text-xs font-sans tracking-widest text-[#1C1613]/70 uppercase">
        Azərbaycan daxili sürətli və pulsuz çatdırılma • 100% orijinal məhsul
      </div>

      {/* Main Luxury Hero Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center flex-grow">
        {/* Editorial Text Block */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-8 z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 bg-white/80 border border-[#D5C2AF] px-3 py-1.5 rounded-full shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-[#C5A880]" />
            <span className="text-xs font-mono tracking-widest uppercase text-[#8A6E45]">Mükafatlı Premium Formula</span>
          </motion.div>

          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: 'easeOut' }}
              className="text-4xl sm:text-5xl lg:text-6xl font-serif leading-[1.1] tracking-tight font-normal text-[#1C1613]"
            >
              Həqiqi Kirpiklər. <br />
              <span className="italic text-[#8A6E45] font-light">Sonsuz Dərinlik.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
              className="text-base sm:text-lg text-[#1C1613]/80 font-sans max-w-xl leading-relaxed"
            >
              Essential Lash Serum kökdən uca qədər qidalandıraraq cəmi 4 həftə ərzində kirpiklərinizi daha uzun, daha sıx və parlaq edir. Hormonsuz, təbii və elmi əsaslı premium gözəllik ritualı.
            </motion.p>
          </div>

          {/* Luxury CTA & Micro-proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center"
          >
            <button
              onClick={scrollToCheckout}
              className="relative overflow-hidden group bg-[#1C1613] text-[#FAF8F5] px-8 py-4 text-sm font-sans tracking-widest uppercase transition-all duration-300 hover:bg-[#322823] active:scale-98 flex items-center justify-center gap-2"
              id="hero-buy-btn"
            >
              <span>İndi Sifariş Et</span>
              <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button
              onClick={scrollToTimeline}
              className="px-8 py-4 text-sm font-sans tracking-widest uppercase border border-[#1C1613]/20 text-[#1C1613] hover:bg-[#1C1613]/5 transition-colors duration-300 flex items-center justify-center"
              id="hero-learn-btn"
            >
              Nəticələri Gör
            </button>
          </motion.div>

          {/* Social Proof Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="pt-6 border-t border-[#1C1613]/10 grid grid-cols-3 gap-4"
          >
            <div className="space-y-1">
              <div className="flex text-[#C5A880]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs font-sans text-[#1C1613]/70"><strong>4.9/5</strong> Müştəri Rəyi</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-[#8A6E45]">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-mono tracking-wider uppercase font-semibold">100% Güvənli</span>
              </div>
              <p className="text-xs font-sans text-[#1C1613]/70">Dermatoloji Sınaq</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-[#8A6E45]">
                <Award className="w-4 h-4" />
                <span className="text-xs font-mono tracking-wider uppercase font-semibold">Premium</span>
              </div>
              <p className="text-xs font-sans text-[#1C1613]/70">Fransa Formulası</p>
            </div>
          </motion.div>
        </div>

        {/* Editorial Image Stack on Right */}
        <div className="lg:col-span-5 relative flex justify-center items-center z-10 w-full min-h-[350px] lg:min-h-[550px]">
          {/* Main Large Aesthetic Image Block */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-[85%] aspect-[3/4] bg-[#E3D9CE] overflow-hidden shadow-2xl border border-white/40 group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1613]/40 via-transparent to-transparent z-10" />
            
            {/* Real placeholder simulating luxury cosmetic branding photography */}
            <div className="absolute inset-0 bg-[#DED5C9] flex flex-col justify-between p-6 text-[#1C1613]">
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono tracking-widest uppercase opacity-75">ESSENTIAL BEATUÉ</span>
                <span className="text-xs font-sans border border-[#1C1613]/20 px-2 py-0.5 rounded-full">3 ml</span>
              </div>
              
              {/* Product schematic lines inside image to make it look highly professional */}
              <div className="w-full flex flex-col items-center justify-center flex-grow py-8 relative">
                <div className="w-8 h-48 bg-linear-to-b from-[#FAF8F5] via-[#EAE1D5] to-[#C8B8A6] rounded-full shadow-lg flex flex-col items-center justify-between py-6 border border-white/20">
                  <div className="w-1.5 h-1.5 bg-[#8A6E45] rounded-full" />
                  <div className="text-[9px] font-mono tracking-widest text-[#8A6E45] rotate-90 my-8">ESSENTIAL LASH</div>
                  <div className="w-3 h-3 rounded-full bg-[#1C1613]/10" />
                </div>
                {/* Droplet visual effect */}
                <div className="absolute bottom-[20%] w-3 h-3 rounded-full bg-[#C5A880]/40 blur-xs animate-pulse" />
              </div>

              <div className="z-10 text-white space-y-1">
                <p className="text-xs font-mono uppercase tracking-widest text-white/80">LASH GROWTH ACTIVATOR</p>
                <p className="font-serif text-lg italic text-[#FDFBF9]">Gözəlliyin təbii toxunuşu</p>
              </div>
            </div>
          </motion.div>

          {/* Overlapping Secondary Polish Card */}
          <motion.div
            initial={{ opacity: 0, x: -30, y: 40 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-[-20px] left-0 w-[55%] aspect-square bg-[#1C1613] text-[#FAF8F5] p-6 shadow-xl flex flex-col justify-between border border-white/10"
          >
            <div className="text-[#C5A880] flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-current" />
              ))}
            </div>
            
            <div className="space-y-1.5">
              <p className="text-xs font-serif italic text-[#FAF8F5]/80">{"\"Kirpiklərim heç vaxt bu qədər uzun və qalın olmamışdı. Cəmi 3 həftədə fərqi hiss etdim!\""}</p>
              <p className="text-[10px] font-mono tracking-widest text-[#C5A880] uppercase">— Leyla M., Bakı</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Trust Badges Bar */}
      <div className="w-full bg-[#FAF8F5] border-t border-[#1C1613]/5 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center items-center gap-8 lg:gap-16 text-xs font-mono tracking-widest text-[#1C1613]/50 uppercase">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#8A6E45] rounded-full" />
            <span>HORMONSUZ VƏ TƏBİİ</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#8A6E45] rounded-full" />
            <span>KIPRIK QAYNAĞINA SON</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#8A6E45] rounded-full" />
            <span>HEÇ BİR QICIQLANDIRMA VERMİR</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#8A6E45] rounded-full" />
            <span>HİPOALLERGENİK FORMULA</span>
          </div>
        </div>
      </div>
    </section>
  );
}
