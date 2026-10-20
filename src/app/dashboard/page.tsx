'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  playMinecraftClick,
  playMinecraftPop,
} from '@/components/ui/MinecraftAudioManager';
import {
  INITIAL_TEAM_DATA,
  INITIAL_SUBMISSION_DATA,
  OFFICIAL_RESOURCES,
  INITIAL_ANNOUNCEMENTS,
  TeamData,
  SubmissionData,
} from '@/data/dashboardMock';
import { getTeamData, getSubmissionData } from '@/lib/supabase';

const TACTICAL_TIPS = [
  'Pro Tip 1: Ensure all Google Drive & YouTube links are set to "Anyone with the link can view" to avoid evaluation penalties!',
  'Pro Tip 2: Ensure your demo video is at least 5-6 minutes showing autonomous agent task completion, tool invocation, and terminal execution.',
  'Pro Tip 3: Need urgent coordination? Ashish Lenka (+91 81170 31180) and astra.cseaiml@mitaoe.ac.in are available 24/7.',
  'Pro Tip 4: Top 40 shortlisted teams qualify for the Offline Grand Finale at MIT AOE Pune on 17 Nov 2026 for ₹1,00,000+ prizes!',
];

export default function DashboardOverviewPage() {
  const [tipIndex, setTipIndex] = useState(0);
  const [copiedToken, setCopiedToken] = useState(false);
  const [activeQuest, setActiveQuest] = useState<number | null>(4);
  const [teamData, setTeamData] = useState<TeamData>(INITIAL_TEAM_DATA);
  const [submissionData, setSubmissionData] = useState<SubmissionData>(INITIAL_SUBMISSION_DATA);

  // Live Countdown to Round 1 Deadline: 31 Oct 2026 23:59:59 IST
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    getTeamData().then(setTeamData).catch(() => {});

    try {
      const cached = localStorage.getItem('agentcraft_team_submission');
      if (cached) {
        setSubmissionData(JSON.parse(cached));
      } else {
        getSubmissionData().then(setSubmissionData).catch(() => {});
      }
    } catch {
      getSubmissionData().then(setSubmissionData).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const targetDate = new Date('2026-10-31T23:59:59+05:30').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, targetDate - now);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyTeamId = () => {
    playMinecraftPop(1.4);
    navigator.clipboard?.writeText(teamData.teamId);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2500);
  };

  const handleNextTip = () => {
    playMinecraftClick();
    setTipIndex((prev) => (prev + 1) % TACTICAL_TIPS.length);
  };

  const deliverables = [
    {
      id: 'github',
      title: 'GITHUB REPOSITORY',
      url: submissionData.githubUrl,
      icon: '/assets/items/diamond.png',
      openText: 'Open Repo ↗',
      desc: 'Public or jury-accessible codebase with README, agents logic, and SDG mapping.',
      btnColor: 'border-sky-500/70 bg-[#0f283d]/80 text-sky-300',
    },
    {
      id: 'ppt',
      title: 'PRESENTATION PPT',
      url: submissionData.pptUrl,
      icon: '/assets/items/golden_apple.png',
      openText: 'Open Slides ↗',
      desc: 'Official slide deck following the AGENTCRAFT template.',
      btnColor: 'border-amber-500/70 bg-[#2d1b08] text-amber-300',
    },
    {
      id: 'doc',
      title: 'TECH REPORT / DOC',
      url: submissionData.docUrl,
      icon: '/assets/items/book_quill.png',
      openText: 'Open Document ↗',
      desc: 'Architecture diagram, SDG impact metric, and multi-agent interaction flow.',
      btnColor: 'border-purple-500/70 bg-[#240e38] text-purple-300',
    },
    {
      id: 'video',
      title: 'DEMO VIDEO (5-6 MIN)',
      url: submissionData.demoVideoUrl,
      icon: '/assets/items/ender_eye.png',
      openText: 'Watch Video ↗',
      desc: 'Screen recording (min 5-6 minutes) demonstrating working agent autonomous execution & UI.',
      btnColor: 'border-emerald-500/70 bg-[#0d2a1d] text-emerald-300',
    },
  ];

  const readyCount = deliverables.filter((d) => Boolean(d.url?.trim())).length;

  const questStages = [
    { id: 1, title: 'REGISTRATION', desc: 'Team Registered on Unstop', status: 'COMPLETED', xp: '+100 XP', icon: '📜' },
    { id: 2, title: 'VERIFICATION', desc: 'Roster & College Verified', status: 'COMPLETED', xp: '+150 XP', icon: '🛡️' },
    { id: 3, title: 'BLUEPRINT', desc: 'Official PPT & Docs Crafted', status: 'COMPLETED', xp: '+200 XP', icon: '⛏️' },
    { id: 4, title: 'DELIVERABLES', desc: 'Link Submission V1 Dispatched', status: submissionData.status === 'submitted' ? 'SUBMITTED' : 'IN PROGRESS', xp: '+300 XP', icon: '📦' },
    { id: 5, title: 'SCREENING', desc: 'Online Jury Evaluation', status: 'OCT 31', xp: 'PENDING', icon: '⚖️' },
    { id: 6, title: 'GRAND FINALE', desc: 'Offline Arena at MIT AOE Pune', status: 'NOV 17', xp: '₹1L POOL', icon: '🏛️' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200 relative z-10 pb-12">
      {/* 1. Live Countdown Ticker Banner */}
      <div className="p-4 border-3 border-[#5a3818] bg-gradient-to-r from-[#211206] via-[#2d1808] to-[#1c0e04] shadow-[inset_1px_1px_0_#7a4d22,0_8px_24px_rgba(0,0,0,0.8)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-red-500/80 bg-red-950/60 flex items-center justify-center text-xl shrink-0 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.5)]">
            ⏳
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-pixel text-[9px] text-red-400 font-bold uppercase tracking-wider">
                DEADLINE COUNTDOWN
              </span>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            </div>
            <h2 className="font-pixel text-xs sm:text-sm text-neutral-100 font-bold mt-0.5">
              ROUND 1 ONLINE SCREENING SUBMISSIONS
            </h2>
            <p className="text-[11px] text-neutral-400 font-sans">
              Strict cut-off: 31st October 2026, 11:59 PM IST
            </p>
          </div>
        </div>

        {/* 4 Digital Pixel Countdown Boxes */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {[
            { label: 'DAYS', val: timeLeft.days },
            { label: 'HOURS', val: timeLeft.hours },
            { label: 'MINS', val: timeLeft.minutes },
            { label: 'SECS', val: timeLeft.seconds },
          ].map((item) => (
            <div
              key={item.label}
              className="p-2 sm:p-2.5 min-w-[54px] sm:min-w-[62px] border-2 border-[#472c15] bg-[#120a03] text-center shadow-[inset_1px_1px_0_#6b411d,0_3px_0_#0a0502]"
            >
              <span className="font-pixel text-sm sm:text-lg text-amber-300 font-bold block tabular-nums">
                {String(item.val).padStart(2, '0')}
              </span>
              <span className="font-pixel text-[7px] text-neutral-400 uppercase tracking-wider block mt-0.5">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Top Banner Card with Enchanted Foil Effect */}
      <div className="relative p-6 sm:p-8 border-4 border-[#523318] bg-[#1a0f07] shadow-[inset_2px_2px_0_#754822,0_16px_36px_rgba(0,0,0,0.85)] overflow-hidden">
        {/* Minecraft grid block motif */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage:
              'linear-gradient(to right, #381f0b 1px, transparent 1px), linear-gradient(to bottom, #381f0b 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-amber-950 border border-amber-500/70 font-pixel text-[9px] text-amber-300 font-bold uppercase tracking-wider">
                TEAM PORTAL ACTIVE
              </span>
              <span className="px-2.5 py-1 bg-emerald-950 border border-emerald-500 font-pixel text-[9px] text-emerald-300 font-bold uppercase tracking-wider mc-enchanted-foil">
                ✓ REGISTRATION VERIFIED
              </span>
              <span className="px-2 py-1 bg-purple-950 border border-purple-500 font-pixel text-[9px] text-purple-300 font-bold uppercase">
                SDG TRACK ASSIGNED
              </span>
            </div>

            <h1 className="font-pixel text-xl sm:text-2xl md:text-3xl text-white tracking-wide font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              WELCOME, {teamData.teamName.toUpperCase()}
            </h1>

            <p className="text-sm text-neutral-300 font-sans max-w-2xl leading-relaxed">
              Assigned Track:{' '}
              <span className="text-amber-300 font-bold">
                {teamData.track}
              </span>
              . Review your deliverables status for the Round 1 Screening evaluation.
            </p>
          </div>

          {/* Interactive Official Team ID Box with Copy */}
          <div className="shrink-0 p-4 border-3 border-[#543519] bg-[#120a04] text-center shadow-[inset_2px_2px_0_#2b1809,0_4px_0_#0a0502]">
            <span className="font-pixel text-[9px] text-neutral-400 uppercase block font-bold">
              OFFICIAL TEAM ID
            </span>
            <span className="font-pixel text-lg sm:text-xl text-amber-400 font-bold block mt-1 tracking-wider">
              {teamData.teamId}
            </span>
            <span className="text-[10px] text-neutral-400 font-mono mt-0.5 block">
              Ref: {teamData.unstopId}
            </span>
            <button
              type="button"
              onClick={handleCopyTeamId}
              className="mt-2.5 w-full px-3 py-1 border border-amber-600/70 bg-[#2b1708] hover:bg-[#3d200b] font-pixel text-[8px] text-amber-300 uppercase font-bold transition-colors cursor-pointer"
            >
              {copiedToken ? '✓ COPIED!' : '📋 COPY ID'}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Deliverables Showcase with 3D Beveled Item Frames */}
      <div className="p-6 border-3 border-[#4d2d14] bg-[#160e06] shadow-[inset_2px_2px_0_#663d1c,0_10px_30px_rgba(0,0,0,0.8)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2d1b0d]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-pixel text-sm sm:text-base text-amber-300 uppercase font-bold tracking-wider">
                PROJECT DELIVERABLES INVENTORY
              </h2>
              <span className={`px-2 py-0.5 border font-pixel text-[8px] font-bold ${
                readyCount === 4
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                  : 'bg-amber-950 border-amber-500 text-amber-300'
              }`}>
                {readyCount} / 4 READY
              </span>
            </div>
            <p className="text-xs text-neutral-300 font-sans mt-0.5">
              Round 1 deliverables are evaluated by the technical jury based on valid shareable URLs.
            </p>
          </div>

          <Link
            href="/dashboard/submissions"
            onClick={() => playMinecraftClick()}
            className="px-4 py-2.5 border-2 border-[#7a4f05] bg-[#fbbf24] hover:bg-[#f59e0b] font-pixel text-[10px] text-black font-bold uppercase tracking-wider shadow-[inset_1px_1px_0_#fff,0_4px_0_#382403] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 text-center shrink-0"
          >
            EDIT / SUBMIT DELIVERABLES ↗
          </Link>
        </div>

        {/* 4 Authentic Minecraft Item Frame Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {deliverables.map((item) => {
            const hasUrl = Boolean(item.url && item.url.trim().length > 0);
            return (
              <div
                key={item.id}
                className="p-4 border-2 border-[#452912] bg-[#110a04] shadow-[inset_1px_1px_0_#693e1a] flex flex-col justify-between group hover:border-amber-400/70 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 border-3 border-[#583d29] bg-[#2a1d12] shadow-[inset_2px_2px_0_#7a5438,inset_-2px_-2px_0_#1b120a] flex items-center justify-center p-1.5 shrink-0 group-hover:scale-105 transition-transform">
                      <Image
                        src={item.icon}
                        alt={item.title}
                        width={32}
                        height={32}
                        className="w-7 h-7 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                      />
                    </div>
                    <span
                      className={`font-pixel text-[8px] px-2 py-0.5 border font-bold uppercase ${
                        hasUrl
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                          : 'bg-neutral-900 text-neutral-400 border-neutral-700'
                      }`}
                    >
                      {hasUrl ? 'ACTIVE ✓' : 'PENDING'}
                    </span>
                  </div>

                  <h3 className="font-pixel text-xs text-amber-300 font-bold mb-1">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-neutral-400 font-mono truncate bg-[#0a0502] p-1.5 border border-[#2b1708]">
                    {hasUrl ? item.url : 'No link submitted yet'}
                  </p>
                  <div className="mt-2 text-[10px] text-neutral-400 leading-tight">
                    {item.desc}
                  </div>
                </div>

                {hasUrl ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => playMinecraftPop(1.2)}
                    className={`mt-3.5 w-full py-1.5 border font-pixel text-[9px] text-center uppercase font-bold tracking-wider block transition-colors ${item.btnColor}`}
                  >
                    {item.openText}
                  </a>
                ) : (
                  <Link
                    href="/dashboard/submissions"
                    onClick={() => playMinecraftClick()}
                    className="mt-3.5 w-full py-1.5 border border-amber-600/60 bg-[#251508] hover:bg-[#341d0b] font-pixel text-[9px] text-amber-300 text-center uppercase font-bold tracking-wider block transition-colors"
                  >
                    + Submit Link ↗
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Interactive AGENTCRAFT Quest Progression Map */}
      <div className="p-6 border-3 border-[#4a2e16] bg-[#170e06] shadow-[inset_2px_2px_0_#683f1d,0_8px_24px_rgba(0,0,0,0.7)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#2b1809]">
          <div className="flex items-center gap-2">
            <span className="text-xl">🗺️</span>
            <h2 className="font-pixel text-sm sm:text-base text-amber-300 uppercase font-bold tracking-wider">
              AGENTCRAFT CAMPAIGN QUESTLINE
            </h2>
          </div>
          <span className="font-pixel text-[9px] text-neutral-400">
            CURRENT PROGRESS: {readyCount === 4 ? 'STAGE 4 OF 6' : 'STAGE 3 OF 6'}
          </span>
        </div>

        {/* 6 Stage Quest Roadmap */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {questStages.map((st) => {
            const isSelected = activeQuest === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => {
                  playMinecraftClick();
                  setActiveQuest(st.id);
                }}
                className={`p-3 border-2 text-left flex flex-col justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 bg-[#341c09] shadow-[inset_1px_1px_0_#784419,0_4px_0_#140802] -translate-y-1'
                    : 'border-[#38200d] bg-[#140b04] hover:bg-[#201106] hover:border-amber-600/60 shadow-[0_2px_0_#0a0502]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-base">{st.icon}</span>
                    <span
                      className={`font-pixel text-[7px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        st.status === 'COMPLETED'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                          : st.status === 'SUBMITTED'
                          ? 'bg-amber-950 text-amber-300 border border-amber-600'
                          : 'bg-neutral-900 text-neutral-400 border border-neutral-700'
                      }`}
                    >
                      {st.status}
                    </span>
                  </div>
                  <h4 className="font-pixel text-[10px] text-white font-bold leading-tight">
                    {st.title}
                  </h4>
                  <p className="text-[10px] text-neutral-400 font-sans mt-0.5 leading-snug line-clamp-2">
                    {st.desc}
                  </p>
                </div>

                <div className="mt-3 pt-1.5 border-t border-[#291708] flex items-center justify-between">
                  <span className="font-pixel text-[8px] text-amber-400 font-bold">
                    {st.xp}
                  </span>
                  <span className="text-[9px] text-neutral-500">
                    {isSelected ? '▼' : '›'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Mascot Tactical Advisor Widget */}
      <div className="p-4 sm:p-5 border-3 border-[#4d2d14] bg-[#191007] shadow-[inset_2px_2px_0_#693e1a,0_8px_20px_rgba(0,0,0,0.8)] flex flex-col md:flex-row items-center gap-4">
        {/* Mascot Avatar */}
        <div className="relative w-16 h-16 shrink-0 border-2 border-amber-500/70 bg-[#251508] p-1 shadow-inner group">
          <Image
            src="/assets/agentcraft_mascot.png"
            alt="Agentcraft Assistant"
            fill
            className="object-contain p-1 group-hover:scale-105 transition-transform"
          />
        </div>

        {/* Speech Bubble */}
        <div className="flex-1 bg-[#120a04] p-3 sm:p-4 border-2 border-[#3d240e] shadow-inner relative">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-pixel text-[9px] text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span>🤖</span>
              <span>AGENTCRAFT TACTICAL ADVISOR</span>
            </span>
            <span className="font-pixel text-[8px] text-neutral-400">
              TIP {tipIndex + 1} OF {TACTICAL_TIPS.length}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-neutral-200 font-sans leading-relaxed">
            {TACTICAL_TIPS[tipIndex]}
          </p>
        </div>

        {/* Cycle Tip Button */}
        <button
          type="button"
          onClick={handleNextTip}
          className="shrink-0 px-3.5 py-2.5 border-2 border-amber-600 bg-[#2b1708] hover:bg-[#3d200b] font-pixel text-[9px] text-amber-300 uppercase font-bold tracking-wider shadow-[0_2px_0_#140802] transition-colors cursor-pointer"
        >
          NEXT TIP ➜
        </button>
      </div>

      {/* 6. Official Submission Resources & Templates */}
      <div className="space-y-3">
        <h2 className="font-pixel text-sm sm:text-base text-amber-300 uppercase font-bold tracking-wider">
          OFFICIAL SUBMISSION RESOURCES & TEMPLATES
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {OFFICIAL_RESOURCES.map((res) => (
            <div
              key={res.title}
              className="p-4 border-2 border-[#472d15] bg-[#191007] shadow-sm flex flex-col justify-between hover:-translate-y-0.5 transition-transform"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{res.icon}</span>
                  <span className="font-pixel text-[8px] px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-600 font-bold uppercase">
                    {res.badge}
                  </span>
                </div>
                <h3 className="font-pixel text-xs text-white font-bold mb-1">
                  {res.title}
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                  {res.description}
                </p>
              </div>

              <a
                href={res.url}
                target="_blank"
                rel="noreferrer"
                onClick={() => playMinecraftPop(1.1)}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-pixel text-amber-400 hover:text-amber-200 underline font-bold"
              >
                <span>Access Template</span>
                <span>↗</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Recent Announcements Feed */}
      <div className="p-5 border-2 border-[#3d240f] bg-[#140b04]">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#291708]">
          <h2 className="font-pixel text-sm text-neutral-200 uppercase font-bold tracking-wider flex items-center gap-2">
            <span>📢</span>
            <span>RECENT ORGANIZER ANNOUNCEMENTS</span>
          </h2>
          <Link
            href="/dashboard/announcements"
            onClick={() => playMinecraftClick()}
            className="text-[10px] font-pixel text-amber-400 hover:underline"
          >
            View All ({INITIAL_ANNOUNCEMENTS.length}) →
          </Link>
        </div>

        <div className="space-y-2.5">
          {INITIAL_ANNOUNCEMENTS.slice(0, 2).map((item) => (
            <div
              key={item.id}
              className="p-3 border border-[#2b1707] bg-[#190d05] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`font-pixel text-[8px] px-1.5 py-0.5 rounded ${
                      item.tag === 'CRITICAL'
                        ? 'bg-red-950 text-red-300 border border-red-600'
                        : 'bg-amber-950 text-amber-300 border border-amber-600'
                    }`}
                  >
                    {item.tag}
                  </span>
                  <span className="font-pixel text-neutral-400 text-[9px]">{item.date}</span>
                </div>
                <h4 className="font-pixel text-xs text-neutral-100 font-bold">{item.title}</h4>
                <p className="text-xs text-neutral-300 font-sans mt-0.5 leading-snug">
                  {item.content}
                </p>
              </div>

              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => playMinecraftClick()}
                  className="shrink-0 px-3 py-1.5 border border-amber-500/70 bg-[#2b1708] font-pixel text-[9px] text-amber-300 hover:bg-[#3d200b] uppercase font-bold whitespace-nowrap text-center"
                >
                  {item.linkText || 'Details ↗'}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
