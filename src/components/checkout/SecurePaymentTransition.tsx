'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface SecurePaymentTransitionProps {
  redirectUrl: string;
}

export default function SecurePaymentTransition({ redirectUrl }: SecurePaymentTransitionProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = redirectUrl;
    }, 2500);
    return () => clearTimeout(timer);
  }, [redirectUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-white border border-neutral-100 p-6 sm:p-8 space-y-6 text-center shadow-sm"
    >
      {/* Logo + Shield */}
      <div className="relative inline-flex items-center justify-center">
        {/* Pulsing shield rings */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: [0, 0.15, 0], scale: [0.6, 1.4, 1.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', times: [0, 0.5, 1] }}
          className="absolute inset-0 rounded-full bg-emerald-500"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 0.1, 0], scale: [0.5, 1.2, 1.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', times: [0, 0.5, 1], delay: 0.4 }}
          className="absolute inset-0 rounded-full bg-emerald-400"
        />

        {/* Logo container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative z-10 bg-white rounded-2xl p-4 shadow-lg shadow-neutral-200/50"
        >
          <Image
            src="/images/pashabank-logo.svg"
            alt="PASHA Bank"
            width={140}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </motion.div>

        {/* Animated shield checkmark */}
        <motion.div
          initial={{ opacity: 0, rotate: -90, scale: 0 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          className="absolute -top-1 -right-1 z-20"
        >
          <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.circle
              cx="12" cy="12" r="11"
              fill="#059669"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            />
            <motion.path
              d="M7 12.5L10.5 16L17 9"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            />
          </svg>
        </motion.div>
      </div>

      {/* Text: redirecting message */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
        className="space-y-1.5"
      >
        <p className="text-xs sm:text-sm font-bold tracking-widest uppercase text-neutral-900">
          Təhlükəsiz ödənişə yönləndirilirsiniz
        </p>
        <p className="text-[10px] text-neutral-500 font-sans leading-relaxed max-w-xs mx-auto">
          PASHA Bank tərəfindən qorunan təhlükəsiz ödəniş səhifəsinə keçid edilir
        </p>
      </motion.div>

      {/* Progress bar */}
      <div className="max-w-[200px] mx-auto w-full space-y-1.5">
        <div className="h-1 bg-neutral-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.8, delay: 0.6, ease: 'easeInOut' }}
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #059669, #10b981, #34d399)',
            }}
          />
        </div>
        {/* SSL badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="flex items-center justify-center space-x-1.5"
        >
          <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M2.166 4.999L10 1.154l7.834 3.845A1 1 0 0118.5 5.9v4.962a9 9 0 01-5.367 8.232l-2.766 1.155a1 1 0 01-.734 0l-2.766-1.155A9 9 0 011.5 10.862V5.9a1 1 0 01.666-.901zM10 3.146L3.5 6.257V10.76a7 7 0 004.174 6.403l2.326.97 2.326-.97a7 7 0 004.174-6.403V6.257L10 3.146zM13.707 8.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-[9px] font-bold text-neutral-400 tracking-widest uppercase">
            PASHA Bank Acquiring · 128-bit SSL
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
