'use client';

import React from 'react';
import Image from 'next/image';
import SectionContainer from '@/components/layout/SectionContainer';
import SectionHeading from '@/components/ui/SectionHeading';
import PixelCard from '@/components/ui/PixelCard';
import PixelBadge from '@/components/ui/PixelBadge';
import { EVENT_DATA } from '@/data/event';

export default function TracksSection() {
  const { rounds, challenge } = EVENT_DATA;
  const { sdgTracks } = challenge;

  return (
    <SectionContainer id="rounds" variant="grid" showTopSeam>
      <SectionHeading
        tag="COMPETITION FORMAT & SDGS"
        title="2 COMPETITION ROUNDS"
        subtitle="AGENTCRAFT evaluates multi-agent architectures across two rigorous stages — screening online, followed by an offline grand finale on campus."
      />

      {/* The 2 Official Rounds from Poster */}
      <div className="relative max-w-5xl mx-auto mb-16">
        {/* Live Redstone Circuit Line (Section Effect) */}
        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-red-700 via-amber-400 to-red-700 animate-redstone-pulse z-10" />

        {/* Animated Redstone Connector Badge (Desktop) */}
        <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 items-center gap-1.5 px-3 py-1 bg-[#160c06] border-2 border-[#ea580c] shadow-[0_0_14px_rgba(234,88,12,0.5)] pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-ping inline-block" />
          <span className="font-pixel text-[8px] text-amber-300 uppercase tracking-wider">
            ADVANCE ➔
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {rounds.map((round) => {
          const isFinal = round.roundNumber === 2;

          return (
            <PixelCard
              key={round.roundNumber}
              variant={isFinal ? 'emerald' : 'stone'}
              title={round.name}
              headerIcon={
                <Image
                  src={isFinal ? '/assets/items/golden_apple.png' : '/assets/items/book_quill.png'}
                  alt=""
                  width={28}
                  height={28}
                  className="w-6 h-6 sm:w-7 sm:h-7 object-contain inline-block drop-shadow"
                />
              }
              badge={
                <PixelBadge variant={isFinal ? 'gold' : 'diamond'}>
                  {isFinal ? 'OFFLINE FINAL' : 'ONLINE SCREENING'}
                </PixelBadge>
              }
              accentBarColor={isFinal ? '#10B981' : '#38BDF8'}
              className="h-full flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-3 font-pixel text-[10px] text-amber-300 font-bold">
                  <span>📅 {round.date}</span>
                  <span className="opacity-40">•</span>
                  <span>{round.format}</span>
                </div>

                <p className="font-terminal text-base text-neutral-300 leading-relaxed mb-6">
                  {round.description}
                </p>

                {/* Deliverables Checklist */}
                <div className="space-y-2 mb-6">
                  <span className="font-pixel text-[8px] text-neutral-400 block uppercase">
                    Mandatory Submission Items
                  </span>
                  <div className="space-y-1.5 text-sm font-terminal text-neutral-300">
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
      </div>

      {/* Sustainable Development Goals Theme Section — Stacked One Below the Other */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="font-pixel text-[10px] sm:text-[11px] text-emerald-400 uppercase tracking-widest block mb-2 font-bold">
            UNITED NATIONS INITIATIVE
          </span>
          <h3 className="font-pixel text-base sm:text-xl text-white mb-3">
            7 OFFICIAL CHALLENGE TRACKS
          </h3>
          <p className="font-terminal text-sm sm:text-base text-neutral-200 max-w-2xl mx-auto leading-relaxed">
            Teams can align their autonomous multi-agent AI system with one of our seven official United Nations Sustainable Development Goal challenge tracks. Evaluation rubrics reward real-world deployability, multi-agent reasoning, and social impact.
          </p>
        </div>

        {/* Horizontal Wooden Support Beam with Hanging Chains (Ref: Image 1) */}
        <div className="relative mb-2 px-6">
          <div className="mc-wood-beam h-5 w-full rounded-sm flex items-center justify-between px-8 relative z-20">
            <span className="w-2.5 h-2.5 bg-[#1f1006] rounded-full border border-[#8b5d32] shadow-inner" />
            <span className="w-2.5 h-2.5 bg-[#1f1006] rounded-full border border-[#8b5d32] shadow-inner" />
          </div>
          {/* Top Hanging Chains */}
          <div className="flex justify-between px-16 -mt-1 relative z-10 pointer-events-none">
            <div className="mc-chain-link" />
            <div className="mc-chain-link" />
          </div>
        </div>

        {/* The Hanging Oak Wood Signs Stacked Vertically with Connecting Chains */}
        <div className="flex flex-col items-center">
          {sdgTracks.map((track, index) => (
            <React.Fragment key={track.id}>
              {/* Connecting Chains between signs */}
              {index > 0 && (
                <div className="flex justify-between w-full px-16 -my-1 relative z-20 pointer-events-none">
                  <div className="mc-chain-link" />
                  <div className="mc-chain-link" />
                </div>
              )}

              {/* Oak Wood Sign for Track */}
              <div className="w-full mc-oak-sign p-5 sm:p-6 shadow-[0_10px_28px_rgba(0,0,0,0.7)] hover:scale-[1.01] transition-transform">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 w-full">
                    <div className="w-12 h-12 shrink-0 border-2 border-[#7a4e23] bg-[#916538] flex items-center justify-center shadow-[inset_2px_2px_0_#4a2e12,inset_-2px_-2px_0_#deb689]">
                      <Image
                        src={track.icon}
                        alt={track.iconAlt}
                        width={36}
                        height={36}
                        className="w-8 h-8 object-contain drop-shadow"
                      />
                    </div>
                    <div className="w-full">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                          className="px-2 py-0.5 border text-white font-pixel text-[9px] uppercase font-bold shadow-[inset_1px_1px_0_rgba(255,255,255,0.2)]"
                          style={{
                            backgroundColor: track.badgeBg,
                            borderColor: track.borderColor || '#3d1f05',
                            color: track.badgeTextColor || '#ffe6a3',
                          }}
                        >
                          {track.sdgNumber}
                        </span>
                        <span className="font-pixel text-[9px] text-[#5c3008] uppercase font-bold tracking-wide">
                          {track.sdgTitle}
                        </span>
                      </div>
                      <h4
                        className="font-pixel text-xs sm:text-sm text-[#2b1708] mb-2 font-bold tracking-wide"
                        style={{ textShadow: '1px 1px 0 #ebd0af' }}
                      >
                        {track.name}
                      </h4>
                      {/* Colored Divider Line */}
                      <div
                        className={`h-0.5 w-full bg-gradient-to-r ${track.dividerGradient} mb-2 shadow-[0_1px_0_rgba(255,255,255,0.4)]`}
                      />
                      <p className="font-terminal text-sm sm:text-base text-[#261406] leading-relaxed font-semibold">
                        {track.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Detailed templates notice */}
        <div className="mt-6 p-4 bg-[#1a1510] border border-amber-900/60 rounded text-center">
          <p className="font-terminal text-sm sm:text-base text-amber-200/90 leading-relaxed">
            Detailed problem statement templates, dataset packages, and evaluation rubrics are shared with registered teams via the official <strong className="text-white">WhatsApp Community</strong>.
          </p>
        </div>
      </div>
    </SectionContainer>
  );
}
