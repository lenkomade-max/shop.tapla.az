'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ANNOUNCEMENTS = [
  { text: 'YENİ ALUNA RADIANCE PRO SATIŞDA! İLK SİFARİŞƏ ÖZƏL 15% ENDİRİM - ALUNA15', href: '#aluna-radiance-pro' },
  { text: 'BAKI DAXİLİ 24 SAAT ƏRZİNDƏ TAMAMİLƏ PULSUZ ÇATDIRILMA!', href: '#faq' },
  { text: 'BÜTÜN CİHAZLARIMIZA RƏSMİ 2 İLLİK ZƏMANƏT TƏQDİM OLUNUR', href: '#benefits' },
];

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
  };

  return (
    <div className="w-full bg-neutral-950 text-white py-2.5 px-4 flex items-center justify-between border-b border-neutral-900 relative z-40 text-center font-sans">
      <button
        onClick={handlePrev}
        className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
        aria-label="Əvvəlki elan"
      >
        <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </button>

      <div className="flex-1 overflow-hidden h-4 flex items-center justify-center text-[10px] sm:text-[11px] tracking-widest font-semibold uppercase px-4">
        <AnimatePresence mode="wait">
          <motion.a
            key={index}
            href={ANNOUNCEMENTS[index].href}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -15, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="hover:underline transition-all block max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl truncate"
          >
            {ANNOUNCEMENTS[index].text}
          </motion.a>
        </AnimatePresence>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="text-neutral-400 hover:text-white transition-colors hidden sm:inline-block cursor-pointer"
          aria-label={isPlaying ? "Durdur" : "Başlat"}
        >
          {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
        </button>
        <button
          onClick={handleNext}
          className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Növbəti elan"
        >
          <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
      </div>
    </div>
  );
}
