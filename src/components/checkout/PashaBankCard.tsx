'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

// ── Floating particles ──────────────────────────────────────────────
const particles = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 2,
  size: 3 + Math.random() * 4,
  duration: 2 + Math.random() * 2,
}));

function FloatingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            bottom: '-8px',
            background: 'radial-gradient(circle, #10b981, #059669)',
            boxShadow: '0 0 6px rgba(16, 185, 129, 0.5)',
          }}
          animate={{
            y: [0, -120, -240],
            opacity: [0, 0.8, 0],
            scale: [0.6, 1.2, 0.4],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// ── Contactless icon waves ───────────────────────────────────────────
function ContactlessWaves() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <motion.path
        d="M6 12C6 8.5 7.5 5.5 10 3.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.path
        d="M9 12C9 9.5 10 7.5 11.5 6"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
      />
      <motion.path
        d="M12 12C12 11 12.5 10 13.5 9"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
      />
    </svg>
  );
}

// ── Card component ───────────────────────────────────────────────────
export default function PashaBankCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative overflow-hidden"
    >
      <FloatingParticles />

      <div className="relative z-10 p-5 sm:p-6 space-y-5">
        {/* ── Top: Logo + badge ─────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image
              src="/images/pashabank-logo.svg"
              alt="PASHA Bank"
              width={100}
              height={28}
              className="h-7 w-auto"
              priority
            />
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-50/60 border border-emerald-200/60 rounded-full px-3 py-1">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999L10 1.154l7.834 3.845A1 1 0 0118.5 5.9v4.962a9 9 0 01-5.367 8.232l-2.766 1.155a1 1 0 01-.734 0l-2.766-1.155A9 9 0 011.5 10.862V5.9a1 1 0 01.666-.901zM10 3.146L3.5 6.257V10.76a7 7 0 004.174 6.403l2.326.97 2.326-.97a7 7 0 004.174-6.403V6.257L10 3.146zM13.707 8.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </motion.div>
            <span className="text-[8px] font-bold text-emerald-700 tracking-widest uppercase">PASHA Bank Acquiring</span>
          </div>
        </div>

        {/* ── Center: Animated credit card ──────────────────────── */}
        <motion.div
          className="relative mx-auto max-w-[280px] aspect-[1.586/1] rounded-xl p-4 flex flex-col justify-between overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0a1628 0%, #0f2240 40%, #162d54 100%)',
            boxShadow: '0 8px 32px rgba(10, 22, 40, 0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
          animate={{
            rotateY: [-2, 2, -2],
            rotateX: [-1, 1, -1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Card texture lines */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 4px)',
            }}
          />

          {/* Card top row: chip + contactless */}
          <div className="relative z-10 flex items-center justify-between">
            {/* Gold chip */}
            <motion.div
              className="w-10 h-8 rounded-md"
              style={{
                background: 'linear-gradient(135deg, #c9a84c, #f0d878, #c9a84c)',
                boxShadow: '0 0 12px rgba(201, 168, 76, 0.4)',
              }}
              animate={{
                boxShadow: [
                  '0 0 12px rgba(201, 168, 76, 0.4)',
                  '0 0 20px rgba(201, 168, 76, 0.7)',
                  '0 0 12px rgba(201, 168, 76, 0.4)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="w-full h-full rounded-md border border-[#b8942e]/40 flex items-center justify-center">
                <div className="w-5 h-3 rounded-sm bg-gradient-to-b from-[#e8c84a] to-[#b8942e]" />
              </div>
            </motion.div>

            {/* Contactless icon */}
            <ContactlessWaves />
          </div>

          {/* Card number */}
          <div className="relative z-10 flex items-center gap-1.5">
            {['4','5','3','2','•','•','•','•','•','•','•','•','7','8','9','1'].map((char, i) => (
              <motion.span
                key={i}
                className="text-[10px] font-mono font-bold text-white/90 tracking-[0.15em]"
                initial={{ opacity: 0 }}
                animate={{ opacity: char === '•' ? [0.3, 0.6, 0.3] : 1 }}
                transition={{
                  delay: i * 0.06,
                  duration: char === '•' ? 2 : 0.2,
                  repeat: char === '•' ? Infinity : 0,
                  ease: 'easeInOut',
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* Card bottom row: bank name + expiry */}
          <div className="relative z-10 flex items-end justify-between">
            <span className="text-[8px] font-bold text-white/60 tracking-[0.2em] uppercase">PASHA Bank</span>
            <div className="text-right">
              <span className="text-[6px] text-white/40 tracking-wider uppercase block">Valid thru</span>
              <span className="text-[9px] font-mono text-white/80 tracking-wider">12/28</span>
            </div>
          </div>

          {/* Card shine effect */}
          <motion.div
            className="absolute inset-0 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)',
              backgroundSize: '200% 200%',
            }}
            animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>

        {/* ── Bottom: Secure text + SSL ─────────────────────────── */}
        <div className="text-center space-y-2">
          <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-800">
            Təhlükəsiz onlayn ödəniş
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[9px] text-neutral-500 font-sans">
            <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999L10 1.154l7.834 3.845A1 1 0 0118.5 5.9v4.962a9 9 0 01-5.367 8.232l-2.766 1.155a1 1 0 01-.734 0l-2.766-1.155A9 9 0 011.5 10.862V5.9a1 1 0 01.666-.901zM10 3.146L3.5 6.257V10.76a7 7 0 004.174 6.403l2.326.97 2.326-.97a7 7 0 004.174-6.403V6.257L10 3.146z" clipRule="evenodd" />
            </svg>
            <span>128-bit SSL şifrələmə • PCI DSS uyğunluğu</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
