'use client';

import React from 'react';
import SectionContainer from '@/components/layout/SectionContainer';
import SectionHeading from '@/components/ui/SectionHeading';
import PixelCard from '@/components/ui/PixelCard';
import PixelBadge from '@/components/ui/PixelBadge';
import { EVENT_DATA } from '@/data/event';

export default function RulesSection() {
  const { details } = EVENT_DATA;

  return (
    <SectionContainer id="rules" variant="default" showTopSeam>
      {/* Nether Arena Rules Frame (Ref: Image 2) */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="text-center mb-6">
          <span className="font-pixel text-[10px] sm:text-xs text-[#f87171] tracking-widest uppercase mb-2 inline-flex items-center gap-1.5 font-bold">
            <span className="text-[#ef4444]">►</span> The Laws of the Arena
          </span>
          <h2
            className="font-pixel text-2xl sm:text-4xl text-[#ff4545] tracking-wide uppercase mb-3"
            style={{
              textShadow: '0 0 20px rgba(239,68,68,0.8), 3px 3px 0 #1f0b06',
            }}
          >
            RULES OF ENGAGEMENT
          </h2>
          <p className="font-terminal text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Verified team parameters, evaluation streams, and submission standards from the official AGENTCRAFT briefing.
          </p>
        </div>

        {/* Authentic Minecraft Nether Stone Arena Frame */}
        <div className="mc-arena-frame p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative overflow-hidden">
          {/* Obsidian Corner Accents */}
          <div className="pointer-events-none absolute top-1.5 left-1.5 w-3 h-3 bg-[#3b1c10] border border-[#ef4444]/40" />
          <div className="pointer-events-none absolute top-1.5 right-1.5 w-3 h-3 bg-[#3b1c10] border border-[#ef4444]/40" />
          <div className="pointer-events-none absolute bottom-1.5 left-1.5 w-3 h-3 bg-[#3b1c10] border border-[#ef4444]/40" />
          <div className="pointer-events-none absolute bottom-1.5 right-1.5 w-3 h-3 bg-[#3b1c10] border border-[#ef4444]/40" />

          {/* Numbered Rules List (Ref: Image 2) */}
          <div className="space-y-6 sm:space-y-7 relative z-10 mb-8 border-b-2 border-[#3b1c10] pb-8">
            <div className="flex items-start gap-4 sm:gap-6">
              <span
                className="font-pixel text-base sm:text-xl text-[#ef4444] shrink-0 font-bold tracking-tight"
                style={{ textShadow: '0 0 10px rgba(239,68,68,0.6)' }}
              >
                01.
              </span>
              <div>
                <h4 className="font-pixel text-xs sm:text-sm text-white mb-1 uppercase font-bold">
                  Teams of {details.teamSize} Players Only
                </h4>
                <p className="font-terminal text-sm sm:text-base text-neutral-200 leading-relaxed font-medium">
                  {details.teamSize} + {details.mentorAllowed}. Interdisciplinary combinations across engineering branches welcome.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 sm:gap-6">
              <span
                className="font-pixel text-base sm:text-xl text-[#ef4444] shrink-0 font-bold tracking-tight"
                style={{ textShadow: '0 0 10px rgba(239,68,68,0.6)' }}
              >
                02.
              </span>
              <div>
                <h4 className="font-pixel text-xs sm:text-sm text-white mb-1 uppercase font-bold">
                  2-Stage Challenge Structure
                </h4>
                <p className="font-terminal text-sm sm:text-base text-neutral-200 leading-relaxed font-medium">
                  Round 1 online screening presentation & demo; Round 2 in-person prototype presentation on campus at {details.venue}.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 sm:gap-6">
              <span
                className="font-pixel text-base sm:text-xl text-[#ef4444] shrink-0 font-bold tracking-tight"
                style={{ textShadow: '0 0 10px rgba(239,68,68,0.6)' }}
              >
                03.
              </span>
              <div>
                <h4 className="font-pixel text-xs sm:text-sm text-white mb-1 uppercase font-bold">
                  Open-Source Libraries & APIs Allowed
                </h4>
                <p className="font-terminal text-sm sm:text-base text-neutral-200 leading-relaxed font-medium">
                  Python, LangGraph, AutoGen, CrewAI, LlamaIndex, or custom agent runtime loops are permitted. Pre-built proprietary projects are disqualified.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 sm:gap-6">
              <span
                className="font-pixel text-base sm:text-xl text-[#ef4444] shrink-0 font-bold tracking-tight"
                style={{ textShadow: '0 0 10px rgba(239,68,68,0.6)' }}
              >
                04.
              </span>
              <div>
                <h4 className="font-pixel text-xs sm:text-sm text-white mb-1 uppercase font-bold">
                  Registration Parameters
                </h4>
                <p className="font-terminal text-sm sm:text-base text-neutral-200 leading-relaxed font-medium">
                  Single nominal fee of <strong className="text-emerald-400 font-pixel text-xs">{details.registrationFee}</strong> covering screening and offline finale access.
                </p>
              </div>
            </div>
          </div>

          {/* Two Dedicated Evaluation Tracks Inside Arena Frame */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <PixelBadge variant="gold">EVALUATION TRACKS</PixelBadge>
              <span className="font-pixel text-[10px] text-amber-300 uppercase font-bold">Fair Evaluation Matrix</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* FY Stream */}
              <div className="p-4 bg-[#111e16] border-2 border-emerald-500/70 shadow-[inset_2px_2px_0_#052e16]">
                <PixelBadge variant="emerald" className="mb-2">
                  TRACK A
                </PixelBadge>
                <h4 className="font-pixel text-xs text-white uppercase mb-2">
                  FY (Separate Evaluation)
                </h4>
                <p className="font-terminal text-sm sm:text-base text-emerald-200/90 leading-relaxed">
                  First Year innovators compete in their own dedicated bracket, evaluated on
                  conceptual understanding, creativity, and foundational agentic logic.
                </p>
              </div>

              {/* SY, TY & Open to All Stream */}
              <div className="p-4 bg-[#161310] border-2 border-sky-500/70 shadow-[inset_2px_2px_0_#082f49]">
                <PixelBadge variant="diamond" className="mb-2">
                  TRACK B
                </PixelBadge>
                <h4 className="font-pixel text-xs sm:text-sm text-white uppercase mb-2">
                  SY, TY & Open to All Stream
                </h4>
                <p className="font-terminal text-sm sm:text-base text-sky-200/90 leading-relaxed font-medium">
                  Developers across SY, TY & Open to All tracks are evaluated on architectural rigor, multi-agent tool loops,
                  autonomous error recovery, and benchmark performance on SDG domains.
                </p>
              </div>
            </div>

            {/* Official Downloads & Interactive Reader Banner */}
            <div className="mt-6 p-4 sm:p-5 bg-[#0f0e0d] border-2 border-[#523c28] rounded flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[inset_0_2px_6px_rgba(0,0,0,0.8)]">
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl shrink-0">📜</span>
                <div>
                  <h4 className="font-pixel text-xs sm:text-sm text-amber-300 uppercase mb-0.5 font-bold">
                    Official Rulebook & Round 1 PPT Template Available
                  </h4>
                  <p className="font-terminal text-xs sm:text-sm text-neutral-300">
                    Access the complete 14-page regulatory charter, 8 SDG challenge tracks, 100-pt rubric, and official 9-slide deck.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(
                        new CustomEvent('agentcraft:open-document-viewer', {
                          detail: { docId: 'rulebook', page: 1 },
                        })
                      );
                    }
                  }}
                  className="flex-1 sm:flex-initial px-3.5 py-2 border-2 border-[#065f46] bg-[#059669] hover:bg-[#10b981] font-pixel text-[8px] sm:text-[9px] uppercase font-bold text-white shadow-[inset_2px_2px_0_rgba(255,255,255,0.3),inset_-2px_-2px_0_rgba(0,0,0,0.5)] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 inline-flex items-center justify-center gap-1 cursor-pointer"
                  data-interactive="true"
                >
                  <span>👁</span>
                  <span>VIEW ONLINE</span>
                </button>

                <a
                  href="/docs/AgentCraft_Official_Rulebook.pdf"
                  download="AgentCraft_Official_Rulebook.pdf"
                  className="flex-1 sm:flex-initial px-3.5 py-2 border-2 border-[#7a4f05] bg-[#fbbf24] hover:bg-[#f59e0b] font-pixel text-[8px] sm:text-[9px] uppercase font-bold text-[#1a1206] shadow-[inset_2px_2px_0_rgba(255,255,255,0.4),inset_-2px_-2px_0_rgba(0,0,0,0.4)] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 inline-flex items-center justify-center gap-1 cursor-pointer"
                  data-interactive="true"
                  title="Download Rulebook (PDF, 2.68 MB)"
                >
                  <span>⬇</span>
                  <span>DOWNLOAD (2.68 MB)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
