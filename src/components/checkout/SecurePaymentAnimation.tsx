"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Smartphone,
  Globe,
  CheckCircle2,
  Fingerprint,
  ShieldAlert,
} from "lucide-react";

interface Props {
  isRedirecting?: boolean;
  redirectUrl?: string;
}

export default function SecurePaymentAnimation({
  isRedirecting = false,
  redirectUrl = "https://www.pashabank.az",
}: Props) {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const steps = [
    {
      title: "1. Ödəniş Seçimi",
      subtitle: "PASHA Bank seçilir",
      description: "Müştəri veb-saytda rəsmi PASHA Bank ödəniş üsulunu seçir.",
      details: "Sistem ilkin təhlükəsizlik bağlantısı qurmağa hazırlaşır.",
    },
    {
      title: "2. Şifrələnmiş Sorğu",
      subtitle: "Təhlükəsiz şifrələmə",
      description: "Sayt ödəniş sorğusunu yüksək TLS 1.3 şifrələməsi ilə birbaşa banka göndərir.",
      details: "Üçüncü tərəflər məlumatları görə və ya ələ keçirə bilməzlər.",
    },
    {
      title: "3. Rəsmi Keçid",
      subtitle: "Bank mühitinə giriş",
      description: "Müştəri rəsmi, qorunan PASHA Bank ödəniş səhifəsinə yönləndirilir.",
      details: "Bütün kart məlumatları yalnız rəsmi bank infrastrukturu daxilində emal olunur.",
    },
    {
      title: "4. Təsdiq Gözlənilir",
      subtitle: "Maliyyəniz qorunur",
      description: "Kart məlumatları daxil edildikdə belə vəsait dərhal çıxılmır, mobil təsdiq gözlənilir.",
      details: "Mobil tətbiqinizdə təsdiq etmədən heç bir vəsait silinə bilməz!",
    },
    {
      title: "5. Mobil Təsdiq",
      subtitle: "Sizdən asılı olan nəzarət",
      description: "PASHA Bank mobil tətbiqinizə rəsmi təhlükəsiz ödəniş bildirişi (3D Secure) gəlir.",
      details: "Biometrik (FaceID/Fingerprint) və ya PİN kodunuzla ödənişi təsdiqləyirsiniz.",
    },
    {
      title: "6. Avtorizasiya",
      subtitle: "Bank təsdiqi",
      description: "Yalnız sizin rəsmi mobil təsdiqinizdən sonra PASHA Bank tranzaksiyaya icazə verir.",
      details: "Hər bir əməliyyat unikal kriptoqrafik imza ilə təmin olunur.",
    },
    {
      title: "7. Sayta Geri Dönüş",
      subtitle: "Təhlükəsiz geri qayıdış",
      description: "Uğurlu ödəniş statusu ilə birlikdə müştəri təhlükəsiz şəkildə veb-sayta geri yönləndirilir.",
      details: "Sinxronizasiya tam qorunmuş kanal vasitəsilə başa çatır.",
    },
    {
      title: "8. Tamamlandı",
      subtitle: "Ödəniş uğurludur!",
      description: "Sifariş təsdiqləndi. PASHA Bank hər addımda vəsaitlərinizi tam qorudu.",
      details: "Təhlükəsiz, şəffaf və 100% sığortalanmış fintech təcrübəsi.",
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev === steps.length - 1 ? 0 : prev + 1));
    }, 1600);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="w-full flex flex-col items-center justify-center py-4 px-0 sm:px-2 bg-transparent font-sans">
      <div className="relative w-full aspect-[16/10] max-h-[320px] sm:max-h-none bg-slate-50/70 border border-emerald-200 rounded-2xl overflow-hidden p-3 sm:p-6 flex flex-col justify-between shadow-sm">

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        {/* Ambient glow */}
        <motion.div
          animate={{ opacity: [0.15, 0.25, 0.15], scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 rounded-full filter blur-[60px] pointer-events-none bg-gradient-to-tr from-teal-200 to-emerald-200"
        />

        {/* Header */}
        <div className="relative z-10 flex justify-between items-center w-full text-[9px] sm:text-[10px] font-mono text-slate-400 border-b border-slate-200/50 pb-1.5 sm:pb-2">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-ping" />
            <span className="hidden sm:inline">PASHA BANK AKTİV VERİFİKASİYA MODELİ</span>
            <span className="sm:hidden">PASHA BANK</span>
          </div>
          <span className="font-bold text-teal-600">FAZA {currentStep + 1}/8</span>
        </div>

        {/* Nodes */}
        <div className="relative z-10 my-auto w-full grid grid-cols-3 gap-1 sm:gap-2 items-center justify-center py-2 sm:py-4">
          {/* Website */}
          <div className="flex flex-col items-center text-center">
            <motion.div
              animate={{
                scale: (currentStep === 0 || currentStep === 1 || currentStep === 7) ? 1.1 : 0.95,
                borderColor: (currentStep === 0 || currentStep === 1 || currentStep === 7) ? "#14b8a6" : "#e2e8f0",
              }}
              className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-white border-2 flex items-center justify-center shadow-sm relative"
            >
              <Globe className={`w-5 h-5 sm:w-6 sm:h-6 ${(currentStep === 0 || currentStep === 1 || currentStep === 7) ? "text-teal-600" : "text-slate-400"}`} />
              {(currentStep === 0 || currentStep === 7) && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-teal-500 rounded-full animate-ping" />
              )}
            </motion.div>
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-700 mt-1 sm:mt-2">TAPLA</span>
            <span className="text-[8px] sm:text-[9px] text-slate-400 font-mono">Mağaza</span>
          </div>

          {/* Bank */}
          <div className="flex flex-col items-center text-center">
            <motion.div
              animate={{
                scale: (currentStep === 2 || currentStep === 3 || currentStep === 5 || currentStep === 6) ? 1.18 : 0.95,
                borderColor: (currentStep >= 2 && currentStep <= 6) ? "#d97706" : "#e2e8f0",
              }}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-3xl bg-white border-2 flex items-center justify-center shadow-md relative z-10"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className={`absolute inset-0.5 rounded-[22px] border border-dashed pointer-events-none ${currentStep >= 2 && currentStep <= 6 ? "border-amber-500/50" : "border-slate-200"}`}
              />
              <ShieldCheck className={`w-6 h-6 sm:w-8 sm:h-8 ${currentStep >= 2 && currentStep <= 6 ? "text-amber-600" : "text-slate-400"}`} />
            </motion.div>
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-800 mt-1 sm:mt-2">PASHA Bank</span>
            <span className="text-[7px] sm:text-[9px] text-amber-600 font-semibold font-mono">ÖDƏNİŞ ŞLÜZÜ</span>
          </div>

          {/* Mobile */}
          <div className="flex flex-col items-center text-center">
            <motion.div
              animate={{
                scale: (currentStep === 4 || currentStep === 5) ? 1.1 : 0.95,
                borderColor: (currentStep === 4 || currentStep === 5) ? "#f43f5e" : "#e2e8f0",
              }}
              className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-white border-2 flex items-center justify-center shadow-sm relative"
            >
              <Smartphone className={`w-5 h-5 sm:w-6 sm:h-6 ${(currentStep === 4 || currentStep === 5) ? "text-rose-600" : "text-slate-400"}`} />
              <AnimatePresence>
                {(currentStep === 4 || currentStep === 5) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-rose-50 rounded-[14px] flex items-center justify-center"
                  >
                    <Fingerprint className="w-5 h-5 sm:w-7 sm:h-7 text-rose-500 animate-pulse" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-700 mt-1 sm:mt-2">Bank Tətbiqi</span>
            <span className="text-[7px] sm:text-[9px] text-rose-500 font-bold font-mono">TƏSDİQ ET</span>
          </div>

          {/* Flow paths */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-6 sm:-translate-y-8 h-10 pointer-events-none z-0">
            <svg className="w-full h-full" viewBox="0 0 400 40" preserveAspectRatio="xMidYMid meet">
              <path d="M 60,20 L 145,20" stroke="#cbd5e1" strokeWidth="2" fill="none" />
              {currentStep === 1 && (
                <motion.circle r="4" fill="#14b8a6" animate={{ cx: [60, 145] }} transition={{ duration: 0.45, repeat: Infinity, ease: "easeInOut" }} />
              )}
              <path d="M 255,20 L 340,20" stroke="#cbd5e1" strokeWidth="2" fill="none" />
              {currentStep === 3 && (
                <motion.circle r="4" fill="#f59e0b" animate={{ cx: [255, 340] }} transition={{ duration: 0.45, repeat: Infinity, ease: "easeInOut" }} />
              )}
              {currentStep === 5 && (
                <motion.circle r="4" fill="#f43f5e" animate={{ cx: [340, 255] }} transition={{ duration: 0.45, repeat: Infinity, ease: "easeInOut" }} />
              )}
              {currentStep === 6 && (
                <motion.circle r="4" fill="#0d9488" animate={{ cx: [145, 60] }} transition={{ duration: 0.45, repeat: Infinity, ease: "easeInOut" }} />
              )}
            </svg>
          </div>
        </div>

        {/* Alert panel */}
        <AnimatePresence mode="wait">
          {currentStep === 3 || currentStep === 4 ? (
            <motion.div key="safety" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="bg-amber-50 border border-amber-200 rounded-xl p-2 sm:p-3 flex items-start gap-1.5 sm:gap-2.5 relative z-10">
              <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[10px] sm:text-[11px] font-bold text-amber-900 uppercase tracking-wide">Ən Kritik Mühafizə Addımı</h4>
                <p className="text-[9px] sm:text-[10px] text-amber-800 leading-relaxed font-medium">
                  PASHA Bank mobil tətbiqinizdə ödənişi təsdiq etməyincə kartınızdan <strong className="underline">heç bir vəsait çıxıla bilməz</strong>.
                </p>
              </div>
            </motion.div>
          ) : currentStep === 7 ? (
            <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-emerald-50 border border-emerald-100 rounded-xl p-2 sm:p-3 flex items-center gap-1.5 sm:gap-2 relative z-10">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
              <div>
                <h4 className="text-[10px] sm:text-[11px] font-bold text-emerald-900 uppercase tracking-wide">Tranzaksiya Tamamlandı</h4>
                <p className="text-[9px] sm:text-[10px] text-emerald-800 font-medium">Uğurlu təsdiqdən sonra sifarişiniz rəsmiləşdirildi.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div key="info" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-slate-100/50 border border-slate-200/40 rounded-xl p-2 sm:p-3 flex items-start gap-1.5 sm:gap-2.5 relative z-10">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[10px] sm:text-[11px] font-bold text-slate-700 uppercase tracking-wide">Necə işləyir?</h4>
                <p className="text-[9px] sm:text-[10px] text-slate-500 leading-relaxed">
                  Ödəniş birbaşa PASHA Bank-ın rəsmi serverində, sizin mobil təsdiqiniz sayəsində 100% təhlükəsiz şəkildə həyata keçirilir.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step info */}
        <div className="relative z-10 mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-slate-200/50 flex flex-col gap-0.5 sm:gap-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-1">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-800">{steps[currentStep].title}</span>
            <span className="text-[9px] sm:text-[10px] font-medium text-teal-600 uppercase font-mono">{steps[currentStep].subtitle}</span>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-600 font-sans leading-relaxed">{steps[currentStep].description}</p>
          <p className="text-[9px] sm:text-[10px] text-slate-400 italic leading-relaxed">{steps[currentStep].details}</p>
        </div>
      </div>
    </div>
  );
}
