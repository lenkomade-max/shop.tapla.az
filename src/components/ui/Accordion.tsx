'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { clsx } from 'clsx';

interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  dark?: boolean;
}

export function Accordion({ items, className, dark = false }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={clsx('w-full border-t', dark ? 'border-neutral-800' : 'border-neutral-200', className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className={clsx(
              'border-b transition-all duration-300',
              dark ? 'border-neutral-800' : 'border-neutral-200',
              isOpen && (dark ? 'bg-neutral-900/40' : 'bg-neutral-50/50')
            )}
          >
            <button
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between py-5 px-4 sm:px-6 text-left transition-colors cursor-pointer"
              aria-expanded={isOpen}
            >
              <span
                className={clsx(
                  'text-sm font-medium tracking-wide uppercase',
                  dark ? 'text-white' : 'text-neutral-900'
                )}
              >
                {item.question}
              </span>
              <span className={clsx('ml-4 p-1 rounded-full transition-colors', dark ? 'text-neutral-400' : 'text-neutral-500')}>
                {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div
                    className={clsx(
                      'px-4 sm:px-6 pb-6 pt-1 text-xs sm:text-sm leading-relaxed font-sans',
                      dark ? 'text-neutral-300' : 'text-neutral-600'
                    )}
                  >
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
