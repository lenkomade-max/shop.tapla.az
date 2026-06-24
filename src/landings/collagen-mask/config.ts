import type { SectionConfig } from '@/types'

export const collagenMaskConfig = {
  slug: 'collagen-mask',
  title: 'Collagen Mask',
  subtitle: 'Dərinizi cavanlaşdırın',
  theme: 'medical' as const,
  sections: [
    {
      name: 'hero',
      title: 'Collagen Mask',
      subtitle: 'Peşəkar dəri bərpası',
      props: {
        description: 'Kollagenlə zəngin maska ilə dərinizi qidalandırın, cavanlaşdırın və təbii parıltısını qaytarın.',
        image: '/images/collagen-mask-hero.jpg',
        ctaText: 'İndi sifariş et',
      },
    },
    {
      name: 'benefits',
      title: 'Niyə Collagen Mask?',
      props: {
        benefits: [
          { title: 'Dərin bərpa', description: 'Kollagen dərinin dərin qatlarına nüfuz edərək hüceyrələri bərpa edir' },
          { title: 'Qırışlara qarşı', description: 'İlk istifadədən sonra incə xətlər və qırışlar azalır' },
          { title: 'Nəmləndirmə', description: '24 saat dərin nəmləndirmə təmin edir' },
          { title: 'Təbii parıltı', description: 'Dəriyə sağlam, təbii parıltı verir' },
          { title: 'Hər dəri tipi üçün', description: 'Həssas dəri də daxil olmaqla bütün dəri tipləri üçün uyğundur' },
          { title: 'Asan istifadə', description: 'Həftədə 2-3 dəfə, 15 dəqiqə çəkir' },
        ],
      },
    },
    {
      name: 'ingredients',
      title: 'Tərkibi',
      props: {
        ingredients: [
          { name: 'Dəniz kollageni', description: 'Tip I və III kollagen, dərinin elastikliyini bərpa edir' },
          { name: 'Hialuron turşusu', description: 'Güclü nəmləndirici, dərini doldurur və hamarlaşdırır' },
          { name: 'Vitamin C', description: 'Kollagen sintezini stimullaşdırır, qaralmanı azaldır' },
          { name: 'Aloe Vera', description: 'İltihab əleyhinə, sakitləşdirici və nəmləndirici təsir' },
          { name: 'Niacinamid (B3)', description: 'Məsamələri daraldır, dəri tonunu bərabərləşdirir' },
        ],
      },
    },
    {
      name: 'howToUse',
      title: 'Necə istifadə olunur?',
      props: {
        steps: [
          { title: 'Təmizləyin', description: 'Üzünüzü gel və ya köpük ilə təmizləyin' },
          { title: 'Tətbiq edin', description: 'Qalın təbəqə ilə maskanı üzünüzə çəkin, göz ətrafından qaçının' },
          { title: 'Gözləyin', description: '15-20 dəqiqə gözləyin, maska quruyana qədər' },
          { title: 'Yuyun', description: 'İlıq su ilə yaxalayın və dərinizi nəmləndirin' },
        ],
      },
    },
    {
      name: 'beforeAfter',
      title: 'Nəticələr',
      props: {
        items: [
          { before: '/images/before-1.jpg', after: '/images/after-1.jpg', label: '4 həftə istifadədən sonra' },
          { before: '/images/before-2.jpg', after: '/images/after-2.jpg', label: '8 həftə istifadədən sonra' },
        ],
      },
    },
    {
      name: 'testimonials',
      title: 'Müştəri rəyləri',
      props: {
        testimonials: [
          { name: 'Günel S.', text: 'İlk istifadədən sonra dərim yumşaq və nəmli oldu. 2 həftədən sonra qırışlar azaldı.', rating: 5 },
          { name: 'Turanə H.', text: 'Həssas dərim var, amma bu maska qıcıqlandırmadı. Dərim rahatladı.', rating: 5 },
          { name: 'Rəna Q.', text: 'Collagen Mask ən sevdiyim məhsul oldu. Dərim parlayır və gənc görünür.', rating: 5 },
          { name: 'Firuzə C.', text: 'Qiymət-keyfiyyət nisbəti mükəmməl. Davamlı istifadə edirəm.', rating: 4 },
        ],
      },
    },
    {
      name: 'faq',
      title: 'Tez-tez soruşulanlar',
      props: {
        items: [
          { question: 'Nə qədər tez-tez istifadə etməliyəm?', answer: 'Həftədə 2-3 dəfə istifadə etmək optimal nəticə üçün kifayətdir.' },
          { question: 'Hansı dəri tipləri üçün uyğundur?', answer: 'Bütün dəri tipləri üçün uyğundur, o cümlədən həssas və yağlı dəri.' },
          { question: 'Tərkibində heyvan məhsulları varmı?', answer: 'Xeyr, maska tam vegan tərkiblidir, heyvan məhsulları yoxdur.' },
          { question: 'Nə qədər müddətdə nəticə görünür?', answer: 'İlk istifadədən sonra dəri nəmli və yumşaq olur. Davamlı nəticə üçün 4-6 həftə istifadə tövsiyə olunur.' },
        ],
      },
    },
    {
      name: 'offer',
      title: 'Collagen Mask',
      subtitle: 'Məhdud təklif - 2 ədəd alana 1 ədəd pulsuz',
      props: {
        price: '35.90 ₼',
        oldPrice: '59.90 ₼',
        features: [
          'Kollagen maska (100ml)',
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
