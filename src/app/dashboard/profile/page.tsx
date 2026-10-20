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
