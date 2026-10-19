'use client';

import React from 'react';
import Image from 'next/image';
import SectionContainer from '@/components/layout/SectionContainer';
import SectionHeading from '@/components/ui/SectionHeading';
import PixelCard from '@/components/ui/PixelCard';
import PixelBadge from '@/components/ui/PixelBadge';
import { EVENT_DATA } from '@/data/event';

const SPONSOR_LOGOS: Record<string, string> = {
  'SAGVEEK Technologies Pvt. Ltd.': '/assets/logos/sagveek_clean.png',
  'AiSyntelligence LLP': '/assets/logos/aisyntelligence_clean.png',
  'Capabl.': '/assets/logos/capabl_clean.png',
};

export default function SponsorsSection() {
  const { organizers, sponsors, community } = EVENT_DATA;

  return (
    <SectionContainer id="sponsors" variant="grid" showTopSeam>
      <SectionHeading
        tag="ECOSYSTEM & PARTNERSHIPS"
        title="ORGANIZERS & SPONSORS"
        subtitle="Organized by ASTRA Student Association in association with AAAI Global Professional Chapter and AlgoVedas at MIT Academy of Engineering, with distinguished industry partners."
      />

      {/* Official Institutional Organizers */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <span className="font-pixel text-[10px] sm:text-[11px] text-amber-400 uppercase tracking-widest block font-bold">
            OFFICIAL PRESENTING ORGANIZATIONS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Primary Student Organizer: ASTRA (First & Most Prominent) */}
          <PixelCard
            variant="emerald"
            title="Primary Organizer"
            badge={<PixelBadge variant="gold">PRIMARY ORGANIZER</PixelBadge>}
            className="ring-2 ring-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.2)]"
          >
            <div className="flex flex-col items-center text-center p-2">
              <div className="h-20 w-full flex items-center justify-center mb-4 bg-[#120e0a]/90 border border-amber-400/30 p-2 rounded shadow-inner">
                <Image
                  src="/assets/logos/astra_clean.png"
                  alt="ASTRA Student Association"
                  width={140}
                  height={60}
                  className="max-h-16 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                />
              </div>
              <h4 className="font-pixel text-xs sm:text-sm text-amber-300 mb-2 font-bold">
                ASTRA Student Association
              </h4>
              <p className="font-sans text-xs sm:text-sm text-neutral-100 leading-relaxed font-medium">
                Primary student organizing body at MIT Academy of Engineering (Department of CSE-AIML)
                leading the AGENTCRAFT National Challenge and student innovation.
              </p>
            </div>
          </PixelCard>

          {/* Associated Professional Chapter: AAAI */}
          <PixelCard
            variant="stone"
            title="Professional Chapter"
            badge={<PixelBadge variant="emerald">ASSOCIATED CHAPTER</PixelBadge>}
          >
            <div className="flex flex-col items-center text-center p-2">
              <div className="h-20 w-full flex items-center justify-center mb-4 bg-[#120e0a]/90 border border-white/10 p-2 rounded shadow-inner">
                <Image
                  src="/assets/logos/aaai_clean.png"
                  alt="AAAI Global Professional Chapter"
                  width={160}
                  height={60}
                  className="max-h-16 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                />
              </div>
              <h4 className="font-pixel text-xs sm:text-sm text-white mb-2 font-bold">
                AAAI Global Professional Chapter
              </h4>
              <p className="font-sans text-xs sm:text-sm text-neutral-200 leading-relaxed">
                Global artificial intelligence professional association advancing research,
                technical rigor, and responsible deployment of autonomous agentic systems.
              </p>
            </div>
          </PixelCard>

          {/* Department Technical Society: AlgoVedas */}
          <PixelCard
            variant="stone"
            title="Department Community"
            badge={<PixelBadge variant="diamond">CSE AIML</PixelBadge>}
          >
            <div className="flex flex-col items-center text-center p-2">
              <div className="h-20 w-full flex items-center justify-center mb-4 bg-[#120e0a]/90 border border-white/10 p-2 rounded shadow-inner">
                <Image
                  src="/assets/logos/algovedas_clean.png"
                  alt="AlgoVedas CSE AIML"
                  width={140}
                  height={60}
                  className="max-h-16 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                />
              </div>
              <h4 className="font-pixel text-xs sm:text-sm text-white mb-2 font-bold">
                AlgoVedas
              </h4>
              <p className="font-sans text-xs sm:text-sm text-neutral-200 leading-relaxed">
                Department of Computer Science & Engineering (Artificial Intelligence & Machine Learning)
                technical community driving competitive student innovation.
              </p>
            </div>
          </PixelCard>
        </div>
      </div>

      {/* Official Industry Sponsors with Genuine Logos */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <span className="font-pixel text-[10px] sm:text-[11px] text-emerald-400 uppercase tracking-widest block font-bold">
            OUR INDUSTRY SPONSORS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {sponsors.map((sponsor) => {
            const logoSrc = SPONSOR_LOGOS[sponsor.name];

            return (
              <div
                key={sponsor.name}
                className="p-5 sm:p-6 border-2 border-[#382618] bg-[#1a130c] shadow-[0_8px_20px_rgba(0,0,0,0.65)] flex flex-col justify-between text-center hover:-translate-y-1 transition-transform"
              >
                <div>
                  <span className="font-pixel text-[9px] text-amber-400 uppercase tracking-wider block mb-3 font-semibold">
                    {sponsor.tier}
                  </span>

                  {/* Themed Logo Container on Minecraft Deepslate Slot */}
                  <div className="h-20 w-full bg-[#120e0a]/90 border border-[#3e2c1c] rounded flex items-center justify-center p-3 mb-4 shadow-inner">
                    {logoSrc ? (
                      <Image
                        src={logoSrc}
                        alt={sponsor.name}
                        width={180}
                        height={60}
                        className="max-h-14 w-auto object-contain filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]"
                      />
                    ) : (
                      <span className="font-pixel text-xs text-white">{sponsor.name}</span>
                    )}
                  </div>

                  <h4 className="font-pixel text-xs sm:text-sm text-white mb-1.5 font-bold">
                    {sponsor.name}
                  </h4>
                </div>

                <p className="font-sans text-xs sm:text-sm text-neutral-300 mt-2 font-medium">
                  {sponsor.role}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verified WhatsApp Community Desk with Direct Link */}
      <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-[#102419] border-2 border-emerald-500/80 shadow-[0_0_24px_rgba(16,185,129,0.25)] text-center">
        <span className="font-pixel text-[9px] sm:text-[10px] text-emerald-400 uppercase tracking-widest block mb-2 font-bold">
          OFFICIAL COMMUNITY DESK
        </span>
        <h4 className="font-pixel text-sm sm:text-base text-white mb-3">
          {community.platform}
        </h4>
        <p className="font-sans text-xs sm:text-sm text-emerald-100 leading-relaxed max-w-lg mx-auto mb-6">
          Join the official AGENTCRAFT WhatsApp Community for round announcements, mentor office hours, problem statement templates, and team coordination.
        </p>

        {/* Direct Link Instead of QR Code per user request */}
        <div className="flex flex-col items-center justify-center gap-3 mb-6">
          <a
            href="https://chat.whatsapp.com/HCoLTsCSoQ2J6N35w1eh1A"
            target="_blank"
            rel="noopener noreferrer"
            className="mc-shine inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#10b981] hover:bg-[#059669] border-2 border-[#047857] font-pixel text-xs sm:text-sm text-black font-bold uppercase tracking-wider shadow-[inset_2px_2px_0_rgba(255,255,255,0.4),0_4px_0_#064e3b] transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
            data-interactive="true"
          >
            <span>💬</span>
            <span>JOIN WHATSAPP COMMUNITY ↗</span>
          </a>

          <a
            href="https://chat.whatsapp.com/HCoLTsCSoQ2J6N35w1eh1A"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs sm:text-sm text-emerald-300 hover:text-emerald-100 underline underline-offset-4 break-all transition-colors"
            data-interactive="true"
          >
            https://chat.whatsapp.com/HCoLTsCSoQ2J6N35w1eh1A
          </a>
        </div>

        <div>
          <span className="inline-block px-3 py-1.5 bg-black/60 border border-emerald-600/60 font-pixel text-[9px] text-emerald-300 font-medium">
            {community.status}
          </span>
        </div>
      </div>
    </SectionContainer>
  );
}
