'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Serum tamamilə təhlükəsizdirmi? Gözə hər hansı zərəri varmı?",
      a: "Bəli, Essential Lash Serum dermatoloji və oftalmoloji sınaqlardan tam keçmişdir. Tərkibində göz rəngini dəyişən və ya hormonal qıcıqlanmaya səbəb olan sintetik hormonlar (prostaqlandinlər), parabenlər, silikonlar və ya süni ətirlər yoxdur. Həssas gözlər üçün tamamilə təhlükəsizdir."
    },
    {
      q: "İlk müsbət nəticələri nə vaxt görə bilərəm?",
      a: "İlk müsbət dəyişikliklər (tökülmənin dayanması, kirpiklərin daha parlaq və canlı olması) adətən 2 həftəlik mütəmadi istifadədən sonra hiss olunur. 4-cü həftədə sıxlıq və uzunluq artımı gözlə görünür, 8-ci həftədə isə kirpiklər özlərinin ən uzun və dolğun zirvəsinə çatır."
    },
    {
      q: "Bir flakon (3 ml) nə qədər müddətə kifayət edir?",
      a: "Bizim 3 ml-lik flakonumuz gündəlik mütəmadi istifadə ilə təxminən 2.5 - 3 ay üçün tam kifayət edir. Bu da 8-12 həftəlik tam bir intensiv inkişaf kursunu əhatə edir."
    },
    {
      q: "Linza istifadə edənlər serumu çəkə bilərmi?",
      a: "Bəli, linza istifadə edənlər üçün heç bir maneə yoxdur. Sadəcə olaraq serumu tətbiq etməzdən əvvəl linzaları çıxarmaq və serum çəkildikdən 15-20 dəqiqə sonra yenidən taxmaq və ya sadəcə gecə yatmazdan əvvəl tətbiq etmək tövsiyə olunur."
    },
    {
      q: "Kurs bitdikdən sonra kirpiklərim dərhal töküləcəkmi?",
      a: "Xeyr. Kirpiklər öz təbii tökülmə dövrlərinə (təxminən 3-4 ay) malikdir. Kursu bitirdikdən sonra əldə etdiyiniz möhtəşəm uzunluğu və sıxlığı qorumaq üçün serumu hər gün deyil, sadəcə həftədə 2-3 dəfə tətbiq etməyiniz kifayətdir."
    }
  ];

  return (
    <section className="bg-[#FAF8F5] text-[#1C1613] py-24 px-6 lg:px-12 relative border-b border-[#1C1613]/5">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Block */}
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16 lg:mb-20">
          <p className="text-xs font-mono tracking-widest uppercase text-[#8A6E45]">Sizi Maraqlandıran Suallar</p>
          <h2 className="text-3xl sm:text-4xl font-serif tracking-tight font-normal text-[#1C1613]">
            Sual-Cavab Mərkəzi
          </h2>
          <p className="text-sm font-sans text-[#1C1613]/70">
            Məhsulumuz və onun istifadəsi ilə bağlı ən çox verilən sualları cavablandırdıq. Əlavə suallarınız olarsa, müştəri xidmətimizlə əlaqə saxlaya bilərsiniz.
          </p>
        </div>

        {/* Elegant Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-[#1C1613]/5 transition-all duration-300 shadow-xs"
              >
                {/* Trigger Button */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex justify-between items-center gap-4 group"
                  id={`faq-trigger-${idx}`}
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-[#8A6E45] shrink-0" />
                    <span className="text-sm sm:text-base font-sans font-medium text-[#1C1613] group-hover:text-[#8A6E45] transition-colors duration-300">
                      {faq.q}
                    </span>
                  </div>
                  <div className={`w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#1C1613]/5 flex items-center justify-center shrink-0 transition-transform duration-500 ${isOpen ? 'rotate-180 bg-[#1C1613] text-white' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Content Panel with Framer Motion */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-[#1C1613]/70 leading-relaxed border-t border-[#1C1613]/5">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
