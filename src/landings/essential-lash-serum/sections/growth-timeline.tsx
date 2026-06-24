'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Eye, Sparkles, CheckCircle2 } from 'lucide-react';

export function GrowthTimeline() {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: { observer: IntersectionObserver; ref: HTMLDivElement }[] = [];

    stepRefs.current.forEach((ref, idx) => {
      if (!ref) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveStep(idx);
          }
        },
        {
          rootMargin: '-25% 0px -35% 0px',
          threshold: 0.25,
        }
      );

      observer.observe(ref);
      observers.push({ observer, ref });
    });

    return () => {
      observers.forEach(({ observer, ref }) => {
        observer.unobserve(ref);
      });
    };
  }, []);

  const steps = [
    {
      week: "HƏFTƏ 1-2",
      title: "Canlanma və Aktivasiya",
      focus: "Kök Hüceyrələrinin Qidalanması",
      desc: "Serum folikullara dərindən hoparaq onları qidalandırır. Kirpik köklərində qan dövranı aktivləşir, tökülmə kəskin şəkildə azalır. Kirpiklər daha sağlam və parlaq görünməyə başlayır.",
      lashIndicator: "w-1/4",
      lashHeight: "h-2",
      intensity: "25%",
      icon: <Clock className="w-5 h-5 text-[#8A6E45]" />
    },
    {
      week: "HƏFTƏ 3-4",
      title: "Güclənmə və Sıxlaşma",
      focus: "Yeni Tüklərin Böyüməsi",
      desc: "Yatmış folikullar oyanır və yeni incə kirpik tükləri cücərməyə başlayır. Mövcud kirpiklər qalınlaşır və onların keratstrukturu güclənir. Kirpik xətti daha dolğun və sıx görünür.",
      lashIndicator: "w-2/4",
      lashHeight: "h-3.5",
      intensity: "55%",
      icon: <Eye className="w-5 h-5 text-[#8A6E45]" />
    },
    {
      week: "HƏFTƏ 5-6",
      title: "Maksimum Böyümə Fazası",
      focus: "Uzunluğun Sürətlənməsi",
      desc: "Kirpiklərin anagen (aktiv böyümə) fazası uzadılır. Kirpiklər rekord sürətlə uzanmağa başlayır. Təbii bükülmə və elastiklik yaranır, kirpiklər heç bir makiyajsız belə diqqət çəkir.",
      lashIndicator: "w-3/4",
      lashHeight: "h-5",
      intensity: "85%",
      icon: <Sparkles className="w-5 h-5 text-[#8A6E45]" />
    },
    {
      week: "HƏFTƏ 8+",
      title: "Mükəmməl Nəticə və Qorunma",
      focus: "Dramatik Həcm və Parıltı",
      desc: "Kirpiklər özlərinin genetik olaraq ən uzun, ən qalın və ən güclü formasına çatır. Professional qaynaq effektini tamamilə təbii şəkildə əldə edirsiniz. Mükəmməl, cazibədar gözlər hazırdır.",
      lashIndicator: "w-full",
      lashHeight: "h-7",
      intensity: "100%",
      icon: <CheckCircle2 className="w-5 h-5 text-[#8A6E45]" />
    }
  ];

  return (
    <section id="timeline-section" className="bg-[#FAF8F5] text-[#1C1613] py-24 px-6 lg:px-12 relative overflow-visible border-b border-[#1C1613]/5">
      <div className="max-w-7xl mx-auto relative">
        
        {/* Section Header */}
        <div className="flex flex-col gap-4 mb-10 max-w-2xl">
          <p className="text-xs font-mono tracking-widest uppercase text-[#8A6E45]">Gözəllik Zaman Alır</p>
          <h2 className="text-3xl sm:text-4xl font-serif tracking-tight font-normal">
            8 Həftəlik Böyümə Ritualı
          </h2>
          <p className="text-sm font-sans text-[#1C1613]/70">
            Uğurun sirri davamlılıqdadır. Hər gecə cəmi 10 saniyə vaxt ayırmaqla kirpiklərinizin möhtəşəm inkişaf mərhələlərini izləyin.
          </p>
        </div>

        {/* Sticky Quick step pills container */}
        <div className="sticky top-20 z-40 -mx-6 px-6 py-4 bg-[#FAF8F5]/90 backdrop-blur-md border-y border-[#1C1613]/5 mb-12 flex justify-start items-center overflow-x-auto scrollbar-none">
          <div className="flex gap-2 bg-[#1C1613]/5 p-1 rounded-full border border-[#1C1613]/5 max-w-full">
            {steps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`px-4 py-2 text-xs font-mono tracking-wider uppercase rounded-full transition-all duration-300 shrink-0 ${
                  activeStep === idx
                    ? 'bg-[#1C1613] text-[#FAF8F5] shadow-md'
                    : 'text-[#1C1613]/60 hover:text-[#1C1613] hover:bg-[#1C1613]/5'
                }`}
              >
                {step.week}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Display Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left interactive stepper cards */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            {steps.map((step, idx) => (
              <div
                key={idx}
                ref={(el) => { stepRefs.current[idx] = el; }}
                onClick={() => setActiveStep(idx)}
                className={`p-6 border transition-all duration-500 cursor-pointer flex gap-4 items-start relative overflow-hidden ${
                  activeStep === idx
                    ? 'bg-white border-[#C5A880] shadow-lg translate-x-2'
                    : 'bg-white/40 border-[#1C1613]/5 opacity-60 hover:opacity-100 hover:bg-white/80'
                }`}
              >
                <div className={`p-2 rounded-full transition-colors duration-300 ${activeStep === idx ? 'bg-[#F5EBE1]' : 'bg-[#1C1613]/5'}`}>
                  {step.icon}
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-mono tracking-widest text-[#8A6E45]">{step.week}</p>
                  <h3 className="text-sm font-sans font-medium text-[#1C1613]">{step.title}</h3>
                </div>
                {activeStep === idx && (
                  <div className="absolute right-0 top-0 h-full w-1 bg-[#8A6E45]" />
                )}
              </div>
            ))}
          </div>

          {/* Right cinematic showcase frame */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#1C1613]/5 p-8 lg:p-12 shadow-xl relative min-h-[420px] flex flex-col justify-between">
              
              {/* Background ambient texture */}
              <div className="absolute inset-0 bg-[#FAF8F5]/30 pointer-events-none" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6 relative z-10 flex-grow flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-[#1C1613]/10 pb-4">
                      <span className="text-xs font-mono tracking-widest text-[#8A6E45] uppercase font-semibold">
                        Aktiv Mərhələ: {steps[activeStep].week}
                      </span>
                      <span className="text-xs font-mono bg-[#8A6E45]/10 text-[#8A6E45] px-2.5 py-1 rounded-full uppercase">
                        Effektivlik: {steps[activeStep].intensity}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-serif text-[#1C1613]">
                      {steps[activeStep].title}
                    </h3>
                    
                    <p className="text-[11px] font-mono uppercase tracking-widest text-[#8A6E45]">
                      MƏQSƏD: {steps[activeStep].focus}
                    </p>

                    <p className="text-sm font-sans text-[#1C1613]/80 leading-relaxed">
                      {steps[activeStep].desc}
                    </p>
                  </div>

                  {/* Lash growth visualizer simulation */}
                  <div className="border-t border-[#1C1613]/10 pt-6 mt-6 space-y-4">
                    <p className="text-[10px] font-mono tracking-widest text-[#1C1613]/40 uppercase">
                      Kirpik Uzunluğu və Sıxlığı Simulyasiyası
                    </p>
                    <div className="relative h-16 w-full bg-[#FAF8F5] border border-[#1C1613]/5 flex items-end px-6 pb-2 overflow-hidden">
                      {/* Eyelid base curve */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-[#1C1613]/10 rounded-full" />
                      
                      {/* Eyelash hairs */}
                      <div className="flex justify-between items-end w-full px-2">
                        {[...Array(18)].map((_, i) => {
                          const delay = i * 0.02;
                          // Curve effect
                          const rotateDeg = (i - 9) * 3;
                          return (
                            <motion.div
                              key={i}
                              initial={{ height: 4 }}
                              animate={{ 
                                height: activeStep === 0 ? 12 : activeStep === 1 ? 22 : activeStep === 2 ? 34 : 48,
                                opacity: activeStep === 0 ? 0.4 : activeStep === 1 ? 0.7 : activeStep === 2 ? 0.9 : 1
                              }}
                              transition={{ duration: 0.6, delay: delay }}
                              className="w-[2px] bg-[#1C1613] rounded-t-full origin-bottom"
                              style={{ 
                                transform: `rotate(${rotateDeg}deg)`,
                                filter: activeStep >= 2 ? 'drop-shadow(0 0 1px rgba(0,0,0,0.5))' : 'none'
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
