'use client';

import React, { useState, useEffect } from 'react';
import { playMinecraftClick, playMinecraftPop } from '@/components/ui/MinecraftAudioManager';
import { INITIAL_TEAM_DATA, TeamData } from '@/data/dashboardMock';
import { getTeamData } from '@/lib/supabase';

export default function ProfilePage() {
  const [team, setTeam] = useState<TeamData>(INITIAL_TEAM_DATA);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    getTeamData().then(setTeam).catch(() => {});
  }, []);

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    playMinecraftClick();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setFeedback('Error: All password fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setFeedback('Error: New password and confirmation do not match.');
      return;
    }
    playMinecraftPop(1.4);
    setFeedback('✓ Team access password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="pb-4 border-b-2 border-[#3d240e]">
        <span className="font-pixel text-[9px] text-amber-400 uppercase tracking-widest block font-bold mb-1">
          CREDENTIALS & SUPPORT
        </span>
        <h1 className="font-pixel text-xl sm:text-2xl text-white uppercase font-bold tracking-wide">
          TEAM ACCOUNT & COORDINATOR HELPDESK
        </h1>
        <p className="text-xs text-neutral-300 font-sans mt-0.5">
          Manage your team authentication credentials and access official coordinator assistance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Details Card */}
        <div className="p-5 border-2 border-[#472c15] bg-[#160d05] space-y-4">
          <h2 className="font-pixel text-xs sm:text-sm text-amber-400 uppercase font-bold tracking-wider pb-2 border-b border-[#2d1b0d]">
            TEAM CREDENTIAL PROFILE
          </h2>

          <div className="space-y-3 text-xs font-sans">
            <div>
              <span className="font-pixel text-[8px] text-neutral-400 uppercase block font-bold">
                TEAM IDENTIFIER
              </span>
              <span className="font-pixel text-xs text-amber-300 font-bold block mt-0.5">
                {team.teamId}
              </span>
            </div>

            <div>
              <span className="font-pixel text-[8px] text-neutral-400 uppercase block font-bold">
                PRIMARY TEAM LEADER EMAIL
              </span>
              <span className="font-mono text-xs text-sky-400 font-bold block mt-0.5">
                {team.members[0]?.email || 'leader@example.com'}
              </span>
            </div>

            <div>
              <span className="font-pixel text-[8px] text-neutral-400 uppercase block font-bold">
                UNSTOP REGISTRATION ID
              </span>
              <span className="font-mono text-xs text-emerald-400 font-bold block mt-0.5">
                {team.unstopId}
              </span>
            </div>

            <div>
              <span className="font-pixel text-[8px] text-neutral-400 uppercase block font-bold">
                ASSIGNED CHALLENGE TRACK
              </span>
              <span className="text-neutral-200 font-medium block mt-0.5">
                {team.track}
              </span>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="p-5 border-2 border-[#472c15] bg-[#160d05] space-y-4">
          <h2 className="font-pixel text-xs sm:text-sm text-amber-400 uppercase font-bold tracking-wider pb-2 border-b border-[#2d1b0d]">
            UPDATE ACCESS PASSWORD
          </h2>

          {feedback && (
            <div
              className={`p-2.5 text-xs font-pixel ${
                feedback.startsWith('✓')
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                  : 'bg-red-950 text-red-300 border border-red-500'
              }`}
            >
              {feedback}
            </div>
          )}

          <form onSubmit={handlePasswordUpdate} className="space-y-3">
            <div>
              <label className="block font-pixel text-[8px] text-neutral-400 uppercase tracking-widest mb-1">
                CURRENT PASSWORD
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-[#0c0602] border border-[#3b220e] text-neutral-100 font-sans text-xs focus:border-amber-400 outline-none"
              />
            </div>

            <div>
              <label className="block font-pixel text-[8px] text-neutral-400 uppercase tracking-widest mb-1">
                NEW ACCESS PASSWORD
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-[#0c0602] border border-[#3b220e] text-neutral-100 font-sans text-xs focus:border-amber-400 outline-none"
              />
            </div>

            <div>
              <label className="block font-pixel text-[8px] text-neutral-400 uppercase tracking-widest mb-1">
                CONFIRM NEW PASSWORD
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-[#0c0602] border border-[#3b220e] text-neutral-100 font-sans text-xs focus:border-amber-400 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 border-2 border-[#7a4f05] bg-[#fbbf24] hover:bg-[#f59e0b] font-pixel text-[10px] text-black font-bold uppercase tracking-wider shadow-[0_2px_0_#382403] transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
            >
              SAVE NEW PASSWORD
            </button>
          </form>
        </div>
      </div>

      {/* Official Challenge Downloads & Templates Card */}
      <div className="p-5 border-2 border-amber-600/80 bg-[#1e1106] shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#3d230d]">
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <h2 className="font-pixel text-xs sm:text-sm text-amber-300 uppercase font-bold tracking-wider">
              OFFICIAL CHALLENGE TEMPLATES & DOWNLOADS
            </h2>
          </div>
          <span className="font-pixel text-[8px] px-2 py-0.5 bg-amber-400 text-black font-bold uppercase self-start sm:self-auto">
            ROUND 1 ASSETS
          </span>
        </div>

        <p className="text-xs text-neutral-300 font-sans leading-relaxed">
          All registered participants must use the official 9-slide presentation template for Round 1 screening submission.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* PPT Template */}
          <div className="p-3.5 border-2 border-amber-500/70 bg-[#2b1708] flex flex-col justify-between gap-3 shadow-inner">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-pixel text-[8px] text-amber-400 uppercase font-bold">
                  MANDATORY SLIDES
                </span>
                <span className="font-pixel text-[8px] px-1 py-0.5 bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  PPTX
                </span>
              </div>
              <h3 className="font-pixel text-xs text-white font-bold mb-1">
                Round 1 Pitch Template
              </h3>
              <p className="text-[11px] text-neutral-300 font-sans">
                Official 9-slide deck required for online screening.
              </p>
            </div>
            <a
              href="/docs/AgentCraft_Template.pptx"
              download="AgentCraft_Template.pptx"
              onClick={() => playMinecraftClick()}
              className="w-full py-2 border-2 border-[#7a4f05] bg-[#fbbf24] hover:bg-[#f59e0b] font-pixel text-[9px] text-black font-bold uppercase tracking-wider text-center shadow-[inset_1px_1px_0_#fff,0_2px_0_#382403] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer"
            >
              ⬇ DOWNLOAD PPTX
            </a>
          </div>

          {/* Official Rulebook */}
          <div className="p-3.5 border border-[#3b220e] bg-[#120a04] flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-pixel text-[8px] text-emerald-400 uppercase font-bold">
                  REGULATIONS
                </span>
                <span className="font-pixel text-[8px] px-1 py-0.5 bg-emerald-400/20 text-emerald-300 border border-emerald-400/40">
                  PDF
                </span>
              </div>
              <h3 className="font-pixel text-xs text-white font-bold mb-1">
                Official Rulebook (v1.0)
              </h3>
              <p className="text-[11px] text-neutral-300 font-sans">
                14-page charter covering eligibility, streams & rubric.
              </p>
            </div>
            <a
              href="/docs/AgentCraft_Official_Rulebook.pdf"
              download="AgentCraft_Official_Rulebook.pdf"
              onClick={() => playMinecraftClick()}
              className="w-full py-2 border border-[#065f46] bg-[#059669] hover:bg-[#10b981] font-pixel text-[9px] text-white font-bold uppercase tracking-wider text-center shadow-[inset_1px_1px_0_rgba(255,255,255,0.2)] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer"
            >
              ⬇ DOWNLOAD PDF
            </a>
          </div>

          {/* Problem Tracks */}
          <div className="p-3.5 border border-[#3b220e] bg-[#120a04] flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-pixel text-[8px] text-sky-400 uppercase font-bold">
                  SPECS
                </span>
                <span className="font-pixel text-[8px] px-1 py-0.5 bg-sky-400/20 text-sky-300 border border-sky-400/40">
                  PDF
                </span>
              </div>
              <h3 className="font-pixel text-xs text-white font-bold mb-1">
                Challenge Problem Tracks
              </h3>
              <p className="text-[11px] text-neutral-300 font-sans">
                Detailed problem requirements & engineering standards.
              </p>
            </div>
            <a
              href="/docs/AgentCraft_Problem_Tracks.pdf"
              download="AgentCraft_Problem_Tracks.pdf"
              onClick={() => playMinecraftClick()}
              className="w-full py-2 border border-[#0369a1] bg-[#0284c7] hover:bg-[#38bdf8] font-pixel text-[9px] text-white font-bold uppercase tracking-wider text-center shadow-[inset_1px_1px_0_rgba(255,255,255,0.2)] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer"
            >
              ⬇ DOWNLOAD SPECS
            </a>
          </div>
        </div>
      </div>

      {/* Official Helpdesk Desk Card */}
      <div className="p-5 border-2 border-emerald-600/80 bg-[#102419] shadow-md space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">📞</span>
          <h2 className="font-pixel text-xs sm:text-sm text-emerald-300 uppercase font-bold tracking-wider">
            OFFICIAL STUDENT COORDINATOR HELPDESK
          </h2>
        </div>

        <p className="text-xs text-emerald-100 font-sans leading-relaxed">
          For technical portal issues, Unstop registration reconciliation, or screening inquiries, please contact the organizing desk:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-sans">
          <div className="p-3 border border-emerald-500/50 bg-[#091a11]">
            <span className="font-pixel text-[8px] text-emerald-400 uppercase block font-bold mb-0.5">
              STUDENT COORDINATOR
            </span>
            <span className="text-white font-pixel text-xs font-bold">Ashish Lenka</span>
          </div>

          <div className="p-3 border border-emerald-500/50 bg-[#091a11]">
            <span className="font-pixel text-[8px] text-emerald-400 uppercase block font-bold mb-0.5">
              PHONE HELPLINE
            </span>
            <a
              href="tel:+918117031180"
              className="text-emerald-300 font-pixel text-xs font-bold hover:underline"
            >
              +91 81170 31180
            </a>
          </div>

          <div className="p-3 border border-emerald-500/50 bg-[#091a11]">
            <span className="font-pixel text-[8px] text-emerald-400 uppercase block font-bold mb-0.5">
              OFFICIAL EMAIL
            </span>
            <a
              href="mailto:astra.cseaiml@mitaoe.ac.in"
              className="text-sky-300 font-mono text-[11px] font-bold hover:underline break-all"
            >
              astra.cseaiml@mitaoe.ac.in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
