'use client';

import React, { useState } from 'react';
import { Globe, ExternalLink, CirclePlay, ShieldCheck, HelpCircle } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import Link from 'next/link';

export function Footer() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [promoCheckbox, setPromoCheckbox] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail('');
        setFirstName('');
        setLastName('');
        setPhone('');
      }, 3000);
    }
  };

  return (
    <footer className="bg-neutral-950 text-white pt-16 pb-8 border-t border-neutral-900 font-sans">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-neutral-900">

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h5 className="text-[11px] font-semibold tracking-widest uppercase text-white">TAPLA HAQQINDA</h5>
              <ul className="space-y-2.5 text-xs text-neutral-400">
                <li><Link href="/" className="hover:text-white transition-colors">Ana Səhifə</Link></li>
                <li><Link href="/products" className="hover:text-white transition-colors">Bütün Məhsullar</Link></li>
                <li><Link href="#benefits" className="hover:text-white transition-colors">Niyə TAPLA?</Link></li>
                <li><Link href="#faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="#about" className="hover:text-white transition-colors">Karyera</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h5 className="text-[11px] font-semibold tracking-widest uppercase text-white">ŞƏXSİ KABİNET</h5>
              <ul className="space-y-2.5 text-xs text-neutral-400">
                <li><Link href="#" className="hover:text-white transition-colors">Şəxsi Kabinet</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Sifarişlərim</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">İstək Siyahısı</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Hədiyyə Balansı</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h5 className="text-[11px] font-semibold tracking-widest uppercase text-white">KÖMƏK & DƏSTƏK</h5>
              <ul className="space-y-2.5 text-xs text-neutral-400">
                <li><Link href="#faq" className="hover:text-white transition-colors">Tez-tez Verilən Suallar</Link></li>
                <li><Link href="#faq" className="hover:text-white transition-colors">Çatdırılma və Ödəniş</Link></li>
                <li><Link href="#faq" className="hover:text-white transition-colors">2 İllik Zəmanət</Link></li>
                <li><Link href="/qaytarma-siyaseti" className="hover:text-white transition-colors">Qaytarılma Siyasəti</Link></li>
                <li><Link href="#about" className="hover:text-white transition-colors">Dəstək Mərkəzi</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h5 className="text-[11px] font-semibold tracking-widest uppercase text-white">ƏLAQƏ & SATIŞ</h5>
              <ul className="space-y-2.5 text-xs text-neutral-400">
                <li className="font-semibold text-white">+994702453060</li>
                <li className="text-neutral-500 text-[10px]">Dəstək saatı: 09:00 - 21:00 (Hər gün)</li>
                <li><a href="mailto:support@tapla.az" className="hover:text-white transition-colors">support@tapla.az</a></li>
                <li><Link href="#faq" className="hover:text-white transition-colors">Texniki Dəstək</Link></li>
                <li><Link href="#about" className="hover:text-white transition-colors">Rəsdi Mağazalar</Link></li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <h5 className="text-xs sm:text-sm font-light tracking-[0.25em] text-white uppercase font-serif">TAPLA-YA QOŞULUN</h5>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                İlk alış-verişinizdə <strong className="text-white">endirim</strong> və yalnız üzvlərə özəl kampaniyalar haqqında ilk siz xəbərdar olun.
              </p>
            </div>

            {submitted ? (
              <div className="bg-neutral-900 border border-neutral-800 p-5 text-center space-y-2">
                <ShieldCheck className="h-8 w-8 text-amber-200 mx-auto" />
                <h6 className="text-xs font-semibold tracking-widest uppercase text-white">TƏŞƏKKÜR EDİRİK!</h6>
                <p className="text-[11px] text-neutral-400 font-sans">TAPLA Market klubuna üzvlüyünüz uğurla təsdiqləndi. Endirim kuponunuz e-mailinizə göndərildi.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="ADINIZ"
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white focus:outline-none focus:ring-1 focus:ring-white px-4 py-3 text-xs tracking-wide text-white uppercase placeholder-neutral-500"
                  />
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="SOYADINIZ"
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white focus:outline-none focus:ring-1 focus:ring-white px-4 py-3 text-xs tracking-wide text-white uppercase placeholder-neutral-500"
                  />
                </div>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-MAİL ÜNVANINIZ *"
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-white focus:outline-none focus:ring-1 focus:ring-white px-4 py-3 text-xs tracking-wide text-white uppercase placeholder-neutral-500"
                />

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="MOBİL NÖMRƏNİZ (MƏS: 0551234567)"
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-white focus:outline-none focus:ring-1 focus:ring-white px-4 py-3 text-xs tracking-wide text-white uppercase placeholder-neutral-500"
                />

                <div className="flex items-start space-x-2.5 pt-1.5">
                  <input
                    type="checkbox"
                    id="promo-updates"
                    required
                    checked={promoCheckbox}
                    onChange={(e) => setPromoCheckbox(e.target.checked)}
                    className="mt-1 h-3.5 w-3.5 bg-neutral-900 border-neutral-800 text-neutral-950 focus:ring-neutral-800 rounded accent-white cursor-pointer"
                  />
                  <label htmlFor="promo-updates" className="text-[10px] text-neutral-400 leading-normal font-sans cursor-pointer">
                    Mən TAPLA MARKETPLACE haqqında xəbərləri, xüsusi promo-kodları və yenilikləri e-mail və SMS vasitəsilə almağa razıyam.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-white text-neutral-950 hover:bg-neutral-200 transition-colors duration-300 py-3.5 text-xs font-semibold tracking-widest uppercase cursor-pointer"
                >
                  KLUBUMUZA QOŞUL
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <a href="#" className="text-neutral-400 hover:text-white transition-colors" aria-label="Instagram">
              <Globe className="h-5 w-5" />
            </a>
            <a href="#" className="text-neutral-400 hover:text-white transition-colors" aria-label="Twitter">
              <Globe className="h-5 w-5" />
            </a>
            <a href="#" className="text-neutral-400 hover:text-white transition-colors" aria-label="Facebook">
              <ExternalLink className="h-5 w-5" />
            </a>
            <a href="#" className="text-neutral-400 hover:text-white transition-colors" aria-label="YouTube">
              <CirclePlay className="h-5 w-5" />
            </a>
          </div>

          <div className="flex items-center space-x-2 text-xs text-neutral-400">
            <span>ÖLKƏ / REGİON:</span>
            <select className="bg-neutral-900 border border-neutral-800 text-white text-xs px-2.5 py-1.5 focus:outline-none cursor-pointer">
              <option value="AZ">AZƏRBAYCAN (AZN ₼)</option>
              <option value="TR">TÜRKİYƏ (TRY ₺)</option>
              <option value="AE">BƏƏ (AED)</option>
              <option value="EN">BƏYƏNLƏŞMİŞ REGİON (USD $)</option>
            </select>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-neutral-900 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-neutral-500">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2">
            <span>&copy; {new Date().getFullYear()} TAPLA TECHNOLOGIES M.M.C. BÜTÜN HÜQUQLAR QORUNUR.</span>
            <Link href="/mexfilik-siyaseti" className="hover:text-white transition-colors">MƏXFİLİK SİYASƏTİ</Link>
            <Link href="/istifade-sertleri" className="hover:text-white transition-colors">İSTİFADƏ ŞƏRTLƏRİ</Link>
            <Link href="/kuki-siyaseti" className="hover:text-white transition-colors">KUKİ Siyasəti</Link>
          </div>

          <div className="flex items-center space-x-1.5 text-[9px] text-neutral-600">
            <span>Premium Azerbaijani Electronics Marketplace. Powered by Tapla Platform.</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
