'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { clsx } from 'clsx';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'right' | 'left';
  width?: 'sm' | 'md' | 'lg' | 'full';
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  width = 'md',
}: DrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const widthClasses = {
    sm: 'max-w-xs',
    md: 'max-w-md',
    lg: 'max-w-lg',
    full: 'max-w-full',
  };

  const slideVariants = {
    hidden: { x: position === 'right' ? '100%' : '-100%' },
    visible: { x: 0 },
    exit: { x: position === 'right' ? '100%' : '-100%' },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex overflow-hidden font-sans">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-950 backdrop-blur-xs cursor-pointer"
          />

          <motion.div
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className={clsx(
              'absolute top-0 bottom-0 flex flex-col w-full bg-white shadow-2xl h-full outline-hidden',
              position === 'right' ? 'right-0' : 'left-0',
              widthClasses[width]
            )}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
              {title ? (
                <h3 className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-neutral-900">
                  {title}
                </h3>
              ) : (
                <div />
              )}
              <button
                onClick={onClose}
                className="p-1 text-neutral-400 hover:text-neutral-900 transition-colors rounded-full hover:bg-neutral-50 cursor-pointer"
                aria-label="Bağla"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
