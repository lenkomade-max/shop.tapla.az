'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Flame, Heart, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BenefitsStats() {
  const cards = [
    {
      metric: "98%",
      title: "Uzun Kirpiklər",
      desc: "Klinik sınaqlarda iştirak edən qadınların demək olar ki, hamısı cəmi 4 həftə ərzində kirpiklərinin gözlə görünən dərəcədə uzandığını təsdiqləyib.",
      icon: <Sparkles className="w-5 h-5 text-[#8A6E45]" />
    },
    {
      metric: "95%",
      title: "Sıxlıq və Dolğunluq",
      desc: "Zəifləmiş və seyrək kirpiklər yeni fəal peptid kompleksi sayəsində kökündən möhkəmlənərək daha sıx və qalın forma alır.",
      icon: <Flame className="w-5 h-5 text-[#8A6E45]" />
    },
    {
      metric: "92%",
      title: "Güclü Struktur",
      desc: "Kirpiklərin tökülməsi və qırılması sürətlə dayanır, hər bir tük elastiklik və təbii sağlam parıltı qazanır.",
      icon: <Heart className="w-5 h-5 text-[#8A6E45]" />
    },
    {
      metric: "100%",
      title: "Zərərsiz Formula",
      desc: "Sintetik hormonlar və zərərli kimyəvi maddələr yoxdur. Göz ətrafını qıcıqlandırmır, həssas gözlər üçün tamamilə təhlükəsizdir.",
      icon: <ShieldCheck className="w-5 h-5 text-[#8A6E45]" />
    }
  ];

  return (
    <section className="bg-white text-[#1C1613] py-24 px-6 lg:px-12 relative border-b border-[#1C1613]/5">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16 lg:mb-24">
          <p className="text-xs font-mono tracking-widest uppercase text-[#8A6E45]">Klinik Olaraq Sübut Edilmişdir</p>
          <h2 className="text-3xl sm:text-4xl font-serif tracking-tight font-normal">
            Süni Kirpiklərdən Azad Olun. <br />
            <span className="italic text-[#8A6E45] font-light">Təbii Gözəlliyinizə Keçid Edin.</span>
          </h2>
          <p className="text-sm font-sans text-[#1C1613]/70 leading-relaxed">
            Bizim formulumuz laboratoriya şəraitində dermatoloqlar və oftalmoloqlar tərəfindən ciddi sınaqlardan keçmişdir. Nəticələr fərziyyə deyil, elmi faktdır.
          </p>
        </div>

        {/* Stats Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 lg:pb-12">
          {cards.map((card, index) => {
            // Asymmetrical offsets and backgrounds for an editorial luxury look
            const asymmetryClasses = [
              "lg:translate-y-0 bg-[#FAF8F5] rounded-tl-2xl",
              "lg:translate-y-8 bg-[#F6ECE2]/40 rounded-tr-2xl",
              "lg:-translate-y-4 bg-[#FAF8F5] rounded-bl-2xl",
              "lg:translate-y-12 bg-[#EFE6DC]/50 rounded-br-2xl"
            ][index];

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
                className={cn(
                  "group p-5 sm:p-6 lg:p-8 border border-[#1C1613]/5 hover:border-[#C5A880]/30 transition-all duration-300 flex flex-col justify-between h-auto min-h-[220px] lg:aspect-[3/4] relative overflow-hidden",
                  asymmetryClasses
                )}
              >
                {/* Top Row with icon */}
                <div className="flex justify-between items-center">
                  <div className="p-2 sm:p-3 bg-white rounded-full shadow-xs border border-[#1C1613]/5">
                    {card.icon}
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-[#1C1613]/40">STUDY {index + 1}</span>
                </div>

                {/* Big Metric Display */}
                <div className="my-3 sm:my-4 lg:my-6">
                  <p className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#1C1613] group-hover:text-[#8A6E45] transition-colors duration-300">
                    {card.metric}
                  </p>
                  <h3 className="text-base sm:text-lg font-sans font-medium tracking-tight mt-1 sm:mt-2 text-[#1C1613]">
                    {card.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-xs font-sans text-[#1C1613]/70 leading-relaxed border-t border-[#1C1613]/10 pt-3 sm:pt-4">
                  {card.desc}
                </p>

                {/* Hover highlight line */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#C5A880] group-hover:w-full transition-all duration-300" />
              </motion.div>
            );
          })}
        </div>

        {/* Clinical Note Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 text-center text-[10px] font-mono tracking-widest text-[#1C1613]/40 uppercase"
        >
          * 56 İŞTİRAKÇI İLƏ KEÇİRİLƏN 8 HƏFTƏLİK DERMATOLOJİ SINAQLARIN NƏTİCƏLƏRİNƏ ƏSASƏN.
        </motion.div>

      </div>
    </section>
  );
}
