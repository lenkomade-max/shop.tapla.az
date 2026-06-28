import { Container } from '@/components/ui/Container';

export const metadata = {
  title: 'Kuki Siyasəti | TAPLA MARKETPLACE',
  description: 'TAPLA MARKETPLACE-in kuki siyasəti — veb-saytımızda istifadə olunan kukilər haqqında məlumat.',
};

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <Container>
        <div className="max-w-4xl mx-auto py-16 md:py-24">
          <div className="mb-12">
            <p className="text-xs tracking-widest uppercase text-neutral-400 mb-3">KUKİ SİYASƏTİ</p>
            <h1 className="text-3xl md:text-4xl font-serif font-light tracking-tight text-neutral-950 mb-4">
              Kuki Siyasəti
            </h1>
            <p className="text-sm text-neutral-500 border-b border-neutral-200 pb-6">
              Son yenilənmə: 28 İyun 2026
            </p>
          </div>

          <div className="max-w-none text-neutral-700 space-y-6 text-[14px] leading-[1.8]">

            <p>
              Bu Kuki Siyasəti TAPLA MARKETPLACE platformasının (shop.tapla.az) veb-saytında və əlaqəli
              rəqəmsal kanallarında hansı növ kukilərdən istifadə edildiyini, bu kukilərin məqsədini
              və sizin kukilər üzərində nəzarət imkanlarınızı izah edir.
            </p>

            <Section title="1. Kuki Nədir?">
              <p>
                Kuki (cookie) – veb-sayta daxil olduğunuz zaman brauzerinizin cihazınızda saxladığı
                kiçik mətn faylıdır. Kukilər veb-saytın düzgün işləməsi, istifadəçi təcrübəsinin
                yaxşılaşdırılması, trafikin analizi və marketinq fəaliyyəti üçün istifadə olunur.
              </p>
            </Section>

            <Section title="2. İstifadə Etdiyimiz Kukilər">
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-300">
                      <th className="text-left font-semibold text-neutral-950 pb-2 pr-4">KUKİ NÖVÜ</th>
                      <th className="text-left font-semibold text-neutral-950 pb-2 pr-4">MƏQSƏD</th>
                      <th className="text-left font-semibold text-neutral-950 pb-2 pr-4">SAXLAMA MÜDDƏTİ</th>
                      <th className="text-left font-semibold text-neutral-950 pb-2">NÖV</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    <tr>
                      <td className="py-3 pr-4 align-top">Zəruri (Strictly Necessary)</td>
                      <td className="py-3 pr-4 align-top">Saytın əsas funksiyalarını təmin edir (səhifə naviqasiyası, təhlükəsiz giriş)</td>
                      <td className="py-3 pr-4 align-top">Sessiya / 1 il</td>
                      <td className="py-3 align-top">1-ci tərəf</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 align-top">Funksional (Functional)</td>
                      <td className="py-3 pr-4 align-top">Seçimlərinizi xatırlayır (dil, valyuta, bölgə)</td>
                      <td className="py-3 pr-4 align-top">1 il</td>
                      <td className="py-3 align-top">1-ci tərəf</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 align-top">Analitik (Analytics)</td>
                      <td className="py-3 pr-4 align-top">Sayt trafikini və istifadəçi davranışını anonim şəkildə ölçür (Google Analytics)</td>
                      <td className="py-3 pr-4 align-top">2 ilə qədər</td>
                      <td className="py-3 align-top">3-cü tərəf</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 align-top">Marketinq (Marketing)</td>
                      <td className="py-3 pr-4 align-top">Fərdiləşdirilmiş reklam və məzmun tövsiyələri göstərir</td>
                      <td className="py-3 pr-4 align-top">90 gün</td>
                      <td className="py-3 align-top">3-cü tərəf</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Section>

            <Section title="3. Üçüncü Tərəf Kukiləri">
              <p>
                Platformamız aşağıdakı üçüncü tərəf xidmətlərindən istifadə edə bilər ki, bunlar da
                öz kukilərini yerləşdirə bilər:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Google Analytics</strong> – istifadə statistikasının toplanması üçün;</li>
                <li><strong>Google Ads / Facebook Pixel</strong> – reklam kampaniyalarının effektivliyinin ölçülməsi üçün;</li>
                <li>Ödəniş xidməti provayderləri – əməliyyat təhlükəsizliyi üçün.</li>
              </ul>
            </Section>

            <Section title="4. Kukilərə Nəzarət">
              <p>
                Siz istənilən vaxt brauzerinizin parametrlərini dəyişərək kukiləri bloklaya və ya silə
                bilərsiniz. Bununla belə, zəruri kukilərin bloklanması saytın bəzi funksiyalarının
                düzgün işləməməsinə səbəb ola bilər.
              </p>
              <p className="mt-2">
                Brauzerinizin kuki parametrlərini necə dəyişdirəcəyinizi öyrənmək üçün aşağıdakı
                linklərə müraciət edin:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-neutral-950 underline underline-offset-4 decoration-neutral-300">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer" className="text-neutral-950 underline underline-offset-4 decoration-neutral-300">Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/" target="_blank" rel="noopener noreferrer" className="text-neutral-950 underline underline-offset-4 decoration-neutral-300">Safari</a></li>
                <li><a href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" className="text-neutral-950 underline underline-offset-4 decoration-neutral-300">Microsoft Edge</a></li>
              </ul>
            </Section>

            <Section title="5. Bu Siyasətə Dəyişikliklər">
              <p>
                Bu Kuki Siyasəti vaxtaşırı yenilənə bilər. Əhəmiyyətli dəyişikliklər olduqda,
                istifadəçilərə veb-sayt vasitəsilə bildiriş göndəriləcəkdir.
              </p>
            </Section>

            <Section title="6. Əlaqə">
              <p className="text-sm">
                Kukilərlə bağlı suallarınız varsa, bizimlə əlaqə saxlayın:<br />
                E-poçt: <a href="mailto:support@tapla.az" className="text-neutral-950 underline underline-offset-4 decoration-neutral-300">support@tapla.az</a>
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
      <div className="space-y-2">{children}</div>
    </div>
  );
}
