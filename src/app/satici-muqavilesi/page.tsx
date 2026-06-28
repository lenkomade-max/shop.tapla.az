import { Container } from '@/components/ui/Container';

export const metadata = {
  title: 'Satıcı Müqaviləsi | TAPLA MARKETPLACE',
  description: 'TAPLA MARKETPLACE satıcı müqaviləsi — satıcı qeydiyyatı və platformadan istifadə şərtləri.',
};

export default function SellerAgreementPage() {
  return (
    <main className="min-h-screen bg-white">
      <Container>
        <div className="max-w-4xl mx-auto py-16 md:py-24">
          <div className="mb-12">
            <p className="text-xs tracking-widest uppercase text-neutral-400 mb-3">SATICI MÜQAVİLƏSİ</p>
            <h1 className="text-3xl md:text-4xl font-serif font-light tracking-tight text-neutral-950 mb-4">
              Satıcı Müqaviləsi
            </h1>
            <p className="text-sm text-neutral-500 border-b border-neutral-200 pb-6">
              Son yenilənmə: 28 İyun 2026
            </p>
          </div>

          <div className="max-w-none text-neutral-700 space-y-6 text-[14px] leading-[1.8]">

            <div className="bg-amber-50 border border-amber-200 p-6 mb-8">
              <p className="text-xs font-semibold text-amber-800 mb-1">HÜQUQİ BİLDİRİŞ</p>
              <p className="text-[13px] text-amber-900 leading-relaxed">
                Bu sənəd TAPLA MARKETPLACE platformasında satıcı kimi qeydiyyatdan keçmiş
                istifadəçilər arasında bağlanan müqavilənin şərtlərini müəyyən edir. Satıcı
                qeydiyyatdan keçməklə bu müqavilənin şərtlərini qəbul etmiş sayılır.
              </p>
            </div>

            <Section title="1. Tərəflər">
              <p>
                <strong>1.1. TAPLA TECHNOLOGIES M.M.C.</strong> (bundan sonra <strong>«Platforma»</strong>), Azərbaycan
                Respublikasının qanunvericiliyinə uyğun olaraq qeydiyyatdan keçmiş hüquqi şəxs,
                VÖEN: 1309856121, hüquqi ünvan: AZ1012, Bakı şəhəri, Yasamal rayonu, Dadaş Bünyadzadə
                küçəsi, APT 15, bir tərəfdən,
              </p>
              <p>
                <strong>1.2.</strong> Platformada satıcı qismində qeydiyyatdan keçmiş fiziki və ya
                hüquqi şəxs (bundan sonra <strong>«Satıcı»</strong>), digər tərəfdən,
                birlikdə <strong>«Tərəflər»</strong>, aşağıdakı şərtlərlə bu müqaviləni bağlamışlar.
              </p>
            </Section>

            <Section title="2. Müqavilənin Predmeti">
              <p>
                2.1. Platforma Satıcıya elektron ticarət platforması vasitəsilə məhsullarını
                üçüncü şəxslərə (alıcılara) təklif etmək və satmaq imkanı verir.
              </p>
              <p>
                2.2. Platforma satıcı ilə alıcı arasında bağlanan alış-veriş müqaviləsinin tərəfi
                deyil. Platforma yalnız elektron ticarət əməliyyatının texniki vasitəçisidir.
              </p>
              <p>
                2.3. Satıcı məhsulların satışı ilə bağlı bütün məsuliyyəti (məhsulun keyfiyyəti,
                qaytarılması, zəmanət, qanunvericiliyə uyğunluq) öz üzərinə götürür.
              </p>
            </Section>

            <Section title="3. Satıcının Qeydiyyatı və Akkreditasiyası">
              <p>
                3.1. Satıcı platformada qeydiyyatdan keçmək üçün aşağıdakı sənədləri təqdim etməlidir:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Hüquqi şəxslər üçün: dövlət qeydiyyatı haqqında şəhadətnamə, VÖEN, nizamnamə;</li>
                <li>Fiziki şəxslər üçün: şəxsiyyət vəsiqəsi, VÖEN;</li>
                <li>Fərdi sahibkarlar üçün: fərdi sahibkar qeydiyyat şəhadətnaməsi.</li>
              </ul>
              <p>
                3.2. Platforma Satıcının sənədlərini yoxlamaq və akkreditasiyadan imtina etmək
                hüququna malikdir. Platforma imtinaya dair səbəb göstərməyə borclu deyil.
              </p>
              <p>
                3.3. Satıcı qeydiyyat zamanı təqdim etdiyi məlumatların dəqiqliyinə və
                tamlığına görə məsuliyyət daşıyır.
              </p>
            </Section>

            <Section title="4. Komissiya və Ödənişlər">
              <p>
                4.1. Platforma Satıcının satdığı hər bir məhsula görə komissiya haqqı alır.
                Komissiyanın məbləği Satıcı ilə Platforma arasında ayrıca razılaşdırılır və
                Satıcının şəxsi kabinetində göstərilir.
              </p>
              <p>
                4.2. Komissiya məbləği məhsulun satış qiymətindən (vergilər daxil olmaqla)
                hesablanır.
              </p>
              <p>
                4.3. Platforma komissiya məbləğini avtomatik olaraq satışdan əldə olunan
                məbləğdən çıxarır və qalan məbləği Satıcıya ödəyir.
              </p>
              <p>
                4.4. Ödənişlər aylıq olaraq, hesabat dövründən sonrakı ayın 15-dək həyata
                keçirilir. Minimum ödəniş məbləği 100 AZN-dir. Bu məbləğdən az qalıq olduqda,
                məbləğ növbəti hesabat dövrünə keçirilir.
              </p>
              <p>
                4.5. Platforma komissiya dərəcələrini 30 (otuz) təqvim günü əvvəl Satıcıya
                bildirmək şərti ilə birtərəfli qaydada dəyişmək hüququna malikdir.
              </p>
            </Section>

            <Section title="5. Satıcının Hüquq və Vəzifələri">
              <p className="font-semibold text-neutral-800">5.1. Satıcının hüquqları:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Platforma vasitəsilə məhsullarını satışa çıxarmaq;</li>
                <li>Məhsul kataloqunu idarə etmək;</li>
                <li>Satış statistikasına və hesabatlara çıxış əldə etmək;</li>
                <li>Platformadan istifadə ilə bağlı texniki dəstək almaq.</li>
              </ul>

              <p className="font-semibold text-neutral-800 mt-4">5.2. Satıcının vəzifələri:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Məhsulların dəqiq və hərtərəfli təsvirini təmin etmək;</li>
                <li>Məhsulların qiymətini, mövcudluğunu və çatdırılma şərtlərini müəyyən etmək;</li>
                <li>Sifarişləri qəbul edildiyi andan etibarən 2 (iki) iş günü ərzində təsdiqləmək;</li>
                <li>Sifarişləri 5 (beş) iş günü ərzində çatdırılmağa hazır hala gətirmək;</li>
                <li>Azərbaycan Respublikasının vergi qanunvericiliyinə uyğun olaraq vergiləri ödəmək;</li>
                <li>Satılan məhsullara dair qanuni zəmanət öhdəliklərini yerinə yetirmək;</li>
                <li>Məhsul qaytarılması və mübadiləsi ilə bağlı tələbləri qanunvericiliyə uyğun həll etmək;</li>
                <li>Platformanın nüfuzuna zərər vura biləcək hərəkətlərdən çəkinmək.</li>
              </ul>
            </Section>

            <Section title="6. Qadağan Olunmuş Məhsullar">
              <p>Aşağıdakı məhsulların platformada satışı qəti qadağandır:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Qanunsuz və ya saxta məhsullar;</li>
                <li>İntellektual mülkiyyət hüquqlarını pozan məhsullar;</li>
                <li>Silahlar, döyüş sursatı və onların komponentləri;</li>
                <li>Narkotik vasitələr, psixotrop maddələr və onların prekursorları;</li>
                <li>İnsan orqan və toxumaları;</li>
                <li>Alkoqollu içkilər (xüsusi lisenziya olmadan);</li>
                <li>Tütün məmulatları və elektron siqaretlər;</li>
                <li>Heyvanlar, o cümlədən ev heyvanları;</li>
                <li>Radioaktiv, partlayıcı, zəhərli maddələr;</li>
                <li>Azərbaycan Respublikasının qanunvericiliyi ilə qadağan edilmiş digər məhsullar.</li>
              </ul>
            </Section>

            <Section title="7. Məhsul Məlumatı və Təsvirlər">
              <p>
                7.1. Satıcı hər bir məhsul üçün aşağıdakı məlumatları təqdim etməlidir:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Məhsulun adı, markası, modeli;</li>
                <li>Məhsulun dəqiq təsviri (xüsusiyyətləri, ölçüləri, materialı);</li>
                <li>Məhsulun real vəziyyətini əks etdirən şəkillər (ən azı 3, maksimum 10);</li>
                <li>Məhsulun kateqoriyası və alt kateqoriyası;</li>
                <li>Məhsulun qiyməti (AZN ilə);</li>
                <li>Məhsulun mövcud sayı (inventar);</li>
                <li>Zəmanət şərtləri (varsa);</li>
                <li>Qaytarma şərtləri (satıcı tərəfindən müəyyən edilirsə).</li>
              </ul>
              <p>
                7.2. Məhsul təsvirləri dəqiq, yanıltıcı olmayan və Azərbaycan Respublikasının
                qanunvericiliyinə uyğun olmalıdır. Yanlış və ya yanıltıcı məlumat verildikdə,
                məsuliyyət tamamilə Satıcının üzərinə düşür.
              </p>
            </Section>

            <Section title="8. Sifarişlərin İcrası">
              <p>
                8.1. Satıcı sifarişi qəbul etdikdən sonra sifarişin statusunu «Hazırlanır» olaraq
                yeniləməli və məhsulu qablaşdırmalıdır.
              </p>
              <p>
                8.2. Çatdırılma üsulu Satıcı tərəfindən müəyyən edilir və məhsul səhifəsində
                göstərilir. Çatdırılma xərcləri Satıcı tərəfindən müəyyən edilə bilər.
              </p>
              <p>
                8.3. Sifarişin icrasında gecikmə olduqda, Satıcı dərhal alıcıya və Platformaya
                məlumat verməlidir. 10 (on) iş günündən artıq gecikmə Platformaya sifarişi
                ləğv etmək hüququ verir.
              </p>
            </Section>

            <Section title="9. Zəmanət və Qaytarma">
              <p>
                9.1. Satıcı satdığı məhsullara Azərbaycan Respublikasının qanunvericiliyi ilə
                müəyyən edilmiş qaydada zəmanət verməyə borcludur.
              </p>
              <p>
                9.2. Məhsulun qaytarılması və dəyişdirilməsi qaydaları Satıcı tərəfindən müəyyən
                edilir, lakin qanunvericilikdə nəzərdə tutulmuş minimum tələblərdən aşağı ola
                bilməz.
              </p>
              <p>
                9.3. Qaytarma ilə bağlı bütün xərclər (çatdırılma, ekspertiza, emal) Satıcı
                tərəfindən qarşılanır, əgər qüsurun alıcının təqsiri üzündən yarandığı müəyyən
                edilərsə, bu xərclər alıcının üzərinə düşür.
              </p>
              <p>
                9.4. Platforma qaytarma prosesinin idarə olunmasında vasitəçi rolunu oynayır,
                lakin qaytarma ilə bağlı maliyyə öhdəlikləri birbaşa Satıcının üzərinə düşür.
              </p>
            </Section>

            <Section title="10. Vergilər">
              <p>
                10.1. Satıcı Azərbaycan Respublikasının vergi qanunvericiliyinə uyğun olaraq
                bütün vergiləri, rüsumları və digər məcburi ödənişləri müstəqil olaraq
                hesablamaq, bəyan etmək və ödəmək öhdəliyini daşıyır.
              </p>
              <p>
                10.2. Platforma vergi agenti deyil və Satıcının vergi öhdəliklərinə görə
                məsuliyyət daşımır.
              </p>
            </Section>

            <Section title="11. Müəllif Hüquqları və Əqli Mülkiyyət">
              <p>
                11.1. Satıcı tərəfindən platformaya yüklənən şəkillər, mətnlər və digər
                materiallar Satıcının mülkiyyətidir. Satıcı bu materialların yerləşdirilməsi
                üçün Platformaya qeyri-müstəsna lisenziya verir.
              </p>
              <p>
                11.2. Satıcı yüklədiyi materialların üçüncü şəxslərin əqli mülkiyyət
                hüquqlarını pozmadığına zəmanət verir.
              </p>
              <p>
                11.3. Platforma loqosu, dizaynı, ticarət nişanı və digər əqli mülkiyyət
                obyektləri TAPLA TECHNOLOGIES M.M.C.-yə məxsusdur.
              </p>
            </Section>

            <Section title="12. Məxfilik və Məlumatların Qorunması">
              <p>
                12.1. Tərəflər bir-birindən əldə etdikləri məlumatların məxfiliyini qorumağa
                borcludurlar.
              </p>
              <p>
                12.2. Satıcı alıcıların şəxsi məlumatlarını yalnız sifarişin icrası üçün
                istifadə edə bilər və bu məlumatları üçüncü şəxslərə ötürmək hüququna malik
                deyil.
              </p>
              <p>
                12.3. Satıcı alıcıların şəxsi məlumatlarının qorunması üçün texniki və
                təşkilati tədbirlər görməlidir.
              </p>
            </Section>

            <Section title="13. Platformanın Məsuliyyətinin Məhdudlaşdırılması">
              <p>
                13.1. Platforma yalnız vasitəçi rolunu oynayır və aşağıdakılara görə
                məsuliyyət daşımır:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Məhsulların keyfiyyəti, təhlükəsizliyi və qanuniliyi;</li>
                <li>Məhsul təsvirlərinin dəqiqliyi;</li>
                <li>Satıcı tərəfindən sifarişin icra edilməməsi və ya gec icra edilməsi;</li>
                <li>Satıcının vergi öhdəliklərini yerinə yetirməməsi;</li>
                <li>Üçüncü şəxslərin əqli mülkiyyət hüquqlarının pozulması.</li>
              </ul>
              <p>
                13.2. Platformanın Satıcıya qarşı məsuliyyəti, hər halda, son 12 ay ərzində
                Satıcı tərəfindən Platformaya ödənilmiş komissiyaların ümumi məbləğindən
                çox ola bilməz.
              </p>
            </Section>

            <Section title="14. Müqavilənin Müddəti və Ləğvi">
              <p>
                14.1. Bu müqavilə Satıcının platformada qeydiyyatdan keçdiyi andan qüvvəyə
                minir və qeyri-müəyyən müddətə bağlanır.
              </p>
              <p>
                14.2. Platforma bu müqaviləni 30 (otuz) təqvim günü əvvəl Satıcıya bildiriş
                göndərməklə birtərəfli qaydada ləğv edə bilər.
              </p>
              <p>
                14.3. Platforma aşağıdakı hallarda müqaviləni dərhal ləğv etmək hüququna
                malikdir:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Satıcı bu müqavilənin şərtlərini pozduqda;</li>
                <li>Satıcı qanunsuz fəaliyyətlə məşğul olduqda;</li>
                <li>Satıcı qadağan olunmuş məhsullar satdıqda;</li>
                <li>Satıcı Platformanın nüfuzuna ciddi zərər vurduqda.</li>
              </ul>
              <p>
                14.4. Müqavilə ləğv edildikdən sonra Satıcının bütün aktiv siyahıları silinir
                və gözləyən sifarişlər ləğv edilir. Tamamlanmamış sifarişlər üzrə öhdəliklər
                qalır.
              </p>
            </Section>

            <Section title="15. Mübahisələrin Həlli">
              <p>
                15.1. Bu müqavilədən irəli gələn bütün mübahisələr Tərəflər arasında
                danışıqlar yolu ilə həll edilməyə çalışılır.
              </p>
              <p>
                15.2. Danışıqlar nəticə vermədikdə, mübahisələr Bakı şəhərinin müvafiq
                məhkəməsində həll edilir.
              </p>
              <p>
                15.3. Bu müqaviləyə Azərbaycan Respublikasının qanunvericiliyi tətbiq edilir.
              </p>
            </Section>

            <Section title="16. Yekun Müddəalar">
              <p>
                16.1. Bu müqavilə elektron formada bağlanmış hesab olunur və tərəflər üçün
                hüquqi qüvvəyə malikdir.
              </p>
              <p>
                16.2. Platforma bu müqavilənin şərtlərini 30 (otuz) təqvim günü əvvəl
                Satıcıya bildirmək şərti ilə birtərəfli qaydada dəyişmək hüququna malikdir.
                Satıcı dəyişikliklərlə razılaşmadıqda, müqaviləni ləğv etmək hüququna
                malikdir.
              </p>
              <p>
                16.3. Bu müqavilənin hər hansı bir müddəasının etibarsız hesab edilməsi,
                digər müddəaların etibarlılığına təsir göstərmir.
              </p>
              <p>
                16.4. Tərəflər arasında yazışmalar, bildirişlər və sənəd dövriyyəsi elektron
                formada (e-poçt, şəxsi kabinet) həyata keçirilir.
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
