'use client';

import React from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function PromoBanners() {
  return (
    <Section py="none" variant="light">
      {/* 1. Side-by-Side Dual Editorial Column Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left Column Banner */}
        <div className="relative group aspect-square sm:aspect-video md:aspect-[4/5] bg-neutral-950 text-white overflow-hidden flex flex-col justify-end p-6 sm:p-12 md:p-16">
          <Image
            src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=1000" // Premium beauty products styling
            alt="Aluna Sonik təmizləmə gücü"
            fill
            className="object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="relative z-10 space-y-4">
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-amber-200 uppercase">
              EKSKLYUZİV ERKƏN KEÇİD
            </span>
            <Heading level={3} className="font-serif leading-tight">
              MƏMİŞŞAH ÜÇLÜ TƏMİZLƏMƏ GÜCÜ
            </Heading>
            <p className="text-xs text-neutral-300 font-sans max-w-sm leading-relaxed">
              Məsamələri 99.8% kirlərdən dərhal təmizləyən, dərini qurutmayan və təbii ph balansını qoruyan unikal sonik dalğalı təmizləmə spatula sistemi.
            </p>
            <div className="pt-2">
              <a href="#products">
                <Button variant="secondary" size="sm">
                  KƏŞF ET
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column Banner */}
        <div className="relative group aspect-square sm:aspect-video md:aspect-[4/5] bg-neutral-900 text-white overflow-hidden flex flex-col justify-end p-6 sm:p-12 md:p-16">
          <Image
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1000" // Premium skincare application model
            alt="Aluna LED Cavanlaşma gücü"
            fill
            className="object-cover opacity-45 group-hover:scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="relative z-10 space-y-4">
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-neutral-300 uppercase">
              ELMİ TƏSDİQLƏNMİŞ LƏTİFLİK
            </span>
            <Heading level={3} className="font-serif leading-tight">
              GƏNC DƏRİNİN SÜNİ İNTELLEKT GÜCÜ
            </Heading>
            <p className="text-xs text-neutral-300 font-sans max-w-sm leading-relaxed">
              İstifadəçilərin 100%-i 14 günlük tətbiqdən sonra qırışların azaldığını, dərinin daha gənc, canlı və dolğun göründüyünü təsdiqləmişdir.*
            </p>
            <div className="pt-2">
              <a href="#products">
                <Button variant="secondary" size="sm">
                  SİFARİŞ ET
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Full-Width Wide Spotlight Banner Below */}
      <div className="relative group h-[50vh] sm:h-[60vh] md:h-[70vh] bg-neutral-950 text-white overflow-hidden flex items-center">
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1600" // Clean visual background for full banner
          alt="Aluna Radiance full spotlight"
          fill
          className="object-cover opacity-40 group-hover:scale-102 transition-transform duration-1000 ease-out"
        />
        {/* Subtle radial shadow to ensure text contrast */}
        <div className="absolute inset-0 bg-neutral-950/40" />

        <Container className="relative z-10">
          <div className="max-w-2xl space-y-4 sm:space-y-6">
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-amber-200 uppercase">
              YENİ LİMİTSİZ PARLAQLIQ SERİYASI
            </span>
            <Heading level={2} className="font-serif text-white font-light max-w-xl">
              ALUNA GLOW - MÜKƏMMƏL ÜZ KONTURU VƏ PARILTISI
            </Heading>
            <p className="text-xs sm:text-sm text-neutral-300 font-sans font-light leading-relaxed max-w-md">
              Yeni mikroaxınlı liftinq başlığı və patentləşdirilmiş LED dalğaları ilə dərinin təbii regenerasiyasını tətikləyin. Salon qulluğunu evinizdə hiss edin.
            </p>
            <div className="pt-4">
              <a href="#products">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                  KOLLEKSİYANI KƏŞF ET
                </Button>
              </a>
            </div>
          </div>
        </Container>
      </div>

      {/* 3. Shop by Category Quick Grid Row */}
      <div className="bg-neutral-950 text-white border-t border-neutral-900 py-10 font-sans">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { label: 'LED CİHAZLARI', href: '#products' },
              { label: 'TƏMİZLƏMƏ ALƏTLƏRİ', href: '#products' },
              { label: 'QULLUQ SERUMLARI', href: '#products' },
              { label: 'HƏDİYYƏ DƏSTLƏRİ', href: '#products' },
            ].map((cat, index) => (
              <a
                key={index}
                href={cat.href}
                className="border border-neutral-900 py-6 sm:py-8 hover:border-neutral-500 transition-colors duration-300 tracking-widest text-[10px] sm:text-xs font-semibold uppercase"
              >
                {cat.label}
              </a>
            ))}
          </div>
        </Container>
      </div>
    </Section>
  );
}
