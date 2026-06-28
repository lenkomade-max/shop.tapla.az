import { Product, Review, FAQ, Benefit, NavigationItem, Category } from '../types';

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    label: 'MƏHSULLAR',
    href: '/products',
    children: [
      { label: 'Qulaqlıq & Audio', href: '/category/qulaqliq-ve-audio' },
      { label: 'Telefonlar & Planşetlər', href: '/category/telefonlar-ve-plansetler' },
      { label: 'Kiçik Məişət Texnikası', href: '/category/kicik-meiset-texnikasi' },
      { label: 'Ağıllı Saat & Gadget', href: '/category/aqilli-saat-ve-gadget' },
      { label: 'Sağlamlıq & İdman', href: '/category/saglamliq-ve-idman' },
    ],
  },
  {
    label: 'KAMPANİYALAR',
    href: '/#products',
    isBadge: true,
    badgeText: 'ENDİRİM',
  },
  {
    label: 'RƏYLƏR',
    href: '/#reviews',
  },
  {
    label: 'HAQQIMIZDA',
    href: '/huquqi-melumat',
  },
  {
    label: 'FAQ / DƏSTƏK',
    href: '/#faq',
  },
];

export const VALUE_PROPS = [
  {
    id: 'prop-1',
    title: 'MƏHSUL SEÇİM KÖMƏKÇİSİ',
    description: '1 dəqiqəlik suallarla sizə ən uyğun məhsulu tapaq.',
    iconName: 'Sparkles',
    actionText: 'TESTƏ BAŞLA',
    href: '#quiz',
  },
  {
    id: 'prop-2',
    title: 'MÜQAYİSƏ ET',
    description: 'Büdcənizə və tələblərinizə uyğun ən yaxşı məhsulu müqayisə edin.',
    iconName: 'Search',
    actionText: 'MƏHSULLARI MÜQAYİSƏ ET',
    href: '#compare',
  },
  {
    id: 'prop-3',
    title: 'VİRTUAL KÖMƏKÇİ',
    description: 'Süni intellekt dəstəkli məhsul tövsiyələri.',
    iconName: 'Bot',
    actionText: 'TÖVSİYƏ AL',
    href: '#ai-advisor',
  },
  {
    id: 'prop-4',
    title: 'TEXNİKİ DƏSTƏK',
    description: 'Bizim texniki mütəxəssislərimizlə ödənişsiz konsultasiya.',
    iconName: 'PhoneCall',
    actionText: 'DƏSTƏK AL',
    href: '#support',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'macbook-air-m3',
    slug: 'macbook-air-m3',
    name: 'Apple MacBook Air M3',
    subtitle: '13.6" Liquid Retina, 8GB RAM, 256GB SSD',
    description: 'Apple MacBook Air M3 — güclü performans və yığcam dizaynın mükəmməl birləşməsi. M3 çip ilə indiyə qədərki ən sürətli MacBook Air. 18 saat batareya ömrü, cavanlaşdırılmış Liquid Retina displey və təkmilləşdirilmiş kamera ilə iş və əyləncə üçün ideal seçim.',
    price: 2399.00,
    originalPrice: 2699.00,
    rating: 4.9,
    reviewsCount: 156,
    images: [
      'https://picsum.photos/id/0/800/1000',
      'https://picsum.photos/id/1/800/1000',
      'https://picsum.photos/id/2/800/1000',
    ],
    category: 'Notebook / Ultrabook',
    benefits: [
      'M3 çip ilə inanılmaz sürət və performans',
      '18 saat batareya ömrü — bütün gün iş',
      '13.6" Liquid Retina displey, canlı rənglər',
      'Fanless dizayn — tamamilə səssiz işləmə',
    ],
    howToUse: 'Qutudan çıxaran kimi istifadəyə hazırdır. macOS ilə tanış olun, Apple ID ilə daxil olun və işə başlayın. Touch ID barmaq izi sensoru ilə təhlükəsiz giriş. MagSafe ilə sürətli şarj.',
    ingredients: '100% təkrar emal edilmiş alüminium korpus, Apple M3 çip (8-core CPU, 10-core GPU), 8GB birləşmiş yaddaş, 256GB SSD.',
    tags: ['Ən Çox Satılan', 'Premium'],
    isNew: true,
    tryOnEnabled: false,
    shades: [
      { name: 'Ulduz Gümüşü', colorHex: '#E8E8E0', isHot: true, label: 'Starlight' },
      { name: 'Kosmos Boz', colorHex: '#2C2C2E', label: 'Space Grey' },
      { name: 'Gecə Mavisi', colorHex: '#1E2A3A', label: 'Midnight' },
    ],
  },
  {
    id: 'samsung-galaxy-s25-ultra',
    slug: 'samsung-galaxy-s25-ultra',
    name: 'Samsung Galaxy S25 Ultra',
    subtitle: '256GB, 12GB RAM, 200MP Kamera',
    description: 'Samsung Galaxy S25 Ultra — flagship smartfonların yeni nəşri. 200MP əsas kamera, Snapdragon 8 Elite prosessoru, S Pen dəstəyi və nəhəng 6.9" Dynamic AMOLED displey ilə həm peşəkar fotoqrafiya, həm də məhsuldarlıq üçün ən güclü seçim.',
    price: 3299.00,
    originalPrice: 3599.00,
    rating: 4.8,
    reviewsCount: 203,
    images: [
      'https://picsum.photos/id/3/800/1000',
      'https://picsum.photos/id/4/800/1000',
    ],
    category: 'Smartfon / Planşet',
    benefits: [
      '200P kamera — peşəkar səviyyəli foto və video',
      'S Pen dəstəyi — dəqiq qeyd və rəsm imkanı',
      '6.9" Dynamic AMOLED 120Hz ekran',
      'Snapdragon 8 Elite — ən sürətli mobil prosessor',
    ],
    howToUse: 'Cihazı yandırın və ekrandakı təlimatları izləyin. Samsung Hesabı yaradın və ya daxil olun. S Pen-i çıxararaq qeyd və rəsmə başlayın. Kamera tətbiqi ilə peşəkar foto və videolar çəkin.',
    tags: ['YENİ', 'Premium'],
    shades: [
      { name: 'Titan Qara', colorHex: '#1A1A1A', label: 'Titanium Black' },
      { name: 'Titan Boz', colorHex: '#8B8B8B', label: 'Titanium Grey' },
    ],
  },
  {
    id: 'sony-wh-1000xm5',
    slug: 'sony-wh-1000xm5',
    name: 'Sony WH-1000XM5',
    subtitle: 'Simsiz Noise Cancelling Qulaqlıq, 30 saat',
    description: 'Sony WH-1000XM5 — dünyanın ən yaxşı noise-cancelling qulaqlığı. Yeni nəsil səs-küy bloklaması, Hi-Res Audio dəstəyi, 30 saat batareya ömrü və ultra rahat dizayn ilə həm səyahət, həm də ofis üçün ideal.',
    price: 599.00,
    originalPrice: 699.00,
    rating: 4.7,
    reviewsCount: 89,
    images: [
      'https://picsum.photos/id/5/800/1000',
      'https://picsum.photos/id/6/800/1000',
    ],
    category: 'Aksesuar / Qadjet',
    benefits: [
      'Qabaqcıl ANC səs-küy bloklaması',
      '30 saat batareya ömrü — 3 dəq şarjla 3 saat',
      'Hi-Res Audio və LDAC kodek dəstəyi',
      'Yumşaq, rahat dizayn — saatlarla rahat istifadə',
    ],
    howToUse: 'Bluetooth vasitəsilə cihazınıza qoşun. Sony Headphones Connect tətbiqi ilə səs profillərini fərdiləşdirin. Toxunma sensorları ilə mahnı dəyişdirin, zəng cavablandırın və səs köməkçinizə müraciət edin.',
    tags: ['Populyar', 'Premium Səs'],
    shades: [
      { name: 'Qara', colorHex: '#1C1C1E', label: 'Black' },
      { name: 'Krem', colorHex: '#F5F0E8', label: 'Silver' },
    ],
  },
  {
    id: 'ipad-pro-m4',
    slug: 'ipad-pro-m4',
    name: 'iPad Pro M4',
    subtitle: '11" Ultra Retina XDR, 256GB, Wi-Fi',
    description: 'iPad Pro M4 — Apple-ın ən güclü planşeti. M4 çip ilə kompüter səviyyəsində performans, Ultra Retina XDR displey, Apple Pencil Pro dəstəyi və yeni Magic Keyboard ilə laptopu əvəz edəcək qədər güclü.',
    price: 2199.00,
    originalPrice: 2499.00,
    rating: 4.9,
    reviewsCount: 112,
    images: [
      'https://picsum.photos/id/7/800/1000',
      'https://picsum.photos/id/8/800/1000',
    ],
    category: 'Planşet',
    benefits: [
      'M4 çip — kompüter səviyyəsində performans',
      'Ultra Retina XDR displey — peşəkar rəng dəqiqliyi',
      'Apple Pencil Pro — yeni nəsil rəsm təcrübəsi',
      'Magic Keyboard ilə laptop təcrübəsi',
    ],
    howToUse: 'iPad Pro-nu yandırın, Face ID qurun. Apple Pencil Pro-nu maqnitlə birləşdirin. Stage Manager ilə çoxlu pəncərə rejimində işləyin. Final Cut Pro və Logic Pro ilə peşəkar məzmun yaradın.',
    tags: ['YENİ', 'Premium Planşet'],
    shades: [
      { name: 'Kosmos Boz', colorHex: '#2C2C2E', label: 'Space Grey' },
      { name: 'Gümüş', colorHex: '#E3E3E3', label: 'Silver' },
    ],
  },
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    reviewerName: 'Kənan Hüseynov',
    rating: 5,
    title: 'MacBook Air M3 — iş üçün ən ideal seçim',
    comment: 'MacBook Air M3-ü 2 həftədir istifadə edirəm. Performansı inanılmazdır — bir neçə proqramı eyni anda açıb işləmək heç bir yavaşlama yaratmır. Batareya ömrü həqiqətən 18 saat civarındadır, bütün gün şarj etmədən işləyirəm. Displey çox canlı və göz oxşayır. Çəkisi o qədər yüngüldür ki, çantada daşıyanda hiss etmirsiniz. TAPLA-da sifariş verdim, ertəsi gün Bakıda təhvil aldım. Qiymət bazarda ən sərfəli idi, tövsiyə edirəm!',
    date: '20 İyun 2026',
    location: 'Bakı',
    verifiedBuyer: true,
    likes: 32,
    dislikes: 0,
  },
  {
    id: 'rev-2',
    reviewerName: 'Nicat Əliyev',
    rating: 5,
    title: 'Galaxy S25 Ultra — kamera inanılmazdır',
    comment: 'S25 Ultra-nı aldığım gündən bəri şəkil çəkməyə doymuram. 200MP kamera o qədər detallıdır ki, zoom etdikdə belə heç bir piksel itkisi yoxdur. Gecə rejimi də çox təsir edicidir. S Pen ilə qeydlər aparmaq çox rahatdır. Ekran böyük və parlaqdır, video izləmək üçün idealdır. Çatdırılma sürətli idi, qiymət rəqiblərdən xeyli ucuz. TAPLA-da aldığım üçün çox məmnunam.',
    date: '15 İyun 2026',
    location: 'Sumqayıt',
    verifiedBuyer: true,
    likes: 27,
    dislikes: 1,
  },
  {
    id: 'rev-3',
    reviewerName: 'Səidə Kərimova',
    rating: 5,
    title: 'Sony WH-1000XM5 — səs-küydən tam izolyasiya',
    comment: 'İş yerim səs-küylü olduğu üçün yaxşı noise-cancelling qulaqlıq axtarırdım. Sony WH-1000XM5 hər şeyi tamamilə süzür, yalnız musiqini eşidirəm. Səs keyfiyyəti mükəmməldir, baslar dərin, yüksək tezliklər təmizdir. 30 saat batareya ömrü həqiqətən işləyir, həftədə bir dəfə şarj edirəm. Qulaqlıq çox rahatdır, saatlarla istifadə etsəm də qulaqlarım ağrımır. TAPLA-dan sifariş etdim, qiymət çox uyğun idi.',
    date: '10 İyun 2026',
    location: 'Bakı',
    verifiedBuyer: true,
    likes: 18,
    dislikes: 0,
  },
  {
    id: 'rev-4',
    reviewerName: 'Rəşad Məmmədov',
    rating: 4,
    title: 'iPad Pro M4 — laptopu əvəz edən güc',
    comment: 'iPad Pro M4-ü həm iş, həm də rəsm üçün aldım. M4 çip o qədər sürətlidir ki, Final Cut Pro-da 4K video montajı belə problemsiz işləyir. Apple Pencil Pro ilə rəsm çəkmək kağız üzərindəki kimi təbiidir. Bir ulduzu ona görə əskik etdim ki, Magic Keyboard ayrıca satılır və bahadır. Amma ümumilikdə cihaz mükəmməldir. TAPLA-dan sifariş etdim, çatdırılma sürətli, qiymət münasib idi.',
    date: '01 İyun 2026',
    location: 'Gəncə',
    verifiedBuyer: true,
    likes: 14,
    dislikes: 2,
  },
];

export const FAQS: FAQ[] = [
  {
    id: 'faq-1',
    question: 'TAPLA MARKETPLACE-də məhsulların zəmanəti varmı?',
    answer: 'Bəli, bütün məhsullarımız rəsmi zəmanətlə təqdim olunur. Notebook və smartfonlar üçün 2 il, aksesuarlar üçün 1 il rəsmi zəmanət mövcuddur. İstehsal qüsuru aşkar edildikdə məhsul tamamilə yenisi ilə əvəz olunur.',
    category: 'Zəmanət',
  },
  {
    id: 'faq-2',
    question: 'Məhsulu neçə günə geri qaytara bilərəm?',
    answer: 'Məhsulu aldıqdan sonra 14 gün ərzində geri qaytarmaq mümkündür. Məhsul istifadə olunmamış, orijinal qablaşdırmada və tam dəstdə olmalıdır. Qaytarılma prosesi tamamilə ödənişsizdir və pulunuz 3-5 iş günü ərzində geri qaytarılır.',
    category: 'Qaytarma',
  },
  {
    id: 'faq-3',
    question: 'Çatdırılma şərtləriniz necədir? Rayonlara göndəriş var?',
    answer: 'Bakı, Sumqayıt və Xırdalan daxilində çatdırılma tamamilə PULSUZDUR və 24 saat ərzində ünvanınıza çatdırılır. Azərbaycanın bütün digər şəhər və rayonlarına sifarişiniz 2-3 iş günü ərzində çatdırılır.',
    category: 'Çatdırılma',
  },
  {
    id: 'faq-4',
    question: 'Rəsmi zəmanət şərtləri necədir?',
    answer: 'Bütün məhsullarımız rəsmi distribütor zəmanəti ilə təqdim olunur. Zəmanət müddəti ərzində hər hansı texniki problem yarandıqda, məhsulunuz pulsuz təmir olunur və ya dəyişdirilir. Zəmanət şərtləri hər məhsulun səhifəsində ətraflı göstərilir.',
    category: 'Zəmanət',
  },
  {
    id: 'faq-5',
    question: 'Məhsulun orijinal olduğunu necə yoxlaya bilərəm?',
    answer: 'Bütün məhsullarımız rəsmi distribütorlardan təchiz olunur və orijinallıq zəmanəti daşıyır. Hər məhsulun üzərində unikal seriya nömrəsi mövcuddur. Bu nömrəni istehsalçının rəsmi saytında yoxlaya bilərsiniz. Orijinal olmayan məhsula görə 100% pul geri zəmanəti veririk.',
    category: 'Təhlükəsizlik',
  },
];

export const RITUAL_STEPS = [
  {
    stepNumber: 1,
    title: 'MƏHSUL SEÇİMİ',
    subtitle: 'Kateqoriyaları araşdırın',
    description: 'Notebook, smartfon, planşet, aksesuar və daha çoxu — bütün kateqoriyaları kəşf edin. Filtrlərlə ehtiyacınıza ən uyğun məhsulu tapın.',
    image: 'https://picsum.photos/id/0/800/800',
    actionText: 'MƏHSULLARA BAX',
    href: '/products',
  },
  {
    stepNumber: 2,
    title: 'XÜSUSİYYƏTLƏRİ MÜQAYİSƏ EDİN',
    subtitle: 'Məlumatlı qərar verin',
    description: 'Məhsulların texniki xüsusiyyətlərini, qiymətlərini və istifadəçi rəylərini müqayisə edin. Ən yaxşı seçimi etmək üçün bütün məlumatlar sizin üçün hazırdır.',
    image: 'https://picsum.photos/id/1/800/800',
    actionText: 'MÜQAYİSƏ ET',
    href: '/products',
  },
  {
    stepNumber: 3,
    title: 'SİFARİŞ VERİN',
    subtitle: 'Təhlükəsiz ödəniş',
    description: 'İstədiyiniz məhsulu səbətə əlavə edin, təhlükəsiz ödəniş üsulları ilə (kart, nağd, hissə-hissə) sifarişinizi tamamlayın.',
    image: 'https://picsum.photos/id/2/800/800',
    actionText: 'SİFARİŞ ET',
    href: '/checkout',
  },
  {
    stepNumber: 4,
    title: 'SÜRƏTLİ ÇATDIRILMA',
    subtitle: 'Bakı daxili 24 saat',
    description: 'Sifarişiniz Bakı daxilində 24 saat, regionlarda isə 2-3 iş günü ərzində qapınıza qədər çatdırılır. Zəmanətli və təhlükəsiz çatdırılma xidməti.',
    image: 'https://picsum.photos/id/3/800/800',
    actionText: 'ÇATDIRILMA HAQQINDA',
    href: '#faq',
  },
];

// ——— Категории (статический fallback для Supabase) ———
export const CATEGORIES: Category[] = [
  {
    id: 'cat-root-1', slug: 'qulaqliq-ve-audio', title: 'Qulaqlıq & Audio',
    description: 'Simsiz qulaqlıqlar, TWS, dinamiklər, kolonkalar',
    parentId: null, sortOrder: 1, status: 'active',
  },
  {
    id: 'cat-sub-1-1', slug: 'tws-qulaqliq', title: 'Simsiz Qulaqlıq (TWS)',
    parentId: 'cat-root-1', sortOrder: 1, status: 'active',
  },
  {
    id: 'cat-sub-1-2', slug: 'dinamik-kolonka', title: 'Dinamik / Kolonka',
    parentId: 'cat-root-1', sortOrder: 2, status: 'active',
  },
  {
    id: 'cat-sub-1-3', slug: 'qulaqustu-qulaqliq', title: 'Qulaqüstü Qulaqlıq',
    parentId: 'cat-root-1', sortOrder: 3, status: 'active',
  },
  {
    id: 'cat-root-2', slug: 'telefonlar-ve-plansetler', title: 'Telefonlar & Planşetlər',
    description: 'Düyməli telefonlar, smartfonlar, planşetlər',
    parentId: null, sortOrder: 2, status: 'active',
  },
  {
    id: 'cat-sub-2-1', slug: 'duymeli-telefon', title: 'Düyməli Telefon',
    parentId: 'cat-root-2', sortOrder: 1, status: 'active',
  },
  {
    id: 'cat-sub-2-2', slug: 'smartfon', title: 'Smartfon (Android)',
    parentId: 'cat-root-2', sortOrder: 2, status: 'active',
  },
  {
    id: 'cat-sub-2-3', slug: 'planset', title: 'Planşet',
    parentId: 'cat-root-2', sortOrder: 3, status: 'active',
  },
  {
    id: 'cat-sub-2-4', slug: 'tel-aksesuar', title: 'Tel Aksesuar',
    parentId: 'cat-root-2', sortOrder: 4, status: 'active',
  },
  {
    id: 'cat-root-3', slug: 'kicik-meiset-texnikasi', title: 'Kiçik Məişət Texnikası',
    description: 'Fenlər, sərinkeşlər, tozsoranlar, ütülər, mətbəx texnikası',
    parentId: null, sortOrder: 3, status: 'active',
  },
  {
    id: 'cat-sub-3-1', slug: 'fen-serinkes', title: 'Fen / Sərinkeş',
    parentId: 'cat-root-3', sortOrder: 1, status: 'active',
  },
  {
    id: 'cat-sub-3-2', slug: 'temizlik', title: 'Təmizlik Texnikası',
    parentId: 'cat-root-3', sortOrder: 2, status: 'active',
  },
  {
    id: 'cat-sub-3-3', slug: 'metbex', title: 'Mətbəx Texnikası',
    parentId: 'cat-root-3', sortOrder: 3, status: 'active',
  },
  {
    id: 'cat-root-4', slug: 'aqilli-saat-ve-gadget', title: 'Ağıllı Saat & Gadget',
    description: 'Smart saatlar, powerbanklər, oyun aksesuarları',
    parentId: null, sortOrder: 4, status: 'active',
  },
  {
    id: 'cat-sub-4-1', slug: 'smart-saat', title: 'Smart Saat',
    parentId: 'cat-root-4', sortOrder: 1, status: 'active',
  },
  {
    id: 'cat-sub-4-2', slug: 'powerbank', title: 'Powerbank',
    parentId: 'cat-root-4', sortOrder: 2, status: 'active',
  },
  {
    id: 'cat-sub-4-3', slug: 'oyun-aksesuari', title: 'Oyun Aksesuarı',
    parentId: 'cat-root-4', sortOrder: 3, status: 'active',
  },
  {
    id: 'cat-sub-4-4', slug: 'diger-gadget', title: 'Digər Gadgetlər',
    parentId: 'cat-root-4', sortOrder: 4, status: 'active',
  },
  {
    id: 'cat-root-5', slug: 'saglamliq-ve-idman', title: 'Sağlamlıq & İdman',
    description: 'Masaj cihazları, qaçış aparatları, fitnes',
    parentId: null, sortOrder: 5, status: 'active',
  },
  {
    id: 'cat-root-6', slug: 'elektronika', title: 'Elektronika',
    description: 'Noutbuklar, DJI, kameralar, günəş panelləri',
    parentId: null, sortOrder: 6, status: 'active',
  },
];

export const BENEFITS_LIST: Benefit[] = [
  {
    id: 'ben-1',
    title: 'RƏSMİ ZƏMANƏT',
    description: 'Bütün məhsullar rəsmi distribütor zəmanəti ilə təqdim olunur. 2 ilədək zəmanət, problemsiz dəyişdirmə və təmir xidməti.',
    iconName: 'ShieldCheck',
  },
  {
    id: 'ben-2',
    title: 'SÜRƏTLİ ÇATDIRILMA',
    description: 'Bakı daxili 24 saat, regionlara 2-3 gün ərzində pulsuz çatdırılma. Sifarişiniz qapınıza qədər gətirilir.',
    iconName: 'Zap',
  },
  {
    id: 'ben-3',
    title: 'ORİJİNAL MƏHSULLAR',
    description: 'Yalnız rəsmi distribütorlardan təchiz olunmuş, 100% orijinal məhsullar. Orijinal olmayan məhsula görə pul geri zəmanəti.',
    iconName: 'ShieldCheck',
  },
  {
    id: 'ben-4',
    title: 'TEXNİKİ DƏSTƏK',
    description: 'Peşəkar texniki dəstək komandamız hər gün 09:00-21:00 arası sizin suallarınızı cavablandırmağa hazırdır.',
    iconName: 'HeartHandshake',
  },
];
