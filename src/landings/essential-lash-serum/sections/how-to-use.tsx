'use client';

import { motion } from 'framer-motion';
import { Droplet, Sparkles, RefreshCw, Moon } from 'lucide-react';

export function HowToUse() {
  const steps = [
    {
      step: "01",
      title: "Göz Ətrafını Tam Təmizləyin",
      subtitle: "Hazırlıq Mərhələsi",
      desc: "Üzünüzü yuyun və göz ətrafındakı makiyaj, kir və ya yağ qalıqlarını tamamilə təmizləyin. Serumun dərindən hopması üçün dərinin quru və təmiz olması olduqca vacibdir.",
      icon: <RefreshCw className="w-5 h-5 text-[#8A6E45]" />
    },
    {
      step: "02",
      title: "İncə Bir Xətt Halında Çəkin",
      subtitle: "Düzgün Tətbiq",
      desc: "Fırçadakı artıq serumu təmizləyərək, yuxarı kirpiklərinin dibi boyunca (göz layneri çəkdiyiniz hissəyə) incə bir xətt halında çəkin. Alt kirpiklərə çəkməyə ehtiyac yoxdur.",
      icon: <Droplet className="w-5 h-5 text-[#8A6E45]" />
    },
    {
      step: "03",
      title: "Gecə Boyu Qoruyun",
      subtitle: "Müntəzəm Ritual",
      desc: "Serumu tətbiq etdikdən sonra qurumasını gözləyin. Gözlərinizi ovuşdurmayın. Serum gecə boyu dərindən fəaliyyət göstərir. Hər gecə yatmazdan əvvəl mütəmadi istifadə edin.",
      icon: <Moon className="w-5 h-5 text-[#8A6E45]" />
    }
  ];

  return (
    <section className="bg-white text-[#1C1613] py-24 px-6 lg:px-12 relative border-b border-[#1C1613]/5">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16 lg:mb-24">
          <p className="text-xs font-mono tracking-widest uppercase text-[#8A6E45]">Gündəlik İncə Toxunuş</p>
          <h2 className="text-3xl sm:text-4xl font-serif tracking-tight font-normal text-[#1C1613]">
            Gözəllik Ritualı: Necə İstifadə Etməli?
          </h2>
          <p className="text-sm font-sans text-[#1C1613]/70">
            Cəmi 3 sadə addımla hər gecə yatmazdan əvvəl cəmi 10 saniyə vaxt ayıraraq xəyalınızdakı təbii kirpiklərə sahib olun.
          </p>
        </div>

        {/* Steps Horizontal/Vertical Stack */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: 'easeOut' }}
              className="relative p-8 lg:p-10 bg-[#FAF8F5] border border-[#1C1613]/5 flex flex-col justify-between group overflow-hidden"
            >
              {/* Step background absolute number */}
              <div className="absolute right-[-10px] top-[-10px] text-8xl lg:text-9xl font-serif text-[#1C1613]/5 select-none font-bold group-hover:text-[#8A6E45]/10 transition-colors duration-500">
                {item.step}
              </div>

              <div className="space-y-6 relative z-10">
                {/* Step circle marker */}
                <div className="flex justify-between items-center">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-xs border border-[#1C1613]/5">
                    {item.icon}
                  </div>
                  <span className="text-xs font-mono tracking-widest text-[#8A6E45] uppercase bg-white px-2 py-0.5 rounded-full border border-[#1C1613]/5 font-semibold">
                    ADDIM {item.step}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-mono tracking-wider text-[#1C1613]/40 uppercase">{item.subtitle}</p>
                  <h3 className="text-xl font-serif text-[#1C1613] font-normal group-hover:text-[#8A6E45] transition-colors duration-300">
                    {item.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm font-sans text-[#1C1613]/70 leading-relaxed pt-4 border-t border-[#1C1613]/10">
                  {item.desc}
                </p>
              </div>

              {/* Little ritual instruction note */}
              <div className="mt-8 flex items-center gap-2 relative z-10">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                <span className="text-[10px] font-mono tracking-widest text-[#1C1613]/40 uppercase group-hover:text-[#8A6E45]/60 transition-colors duration-300">
                  Kurs müddəti: 8-12 Həftə
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
