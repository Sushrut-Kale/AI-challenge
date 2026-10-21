'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import SectionContainer from '@/components/layout/SectionContainer';
import SectionHeading from '@/components/ui/SectionHeading';
import PixelCard from '@/components/ui/PixelCard';
import PixelBadge from '@/components/ui/PixelBadge';
import { OFFICIAL_DOCUMENTS, EVALUATION_RUBRIC, DocumentItem } from '@/data/event';
import { playMinecraftClick } from '@/components/ui/MinecraftAudioManager';

export default function DocumentsSection() {
  const [expandedRubric, setExpandedRubric] = useState<string | null>(null);

  const openDocumentViewer = (docId: 'rulebook' | 'template', page = 1) => {
    try {
      playMinecraftClick();
    } catch {}
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('agentcraft:open-document-viewer', {
          detail: { docId, page },
        })
      );
    }
  };

  const toggleRubric = (category: string) => {
    try {
      playMinecraftClick();
    } catch {}
    setExpandedRubric((prev) => (prev === category ? null : category));
  };

  return (
    <SectionContainer id="docs" variant="default" showTopSeam>
      <SectionHeading
        tag="OFFICIAL ARCHIVES & ARTIFACTS"
        title="DOCUMENTS & TEMPLATES"
        subtitle="Download or view the official regulatory charter, Round 1 presentation blueprint, and the complete 100-point judging matrix."
      />

      {/* Main Two Documents Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
        {OFFICIAL_DOCUMENTS.map((doc: DocumentItem) => {
          const isRulebook = doc.id === 'rulebook';

          return (
            <PixelCard
              key={doc.id}
              variant={isRulebook ? 'emerald' : 'gold'}
              title={doc.title}
              headerIcon={
                <Image
                  src={doc.itemIcon}
                  alt=""
                  width={28}
                  height={28}
                  className="w-6 h-6 sm:w-7 sm:h-7 object-contain inline-block drop-shadow"
                />
              }
              badge={
                <PixelBadge variant={doc.badgeVariant}>
                  {doc.badge}
                </PixelBadge>
              }
              accentBarColor={isRulebook ? '#10b981' : '#f59e0b'}
              className="h-full flex flex-col justify-between"
            >
              <div>
                {/* Meta details bar */}
                <div className="flex flex-wrap items-center gap-2 mb-3 font-pixel text-[10px] text-amber-300 font-bold">
                  <span>📄 {doc.countLabel}</span>
                  <span className="opacity-40">•</span>
                  <span>💾 {doc.fileSize}</span>
                  <span className="opacity-40">•</span>
                  <span className="text-emerald-400">{doc.version}</span>
                </div>

                <p className="font-terminal text-sm sm:text-base text-neutral-200 leading-relaxed mb-5">
                  {doc.description}
                </p>

                {/* Highlights List */}
                <div className="space-y-2 mb-6 p-3.5 bg-black/40 border border-[#3d2c1c] rounded">
                  <span className="font-pixel text-[8px] sm:text-[9px] text-neutral-400 block uppercase tracking-wider mb-1.5">
                    Included in this artifact:
                  </span>
                  <div className="space-y-1.5 text-xs sm:text-sm font-terminal text-neutral-300">
                    {doc.highlights.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-amber-400 font-pixel text-[8px] mt-0.5 shrink-0">
                          ►
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons: View, Download, Open Tab */}
              <div className="pt-4 border-t border-[#3d2c1c] flex flex-wrap items-center gap-2.5">
                {/* View Button */}
                <button
                  type="button"
                  onClick={() => openDocumentViewer(doc.id as 'rulebook' | 'template')}
                  className={`flex-1 min-w-[130px] px-3.5 py-2.5 font-pixel text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-white border-2 shadow-[inset_2px_2px_0_rgba(255,255,255,0.3),inset_-2px_-2px_0_rgba(0,0,0,0.5)] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 inline-flex items-center justify-center gap-1.5 cursor-pointer ${
                    isRulebook
                      ? 'border-[#065f46] bg-[#059669] hover:bg-[#10b981]'
                      : 'border-[#78350f] bg-[#d97706] hover:bg-[#f59e0b]'
                  }`}
                  data-interactive="true"
                >
                  <span>👁</span>
                  <span>{isRulebook ? 'VIEW RULEBOOK' : 'VIEW 9 SLIDES'}</span>
                </button>

                {/* Direct Download Button */}
                <a
                  href={doc.fileUrl}
                  download={doc.fileName}
                  onClick={() => {
                    try {
                      playMinecraftClick();
                    } catch {}
                  }}
                  className="flex-1 min-w-[130px] px-3.5 py-2.5 font-pixel text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-[#1a1206] bg-[#fbbf24] hover:bg-[#f59e0b] border-2 border-[#7a4f05] shadow-[inset_2px_2px_0_rgba(255,255,255,0.4),inset_-2px_-2px_0_rgba(0,0,0,0.4)] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  data-interactive="true"
                  title={`Download ${doc.fileName}`}
                >
                  <span>⬇</span>
                  <span>DOWNLOAD ({doc.fileSize})</span>
                </a>

                {/* New Tab Button */}
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2.5 font-pixel text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-neutral-300 bg-[#1e293b] hover:bg-[#334155] border-2 border-[#0f172a] shadow-[inset_2px_2px_0_rgba(255,255,255,0.2),inset_-2px_-2px_0_rgba(0,0,0,0.4)] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 inline-flex items-center justify-center gap-1 cursor-pointer"
                  data-interactive="true"
                  title="Open file in new tab"
                >
                  <span>↗</span>
                </a>
              </div>
            </PixelCard>
          );
        })}
      </div>

      {/* Official 100-Point Judging Matrix (Section 11) */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="text-center mb-8">
          <span className="font-pixel text-[10px] sm:text-xs text-amber-400 tracking-widest uppercase mb-2 inline-flex items-center gap-1.5 font-bold">
            <span>⚖</span> Section 11 of the Official Rulebook
          </span>
          <h3 className="font-pixel text-xl sm:text-3xl text-white tracking-wide uppercase mb-3">
            OFFICIAL 100-POINT JUDGING RUBRIC
          </h3>
          <p className="font-terminal text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            All teams are scored out of 100 against published engineering, autonomy, reliability, and SDG impact criteria. Ranked separately within Stream A (FY) and Stream B (Senior).
          </p>
        </div>

        {/* 6 Rubric Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {EVALUATION_RUBRIC.map((item) => {
            const isExpanded = expandedRubric === item.category;

            return (
              <div
                key={item.category}
                onClick={() => toggleRubric(item.category)}
                className="mc-stone-frame p-4 sm:p-5 flex flex-col justify-between transition-all hover:border-amber-400/80 cursor-pointer select-none bg-[#120f0d]/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
                data-interactive="true"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className="font-pixel text-sm sm:text-base font-bold"
                      style={{ color: item.accentColor }}
                    >
                      {item.points} POINTS
                    </span>
                    <span className="font-pixel text-[9px] text-neutral-400 uppercase">
                      {isExpanded ? '▲ LESS' : '▼ DETAILS'}
                    </span>
                  </div>

                  <h4 className="font-pixel text-xs sm:text-sm text-white mb-2 uppercase leading-snug">
                    {item.category}
                  </h4>

                  <p className="font-terminal text-xs sm:text-sm text-neutral-300 leading-relaxed mb-3">
                    {item.description}
                  </p>
                </div>

                {/* Collapsible specific rubric items */}
                {isExpanded && (
                  <div className="pt-3 border-t border-[#3d2c1c] space-y-1.5 font-terminal text-xs text-neutral-300 animate-in fade-in duration-200">
                    <span className="font-pixel text-[8px] text-amber-400 block uppercase">
                      Judges evaluate:
                    </span>
                    {item.rubricItems.map((r, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-pixel text-[8px] mt-0.5 shrink-0">
                          ✓
                        </span>
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Submission Reminder Callout Banner */}
      <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-[#160c06] border-2 border-[#ea580c] shadow-[0_0_25px_rgba(234,88,12,0.3)] relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <span className="text-2xl sm:text-3xl shrink-0">⏰</span>
          <div>
            <h4 className="font-pixel text-xs sm:text-sm text-amber-300 uppercase mb-1 font-bold">
              Round 1 Submission Due: 2nd November 2026
            </h4>
            <p className="font-terminal text-xs sm:text-sm text-neutral-200 leading-relaxed">
              Teams must download the official 9-slide PowerPoint template above, populate their multi-agent solution architecture, and submit it along with their runnable code demo.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => openDocumentViewer('template', 1)}
          className="shrink-0 px-4 py-2 border-2 border-[#78350f] bg-[#fbbf24] hover:bg-[#f59e0b] font-pixel text-[9px] sm:text-[10px] uppercase font-bold text-[#1a1206] shadow-[inset_2px_2px_0_rgba(255,255,255,0.4),inset_-2px_-2px_0_rgba(0,0,0,0.4)] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer"
          data-interactive="true"
        >
          VIEW TEMPLATE ➔
        </button>
      </div>
    </SectionContainer>
  );
}
