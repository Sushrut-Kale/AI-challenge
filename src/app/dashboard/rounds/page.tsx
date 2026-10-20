'use client';

import React from 'react';
import Link from 'next/link';
import { INITIAL_TEAM_DATA } from '@/data/dashboardMock';

export default function RoundsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="pb-4 border-b-2 border-[#3d240e]">
        <span className="font-pixel text-[9px] text-amber-400 uppercase tracking-widest block font-bold mb-1">
          COMPETITION ROADMAP
        </span>
        <h1 className="font-pixel text-xl sm:text-2xl text-white uppercase font-bold tracking-wide">
          ROUNDS, SCHEDULE & EVALUATION STATUS
        </h1>
        <p className="text-xs text-neutral-300 font-sans mt-0.5">
          Follow your advancement through the Online Screening and Offline Grand Finale stages.
        </p>
      </div>

      {/* Rounds Progression Timeline */}
      <div className="space-y-5">
        {/* Round 1 Card */}
        <div className="p-6 border-3 border-amber-500 bg-[#1e1106] shadow-[inset_2px_2px_0_#6b3e17,0_8px_24px_rgba(0,0,0,0.6)] relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#3d230d]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 border-2 border-amber-500 bg-[#2b1708] flex items-center justify-center font-pixel text-lg text-amber-400 font-bold shadow-inner">
                R1
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-pixel text-sm sm:text-base text-white font-bold uppercase">
                    ROUND 1: ONLINE SCREENING EVALUATION
                  </h2>
                </div>
                <span className="font-pixel text-[9px] text-amber-300 block mt-0.5">
                  Deliverable Submission Window Active
                </span>
              </div>
            </div>

            <span className="px-3 py-1 bg-emerald-950 border border-emerald-500 font-pixel text-[9px] text-emerald-300 font-bold uppercase tracking-wider self-start sm:self-auto">
              ✓ SUBMISSION LOGGED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
            <div className="p-3 border border-[#3b220e] bg-[#120a04]">
              <span className="font-pixel text-[8px] text-neutral-400 uppercase block font-bold mb-1">
                DEADLINE
              </span>
              <span className="font-pixel text-xs text-red-400 font-bold">
                31st October 2026, 11:59 PM IST
              </span>
            </div>

            <div className="p-3 border border-[#3b220e] bg-[#120a04]">
              <span className="font-pixel text-[8px] text-neutral-400 uppercase block font-bold mb-1">
                EVALUATION FORMAT
              </span>
              <span className="text-neutral-200">
                Online evaluation of GitHub repository, PPT, documentation, and video demo.
              </span>
            </div>

            <div className="p-3 border border-[#3b220e] bg-[#120a04]">
              <span className="font-pixel text-[8px] text-neutral-400 uppercase block font-bold mb-1">
                SHORTLIST ANNOUNCEMENT
              </span>
              <span className="font-pixel text-xs text-amber-300 font-bold">
                5th November 2026
              </span>
            </div>
          </div>
        </div>

        {/* Round 2 Card */}
        <div className="p-6 border-3 border-[#3d240e] bg-[#140b04] relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#2d1b0d]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 border-2 border-[#543b22] bg-[#1c0f05] flex items-center justify-center font-pixel text-lg text-neutral-400 font-bold shadow-inner">
                R2
              </div>
              <div>
                <h2 className="font-pixel text-sm sm:text-base text-neutral-200 font-bold uppercase">
                  ROUND 2: OFFLINE GRAND FINALE
                </h2>
                <span className="font-pixel text-[9px] text-sky-400 block mt-0.5">
                  MIT Academy of Engineering, Alandi, Pune
                </span>
              </div>
            </div>

            <span className="px-3 py-1 bg-[#1e130a] border border-[#543b22] font-pixel text-[9px] text-neutral-400 font-bold uppercase tracking-wider self-start sm:self-auto">
              UPCOMING (POST-SHORTLIST)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
            <div className="p-3 border border-[#2d1909] bg-[#0d0702]">
              <span className="font-pixel text-[8px] text-neutral-400 uppercase block font-bold mb-1">
                FINALE DATE
              </span>
              <span className="font-pixel text-xs text-sky-300 font-bold">
                17th November 2026
              </span>
            </div>

            <div className="p-3 border border-[#2d1909] bg-[#0d0702]">
              <span className="font-pixel text-[8px] text-neutral-400 uppercase block font-bold mb-1">
                CAMPUS VENUE
              </span>
              <span className="text-neutral-200">
                Department of CSE-AIML, MIT AOE, Dehu Phata, Alandi, Pune.
              </span>
            </div>

            <div className="p-3 border border-[#2d1909] bg-[#0d0702]">
              <span className="font-pixel text-[8px] text-neutral-400 uppercase block font-bold mb-1">
                PRESENTATION FORMAT
              </span>
              <span className="text-neutral-200">
                In-person technical pitch & live multi-agent execution before jury panel.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Evaluator Feedback Card */}
      <div className="p-5 border-2 border-[#3d240e] bg-[#140b04] space-y-3">
        <h3 className="font-pixel text-xs text-amber-400 uppercase font-bold tracking-wider">
          ROUND 1 SCREENING REVIEW DESK
        </h3>
        <p className="text-xs text-neutral-300 font-sans leading-relaxed">
          Screening evaluation results and the list of shortlisted teams advancing to the MIT AOE Offline Grand Finale will be announced on 5th November 2026.
        </p>
        <div className="p-3 border border-[#2d1808] bg-[#0d0602] font-mono text-[11px] text-neutral-400">
          Status: Review pending panel assignment after 31st Oct submission closure.
        </div>
      </div>
    </div>
  );
}
