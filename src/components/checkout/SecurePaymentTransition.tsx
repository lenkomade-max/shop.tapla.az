'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface SecurePaymentTransitionProps {
  redirectUrl: string;
}

// ── Mini particles ───────────────────────────────────────────────────
const dots = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  x: 15 + Math.random() * 70,
  delay: Math.random() * 1.5,
}));

export default function SecurePaymentTransition({ redirectUrl }: SecurePaymentTransitionProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = redirectUrl;
    }, 2500);
    return () => clearTimeout(timer);
  }, [redirectUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="relative bg-white border border-neutral-200 shadow-sm overflow-hidden"
    >
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {dots.map((d) => (
          <motion.div
            key={d.id}
            className="absolute rounded-full bg-emerald-500/30"
            style={{ width: 3, height: 3, left: `${d.x}%`, bottom: -4 }}
            animate={{ y: [0, -80, -160], opacity: [0, 0.6, 0] }}
            transition={{ duration: 2, delay: d.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <div className="relative z-10 p-5 sm:p-6 space-y-5 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex justify-center"
        >
          <div className="bg-white rounded-xl px-5 py-3 shadow-sm border border-neutral-100">
            <Image
              src="/images/pashabank-logo.svg"
              alt="PASHA Bank"
              width={110}
              height={30}
              className="h-8 w-auto"
              priority
            />
          </div>
        </motion.div>

        {/* Shield checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          className="flex justify-center"
        >
          <motion.div
            animate={{ boxShadow: ['0 0 0 rgba(5,150,105,0)', '0 0 20px rgba(5,150,105,0.3)', '0 0 0 rgba(5,150,105,0)'] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center"
          >
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <motion.path
                d="M5 13l4 4L19 7"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              />
            </svg>
          </motion.div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="space-y-1"
        >
          <p className="text-xs font-bold tracking-widest uppercase text-neutral-900">
            Təhlükəsiz ödənişə yönləndirilirsiniz
          </p>
          <p className="text-[10px] text-neutral-500 font-sans">
            PASHA Bank · 128-bit SSL şifrələmə
          </p>
        </motion.div>

        {/* Progress bar */}
        <div className="max-w-[220px] mx-auto w-full">
          <div className="h-1 bg-neutral-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, delay: 0.4, ease: 'easeInOut' }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #059669, #10b981, #34d399)' }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
