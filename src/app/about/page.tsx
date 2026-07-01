import { Container } from '@/components/ui/Container';
import Link from 'next/link';
import { ShieldCheck, Truck, Headphones, HeartHandshake, Sparkles } from 'lucide-react';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema } from '@/lib/seo/schemas/breadcrumb-schema';
import { generateSEOMeta } from '@/lib/seo/meta-generator';
import type { Metadata } from 'next';

export const metadata: Metadata = generateSEOMeta({
  title: 'Haqqımızda',
  description: 'TAPLA MARKETPLACE — Azərbaycanda elektronika və rəqəmsal texnologiyalar sahəsində etibarlı onlayn platforma. Orijinal məhsullar, sürətli çatdırılma, peşəkar dəstək.',
  canonical: 'https://shop.tapla.az/haqqimizda',
})

const values = [
  {
    icon: ShieldCheck,
    title: 'ORIJINAL MƏHSULLAR',
    desc: 'Yalnız rəsmi təchizatçılardan təmin olunan, 100% orijinal məhsullar. Hər bir məhsul keyfiyyət yoxlamasından keçir.',
  },
  {
    icon: Truck,
    title: 'SÜRƏTLİ ÇATDIRILMA',
    desc: 'Bakı daxili 24 saat, regionlara 2–3 iş günü ərzində çatdırılma. Sifarişinizi istənilən ünvana qədər izləyə bilərsiniz.',
  },
  {
    icon: Headphones,
    title: 'PEŞƏKAR DƏSTƏK',
    desc: '09:00-dan 21:00-dək peşəkar dəstək komandamız hər sualınızı cavablandırmağa və texniki məsələlərdə kömək etməyə hazırdır.',
  },
  {
    icon: HeartHandshake,
    title: 'ETİBAR VƏ ŞƏFFAFLIQ',
    desc: 'Hər bir sifarişdə şəffaf qiymət, dəqiq çatdırılma vaxtı və açıq əlaqə kanalları. Müştəri məmnuniyyəti bizim önceliyimizdir.',
  },
];

const stats = [
  { number: '500+', label: 'Məhsul' },
  { number: '1000+', label: 'Məmnun Müştəri' },
  { number: '24 saat', label: 'Bakıda Çatdırılma' },
  { number: '09–21', label: 'Dəstək Saatları' },
];

export default function AboutPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Ana Səhifə', url: 'https://shop.tapla.az' },
    { name: 'Haqqımızda', url: 'https://shop.tapla.az/haqqimizda' },
  ])

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-neutral-950 text-white py-24 md:py-32 overflow-hidden">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-white/[0.03] blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-amber-200/[0.03] blur-3xl pointer-events-none" />
        <Container>
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <p className="text-[10px] tracking-[0.25em] font-bold text-neutral-500 uppercase mb-4">
              TAPLA MARKETPLACE
            </p>
            <h1 className="text-3xl md:text-5xl font-serif font-light tracking-tight mb-6 leading-tight">
              Biz Onlayn Alış-Verşişi<br />
              <span className="text-neutral-300">Daha Asan və Etibarlı Edirik</span>
            </h1>
            <p className="text-sm md:text-base text-neutral-400 font-sans leading-relaxed max-w-xl mx-auto">
              TAPLA — Azərbaycanda elektronika, aksesuar və rəqəmsal texnologiyalar sahəsində
              fəaliyyət göstərən onlayn platforma. Məqsədimiz hər kəs üçün keyfiyyətli texnologiyanı
              əlçatan etməkdir.
            </p>
          </div>
        </Container>
      </section>

      {/* Story */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="max-w-3xl mx-auto">
            <p className="text-[10px] tracking-[0.25em] font-bold text-neutral-400 uppercase mb-4">
              BİZ KİMİK
            </p>
            <h2 className="text-2xl md:text-4xl font-serif font-light tracking-tight text-neutral-950 mb-8 leading-tight">
              TAPLA — Texnologiyaya<br />
              <span className="text-neutral-500">Yeni Nəfəs</span>
            </h2>
            <div className="space-y-5 text-sm md:text-[15px] text-neutral-600 leading-[1.8] font-sans">
              <p>
                TAPLA MARKETPLACE müasir texnologiya dünyası ilə sizi birləşdirən onlayn platformadır.
                Biz yalnız məhsul satmırıq — biz etibarlı və rahat alış-veriş təcrübəsi təqdim edirik.
              </p>
              <p>
                Hər bir məhsulun seçimindən tutmuş, sifarişin qapınıza çatdırılmasına qədər hər
                mərhələdə şəffaflıq və keyfiyyət bizim əsas prinsipimizdir. Bizə görə, müştəri
                məmnuniyyəti sadəcə bir hədəf deyil — hər gün işimizin mərkəzində duran dəyərdir.
              </p>
              <p>
                Platformamızda ən son texnologiya məhsulları, rəqabətqabiliyyətli qiymətlər və
                peşəkar müştəri xidməti təklif edirik. İstər ev üçün texnika, istər ofis avadanlığı,
                istərsə də hədiyyə axtarışında olun — TAPLA-da ehtiyacınıza uyğun həll tapa bilərsiniz.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-20 bg-neutral-50 border-t border-b border-neutral-100">
        <Container>
          <div className="text-center mb-16">
            <p className="text-[10px] tracking-[0.25em] font-bold text-neutral-400 uppercase mb-4">
              DƏYƏRLƏRİMİZ
            </p>
            <h2 className="text-2xl md:text-4xl font-serif font-light tracking-tight text-neutral-950">
              Niyə TAPLA?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white border border-neutral-100 p-8 text-center space-y-5 hover:border-neutral-300 transition-colors duration-300 group"
              >
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-neutral-950 text-white group-hover:scale-110 transition-transform duration-300">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="text-[11px] font-semibold tracking-widest text-neutral-950 uppercase">
                  {v.title}
                </h3>
                <p className="text-xs text-neutral-500 font-sans leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="py-16 md:py-20">
        <Container>
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((s) => (
              <div key={s.label} className="text-center space-y-2">
                <div className="text-3xl md:text-4xl font-serif font-light text-neutral-950">
                  {s.number}
                </div>
                <div className="text-[10px] tracking-widest font-semibold text-neutral-400 uppercase">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-neutral-950 text-white py-20 md:py-24">
        <Container>
          <div className="max-w-2xl mx-auto text-center space-y-8 relative">
            <div className="absolute top-0 right-0 h-60 w-60 rounded-full bg-white/[0.03] blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <Sparkles className="h-8 w-8 text-amber-200/60 mx-auto" />
              <h2 className="text-2xl md:text-4xl font-serif font-light tracking-tight leading-tight">
                Alış-Verİşə Başlayın
              </h2>
              <p className="text-sm text-neutral-400 font-sans leading-relaxed max-w-md mx-auto">
                Minlərlə məhsul arasından sizə ən uyğununu tapın. Sifarişiniz bir neçə klik
                uzaqlığınızda.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  href="/products"
                  className="inline-flex items-center space-x-2 bg-white text-neutral-950 px-8 py-4 text-[10px] font-semibold tracking-widest uppercase hover:bg-neutral-200 transition-colors duration-300"
                >
                  Məhsullara Bax
                </Link>
                <Link
                  href="#faq"
                  className="inline-flex items-center space-x-2 border border-neutral-800 text-neutral-300 px-8 py-4 text-[10px] font-semibold tracking-widest uppercase hover:border-white hover:text-white transition-colors duration-300"
                >
                  Tez-tez Verilən Suallar
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  </>
  );
}
