'use client';

import React from 'react';
import Image from 'next/image';
import MinecraftButton from '@/components/ui/MinecraftButton';
import PixelBadge from '@/components/ui/PixelBadge';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import EventCountdown from '@/components/ui/EventCountdown';
import { EVENT_DATA } from '@/data/event';

export default function HeroSection() {
  const { details, prizes, organizers } = EVENT_DATA;

  return (
    <section
      id="hero"
      className="relative min-h-[95vh] flex items-center justify-center pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-[#0d0b09] overflow-hidden scroll-mt-20 sm:scroll-mt-24"
    >
      {/* Background Minecraft grid & subtle illumination */}
      <div className="absolute inset-0 bg-minecraft-grid opacity-40" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-[#0d0b09]"
        aria-hidden="true"
      />

      {/* Decorative Floating Pixel Blocks */}
      <div
        className="pointer-events-none absolute top-28 left-[6%] hidden lg:block animate-float"
        aria-hidden="true"
      >
        <div className="w-12 h-12 border-2 border-[#5d8a2e] bg-[#233814] shadow-[inset_3px_3px_0_#7bb53b,0_8px_16px_rgba(0,0,0,0.6)] flex items-center justify-center rotate-6">
          <span className="text-xl">🌱</span>
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-28 right-[6%] hidden lg:block animate-float-delayed"
        aria-hidden="true"
      >
        <div className="w-14 h-14 border-2 border-[#10b981] bg-[#0c2e22] shadow-[inset_3px_3px_0_#34d399,0_8px_16px_rgba(16,185,129,0.3)] flex items-center justify-center -rotate-12">
          <span className="text-2xl">⚡</span>
        </div>
      </div>

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Presenter Banner prioritizing ASTRA */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <PixelBadge variant="gold" icon="🚀">
            ASTRA Student Association • Primary Organizer
          </PixelBadge>
          <PixelBadge variant="emerald" icon="🏛">
            In Association with AAAI Global Chapter • AlgoVedas • MIT AOE
          </PixelBadge>
        </div>

        {/* Wooden Signpost for Event Date */}
        <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 border-2 border-[#4a2e14] bg-[#24170a] shadow-[inset_2px_2px_0_#7a4d22,0_4px_0_#120b05]">
          <span className="text-amber-400 text-xs">📅</span>
          <span className="font-pixel text-[8px] sm:text-[10px] text-amber-200 uppercase tracking-widest">
            {details.eventDate} • {details.venue}
          </span>
        </div>

        {/* Official 3D Minecraft AGENTCRAFT Logo Banner */}
        <div className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl my-2 flex justify-center">
          <Image
            src="/assets/agentcraft_official_logo.png"
            alt="AGENTCRAFT — National Agentic AI Challenge"
            width={680}
            height={220}
            className="w-full h-auto object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.95)]"
            priority
          />
        </div>

        {/* Subtitle */}
        <h2 className="font-pixel text-xs sm:text-sm md:text-base text-emerald-400 tracking-wider uppercase mb-3 drop-shadow-[0_2px_8px_rgba(16,185,129,0.5)]">
          {EVENT_DATA.subtitle}
        </h2>

        {/* Official Tagline from Poster */}
        <p className="font-terminal text-lg sm:text-xl md:text-2xl text-neutral-200 max-w-2xl leading-relaxed mb-8">
          {EVENT_DATA.tagline}
        </p>

        {/* Event Statistics Cards with Animated Numeric Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 w-full max-w-3xl mb-8 text-left">
          {/* Championship Vault */}
          <div className="p-3 sm:p-4 bg-[#1a1714]/90 border-2 border-[#543b22] shadow-[inset_2px_2px_0_rgba(255,255,255,0.08),0_4px_0_#0a0806]">
            <span className="font-pixel text-[8px] sm:text-[9px] text-amber-400 block uppercase">
              REWARDS
            </span>
            <div className="font-pixel text-xs sm:text-sm text-amber-300 mt-1.5 flex items-center font-bold">
              MINE TO REVEAL
            </div>
            <span className="text-xs text-neutral-400 font-terminal block mt-0.5">
              + Internships *
            </span>
          </div>

          {/* Registration Fee */}
          <div className="p-3 sm:p-4 bg-[#1a1714]/90 border-2 border-[#3d2e20] shadow-[inset_2px_2px_0_rgba(255,255,255,0.08),0_4px_0_#0a0806]">
            <span className="font-pixel text-[8px] sm:text-[9px] text-emerald-400 block uppercase">
              ENTRY FEE
            </span>
            <div className="font-pixel text-sm sm:text-xl text-white mt-1.5">
              <AnimatedCounter
                value={details.registrationFeeAmount}
                prefix="₹"
                suffix=" / Team"
                className="text-emerald-300"
              />
            </div>
            <span className="text-xs text-neutral-400 font-terminal block mt-0.5">
              Affordable pass
            </span>
          </div>

          {/* Team Size */}
          <div className="p-3 sm:p-4 bg-[#1a1714]/90 border-2 border-[#3d2e20] shadow-[inset_2px_2px_0_rgba(255,255,255,0.08),0_4px_0_#0a0806]">
            <span className="font-pixel text-[8px] sm:text-[9px] text-neutral-400 block uppercase">
              TEAM SIZE
            </span>
            <span className="font-pixel text-xs sm:text-base text-white block mt-1.5">
              {details.teamSize}
            </span>
            <span className="text-xs text-neutral-400 font-terminal block mt-0.5">
              + 1 Mentor (Optional)
            </span>
          </div>

          {/* Rounds */}
          <div className="p-3 sm:p-4 bg-[#1a1714]/90 border-2 border-[#3d2e20] shadow-[inset_2px_2px_0_rgba(255,255,255,0.08),0_4px_0_#0a0806]">
            <span className="font-pixel text-[8px] sm:text-[9px] text-neutral-400 block uppercase">
              COMPETITION
            </span>
            <span className="font-pixel text-xs sm:text-base text-amber-400 block mt-1.5">
              2 ROUNDS
            </span>
            <span className="text-xs text-neutral-400 font-terminal block mt-0.5">
              Online PPT + Final
            </span>
          </div>
        </div>

        {/* Live Countdown to Grand Finale */}
        <div className="w-full max-w-xl mb-10 p-4 border-2 border-[#3d2a1a] bg-[#1a1209]/80 backdrop-blur-sm">
          <EventCountdown
            targetDateISO={details.eventDateISO}
            label="COUNTDOWN TO GRAND FINALE AT MIT AOE"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <MinecraftButton
            variant="gold"
            size="lg"
            href="#registration"
            className="w-full sm:w-auto text-center"
          >
            REGISTER FOR AGENTCRAFT →
          </MinecraftButton>

          <MinecraftButton
            variant="emerald"
            size="lg"
            href="#about"
            className="w-full sm:w-auto text-center"
          >
            EXPLORE EXPEDITION
          </MinecraftButton>
        </div>

        {/* Scroll indicator prompt */}
        <div className="mt-12 flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
          <span className="font-pixel text-[8px] uppercase tracking-widest text-neutral-400">
            SCROLL TO EXPLORE
          </span>
          <span className="font-pixel text-xs text-emerald-400 animate-bounce">
            ↓
          </span>
        </div>
      </div>
    </section>
  );
}
