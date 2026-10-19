'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import useReducedMotion from '@/hooks/useReducedMotion';

// Dynamic import with SSR disabled
const IntroScene = dynamic(() => import('./IntroScene'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-[#0c0a08] flex items-center justify-center z-40">
      <div className="flex flex-col items-center gap-3">
        <span className="font-pixel text-xs text-amber-300 animate-pulse">
          INITIALIZING MINECRAFT KNOWLEDGE HALL...
        </span>
        <div className="w-52 h-2 bg-neutral-900 border border-neutral-700">
          <div className="h-full bg-amber-500 animate-[pulse_1s_infinite] w-3/4" />
        </div>
      </div>
    </div>
  ),
});

export type IntroLifecycle = 'INTRO' | 'TRANSITIONING' | 'MAIN_SITE';

interface IntroExperienceProps {
  introState: IntroLifecycle;
  onStartTransition: () => void;
  onCompleteTransition: () => void;
}

export default function IntroExperience({
  introState,
  onStartTransition,
  onCompleteTransition,
}: IntroExperienceProps) {
  const prefersReducedMotion = useReducedMotion();
  const [scrollProgress, setScrollProgress] = useState(0);
  const touchStartY = useRef<number | null>(null);
  const hasStartedTransitionRef = useRef(false);
  const hasCompletedRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);

  const isTransitioning = introState === 'TRANSITIONING';
  const isMainSite = introState === 'MAIN_SITE';

  const startSmoothExit = useCallback(
    (immediate = false) => {
      if (hasStartedTransitionRef.current) return;
      hasStartedTransitionRef.current = true;
      onStartTransition();

      if (immediate || prefersReducedMotion) {
        if (!hasCompletedRef.current) {
          hasCompletedRef.current = true;
          onCompleteTransition();
        }
        return;
      }

      // Smoothly drive scrollProgress forward to 1.0 (dolly into the library)
      const startTime = performance.now();
      const startProg = scrollProgress;
      const duration = 600;

      const animateStep = (now: number) => {
        const elapsed = now - startTime;
        const p = Math.min(1, elapsed / duration);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - p, 3);
        const nextVal = startProg + (1 - startProg) * eased;
        setScrollProgress(nextVal);

        if (p < 1) {
          animFrameRef.current = requestAnimationFrame(animateStep);
        } else {
          setScrollProgress(1);
          if (!hasCompletedRef.current) {
            hasCompletedRef.current = true;
            onCompleteTransition();
          }
        }
      };

      animFrameRef.current = requestAnimationFrame(animateStep);
    },
    [onStartTransition, onCompleteTransition, prefersReducedMotion, scrollProgress]
  );

function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

  // Attach event listeners ONLY while in INTRO state and transition hasn't started
  useEffect(() => {
    if (introState !== 'INTRO' || hasStartedTransitionRef.current) return;

    // Graceful fallback: If WebGL is unavailable or reduced motion is preferred, immediately show main site
    if (prefersReducedMotion || !isWebGLAvailable()) {
      startSmoothExit(true);
      return;
    }

    const handleWheel = (e: WheelEvent) => {
      // Advance forward ONLY when user scrolls down
      if (e.deltaY > 0) {
        startSmoothExit(false);
      }
      // If e.deltaY < 0, do nothing. NEVER reverse.
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartY.current !== null) {
        const delta = touchStartY.current - e.touches[0].clientY;
        if (delta > 25) {
          // Swiped up (scroll down intent)
          startSmoothExit(false);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        startSmoothExit(true); // immediate skip
      } else if (
        e.key === 'ArrowDown' ||
        e.key === ' ' ||
        e.key === 'Enter' ||
        e.key === 'PageDown'
      ) {
        startSmoothExit(false);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [introState, prefersReducedMotion, startSmoothExit]);

  // Clean unmount once main site is active
  if (isMainSite) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-40 overflow-hidden bg-[#0c0a08] select-none transition-all duration-700 ease-out ${
        isTransitioning ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* 3D Voxel Library Canvas */}
      <div className="absolute inset-0">
        <IntroScene scrollProgress={scrollProgress} />
      </div>

      {/* Vignette Overlay for Dramatic Minecraft Atmosphere */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60"
        aria-hidden="true"
      />

      {/* Centered Instruction: SCROLL TO ENTER (Exact MineArena reference match) */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-4">
        <div
          className={`flex flex-col items-center gap-3 text-center transition-all duration-300 ${
            scrollProgress > 0.4 || isTransitioning ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
          }`}
        >
          <span
            className="font-pixel text-xs sm:text-sm md:text-base tracking-[0.22em] uppercase text-[#f5f5f0] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
            style={{ textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000' }}
          >
            SCROLL TO ENTER
          </span>

          <div className="animate-bounce text-2xl sm:text-3xl text-[#dba213] drop-shadow-[0_2px_8px_rgba(219,162,19,0.8)]">
            ↓
          </div>
        </div>
      </div>

      {/* Top Right Discreet Enter / Skip Button */}
      <div className="absolute top-4 right-4 z-20 pointer-events-auto">
        <button
          type="button"
          onClick={() => startSmoothExit(true)}
          className="border-2 border-[#7a4f05] bg-[#fbbf24] px-3 py-1.5 font-pixel text-[8px] sm:text-[9px] uppercase tracking-wider text-[#1a1206] shadow-[inset_2px_2px_0_rgba(255,255,255,0.4),inset_-2px_-2px_0_rgba(0,0,0,0.4),0_3px_0_#382618] hover:brightness-110 active:translate-y-0.5 transition-transform"
          aria-label="Skip to main website"
          data-interactive="true"
        >
          ENTER SITE ⏭
        </button>
      </div>

      {/* Bottom Subtitle Pill */}
      <div className="absolute bottom-6 inset-x-0 z-10 flex justify-center pointer-events-none px-4">
        <div className="border border-amber-500/40 bg-black/75 px-3 py-1 backdrop-blur-sm">
          <span className="font-pixel text-[8px] sm:text-[9px] text-amber-300 tracking-widest uppercase">
            NATIONAL AGENTIC AI CHALLENGE • MIT AOE
          </span>
        </div>
      </div>
    </div>
  );
}
