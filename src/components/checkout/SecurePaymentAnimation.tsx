"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Lock, 
  Smartphone, 
  Globe, 
  CheckCircle2, 
  ArrowRight, 
  Fingerprint, 
  AlertCircle,
  HelpCircle,
  ShieldAlert,
  Play,
  Pause,
  RotateCcw
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
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Total 8 steps describing the absolute secure flow
  const steps = [
    {
      title: "1. Ödəniş Seçimi",
      subtitle: "PASHA Bank seçilir",
      description: "Müştəri veb-saytda rəsmi PASHA Bank ödəniş üsulunu seçir.",
      details: "Sistem ilkin təhlükəsizlik bağlantısı qurmağa hazırlaşır.",
      color: "from-blue-500 to-teal-500",
    },
    {
      title: "2. Şifrələnmiş Sorğu",
      subtitle: "Təhlükəsiz şifrələmə",
      description: "Sayt ödəniş sorğusunu yüksək TLS 1.3 şifrələməsi ilə birbaşa banka göndərir.",
      details: "Üçüncü tərəflər məlumatları görə və ya ələ keçirə bilməzlər.",
      color: "from-teal-500 to-emerald-500",
    },
    {
      title: "3. Rəsmi Keçid",
      subtitle: "Bank mühitinə giriş",
      description: "Müştəri rəsmi, qorunan PASHA Bank ödəniş səhifəsinə yönləndirilir.",
      details: "Bütün kart məlumatları yalnız rəsmi bank infrastrukturu daxilində emal olunur.",
      color: "from-emerald-500 to-amber-500",
    },
    {
      title: "4. Təsdiq Gözlənilir",
      subtitle: "Maliyyəniz qorunur",
      description: "Kart məlumatları daxil edildikdə belə vəsait dərhal çıxılmır, mobil təsdiq gözlənilir.",
      details: "Mobil tətbiqinizdə təsdiq etmədən heç bir vəsait silinə bilməz!",
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "5. Mobil Təsdiq",
      subtitle: "Sizdən asılı olan nəzarət",
      description: "PASHA Bank mobil tətbiqinizə rəsmi təhlükəsiz ödəniş bildirişi (3D Secure) gəlir.",
      details: "Biometrik (FaceID/Fingerprint) və ya PİN kodunuzla ödənişi təsdiqləyirsiniz.",
      color: "from-orange-500 to-rose-500",
    },
    {
      title: "6. Avtorizasiya",
      subtitle: "Bank təsdiqi",
      description: "Yalnız sizin rəsmi mobil təsdiqinizdən sonra PASHA Bank tranzaksiyaya icazə verir.",
      details: "Hər bir əməliyyat unikal kriptoqrafik imza ilə təmin olunur.",
      color: "from-rose-500 to-violet-500",
    },
    {
      title: "7. Sayta Geri Dönüş",
      subtitle: "Təhlükəsiz geri qayıdış",
      description: "Uğurlu ödəniş statusu ilə birlikdə müştəri təhlükəsiz şəkildə veb-sayta geri yönləndirilir.",
      details: "Sinxronizasiya tam qorunmuş kanal vasitəsilə başa çatır.",
      color: "from-violet-500 to-teal-500",
    },
    {
      title: "8. Tamamlandı",
      subtitle: "Ödəniş uğurludur!",
      description: "Sifariş təsdiqləndi. PASHA Bank hər addımda vəsaitlərinizi tam qorudu.",
      details: "Təhlükəsiz, şəffaf və 100% sığortalanmış fintech təcrübəsi.",
      color: "from-teal-500 to-emerald-500",
    }
  ];

  // Auto-play interval logic
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev === steps.length - 1 ? 0 : prev + 1));
    }, 1600); // 1.6 seconds per story transition for a fast-paced, highly engaging sequence

    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  return (
    <div 
      id="pasha-workflow-storyteller"
      className="w-full flex flex-col items-center justify-center py-6 px-1 sm:px-4 bg-transparent font-sans"
    >
      {/* Visual Workflow Canvas Area */}
      <div className="relative w-full max-w-lg aspect-[16/10] bg-slate-50/70 border border-slate-100 rounded-2xl overflow-hidden p-6 flex flex-col justify-between shadow-sm">
        
        {/* Subtle grid pattern for technical modern layout */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        {/* Ambient glow syncs with step color */}
        <motion.div
          animate={{
            opacity: [0.15, 0.25, 0.15],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full filter blur-[60px] pointer-events-none transition-all duration-1000 bg-gradient-to-tr ${
            currentStep === 0 ? "from-blue-200 to-teal-200" :
            currentStep === 1 ? "from-teal-200 to-emerald-200" :
            currentStep === 2 ? "from-emerald-200 to-amber-200" :
            currentStep === 3 ? "from-amber-200 to-orange-200" :
            currentStep === 4 ? "from-orange-200 to-rose-200" :
            currentStep === 5 ? "from-rose-200 to-violet-200" :
            currentStep === 6 ? "from-violet-200 to-teal-200" :
            "from-teal-200 to-emerald-200"
          }`}
        />

        {/* Header telemetry info bar */}
        <div className="relative z-10 flex justify-between items-center w-full text-[10px] font-mono text-slate-400 border-b border-slate-200/50 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-ping" />
            <span>PASHA BANK AKTİV VERİFİKASİYA MODELİ</span>
          </div>
          <span className="font-bold text-teal-600">FAZA {currentStep + 1} / 8</span>
        </div>

        {/* Storyboard nodes container */}
        <div className="relative z-10 my-auto w-full grid grid-cols-3 gap-2 items-center justify-center py-4">
          
          {/* Node 1: Merchant Website */}
          <div className="flex flex-col items-center text-center relative">
            <motion.div
              animate={{
                scale: (currentStep === 0 || currentStep === 1 || currentStep === 7) ? 1.1 : 0.95,
                borderColor: (currentStep === 0 || currentStep === 1 || currentStep === 7) ? "#14b8a6" : "#e2e8f0",
              }}
              className="w-14 h-14 rounded-2xl bg-white border-2 flex items-center justify-center shadow-sm relative"
            >
              <Globe className={`w-6 h-6 ${(currentStep === 0 || currentStep === 1 || currentStep === 7) ? "text-teal-600" : "text-slate-400"}`} />
              
              {/* Pulse check */}
              {(currentStep === 0 || currentStep === 7) && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-teal-500 rounded-full animate-ping" />
              )}
            </motion.div>
            <span className="text-[10px] font-bold text-slate-700 mt-2 font-display">Ticarətçi Saytı</span>
            <span className="text-[9px] text-slate-400 font-mono">Mağaza</span>
          </div>

          {/* Node 2: PASHA Bank Gateway */}
          <div className="flex flex-col items-center text-center relative">
            <motion.div
              animate={{
                scale: (currentStep === 2 || currentStep === 3 || currentStep === 5 || currentStep === 6) ? 1.18 : 0.95,
                borderColor: (currentStep === 2 || currentStep === 3 || currentStep === 5 || currentStep === 6) ? "#d97706" : "#e2e8f0",
              }}
              className="w-16 h-16 rounded-3xl bg-white border-2 flex items-center justify-center shadow-md relative z-10"
            >
              {/* Rotating glowing border to show bank ecosystem */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className={`absolute inset-0.5 rounded-[22px] border border-dashed pointer-events-none ${
                  (currentStep >= 2 && currentStep <= 6) ? "border-amber-500/50" : "border-slate-200"
                }`}
              />
              <ShieldCheck className={`w-8 h-8 ${(currentStep >= 2 && currentStep <= 6) ? "text-amber-600" : "text-slate-400"}`} />
            </motion.div>
            <span className="text-[10px] font-bold text-slate-800 mt-2 font-display">PASHA Bank</span>
            <span className="text-[9px] text-amber-600 font-semibold font-mono">ÖDƏNİŞ ŞLÜZÜ</span>
          </div>

          {/* Node 3: Mobile Banking App */}
          <div className="flex flex-col items-center text-center relative">
            <motion.div
              animate={{
                scale: (currentStep === 4 || currentStep === 5) ? 1.1 : 0.95,
                borderColor: (currentStep === 4 || currentStep === 5) ? "#f43f5e" : "#e2e8f0",
              }}
              className="w-14 h-14 rounded-2xl bg-white border-2 flex items-center justify-center shadow-sm relative"
            >
              <Smartphone className={`w-6 h-6 ${(currentStep === 4 || currentStep === 5) ? "text-rose-600" : "text-slate-400"}`} />
              
              {/* Glowing Fingerprint during mobile confirmation phase */}
              <AnimatePresence>
                {(currentStep === 4 || currentStep === 5) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-rose-50 rounded-[14px] flex items-center justify-center"
                  >
                    <Fingerprint className="w-7 h-7 text-rose-500 animate-pulse" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <span className="text-[10px] font-bold text-slate-700 mt-2 font-display">Mobil Tətbiq</span>
            <span className="text-[9px] text-rose-500 font-bold font-mono">TƏSDİQ AUDİTİ</span>
          </div>

          {/* FLOWING CONNECTION PATHS (SVG lines dynamically animated) */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-8 h-10 pointer-events-none z-0">
            <svg className="w-full h-full" viewBox="0 0 400 40">
              {/* Path 1: Website to PASHA Bank */}
              <path 
                d="M 60,20 L 145,20" 
                stroke="#cbd5e1" 
                strokeWidth="2" 
                fill="none" 
              />
              
              {/* Flow particles Website -> Bank (Step 1 -> 2) */}
              {currentStep === 1 && (
                <motion.circle
                  r="4"
                  fill="#14b8a6"
                  className="shadow-sm"
                  animate={{
                    cx: [60, 145],
                  }}
                  transition={{
                    duration: 0.45,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}

              {/* Path 2: PASHA Bank to Mobile App */}
              <path 
                d="M 255,20 L 340,20" 
                stroke="#cbd5e1" 
                strokeWidth="2" 
                fill="none" 
              />

              {/* Flow particles Bank -> Mobile (Step 3 -> 4) */}
              {currentStep === 3 && (
                <motion.circle
                  r="4"
                  fill="#f59e0b"
                  animate={{
                    cx: [255, 340],
                  }}
                  transition={{
                    duration: 0.45,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}

              {/* Approved flow back from Mobile -> Bank (Step 5) */}
              {currentStep === 5 && (
                <motion.circle
                  r="4"
                  fill="#f43f5e"
                  animate={{
                    cx: [340, 255],
                  }}
                  transition={{
                    duration: 0.45,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}

              {/* Completed authorization to Website (Step 6 -> 7) */}
              {currentStep === 6 && (
                <motion.circle
                  r="4"
                  fill="#0d9488"
                  animate={{
                    cx: [145, 60],
                  }}
                  transition={{
                    duration: 0.45,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
            </svg>
          </div>

        </div>

        {/* Visual warning that money cannot be charged without app confirmation */}
        <AnimatePresence mode="wait">
          {currentStep === 3 || currentStep === 4 ? (
            <motion.div
              key="safety-alert"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 relative z-10"
            >
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[11px] font-bold text-amber-900 uppercase tracking-wide">
                  Ən Kritik Mühafizə Addımı
                </h4>
                <p className="text-[10px] text-amber-800 leading-relaxed font-medium">
                  PASHA Bank mobil tətbiqinizdə ödənişi təsdiq etməyincə kartınızdan <strong className="underline">heç bir vəsait çıxıla bilməz</strong>. Pulunuz tam qorunur!
                </p>
              </div>
            </motion.div>
          ) : currentStep === 7 ? (
            <motion.div
              key="success-alert"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center gap-2 relative z-10"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <h4 className="text-[11px] font-bold text-emerald-900 uppercase tracking-wide">
                  Tranzaksiya Tamamlandı
                </h4>
                <p className="text-[10px] text-emerald-800 font-medium">
                  Uğurlu təsdiqdən sonra sifarişiniz rəsmiləşdirildi.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="general-info"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-slate-100/50 border border-slate-200/40 rounded-xl p-3 flex items-start gap-2.5 relative z-10"
            >
              <HelpCircle className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                  Necə işləyir?
                </h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Ödəniş birbaşa PASHA Bank-ın rəsmi serverində, sizin mobil təsdiqiniz sayəsində 100% təhlükəsiz şəkildə həyata keçirilir.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Storytelling Information Panel */}
        <div className="relative z-10 mt-3 pt-3 border-t border-slate-200/50 flex flex-col gap-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-[11px] font-bold text-slate-800 font-display">
              {steps[currentStep].title}
            </span>
            <span className="text-[10px] font-medium text-teal-600 uppercase font-mono">
              {steps[currentStep].subtitle}
            </span>
          </div>
          <p className="text-xs text-slate-600 font-sans leading-relaxed">
            {steps[currentStep].description}
          </p>
          <p className="text-[10px] text-slate-400 italic font-medium leading-relaxed">
            {steps[currentStep].details}
          </p>
        </div>

      </div>

      {/* Manual Interactive Controls & Stepper Dots */}
      <div className="w-full max-w-lg mt-4 flex flex-col gap-3">
        
        {/* Progress Stepper Dots */}
        <div className="flex justify-between items-center px-1">
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setCurrentStep(i);
                  setIsPlaying(false);
                }}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentStep === i 
                    ? "w-6 bg-teal-600" 
                    : "w-2 bg-slate-200 hover:bg-slate-300"
                }`}
                aria-label={`Slayd ${i + 1}`}
              />
            ))}
          </div>

          {/* Play/Pause Control Trigger */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 bg-slate-50 border border-slate-200/60 rounded-md px-2.5 py-1 cursor-pointer transition-all"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3 h-3 text-amber-600" />
                  <span>Durdur</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 text-teal-600" />
                  <span>Avto-Play</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentStep(0);
                setIsPlaying(false);
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-50 border border-slate-200/60 rounded-md p-1 cursor-pointer transition-all"
              title="Yenidən başlat"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Beautiful bottom workflow card explanation */}
        <div className="bg-slate-50/50 border border-slate-200/30 rounded-xl p-3.5 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">PASHA Bank Zəmanəti</span>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Bu animasiya rəsmi <strong>3D Secure</strong> və mobil tətbiq təsdiq modelidir. Siz təsdiq etməyincə vəsaitiniz toxunulmazdır.
          </p>
        </div>

      </div>

    </div>
  );
}
