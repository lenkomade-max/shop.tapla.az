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
      { label: 'Kosmetika & Gözəllik', href: '/category/kosmetika' },
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
    href: '/about',
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
    question: 'Sifarişim nə vaxt çatdırılacaq?',
    answer: 'Sifarişiniz Bakı daxilində 24 saat, regionlara isə 2–3 iş günü ərzində çatdırılır. Çatdırılma tarifləri ünvan və çəkiyə əsasən hesablanır — dəqiq məbləğ sifariş zamanı göstərilir. Sifarişiniz hazır olduqda izləmə linki e-poçt vasitəsilə göndərilir.',
    category: 'Çatdırılma',
  },
  {
    id: 'faq-2',
    question: 'Məhsulu geri qaytarmaq istəsəm, nə etməliyəm?',
    answer: 'Məhsulu qəbul etdikdən sonra 14 gün ərzində geri qaytarmaq mümkündür. Məhsul orijinal qablaşdırmada, istifadə olunmamış və tam dəstdə olmalıdır. Geri qaytarma prosesi üçün dəstək komandamızla əlaqə saxlayın — sizə addım-addım kömək edəcəyik.',
    category: 'Qaytarma',
  },
  {
    id: 'faq-3',
    question: 'Məhsul aldıqdan sonra hər hansı problem yaranarsa, nə etməliyəm?',
    answer: 'Məhsulunuzla bağlı hər hansı çətinlik yarandıqda, dəstək komandamıza müraciət edin. Hər bir məhsul üzrə şərtlər fərqlənə bilər, lakin biz sizə ən qısa müddətdə kömək göstərəcək və ən uyğun həll yolunu təklif edəcəyik.',
    category: 'Dəstək',
  },
  {
    id: 'faq-4',
    question: 'Məhsulun orijinal olduğunu necə yoxlaya bilərəm?',
    answer: 'Məhsulu qəbul edərkən qablaşdırmanı və seriya nömrəsini yoxlamağı tövsiyə edirik. Bütün məhsullarımız rəsmi təchizatçılardan təmin olunur. Seriya nömrəsini istehsalçının rəsmi saytında yoxlaya bilərsiniz. Əlavə məlumat üçün dəstək komandamızla əlaqə saxlayın.',
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
  // ——— Kosmetika & Gözəllik (cat-root-7..15) ———
  {
    id: 'cat-root-7', slug: 'kosmetika', title: 'Kosmetika & Gözəllik',
    description: 'Üz baxımı, makiyaj, saç baxımı, ətir və daha çox',
    parentId: null, sortOrder: 7, status: 'active',
  },
  // Üz baxımı
  {
    id: 'cat-root-8', slug: 'uz-baximi', title: 'Üz baxımı',
    description: 'Təmizləyici, nəmləndirici krem, serum, göz ətrafı baxım, maskalar, günəşdən qoruyucular',
    parentId: 'cat-root-7', sortOrder: 1, status: 'active',
  },
  {
    id: 'cat-sub-8-1', slug: 'uz-temizleyici', title: 'Üz təmizləyici',
    description: 'Təmizləyici gel, köpük, micellar su',
    parentId: 'cat-root-8', sortOrder: 1, status: 'active',
  },
  {
    id: 'cat-sub-8-2', slug: 'uz-krem', title: 'Üz kremi',
    description: 'Nəmləndirici, qidalandırıcı, gecə kremi',
    parentId: 'cat-root-8', sortOrder: 2, status: 'active',
  },
  {
    id: 'cat-sub-8-3', slug: 'serum-ampula', title: 'Serum & Ampula',
    description: 'Vitamin C, hialuron turşusu, retinol serumlar',
    parentId: 'cat-root-8', sortOrder: 3, status: 'active',
  },
  {
    id: 'cat-sub-8-4', slug: 'goz-etrafi-baxim', title: 'Göz ətrafı baxım',
    description: 'Göz altı kremin, yamaqlar',
    parentId: 'cat-root-8', sortOrder: 4, status: 'active',
  },
  {
    id: 'cat-sub-8-5', slug: 'uz-maskasi', title: 'Üz maskası',
    description: 'Parça, gil, krem maskalar',
    parentId: 'cat-root-8', sortOrder: 5, status: 'active',
  },
  {
    id: 'cat-sub-8-6', slug: 'gunesden-qoruyucu', title: 'Günəşdən qoruyucu',
    description: 'SPF krem, günəş losyonu',
    parentId: 'cat-root-8', sortOrder: 6, status: 'active',
  },
  // Makiyaj
  {
    id: 'cat-root-9', slug: 'makiyaj', title: 'Makiyaj',
    description: 'Üz, göz, dodaq makiyajı, qaş məhsulları',
    parentId: 'cat-root-7', sortOrder: 2, status: 'active',
  },
  {
    id: 'cat-sub-9-1', slug: 'uz-makiyaji', title: 'Üz makiyajı',
    description: 'Tonal krem, pudra, konsiler, bb krem',
    parentId: 'cat-root-9', sortOrder: 1, status: 'active',
  },
  {
    id: 'cat-sub-9-2', slug: 'goz-makiyaji', title: 'Göz makiyajı',
    description: 'Tuş, göz kölgəsi, göz qələmi, layner',
    parentId: 'cat-root-9', sortOrder: 2, status: 'active',
  },
  {
    id: 'cat-sub-9-3', slug: 'dodaq-makiyaji', title: 'Dodaq makiyajı',
    description: 'Pomada, dodaq parıltısı, dodaq qələmi',
    parentId: 'cat-root-9', sortOrder: 3, status: 'active',
  },
  {
    id: 'cat-sub-9-4', slug: 'qas-mehsullari', title: 'Qaş məhsulları',
    description: 'Qaş qələmi, qaş jeli, qaş boyası',
    parentId: 'cat-root-9', sortOrder: 4, status: 'active',
  },
  // Saç baxımı
  {
    id: 'cat-root-10', slug: 'sac-baximi', title: 'Saç baxımı',
    description: 'Şampun, kondisioner, saç maskası, saç yağı, boyalar',
    parentId: 'cat-root-7', sortOrder: 3, status: 'active',
  },
  {
    id: 'cat-sub-10-1', slug: 'sampun-kondisioner', title: 'Şampun & Kondisioner',
    description: 'Saç tipinə uyğun şampun, kondisioner, balzam',
    parentId: 'cat-root-10', sortOrder: 1, status: 'active',
  },
  {
    id: 'cat-sub-10-2', slug: 'sac-maskasi', title: 'Saç maskası',
    description: 'Qidalandırıcı, bərpaedici saç maskaları',
    parentId: 'cat-root-10', sortOrder: 2, status: 'active',
  },
  {
    id: 'cat-sub-10-3', slug: 'sac-yagi-serum', title: 'Saç yağı & Serum',
    description: 'Saç uzatma, parıltı, dökülmə qarşı serumlar',
    parentId: 'cat-root-10', sortOrder: 3, status: 'active',
  },
  {
    id: 'cat-sub-10-4', slug: 'sac-kimi', title: 'Saç düzəldici & Lak',
    description: 'Saç spreyi, lak, düzəldici, köpük',
    parentId: 'cat-root-10', sortOrder: 4, status: 'active',
  },
  {
    id: 'cat-sub-10-5', slug: 'sac-boyasi', title: 'Saç boyası',
    description: 'Daimi, yarımdaimi saç boyaları, təbii boyalar',
    parentId: 'cat-root-10', sortOrder: 5, status: 'active',
  },
  // Bədən baxımı
  {
    id: 'cat-root-11', slug: 'beden-baximi', title: 'Bədən baxımı',
    description: 'Skrab, bədən kremi, təraş məhsulları, dezodorant',
    parentId: 'cat-root-7', sortOrder: 4, status: 'active',
  },
  {
    id: 'cat-sub-11-1', slug: 'beden-skrab-duz', title: 'Duz & Skrab',
    description: 'Bədən skrabı, duz, qəhvə skrabı',
    parentId: 'cat-root-11', sortOrder: 1, status: 'active',
  },
  {
    id: 'cat-sub-11-2', slug: 'beden-krem-losyon', title: 'Bədən kremi & Losyon',
    description: 'Bədən nəmləndiricisi, losyon, yağ',
    parentId: 'cat-root-11', sortOrder: 2, status: 'active',
  },
  {
    id: 'cat-sub-11-3', slug: 'teras-mehsullari', title: 'Təraş məhsulları',
    description: 'Təraş köpüyü, jeli, təraşdan sonra losyon',
    parentId: 'cat-root-11', sortOrder: 3, status: 'active',
  },
  {
    id: 'cat-sub-11-4', slug: 'dezodorant', title: 'Dezodorant & Antiperspirant',
    description: 'Tərləməyə qarşı dezodorant, roll-on, sprey',
    parentId: 'cat-root-11', sortOrder: 4, status: 'active',
  },
  // Ətir
  {
    id: 'cat-root-12', slug: 'etir', title: 'Ətir',
    description: 'Qadın, kişi, unisex ətirlər, nümunələr',
    parentId: 'cat-root-7', sortOrder: 5, status: 'active',
  },
  {
    id: 'cat-sub-12-1', slug: 'qadin-etiri', title: 'Qadın ətirləri',
    description: 'Qadınlar üçün parfüm, eau de toilette',
    parentId: 'cat-root-12', sortOrder: 1, status: 'active',
  },
  {
    id: 'cat-sub-12-2', slug: 'kisi-etiri', title: 'Kişi ətirləri',
    description: 'Kişilər üçün parfüm, eau de toilette',
    parentId: 'cat-root-12', sortOrder: 2, status: 'active',
  },
  {
    id: 'cat-sub-12-3', slug: 'unisex-etir', title: 'Unisex Ətir',
    description: 'Uni sex ətirlər, niş parfümlər',
    parentId: 'cat-root-12', sortOrder: 3, status: 'active',
  },
  {
    id: 'cat-sub-12-4', slug: 'etir-numunesi', title: 'Nümunələr',
    description: 'Ətir nümunələri, tester parfümlər',
    parentId: 'cat-root-12', sortOrder: 4, status: 'active',
  },
  // Dırnaq məhsulları
  {
    id: 'cat-root-13', slug: 'dirnaq-mehsullari', title: 'Dırnaq məhsulları',
    description: 'Lak, gel-lak, base, top, dırnaq baxımı, manikür seti',
    parentId: 'cat-root-7', sortOrder: 6, status: 'active',
  },
  {
    id: 'cat-sub-13-1', slug: 'lak-gel-lak', title: 'Lak & Gel-lak',
    description: 'Dırnaq lakı, gel-lak, naxış lakları',
    parentId: 'cat-root-13', sortOrder: 1, status: 'active',
  },
  {
    id: 'cat-sub-13-2', slug: 'base-top', title: 'Base & Top',
    description: 'Base coat, top coat, quruducu',
    parentId: 'cat-root-13', sortOrder: 2, status: 'active',
  },
  {
    id: 'cat-sub-13-3', slug: 'dirnaq-baximi', title: 'Dırnaq baxımı',
    description: 'Dırnaq gücləndirici, qida yağı, kutikula baxımı',
    parentId: 'cat-root-13', sortOrder: 3, status: 'active',
  },
  {
    id: 'cat-sub-13-4', slug: 'manikur-seti', title: 'Manikür seti',
    description: 'Manikür alətləri, setlər, fayllar',
    parentId: 'cat-root-13', sortOrder: 4, status: 'active',
  },
  // Kişi baxımı
  {
    id: 'cat-root-14', slug: 'kisi-baximi', title: 'Kişi baxımı',
    description: 'Kişilər üçün üz baxımı, təraş, saç, dezodorant',
    parentId: 'cat-root-7', sortOrder: 7, status: 'active',
  },
  {
    id: 'cat-sub-14-1', slug: 'kisi-uz-baximi', title: 'Üz baxımı (kişi)',
    description: 'Kişilər üçün təmizləyici, krem, serum',
    parentId: 'cat-root-14', sortOrder: 1, status: 'active',
  },
  {
    id: 'cat-sub-14-2', slug: 'kisi-sac-baximi', title: 'Saç baxımı (kişi)',
    description: 'Kişi şampunları, saç jeli, pomad',
    parentId: 'cat-root-14', sortOrder: 2, status: 'active',
  },
  {
    id: 'cat-sub-14-3', slug: 'kisi-dezodorant', title: 'Dezodorant & Təraş (kişi)',
    description: 'Kişi dezodorantları, təraş jeli, təraş dəsti',
    parentId: 'cat-root-14', sortOrder: 3, status: 'active',
  },
  // Kosmetik aksesuarlar
  {
    id: 'cat-root-15', slug: 'kosmetik-aksesuarlar', title: 'Kosmetik aksesuarlar',
    description: 'Fırçalar, süngərlər, çanta, güzgü, daraq',
    parentId: 'cat-root-7', sortOrder: 8, status: 'active',
  },
  {
    id: 'cat-sub-15-1', slug: 'firca-sunger', title: 'Fırçalar & Süngərlər',
    description: 'Makiyaj fırçaları, beauty blender, toz süngər',
    parentId: 'cat-root-15', sortOrder: 1, status: 'active',
  },
  {
    id: 'cat-sub-15-2', slug: 'kosmetik-canta', title: 'Çanta & Qutu',
    description: 'Kosmetik çanta, tualet çantası, saxlayıcı qutular',
    parentId: 'cat-root-15', sortOrder: 2, status: 'active',
  },
  {
    id: 'cat-sub-15-3', slug: 'guzgu-daraq', title: 'Güzgü & Daraq',
    description: 'Dəzgü, cib güzgüsü, saç darağı, fırça',
    parentId: 'cat-root-15', sortOrder: 3, status: 'active',
  },
  // Elektrikli gözəllik cihazları
  {
    id: 'cat-root-16', slug: 'elektrikli-gozellik-cihazlari', title: 'Elektrikli gözəllik cihazları',
    description: 'Epilyator, təraş maşını, saç qurutma, üz təmizləmə, masaj alətləri',
    parentId: 'cat-root-7', sortOrder: 9, status: 'active',
  },
  {
    id: 'cat-sub-16-1', slug: 'epilyator-teras', title: 'Epilyator & Təraş maşını',
    description: 'Qadın və kişi epilyatorları, təraş maşınları',
    parentId: 'cat-root-16', sortOrder: 1, status: 'active',
  },
  {
    id: 'cat-sub-16-2', slug: 'sac-qurutma-duzeltme', title: 'Saç qurutma & Düzəltmə',
    description: 'Fen, düzəldən, buruqlaşdıran, hava fırça',
    parentId: 'cat-root-16', sortOrder: 2, status: 'active',
  },
  {
    id: 'cat-sub-16-3', slug: 'uz-temizleme-cihazi', title: 'Üz təmizləmə cihazı',
    description: 'Ultrasəs, fırça, LED maskalar',
    parentId: 'cat-root-16', sortOrder: 3, status: 'active',
  },
  {
    id: 'cat-sub-16-4', slug: 'masaj-aletleri', title: 'Masaj alətləri',
    description: 'Üz masajçısı, guaşa, rulon, masaj tabancası',
    parentId: 'cat-root-16', sortOrder: 4, status: 'active',
  },
];

export const BENEFITS_LIST: Benefit[] = [
  {
    id: 'ben-1',
    title: 'KEYFİYYƏT TƏMİNATI',
    description: 'Hər bir məhsul keyfiyyət yoxlamasından keçirilir. Məhsullarımızı əminliklə seçin — biz keyfiyyətə görə məsuliyyət daşıyırıq.',
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
