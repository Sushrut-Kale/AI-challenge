'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import useReducedMotion from '@/hooks/useReducedMotion';
import EventCountdown from '@/components/ui/EventCountdown';
import { EVENT_DATA } from '@/data/event';
import LoginModal from '@/components/auth/LoginModal';

// Dynamic import with SSR disabled
const IntroScene = dynamic(() => import('./IntroScene'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-[#0d0b09] flex items-center justify-center z-40">
      <div className="flex flex-col items-center gap-3">
        <span className="font-pixel text-xs text-amber-300 animate-pulse">
          INITIALIZING MINECRAFT KNOWLEDGE HALL...
        </span>
        <div className="w-52 h-2 bg-[#1a1714] border border-[#3d2e20]">
          <div className="h-full bg-amber-500 animate-[pulse_1s_infinite] w-3/4" />
        </div>
      </div>
    </div>
  ),
});

interface IntroExperienceProps {
  onProgressChange?: (progress: number) => void;
}

export default function IntroExperience({ onProgressChange }: IntroExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Track scroll position within the 380vh hero scrollytelling container
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalScrollable = container.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.min(1, Math.max(0, scrolled / totalScrollable));
      setScrollProgress(progress);
      if (onProgressChange) {
        onProgressChange(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [onProgressChange]);

  const handleSkipToContent = useCallback(() => {
    const aboutElem = document.getElementById('about');
    if (aboutElem) {
      const targetY = aboutElem.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: targetY,
        behavior: 'smooth',
      });
    } else if (containerRef.current) {
      window.scrollTo({
        top: containerRef.current.offsetTop + containerRef.current.offsetHeight,
        behavior: 'smooth',
      });
    }
  }, []);

  // Frame 1: SCROLL TO ENTER (0.00 to 0.22)
  const frame1Opacity = Math.max(0, Math.min(1, 1 - scrollProgress / 0.18));

  // Frame 2: BUILD INTELLIGENT AGENTS. SOLVE SDGS. (0.18 to 0.48)
  const frame2Opacity =
    scrollProgress >= 0.18 && scrollProgress <= 0.48
      ? scrollProgress < 0.32
        ? (scrollProgress - 0.18) / 0.14
        : 1 - (scrollProgress - 0.32) / 0.16
      : 0;

  // Frame 3: THE ARENA AWAITS (0.46 to 0.74)
  const frame3Opacity =
    scrollProgress >= 0.46 && scrollProgress <= 0.74
      ? scrollProgress < 0.58
        ? (scrollProgress - 0.46) / 0.12
        : 1 - (scrollProgress - 0.58) / 0.16
      : 0;

  // Frame 4: GRAND 3D EMBLEM & BRIEFING (0.70 to 1.00)
  const frame4Opacity =
    scrollProgress >= 0.70 ? Math.min(1, (scrollProgress - 0.70) / 0.16) : 0;

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative w-full bg-[#0d0b09]"
      style={{ height: '380vh' }}
      aria-label="AGENTCRAFT 3D Minecraft Scrollytelling Sequence"
    >
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0d0b09] select-none">
        {/* 3D Voxel Library Canvas driven directly by scrollProgress */}
        <div className="absolute inset-0">
          <IntroScene scrollProgress={scrollProgress} />
        </div>

        {/* Cinematic Vignette Overlay */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0d0b09]/80"
          aria-hidden="true"
        />

        {/* Top-Right Discreet Skip Control */}
        {scrollProgress < 0.75 && (
          <div className="fixed top-4 right-4 z-[70] pointer-events-auto animate-in fade-in duration-300">
            <button
              type="button"
              onClick={handleSkipToContent}
              className="border-2 border-[#7a4f05] bg-[#fbbf24] px-3.5 py-2 font-pixel text-[8px] sm:text-[9px] uppercase tracking-wider text-[#1a1206] shadow-[inset_2px_2px_0_rgba(255,255,255,0.4),inset_-2px_-2px_0_rgba(0,0,0,0.4),0_4px_0_#382618] hover:brightness-110 active:translate-y-0.5 transition-transform"
              aria-label="Skip to main website content"
              data-interactive="true"
            >
              SKIP INTRO ⏭
            </button>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* FRAME 1: SCROLL TO ENTER (0% -> ~22%)                         */}
        {/* ------------------------------------------------------------- */}
        <div
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-4 transition-transform duration-150"
          style={{
            opacity: frame1Opacity,
            transform: `translate3d(0, ${scrollProgress * -60}px, 0)`,
            visibility: frame1Opacity > 0.02 ? 'visible' : 'hidden',
          }}
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <span
              className="font-pixel text-xs sm:text-sm md:text-base tracking-[0.22em] uppercase text-[#f5f5f0] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
              style={{
                textShadow:
                  '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
              }}
            >
              SCROLL TO ENTER
            </span>
            <div className="animate-bounce text-2xl sm:text-3xl text-[#dba213] drop-shadow-[0_2px_8px_rgba(219,162,19,0.8)]">
              ↓
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* FRAME 2: BUILD INTELLIGENT AGENTS (~20% -> ~48%)              */}
        {/* ------------------------------------------------------------- */}
        <div
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center"
          style={{
            opacity: frame2Opacity,
            transform: `translate3d(0, ${(scrollProgress - 0.32) * -80}px, 0)`,
            visibility: frame2Opacity > 0.02 ? 'visible' : 'hidden',
          }}
        >
          <div className="max-w-3xl space-y-3">
            <h2
              className="font-pixel text-xl sm:text-3xl md:text-5xl uppercase tracking-[0.12em] text-[#f5f5f0] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]"
              style={{
                textShadow:
                  '3px 3px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000',
              }}
            >
              BUILD INTELLIGENT AGENTS
            </h2>
            <p
              className="font-pixel text-[9px] sm:text-xs md:text-sm text-emerald-400 tracking-widest uppercase drop-shadow-[0_2px_10px_rgba(16,185,129,0.6)]"
              style={{ textShadow: '2px 2px 0 #000' }}
            >
              Solve Real-World Problems • Create Sustainable Impact
            </p>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* FRAME 3: THE ARENA AWAITS (~46% -> ~74%)                      */}
        {/* ------------------------------------------------------------- */}
        <div
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center"
          style={{
            opacity: frame3Opacity,
            transform: `translate3d(0, ${(scrollProgress - 0.58) * -80}px, 0)`,
            visibility: frame3Opacity > 0.02 ? 'visible' : 'hidden',
          }}
        >
          <div className="max-w-3xl space-y-3">
            <h2
              className="font-pixel text-xl sm:text-3xl md:text-5xl uppercase tracking-[0.14em] text-[#dba213] drop-shadow-[0_4px_28px_rgba(219,162,19,0.7)]"
              style={{
                textShadow:
                  '3px 3px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000',
              }}
            >
              THE ARENA AWAITS
            </h2>
            <div className="inline-flex items-center gap-2 border-2 border-amber-500/60 bg-black/60 px-4 py-2 font-pixel text-[8px] sm:text-[10px] uppercase tracking-widest text-amber-200 backdrop-blur-sm">
              <span>2 ROUNDS</span>
              <span className="opacity-40">•</span>
              <span className="text-[#dba213]">CHAMPIONSHIP AWARDS</span>
              <span className="opacity-40">•</span>
              <span>INTERNSHIP OPPORTUNITIES *</span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* FRAME 4: GRAND 3D EMBLEM & BRIEFING (~70% -> 100%)            */}
        {/* ------------------------------------------------------------- */}
        <div
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-center"
          style={{
            opacity: frame4Opacity,
            transform: `translate3d(0, ${(scrollProgress - 0.85) * -40}px, 0)`,
            visibility: frame4Opacity > 0.02 ? 'visible' : 'hidden',
          }}
        >
          <div className="flex max-w-3xl flex-col items-center gap-2 sm:gap-3.5 pointer-events-auto max-h-[82vh] overflow-y-auto scrollbar-none py-1 px-1 sm:px-2">
            {/* Grand 3D AGENTCRAFT Logo */}
            <div className="relative w-full max-w-[200px] xs:max-w-[260px] sm:max-w-lg md:max-w-xl">
              <Image
                src="/assets/agentcraft_official_logo.png"
                alt="AGENTCRAFT — National Agentic AI Challenge"
                width={720}
                height={240}
                className="w-full h-auto object-contain drop-shadow-[0_8px_32px_rgba(0,0,0,0.95)]"
                priority
              />
            </div>

            {/* Date & Finale Pill */}
            <div className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 border-2 border-[#dba213]/80 bg-[#1a1209]/90 px-2.5 sm:px-3.5 py-1 sm:py-1.5 font-pixel text-[8px] xs:text-[9px] sm:text-[11px] uppercase tracking-wider text-[#ffd875] backdrop-blur-sm shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
              <span>17 November 2026</span>
              <span className="opacity-50">•</span>
              <span className="text-amber-400">Grand Finale at MIT AOE</span>
            </div>

            {/* Live Countdown to Grand Finale */}
            <div className="w-full max-w-[320px] xs:max-w-sm sm:max-w-md p-2 sm:p-2.5 border-2 border-[#3d2a1a] bg-[#140e08]/90 backdrop-blur-sm shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
              <EventCountdown
                targetDateISO={EVENT_DATA.details.eventDateISO}
                label="COUNTDOWN TO GRAND FINALE AT MIT AOE"
              />
            </div>

            {/* Venue & Organizer Details */}
            <div className="space-y-0.5 sm:space-y-1">
              <p className="font-pixel text-[8px] xs:text-[9px] sm:text-xs text-[#e0dacb] uppercase tracking-wider drop-shadow">
                MIT Academy of Engineering, Alandi, Pune
              </p>
              <p className="font-pixel text-[7px] xs:text-[8px] sm:text-[10px] text-emerald-400 uppercase tracking-widest drop-shadow">
                Organized by ASTRA Student Association (Dept. of CSE-AIML)
              </p>
              <p className="font-sans text-[10px] xs:text-[11px] sm:text-xs text-neutral-300">
                In association with AAAI Global Professional Chapter & AlgoVedas
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-1">
              <a
                href="https://unstop.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mc-shine border-2 border-[#7a4f05] bg-[#fbbf24] px-4 sm:px-6 py-2 sm:py-2.5 font-pixel text-[9px] sm:text-xs uppercase tracking-wider text-[#1a1206] shadow-[inset_2px_2px_0_rgba(255,255,255,0.4),inset_-2px_-2px_0_rgba(0,0,0,0.4),0_4px_0_#382618] hover:brightness-110 active:translate-y-0.5 transition-transform"
                data-interactive="true"
              >
                REGISTER ↗
              </a>
              <button
                type="button"
                onClick={() => setIsLoginOpen(true)}
                className="border-2 border-[#1e3a5f] bg-[#0284c7] hover:bg-[#0369a1] px-3.5 sm:px-5 py-2 sm:py-2.5 font-pixel text-[9px] sm:text-xs uppercase tracking-wider text-white shadow-[inset_2px_2px_0_rgba(255,255,255,0.3),inset_-2px_-2px_0_rgba(0,0,0,0.4),0_4px_0_#0c2340] hover:brightness-110 active:translate-y-0.5 transition-all"
                data-interactive="true"
              >
                🔑 LOGIN
              </button>
              <button
                type="button"
                onClick={handleSkipToContent}
                className="border-2 border-[#4a3824] bg-[#24170a]/90 hover:bg-[#382618] px-3.5 sm:px-5 py-2 sm:py-2.5 font-pixel text-[9px] sm:text-xs uppercase tracking-wider text-amber-200 shadow-[0_4px_0_#120b05] hover:brightness-110 active:translate-y-0.5 transition-all"
                data-interactive="true"
              >
                EXPLORE CHALLENGE ↓
              </button>
            </div>
          </div>
        </div>

        {/* Supabase Participant Login Modal */}
        <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

        {/* Bottom Subtitle Tag */}
        <div className="absolute bottom-5 inset-x-0 z-10 flex justify-center pointer-events-none px-4">
          <div className="border border-amber-500/40 bg-black/80 px-3 py-1 backdrop-blur-sm">
            <span className="font-pixel text-[8px] sm:text-[9px] text-amber-300 tracking-widest uppercase">
              NATIONAL AGENTIC AI CHALLENGE • MIT AOE
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
