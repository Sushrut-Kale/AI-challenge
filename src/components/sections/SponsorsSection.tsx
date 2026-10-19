'use client';

import React from 'react';
import Image from 'next/image';
import SectionContainer from '@/components/layout/SectionContainer';
import SectionHeading from '@/components/ui/SectionHeading';
import PixelCard from '@/components/ui/PixelCard';
import PixelBadge from '@/components/ui/PixelBadge';
import { EVENT_DATA } from '@/data/event';

const SPONSOR_LOGOS: Record<string, string> = {
  'SAGVEEK Technologies Pvt. Ltd.': '/assets/logos/sagveek_logo.png',
  'AiSyntelligence LLP': '/assets/logos/aisyntelligence_logo.jpg',
  'Capabl.': '/assets/logos/capabl_logo.png',
};

export default function SponsorsSection() {
  const { organizers, sponsors, community } = EVENT_DATA;

  return (
    <SectionContainer id="sponsors" variant="grid" showTopSeam>
      <SectionHeading
        tag="ECOSYSTEM & PARTNERSHIPS"
        title="ORGANIZERS & SPONSORS"
        subtitle="Presented by the AAAI Global Professional Chapter, AlgoVedas, and ASTRA at MIT Academy of Engineering, with distinguished industry partners."
      />

      {/* Official Institutional Organizers */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <span className="font-pixel text-[9px] text-amber-400 uppercase tracking-widest block">
            OFFICIAL PRESENTING ORGANIZATIONS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Lead Organizer: AAAI */}
          <PixelCard
            variant="stone"
            title="Lead Chapter"
            badge={<PixelBadge variant="gold">ORGANIZER</PixelBadge>}
          >
            <div className="flex flex-col items-center text-center p-2">
              <div className="h-16 w-full flex items-center justify-center mb-4 bg-white/5 border border-white/10 p-2">
                <Image
                  src="/assets/aaai_logo.png"
                  alt="AAAI Student Chapter"
                  width={160}
                  height={50}
                  className="max-h-12 w-auto object-contain filter drop-shadow"
                />
              </div>
              <h4 className="font-pixel text-xs text-white mb-2">
                {organizers.lead}
              </h4>
              <p className="font-sans text-xs text-neutral-300 leading-relaxed">
                Global artificial intelligence professional association advancing research
                and responsible deployment of autonomous agentic systems.
              </p>
            </div>
          </PixelCard>

          {/* Department: AlgoVedas */}
          <PixelCard
            variant="stone"
            title="AlgoVedas"
            badge={<PixelBadge variant="emerald">DEPARTMENT</PixelBadge>}
          >
            <div className="flex flex-col items-center text-center p-2">
              <div className="h-16 w-full flex items-center justify-center mb-4 bg-white/5 border border-white/10 p-2">
                <Image
                  src="/assets/logos/algovedas_logo.png"
                  alt="AlgoVedas CSE AIML"
                  width={140}
                  height={50}
                  className="max-h-12 w-auto object-contain filter drop-shadow"
                />
              </div>
              <h4 className="font-pixel text-xs text-white mb-2">
                AlgoVedas
              </h4>
              <p className="font-sans text-xs text-neutral-300 leading-relaxed">
                Department of Computer Science & Engineering (Artificial Intelligence & Machine Learning)
                driving competitive student innovation.
              </p>
            </div>
          </PixelCard>

          {/* Student Association: ASTRA */}
          <PixelCard
            variant="stone"
            title="ASTRA"
            badge={<PixelBadge variant="diamond">STUDENT BODY</PixelBadge>}
          >
            <div className="flex flex-col items-center text-center p-2">
              <div className="h-16 w-full flex items-center justify-center mb-4 bg-white/5 border border-white/10 p-2">
                <Image
                  src="/assets/logos/astra_logo.jpg"
                  alt="ASTRA Student Association"
                  width={140}
                  height={50}
                  className="max-h-12 w-auto object-contain rounded filter drop-shadow"
                />
              </div>
              <h4 className="font-pixel text-xs text-white mb-2">
                ASTRA
              </h4>
              <p className="font-sans text-xs text-neutral-300 leading-relaxed">
                MITAOE Student Association fostering interdisciplinary hackathons, technical
                workshops, and student developer growth.
              </p>
            </div>
          </PixelCard>
        </div>
      </div>

      {/* Official Industry Sponsors with Genuine Logos */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <span className="font-pixel text-[9px] text-emerald-400 uppercase tracking-widest block">
            OUR INDUSTRY SPONSORS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {sponsors.map((sponsor) => {
            const logoSrc = SPONSOR_LOGOS[sponsor.name];

            return (
              <div
                key={sponsor.name}
                className="p-5 border-2 border-[#382618] bg-[#1a130c] shadow-[0_8px_20px_rgba(0,0,0,0.65)] flex flex-col justify-between text-center hover:-translate-y-1 transition-transform"
              >
                <div>
                  <span className="font-pixel text-[8px] text-amber-400 uppercase tracking-wider block mb-3">
                    {sponsor.tier}
                  </span>

                  {/* Logo Container with clean white backdrop */}
                  <div className="h-20 w-full bg-white rounded flex items-center justify-center p-3 mb-4 shadow-inner">
                    {logoSrc ? (
                      <Image
                        src={logoSrc}
                        alt={sponsor.name}
                        width={180}
                        height={60}
                        className="max-h-14 w-auto object-contain"
                      />
                    ) : (
                      <span className="font-pixel text-xs text-black">{sponsor.name}</span>
                    )}
                  </div>

                  <h4 className="font-pixel text-xs text-white mb-1">
                    {sponsor.name}
                  </h4>
                </div>

                <p className="font-sans text-xs text-neutral-400 mt-2">
                  {sponsor.role}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verified WhatsApp Community Card with Official QR Code */}
      <div className="max-w-xl mx-auto p-6 sm:p-8 bg-[#102419] border-2 border-emerald-500/80 shadow-[0_0_24px_rgba(16,185,129,0.25)] text-center">
        <span className="font-pixel text-[8px] text-emerald-400 uppercase tracking-widest block mb-2">
          OFFICIAL COMMUNITY DESK
        </span>
        <h4 className="font-pixel text-sm sm:text-base text-white mb-2">
          {community.platform}
        </h4>
        <p className="font-sans text-xs sm:text-sm text-emerald-200/90 leading-relaxed max-w-md mx-auto mb-5">
          {community.note}
        </p>

        {/* Real QR Code Crop from Official Poster */}
        <div className="inline-block p-2 bg-white rounded border-2 border-emerald-400 shadow-[0_4px_12px_rgba(0,0,0,0.5)] mb-4">
          <Image
            src="/assets/whatsapp_qr.png"
            alt="Official WhatsApp Community QR Code"
            width={140}
            height={140}
            className="w-32 h-32 object-contain"
          />
        </div>

        <div className="mt-2">
          <span className="inline-block px-3 py-1 bg-black/60 border border-emerald-600/60 font-pixel text-[8px] text-emerald-300">
            {community.status}
          </span>
        </div>
      </div>
    </SectionContainer>
  );
}
