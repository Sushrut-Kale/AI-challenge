'use client';

import React from 'react';
import Image from 'next/image';
import SectionContainer from '@/components/layout/SectionContainer';
import SectionHeading from '@/components/ui/SectionHeading';
import PixelCard from '@/components/ui/PixelCard';
import PixelBadge from '@/components/ui/PixelBadge';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import MiningPrizeVault from '@/components/sections/MiningPrizeVault';
import { EVENT_DATA } from '@/data/event';

export default function PrizesSection() {
  const { prizes } = EVENT_DATA;

  return (
    <SectionContainer id="prizes" variant="alt" showTopSeam>
      <SectionHeading
        tag="REWARDS & CAREER ACCELERATION"
        title="CHAMPIONSHIP REWARDS & PERKS"
        subtitle="Mine the bedrock vault below to reveal the championship rewards, and unlock career-defining internship opportunities."
      />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Main Grand Trophy Showcase Card with Enchanted Foil Effect */}
        <div className="p-6 sm:p-10 pb-12 sm:pb-16 border-4 border-[#3a2816] bg-[#1a1208] shadow-[0_16px_36px_rgba(0,0,0,0.85)] relative overflow-hidden text-center mc-enchanted-foil">
          {/* Subtle gold inner border */}
          <div className="pointer-events-none absolute inset-1.5 border-2 border-[#543b22]" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Minecraft Trophy & Golden Apple Showcase - Floating in sync side-by-side */}
            <div className="flex items-center justify-center gap-4 mb-4 animate-float">
              <div className="w-16 h-16 sm:w-20 sm:h-20 border-3 border-[#d97706] bg-[#2e1d0c] flex items-center justify-center shadow-[inset_3px_3px_0_#fbbf24,0_8px_20px_rgba(245,158,11,0.3)]">
                <Image
                  src="/assets/items/golden_apple.png"
                  alt="Enchanted Golden Apple"
                  width={56}
                  height={56}
                  className="w-12 h-12 sm:w-14 sm:h-14 object-contain filter drop-shadow-[0_4px_8px_rgba(251,191,36,0.5)]"
                />
              </div>

              <div className="w-16 h-16 sm:w-20 sm:h-20 border-3 border-[#d97706] bg-[#2e1d0c] flex items-center justify-center text-4xl sm:text-5xl shadow-[inset_3px_3px_0_#fbbf24,0_8px_20px_rgba(245,158,11,0.3)]">
                🏆
              </div>
            </div>

            {/* Interactive Mining Block Vault covering Prize Pool */}
            <MiningPrizeVault totalPoolAmount={prizes.totalPoolAmount} />

            {/* Verified Poster Highlight: Winners Get Internship Opportunities */}
            <div className="mt-3 mb-5 px-4 sm:px-6 py-3.5 bg-[#11261a] border-2 border-emerald-500/80 shadow-[0_0_16px_rgba(16,185,129,0.25)] flex items-center gap-3.5 rounded max-w-xl w-full mx-auto text-left">
              <div className="w-10 h-10 shrink-0 border border-emerald-400 bg-emerald-950 flex items-center justify-center">
                <Image
                  src="/assets/items/emerald.png"
                  alt="Emerald"
                  width={32}
                  height={32}
                  className="w-7 h-7 object-contain"
                />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <span className="font-pixel text-[11px] sm:text-xs md:text-sm text-emerald-300 uppercase block font-bold leading-snug">
                  WINNERS GET INTERNSHIP OPPORTUNITIES *
                </span>
                <span className="text-xs sm:text-sm text-emerald-100 font-terminal block mt-0.5 font-medium leading-relaxed">
                  Exclusive fast-track internship pathways with partner AI companies
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-amber-200/85 font-terminal max-w-2xl mx-auto text-center leading-relaxed px-2">
              {prizes.note}
            </p>
          </div>
        </div>

        {/* Breakdown of Verified Accolades with Authentic Item Frames */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <PixelCard
            variant="emerald"
            title="Cash Rewards"
            headerIcon={
              <Image
                src="/assets/items/diamond.png"
                alt="Diamond"
                width={28}
                height={28}
                className="w-6 h-6 object-contain inline-block drop-shadow"
              />
            }
          >
            <p className="font-terminal text-sm sm:text-base text-emerald-100 leading-relaxed font-medium">
              Championship cash awards granted to top-performing teams across FY and senior evaluation tracks.
            </p>
          </PixelCard>

          <PixelCard
            variant="stone"
            title="Internship Pathways"
            headerIcon={
              <Image
                src="/assets/items/totem.png"
                alt="Totem of Undying"
                width={28}
                height={28}
                className="w-6 h-6 object-contain inline-block drop-shadow"
              />
            }
          >
            <p className="font-terminal text-sm sm:text-base text-neutral-100 leading-relaxed font-medium">
              Direct technical evaluation by sponsor partner leaders for coveted AI engineering internships.
            </p>
          </PixelCard>

          <PixelCard
            variant="wood"
            title="Certificates & Glory"
            headerIcon={
              <Image
                src="/assets/items/book_quill.png"
                alt="Book and Quill"
                width={28}
                height={28}
                className="w-6 h-6 object-contain inline-block drop-shadow"
              />
            }
          >
            <p className="font-terminal text-sm sm:text-base text-amber-100 leading-relaxed font-medium">
              Official Certificates of Excellence authorized by AAAI Global Professional Chapter and MIT AOE.
            </p>
          </PixelCard>
        </div>
      </div>
    </SectionContainer>
  );
}
