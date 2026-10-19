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
      <SectionHeading
        tag="MISSION & ARCHITECTURE"
        title="ABOUT AGENTCRAFT"
        subtitle="Build Intelligent Agents. Solve Real-World Problems. Create Sustainable Impact."
      />

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
                <p className="font-sans text-sm text-neutral-200 leading-relaxed mb-3">
                  <strong>AGENTCRAFT</strong> is a premier National Agentic AI Challenge organized
                  by <strong>ASTRA Student Association</strong> (Department of CSE-AIML) in association with the{' '}
                  <strong>AAAI Global Professional Chapter</strong> and <strong>AlgoVedas</strong> at{' '}
                  <strong>{organizers.institution.name}</strong>, Alandi, Pune.
                </p>
                <p className="font-sans text-xs text-neutral-300 leading-relaxed">
                  Moving beyond simple chatbots, student developers build autonomous multi-agent
                  architectures capable of planning, tool usage, memory recall, and cooperative
                  execution aligned with the United Nations Sustainable Development Goals.
                </p>
              </div>
            </div>

            {/* Core Architectural Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <div className="p-3 bg-black/40 border border-neutral-700/60">
                <span className="font-pixel text-[10px] text-emerald-400 block mb-1">
                  01. REASON
                </span>
                <span className="text-xs text-neutral-400 block font-sans">
                  Goal decomposition & reflective planning
                </span>
              </div>
              <div className="p-3 bg-black/40 border border-neutral-700/60">
                <span className="font-pixel text-[10px] text-sky-400 block mb-1">
                  02. ACT
                </span>
                <span className="text-xs text-neutral-400 block font-sans">
                  Multi-tool integration & API execution
                </span>
              </div>
              <div className="p-3 bg-black/40 border border-neutral-700/60">
                <span className="font-pixel text-[10px] text-amber-400 block mb-1">
                  03. IMPACT
                </span>
                <span className="text-xs text-neutral-400 block font-sans">
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
            <div className="space-y-3.5 font-sans text-xs text-amber-100">
              <div className="flex items-start gap-2.5">
                <span className="text-amber-400 text-sm">🏛</span>
                <div>
                  <strong className="font-pixel text-[9px] text-white block">
                    Organizing Bodies
                  </strong>
                  <span className="text-neutral-300">
                    ASTRA (Primary Student Organizer) • AAAI Global Chapter • AlgoVedas (CSE AIML)
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-amber-400 text-sm">📍</span>
                <div>
                  <strong className="font-pixel text-[9px] text-white block">
                    Host Institution
                  </strong>
                  <span className="text-neutral-300">
                    {organizers.institution.name}, {organizers.institution.campus}
                  </span>
                  <span className="text-[10px] text-neutral-400 block mt-0.5">
                    ({organizers.institution.affiliation})
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-amber-400 text-sm">📅</span>
                <div>
                  <strong className="font-pixel text-[9px] text-white block">
                    Key Dates
                  </strong>
                  <span className="text-neutral-300">
                    Finale: {details.eventDate} | Deadline: {details.registrationDeadline}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-amber-400 text-sm">👥</span>
                <div>
                  <strong className="font-pixel text-[9px] text-white block">
                    Team Composition
                  </strong>
                  <span className="text-neutral-300">
                    {details.teamSize} + {details.mentorAllowed}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-amber-400 text-sm">⚖️</span>
                <div>
                  <strong className="font-pixel text-[9px] text-white block">
                    Evaluation Streams
                  </strong>
                  <span className="text-neutral-300">
                    FY (Separate Evaluation) & SY, TY, B.Tech Tier
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#181109] border border-amber-800/60 mt-4">
                <span className="font-pixel text-[9px] text-amber-300 block mb-1">
                  ★ PRIZE POOL & INTERNSHIPS
                </span>
                <p className="text-[11px] text-amber-200/90 leading-relaxed font-sans">
                  Total Prize Pool: <strong>{prizes.totalPool}</strong>. In addition to cash awards,{' '}
                  <strong>Winners get internship opportunities *</strong> with sponsor partners.
                </p>
              </div>
            </div>
          </PixelCard>
        </div>
      </div>

      {/* Featured AI Agent Archetypes */}
      <div className="pt-4">
        <div className="text-center mb-8">
          <span className="font-pixel text-[9px] sm:text-[10px] text-emerald-400 uppercase tracking-widest block mb-2">
            AGENTIC ROLES
          </span>
          <h3 className="font-pixel text-base sm:text-xl text-white">
            THE AGENT ARCHETYPES
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Agent Alpha — Builder */}
          {agents.builder && (
            <PixelCard
              variant="grass"
              title={agents.builder.name}
              headerIcon="⛏"
              badge={<PixelBadge variant="grass">BUILDER</PixelBadge>}
              accentBarColor={agents.builder.color}
            >
              <span className="font-pixel text-[9px] text-emerald-400 block mb-2">
                {agents.builder.role}
              </span>
              <p className="font-sans text-xs text-neutral-300 leading-relaxed mb-4">
                {agents.builder.description}
              </p>
              <div className="p-2.5 bg-black/40 border border-emerald-900/60 font-pixel text-[8px] text-emerald-300">
                SDG FOCUS: {agents.builder.sdgFocus}
              </div>
            </PixelCard>
          )}

          {/* Agent Beta — Analyst */}
          {agents.analyst && (
            <PixelCard
              variant="stone"
              title={agents.analyst.name}
              headerIcon="📊"
              badge={<PixelBadge variant="diamond">ANALYST</PixelBadge>}
              accentBarColor={agents.analyst.color}
            >
              <span className="font-pixel text-[9px] text-sky-400 block mb-2">
                {agents.analyst.role}
              </span>
              <p className="font-sans text-xs text-neutral-300 leading-relaxed mb-4">
                {agents.analyst.description}
              </p>
              <div className="p-2.5 bg-black/40 border border-sky-900/60 font-pixel text-[8px] text-sky-300">
                SDG FOCUS: {agents.analyst.sdgFocus}
              </div>
            </PixelCard>
          )}

          {/* Agent Gamma — Innovator */}
          {agents.innovator && (
            <PixelCard
              variant="obsidian"
              title={agents.innovator.name}
              headerIcon="⚡"
              badge={<PixelBadge variant="obsidian">INNOVATOR</PixelBadge>}
              accentBarColor={agents.innovator.color}
            >
              <span className="font-pixel text-[9px] text-purple-400 block mb-2">
                {agents.innovator.role}
              </span>
              <p className="font-sans text-xs text-neutral-300 leading-relaxed mb-4">
                {agents.innovator.description}
              </p>
              <div className="p-2.5 bg-black/40 border border-purple-900/60 font-pixel text-[8px] text-purple-300">
                SDG FOCUS: {agents.innovator.sdgFocus}
              </div>
            </PixelCard>
          )}
        </div>
      </div>
    </SectionContainer>
  );
}
