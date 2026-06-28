import { Container } from '@/components/ui/Container';

export const metadata = {
  title: 'Məxfilik Siyasəti | TAPLA MARKETPLACE',
  description: 'TAPLA MARKETPLACE məxfilik siyasəti — şəxsi məlumatlarınızın toplanması, işlənməsi və qorunması qaydaları.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <Container>
        <div className="max-w-4xl mx-auto py-16 md:py-24">
          <div className="mb-12">
            <p className="text-xs tracking-widest uppercase text-neutral-400 mb-3">MƏXFİLİK SİYASƏTİ</p>
            <h1 className="text-3xl md:text-4xl font-serif font-light tracking-tight text-neutral-950 mb-4">
              Məxfilik Siyasəti
            </h1>
            <p className="text-sm text-neutral-500 border-b border-neutral-200 pb-6">
              Son yenilənmə: 28 İyun 2026
            </p>
          </div>

          <div className="prose prose-sm max-w-none text-neutral-700 space-y-6 text-[14px] leading-[1.8]">

            <div className="bg-neutral-50 border border-neutral-200 p-6 mb-8">
              <p className="text-xs font-semibold text-neutral-600 mb-2">TƏRƏF—ƏLAQƏ MƏLUMATLARI</p>
              <p className="text-sm text-neutral-800">
                <strong>TAPLA TECHNOLOGIES M.M.C.</strong><br />
                VÖEN: 1309856121<br />
                Hüquqi ünvan: AZ1012, Bakı şəhəri, Yasamal rayonu, Dadaş Bünyadzadə, APT 15<br />
                E-poçt: <a href="mailto:support@tapla.az" className="text-neutral-950 underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-950 transition-colors">support@tapla.az</a>
              </p>
            </div>

            <Section title="1. Ümumi Müddəalar">
              <p>
                1.1. Bu Məxfilik Siyasəti ("Siyasət") TAPLA TECHNOLOGIES M.M.C. (bundan sonra "TAPLA", "Platforma", "biz", "bizə" və ya "bizim") tərəfindən idarə olunan shop.tapla.az internet səhifəsində (bundan sonra "Sayt") və ya onunla əlaqəli mobil tətbiqlərdə istifadəçilərin (bundan sonra "İstifadəçi", "siz" və ya "sizin") şəxsi məlumatlarının toplanması, işlənməsi, saxlanması və qorunması qaydalarını müəyyən edir.
              </p>
              <p>
                1.2. Bu Siyasət "Azərbaycan Respublikasının "Fərdi məlumatlar haqqında" 11 may 2010-cu il tarixli 998-IIIQ nömrəli Qanununa, "İnformasiya, informatika və informasiyanın qorunması haqqında" Qanuna, habelə digər normativ-hüquqi aktlara uyğun olaraq hazırlanmışdır.
              </p>
              <p>
                1.3. TAPLA MARKETPLACE üçüncü tərəf satıcıların (bundan sonra "Satıcılar") məhsullarını təklif edən onlayn marketpleys platformasıdır. TAPLA satıcı ilə alıcı arasında əqdin bağlanması üçün informasiya vasitəçisi rolunu oynayır və satıcıların məhsullarına görə birbaşa məsuliyyət daşımır.
              </p>
            </Section>

            <Section title="2. Toplanılan Məlumatlar">
              <p>2.1. Platforma aşağıdakı kateqoriyalı şəxsi məlumatları toplaya bilər:</p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li><strong>Şəxsiyyəti müəyyən edən məlumatlar:</strong> ad, soyad, ata adı;</li>
                <li><strong>Əlaqə məlumatları:</strong> e-poçt ünvanı, telefon nömrəsi, çatdırılma ünvanı;</li>
                <li><strong>Ödəniş məlumatları:</strong> ödəniş kartı haqqında məlumatlar (ödəniş prosesi zamanı birbaşa ödəniş provayderinə ötürülür, TAPLA tərəfindən saxlanılmır);</li>
                <li><strong>Texniki məlumatlar:</strong> IP ünvanı, brauzer növü, əməliyyat sistemi, cihaz haqqında məlumat, kukilər və izləmə texnologiyaları vasitəsilə toplanan məlumatlar;</li>
                <li><strong>İstifadə məlumatları:</strong> baxış tarixçəsi, axtarış sorğuları, satın alma tarixçəsi, istək siyahısı, Platformada qarşılıqlı fəaliyyət haqqında məlumat;</li>
                <li><strong>Marketinq üstünlükləri:</strong> abunəlik statusu, promo-kodlardan istifadə, bildiriş parametrləri.</li>
              </ul>
              <p>
                2.2. Satıcı kimi qeydiyyatdan keçdikdə, əlavə olaraq VÖEN (Vergi Uçotu Nömrəsi), bank hesab məlumatları, şirkət rekvizitləri və nümayəndə haqqında məlumatlar tələb oluna bilər.
              </p>
            </Section>

            <Section title="3. Məlumatların Toplanması Məqsədləri və Hüquqi Əsasları">
              <p>3.1. Şəxsi məlumatlar aşağıdakı məqsədlər üçün toplanır və işlənir:</p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-300">
                      <th className="text-left py-2 pr-4 font-semibold text-neutral-800">Məqsəd</th>
                      <th className="text-left py-2 pr-4 font-semibold text-neutral-800">Hüquqi əsas</th>
                      <th className="text-left py-2 font-semibold text-neutral-800">Saxlanma müddəti</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    <tr><td className="py-2 pr-4 align-top">Sifarişin icrası və çatdırılma</td><td className="py-2 pr-4 align-top">Müqavilənin icrası</td><td className="py-2 align-top">5 il</td></tr>
                    <tr><td className="py-2 pr-4 align-top">İstifadəçi dəstəyi və müştəri xidməti</td><td className="py-2 pr-4 align-top">Qanuni mənafelər</td><td className="py-2 align-top">3 il</td></tr>
                    <tr><td className="py-2 pr-4 align-top">Marketinq və reklam</td><td className="py-2 pr-4 align-top">Razılıq</td><td className="py-2 align-top">Razılıq geri götürülənədək</td></tr>
                    <tr><td className="py-2 pr-4 align-top">Platformanın təkmilləşdirilməsi</td><td className="py-2 pr-4 align-top">Qanuni mənafelər</td><td className="py-2 align-top">2 il</td></tr>
                    <tr><td className="py-2 pr-4 align-top">Hüquqi öhdəliklərin yerinə yetirilməsi</td><td className="py-2 pr-4 align-top">Qanuni öhdəlik</td><td className="py-2 align-top">Qanunla müəyyən edilmiş müddət</td></tr>
                  </tbody>
                </table>
              </div>
            </Section>

            <Section title="4. Məlumatların Ötürülməsi">
              <p>
                4.1. TAPLA istifadəçilərin şəxsi məlumatlarını aşağıdakı üçüncü tərəflərə ötürə bilər:
              </p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li><strong>Satıcılar:</strong> sifarişin icrası məqsədilə (ad, soyad, ünvan, telefon nömrəsi);</li>
                <li><strong>Ödəniş provayderləri:</strong> ödənişin emalı üçün (ödəniş məlumatları);</li>
                <li><strong>Kuryer və logistika şirkətləri:</strong> çatdırılma üçün;</li>
                <li><strong>Analitika və reklam provayderləri:</strong> Google Analytics, Facebook Pixel və s. (anonimləşdirilmiş məlumatlar);</li>
                <li><strong>Dövlət orqanları:</strong> qanunla nəzərdə tutulmuş hallarda.</li>
              </ul>
              <p>
                4.2. TAPLA məlumatların ötürülməsi zamanı "Fərdi məlumatlar haqqında" Qanunun tələblərinə riayət edir və məlumatların məxfiliyini təmin edir.
              </p>
            </Section>

            <Section title="5. Kukilər (Cookies) və İzləmə Texnologiyaları">
              <p>
                5.1. Platforma istifadəçi təcrübəsini yaxşılaşdırmaq, trafiki analiz etmək və fərdiləşdirilmiş məzmun təqdim etmək üçün kukilərdən və oxşar texnologiyalardan istifadə edir.
              </p>
              <p>
                5.2. Kukilərin növləri, məqsədləri və idarə edilməsi haqqında ətraflı məlumat üçün <a href="/kuki-siyaseti" className="text-neutral-950 underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-950 transition-colors">Kuki Siyasətinə</a> müraciət edin.
              </p>
            </Section>

            <Section title="6. Məlumat Subyektinin Hüquqları">
              <p>6.1. "Fərdi məlumatlar haqqında" Qanuna uyğun olaraq, istifadəçilər aşağıdakı hüquqlara malikdirlər:</p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>Şəxsi məlumatlarına giriş əldə etmək;</li>
                <li>Məlumatların dəqiqləşdirilməsini, düzəliş edilməsini tələb etmək;</li>
                <li>Məlumatların silinməsini tələb etmək (qanunla nəzərdə tutulmuş hallarda);</li>
                <li>Məlumatların işlənməsinə etiraz etmək;</li>
                <li>Razılığın geri götürülməsi (razılıq əsasında işlənən məlumatlara münasibətdə);</li>
                <li>Məlumatların daşınması (texniki cəhətdən mümkün olduqda).</li>
              </ul>
              <p>
                 6.2. Hüquqlarınızı həyata keçirmək üçün <a href="mailto:support@tapla.az" className="text-neutral-950 underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-950 transition-colors">support@tapla.az</a> ünvanına müraciət etməlisiniz. TAPLA müraciəti aldıqdan sonra 30 (otuz) gün ərzində cavab verməyə borcludur.
              </p>
            </Section>

            <Section title="7. Məlumatların Təhlükəsizliyi">
              <p>
                7.1. TAPLA şəxsi məlumatların qorunması üçün texniki və təşkilati tədbirlər görür, o cümlədən:
              </p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>SSL/TLS şifrələmə protokolları;</li>
                <li>Giriş hüquqlarının diferensiasiyası;</li>
                <li>Müntəzəm təhlükəsizlik auditi;</li>
                <li>İşçilərin məlumat təhlükəsizliyi üzrə təlimi.</li>
              </ul>
              <p>
                7.2. TAPLA məlumatların tam təhlükəsizliyinə zəmanət verə bilməz, çünki internet vasitəsilə məlumat ötürülməsi mütləq təhlükəsiz deyil. Məlumatların ötürülməsi ilə bağlı riski istifadəçi öz üzərinə götürür.
              </p>
            </Section>

            <Section title="8. Məlumatların Saxlanma Müddəti">
              <p>
                8.1. Şəxsi məlumatlar toplanma məqsədinə çatmaq üçün zəruri olan müddət ərzində, lakin Azərbaycan Respublikasının qanunvericiliyi ilə müəyyən edilmiş müddətdən çox olmayaraq saxlanılır.
              </p>
              <p>
                8.2. Müvafiq məqsədə çatdıqda və ya istifadəçi məlumatların silinməsini tələb etdikdə, məlumatlar qanunla nəzərdə tutulmuş hallar istisna olmaqla, silinir və ya anonimləşdirilir.
              </p>
            </Section>

            <Section title="9. Siyasətə Dəyişikliklər">
              <p>
                9.1. TAPLA bu Siyasəti vaxtaşırı yeniləmək hüququnu özündə saxlayır. Dəyişikliklər edildikdə, "Son yenilənmə" tarixi yenilənir və dəyişikliklər dərc edildiyi andan qüvvəyə minir.
              </p>
              <p>
                9.2. Əhəmiyyətli dəyişikliklər olduqda, istifadəçilərə e-poçt vasitəsilə və ya Platformada bildiriş göstərilməklə məlumat veriləcəkdir.
              </p>
            </Section>

            <Section title="10. Əlaqə">
              <p>
                Məxfilik siyasəti ilə bağlı suallarınız və ya şəxsi məlumatlarınızla bağlı müraciətlər üçün:
              </p>
              <p className="text-sm text-neutral-800 bg-neutral-50 border border-neutral-200 p-4">
                <strong>TAPLA TECHNOLOGIES M.M.C.</strong><br />
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
      <div className="space-y-3 text-neutral-700 [&_ul]:text-neutral-700">
        {children}
      </div>
    </div>
  );
}
