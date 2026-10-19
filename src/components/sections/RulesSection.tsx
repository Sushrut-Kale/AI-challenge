'use client';

import React from 'react';
import SectionContainer from '@/components/layout/SectionContainer';
import SectionHeading from '@/components/ui/SectionHeading';
import PixelCard from '@/components/ui/PixelCard';
import PixelBadge from '@/components/ui/PixelBadge';
import { EVENT_DATA } from '@/data/event';

export default function RulesSection() {
  const { details } = EVENT_DATA;

  return (
    <SectionContainer id="rules" variant="default" showTopSeam>
      <SectionHeading
        tag="CRITERIA & ELIGIBILITY"
        title="RULES & EVALUATION"
        subtitle="Verified team parameters, evaluation streams, and submission standards from the official AGENTCRAFT briefing."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Team & Registration Parameters */}
        <div className="lg:col-span-5 space-y-6">
          <PixelCard
            variant="wood"
            title="Team & Entry Parameters"
            headerIcon="📜"
            badge={<PixelBadge variant="gold">OFFICIAL</PixelBadge>}
          >
            <div className="space-y-4 font-sans text-xs sm:text-sm text-amber-100">
              <div className="p-3 bg-black/40 border border-amber-900/60">
                <span className="font-pixel text-[9px] text-amber-400 block uppercase mb-1">
                  Team Size
                </span>
                <span className="text-white font-medium">
                  {details.teamSize} + {details.mentorAllowed}
                </span>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Interdisciplinary combinations across engineering branches welcome.
                </p>
              </div>

              <div className="p-3 bg-black/40 border border-amber-900/60">
                <span className="font-pixel text-[9px] text-amber-400 block uppercase mb-1">
                  Registration Fee
                </span>
                <span className="text-emerald-400 font-pixel text-xs">
                  {details.registrationFee}
                </span>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Single nominal fee per team covering screening and offline finale access.
                </p>
              </div>

              <div className="p-3 bg-black/40 border border-amber-900/60">
                <span className="font-pixel text-[9px] text-amber-400 block uppercase mb-1">
                  Venue Location
                </span>
                <span className="text-white font-medium">
                  {details.venue}
                </span>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Round 1 online; Round 2 in-person presentation on campus.
                </p>
              </div>
            </div>
          </PixelCard>
        </div>

        {/* Right Column: Evaluation Streams & Guidelines */}
        <div className="lg:col-span-7 space-y-6">
          <PixelCard
            variant="stone"
            title="Two Dedicated Evaluation Tracks"
            headerIcon="⚖️"
            badge={<PixelBadge variant="emerald">FAIR EVALUATION</PixelBadge>}
          >
            <p className="font-sans text-sm text-neutral-300 leading-relaxed mb-6">
              To encourage budding engineers while providing a rigorous stage for senior developers,
              AGENTCRAFT partitions projects into two distinct judging categories:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* FY Stream */}
              <div className="p-4 bg-[#111e16] border-2 border-emerald-500/70">
                <PixelBadge variant="emerald" className="mb-2">
                  TRACK A
                </PixelBadge>
                <h4 className="font-pixel text-xs text-white uppercase mb-2">
                  FY (Separate Evaluation)
                </h4>
                <p className="font-sans text-xs text-emerald-200/90 leading-relaxed">
                  First Year innovators compete in their own dedicated bracket, evaluated on
                  conceptual understanding, creativity, and foundational agentic logic.
                </p>
              </div>

              {/* Upper Years Stream */}
              <div className="p-4 bg-[#151c2a] border-2 border-sky-500/70">
                <PixelBadge variant="diamond" className="mb-2">
                  TRACK B
                </PixelBadge>
                <h4 className="font-pixel text-xs text-white uppercase mb-2">
                  SY, TY, B.Tech Stream
                </h4>
                <p className="font-sans text-xs text-sky-200/90 leading-relaxed">
                  Senior innovators are evaluated on architectural rigor, multi-agent tool loops,
                  autonomous error recovery, and benchmark performance on SDG domains.
                </p>
              </div>
            </div>

            {/* Technical Framework Advisory */}
            <div className="p-4 bg-black/50 border border-neutral-700/80">
              <span className="font-pixel text-[9px] text-amber-400 uppercase tracking-wider block mb-1">
                Technical Advisory (Guidance)
              </span>
              <p className="font-sans text-xs text-neutral-300 leading-relaxed">
                Teams may implement solutions using Python, LangGraph, AutoGen, CrewAI, LlamaIndex,
                or custom agent runtime loops. Official submission portal guidelines and rubric weighting
                will be published to all registered teams ahead of Round 1.
              </p>
            </div>
          </PixelCard>
        </div>
      </div>
    </SectionContainer>
  );
}
