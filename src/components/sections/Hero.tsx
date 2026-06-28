'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const HERO_FALLBACK = [
  {
    id: 1,
    tag: 'ELEKTRONIKADA ƏN YAXŞI SEÇİMLƏR',
    title: 'TAPLA MARKETPLACE',
    subtitle: 'RƏSMİ ZƏMANƏT, ƏN UCUZ QİYMƏTLƏR',
    description: 'Notebook, telefon, planşet və aksesuarlar ən sərfəli qiymətlərlə. Zəmanətli məhsullar, sürətli çatdırılma.',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1200&h=1600',
    actionText: 'MƏHSULLARI GÖR',
    href: '/#products',
  },
  {
    id: 2,
    tag: 'NOTEBOOK VƏ ULTRABOOKLAR',
    title: 'APPLE MACBOOK AIR M3',
    subtitle: 'M3 ÇIP İLƏ SUPER SÜRƏT',
    description: '18 saat batareya ömrü, Liquid Retina displey, fanless dizayn. İş və təhsil üçün mükəmməl notebook.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1200&h=1600',
    actionText: 'KƏŞF ET',
    href: '/products/macbook-air-m3',
  },
  {
    id: 3,
    tag: 'SMARTFON VƏ AKSESUARLAR',
    title: 'SAMSUNG GALAXY S25 ULTRA',
    subtitle: '200MP KAMERA, S PEN DƏSTƏYİ',
    description: 'Ən güclü flagship smartfon. Snapdragon 8 Elite, 6.9" Dynamic AMOLED, S Pen ilə birlikdə.',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=1200&h=1600',
    actionText: 'ƏTRAFLI BAX',
    href: '/products/samsung-galaxy-s25-ultra',
  },
];

export function Hero({ slides: propSlides }: { slides?: typeof HERO_FALLBACK }) {
  const slides = propSlides || HERO_FALLBACK;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative w-full h-[85vh] sm:h-[90vh] md:h-screen bg-neutral-950 text-white overflow-hidden font-sans pt-16">
      {/* Slide Images */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 0.5, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative w-full h-full"
          >
            <Image
              src={slides[index].image}
              alt={slides[index].title}
              fill
              priority
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Elegant Editorial Text Grid Overlay */}
      <div className="absolute inset-0 z-10 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4 sm:space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-4"
              >
                {/* Micro Tag */}
                <span className="inline-block text-[10px] sm:text-xs font-bold tracking-[0.2em] text-neutral-300 uppercase">
                  {slides[index].tag}
                </span>

                {/* Main Heading */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-light tracking-[0.05em] leading-tight text-white">
                  {slides[index].title}
                </h1>

                {/* Secondary Title */}
                <h2 className="text-base sm:text-lg md:text-xl font-light tracking-[0.2em] text-amber-100 uppercase">
                  {slides[index].subtitle}
                </h2>

                {/* Paragraph */}
                <p className="text-xs sm:text-sm md:text-base text-neutral-300 font-sans font-light max-w-lg leading-relaxed pt-2">
                  {slides[index].description}
                </p>

                {/* CTA Action */}
                <div className="pt-6">
                  <a href={slides[index].href}>
                    <Button
                      variant="secondary"
                      size="lg"
                      className="hover:bg-neutral-950 hover:text-white hover:border-white transition-all duration-300"
                    >
                      {slides[index].actionText}
                    </Button>
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Slider Controls Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 cursor-pointer"
        aria-label="Əvvəlki slayd"
      >
        <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 cursor-pointer"
        aria-label="Növbəti slayd"
      >
        <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
      </button>

      {/* Rhythmic Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2.5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setIndex(idx)}
            className={`h-1.5 transition-all duration-500 rounded-full cursor-pointer ${
              idx === index ? 'w-8 bg-white' : 'w-2 bg-white/30'
            }`}
            aria-label={`Slayd ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
