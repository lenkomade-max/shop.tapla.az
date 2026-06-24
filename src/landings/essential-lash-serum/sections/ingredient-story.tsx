'use client';

import { motion } from 'framer-motion';
import { Droplet, Leaf, Sparkles, Check, Info } from 'lucide-react';

export function IngredientStory() {
  const ingredients = [
    {
      name: "Myristoyl Pentapeptide-17",
      category: "Aktiv Peptid Kompleksi",
      benefit: "Böyüməni Sürətləndirir",
      desc: "Eyelash follikullarında keratin sintezini birbaşa stimullaşdıran premium biotexnoloji peptid. Kirpiklərin daha qalın, möhkəm və uzun çıxmasını təmin edir.",
      icon: <Sparkles className="w-5 h-5 text-[#8A6E45]" />,
      percentage: "Konsentrasiya: Aktiv"
    },
    {
      name: "Biotin (Vitamin B7)",
      category: "Gücləndirici Koferment",
      benefit: "Qırılmanın Qarşısını Alır",
      desc: "Kirpiklərin əsas struktur daşı olan keratin zülalını gücləndirir. Tüklərin elastikliyini artırır, köhnəlmə, qırılma və daxili zəifliyi aradan qaldırır.",
      icon: <Check className="w-5 h-5 text-[#8A6E45]" />,
      percentage: "Təmiz B7 Vitamini"
    },
    {
      name: "Hialuron Turşusu",
      category: "Təbii Humektant",
      benefit: "İpək Kimi Nəmləndirmə",
      desc: "Hər bir kirpik tükünə nüfuz edərək onu dərindən nəmləndirir, elastikliyini bərpa edir. Kirpiklərə ipək kimi yumşaqlıq və sağlam parıltı verir.",
      icon: <Droplet className="w-5 h-5 text-[#8A6E45]" />,
      percentage: "Yüksək Molekulyar"
    },
    {
      name: "Balqabaq Toxumu Ekstraktı",
      category: "Üzvi Bitki Ekstraktı",
      benefit: "Folikulları Qidalandırır",
      desc: "Sink, aminturşular və fitosterollarla zəngindir. Yatmış kökləri dərindən qidalandırır, onların inkişafı üçün tam təbii və zəngin mikromühit yaradır.",
      icon: <Leaf className="w-5 h-5 text-[#8A6E45]" />,
      percentage: "100% Orqanik Soyuq Sıxım"
    }
  ];

  return (
    <section className="bg-white text-[#1C1613] py-24 px-6 lg:px-12 relative overflow-hidden border-b border-[#1C1613]/5">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16 lg:mb-24">
          <div className="lg:col-span-6 space-y-4">
            <p className="text-xs font-mono tracking-widest uppercase text-[#8A6E45]">Gözəl Tərkib, Şəffaf Elm</p>
            <h2 className="text-3xl sm:text-5xl font-serif tracking-tight font-normal leading-tight">
              Təbiətin Gücü, <br />
              <span className="italic text-[#8A6E45] font-light">Elmin Dəqiqliyi.</span>
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-8">
            <p className="text-sm font-sans text-[#1C1613]/70 leading-relaxed max-w-xl">
              Biz inanırıq ki, premium gözəllik həm də güvənli olmalıdır. Formulumuzdakı hər bir aktiv maddə kirpiklərin təbii böyümə dövrünü təhlükəsiz şəkildə sürətləndirmək üçün seçilmişdir.
            </p>
            <div className="inline-flex items-center gap-2 mt-4 text-xs font-mono text-[#8A6E45] uppercase">
              <Info className="w-3.5 h-3.5" />
              <span>Paraben, Silikon və Hormon yoxdur</span>
            </div>
          </div>
        </div>

        {/* Bento/Grid Ingredients */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ingredients.map((ing, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: idx * 0.1, ease: 'easeOut' }}
              className="p-8 lg:p-10 bg-[#FAF8F5] border border-[#1C1613]/5 hover:border-[#C5A880]/30 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-6">
                {/* Icon & Specs row */}
                <div className="flex justify-between items-center">
                  <div className="p-3 bg-white rounded-full border border-[#1C1613]/5">
                    {ing.icon}
                  </div>
                  <span className="text-[10px] font-mono tracking-widest text-[#1C1613]/40 uppercase bg-white px-2.5 py-1 rounded-full border border-[#1C1613]/5">
                    {ing.percentage}
                  </span>
                </div>

                {/* Info block */}
                <div className="space-y-2">
                  <p className="text-xs font-mono tracking-wider text-[#8A6E45] uppercase">{ing.category}</p>
                  <h3 className="text-2xl font-serif text-[#1C1613] font-normal group-hover:text-[#8A6E45] transition-colors duration-300">
                    {ing.name}
                  </h3>
                  <div className="inline-block bg-white text-[#8A6E45] border border-[#C5A880]/30 px-2 py-0.5 rounded-xs text-[10px] font-mono uppercase tracking-wider">
                    FAYDA: {ing.benefit}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm font-sans text-[#1C1613]/70 leading-relaxed pt-2 border-t border-[#1C1613]/10">
                  {ing.desc}
                </p>
              </div>

              {/* Decorative brand micro line */}
              <div className="mt-8 flex justify-end">
                <span className="text-[10px] font-mono tracking-widest text-[#1C1613]/30 uppercase group-hover:text-[#8A6E45] transition-colors duration-300">
                  ESSENTIAL LABS • FRANCE FORMULA
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
