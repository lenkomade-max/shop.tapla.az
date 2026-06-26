'use client';

import React, { useState } from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Sparkles, Search, Bot, PhoneCall, CheckCircle, ChevronRight } from 'lucide-react';
import { VALUE_PROPS } from '@/constants/data';
import { Modal } from '@/components/ui/Modal';
import { clsx } from 'clsx';

export function ValueProps() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Quiz State
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);

  // AI Advisor State
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    { role: 'assistant', text: 'Salam! Mən Aluna Virtual Gözəllik məsləhətçisiyəm. Dərinizdə hansı problemi həll etmək istədiyinizi qeyd edin (məs. sızanaqlar, qırışlar, qocalma əlamətləri) və mən sizə ən uyğun cihazı məsləhət görüm.' }
  ]);
  const [userInput, setUserInput] = useState('');

  const getIcon = (name: string) => {
    switch (name) {
      case 'Sparkles':
        return <Sparkles className="h-6 w-6 text-neutral-900" />;
      case 'Search':
        return <Search className="h-6 w-6 text-neutral-900" />;
      case 'Bot':
        return <Bot className="h-6 w-6 text-neutral-900" />;
      case 'PhoneCall':
        return <PhoneCall className="h-6 w-6 text-neutral-900" />;
      default:
        return <Sparkles className="h-6 w-6 text-neutral-900" />;
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMsg = userInput.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setUserInput('');

    // Simulated responsive Azerbaijani AI recommendation
    setTimeout(() => {
      let response = 'Möhtəşəm sualdır! Sizin dəri ehtiyaclarınıza əsasən, sizə ALUNA Radiance Pro cihazımızı tövsiyə edirəm. O, həm mikroaxın liftinqi, həm də ləkə əleyhinə göy/qırmızı LED dalğalarına malikdir. Ətraflı məhsul siyahımızda baxa bilərsiniz.';
      if (userMsg.toLowerCase().includes('təmizlə') || userMsg.toLowerCase().includes('qara') || userMsg.toLowerCase().includes('sebum')) {
        response = 'Dərinizin dərin təmizlənməsi və qara nöqtələrin təmizlənməsi üçün sizə ALUNA Sonic Deep Cleanser ultrasəs spatulamızı məsləhət görürəm. Həftədə 2 dəfə istifadə etməklə məsamələri dərindən açacaqsınız.';
      } else if (userMsg.toLowerCase().includes('göz') || userMsg.toLowerCase().includes('şişkin')) {
        response = 'Gözaltı torbalar, yorğunluq və tünd halqalar üçün göz ətrafı Eye Radiance Duo masajerimiz mükəmməl seçimdir. 42°C istilik masajı dərhal nəticə verir.';
      } else if (userMsg.toLowerCase().includes('buxaq') || userMsg.toLowerCase().includes('çənə') || userMsg.toLowerCase().includes('oval')) {
        response = 'Üz ovalını kəskinləşdirmək və buxaq problemləri üçün ikiqat masaj başlıqlı ALUNA Contour Lift V-Sculpt cihazımız tam sizə görədir. Gündəlik 5 dəqiqə istifadə edin.';
      }
      setMessages(prev => [...prev, { role: 'assistant', text: response }]);
    }, 1000);
  };

  const handleQuizAnswer = (answer: string) => {
    const newAnswers = [...quizAnswers, answer];
    setQuizAnswers(newAnswers);
    
    if (quizStep < 2) {
      setQuizStep(quizStep + 1);
    } else {
      setQuizStep(3); // Result step
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers([]);
  };

  return (
    <Section py="none" variant="light" className="border-t border-neutral-100">
      {/* Horizontal Value Props Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-neutral-100 border-b border-neutral-100 font-sans">
        {VALUE_PROPS.map((prop) => (
          <div
            key={prop.id}
            className="p-8 flex flex-col justify-between space-y-4 hover:bg-neutral-50/50 transition-colors group cursor-pointer"
            onClick={() => {
              setActiveModal(prop.id);
              if (prop.id === 'prop-1') resetQuiz();
            }}
          >
            <div className="space-y-4">
              <div className="p-3 bg-neutral-100 w-fit group-hover:bg-neutral-900 group-hover:text-white transition-colors duration-500">
                <div className="group-hover:rotate-12 transition-transform duration-300">
                  {getIcon(prop.iconName)}
                </div>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-xs sm:text-sm font-bold tracking-widest text-neutral-900 uppercase">
                  {prop.title}
                </h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {prop.description}
                </p>
              </div>
            </div>

            <button
              className="text-[10px] tracking-widest uppercase font-semibold text-neutral-900 group-hover:text-neutral-500 flex items-center space-x-1.5 pt-2"
            >
              <span>{prop.actionText}</span>
              <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>

      {/* 1. QUIZ DIAGNOSTIC MODAL */}
      <Modal
        isOpen={activeModal === 'prop-1'}
        onClose={() => setActiveModal(null)}
        title="1-DƏQİQƏLİK ÜZ QULLUĞU TESTİ"
      >
        <div className="space-y-6 font-sans">
          {quizStep === 0 && (
            <div className="space-y-4">
              <h4 className="text-xs tracking-widest font-bold uppercase text-neutral-400">ADDIM 1 / 3</h4>
              <p className="text-sm font-semibold text-neutral-800">Dəri tipinizi necə xarakterizə edirsiniz?</p>
              <div className="grid grid-cols-1 gap-2">
                {['Quru və qabıqlanan', 'Yağlı və parıldayan', 'Müəyyən nahiyələri yağlı, bəzi nahiyələri quru (Qarışıq)', 'Normal və problemsiz'].map((ans) => (
                  <button
                    key={ans}
                    onClick={() => handleQuizAnswer(ans)}
                    className="w-full text-left text-xs p-4 border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50 transition-colors uppercase font-medium cursor-pointer"
                  >
                    {ans}
                  </button>
                ))}
              </div>
            </div>
          )}

          {quizStep === 1 && (
            <div className="space-y-4">
              <h4 className="text-xs tracking-widest font-bold uppercase text-neutral-400">ADDIM 2 / 3</h4>
              <p className="text-sm font-semibold text-neutral-800">Ən çox həll etmək istədiyiniz dəri problemi hansıdır?</p>
              <div className="grid grid-cols-1 gap-2">
                {['Sızanaq, akne və genişlənmiş məsamələr', 'Qara nöqtələr və dərin kirlər', 'Üz ovalının sallanması, buxaq və qırışlar', 'Gözaltı torbalar və tünd halqalar'].map((ans) => (
                  <button
                    key={ans}
                    onClick={() => handleQuizAnswer(ans)}
                    className="w-full text-left text-xs p-4 border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50 transition-colors uppercase font-medium cursor-pointer"
                  >
                    {ans}
                  </button>
                ))}
              </div>
            </div>
          )}

          {quizStep === 2 && (
            <div className="space-y-4">
              <h4 className="text-xs tracking-widest font-bold uppercase text-neutral-400">ADDIM 3 / 3</h4>
              <p className="text-sm font-semibold text-neutral-800">Gündəlik gözəllik rituallarına nə qədər vaxt ayıra bilərsiniz?</p>
              <div className="grid grid-cols-1 gap-2">
                {['Hər gün maksimum 5 dəqiqə', 'Hər gün 10-15 dəqiqə', 'Həftədə bir-iki dəfə daha ətraflı baxım'].map((ans) => (
                  <button
                    key={ans}
                    onClick={() => handleQuizAnswer(ans)}
                    className="w-full text-left text-xs p-4 border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50 transition-colors uppercase font-medium cursor-pointer"
                  >
                    {ans}
                  </button>
                ))}
              </div>
            </div>
          )}

          {quizStep === 3 && (
            <div className="space-y-5 text-center">
              <CheckCircle className="h-10 w-10 text-emerald-600 mx-auto animate-bounce" />
              <div className="space-y-2">
                <h4 className="text-xs tracking-widest font-bold uppercase text-neutral-400">TESTİN NƏTİCƏSİ</h4>
                <h3 className="text-base sm:text-lg font-bold uppercase text-neutral-900">SİZƏ UYĞUN CİHAZ: ALUNA RADIANCE PRO</h3>
                <p className="text-xs text-neutral-500 leading-relaxed max-w-sm mx-auto">
                  Seçimlərinizə əsasən, dərhal kollagen artımını dəstəkləyən, sızanaqları müalicə edən və mikroaxınlı liftinq verən LED Terapiya cihazımız sizin üçün ən mükəmməl seçimdir.
                </p>
              </div>
              <div className="flex gap-3 justify-center pt-2">
                <button
                  onClick={resetQuiz}
                  className="px-5 py-3 border border-neutral-200 text-[10px] tracking-widest uppercase font-semibold text-neutral-500 hover:text-neutral-900 hover:border-neutral-900 transition-colors cursor-pointer"
                >
                  YENİDƏN BAŞLA
                </button>
                <a
                  href="#products"
                  onClick={() => setActiveModal(null)}
                  className="bg-neutral-950 text-white px-5 py-3 text-[10px] tracking-widest uppercase font-semibold hover:bg-neutral-850 transition-colors flex items-center"
                >
                  CİHAZI GÖR
                </a>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* 2. DEVICE COMPARISON MOCKUP MODAL */}
      <Modal
        isOpen={activeModal === 'prop-2'}
        onClose={() => setActiveModal(null)}
        title="CİHAZLARI MÜQAYİSƏ EDİN"
      >
        <div className="space-y-4 font-sans text-xs">
          <p className="text-neutral-500 leading-relaxed">
            Ehtiyaclarınıza uyğun Aluna texnologiyalarını asanlıqla yan-yana müqayisə edin:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-neutral-100">
              <thead>
                <tr className="bg-neutral-50 text-neutral-900 uppercase font-bold tracking-widest border-b border-neutral-100 text-[9px]">
                  <th className="p-3">Xüsusiyyət</th>
                  <th className="p-3">Radiance Pro</th>
                  <th className="p-3">Sonic Deep</th>
                  <th className="p-3">V-Sculpt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-[11px] text-neutral-600">
                <tr>
                  <td className="p-3 font-semibold text-neutral-900">Əsas Texnologiya</td>
                  <td className="p-3">7-Rəng LED, EMS</td>
                  <td className="p-3">Ultrases (24kHz)</td>
                  <td className="p-3">EMS Mikroaxın</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-neutral-900">İstifadə Məqsədi</td>
                  <td className="p-3">Ləkə, Qırış, Akne</td>
                  <td className="p-3">Dərin Təmizləmə</td>
                  <td className="p-3">Çənə / Boyun Liftinq</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-neutral-900">Həssas Dəri</td>
                  <td className="p-3">Tam təhlükəsiz</td>
                  <td className="p-3">Həftədə 2 dəfə</td>
                  <td className="p-3">Tam təhlükəsiz</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-neutral-900">Zəmanət</td>
                  <td className="p-3">2 il rəsmi</td>
                  <td className="p-3">2 il rəsmi</td>
                  <td className="p-3">2 il rəsmi</td>
                </tr>
                <tr className="font-bold text-neutral-900">
                  <td className="p-3">Qiymət</td>
                  <td className="p-3">249.00 ₼</td>
                  <td className="p-3">129.00 ₼</td>
                  <td className="p-3">199.00 ₼</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="pt-4 text-center">
            <button
              onClick={() => setActiveModal(null)}
              className="bg-neutral-950 text-white text-[10px] tracking-widest font-semibold uppercase px-6 py-3 hover:bg-neutral-850 cursor-pointer"
            >
              MÜQAYİSƏNİ BAĞLA
            </button>
          </div>
        </div>
      </Modal>

      {/* 3. AI ADVISOR CHATBOT MODAL */}
      <Modal
        isOpen={activeModal === 'prop-3'}
        onClose={() => setActiveModal(null)}
        title="ALUNA VİRTUAL AI ASSİSTENT"
      >
        <div className="flex flex-col h-[50vh] justify-between font-sans">
          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 max-h-[35vh]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={clsx(
                  'max-w-[80%] p-3.5 text-xs leading-relaxed',
                  msg.role === 'assistant'
                    ? 'bg-neutral-50 text-neutral-800 self-start border border-neutral-100'
                    : 'bg-neutral-950 text-white self-end ml-auto'
                )}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Form sender */}
          <form onSubmit={handleSendMessage} className="border-t border-neutral-100 pt-4 flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Sualınızı daxil edin (məs. 'sızanaq üçün nə etməli?')..."
              className="flex-1 bg-neutral-50 border border-neutral-200 px-4 py-3 text-xs focus:outline-none focus:border-neutral-950"
            />
            <button
              type="submit"
              className="bg-neutral-950 text-white px-5 text-xs font-semibold tracking-widest uppercase hover:bg-neutral-850 cursor-pointer"
            >
              GÖNDƏR
            </button>
          </form>
        </div>
      </Modal>

      {/* 4. CANLI CONSULTATION RESERVATION FORM MODAL */}
      <Modal
        isOpen={activeModal === 'prop-4'}
        onClose={() => setActiveModal(null)}
        title="KOSMETOLOQ İLƏ CANLI GÖRÜŞ"
      >
        <div className="space-y-4 font-sans text-xs">
          <p className="text-neutral-500 leading-relaxed">
            Bizim rəsmi tibbi kosmetoloqlarımızla ödənişsiz 15 dəqiqəlik onlayn video konsultasiya sifariş edin. Dərinizin tam analizini edin.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Təşəkkür edirik! Görüşünüz uğurla təyin olundu. Zoom görüş linki e-mailinizə və SMS olaraq mobil nömrənizə göndərildi.');
              setActiveModal(null);
            }}
            className="space-y-4 pt-2"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-[10px] tracking-widest uppercase font-semibold text-neutral-400">GÖRÜŞ TARİXİ</span>
                <input required type="date" className="w-full bg-neutral-50 border border-neutral-200 p-3 text-xs focus:outline-none focus:border-neutral-950 cursor-pointer" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] tracking-widest uppercase font-semibold text-neutral-400">GÖRÜŞ SAATI</span>
                <select required className="w-full bg-neutral-50 border border-neutral-200 p-3 text-xs focus:outline-none focus:border-neutral-950 cursor-pointer">
                  <option>10:00 - 10:15</option>
                  <option>12:00 - 12:15</option>
                  <option>15:00 - 15:15</option>
                  <option>17:00 - 17:15</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <span className="text-[10px] tracking-widest uppercase font-semibold text-neutral-400">ƏLAQƏ E-MAİLİ</span>
              <input required type="email" placeholder="Sizin e-mail ünvanınız" className="w-full bg-neutral-50 border border-neutral-200 p-3 text-xs focus:outline-none focus:border-neutral-950" />
            </div>

            <button
              type="submit"
              className="w-full bg-neutral-950 text-white py-3.5 text-[10px] tracking-widest font-semibold uppercase hover:bg-neutral-850 transition-colors duration-300 cursor-pointer"
            >
              GÖRÜŞ TƏYİN ET (ÖDƏNİŞSİZ)
            </button>
          </form>
        </div>
      </Modal>

    </Section>
  );
}
