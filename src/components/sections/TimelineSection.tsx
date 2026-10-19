'use client';

import React from 'react';
import Image from 'next/image';
import SectionContainer from '@/components/layout/SectionContainer';
import SectionHeading from '@/components/ui/SectionHeading';
import PixelCard from '@/components/ui/PixelCard';
import PixelBadge from '@/components/ui/PixelBadge';

export default function TimelineSection() {
  const timelineMilestones = [
    {
      step: '01',
      title: 'REGISTRATION CLOSING',
      date: '30th October 2026',
      badge: 'DEADLINE',
      variant: 'wood' as const,
      description:
        'Final deadline for team registration (₹400 / Team). Teams must finalize rosters (2–4 students + 1 optional mentor) across FY or SY/TY/B.Tech streams.',
    },
    {
      step: '02',
      title: 'ROUND 1: FIRST SCREENING',
      date: '31st October 2026',
      badge: 'ONLINE ROUND',
      variant: 'stone' as const,
      description:
        'Online submission & screening: Teams present their solution architecture PPT and demonstrate their working AI Agent prototype solving an SDG challenge.',
    },
    {
      step: '03',
      title: 'ROUND 2: GRAND FINALE',
      date: '17th November 2026',
      badge: 'OFFLINE FINALE',
      variant: 'emerald' as const,
      description:
        'In-person offline final presentation at MIT Academy of Engineering, Alandi, Pune. Top finalists demonstrate live multi-agent execution to jury.',
    },
  ];

  return (
    <SectionContainer id="timeline" variant="alt" showTopSeam>
      <SectionHeading
        tag="OFFICIAL EXPEDITION DATES"
        title="EVENT TIMELINE"
        subtitle="Mark your calendar with the three definitive milestones established in the official AGENTCRAFT briefing."
      />

      <div className="relative max-w-4xl mx-auto">
        {/* Central Minecraft Rail Track */}
        <div
          className="hidden md:block absolute left-1/2 top-0 bottom-0 w-6 -translate-x-1/2"
          style={{
            backgroundImage: 'url(/assets/rail_strip.png)',
            backgroundSize: '24px 24px',
            backgroundRepeat: 'repeat-y',
            imageRendering: 'pixelated',
          }}
          aria-hidden="true"
        />

        <div className="space-y-8 md:space-y-12">
          {timelineMilestones.map((milestone, index) => {
            const isEven = index % 2 === 0;
            const isFinal = index === 2;

            return (
              <div
                key={milestone.step}
                className={`relative flex flex-col md:flex-row items-center ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Milestone Node with Minecart on Active / Final Step */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center">
                  {index === 0 ? (
                    <Image
                      src="/assets/minecart.png"
                      alt="Minecart"
                      width={48}
                      height={28}
                      className="w-10 h-auto object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                    />
                  ) : (
                    <div className="w-8 h-8 border-2 border-[#1f2e14] bg-[#222] flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.8)]">
                      <div
                        className={`w-3.5 h-3.5 ${
                          isFinal
                            ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-pulse'
                            : 'bg-emerald-400 shadow-[0_0_8px_#10b981]'
                        }`}
                      />
                    </div>
                  )}
                </div>

                {/* Content Side Card */}
                <div className="w-full md:w-1/2 md:px-6">
                  <PixelCard
                    variant={milestone.variant}
                    title={milestone.title}
                    headerIcon={isFinal ? '🏆' : '🗓️'}
                    badge={
                      <PixelBadge
                        variant={isFinal ? 'gold' : index === 0 ? 'dirt' : 'diamond'}
                      >
                        {milestone.badge}
                      </PixelBadge>
                    }
                  >
                    <div className="flex items-center gap-2 mb-2 font-pixel text-[10px] text-amber-300 font-bold">
                      <span>📅 {milestone.date}</span>
                      <span className="opacity-40">•</span>
                      <span>STAGE #{milestone.step}</span>
                    </div>

                    <p className="font-sans text-sm sm:text-base text-neutral-100 leading-relaxed font-medium">
                      {milestone.description}
                    </p>
                  </PixelCard>
                </div>

                {/* Empty side for layout balance */}
                <div className="hidden md:block w-1/2 md:px-6" />
              </div>
            );
          })}
        </div>
      </div>
    </SectionContainer>
  );
}
