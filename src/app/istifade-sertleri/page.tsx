import { Container } from '@/components/ui/Container';
import { generateSEOMeta } from '@/lib/seo/meta-generator';
import type { Metadata } from 'next';

export const metadata: Metadata = generateSEOMeta({
  title: 'İstifadə Şərtləri',
  description: 'TAPLA MARKETPLACE istifadə şərtləri — platformadan istifadə qaydaları, alqı-satqı şərtləri, məsuliyyətin məhdudlaşdırılması və zəmanətdən imtina.',
  canonical: 'https://shop.tapla.az/istifade-sertleri',
})

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Container>
        <div className="max-w-4xl mx-auto py-16 md:py-24">
          <div className="mb-12">
            <p className="text-xs tracking-widest uppercase text-neutral-400 mb-3">İSTİFADƏ ŞƏRTLƏRİ</p>
            <h1 className="text-3xl md:text-4xl font-serif font-light tracking-tight text-neutral-950 mb-4">
              İstifadə Şərtləri
            </h1>
            <p className="text-sm text-neutral-500 border-b border-neutral-200 pb-6">
              Son yenilənmə: 28 İyun 2026
            </p>
          </div>

          <div className="max-w-none text-neutral-700 space-y-6 text-[14px] leading-[1.8]">

            <div className="bg-neutral-50 border border-neutral-200 p-6 mb-8">
              <p className="text-xs font-semibold text-neutral-600 mb-1">Aşağıdakı sənədi diqqətlə oxuyun.</p>
              <p className="text-xs text-neutral-500">
                Bu İstifadə Şərtləri (bundan sonra "Şərtlər") shop.tapla.az saytına və əlaqəli xidmətlərə aiddir.
                Platformadan istifadə etməklə siz bu Şərtlərlə razılaşmış olursunuz. Razı deyilsinizsə, platformadan istifadə etməyin.
              </p>
            </div>

            <Section title="1. Ümumi Müddəalar">
              <p>
                1.1. TAPLA TECHNOLOGIES M.M.C. (bundan sonra "TAPLA", "Platforma", "biz") shop.tapla.az ünvanında yerləşən onlayn marketpleys platformasını idarə edir. Platforma üçüncü tərəf satıcılara (bundan sonra "Satıcı") öz məhsullarını təklif etmək, istifadəçilərə (bundan sonra "Alıcı") isə həmin məhsulları əldə etmək imkanı verən elektron ticarət vasitəçisidir.
              </p>
              <p>
                1.2. Platforma "Azərbaycan Respublikasının Elektron ticarət haqqında" 10 may 2005-ci il tarixli Qanununa, "İstehlakçıların hüquqlarının müdafiəsi haqqında" 19 sentyabr 1995-ci il tarixli Qanuna, Azərbaycan Respublikasının Mülki Məcəlləsinə və digər normativ-hüquqi aktlara uyğun fəaliyyət göstərir.
              </p>
              <p>
                1.3. Bu Şərtlər Platformaya giriş və ondan istifadə ilə bağlı bütün məsələləri tənzimləyir. Satıcılar üçün əlavə olaraq Satıcı Müqaviləsi tətbiq oluna bilər.
              </p>
              <p>
                1.4. TAPLA bu Şərtlərə istənilən vaxt dəyişiklik etmək hüququnu özündə saxlayır. Dəyişikliklər dərc edildiyi andan qüvvəyə minir. Dəyişikliklərdən sonra Platformadan istifadəni davam etdirməklə istifadəçi yenilənmiş Şərtlərlə razılaşmış sayılır.
              </p>
            </Section>

            <Section title="2. Platformanın Statusu">
              <p>
                2.1. TAPLA MMC məhsulların satıcısı deyil. Platforma yalnız satıcı və alıcı arasında əqdin bağlanması üçün informasiya vasitəçisi, elektron ticarət platforması təqdim edir. Bütün məhsullar üçüncü tərəf satıcılar tərəfindən təklif olunur və satılır.
              </p>
              <p>
                2.2. TAPLA MMC satıcıların təklif etdiyi məhsulların keyfiyyətinə, təsvirinə, təhlükəsizliyinə, qanuniliyinə və ya hər hansı xüsusiyyətlərinə görə məsuliyyət daşımır. Məhsulla bağlı bütün iddialar birbaşa satıcıya ünvanlanmalıdır.
              </p>
              <p>
                2.3. Platformada yerləşdirilən məhsul təsvirləri, şəkillər, qiymətlər və digər məlumatlar satıcılar tərəfindən təqdim edilir. TAPLA bu məlumatların dəqiqliyini, tamlığını və aktuallığını yoxlamaq öhdəliyi daşımır.
              </p>
            </Section>

            <Section title="3. İstifadəçi Qeydiyyatı və Hesab">
              <p>
                3.1. Platformadan istifadə etmək üçün qeydiyyatdan keçmək tələb oluna bilər. Qeydiyyat zamanı təqdim edilən məlumatlar dəqiq, tam və aktuəl olmalıdır.
              </p>
              <p>
                3.2. İstifadəçi öz hesabının məxfiliyini qorumaq üçün məsuliyyət daşıyır. Hesab vasitəsilə həyata keçirilən bütün əməliyyatlara görə istifadəçi məsuldur.
              </p>
              <p>
                3.3. TAPLA qeydiyyat zamanı təqdim edilən məlumatların düzgünlüyünü yoxlamaq, habelə şübhəli fəaliyyət aşkar edildikdə hesabı bloklamaq və ya silmək hüququnu özündə saxlayır.
              </p>
              <p>
                3.4. Platformada qeydiyyatdan keçmək üçün minimum yaş həddi 18 (on səkkiz) yaşdır. 18 yaşdan aşağı şəxslər yalnız valideyn və ya qanuni nümayəndənin nəzarəti altında platformadan istifadə edə bilər.
              </p>
            </Section>

            <Section title="4. Sifarişin Verilməsi və Qəbulu">
              <p>
                4.1. Platformada sifariş verməklə istifadəçi müvafiq məhsulun satıcıdan satın alınması üçün təklif (offer) göndərir. Sifarişin təsdiqlənməsi satıcı tərəfindən qəbul edildikdən sonra alqı-satqı müqaviləsi bağlanmış hesab olunur.
              </p>
              <p>
                4.2. TAPLA sifarişin təsdiqlənməsini təsdiq e-poçtu göndərməklə bildirir. Bu təsdiq satıcının sifarişi qəbul etdiyini təsdiq edir, lakin məhsulun mövcudluğuna zəmanət vermir.
              </p>
              <p>
                4.3. Satıcı aşağıdakı hallarda sifarişi ləğv etmək hüququna malikdir: (a) məhsulun mövcud olmaması; (b) qiymətin səhv göstərilməsi; (c) şübhəli fırıldaqçılıq əlamətləri; (ç) sifarişin qanunvericiliyə zidd olması.
              </p>
              <p>
                4.4. Qiymətlər əvvəlcədən bildiriş edilmədən dəyişdirilə bilər. Sifarişin verildiyi andakı qiymət tətbiq edilir.
              </p>
            </Section>

            <Section title="5. Ödəniş">
              <p>
                5.1. Platformada ödənişlər üçüncü tərəf ödəniş provayderləri vasitəsilə həyata keçirilir. TAPLA ödəniş kartı məlumatlarını saxlamır.
              </p>
              <p>
                5.2. Bütün qiymətlər Azərbaycan manatı (AZN) ilə göstərilir və ƏDV daxil olmaqla bütün vergilər qiymətə daxildir, əks halda ayrıca göstərilir.
              </p>
              <p>
                5.3. Ödənişin emalı zamanı yaranan hər hansı problemə görə TAPLA məsuliyyət daşımır. Ödəniş provayderinin şərtləri tətbiq olunur.
              </p>
            </Section>

            <Section title="6. Çatdırılma">
              <p>
                6.1. Çatdırılma şərtləri, müddətləri və qiymətləri satıcı tərəfindən müəyyən edilir və sifariş zamanı göstərilir.
              </p>
              <p>
                6.2. "Elektron ticarət haqqında" Qanuna uyğun olaraq, satıcı sifarişi 30 (otuz) gün ərzində çatdırmalıdır, əgər tərəflər arasında başqa müddət razılaşdırılmayıbsa.
              </p>
              <p>
                6.3. Çatdırılma zamanı zədələnmə, itki və ya gecikmə hallarına görə TAPLA məsuliyyət daşımır. Bu hallar birbaşa satıcı və ya kuryer xidməti ilə həll edilməlidir.
              </p>
              <p>
                6.4. İstifadəçi məhsulu qəbul edərkən onun görünən qüsurlarını dərhal yoxlamaq öhdəliyi daşıyır. Görünən qüsurlar aşkar edildikdə, istifadəçi dərhal çatdırılma işçisinə məlumat verməli və qəbul aktında qeyd etməlidir.
              </p>
            </Section>

            <Section title="7. Zəmanət və Məsuliyyətdən İmtina">
              <div className="bg-neutral-50 border border-neutral-300 p-5 my-4 text-neutral-900 text-[13px] leading-[1.9]">
                <p className="font-bold text-sm mb-2">7.1. ZƏMANƏTDƏN İMTİNA</p>
                <p>
                  TAPLA MARKETPLACE PLATFORMASI, O CÜMLƏDƏN BÜTÜN MƏZMUN, MƏLUMAT, PROQRAM TƏMINATI VƏ XIDMƏTLƏR, "OLDURĞU KIMI" (AS IS) VƏ "MÖVCUD OLDUĞU KIMI" (AS AVAILABLE) ƏSASINDA TƏQDIM OLUNUR.
                </p>
                <p className="mt-2">
                  TAPLA MMC, SATICILAR VƏ ONLARIN TƏRƏFINDƏN TƏKLIF OLUNAN MƏHSULLARLA BAĞLI HEÇ BIR AÇIQ VƏ YA GIZLI ZƏMANƏT VERMIR. BURA, LAKIN BUNUNLA MƏHDUDLAŞMAYARAQ, SATIŞA YARARLILIQ (MERCHANTABILITY) VƏ MÜƏYYƏN BIR MƏQSƏD ÜÇÜN YARARLILIQ (FITNESS FOR A PARTICULAR PURPOSE) ZƏMANƏTLƏRI DAHILDIR.
                </p>
                <p className="mt-2">
                  TAPLA MMC HEÇ BIR VƏZIFƏDƏ PLATFORMANIN FASILƏSIZ, TƏHLÜKƏSIZ, XƏTASIZ VƏ YA VIRUSDAN TƏMİZ OLACAĞINA ZƏMANƏT VERMIR.
                </p>
              </div>
              <p>
                7.2. TAPLA MMC öz satıcıları tərəfindən təklif olunan məhsullara münasibətdə heç bir açıq və ya gizli zəmanət vermir. Satıcı tərəfindən təqdim olunan hər hansı zəmanət birbaşa satıcıya aid məsələdir.
              </p>
              <p>
                7.3. "İstehlakçıların hüquqlarının müdafiəsi haqqında" Qanunun tələbləri, o cümlədən istehlakçının qüsurlu məhsulla bağlı hüquqları (əvəz, təmir, qiymətin azaldılması) bu Şərtlərə xələl gətirmədən tətbiq olunmaqda davam edir. Heç bir Zəmanətdən İmtina maddəsi qanunla nəzərdə tutulmuş istehlakçı hüquqlarını məhdudlaşdırmır.
              </p>
              <p>
                7.4. Məhsul təsvirlərində, şəkillərdə, spesifikasiyalarda və ya digər materiallarda olan hər hansı uyğunsuzluq, qeyri-dəqiqlik və ya səhvə görə TAPLA MMC məsuliyyət daşımır. Bildiriş aldıqdan sonra TAPLA mümkün qədər tez müvafiq düzəlişləri etməyə çalışacaqdır.
              </p>
            </Section>

            <Section title="8. Məsuliyyətin Məhdudlaşdırılması">
              <div className="bg-neutral-50 border border-neutral-300 p-5 my-4">
                <p className="font-bold text-sm mb-2 text-neutral-900">8.1. MƏSULİYYƏTİN MƏHDUDLAŞDIRILMASI</p>
                <p className="text-[13px] leading-[1.9] text-neutral-900">
                  HEÇ BIR HALDA TAPLA MMC, ONUN RƏHBƏRLƏRI, İŞÇİLƏRI VƏ YA NÜMAYƏNDƏLƏRI, PLATFORMADAN VƏ YA PLATFORMADA TƏQDIM OLUNAN MƏHSULLARDAN İSTİFADƏ VƏ YA İSTİFADƏ EDƏ BİLMƏMƏKDƏN, MƏHSULLARIN KEYFİYYƏTINDƏN, ÇATDIRILMASINDAN VƏ YA HƏR HANSI BIR TƏRƏFIN HƏRƏKƏTINDƏN, FƏALIYYƏT VƏ YA HƏRƏKƏTSIZLIYINDƏN YARANAN HƏR HANSI BIRBAŞA, DOLAYI, TƏSADÜFI, XÜSUSI VƏ YA CEZA KARAKTERLI ZƏRƏRƏ GÖRƏ MƏSUL OLMAMALIDIR.
                </p>
                <p className="text-[13px] leading-[1.9] text-neutral-900 mt-2">
                  MƏSULİYYƏTİN MƏHDUDLAŞDIRILMASI QANUNLA QADAĞAN OLUNMUŞ HALLARDA TƏTBİQ EDİLMİR.
                </p>
              </div>
              <p>
                8.2. TAPLA MMC-nin satıcıların hərəkətləri, məhsulların keyfiyyəti, çatdırılma və ya satıcı tərəfindən göstərilən xidmətlərlə bağlı məsuliyyəti yoxdur. Alıcı və satıcı arasında yaranan mübahisələr tərəflər arasında həll edilməlidir.
              </p>
              <p>
                8.3. TAPLA MMC-nin hər hansı iddia üzrə ümumi məsuliyyəti, iddianın səbəbindən asılı olmayaraq, iddiaya səbəb olan məhsulun dəyərindən çox ola bilməz.
              </p>
              <p>
                8.4. TAPLA MMC Platformada üçüncü tərəflərə (ödəniş sistemləri, kuryer xidmətləri, hostinq provayderləri və s.) aid olan linklərə, məzmuna və xidmətlərə görə məsuliyyət daşımır.
              </p>
            </Section>

            <Section title="9. Geri Qaytarma və Mübadilə">
              <div className="bg-amber-50 border border-amber-200 p-5 mb-4">
                <p className="text-xs font-semibold text-amber-800 mb-1">MÜHÜM</p>
                <p className="text-[13px] text-amber-900 leading-relaxed">
                  Aşağıdakı maddələr qanunvericiliklə müəyyən edilmiş minimum tələbləri əks etdirir.
                  TAPLA MARKETPLACE platformasında geri qaytarma proseduru yalnız ciddi formal
                  tələblərin tam yerinə yetirilməsi şərtilə həyata keçirilir. Hər hansı bir tələbin
                  pozulması geri qaytarmanın rədd edilməsi üçün əsas ola bilər.
                </p>
              </div>

              <p>
                9.1. Geri qaytarma və mübadilə ilə bağlı bütün prosedur qaydaları, o cümlədən
                RMA (Return Merchandise Authorization) sistemi, ekspertiza şərtləri, qəbul
                meyarları və müddətlər TAPLA MARKETPLACE-in ayrıca
                <a href="/qaytarma-siyaseti" className="text-neutral-950 underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-950 transition-colors"> Qaytarma Siyasətində</a>
                müəyyən edilmişdir. Bu Siyasətə istinad etmədən heç bir geri qaytarma tələbinə
                baxılmır.
              </p>

              <p>
                9.2. "İstehlakçıların hüquqlarının müdafiəsi haqqında" Qanunun 14-cü maddəsinə
                əsasən, istifadəçi qida olmayan, layiqli keyfiyyətə malik məhsulu 14 (on dörd)
                təqvim günü ərzində dəyişdirmək hüququna malikdir. Bu hüquq yalnız məhsulun
                dəyişdirilməsini (eyni və ya analoji məhsulla) nəzərdə tutur. Pulun qaytarılması
                yalnız analoji məhsul satıcıda mövcud olmadıqda həyata keçirilir. Dəyişdirmə
                tələbinin təmin olunması üçün istifadəçi aşağıdakı bütün şərtləri yerinə
                yetirməlidir:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Məhsul heç bir formada istifadə edilməmiş, sınaqdan keçirilməmiş, quraşdırılmamış və ya işə salınmamış olmalıdır;</li>
                <li>Məhsulun orijinal qablaşdırması açılmamış, zədələnməmiş, üzərində hər hansı yazı, etiket, stiker və ya zədə olmamalıdır;</li>
                <li>Məhsulun bütün fabrik pleymbələri, qoruyucu təbəqələri, markalanması və seriya nömrələri toxunulmaz qalmalıdır;</li>
                <li>Məhsulla birlikdə verilən bütün aksesuarlar, kabel, adapter, qulaqlıq, sənədlər, istifadəçi təlimatları və zəmanət kartı tam şəkildə təqdim edilməlidir;</li>
                <li>Alış sənədi (elektron və ya çap formasında) təqdim edilməlidir;</li>
                <li>RMA nömrəsi alınmış və məhsulun qablaşdırmasında qeyd edilmiş olmalıdır.</li>
              </ul>
              <p className="mt-2">
                Yuxarıdakı şərtlərdən hər hansı birinin yerinə yetirilməməsi dəyişdirmə tələbinin
                rədd edilməsi üçün kifayət qədər əsasdır. Bu halda məhsul istifadəçiyə geri
                göndərilir və bütün göndərmə xərcləri istifadəçi tərəfindən ödənilir.
              </p>

              <p>
                9.3. "Elektron ticarət haqqında" Qanunun 9-cu maddəsinə əsasən, istifadəçi
                elektron ticarət əməliyyatından 7 (yeddi) iş günü ərzində imtina etmək
                hüququna malikdir. İmtina hüququnun həyata keçirilməsi üçün aşağıdakı
                prosedura ciddi riayət edilməlidir:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>İstifadəçi imtina barədə TAPLA-ya yazılı bildiriş göndərməlidir. Bildiriş yalnız <a href="mailto:support@tapla.az" className="text-neutral-950 underline underline-offset-4 decoration-neutral-300">support@tapla.az</a> ünvanına göndərilmiş e-poçt vasitəsilə qəbul edilir. Bildirişdə sifariş nömrəsi, imtina səbəbi və istifadəçinin tam adı göstərilməlidir;</li>
                <li>İstifadəçi bildirişi göndərdikdən sonra 7 (yeddi) iş günü ərzində məhsulu TAPLA və ya satıcı tərəfindən göstərilən ünvana qaytarmalıdır. Müəyyən edilmiş müddətdə qaytarılmayan məhsullar üzrə imtina hüququ itirilmiş hesab edilir;</li>
                <li>İmtina zamanı məhsulun qaytarılması üçün çatdırılma xərcləri tam həcmdə istifadəçi tərəfindən qarşılanır;</li>
                <li>Məhsul orijinal qablaşdırmada, istifadə edilməmiş, bütün etiketlər, pleymbələr, aksesuarlar və sənədlərlə birlikdə olmalıdır. Məhsulun əmtəə görünüşünün, istehlak xassələrinin və ya qablaşdırmasının hər hansı formada dəyişdirilməsi və ya zədələnməsi imtinanın rədd edilməsi üçün əsasdır;</li>
                <li>Məhsulun dəyərinin azalmasına səbəb olan hər hansı istifadə, sınaq, quraşdırma və ya digər hərəkətlərə görə istifadəçi maliyyə məsuliyyəti daşıyır. Bu halda geri qaytarılan məbləğ məhsulun dəyərindən azaldıla bilər.</li>
              </ul>

              <p>
                9.4. Geri qaytarma prosesi aşağıdakı ardıcıllıqla həyata keçirilir:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>İstifadəçi tərəfindən RMA nömrəsi alınmalıdır. RMA nömrəsi olmadan göndərilən məhsullar qəbul edilmir və geri qaytarılır;</li>
                <li>Məhsul satıcı və ya TAPLA tərəfindən qəbul edildikdən sonra 10 (on) iş günü ərzində ekspertiza və yoxlamadan keçirilir. İstehsal qüsuru şübhəsi olduqda ekspertiza müddəti 30 (otuz) iş gününədək uzadıla bilər. Ekspertiza müddəti ərzində bütün geri qaytarma proseduru dayandırılır;</li>
                <li>Məhsulun orijinal qablaşdırmasının, etiketlərinin, pleymbələrinin və ya aksesuarlarının olmaması, habelə hər hansı zədə, deformasiya, cızıq, çat, aşınma, maye təması və ya digər istifadə əlamətləri müəyyən edildikdə, geri qaytarma rədd edilir;</li>
                <li>Geri qaytarma rədd edildikdə, məhsul istifadəçiyə onun hesabına geri göndərilir. Bu halda heç bir geri ödəmə həyata keçirilmir;</li>
                <li>Bütün tələblər yerinə yetirildikdə, geri ödəmə qərarın qəbul edildiyi andan etibarən 14 (on dörd) iş günü ərzində həyata keçirilir. Geri ödəmə yalnız ilkin ödəniş vasitəsi ilə həyata keçirilir. Çatdırılma xərcləri, qaytarma göndərmə xərcləri, vergilər və rüsumlar geri qaytarılmır.</li>
              </ul>

              <p>
                9.5. Qanunla nəzərdə tutulmuş istisnalar (fərdiləşdirilmiş məhsullar, açılmış
                audio və video yazıları, proqram təminatı, tez xarab olan məhsullar, gigiyena
                vasitələri və Nazirlər Kabinetinin 114 nömrəli Qərarı ilə müəyyən edilmiş digər
                məhsullar) bu bəndin tətbiqindən kənardır.
              </p>
            </Section>

            <Section title="10. Əqli Mülkiyyət">
              <p>
                10.1. Platformada yerləşən bütün məzmun, o cümlədən mətnlər, qrafik elementlər, loqotiplər, dizayn, proqram təminatı və verilənlər bazası TAPLA MMC-yə və ya onun lisenziar verənlərinə məxsusdur və Azərbaycan Respublikasının müəllif hüququ və əqli mülkiyyət qanunvericiliyi ilə qorunur.
              </p>
              <p>
                10.2. İstifadəçi Platformada yerləşən materialları TAPLA MMC-nin yazılı icazəsi olmadan kopyalamaq, yaymaq, dəyişdirmək, yenidən dərc etmək və ya kommersiya məqsədilə istifadə etmək hüququna malik deyil.
              </p>
              <p>
                10.3. Platformada yerləşdirilən satıcı məhsullarının şəkilləri, təsvirləri və digər materialları müvafiq satıcıya məxsusdur.
              </p>
            </Section>

            <Section title="11. Qadağan Olunan Fəaliyyət">
              <p>11.1. Platformadan istifadə edərkən aşağıdakı hərəkətlər qadağandır:</p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>Qanunsuz və ya qanuna zidd məqsədlər üçün istifadə;</li>
                <li>Başqa istifadəçiləri aldadıcı hərəkətlər;</li>
                <li>Platformanın işinə mane olmaq, həddindən artıq yük salmaq və ya zərər vurmaq;</li>
                <li>Avtomatlaşdırılmış vasitələrlə (bot, skraper, crawler) məlumat toplamaq;</li>
                <li>Zərərli proqram təminatı və ya virus yaymaq;</li>
                <li>Başqasının şəxsi məlumatlarını icazəsiz toplamaq;</li>
                <li>Platforma vasitəsilə qanunsuz məhsulların satışını təklif etmək;</li>
                <li>Satıcıların və ya TAPLA-nın nüfuzuna xələl gətirən yalan rəylər yazmaq.</li>
              </ul>
            </Section>

            <Section title="12. Hesabın Ləğvi və Bloklanması">
              <p>
                12.1. TAPLA bu Şərtlərin hər hansı maddəsinin pozulması halında istifadəçi hesabını əvvəlcədən bildiriş etmədən bloklamaq və ya ləğv etmək hüququna malikdir.
              </p>
              <p>
                12.2. İstifadəçi istənilən vaxt öz hesabını silmək üçün müraciət edə bilər. Hesab silindikdən sonra şəxsi məlumatlar qanunla nəzərdə tutulmuş müddət ərzində saxlanıla bilər.
              </p>
            </Section>

            <Section title="13. Tətbiq Olunan Hüquq və Mübahisələrin Həlli">
              <p>
                13.1. Bu Şərtlər və onlardan irəli gələn münasibətlər Azərbaycan Respublikasının qanunvericiliyi ilə tənzimlənir.
              </p>
              <p>
                13.2. TAPLA MMC və istifadəçi arasında yaranan bütün mübahisələr ilk növbədə danışıqlar yolu ilə həll edilməyə çalışılacaqdır.
              </p>
              <p>
                13.3. Danışıqlar yolu ilə həll edilməyən mübahisələr Azərbaycan Respublikasının müvafiq məhkəmələrində, Bakı şəhərində həll edilir.
              </p>
              <p>
                13.4. İstehlakçı hüquqlarının pozulması ilə bağlı müraciətlər üçün istifadəçi Azərbaycan Respublikasının Antimonopoliya və İstehlak Bazarına Nəzarət üzrə Dövlət Agentliyinə (competition.gov.az) müraciət edə bilər.
              </p>
            </Section>

            <Section title="14. Əlaqə Məlumatları">
              <p className="text-sm text-neutral-800 bg-neutral-50 border border-neutral-200 p-4">
                <strong>TAPLA TECHNOLOGIES M.M.C.</strong><br />
                E-poçt: <a href="mailto:support@tapla.az" className="text-neutral-950 underline underline-offset-4 decoration-neutral-300">support@tapla.az</a><br />
                Tel: +994702453060<br />
                Ünvan: AZ1012, Bakı şəhəri, Yasamal rayonu, Dadaş Bünyadzadə, APT 15
              </p>
            </Section>

          </div>
        </div>
      </Container>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="text-[16px] font-semibold text-neutral-950 tracking-tight pt-2">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
