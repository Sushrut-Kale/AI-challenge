'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { INITIAL_TEAM_DATA, TeamData } from '@/data/dashboardMock';
import { getTeamData } from '@/lib/supabase';

export default function MyTeamPage() {
  const [team, setTeam] = useState<TeamData>(INITIAL_TEAM_DATA);

  useEffect(() => {
    getTeamData().then(setTeam).catch(() => {});
  }, []);

  const { members, teamName, teamId, unstopId, track, college } = team;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2 border-[#3d240e]">
        <div>
          <span className="font-pixel text-[9px] text-amber-400 uppercase tracking-widest block font-bold mb-1">
            PARTICIPANT ROSTER
          </span>
          <h1 className="font-pixel text-xl sm:text-2xl text-white uppercase font-bold tracking-wide">
            MY TEAM — {teamName}
          </h1>
          <p className="text-xs text-neutral-300 font-sans mt-0.5">
            Verified registration imported from Unstop. Team composition is locked for Round 1.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 border border-emerald-500 bg-emerald-950 font-pixel text-[9px] text-emerald-300 font-bold uppercase tracking-wider">
            ✓ COMPOSITION VERIFIED
          </span>
        </div>
      </div>

      {/* Team Meta Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 border-2 border-[#472c15] bg-[#160d05]">
          <span className="font-pixel text-[8px] text-neutral-400 uppercase block font-bold">
            ASSIGNED TRACK
          </span>
          <div className="font-pixel text-xs text-amber-300 font-bold mt-1">{track}</div>
        </div>

        <div className="p-4 border-2 border-[#472c15] bg-[#160d05]">
          <span className="font-pixel text-[8px] text-neutral-400 uppercase block font-bold">
            INSTITUTION / CAMPUS
          </span>
          <div className="font-pixel text-xs text-white font-bold mt-1">{college}</div>
        </div>

        <div className="p-4 border-2 border-[#472c15] bg-[#160d05]">
          <span className="font-pixel text-[8px] text-neutral-400 uppercase block font-bold">
            UNSTOP IDENTIFIER
          </span>
          <div className="font-mono text-xs text-emerald-400 font-bold mt-1">{unstopId}</div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="space-y-3">
        <h2 className="font-pixel text-sm text-amber-400 uppercase font-bold tracking-wider">
          REGISTERED MEMBERS ({members.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {members.map((member) => (
            <div
              key={member.id}
              className={`p-5 border-2 relative ${
                member.isLeader
                  ? 'border-amber-500 bg-[#221307] shadow-[inset_2px_2px_0_#6b3e17,0_6px_16px_rgba(0,0,0,0.6)]'
                  : 'border-[#3d240f] bg-[#140b04]'
              }`}
            >
              {member.isLeader && (
                <div className="absolute top-3 right-3 px-2 py-0.5 border border-amber-400 bg-amber-950 font-pixel text-[8px] text-amber-300 font-bold uppercase">
                  👑 TEAM LEADER
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border border-[#5a381b] bg-[#140902] flex items-center justify-center font-pixel text-sm text-amber-400 shadow-inner">
                    {member.isLeader ? '👑' : '🧑‍💻'}
                  </div>
                  <div>
                    <h3 className="font-pixel text-sm text-white font-bold">{member.name}</h3>
                    <span className="font-pixel text-[9px] text-amber-300/90 block">
                      {member.role}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#311c0c] space-y-1 text-xs">
                  <div className="text-neutral-400">
                    <span className="font-pixel text-[8px] uppercase text-neutral-500 mr-2">
                      Academic Year:
                    </span>
                    <span className="text-neutral-200">{member.year}</span>
                  </div>
                  <div className="text-neutral-400">
                    <span className="font-pixel text-[8px] uppercase text-neutral-500 mr-2">
                      Department:
                    </span>
                    <span className="text-neutral-200">{member.college}</span>
                  </div>
                  <div className="text-neutral-400">
                    <span className="font-pixel text-[8px] uppercase text-neutral-500 mr-2">
                      Email:
                    </span>
                    <span className="text-sky-400 font-mono text-[11px]">{member.email}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Composition Modification Notice */}
      <div className="p-4 border-2 border-[#38200c] bg-[#120a04] text-xs text-neutral-400 flex items-start gap-3">
        <span className="text-xl">🔒</span>
        <div>
          <span className="font-pixel text-[9px] text-amber-400 uppercase font-bold block mb-1">
            TEAM COMPOSITION NOTICE
          </span>
          <p className="leading-relaxed">
            Per AGENTCRAFT competition regulations, team member adjustments, substitutions, or track transfers require formal authorization from the organizing committee. If an emergency change is required, contact the organizing team at{' '}
            <a
              href="mailto:astra.cseaiml@mitaoe.ac.in"
              className="text-amber-300 underline font-mono"
            >
              astra.cseaiml@mitaoe.ac.in
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
