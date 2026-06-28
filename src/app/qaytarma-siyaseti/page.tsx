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

              <p className="font-semibold text-neutral-800 mt-4">2.2. Dəyişdirmənin şərtləri:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Məhsul <strong>istifadə edilməmiş</strong> olmalı, orijinal görünüşünü qorumalıdır;</li>
                <li>Məhsulun <strong>orijinal qablaşdırması</strong>, fabrik etiketləri, pleymbələri və markalanması qorunmalıdır;</li>
                <li>Məhsulla birlikdə verilən <strong>bütün aksesuarlar, kabel, adapter, sənədlər</strong> tam şəkildə təqdim edilməlidir;</li>
                <li>Məhsulun <strong>əmtəə görünüşü</strong> (təqdimat vəziyyəti) saxlanılmalı, hər hansı deformasiya, cızıq, çat, aşınma əlamətləri olmamalıdır;</li>
                <li>Məhsulla birlikdə <strong>alış sənədi</strong> (elektron və ya çap formasında) təqdim edilməlidir.</li>
              </ul>

              <p className="font-semibold text-neutral-800 mt-4">2.3. Analoji məhsul olmadıqda:</p>
              <p>
                Əgər dəyişdirmə üçün tələb olunan məhsul satıcıda mövcud deyilsə, alıcıya məhsulun dəyəri qaytarılır. Qaytarılan məbləğ məhsulun satınalma qiymətinə bərabərdir. Çatdırılma xərcləri geri qaytarılmır.
              </p>
            </Section>

            <Section title="3. Elektron Ticarət Əməliyyatından İmtina (7 iş günü)">
              <p className="font-semibold text-neutral-800">3.1. "Elektron ticarət haqqında" Qanunun 9-cu maddəsinə əsasən:</p>
              <p>
                Alıcı elektron ticarət əməliyyatından <strong>7 (yeddi) iş günü</strong> ərzində heç bir səbəb göstərmədən və heç bir cərimə ödəmədən imtina etmək hüququna malikdir. İmtina hüququ məhsulun təhvil verildiyi andan başlayır.
              </p>

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

              <p className="font-semibold text-neutral-800 mt-4">4.2. Qüsurun xarakteri:</p>
              <p>
                Qüsur istehsaldan qaynaqlanan, alıcının hərəkətləri nəticəsində yaranmayan çatışmazlıq kimi müəyyən edilir. Aşağıdakı hallar qüsur hesab <strong>edilmir</strong>:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Normal istifadə nəticəsində yaranan təbii aşınma;</li>
                <li>Məhsulun düzgün saxlanılmaması, daşınması və ya istismarı nəticəsində yaranan zədələr;</li>
                <li>Məhsulun təsvirində göstərilmiş xüsusiyyətlərə uyğun olması, lakin alıcının gözləntilərinə cavab verməməsi;</li>
                <li>Məhsulun rəng, faktura və ya görünüşündəki monitor/ekran parametrlərindən asılı olan cüzi fərqlər;</li>
                <li>Məhsulun sökülməsi, təmirə cəhd göstərilməsi və ya icazəsiz şəxslər tərəfindən müdaxilə nəticəsində yaranan nasazlıqlar.</li>
              </ul>

              <p className="font-semibold text-neutral-800 mt-4">4.3. Ekspertiza:</p>
              <p>
                Qüsurun xarakteri ilə bağlı mübahisə yarandıqda, TAPLA və ya satıcı məhsulu ekspertizaya göndərmək hüququna malikdir. Ekspertiza xərcləri ilkin olaraq TAPLA/satıcı tərəfindən qarşılanır. Ekspertiza nəticəsində qüsurun alıcının təqsiri üzündən yarandığı müəyyən olunarsa, ekspertiza xərcləri alıcı tərəfindən ödənilir.
              </p>
              <p>
                Ekspertizanın aparılması üçün tələb olunan müddət ərzində (30 iş gününədək) alıcının tələbinə baxılması müvəqqəti dayandırıla bilər.
              </p>
            </Section>

            <Section title="5. Qaytarılması və Dəyişdirilməsi Mümkün Olmayan Məhsullar">
              <p className="font-semibold text-neutral-800">
                Azərbaycan Respublikası Nazirlər Kabinetinin 21 may 1998-ci il tarixli 114 nömrəli Qərarına əsasən:
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
            </Section>

            <Section title="6. Qaytarma Proseduru">
              <p className="font-semibold text-neutral-800">Addım 1 — Bildiriş</p>
              <p>
                Alıcı qaytarma və ya dəyişdirmə niyyəti barədə TAPLA-ya <a href="mailto:support@tapla.az" className="text-neutral-950 underline underline-offset-4 decoration-neutral-300">support@tapla.az</a> ünvanına e-poçt göndərməklə və ya şəxsi kabinetdə müvafiq formanı doldurmaqla məlumat verməlidir. Bildirişdə sifariş nömrəsi, qaytarma səbəbi və məhsulun vəziyyəti göstərilməlidir.
              </p>

              <p className="font-semibold text-neutral-800 mt-4">Addım 2 — RMA nömrəsinin alınması</p>
              <p>
                TAPLA və ya satıcı müraciəti qəbul etdikdən sonra alıcıya <strong>Geri Qaytarma İcazə Nömrəsi</strong> (RMA — Return Merchandise Authorization) təqdim edir. RMA nömrəsi olmadan göndərilən məhsullar qəbul edilmir.
              </p>

              <p className="font-semibold text-neutral-800 mt-4">Addım 3 — Məhsulun göndərilməsi</p>
              <p>
                Alıcı məhsulu orijinal qablaşdırmada, bütün aksesuar və sənədlərlə birlikdə RMA nömrəsini qeyd edərək satıcı tərəfindən göstərilən ünvana göndərir. Göndərmə xərcləri alıcı tərəfindən qarşılanır (qüsurlu məhsul istisna olmaqla).
              </p>

              <p className="font-semibold text-neutral-800 mt-4">Addım 4 — Yoxlama</p>
              <p>
                Satıcı məhsulu qəbul etdikdən sonra <strong>10 (on) iş günü</strong> ərzində yoxlayır və qərar qəbul edir. Yoxlama müddəti məhsulun kateqoriyasından və mürəkkəbliyindən asılı olaraq uzadıla bilər.
              </p>

              <p className="font-semibold text-neutral-800 mt-4">Addım 5 — Nəticə</p>
              <p>
                Yoxlama başa çatdıqdan sonra alıcıya qərar barədə e-poçt vasitəsilə məlumat verilir. Qərar müsbət olduqda, dəyişdirmə və ya geri ödəmə həyata keçirilir.
              </p>
            </Section>

            <Section title="7. Geri Ödəmə Şərtləri">
              <p>
                7.1. Geri ödəmə yalnız aşağıdakı hallarda həyata keçirilir:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Dəyişdirmə üçün analoji məhsul mövcud olmadıqda (Qanunun 14-cü maddəsi);</li>
                <li>Məhsulda əhəmiyyətli istehsal qüsuru aşkar edildikdə;</li>
                <li>Elektron ticarət əməliyyatından 7 iş günü ərzində imtina edildikdə;</li>
                <li>Satıcı sifarişi yerinə yetirə bilmədikdə (məhsul mövcud deyilsə).</li>
              </ul>
              <p>
                7.2. Geri ödəmə məbləği məhsulun satınalma qiymətinə bərabərdir. Çatdırılma xərcləri, qaytarma göndərmə xərcləri, vergilər və rüsumlar geri qaytarılmır.
              </p>
              <p>
                7.3. Geri ödəmə alıcının ödəniş etdiyi vasitə ilə (bank kartı, bank köçürməsi və s.) həyata keçirilir. Geri ödəmə müddəti qərarın qəbul edildiyi andan etibarən 14 (on dörd) iş gününədəkdir.
              </p>
              <p>
                7.4. Hədiyyə balansı ilə ödənilmiş məhsulların qaytarılması zamanı məbləğ hədiyyə balansına geri qaytarılır.
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
