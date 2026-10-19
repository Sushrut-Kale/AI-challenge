'use client';

import React from 'react';
import SectionContainer from '@/components/layout/SectionContainer';
import SectionHeading from '@/components/ui/SectionHeading';
import PixelCard from '@/components/ui/PixelCard';
import PixelBadge from '@/components/ui/PixelBadge';
import { EVENT_DATA } from '@/data/event';

export default function TracksSection() {
  const { rounds } = EVENT_DATA;

  return (
    <SectionContainer id="rounds" variant="grid" showTopSeam>
      <SectionHeading
        tag="COMPETITION FORMAT & SDGS"
        title="2 COMPETITION ROUNDS"
        subtitle="AGENTCRAFT evaluates multi-agent architectures across two rigorous stages — screening online, followed by an offline grand finale on campus."
      />

      {/* The 2 Official Rounds from Poster */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
        {rounds.map((round) => {
          const isFinal = round.roundNumber === 2;

          return (
            <PixelCard
              key={round.roundNumber}
              variant={isFinal ? 'emerald' : 'stone'}
              title={round.name}
              headerIcon={isFinal ? '🏆' : '💻'}
              badge={
                <PixelBadge variant={isFinal ? 'gold' : 'diamond'}>
                  {isFinal ? 'OFFLINE FINAL' : 'ONLINE SCREENING'}
                </PixelBadge>
              }
              accentBarColor={isFinal ? '#10B981' : '#38BDF8'}
              className="h-full flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-3 font-pixel text-[9px] text-amber-300">
                  <span>📅 {round.date}</span>
                  <span className="opacity-40">•</span>
                  <span>{round.format}</span>
                </div>

                <p className="font-sans text-sm text-neutral-300 leading-relaxed mb-6">
                  {round.description}
                </p>

                {/* Deliverables Checklist */}
                <div className="space-y-2 mb-6">
                  <span className="font-pixel text-[8px] text-neutral-400 block uppercase">
                    Mandatory Submission Items
                  </span>
                  <div className="space-y-1.5 text-xs font-sans text-neutral-300">
                    {round.deliverables.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-2 bg-black/40 border border-neutral-800"
                      >
                        <span className="text-emerald-400">✓</span> {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between font-pixel text-[8px] text-neutral-400">
                <span>ROUND #{round.roundNumber}</span>
                <span className={isFinal ? 'text-amber-400' : 'text-sky-400'}>
                  {round.format}
                </span>
              </div>
            </PixelCard>
          );
        })}
      </div>

      {/* Sustainable Development Goals Theme Notice */}
      <div className="max-w-4xl mx-auto p-6 bg-[#121622] border-2 border-emerald-600/50 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="w-14 h-14 shrink-0 border-2 border-emerald-500 bg-[#0d261e] flex items-center justify-center text-3xl shadow-[0_0_16px_rgba(16,185,129,0.4)]">
            🌍
          </div>
          <div>
            <span className="font-pixel text-[9px] text-emerald-400 uppercase tracking-widest block mb-1">
              SDG PROBLEM STATEMENTS FOCUS
            </span>
            <h4 className="font-pixel text-xs sm:text-sm text-white mb-2">
              For Sustainable Development Goals
            </h4>
            <p className="font-sans text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Teams are invited to build autonomous agentic solutions tackling the UN Sustainable Development Goals — including Affordable & Clean Energy (SDG 7), Industry, Innovation & Infrastructure (SDG 9), Sustainable Cities & Communities (SDG 11), and Climate Action (SDG 13). Detailed problem statement templates and evaluation rubrics will be shared with registered teams via the official community desk.
            </p>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
