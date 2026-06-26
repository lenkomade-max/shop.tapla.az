'use client';

import React from 'react';
import { Home, Zap, ShieldCheck, HeartHandshake } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Benefit } from '@/types';

interface BenefitsProps {
  benefits: Benefit[];
}

export function Benefits({ benefits }: BenefitsProps) {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Home':
        return <Home className="h-7 w-7 text-neutral-900" />;
      case 'Zap':
        return <Zap className="h-7 w-7 text-neutral-900" />;
      case 'ShieldCheck':
        return <ShieldCheck className="h-7 w-7 text-neutral-900" />;
      case 'HeartHandshake':
        return <HeartHandshake className="h-7 w-7 text-neutral-900" />;
      default:
        return <ShieldCheck className="h-7 w-7 text-neutral-900" />;
    }
  };

  return (
    <Section id="benefits" variant="neutral" py="lg">
      <Container>
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-16 sm:mb-20">
          <span className="text-[10px] tracking-[0.25em] font-bold text-neutral-400 uppercase">
            MÜKƏMMƏLLİK SİYASƏTİMİZ
          </span>
          <Heading level={2} align="center" className="font-serif">
            NİYƏ MƏHZ ALUNA?
          </Heading>
          <p className="text-xs sm:text-sm text-neutral-500 font-sans max-w-lg mx-auto leading-relaxed">
            Hər bir cihazımız unikal texnoloji struktura və dərinin sağlamlığını dərindən dəstəkləyən təhlükəsizlik sertifikatlarına malikdir.
          </p>
        </div>

        {/* Grid Lists */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit) => (
            <div
              key={benefit.id}
              className="bg-white p-6 sm:p-8 border border-neutral-100 hover:border-neutral-900 shadow-xs hover:shadow-xl transition-all duration-500 flex flex-col items-center text-center space-y-4 group"
            >
              {/* Icon Container */}
              <div className="p-4 bg-neutral-50 group-hover:bg-neutral-900 group-hover:text-white transition-colors duration-500 rounded-none">
                <div className="group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 text-neutral-900 group-hover:text-white">
                  {getIcon(benefit.iconName)}
                </div>
              </div>

              {/* Title / Description */}
              <div className="space-y-2">
                <h4 className="text-xs sm:text-sm font-semibold tracking-widest text-neutral-900 uppercase">
                  {benefit.title}
                </h4>
                <p className="text-xs text-neutral-500 font-sans leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
