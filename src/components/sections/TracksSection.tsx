'use client';

import React from 'react';
import Image from 'next/image';
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
      </div>

      {/* Sustainable Development Goals Theme Section — Stacked One Below the Other */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="font-pixel text-[10px] sm:text-[11px] text-emerald-400 uppercase tracking-widest block mb-2 font-bold">
            UNITED NATIONS INITIATIVE
          </span>
          <h3 className="font-pixel text-base sm:text-xl text-white mb-3">
            SDG PROBLEM STATEMENT TRACKS
          </h3>
          <p className="font-sans text-xs sm:text-sm text-neutral-200 max-w-2xl mx-auto leading-relaxed">
            Teams must align their autonomous multi-agent AI system with one of the following official United Nations Sustainable Development Goals. Evaluation rubrics reward real-world deployability and social impact.
          </p>
        </div>

        {/* The 4 SDGs stacked ONE BELOW THE OTHER */}
        <div className="flex flex-col gap-4">
          {/* SDG 7 */}
          <div className="p-5 sm:p-6 bg-[#16120e] border-2 border-[#d97706]/70 shadow-[0_6px_20px_rgba(0,0,0,0.6)] hover:border-amber-400 transition-colors">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 shrink-0 border-2 border-amber-500 bg-[#2b190a] flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.35)]">
                  <Image
                    src="/assets/items/redstone.png"
                    alt="Redstone Dust"
                    width={36}
                    height={36}
                    className="w-8 h-8 object-contain drop-shadow"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <PixelBadge variant="gold">SDG 07</PixelBadge>
                    <span className="font-pixel text-[9px] text-amber-300 uppercase font-bold">Clean Energy</span>
                  </div>
                  <h4 className="font-pixel text-xs sm:text-sm text-white mb-2 font-bold">
                    Affordable & Clean Energy
                  </h4>
                  <p className="font-sans text-xs sm:text-sm text-neutral-200 leading-relaxed font-medium">
                    Build autonomous agent architectures for smart micro-grid balancing, renewable energy forecasting, battery load optimization, and decentralized energy distribution.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SDG 9 */}
          <div className="p-5 sm:p-6 bg-[#16120e] border-2 border-[#ea580c]/70 shadow-[0_6px_20px_rgba(0,0,0,0.6)] hover:border-orange-400 transition-colors">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 shrink-0 border-2 border-orange-500 bg-[#2d1206] flex items-center justify-center shadow-[0_0_12px_rgba(234,88,12,0.35)]">
                  <Image
                    src="/assets/items/iron_pickaxe.png"
                    alt="Iron Pickaxe"
                    width={36}
                    height={36}
                    className="w-8 h-8 object-contain drop-shadow"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <PixelBadge variant="dirt">SDG 09</PixelBadge>
                    <span className="font-pixel text-[9px] text-orange-300 uppercase font-bold">Infrastructure</span>
                  </div>
                  <h4 className="font-pixel text-xs sm:text-sm text-white mb-2 font-bold">
                    Industry, Innovation & Infrastructure
                  </h4>
                  <p className="font-sans text-xs sm:text-sm text-neutral-200 leading-relaxed font-medium">
                    Develop multi-agent networks for predictive factory maintenance, sustainable supply-chain self-healing, automated bridge/structure inspection, and circular manufacturing.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SDG 11 */}
          <div className="p-5 sm:p-6 bg-[#16120e] border-2 border-[#10b981]/70 shadow-[0_6px_20px_rgba(0,0,0,0.6)] hover:border-emerald-400 transition-colors">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 shrink-0 border-2 border-emerald-500 bg-[#0d2618] flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.35)]">
                  <Image
                    src="/assets/items/compass.png"
                    alt="Compass"
                    width={36}
                    height={36}
                    className="w-8 h-8 object-contain drop-shadow"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <PixelBadge variant="emerald">SDG 11</PixelBadge>
                    <span className="font-pixel text-[9px] text-emerald-300 uppercase font-bold">Smart Communities</span>
                  </div>
                  <h4 className="font-pixel text-xs sm:text-sm text-white mb-2 font-bold">
                    Sustainable Cities & Communities
                  </h4>
                  <p className="font-sans text-xs sm:text-sm text-neutral-200 leading-relaxed font-medium">
                    Orchestrate cooperative agent fleets for decentralized municipal traffic regulation, emergency response coordination, dynamic waste routing, and urban air quality monitoring.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SDG 13 */}
          <div className="p-5 sm:p-6 bg-[#16120e] border-2 border-[#06b6d4]/70 shadow-[0_6px_20px_rgba(0,0,0,0.6)] hover:border-cyan-400 transition-colors">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 shrink-0 border-2 border-cyan-500 bg-[#07242a] flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.35)]">
                  <Image
                    src="/assets/items/ender_eye.png"
                    alt="Eye of Ender"
                    width={36}
                    height={36}
                    className="w-8 h-8 object-contain drop-shadow"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <PixelBadge variant="diamond">SDG 13</PixelBadge>
                    <span className="font-pixel text-[9px] text-cyan-300 uppercase font-bold">Climate Action</span>
                  </div>
                  <h4 className="font-pixel text-xs sm:text-sm text-white mb-2 font-bold">
                    Climate Action
                  </h4>
                  <p className="font-sans text-xs sm:text-sm text-neutral-200 leading-relaxed font-medium">
                    Deploy reflective reasoning agents for wildfire telemetry monitoring, automated carbon footprint verification, flood simulation, and ecosystem restoration planning.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed templates notice */}
        <div className="mt-6 p-4 bg-[#1a1510] border border-amber-900/60 rounded text-center">
          <p className="font-sans text-xs sm:text-sm text-amber-200/90 leading-relaxed">
            Detailed problem statement templates, dataset packages, and evaluation rubrics are shared with registered teams via the official <strong className="text-white">WhatsApp Community</strong>.
          </p>
        </div>
      </div>
    </SectionContainer>
  );
}
