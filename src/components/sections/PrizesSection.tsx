'use client';

import React from 'react';
import SectionContainer from '@/components/layout/SectionContainer';
import SectionHeading from '@/components/ui/SectionHeading';
import PixelCard from '@/components/ui/PixelCard';
import PixelBadge from '@/components/ui/PixelBadge';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { EVENT_DATA } from '@/data/event';

export default function PrizesSection() {
  const { prizes } = EVENT_DATA;

  return (
    <SectionContainer id="prizes" variant="alt" showTopSeam>
      <SectionHeading
        tag="REWARDS & CAREER ACCELERATION"
        title="PRIZE POOL & PERKS"
        subtitle="Compete for the championship prize pool and career-defining internship opportunities."
      />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Main Grand Trophy Showcase Card */}
        <div className="p-6 sm:p-10 border-4 border-[#3a2816] bg-[#1a1208] shadow-[0_16px_36px_rgba(0,0,0,0.85)] relative overflow-hidden text-center">
          {/* Subtle gold inner border */}
          <div className="pointer-events-none absolute inset-1.5 border-2 border-[#543b22]" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Minecraft Trophy Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 border-2 border-[#d97706] bg-[#2e1d0c] flex items-center justify-center text-4xl sm:text-5xl shadow-[inset_3px_3px_0_#fbbf24,0_8px_20px_rgba(245,158,11,0.3)]">
              🏆
            </div>

            <PixelBadge variant="gold" className="mb-3">
              OFFICIAL CHAMPIONSHIP POOL
            </PixelBadge>

            <h3 className="font-pixel text-xs sm:text-sm text-neutral-300 uppercase tracking-widest mb-2">
              TOTAL PRIZE POOL
            </h3>

            {/* Animated Counter for ₹30,000 */}
            <div className="font-pixel text-3xl sm:text-5xl md:text-6xl text-amber-300 tracking-wider mb-4 drop-shadow-[0_4px_16px_rgba(251,191,36,0.4)]">
              <AnimatedCounter
                value={prizes.totalPoolAmount}
                prefix="₹"
                suffix="/-"
              />
            </div>

            {/* Verified Poster Highlight: Winners Get Internship Opportunities */}
            <div className="mt-2 mb-6 px-5 py-3 bg-[#11261a] border-2 border-emerald-500/80 shadow-[0_0_16px_rgba(16,185,129,0.25)] flex items-center gap-3">
              <span className="text-2xl">💼</span>
              <div className="text-left">
                <span className="font-pixel text-xs text-emerald-300 uppercase block">
                  WINNERS GET INTERNSHIP OPPORTUNITIES *
                </span>
                <span className="text-xs text-emerald-200/90 font-sans block mt-0.5">
                  Exclusive fast-track internship pathways with partner AI companies
                </span>
              </div>
            </div>

            <p className="text-xs text-amber-200/80 font-sans max-w-lg leading-relaxed">
              {prizes.note}
            </p>
          </div>
        </div>

        {/* Breakdown of Verified Accolades */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <PixelCard variant="emerald" title="Cash Rewards" headerIcon="💰">
            <p className="font-sans text-xs text-emerald-100 leading-relaxed">
              Share of the official ₹30,000 prize pool awarded to top-performing teams across evaluation tracks.
            </p>
          </PixelCard>

          <PixelCard variant="stone" title="Internship Pathways" headerIcon="🚀">
            <p className="font-sans text-xs text-neutral-300 leading-relaxed">
              Direct technical evaluation by sponsor partner leaders for coveted AI engineering internships.
            </p>
          </PixelCard>

          <PixelCard variant="wood" title="Certificates & Glory" headerIcon="📜">
            <p className="font-sans text-xs text-amber-100 leading-relaxed">
              Official Certificates of Excellence authorized by AAAI Global Professional Chapter and MIT AOE.
            </p>
          </PixelCard>
        </div>
      </div>
    </SectionContainer>
  );
}
