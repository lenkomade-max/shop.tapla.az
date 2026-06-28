'use client';

import React, { useState } from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Accordion } from '@/components/ui/Accordion';
import { FAQ as FAQType } from '@/types';
import { Search, PhoneCall, Mail, MessageSquare } from 'lucide-react';

interface FAQProps {
  faqs: FAQType[];
}

export function FAQ({ faqs }: FAQProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Section id="faq" py="lg">
      <Container>
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12 sm:mb-16">
          <span className="text-[10px] tracking-[0.25em] font-bold text-neutral-400 uppercase">
            MÜŞTƏRİ XİDMƏTLƏRİ
          </span>
          <Heading level={2} align="center" className="font-serif">
            TEZ-TEZ VERİLƏN SUALLAR
          </Heading>
          <p className="text-xs sm:text-sm text-neutral-500 font-sans max-w-lg mx-auto leading-relaxed">
            TAPLA MARKETPLACE-də çatdırılma, zəmanət, qaytarma və ödəniş qaydaları haqqında bütün sualların cavabları.
          </p>
        </div>

        {/* Dynamic FAQ Search Bar */}
        <div className="max-w-xl mx-auto mb-12 relative font-sans">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Mövzu və ya açar söz daxil edin (məs. 'Zəmanət')..."
            className="w-full bg-neutral-50 border border-neutral-200 text-xs px-5 py-4 focus:outline-none focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 pl-12"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        </div>

        {/* Accordion Feed */}
        <div className="max-w-3xl mx-auto mb-16 sm:mb-24">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 text-xs text-neutral-400 font-sans border border-neutral-100 p-8">
              Axtarışınıza uyğun sual tapılmadı. Zəhmət olmasa digər açar sözlərlə yenidən cəhd edin.
            </div>
          ) : (
            <Accordion
              items={filteredFaqs.map((f) => ({
                id: f.id,
                question: f.question,
                answer: f.answer,
              }))}
            />
          )}
        </div>

        {/* Still Have Questions? Value Card */}
        <div className="bg-neutral-950 text-white p-8 md:p-12 text-center relative overflow-hidden max-w-4xl mx-auto border border-neutral-900 font-sans">
          {/* Subtle abstract background accent circles */}
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-amber-200/5 blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <div className="space-y-2">
              <span className="text-[9px] tracking-[0.25em] font-bold text-amber-200 uppercase">
                CANLI ƏLAQƏ
              </span>
              <h3 className="text-lg sm:text-xl md:text-2xl font-serif font-light tracking-wide uppercase text-white">
                SUALINIZA CAVAB TAPMADINIZ?
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed max-w-md mx-auto">
                Bizim mehriban dəstək komandamız hər bir sualınızı cavablandırmaq və sizə kömək etmək üçün buradadır.
              </p>
            </div>

            {/* Quick Contact Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <a
                href="https://wa.me/994551234567"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-neutral-900 border border-neutral-800 p-4 hover:border-white transition-all duration-300 flex flex-col items-center space-y-2 group"
              >
                <MessageSquare className="h-5 w-5 text-emerald-500 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-[10px] tracking-widest uppercase font-semibold">WHATSAPP ÇAT</span>
                <span className="text-[9px] text-neutral-500 font-sans">+994702453060</span>
              </a>

              <a
                href="tel:994551234567"
                className="bg-neutral-900 border border-neutral-800 p-4 hover:border-white transition-all duration-300 flex flex-col items-center space-y-2 group"
              >
                <PhoneCall className="h-5 w-5 text-amber-200 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-[10px] tracking-widest uppercase font-semibold">ZƏNG EDİN</span>
                <span className="text-[9px] text-neutral-500 font-sans">09:00 - 21:00 (Hər gün)</span>
              </a>

              <a
                href="mailto:support@tapla.az"
                className="bg-neutral-900 border border-neutral-800 p-4 hover:border-white transition-all duration-300 flex flex-col items-center space-y-2 group"
              >
                <Mail className="h-5 w-5 text-neutral-400 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-[10px] tracking-widest uppercase font-semibold">E-MAİL YAZIN</span>
                <span className="text-[9px] text-neutral-500 font-sans">support@tapla.az</span>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
