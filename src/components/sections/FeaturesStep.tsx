'use client';

import React, { useState } from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface Step {
  stepNumber: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  actionText: string;
  href: string;
}

interface FeaturesStepProps {
  steps: Step[];
}

export function FeaturesStep({ steps }: FeaturesStepProps) {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <Section id="ritual" variant="dark" py="lg">
      <Container>
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16 sm:mb-20">
          <span className="text-[10px] tracking-[0.25em] font-bold text-amber-200 uppercase">
            RAHAT ALIŞ-VERİŞ TƏCRÜBƏSİ
          </span>
          <Heading level={2} align="center" className="font-serif text-white">
            TAPLA MARKETPLACE İLƏ ALIŞ-VERİŞ
          </Heading>
          <p className="text-xs sm:text-sm text-neutral-400 font-sans max-w-lg mx-auto leading-relaxed">
            Məhsul seçimi, müqayisə, sifariş və çatdırılma — 4 sadə addımda TAPLA təcrübəsi.
          </p>
        </div>

        {/* Step-by-Step Interactive Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Step navigation list */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            {steps.map((step, idx) => {
              const isSelected = activeStep === idx;
              return (
                <div
                  key={step.stepNumber}
                  onClick={() => setActiveStep(idx)}
                  className={`group flex items-start space-x-5 p-5 border cursor-pointer transition-all duration-500 rounded-xl ${
                    isSelected
                      ? 'border-white bg-neutral-900 text-white shadow-xl'
                      : 'border-neutral-900 bg-neutral-950 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                  }`}
                >
                  {/* Huge Number */}
                  <span
                    className={`text-3xl sm:text-4xl font-serif font-light leading-none ${
                      isSelected ? 'text-amber-200' : 'text-neutral-700 group-hover:text-neutral-500'
                    }`}
                  >
                    0{step.stepNumber}
                  </span>

                  {/* Step Info */}
                  <div className="space-y-1.5 flex-1">
                    <h4
                      className={`text-xs sm:text-sm font-semibold tracking-widest uppercase transition-colors duration-300 ${
                        isSelected ? 'text-white' : 'text-neutral-300'
                      }`}
                    >
                      {step.title}
                    </h4>
                    <span className="text-[10px] tracking-wider text-neutral-500 block">
                      {step.subtitle}
                    </span>
                    {isSelected && (
                      <p className="text-xs text-neutral-300 font-sans leading-relaxed pt-2 animate-fade-in">
                        {step.description}
                      </p>
                    )}
                  </div>

                  {/* Icon */}
                  <div className="pt-1.5">
                    <ArrowRight
                      className={`h-4 w-4 transition-transform duration-300 ${
                        isSelected ? 'translate-x-1 text-amber-200' : 'text-neutral-600 group-hover:translate-x-1'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Immersive graphic preview */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-[3/2] w-full bg-neutral-900 overflow-hidden border border-neutral-800">
              <Image
                src={steps[activeStep].image}
                alt={steps[activeStep].title}
                fill
                sizes="(max-w-7xl): 60vw, 100vw"
                className="object-cover object-center filter grayscale transition-all duration-1000 brightness-90 group-hover:grayscale-0"
              />
              
              {/* Overlay content overlay details */}
              <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-transparent to-transparent flex items-end p-6 sm:p-8">
                <div className="space-y-2">
                  <span className="bg-amber-200 text-neutral-950 text-[9px] tracking-widest font-bold px-2.5 py-1 uppercase select-none">
                    ADDIM 0{steps[activeStep].stepNumber}
                  </span>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-serif text-white uppercase tracking-wider font-light">
                    {steps[activeStep].title}
                  </h3>
                  <p className="text-xs text-neutral-300 font-sans leading-relaxed line-clamp-2 max-w-md">
                    {steps[activeStep].description}
                  </p>
                  <div className="pt-3">
                    <a
                      href={steps[activeStep].href}
                      className="text-[10px] tracking-widest uppercase font-semibold text-white border-b border-white hover:text-amber-200 hover:border-amber-200 transition-colors py-1 inline-flex items-center space-x-1"
                    >
                      <span>ƏTRAFLI BAX</span>
                      <ArrowRight className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </Container>
    </Section>
  );
}
