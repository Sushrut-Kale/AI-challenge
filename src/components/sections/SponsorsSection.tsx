'use client';

import React from 'react';
import Image from 'next/image';
import SectionContainer from '@/components/layout/SectionContainer';
import SectionHeading from '@/components/ui/SectionHeading';
import PixelCard from '@/components/ui/PixelCard';
import PixelBadge from '@/components/ui/PixelBadge';
import { EVENT_DATA } from '@/data/event';

const SPONSOR_LOGOS: Record<string, string> = {
  'SAGVEEK Technologies Pvt. Ltd.': '/assets/logos_v2/sagveek_clean.png',
  'AiSyntelligence LLP': '/assets/logos_v2/aisyntelligence_clean.png',
  'Capabl.': '/assets/logos_v2/capabl_clean.png',
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
          <span className="font-pixel text-[10px] sm:text-[11px] text-amber-400 uppercase tracking-widest block font-bold mb-1">
            ► PRESENTING ORGANIZATIONS
          </span>
          <h3 className="font-pixel text-base sm:text-xl text-white uppercase tracking-wider" style={{ textShadow: '2px 2px 0 #000' }}>
            ORGANIZED IN COOPERATION WITH
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Primary Student Organizer: ASTRA */}
          <div className="p-4 sm:p-5 border-3 border-[#543822] bg-[#1a130c] shadow-[inset_2px_2px_0_#7a5232,inset_-2px_-2px_0_#0f0a06,0_8px_24px_rgba(0,0,0,0.7)] flex flex-col justify-between hover:-translate-y-1 transition-transform">
            <div>
              {/* Top Header Badge */}
              <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-[#3e2c1c]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 border border-amber-500/60 bg-[#2b190a] flex items-center justify-center p-1 shadow-inner">
                    <Image
                      src="/assets/items/emerald.png"
                      alt="Emerald"
                      width={24}
                      height={24}
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                  <span className="font-pixel text-[10px] text-amber-300 uppercase font-bold tracking-wider">
                    PRIMARY ORGANIZER
                  </span>
                </div>
                <PixelBadge variant="gold">LEAD</PixelBadge>
              </div>

              {/* Large Visible Logo Slot on White Background */}
              <div className="h-28 sm:h-32 w-full bg-white border-2 border-[#3e2c1c] rounded flex items-center justify-center p-3 mb-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.4)]">
                <Image
                  src="/assets/logos_v2/astra_clean.png"
                  alt="ASTRA Student Association"
                  width={200}
                  height={80}
                  className="max-h-20 sm:max-h-24 w-auto max-w-[90%] object-contain"
                />
              </div>

              <h4 className="font-pixel text-xs sm:text-sm text-amber-300 mb-1.5 font-bold text-center">
                ASTRA Student Association
              </h4>
            </div>

            <p className="font-sans text-xs sm:text-sm text-neutral-200 leading-relaxed font-medium text-center mt-2">
              Primary student organizing body at MIT Academy of Engineering (Department of CSE-AIML) leading challenge operations.
            </p>
          </div>

          {/* Associated Professional Chapter: AAAI */}
          <div className="p-4 sm:p-5 border-3 border-[#543822] bg-[#1a130c] shadow-[inset_2px_2px_0_#7a5232,inset_-2px_-2px_0_#0f0a06,0_8px_24px_rgba(0,0,0,0.7)] flex flex-col justify-between hover:-translate-y-1 transition-transform">
            <div>
              {/* Top Header Badge */}
              <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-[#3e2c1c]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 border border-sky-500/60 bg-[#0a1e2b] flex items-center justify-center p-1 shadow-inner">
                    <Image
                      src="/assets/items/diamond.png"
                      alt="Diamond"
                      width={24}
                      height={24}
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                  <span className="font-pixel text-[10px] text-sky-300 uppercase font-bold tracking-wider">
                    PROFESSIONAL CHAPTER
                  </span>
                </div>
                <PixelBadge variant="emerald">GLOBAL</PixelBadge>
              </div>

              {/* Large Visible Logo Slot on White Background */}
              <div className="h-28 sm:h-32 w-full bg-white border-2 border-[#3e2c1c] rounded flex items-center justify-center p-3 mb-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.4)]">
                <Image
                  src="/assets/logos_v2/aaai_clean.png"
                  alt="AAAI Global Professional Chapter"
                  width={200}
                  height={80}
                  className="max-h-20 sm:max-h-24 w-auto max-w-[90%] object-contain"
                />
              </div>

              <h4 className="font-pixel text-xs sm:text-sm text-white mb-1.5 font-bold text-center">
                AAAI Global Professional Chapter
              </h4>
            </div>

            <p className="font-sans text-xs sm:text-sm text-neutral-200 leading-relaxed font-medium text-center mt-2">
              Global artificial intelligence professional association advancing technical research and responsible AI agent architectures.
            </p>
          </div>

          {/* Department Technical Society: AlgoVedas */}
          <div className="p-4 sm:p-5 border-3 border-[#543822] bg-[#1a130c] shadow-[inset_2px_2px_0_#7a5232,inset_-2px_-2px_0_#0f0a06,0_8px_24px_rgba(0,0,0,0.7)] flex flex-col justify-between hover:-translate-y-1 transition-transform">
            <div>
              {/* Top Header Badge */}
              <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-[#3e2c1c]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 border border-red-500/60 bg-[#2b0d0a] flex items-center justify-center p-1 shadow-inner">
                    <Image
                      src="/assets/items/redstone.png"
                      alt="Redstone"
                      width={24}
                      height={24}
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                  <span className="font-pixel text-[10px] text-amber-300 uppercase font-bold tracking-wider">
                    DEPARTMENT SOCIETY
                  </span>
                </div>
                <PixelBadge variant="diamond">CSE AIML</PixelBadge>
              </div>

              {/* Large Visible Logo Slot on White Background */}
              <div className="h-28 sm:h-32 w-full bg-white border-2 border-[#3e2c1c] rounded flex items-center justify-center p-3 mb-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.4)]">
                <Image
                  src="/assets/logos_v2/algovedas_clean.png"
                  alt="AlgoVedas CSE AIML"
                  width={200}
                  height={80}
                  className="max-h-20 sm:max-h-24 w-auto max-w-[90%] object-contain"
                />
              </div>

              <h4 className="font-pixel text-xs sm:text-sm text-white mb-1.5 font-bold text-center">
                AlgoVedas (CSE AIML)
              </h4>
            </div>

            <p className="font-sans text-xs sm:text-sm text-neutral-200 leading-relaxed font-medium text-center mt-2">
              Department technical community driving competitive student hackathons and intelligent system development.
            </p>
          </div>
        </div>
      </div>

      {/* Official Industry Sponsors with High-Contrast Visible Logos */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <span className="font-pixel text-[10px] sm:text-[11px] text-emerald-400 uppercase tracking-widest block font-bold mb-1">
            ► INDUSTRY COLLABORATORS
          </span>
          <h3 className="font-pixel text-base sm:text-xl text-white uppercase tracking-wider" style={{ textShadow: '2px 2px 0 #000' }}>
            OUR INDUSTRY SPONSORS
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {sponsors.map((sponsor, index) => {
            const logoSrc = SPONSOR_LOGOS[sponsor.name];
            const sponsorIcons = [
              '/assets/items/iron_pickaxe.png',
              '/assets/items/ender_eye.png',
              '/assets/items/totem.png',
            ];
            const iconSrc = sponsorIcons[index % sponsorIcons.length];

            return (
              <div
                key={sponsor.name}
                className="p-4 sm:p-5 border-3 border-[#543822] bg-[#1a130c] shadow-[inset_2px_2px_0_#7a5232,inset_-2px_-2px_0_#0f0a06,0_8px_24px_rgba(0,0,0,0.7)] flex flex-col justify-between hover:-translate-y-1 transition-transform"
              >
                <div>
                  {/* Top Header Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-[#3e2c1c]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 border border-amber-600/60 bg-[#261609] flex items-center justify-center p-1 shadow-inner">
                        <Image
                          src={iconSrc}
                          alt="Icon"
                          width={24}
                          height={24}
                          className="w-5 h-5 object-contain"
                        />
                      </div>
                      <span className="font-pixel text-[10px] text-amber-400 uppercase font-bold tracking-wider">
                        {sponsor.tier}
                      </span>
                    </div>
                  </div>

                  {/* Large Visible Logo Slot on White Background */}
                  <div className="h-28 sm:h-32 w-full bg-white border-2 border-[#3e2c1c] rounded flex items-center justify-center p-3 mb-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.4)]">
                    {logoSrc ? (
                      <Image
                        src={logoSrc}
                        alt={sponsor.name}
                        width={220}
                        height={80}
                        className="max-h-20 sm:max-h-24 w-auto max-w-[90%] object-contain"
                      />
                    ) : (
                      <span className="font-pixel text-xs text-neutral-800">{sponsor.name}</span>
                    )}
                  </div>

                  <h4 className="font-pixel text-xs sm:text-sm text-white mb-1.5 font-bold text-center">
                    {sponsor.name}
                  </h4>
                </div>

                <p className="font-sans text-xs sm:text-sm text-neutral-300 leading-relaxed font-medium text-center mt-2">
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
