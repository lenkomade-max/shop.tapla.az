'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';

export function BeforeAfter() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  return (
    <section className="bg-[#FAF8F5] text-[#1C1613] py-24 px-6 lg:px-12 relative border-b border-[#1C1613]/5">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16 lg:mb-24">
          <p className="text-xs font-mono tracking-widest uppercase text-[#8A6E45]">Gözlə Görünən Fərq</p>
          <h2 className="text-3xl sm:text-4xl font-serif tracking-tight font-normal text-[#1C1613]">
            Müştəri Nəticələri: Real Dəyişiklik
          </h2>
          <p className="text-sm font-sans text-[#1C1613]/70">
            Sürüşdürücünü sola/sağa çəkərək Essential Lash Serum-un 8 həftəlik istifadə dərəcəsini və möhtəşəm nəticəsini öz gözlərinizlə görün.
          </p>
        </div>

        {/* Core Interactive Comparison Container */}
        <div className="max-w-3xl mx-auto">
          <div
            ref={containerRef}
            className="relative aspect-[16/10] w-full bg-neutral-200 overflow-hidden shadow-2xl border-4 border-white select-none cursor-ew-resize"
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}
          >
            {/* "After" Container (Full base back image) */}
            <div className="absolute inset-0 bg-[#E8E1D7] flex flex-col items-center justify-center p-6 text-center">
              {/* Simulated Gorgeous Long Eyelash Visual */}
              <div className="relative w-full h-full flex flex-col justify-between">
                <span className="absolute top-4 right-4 bg-[#8A6E45] text-white font-mono text-[10px] tracking-wider uppercase px-3 py-1 rounded-full shadow-md z-10">
                  HƏFTƏ 8: GÖZƏL VƏ UZUN
                </span>

                {/* Styled Vector Lash Representation */}
                <div className="flex-grow flex flex-col items-center justify-center relative">
                  {/* Eye outline */}
                  <div className="w-80 h-32 border-b-4 border-[#1C1613] rounded-b-[160px] relative">
                    {/* Rich Eyelashes (After) */}
                    {[...Array(26)].map((_, i) => {
                      const angle = -15 + i * 8.5;
                      return (
                        <div
                          key={i}
                          className="absolute bottom-[-24px] w-[3px] bg-[#1C1613] rounded-full origin-top"
                          style={{
                            height: '54px',
                            left: `${10 + i * 3.4}%`,
                            transform: `rotate(${angle}deg)`
                          }}
                        />
                      );
                    })}
                  </div>
                </div>

                <span className="text-xs font-serif italic text-[#1C1613]/60 mb-2">
                  {"\"Həqiqi müştərimiz Günel S.-in nəticəsi\""}
                </span>
              </div>
            </div>

            {/* "Before" Container (Clipped overlay front image) */}
            <div
              className="absolute inset-0 bg-[#ECE6DD] overflow-hidden"
              style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
            >
              <div className="absolute inset-0 w-full h-full">
                <div className="relative w-full h-full flex flex-col justify-between p-6">
                  <span className="absolute top-4 left-4 bg-[#1C1613]/70 text-white font-mono text-[10px] tracking-wider uppercase px-3 py-1 rounded-full z-10">
                    İSTİFADƏDƏN ƏVVƏL
                  </span>

                  {/* Styled Vector Lash Representation (Before) */}
                  <div className="flex-grow flex flex-col items-center justify-center relative">
                    {/* Eye outline */}
                    <div className="w-80 h-32 border-b border-[#1C1613]/50 rounded-b-[160px] relative">
                      {/* Short/Sparse Eyelashes (Before) */}
                      {[...Array(14)].map((_, i) => {
                        const angle = -10 + i * 15;
                        return (
                          <div
                            key={i}
                            className="absolute bottom-[-10px] w-[1.5px] bg-[#1C1613]/70 rounded-full origin-top"
                            style={{
                              height: '18px',
                              left: `${15 + i * 5.5}%`,
                              transform: `rotate(${angle}deg)`
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <span className="text-xs font-serif italic text-[#1C1613]/40 mb-2 pl-4">
                    {"\"Zəif, qırılan, qısa kirpiklər\""}
                  </span>
                </div>
              </div>
            </div>

            {/* Draggable vertical divider handle bar */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-[#8A6E45] shadow-lg flex items-center justify-center cursor-ew-resize z-20"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-10 h-10 rounded-full bg-[#8A6E45] text-white flex items-center justify-center shadow-2xl border-2 border-white">
                <div className="flex gap-0.5">
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Real Customer Case Reviews Carousel Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          <div className="p-6 bg-white border border-[#1C1613]/5">
            <div className="flex gap-1 text-[#C5A880] mb-2">
              {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
            </div>
            <p className="text-xs text-[#1C1613]/80 italic mb-4">{"\"4 həftə ərzində kirpik xəttimdəki seyrək boşluqlar tamamilə doldu. Səbirlə istifadə etməyə dəyər!\""}</p>
            <p className="text-[10px] font-mono tracking-widest text-[#1C1613]/50 uppercase">— Nigar H., Sumqayıt</p>
          </div>
          <div className="p-6 bg-white border border-[#1C1613]/5">
            <div className="flex gap-1 text-[#C5A880] mb-2">
              {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
            </div>
            <p className="text-xs text-[#1C1613]/80 italic mb-4">{"\"Əvvəl kirpik qaynağı etdirirdim, kirpiklərim tökülmüşdü. Bu serum sayəsində öz kirpiklərim qaynaqdan da uzun oldu.\""}</p>
            <p className="text-[10px] font-mono tracking-widest text-[#1C1613]/50 uppercase">— Fəridə S., Bakı</p>
          </div>
          <div className="p-6 bg-white border border-[#1C1613]/5">
            <div className="flex gap-1 text-[#C5A880] mb-2">
              {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
            </div>
            <p className="text-xs text-[#1C1613]/80 italic mb-4">{"\"İnanılmaz dərəcədə yüngül və təhlükəsizdir. Heç bir allergiyam olmadı. Kirpiklər qalınlaşır və parıldayır.\""}</p>
            <p className="text-[10px] font-mono tracking-widest text-[#1C1613]/50 uppercase">— Aysel Ə., Gəncə</p>
          </div>
        </div>

      </div>
    </section>
  );
}
