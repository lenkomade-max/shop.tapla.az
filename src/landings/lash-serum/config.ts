import type { SectionConfig } from '@/types'

export const lashSerumConfig = {
  slug: 'lash-serum',
  title: 'Lash Serum',
  subtitle: 'Kirpiklərinizi gücləndirin',
  theme: 'rose' as const,
  sections: [
    {
      name: 'hero',
      title: 'Lash Serum',
      subtitle: 'Təbii kirpik uzadıcı',
      props: {
        description: 'Təbii inqrediyentlərlə kirpiklərinizi gücləndirin, uzadın və qalınlaşdırın. 4 həftə ərzində nəticəni görün.',
        ctaText: 'İndi sifariş et',
      },
    },
    {
      name: 'benefits',
      title: 'Niyə Lash Serum?',
      props: {
        benefits: [
          { title: 'Təbii tərkib', description: 'Bitki ekstraktları və vitaminlərlə zəngin, kimyəvi maddələrdən azad' },
          { title: 'Sürətli nəticə', description: '4 həftə ərzində kirpikləriniz 2 dəfə uzun görünür' },
          { title: 'Təhlükəsiz formul', description: 'Oftalmoloji testdən keçmiş, göz ətrafı üçün təhlükəsiz' },
          { title: 'Asan tətbiq', description: 'Gündə bir dəfə, cəmi 10 saniyə çəkir' },
          { title: 'Qalıcı effekt', description: 'Müntəzəm istifadədə kirpiklər qalıcı şəkildə güclənir' },
          { title: 'Sərfəli qiymət', description: 'Salon prosedurlarından 5 dəfə ucuz' },
        ],
      },
    },
    {
      name: 'ingredients',
      title: 'Tərkibi',
      props: {
        ingredients: [
          { name: 'Biotin (B7 vitamini)', description: 'Kirpiklərin strukturunu gücləndirir və uzanmasını stimullaşdırır' },
          { name: 'Kastor yağı', description: 'Təbii nəmləndirici, kirpikləri qırılmadan qoruyur' },
          { name: 'Pantenol (B5)', description: 'Kirpikləri qalınlaşdırır və həcm verir' },
          { name: 'Arqinin', description: 'Kirpik folikullarını qidalandırır və gücləndirir' },
          { name: 'Hialuron turşusu', description: 'Dərin nəmləndirmə təmin edir, kirpikləri elastik edir' },
        ],
      },
    },
    {
      name: 'howToUse',
      title: 'Necə istifadə olunur?',
      props: {
        steps: [
          { title: 'Təmizləyin', description: 'Makiyajı tam təmizləyin və kirpikləri qurulayın' },
          { title: 'Tətbiq edin', description: 'Fırçanı kirpik kökünə çəkin, yuxarı və aşağı kirpiklərə' },
          { title: 'Gözləyin', description: '10-15 saniyə gözləyin ki, serum əmilsin' },
          { title: 'Təkrarlayın', description: 'Hər axşam, gündə bir dəfə müntəzəm istifadə edin' },
        ],
      },
    },
    {
      name: 'testimonials',
      title: 'Müştəri rəyləri',
      props: {
        testimonials: [
          { name: 'Aysel M.', text: '1 aydır istifadə edirəm, kirpiklərim həqiqətən uzanıb və qalınlaşıb. Çox məmnunam!', rating: 5 },
          { name: 'Lalə K.', text: 'Təbii tərkibli olduğu üçün seçdim, heç bir qıcıqlanma yoxdu. Tövsiyə edirəm.', rating: 5 },
          { name: 'Nigar R.', text: 'Salona getməkdən bezmişdim, bu serum evdə rahat istifadə olunur və nəticə əladır.', rating: 5 },
        ],
      },
    },
    {
      name: 'faq',
      title: 'Tez-tez soruşulanlar',
      props: {
        items: [
          { question: 'Nə qədər müddətdə nəticə görünür?', answer: 'İlk nəticələr 2-3 həftə ərzində görünməyə başlayır. Tam nəticə üçün 8-12 həftə müntəzəm istifadə tövsiyə olunur.' },
          { question: 'Yan təsiri varmı?', answer: 'Serum tam təbii tərkibli olduğu üçün yan təsiri yoxdur. Ancaq gözə təmasdan çəkinin, təmas olduqda bol su ilə yaxalayın.' },
          { question: 'Hamilelikdə istifadə etmək olar?', answer: 'Hamilelik və əmizdirmə dövründə istifadə etməzdən əvvəl həkimə müraciət etmək tövsiyə olunur.' },
          { question: 'Bir şüşə nə qədər istifadə olunur?', answer: 'Bir şüşə (5ml) müntəzəm istifadədə təxminən 2-3 ay yetər.' },
        ],
      },
    },
    {
      name: 'offer',
      title: 'Lash Serum',
      subtitle: 'Məhdud təklif',
      props: {
        price: '29.90 ₼',
        oldPrice: '49.90 ₼',
        features: [
          'Təbii tərkibli serum (5ml)',
          'Pulsuz çatdırılma',
          'Ödəniş qəbz ilə',
          '30 gün geri qaytarma',
        ],
      },
    },
    {
      name: 'checkout',
      title: 'Sifariş verin',
      props: {
        submitLabel: 'Sifarişi təsdiq et',
      },
    },
  ] satisfies SectionConfig[],
}
