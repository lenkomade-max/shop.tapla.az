'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const HERO_SLIDES = [
  {
    id: 1,
    tag: 'ONLAYN EKSKLYUZİV / YENİ MƏHSUL',
    title: 'ALUNA RADIANCE PRO',
    subtitle: 'MÜKƏMMƏL DƏRİ SİRRİ',
    description: 'Ev şəraitində peşəkar salon nəticələri əldə edin. 7 fərqli LED işıq dalğası və mikroaxın lifinqi ilə dərini gəncləşdirir və canlandırır.',
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=1200&h=1600', // Premium skincare oil/device aesthetic image placeholder
    actionText: 'İNDİ KƏŞF ET',
    href: '#aluna-radiance-pro',
  },
  {
    id: 2,
    tag: 'GÖZƏLLİK RİTUALI',
    title: 'PEŞƏKAR ULTRASES SONİK',
    subtitle: 'MƏSAMƏLƏRİN DƏRİN TƏMİZLƏNMƏSİ',
    description: 'Qara nöqtələrə və makiyaj qalıqlarına birdəfəlik son! Ultrasəs dalğaları ilə dərini ipək kimi hamar və təravətli edin.',
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=1200&h=1600', // Skincare beauty tools placeholder
    actionText: 'SƏBƏTƏ ƏLAVƏ ET',
    href: '#aluna-ultrasonic-clean',
  },
  {
    id: 3,
    tag: 'PREMİUM BAXIM',
    title: 'GÖZ ƏTRAFI PARLAQLIĞI',
    subtitle: 'YORĞUN GÖZLƏRƏ SON RİTUALI',
    description: '42°C istilik masajı və incə mikro-vibrasiya sayəsində gözaltı şişkinliyi və tünd halqaları saniyələr içində azaldın.',
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=1200&h=1600', // Facial cosmetic application placeholder
    actionText: 'ƏTRAFLI ÖYRƏN',
    href: '#aluna-eye-glow',
  },
];

export function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
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
              src={HERO_SLIDES[index].image}
              alt={HERO_SLIDES[index].title}
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
                  {HERO_SLIDES[index].tag}
                </span>

                {/* Main Heading */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-light tracking-[0.05em] leading-tight text-white">
                  {HERO_SLIDES[index].title}
                </h1>

                {/* Secondary Title */}
                <h2 className="text-base sm:text-lg md:text-xl font-light tracking-[0.2em] text-amber-100 uppercase">
                  {HERO_SLIDES[index].subtitle}
                </h2>

                {/* Paragraph */}
                <p className="text-xs sm:text-sm md:text-base text-neutral-300 font-sans font-light max-w-lg leading-relaxed pt-2">
                  {HERO_SLIDES[index].description}
                </p>

                {/* CTA Action */}
                <div className="pt-6">
                  <a href={HERO_SLIDES[index].href}>
                    <Button
                      variant="secondary"
                      size="lg"
                      className="hover:bg-neutral-950 hover:text-white hover:border-white transition-all duration-300"
                    >
                      {HERO_SLIDES[index].actionText}
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
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setIndex(idx)}
            className={`h-1.5 transition-all duration-500 rounded-none cursor-pointer ${
              idx === index ? 'w-8 bg-white' : 'w-2 bg-white/30'
            }`}
            aria-label={`Slayd ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
