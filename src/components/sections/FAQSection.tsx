'use client';

import React, { useState } from 'react';
import SectionContainer from '@/components/layout/SectionContainer';
import SectionHeading from '@/components/ui/SectionHeading';
import { EVENT_DATA } from '@/data/event';

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  const { faqs } = EVENT_DATA;

  return (
    <SectionContainer id="faqs" variant="alt" showTopSeam>
      <SectionHeading
        tag="CLARIFICATIONS & BRIEFING"
        title="FREQUENTLY ASKED QUESTIONS"
        subtitle="Verified details on registration, evaluation tracks, round formats, and team parameters."
      />

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;

          return (
            <div
              key={idx}
              className={`border-2 transition-colors ${
                isOpen
                  ? 'border-emerald-500/80 bg-[#142318]'
                  : 'border-[#382b1d] bg-[#16120e] hover:border-[#543b22]'
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-pixel text-xs sm:text-sm text-white select-none outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                data-interactive="true"
              >
                <span className="flex items-center gap-3">
                  {/* Minecraft Redstone Lamp Indicator (Section Effect) */}
                  <span
                    className={`w-4 h-4 shrink-0 border-2 transition-all duration-200 flex items-center justify-center ${
                      isOpen
                        ? 'bg-[#fbbf24] border-[#d97706] shadow-[0_0_10px_#f59e0b]'
                        : 'bg-[#2b140d] border-[#4a2215]'
                    }`}
                    title={isOpen ? 'Redstone Lamp: ON' : 'Redstone Lamp: OFF'}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-[#78350f]' : 'bg-[#180a06]'}`} />
                  </span>
                  <span className="text-emerald-400 font-pixel text-xs shrink-0 font-bold">
                    Q{idx + 1}.
                  </span>
                  <span className="text-white font-medium">{faq.question}</span>
                </span>
                <span
                  className={`shrink-0 font-pixel text-xs text-emerald-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                >
                  ▼
                </span>
              </button>

              {isOpen && (
                <div className="px-4 pb-5 sm:px-5 sm:pb-5 pt-2 text-sm sm:text-base font-sans text-neutral-100 leading-relaxed border-t border-white/10 animate-in fade-in zoom-in-95 duration-150">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </SectionContainer>
  );
}
