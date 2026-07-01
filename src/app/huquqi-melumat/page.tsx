import { Container } from '@/components/ui/Container';
import { generateSEOMeta } from '@/lib/seo/meta-generator';
import type { Metadata } from 'next';

export const metadata: Metadata = generateSEOMeta({
  title: 'Hüquqi Məlumat',
  description: 'TAPLA TECHNOLOGIES M.M.C. — hüquqi məlumat, şirkət rekvizitləri və əlaqə ünvanları.',
  canonical: 'https://shop.tapla.az/huquqi-melumat',
})

export default function LegalNoticePage() {
  return (
    <main className="min-h-screen bg-white">
      <Container>
        <div className="max-w-4xl mx-auto py-16 md:py-24">
          <div className="mb-12">
            <p className="text-xs tracking-widest uppercase text-neutral-400 mb-3">HÜQUQİ MƏLUMAT</p>
            <h1 className="text-3xl md:text-4xl font-serif font-light tracking-tight text-neutral-950 mb-4">
              Hüquqi Məlumat
            </h1>
            <p className="text-sm text-neutral-500 border-b border-neutral-200 pb-6">
              Son yenilənmə: 28 İyun 2026
            </p>
          </div>

          <div className="max-w-none text-neutral-700 space-y-6 text-[14px] leading-[1.8]">

            <p className="text-sm text-neutral-800 bg-neutral-50 border border-neutral-200 p-4">
              Bu səhifə Azərbaycan Respublikasının qanunvericiliyinə uyğun olaraq TAPLA TECHNOLOGIES
              platformasının operatoru haqqında hüquqi məlumatları ehtiva edir.
            </p>

            <Section title="1. Şirkət Məlumatları">
              <ul className="space-y-2">
                <li><strong>Şirkətin adı:</strong> TAPLA TECHNOLOGIES M.M.C.</li>
                <li><strong>Hüquqi forma:</strong> Məhdud Məsuliyyətli Cəmiyyət</li>
                <li><strong>Dövlət qeydiyyatı:</strong> Azərbaycan Respublikası İqtisadiyyat Nazirliyi yanında Dövlət Vergi Xidməti</li>
                <li><strong>VÖEN:</strong> 1309856121</li>
                <li><strong>Hüquqi ünvan:</strong> AZ1012, Bakı şəhəri, Yasamal rayonu, Dadaş Bünyadzadə, APT 15</li>
              </ul>
            </Section>

            <Section title="2. Əlaqə Məlumatları">
              <ul className="space-y-2">
                <li><strong>Telefon:</strong> +994702453060</li>
                <li><strong>E-poçt:</strong> <a href="mailto:support@tapla.az" className="text-neutral-950 underline underline-offset-4 decoration-neutral-300">support@tapla.az</a></li>
                <li><strong>Veb-sayt:</strong> shop.tapla.az</li>
              </ul>
            </Section>

            <Section title="3. Nəzarət Oranı">
              <p>
                TAPLA TECHNOLOGIES M.M.C. fəaliyyəti aşağıdakı dövlət qurumlarının nəzarəti altındadır:
              </p>
              <ul className="space-y-2">
                <li><strong>Antimonopoliya və İstehlak Bazarına Nəzarət üzrə Dövlət Agentliyi</strong><br />
                Ünvan: AZ 1000, Bakı şəhəri, Üzeyir Hacıbəyov küçəsi, 80<br />
                Veb: competition.gov.az</li>
                <li><strong>Elektron Təhlükəsizlik Xidməti (Fərdi məlumatların müdafiəsi)</strong><br />
                Veb: etx.gov.az</li>
              </ul>
            </Section>

            <Section title="4. Müəllif Hüquqları">
              <p>
                Bu veb-saytda yerləşən bütün məzmun (mətnlər, şəkillər, loqolar, qrafik elementlər,
                dizayn) TAPLA TECHNOLOGIES M.M.C.-yə məxsusdur və Azərbaycan Respublikasının müəllif
                hüquqları qanunvericiliyi ilə qorunur. İcazəsiz istifadə, surətinin çıxarılması və
                yayılması qanunvericiliyə ziddir.
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
