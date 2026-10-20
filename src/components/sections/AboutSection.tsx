'use client';

import React from 'react';
import Image from 'next/image';
import SectionContainer from '@/components/layout/SectionContainer';
import SectionHeading from '@/components/ui/SectionHeading';
import PixelCard from '@/components/ui/PixelCard';
import PixelBadge from '@/components/ui/PixelBadge';
import { EVENT_DATA } from '@/data/event';

export default function AboutSection() {
  const { agents, organizers, details, prizes } = EVENT_DATA;

  return (
    <SectionContainer id="about" variant="alt" showTopSeam>
      {/* Minecraft Wall Torches (Section Effect) */}
      <div className="relative max-w-4xl mx-auto">
        <div className="hidden sm:flex absolute -left-6 md:-left-12 top-4 flex-col items-center pointer-events-none select-none z-20">
          <div className="relative w-8 h-10 animate-torch-flicker">
            <Image
              src="/assets/items/torch.png"
              alt="Minecraft Torch"
              fill
              className="object-contain"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          <div className="w-16 h-16 rounded-full bg-amber-500/20 blur-xl pointer-events-none -mt-8" />
        </div>

        <div className="hidden sm:flex absolute -right-6 md:-right-12 top-4 flex-col items-center pointer-events-none select-none z-20">
          <div className="relative w-8 h-10 animate-torch-flicker" style={{ animationDelay: '0.45s' }}>
            <Image
              src="/assets/items/torch.png"
              alt="Minecraft Torch"
              fill
              className="object-contain"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          <div className="w-16 h-16 rounded-full bg-amber-500/20 blur-xl pointer-events-none -mt-8" />
        </div>

        <SectionHeading
          tag="MISSION & ARCHITECTURE"
          title="ABOUT AGENTCRAFT"
          subtitle="Build Intelligent Agents. Solve Real-World Problems. Create Sustainable Impact."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
        {/* Left Column: Mission Overview & Poster Mascot */}
        <div className="lg:col-span-7 space-y-6">
          <PixelCard
            variant="stone"
            title="The Agentic AI Frontier"
            headerIcon="🤖"
            badge={<PixelBadge variant="emerald">MIT AOE 2026</PixelBadge>}
          >
            <div className="flex flex-col sm:flex-row gap-5 items-center mb-6">
              {/* Mascot Robot Illustration */}
              <div className="w-36 h-36 shrink-0 relative p-1 border-2 border-[#5d8a2e] bg-[#14230e] shadow-[inset_2px_2px_0_#7bb53b,0_6px_16px_rgba(0,0,0,0.6)] flex items-center justify-center">
                <Image
                  src="/assets/agentcraft_mascot.png"
                  alt="AGENTCRAFT Mascot"
                  width={140}
                  height={140}
                  className="w-full h-full object-contain filter drop-shadow"
                />
              </div>

              <div>
                <p className="font-terminal text-base sm:text-lg text-neutral-100 leading-relaxed mb-3">
                  <strong className="text-emerald-400">AGENTCRAFT</strong> is a premier National Agentic AI Challenge organized
                  by <strong className="text-amber-300">ASTRA Student Association</strong> (Department of CSE-AIML) in association with the{' '}
                  <strong className="text-white">AAAI Global Professional Chapter</strong> and <strong className="text-white">AlgoVedas</strong> at{' '}
                  <strong className="text-emerald-300">{organizers.institution.name}</strong>, Alandi, Pune.
                </p>
                <p className="font-terminal text-sm sm:text-base text-neutral-200 leading-relaxed">
                  Moving beyond simple chatbots, student developers build autonomous multi-agent
                  architectures capable of planning, tool usage, memory recall, and cooperative
                  execution aligned with the United Nations Sustainable Development Goals.
                </p>
              </div>
            </div>

            {/* Core Architectural Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <div className="p-3 bg-black/50 border border-emerald-900/60 rounded">
                <span className="font-pixel text-[10px] sm:text-[11px] text-emerald-400 block mb-1 font-bold">
                  01. REASON
                </span>
                <span className="text-sm sm:text-base text-neutral-200 block font-terminal">
                  Goal decomposition & reflective planning
                </span>
              </div>
              <div className="p-3 bg-black/50 border border-sky-900/60 rounded">
                <span className="font-pixel text-[10px] sm:text-[11px] text-sky-400 block mb-1 font-bold">
                  02. ACT
                </span>
                <span className="text-sm sm:text-base text-neutral-200 block font-terminal">
                  Multi-tool integration & API execution
                </span>
              </div>
              <div className="p-3 bg-black/50 border border-amber-900/60 rounded">
                <span className="font-pixel text-[10px] sm:text-[11px] text-amber-400 block mb-1 font-bold">
                  03. IMPACT
                </span>
                <span className="text-sm sm:text-base text-neutral-200 block font-terminal">
                  Sustainable Development Goals solutions
                </span>
              </div>
            </div>
          </PixelCard>
        </div>

        {/* Right Column: Verified Event Desk */}
        <div className="lg:col-span-5 space-y-6">
          <PixelCard
            variant="wood"
            title="Official Notice Board"
            headerIcon="📜"
            badge={<PixelBadge variant="gold">VERIFIED POSTER DESK</PixelBadge>}
          >
            <div className="space-y-4 font-terminal text-sm sm:text-base text-amber-100">
              <div className="flex items-start gap-3">
                <span className="text-amber-400 text-base">🏛</span>
                <div>
                  <strong className="font-pixel text-[10px] sm:text-[11px] text-amber-300 block mb-0.5">
                    Organizing Bodies
                  </strong>
                  <span className="text-neutral-100 font-medium">
                    ASTRA (Primary Student Organizer) • AAAI Global Chapter • AlgoVedas (CSE AIML)
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-amber-400 text-base">📍</span>
                <div>
                  <strong className="font-pixel text-[10px] sm:text-[11px] text-amber-300 block mb-0.5">
                    Host Institution
                  </strong>
                  <span className="text-neutral-100 font-medium">
                    {organizers.institution.name}, {organizers.institution.campus}
                  </span>
                  <span className="text-xs text-neutral-300 block mt-0.5">
                    ({organizers.institution.affiliation})
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-amber-400 text-base">📅</span>
                <div>
                  <strong className="font-pixel text-[10px] sm:text-[11px] text-amber-300 block mb-0.5">
                    Key Dates
                  </strong>
                  <span className="text-neutral-100 font-medium">
                    Finale: {details.eventDate} | Deadline: {details.registrationDeadline}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-amber-400 text-base">👥</span>
                <div>
                  <strong className="font-pixel text-[10px] sm:text-[11px] text-amber-300 block mb-0.5">
                    Team Composition
                  </strong>
                  <span className="text-neutral-100 font-medium">
                    {details.teamSize} + {details.mentorAllowed}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-amber-400 text-base">⚖️</span>
                <div>
                  <strong className="font-pixel text-[10px] sm:text-[11px] text-amber-300 block mb-0.5">
                    Evaluation Streams
                  </strong>
                  <span className="text-neutral-100 font-medium">
                    FY (Separate Evaluation Track) & SY, TY, B.Tech Open Tier
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-[#181109] border-2 border-amber-800/80 mt-4 rounded shadow-md">
                <span className="font-pixel text-[10px] sm:text-[11px] text-amber-300 block mb-1 font-bold">
                  ★ EXCLUSIVE AWARDS & INTERNSHIPS
                </span>
                <p className="text-sm sm:text-base text-amber-100 leading-relaxed font-terminal">
                  Mine the bedrock vault in the rewards section to uncover the cash pool! In addition,{' '}
                  <strong className="text-emerald-400">Winners get internship opportunities *</strong> with sponsor partners.
                </p>
              </div>
            </div>
          </PixelCard>
        </div>
      </div>

      {/* End of Mission & Verified Event Desk */}
    </SectionContainer>
  );
}
