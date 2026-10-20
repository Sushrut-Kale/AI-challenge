'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { playMinecraftClick, playMinecraftPop } from '@/components/ui/MinecraftAudioManager';
import { INITIAL_TEAM_DATA, TeamData } from '@/data/dashboardMock';
import { getTeamData, getSubmissionData } from '@/lib/supabase';
import DashboardEmbers from '@/components/dashboard/DashboardEmbers';
import { useAuth } from '@/context/AuthContext';

const DASHBOARD_NAV = [
  { label: 'Overview', href: '/dashboard', icon: '/assets/items/compass.png', tag: 'HOME' },
  { label: 'My Team', href: '/dashboard/team', icon: '/assets/items/totem.png', tag: 'ROSTER' },
  { label: 'Submissions', href: '/dashboard/submissions', icon: '/assets/items/chest.png', tag: 'DELIVER' },
  { label: 'Rounds & Results', href: '/dashboard/rounds', icon: '/assets/items/diamond.png', tag: 'ARENA' },
  { label: 'Announcements', href: '/dashboard/announcements', icon: '/assets/items/torch.png', tag: 'BULLETIN' },
  { label: 'Profile & Help', href: '/dashboard/profile', icon: '/assets/items/book_quill.png', tag: 'CONFIG' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { team, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [xpPoints, setXpPoints] = useState(26);
  const [teamData, setTeamData] = useState<TeamData>(INITIAL_TEAM_DATA);
  const [activeHearts, setActiveHearts] = useState(0);

  useEffect(() => {
    getTeamData().then(setTeamData).catch(() => {});

    try {
      const cached = localStorage.getItem('agentcraft_team_submission');
      if (cached) {
        const parsed = JSON.parse(cached);
        let count = 0;
        if (parsed.githubUrl?.trim()) count++;
        if (parsed.pptUrl?.trim()) count++;
        if (parsed.docUrl?.trim()) count++;
        if (parsed.demoVideoUrl?.trim()) count++;
        setActiveHearts(count);
      } else {
        getSubmissionData().then((s) => {
          let count = 0;
          if (s.githubUrl?.trim()) count++;
          if (s.pptUrl?.trim()) count++;
          if (s.docUrl?.trim()) count++;
          if (s.demoVideoUrl?.trim()) count++;
          setActiveHearts(count);
        }).catch(() => {});
      }
    } catch {
      // ignore
    }
  }, [pathname]);

  const handleBonusXp = () => {
    setXpPoints((prev) => prev + 1);
    playMinecraftPop(1.5);
  };

  return (
    <div className="min-h-screen bg-[#0d0a07] text-neutral-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black relative">
      {/* Ambient Pixel Embers in Background */}
      <DashboardEmbers />

      {/* Top Dirt & Grass Themed Header with Bevels */}
      <header className="sticky top-0 z-40 border-b-4 border-[#1b1007] shadow-[0_12px_32px_rgba(0,0,0,0.9)]">
        {/* Top Grass Trim */}
        <div
          className="h-[8px] border-b border-[#1f2e14]"
          style={{
            backgroundImage: 'url(/assets/grass.png)',
            backgroundSize: '16px 16px',
            backgroundRepeat: 'repeat',
            imageRendering: 'pixelated',
          }}
          aria-hidden="true"
        />

        {/* Main Navbar Bar with Dirt Texture */}
        <div
          className="px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 border-b-2 border-[#3d2411]"
          style={{
            backgroundImage: 'url(/assets/dirt.png)',
            backgroundSize: '32px 32px',
            backgroundRepeat: 'repeat',
            imageRendering: 'pixelated',
          }}
        >
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => {
                playMinecraftClick();
                setSidebarOpen(!sidebarOpen);
              }}
              className="md:hidden w-9 h-9 border-2 border-[#543b22] bg-[#221307] flex items-center justify-center font-pixel text-amber-300 hover:bg-[#341d0b] shadow-[0_2px_0_#110803]"
              aria-label="Toggle Navigation"
            >
              ☰
            </button>

            {/* AGENTCRAFT Brand Link */}
            <Link
              href="/"
              onClick={() => playMinecraftClick()}
              className="flex items-center gap-2 transition-transform hover:scale-102"
            >
              <div className="relative h-7 sm:h-8 w-36 sm:w-44">
                <Image
                  src="/assets/agentcraft_navbar_logo.png"
                  alt="AGENTCRAFT"
                  fill
                  className="object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"
                  priority
                />
              </div>
              <span className="hidden sm:inline-block px-2 py-0.5 border border-amber-400/60 bg-[#140b04]/90 font-pixel text-[8px] text-amber-300 font-bold uppercase tracking-wider shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                TEAM PORTAL
              </span>
            </Link>
          </div>

          {/* Center XP Level Bar HUD (Authentic Minecraft HUD) */}
          <div className="hidden lg:flex flex-col items-center gap-0.5 px-4 py-1 border-2 border-[#3d240e] bg-[#140b05]/95 shadow-[inset_1px_1px_0_#543519,0_4px_12px_rgba(0,0,0,0.7)]">
            <div className="flex items-center gap-2">
              <span className="font-pixel text-[8px] text-amber-300 uppercase tracking-wider font-bold">
                TEAM LEVEL
              </span>
              <span className="font-pixel text-xs text-[#55ff55] font-bold drop-shadow-[0_0_6px_rgba(85,255,85,0.8)]">
                {xpPoints}
              </span>
              <span className="text-[10px] text-neutral-400 font-pixel">|</span>
              <span className="font-pixel text-[8px] text-emerald-300 font-bold">
                SCREENING READINESS: 100%
              </span>
            </div>

            {/* Green Experience Bar */}
            <div className="w-56 h-2 border border-black bg-[#0d0703] relative overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#22c55e] via-[#4ade80] to-[#86efac] animate-pulse"
                style={{ width: '85%' }}
              />
            </div>
          </div>

          {/* Right Header Navigation Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Authenticated Team Badge */}
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 border border-emerald-600/80 bg-emerald-950/80 font-pixel text-[9px] text-emerald-300 font-bold uppercase tracking-wider">
              ⚔ {team?.team_id || teamData.teamId || 'AC-001'}
            </span>

            {/* Logout Button */}
            <button
              type="button"
              onClick={async () => {
                playMinecraftClick();
                await logout();
                window.location.replace('/');
              }}
              className="px-2.5 sm:px-3 py-1.5 border-2 border-[#7f1d1d] bg-[#991b1b] hover:bg-[#b91c1c] font-pixel text-[9px] text-red-100 uppercase tracking-wider shadow-[inset_1px_1px_0_rgba(255,255,255,0.2),0_3px_0_#450a0a] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 inline-flex items-center gap-1 font-bold cursor-pointer"
              title="Logout from Team Portal"
            >
              EXIT
            </button>

            {/* Return to Public Website */}
            <Link
              href="/"
              onClick={() => playMinecraftClick()}
              className="px-2.5 sm:px-3 py-1.5 border-2 border-[#543b22] bg-[#2a1708] hover:bg-[#3d220b] font-pixel text-[9px] text-amber-300 uppercase tracking-wider shadow-[inset_1px_1px_0_rgba(255,255,255,0.2),0_3px_0_#140a03] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 inline-flex items-center gap-1 font-bold"
            >
              <span>←</span>
              <span className="hidden sm:inline">PUBLIC SITE</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Minecraft GUI Wood Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 md:static md:translate-x-0 transform transition-transform duration-200 ease-in-out border-r-4 border-[#3a220e] bg-[#1a0f06] flex flex-col justify-between shadow-[4px_0_24px_rgba(0,0,0,0.8)] ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
          style={{
            backgroundImage: `
              radial-gradient(circle at 10% 20%, rgba(245,158,11,0.06), transparent 40%),
              repeating-linear-gradient(0deg, #130a04 0px, #130a04 2px, transparent 2px, transparent 20px)
            `,
          }}
        >
          <div className="p-4 space-y-4 overflow-y-auto">
            {/* Team Identity Banner with Item Frame & Avatar */}
            <div className="p-3.5 border-3 border-[#4d2d14] bg-[#120a04] shadow-[inset_2px_2px_0_#75431b,inset_-2px_-2px_0_#0a0502,0_4px_16px_rgba(0,0,0,0.8)] relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="font-pixel text-[8px] text-amber-400 uppercase tracking-wider font-bold">
                  REGISTERED TEAM
                </span>
                <span className="px-1.5 py-0.5 bg-emerald-950 border border-emerald-500 font-pixel text-[8px] text-emerald-300 font-bold uppercase">
                  VERIFIED ✓
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 border-2 border-amber-500/80 bg-[#251508] flex items-center justify-center p-1 shadow-inner shrink-0">
                  <Image
                    src="/assets/items/emerald.png"
                    alt="Emerald"
                    width={28}
                    height={28}
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-pixel text-xs text-white leading-tight font-bold truncate">
                    {team?.team_name || teamData.teamName}
                  </h3>
                  <span className="font-mono text-[10px] text-amber-300 font-bold block mt-0.5">
                    {team?.team_id || teamData.teamId || 'AC-001'}
                  </span>
                </div>
              </div>

              {/* 4 Health Hearts for 4 Submissions (GitHub, PPT, Doc, Video) */}
              <div className="mt-3 pt-2 border-t border-[#291709] flex items-center justify-between">
                <span className="font-pixel text-[8px] text-neutral-400 uppercase">
                  DELIVERABLES ({activeHearts}/4):
                </span>
                <div className="flex items-center gap-1" title={`${activeHearts}/4 Deliverable Links Provided`}>
                  {[1, 2, 3, 4].map((i) => (
                    <span key={i} className="text-xs">
                      {i <= activeHearts ? '❤️' : '🖤'}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Minecraft Sidebar Navigation Buttons */}
            <nav className="space-y-2 font-pixel text-[11px]">
              {DASHBOARD_NAV.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      playMinecraftClick();
                      setSidebarOpen(false);
                    }}
                    className={`flex items-center justify-between px-3 py-2.5 border-2 transition-all group ${
                      isActive
                        ? 'border-amber-400 bg-[#3b200b] text-amber-300 shadow-[inset_2px_2px_0_#7a471b,0_4px_0_#140902] font-bold translate-x-1'
                        : 'border-[#38210d] bg-[#1c0f05] text-neutral-300 hover:border-amber-500/60 hover:bg-[#2a1608] hover:text-white shadow-[0_3px_0_#100702] active:translate-y-0.5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 relative shrink-0">
                        <Image
                          src={item.icon}
                          alt={item.label}
                          fill
                          className="object-contain"
                          style={{ imageRendering: 'pixelated' }}
                        />
                      </div>
                      <span className="uppercase tracking-wider text-[10px] sm:text-[11px]">
                        {item.label}
                      </span>
                    </div>

                    <span
                      className={`text-[8px] px-1 py-0.5 rounded uppercase font-bold ${
                        isActive
                          ? 'bg-amber-400 text-black'
                          : 'bg-black/50 text-neutral-500 group-hover:text-amber-300'
                      }`}
                    >
                      {item.tag}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer with Easter Egg & Coordinator Desk */}
          <div className="p-4 border-t-2 border-[#331c0a] bg-[#120903] space-y-2.5">
            {/* Clickable XP Easter Egg */}
            <button
              type="button"
              onClick={handleBonusXp}
              className="w-full py-1.5 border border-dashed border-amber-600/50 bg-[#1f1005] hover:bg-[#2b1708] font-pixel text-[8px] text-amber-400 uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>⛏️</span>
              <span>CLICK TO GAIN XP (+1)</span>
            </button>

            <div className="text-[10px] text-neutral-400 leading-snug">
              <span className="font-pixel text-[8px] text-amber-400 uppercase block font-bold mb-0.5">
                ORGANIZER HELPDESK
              </span>
              Ashish Lenka: +91 81170 31180
              <br />
              <span className="text-sky-400 font-mono text-[9px]">
                astra.cseaiml@mitaoe.ac.in
              </span>
            </div>

            <Link
              href="/"
              onClick={() => playMinecraftClick()}
              className="w-full block text-center py-1.5 border border-[#4a2e16] bg-[#1a0f06] hover:bg-[#261509] font-pixel text-[9px] text-neutral-300 uppercase tracking-wider transition-colors"
            >
              🚪 Exit to Home
            </Link>
          </div>
        </aside>

        {/* Backdrop for mobile drawer */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-black/80 backdrop-blur-xs md:hidden"
          />
        )}

        {/* Main Content Viewport */}
        <main
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 0%, rgba(217,119,6,0.06) 0%, transparent 60%),
              radial-gradient(circle at 100% 100%, rgba(16,185,129,0.04) 0%, transparent 50%),
              repeating-linear-gradient(0deg, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 2px, transparent 2px, transparent 8px)
            `,
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
