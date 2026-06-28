import { Container } from '@/components/ui/Container';

export const metadata = {
  title: 'Qaytarma Siyasəti | TAPLA MARKETPLACE',
  description: 'TAPLA MARKETPLACE qaytarma və mübadilə siyasəti — məhsulların geri qaytarılması, dəyişdirilməsi qaydaları, şərtləri və proseduru.',
};

export default function ReturnPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <Container>
        <div className="max-w-4xl mx-auto py-16 md:py-24">
          <div className="mb-12">
            <p className="text-xs tracking-widest uppercase text-neutral-400 mb-3">QAYTARMA SİYASƏTİ</p>
            <h1 className="text-3xl md:text-4xl font-serif font-light tracking-tight text-neutral-950 mb-4">
              Qaytarma və Mübadilə Siyasəti
            </h1>
            <p className="text-sm text-neutral-500 border-b border-neutral-200 pb-6">
              Son yenilənmə: 28 İyun 2026
            </p>
          </div>

          <div className="max-w-none text-neutral-700 space-y-6 text-[14px] leading-[1.8]">

            <div className="bg-amber-50 border border-amber-200 p-6 mb-8">
              <p className="text-xs font-semibold text-amber-800 mb-1">MÜHÜM BİLDİRİŞ</p>
              <p className="text-[13px] text-amber-900 leading-relaxed">
                TAPLA MARKETPLACE satıcı ilə alıcı arasında vasitəçi rolunu oynayan onlayn marketpleys platformasıdır.
                Məhsulların geri qaytarılması və dəyişdirilməsi qaydaları <strong>birbaşa satıcı tərəfindən</strong> müəyyən edilir.
                Aşağıdakı siyasət TAPLA MARKETPLACE platformasında tətbiq olunan ümumi qaydaları müəyyən edir.
                Hər bir satıcının öz qaytarma şərtləri ola bilər ki, bunlar məhsul səhifəsində göstərilir.
                Geri qaytarma proseduru yalnız bütün formal tələblərin tam yerinə yetirilməsi şərtilə həyata keçirilir.
                Hər hansı bir tələbin pozulması geri qaytarmanın qəbul edilməməsi üçün kifayət qədər əsasdır.
              </p>
            </div>

            <Section title="1. Ümumi Müddəalar">
              <p>
                1.1. Bu Qaytarma Siyasəti Azərbaycan Respublikasının "İstehlakçıların hüquqlarının müdafiəsi haqqında" Qanununa (№ 1113, 19 sentyabr 1995-ci il), "Elektron ticarət haqqında" Qanununa (№ 908-IIQ, 10 may 2005-ci il), Mülki Məcəllənin müvafiq maddələrinə və Azərbaycan Respublikası Nazirlər Kabinetinin 21 may 1998-ci il tarixli 114 nömrəli Qərarına uyğun olaraq hazırlanmışdır.
              </p>
              <p>
                1.2. Bu Siyasət TAPLA MARKETPLACE platforması (shop.tapla.az) vasitəsilə əldə edilmiş bütün məhsullara şamil edilir.
              </p>
              <p>
                1.3. Siyasətdə istifadə olunan əsas anlayışlar:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Alıcı</strong> — platformada məhsul satın alan fiziki şəxs;</li>
                <li><strong>Satıcı</strong> — platformada məhsul təklif edən üçüncü tərəf;</li>
                <li><strong>TAPLA / Platforma</strong> — satıcı ilə alıcı arasında elektron ticarət əməliyyatını təmin edən informasiya vasitəçisi;</li>
                <li><strong>Qüsurlu məhsul</strong> — istehsal qüsuru olan və ya təsvirə uyğun olmayan məhsul.</li>
              </ul>
            </Section>

            <Section title="2. Məhsulun Dəyişdirilməsi Hüququ (Layiqli Keyfiyyətli Məhsul)">
              <p className="font-semibold text-neutral-800">2.1. "İstehlakçıların hüquqlarının müdafiəsi haqqında" Qanunun 14-cü maddəsinə əsasən:</p>
              <p>
                Alıcı qida məhsulu olmayan, layiqli keyfiyyətə malik məhsulu, əgər məhsul forma, ölçü, rəng, fason və ya digər səbəblərə görə onun tələblərinə cavab vermirsə, satın alındığı andan etibarən <strong>14 (on dörd) təqvim günü</strong> ərzində eyni və ya analoji məhsulla dəyişdirmək hüququna malikdir.
              </p>

              <p className="font-semibold text-neutral-800 mt-4">2.2. Dəyişdirmə tələbinin təmin olunması üçün alıcı aşağıdakı bütün şərtləri yerinə yetirməlidir:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Məhsul <strong>heç bir formada istifadə edilməmiş, sınaqdan keçirilməmiş, quraşdırılmamış, enerji mənbəyinə qoşulmamış və işə salınmamış</strong> olmalıdır;</li>
                <li>Məhsulun <strong>orijinal qablaşdırması</strong> açılmamış, zədələnməmiş, üzərində hər hansı yazı, stiker, etiket və ya zədə olmamalıdır;</li>
                <li>Məhsulun <strong>bütün fabrik pleymbələri, qoruyucu təbəqələri, markalanması, seriya nömrəsi və/yaxud IMEI kodu</strong> toxunulmaz, silinməmiş və zədələnməmiş vəziyyətdə qalmalıdır;</li>
                <li>Məhsulla birlikdə verilən <strong>bütün aksesuarlar, kabel, adapter, qulaqlıq, sənədlər, istifadəçi təlimatları, zəmanət kartı və hədiyyələr</strong> tam şəkildə təqdim edilməlidir;</li>
                <li>Məhsulun <strong>əmtəə görünüşü</strong> (təqdimat vəziyyəti) orijinal vəziyyətdə saxlanılmalı, hər hansı deformasiya, cızıq, çat, aşınma, maye təması və ya digər istifadə əlamətləri olmamalıdır;</li>
                <li>Məhsulla birlikdə <strong>alış sənədi</strong> (elektron və ya çap formasında) təqdim edilməlidir;</li>
                <li><strong>RMA nömrəsi</strong> alınmış və məhsulun qablaşdırmasında açıq şəkildə qeyd edilmiş olmalıdır.</li>
              </ul>
              <p className="mt-2 text-neutral-800 font-medium">
                Yuxarıdakı şərtlərdən hər hansı birinin yerinə yetirilməməsi dəyişdirmə tələbinin
                rədd edilməsi üçün kifayət qədər əsasdır. Bu halda məhsul alıcıya geri göndərilir
                və bütün göndərmə xərcləri alıcı tərəfindən ödənilir. Heç bir halda qismən
                dəyişdirmə və ya qismən geri ödəmə həyata keçirilmir.
              </p>

              <p className="font-semibold text-neutral-800 mt-4">2.3. Analoji məhsul olmadıqda:</p>
              <p>
                Əgər dəyişdirmə üçün tələb olunan məhsul satıcıda mövcud deyilsə, alıcıya məhsulun
                satınalma qiyməti qaytarılır. Çatdırılma xərcləri, qaytarma göndərmə xərcləri,
                vergilər və rüsumlar geri qaytarılmır. Geri ödəmə yalnız məhsul TAPLA və ya satıcı
                tərəfindən qəbul edildikdən və yoxlamadan keçirildikdən sonra həyata keçirilir.
              </p>
            </Section>

            <Section title="3. Elektron Ticarət Əməliyyatından İmtina (7 iş günü)">
              <div className="bg-neutral-50 border border-neutral-200 p-5 mb-4">
                <p className="text-xs font-semibold text-neutral-600 mb-1">PROSEDUR TƏLƏBLƏRİ</p>
                <p className="text-[13px] text-neutral-700 leading-relaxed">
                  "Elektron ticarət haqqında" Qanunun 9-cu maddəsi ilə müəyyən edilmiş imtina
                  hüququ aşağıdakı prosedur tələblərinə ciddi riayət edilməklə həyata keçirilə bilər.
                  Bu tələblərdən hər hansı birinin pozulması imtina hüququnun itirilməsinə səbəb olur.
                </p>
              </div>

              <p className="font-semibold text-neutral-800">3.1. "Elektron ticarət haqqında" Qanunun 9-cu maddəsinə əsasən:</p>
              <p>
                Alıcı elektron ticarət əməliyyatından <strong>7 (yeddi) iş günü</strong> ərzində
                imtina etmək hüququna malikdir. İmtina hüququ məhsulun təhvil verildiyi andan
                başlayır. İmtina hüququnun həyata keçirilməsi üçün aşağıdakı bütün şərtlər yerinə
                yetirilməlidir:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Alıcı imtina barədə TAPLA-ya <strong>yalnız yazılı formada</strong>, <a href="mailto:support@tapla.az" className="text-neutral-950 underline underline-offset-4 decoration-neutral-300">support@tapla.az</a> ünvanına e-poçt vasitəsilə bildiriş göndərməlidir. Bildirişin mövzu sətrində <strong>"RMA – [SİFARİŞ NÖMRƏSİ]"</strong> qeyd edilməlidir. Telefon zəngi, SMS, sosial media mesajı və ya digər ünsiyyət vasitələri ilə göndərilən bildirişlər qəbul edilmir;</li>
                <li>Bildiriş göndərildikdən sonra alıcı <strong>7 (yeddi) iş günü</strong> ərzində məhsulu TAPLA və ya satıcı tərəfindən göstərilən ünvana qaytarmalıdır. Müəyyən edilmiş müddətdə qaytarılmayan məhsullar üzrə imtina hüququ <strong>itirilmiş hesab edilir</strong> və heç bir geri ödəmə həyata keçirilmir;</li>
                <li>Məhsulun qaytarılması üçün çatdırılma xərcləri tam həcmdə <strong>alıcı tərəfindən qarşılanır</strong>. Bu xərclər heç bir halda geri qaytarılmır;</li>
                <li>Məhsul <strong>orijinal qablaşdırmada, istifadə edilməmiş, sınaqdan keçirilməmiş, bütün etiketlər, pleymbələr, seriya nömrələri, aksesuarlar və sənədlərlə</strong> birlikdə olmalıdır. Məhsulun əmtəə görünüşünün, istehlak xassələrinin və ya qablaşdırmasının hər hansı formada dəyişdirilməsi və ya zədələnməsi imtinanın rədd edilməsi üçün əsasdır;</li>
                <li>Məhsulun dəyərinin azalmasına səbəb olan hər hansı istifadə, sınaq, quraşdırma, enerji mənbəyinə qoşma və ya digər hərəkətlərə görə <strong>alıcı maliyyə məsuliyyəti daşıyır</strong>. Bu halda geri qaytarılan məbləğ məhsulun dəyərindən azaldıla bilər və ya imtina tamamilə rədd edilə bilər.</li>
              </ul>

              <p className="font-semibold text-neutral-800 mt-4">3.2. İmtina hüququnun istisnaları:</p>
              <p>İmtina hüququ aşağıdakı məhsullara şamil edilmir:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Alıcının tələbi ilə fərdiləşdirilmiş (sifarişlə hazırlanmış) məhsullar;</li>
                <li>İstifadəçi tərəfindən açılmış audio və video yazıları, proqram təminatı (orijinal qablaşdırması açıldıqda);</li>
                <li>Tez xarab olan məhsullar;</li>
                <li>Həmçinin bu Siyasətin 5-ci bəndində qeyd olunan məhsullar.</li>
              </ul>
            </Section>

            <Section title="4. Qüsurlu Məhsulun Qaytarılması">
              <p>
                4.1. "İstehlakçıların hüquqlarının müdafiəsi haqqında" Qanuna uyğun olaraq, alıcı məhsulda <strong>istehsal qüsuru</strong> aşkar etdikdə aşağıdakı tələbləri irəli sürmək hüququna malikdir:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Məhsulun pulsuz təmiri;</li>
                <li>Məhsulun eyni markalı (model) məhsulla əvəz edilməsi;</li>
                <li>Müvafiq qiymət azaldılması;</li>
                <li>Müqavilədən imtina və pulun qaytarılması (yalnız qüsur əhəmiyyətli olduqda).</li>
              </ul>

              <p className="font-semibold text-neutral-800 mt-4">4.2. Qüsur iddiasının qəbulu üçün tələblər:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Görünən (aşkar) qüsurlar məhsulun təhvil alındığı andan etibarən <strong>24 (iyirmi dörd) saat</strong> ərzində TAPLA-ya bildirilməlidir. Bu müddət keçdikdən sonra görünən qüsurlarla bağlı iddialar qəbul edilmir;</li>
                <li>Gizli (aşkar olmayan) qüsurlar aşkar edildiyi andan etibarən <strong>7 (yeddi) təqvim günü</strong> ərzində bildirilməlidir. İstənilən halda, məhsulun təhvil verildiyi andan etibarən <strong>6 (altı) ay</strong> keçdikdən sonra qüsur iddiaları qəbul edilmir;</li>
                <li>Alıcı qüsurun mövcudluğunu sübut edən <strong>foto və/və ya video materiallar</strong> təqdim etməlidir. Foto/video materialları olmadan göndərilən iddialara baxılmır;</li>
                <li>Qüsurun xarakteri və onun istehsaldan qaynaqlandığını sübut etmək yükü <strong>alıcının üzərindədir</strong>, qanunla nəzərdə tutulmuş hallar istisna olmaqla.</li>
              </ul>

              <p className="font-semibold text-neutral-800 mt-4">4.3. Qüsurun xarakteri:</p>
              <p>
                Qüsur istehsaldan qaynaqlanan, alıcının hərəkətləri nəticəsində yaranmayan çatışmazlıq kimi müəyyən edilir. Aşağıdakı hallar qüsur hesab <strong>edilmir</strong>:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Normal istifadə nəticəsində yaranan təbii aşınma və köhnəlmə;</li>
                <li>Məhsulun düzgün saxlanılmaması, daşınması və ya istismarı nəticəsində yaranan zədələr;</li>
                <li>Məhsulun təsvirində göstərilmiş xüsusiyyətlərə uyğun olması, lakin alıcının gözləntilərinə və ya şəxsi tələblərinə cavab verməməsi;</li>
                <li>Məhsulun rəng, faktura və ya görünüşündəki monitor/ekran parametrlərindən, işıqlandırma şəraitindən və ya digər texniki səbəblərdən asılı olan cüzi fərqlər;</li>
                <li>Məhsulun sökülməsi, təmirə cəhd göstərilməsi, modifikasiya edilməsi və ya icazəsiz şəxslər tərəfindən müdaxilə nəticəsində yaranan istənilən nasazlıq, zədə və ya dəyişiklik;</li>
                <li>Üçüncü tərəf proqram təminatı, əməliyyat sistemi yeniləməsi və ya digər proqram dəyişiklikləri nəticəsində yaranan uyğunsuzluqlar;</li>
                <li>Məhsulun istifadəsi üçün tələb olunan xidmətlərin (internet, elektrik enerjisi, mobil rabitə və s.) olmaması və ya keyfiyyətsizliyi.</li>
              </ul>

              <p className="font-semibold text-neutral-800 mt-4">4.4. Ekspertiza:</p>
              <p>
                Qüsurun xarakteri ilə bağlı mübahisə yarandıqda, TAPLA və ya satıcı məhsulu
                müstəqil ekspertizaya göndərmək hüququna malikdir. Ekspertiza xərcləri ilkin
                olaraq TAPLA/satıcı tərəfindən qarşılanır. Ekspertiza nəticəsində qüsurun
                alıcının təqsiri üzündən yarandığı müəyyən olunarsa, ekspertiza xərcləri alıcı
                tərəfindən ödənilir.
              </p>
              <p>
                Ekspertizanın aparılması üçün tələb olunan müddət ərzində (<strong>30 (otuz) iş
                gününədək</strong>) alıcının tələbinə baxılması müvəqqəti dayandırıla bilər.
                Ekspertiza müddəti ərzində heç bir geri ödəmə, dəyişdirmə və ya təmir həyata
                keçirilmir.
              </p>
              <p>
                Ekspertiza nəticəsində məhsulun qüsursuz olduğu müəyyən edilərsə, məhsul alıcıya
                onun hesabına geri göndərilir və qüsurla bağlı heç bir tələb təmin edilmir.
              </p>
            </Section>

            <Section title="5. Qaytarılması və Dəyişdirilməsi Mümkün Olmayan Məhsullar">
              <p className="font-semibold text-neutral-800">
                5.1. Azərbaycan Respublikası Nazirlər Kabinetinin 21 may 1998-ci il tarixli 114 nömrəli Qərarına əsasən:
              </p>
              <ol className="list-decimal pl-6 space-y-1">
                <li>Qızıl və qızıl məmulatları;</li>
                <li>Qiymətli və yarıqiymətli metallardan, daşlardan hazırlanmış məmulatlar;</li>
                <li>Bütün növ parçalar, lentlər, toxumalar, haşiyələr (istehsal qüsuru olanlar istisna olmaqla);</li>
                <li>Ətir və kosmetik mallar;</li>
                <li>Kişi, qadın və uşaq çimərlik geyimləri;</li>
                <li>Yenidoğulmuşlar və körpələr üçün alt paltarları;</li>
                <li>Məişət kimyası malları;</li>
                <li>Fərdi gigiyena vasitələri (diş fırçaları, daraqlar, biqudi və s.);</li>
                <li>Uşaq oyuncaqları;</li>
                <li>İstifadədə olmuş corablar, alt paltarları, etiketi olmayan məhsullar (istehsal qüsuru istisna olmaqla);</li>
                <li>Qida məhsullarının saxlanması üçün plastik məmulatlar;</li>
                <li>Ödənilmiş və mağazadan çıxarılmış qida məhsulları (yararlılıq müddəti ərzində).</li>
              </ol>
              <p className="mt-3">
                Bu siyahı tamdır və yalnız qanunvericiliyə dəyişiklik edildikdə yenilənə bilər.
              </p>

              <p className="font-semibold text-neutral-800 mt-4">5.2. Satıcı tərəfindən müəyyən edilən əlavə istisnalar:</p>
              <p>
                Hər bir satıcı qanunvericiliklə müəyyən edilmiş minimum tələblərdən yuxarı olmaqla,
                öz məhsul kateqoriyaları üzrə əlavə qaytarma istisnaları müəyyən edə bilər. Bu
                istisnalar müvafiq məhsulun səhifəsində göstərilir və alıcı tərəfindən qəbul
                edilmiş hesab olunur.
              </p>
            </Section>

            <Section title="6. Qaytarma Proseduru">
              <div className="bg-neutral-50 border border-neutral-200 p-5 mb-4">
                <p className="text-xs font-semibold text-neutral-600 mb-1">RMA PROSEDURU</p>
                <p className="text-[13px] text-neutral-700 leading-relaxed">
                  Aşağıdakı prosedura ciddi riayət edilməsi məcburidir. RMA nömrəsi olmadan,
                  qeydiyyatdan keçməmiş göndərişlər qəbul edilmir və geri qaytarılır. Bütün
                  göndərmə xərcləri bu halda alıcıya məxsusdur.
                </p>
              </div>

              <p className="font-semibold text-neutral-800">Addım 1 — Bildiriş</p>
              <p>
                Alıcı qaytarma və ya dəyişdirmə niyyəti barədə TAPLA-ya <a href="mailto:support@tapla.az" className="text-neutral-950 underline underline-offset-4 decoration-neutral-300">support@tapla.az</a>
                ünvanına e-poçt göndərməklə məlumat verməlidir. E-poçtun mövzu sətrində
                <strong> "RMA – [SİFARİŞ NÖMRƏSİ]" </strong> qeyd edilməlidir. Bildirişdə sifariş
                nömrəsi, qaytarma səbəbi, məhsulun vəziyyəti və qüsurun təsviri (əgər varsa)
                göstərilməlidir. Tam olmayan və ya səhv doldurulmuş bildirişlərə baxılmır.
              </p>

              <p className="font-semibold text-neutral-800 mt-4">Addım 2 — RMA nömrəsinin alınması</p>
              <p>
                TAPLA və ya satıcı müraciəti qəbul etdikdən sonra alıcıya <strong>Geri Qaytarma
                İcazə Nömrəsi</strong> (RMA — Return Merchandise Authorization) təqdim edir.
                RMA nömrəsi alındığı andan etibarən <strong>14 (on dörd) təqvim günü</strong>
                ərzində etibarlıdır. Bu müddət ərzində məhsul qaytarılmazsa, RMA nömrəsi etibarsız
                olur və alıcı yeni RMA nömrəsi almaq üçün proseduru yenidən başlatmalıdır. RMA
                nömrəsi olmadan göndərilən məhsullar qəbul edilmir.
              </p>

              <p className="font-semibold text-neutral-800 mt-4">Addım 3 — Məhsulun göndərilməsi</p>
              <p>
                Alıcı məhsulu <strong>orijinal qablaşdırmada</strong>, bütün aksesuar, sənəd və
                hədiyyələrlə birlikdə, <strong>RMA nömrəsini qablaşdırmanın üzərində aydın
                şəkildə qeyd edərək</strong> satıcı tərəfindən göstərilən ünvana göndərir.
                Orijinal qablaşdırma əlavə <strong>qoruyucu xarici qutuya</strong> yerləşdirilməlidir.
                Orijinal qablaşdırmanın üzərinə birbaşa stiker, yapışan lent və ya başqa
                material yapışdırılması qəbuledilməzdir. Göndərmə xərcləri alıcı tərəfindən
                qarşılanır (qüsurlu məhsul istisna olmaqla). Məhsulun daşınma zamanı zədələnməsi
                riski <strong>tamamilə alıcıya məxsusdur</strong>.
              </p>

              <p className="font-semibold text-neutral-800 mt-4">Addım 4 — Yoxlama</p>
              <p>
                Satıcı məhsulu qəbul etdikdən sonra <strong>10 (on) iş günü</strong> ərzində
                yoxlayır və qərar qəbul edir. Yoxlama müddəti məhsulun kateqoriyasından və
                mürəkkəbliyindən asılı olaraq <strong>30 (otuz) iş gününədək</strong> uzadıla
                bilər. Yoxlama zamanı məhsulun bütün komponentləri, seriya nömrələri, qablaşdırma
                və sənədlər yoxlanılır. Hər hansı uyğunsuzluq aşkar edildikdə, qaytarma rədd edilir.
              </p>

              <p className="font-semibold text-neutral-800 mt-4">Addım 5 — Nəticə</p>
              <p>
                Yoxlama başa çatdıqdan sonra alıcıya qərar barədə e-poçt vasitəsilə məlumat
                verilir. Qərar müsbət olduqda, dəyişdirmə və ya geri ödəmə həyata keçirilir.
                Qərar mənfi olduqda, məhsul alıcıya onun hesabına geri göndərilir və heç bir
                geri ödəmə həyata keçirilmir. Alıcının mənfi qərardan narazı qaldığı halda,
                o, məhkəməyə müraciət etmək hüququna malikdir.
              </p>
            </Section>

            <Section title="7. Geri Ödəmə Şərtləri">
              <p>
                7.1. Geri ödəmə yalnız aşağıdakı hallarda həyata keçirilir:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Dəyişdirmə üçün analoji məhsul mövcud olmadıqda (Qanunun 14-cü maddəsi);</li>
                <li>Məhsulda əhəmiyyətli istehsal qüsuru aşkar edildikdə;</li>
                <li>Elektron ticarət əməliyyatından 7 iş günü ərzində imtina edildikdə və bütün şərtlər yerinə yetirildikdə;</li>
                <li>Satıcı sifarişi yerinə yetirə bilmədikdə (məhsul mövcud deyilsə).</li>
              </ul>
              <p>
                7.2. Geri ödəmə məbləği məhsulun satınalma qiymətinə bərabərdir. Aşağıdakı
                xərclər və məbləğlər geri qaytarılmır:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Çatdırılma xərcləri (qanunla nəzərdə tutulmuş hallar istisna olmaqla);</li>
                <li>Geri qaytarma göndərmə xərcləri;</li>
                <li>Vergilər, rüsumlar və gömrük ödənişləri;</li>
                <li>Endirim kuponları, promo kodlar, hədiyyə balansı və loyallıq balları ilə ödənilmiş məbləğlər (bu vasitələrlə ödənilmiş hissə geri qaytarılmır, yalnız faktiki ödənilmiş pul məbləği qaytarılır);</li>
                <li>Məhsulun dəyərinin azalması ilə bağlı tutulmalar (əgər məhsul istifadə edilmiş və ya zədələnmişsə).</li>
              </ul>
              <p>
                7.3. Geri ödəmə alıcının ilkin ödəniş etdiyi vasitə ilə (bank kartı, bank
                köçürməsi və s.) həyata keçirilir. Nağd ödənişlər yalnız bank köçürməsi
                vasitəsilə geri qaytarılır. Hissə-hissə ödəniş (hissəli ödəniş) ilə əldə
                edilmiş məhsulların qaytarılması zamanı geri ödəmə yalnız ilkin ödəniş
                kartına həyata keçirilir.
              </p>
              <p>
                7.4. Geri ödəmə müddəti qərarın qəbul edildiyi andan etibarən <strong>14 (on
                dörd) iş gününədəkdir</strong>. Geri ödəmənin kartda əks olunması bankın
                emal müddətindən asılıdır və TAPLA bu müddətə görə məsuliyyət daşımır.
              </p>
              <p>
                7.5. Hədiyyə balansı ilə ödənilmiş məhsulların qaytarılması zamanı məbləğ
                hədiyyə balansına geri qaytarılır. Hədiyyə balansının istifadə müddəti
                uzadılmır.
              </p>
            </Section>

            <Section title="8. Mübahisələrin Həlli">
              <p>
                8.1. Alıcı və satıcı arasında məhsulun qaytarılması ilə bağlı yaranan mübahisələr ilk növbədə TAPLA platforması vasitəsilə həll edilməyə çalışılır. TAPLA vasitəçi rolunu oynayır, lakin məcburi qərar qəbul etmək səlahiyyətinə malik deyil.
              </p>
              <p>
                8.2. Mübahisə həll edilmədikdə, alıcı Azərbaycan Respublikasının Antimonopoliya və İstehlak Bazarına Nəzarət üzrə Dövlət Agentliyinə (competition.gov.az) və ya müvafiq məhkəməyə müraciət edə bilər.
              </p>
              <p>
                8.3. Bu Siyasətdən irəli gələn bütün münasibətlər Azərbaycan Respublikasının qanunvericiliyi ilə tənzimlənir.
              </p>
            </Section>

            <Section title="9. Əlaqə">
              <p className="text-sm text-neutral-800 bg-neutral-50 border border-neutral-200 p-4">
                <strong>Geri qaytarma ilə bağlı müraciətlər üçün:</strong><br />
                E-poçt: <a href="mailto:support@tapla.az" className="text-neutral-950 underline underline-offset-4 decoration-neutral-300">support@tapla.az</a><br />
                Tel: +994702453060
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
