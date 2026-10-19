'use client';

import React, { useEffect, useState } from 'react';
import LoadingProgressBar from './LoadingProgressBar';

interface MinecraftLoadingScreenProps {
  progress: number;
  isReady?: boolean;
  onFadeComplete?: () => void;
}

export default function MinecraftLoadingScreen({
  progress,
  isReady = false,
  onFadeComplete,
}: MinecraftLoadingScreenProps) {
  const [fading, setFading] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (isReady || progress >= 100) {
      // Trigger short, silky fade out
      const fadeTimer = setTimeout(() => {
        setFading(true);
      }, 250);

      const unmountTimer = setTimeout(() => {
        setHidden(true);
        onFadeComplete?.();
      }, 950);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(unmountTimer);
      };
    }
  }, [isReady, progress, onFadeComplete]);

  if (hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-between overflow-hidden bg-[#090d20] transition-opacity duration-700 ease-out select-none ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Sunset Twilight Sky Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080d22] via-[#24123b] to-[#ea580c] opacity-90 pointer-events-none" />

      {/* Floating Cubic XP Particles / Fireflies */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { x: '12%', delay: '0s', dur: '4.2s', size: 10, color: '#10b981' },
          { x: '24%', delay: '1.2s', dur: '5.1s', size: 8, color: '#fbbf24' },
          { x: '38%', delay: '2.5s', dur: '3.8s', size: 12, color: '#06b6d4' },
          { x: '55%', delay: '0.8s', dur: '4.7s', size: 9, color: '#10b981' },
          { x: '72%', delay: '1.9s', dur: '5.4s', size: 11, color: '#f59e0b' },
          { x: '86%', delay: '3.1s', dur: '4.1s', size: 7, color: '#84cc16' },
        ].map((p, i) => (
          <div
            key={i}
            className="absolute bottom-[-20px] rounded-none animate-float-cube opacity-75 shadow-lg"
            style={{
              left: p.x,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              animationDuration: p.dur,
              animationDelay: p.delay,
              boxShadow: `0 0 8px ${p.color}`,
            }}
          />
        ))}
      </div>

      {/* Distant Stepped Voxel Mountains (Silhouette) */}
      <div className="absolute bottom-32 left-0 right-0 h-48 pointer-events-none opacity-45 flex items-end">
        {/* Layer 1: Far Purple Ridge */}
        <svg
          className="absolute bottom-16 w-full h-36"
          preserveAspectRatio="none"
          viewBox="0 0 1000 120"
        >
          <path
            d="M0 120 L0 80 L60 80 L60 50 L120 50 L120 25 L180 25 L180 50 L240 50 L300 80 L360 80 L420 40 L480 40 L480 20 L540 20 L600 55 L660 55 L720 75 L780 75 L840 30 L900 30 L940 60 L1000 60 L1000 120 Z"
            fill="#1e1136"
          />
        </svg>
        {/* Layer 2: Near Dark Violet Ridge */}
        <svg
          className="absolute bottom-4 w-full h-32"
          preserveAspectRatio="none"
          viewBox="0 0 1000 100"
        >
          <path
            d="M0 100 L0 60 L80 60 L80 35 L140 35 L200 60 L280 60 L340 30 L400 30 L460 15 L520 15 L580 45 L660 45 L740 20 L800 20 L860 50 L920 50 L1000 70 L1000 100 Z"
            fill="#130a24"
          />
        </svg>
      </div>

      {/* Foreground Stepped Voxel Ground Layer */}
      <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none">
        {/* Grass Block Tops (Green Fringe) */}
        <div className="w-full h-4 bg-[#55822b] border-t-4 border-[#72984a] shadow-inner" />
        {/* Dirt Layers (Earth Brown) */}
        <div
          className="w-full h-24 bg-[#7c5332] relative"
          style={{
            backgroundImage:
              'radial-gradient(#5a391d 15%, transparent 16%), radial-gradient(#684520 15%, transparent 16%)',
            backgroundSize: '16px 16px',
            backgroundPosition: '0 0, 8px 8px',
          }}
        />
      </div>

      {/* Header Section: Event Titles */}
      <header className="relative z-10 pt-10 md:pt-14 text-center px-4">
        {/* Decorative Pixel Crossed Swords */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="text-[#fbbf24] text-lg">⚔</span>
          <span className="w-12 h-1 bg-gradient-to-r from-transparent via-[#fbbf24] to-transparent" />
          <span
            className="text-[#10b981] text-[10px] md:text-xs font-mono font-bold tracking-widest uppercase bg-[#0b0e14]/80 px-3 py-1 border border-[#10b981]/40"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            Phase 2A · System Online
          </span>
          <span className="w-12 h-1 bg-gradient-to-r from-transparent via-[#fbbf24] to-transparent" />
          <span className="text-[#fbbf24] text-lg">⚔</span>
        </div>

        {/* Main Event Title */}
        <h1
          className="text-white font-bold tracking-wider mb-2"
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 'clamp(14px, 2.6vw, 24px)',
            textShadow: '3px 3px 0 #ea580c, 6px 6px 0 #7c2d12',
          }}
        >
          NATIONAL AGENTIC AI CHALLENGE
        </h1>

        {/* Subtitle */}
        <p
          className="text-[#fbbf24] font-medium tracking-wide"
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 'clamp(8px, 1.2vw, 11px)',
            textShadow: '1px 1px 0 #78350f',
          }}
        >
          FOR SUSTAINABLE DEVELOPMENT GOALS
        </p>
        <p
          className="text-[#a5b4fc] text-[9px] mt-1.5 opacity-90"
          style={{ fontFamily: '"Press Start 2P", monospace' }}
        >
          MIT Academy of Engineering
        </p>
      </header>

      {/* Center Section: Animated Isometric Voxel Diorama with AI Robot */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-4">
        <div className="relative flex flex-col items-center">
          {/* Isometric Voxel AI Robot */}
          <div className="relative w-28 h-36 flex flex-col items-center animate-idle-bob">
            {/* Robot Antenna with Blinking Cyan Pulse */}
            <div className="w-1.5 h-3 bg-[#475569] relative">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#06b6d4] rounded-none animate-pulse shadow-[0_0_10px_#06b6d4]" />
            </div>

            {/* Robot Head */}
            <div className="w-14 h-11 bg-[#1e293b] border-2 border-[#334155] rounded-none relative shadow-xl flex items-center justify-center">
              {/* Visor Panel */}
              <div className="w-11 h-4 bg-[#0f172a] border border-[#06b6d4]/50 flex items-center justify-around px-1">
                {/* Glowing Cyan Eyes */}
                <div className="w-2.5 h-2.5 bg-[#22d3ee] shadow-[0_0_6px_#22d3ee] animate-eye-blink" />
                <div className="w-2.5 h-2.5 bg-[#22d3ee] shadow-[0_0_6px_#22d3ee] animate-eye-blink" />
              </div>
            </div>

            {/* Neck Joint */}
            <div className="w-6 h-1.5 bg-[#475569]" />

            {/* Robot Torso */}
            <div className="w-16 h-12 bg-[#059669] border-2 border-[#10b981] relative flex flex-col items-center justify-center shadow-lg">
              {/* Glowing Heart / SDG Core */}
              <div className="w-5 h-5 bg-[#10b981] border border-white/60 animate-pulse flex items-center justify-center shadow-[0_0_10px_#10b981]">
                <div className="w-2 h-2 bg-white" />
              </div>

              {/* Arms (Left & Right) */}
              <div className="absolute -left-3.5 top-0.5 w-3.5 h-10 bg-[#334155] border-l-2 border-b-2 border-[#475569]" />
              <div className="absolute -right-3.5 top-0.5 w-3.5 h-10 bg-[#334155] border-r-2 border-b-2 border-[#475569]">
                {/* Voxel Wrench in Hand */}
                <div className="absolute -bottom-2 -right-1 w-3 h-4 bg-[#fbbf24] border border-[#78350f]" />
              </div>
            </div>

            {/* Robot Legs */}
            <div className="w-12 h-6 flex justify-between px-1">
              <div className="w-4 h-6 bg-[#1e293b] border border-[#334155]" />
              <div className="w-4 h-6 bg-[#1e293b] border border-[#334155]" />
            </div>
          </div>

          {/* Voxel Grass Pedestal */}
          <div className="w-36 h-10 relative -mt-1 shadow-2xl">
            {/* Top Grass Face */}
            <div className="w-full h-3 bg-[#55822b] border-2 border-[#72984a]" />
            {/* Dirt Body */}
            <div className="w-full h-7 bg-[#7c5332] border-x-2 border-b-2 border-[#5a391d] flex items-center justify-center">
              <span
                className="text-[7px] text-[#fbbf24]/80 tracking-widest font-mono"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
              >
                AGENT ALPHA
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section: Minecraft Experience Progress Bar */}
      <footer className="relative z-10 pb-10 md:pb-12">
        <LoadingProgressBar progress={progress} />
      </footer>

      {/* Custom Styles for Keyframe Animations */}
      <style jsx>{`
        @keyframes idleBob {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        @keyframes floatCube {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          80% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-80vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes eyeBlink {
          0%, 90%, 100% {
            transform: scaleY(1);
          }
          95% {
            transform: scaleY(0.1);
          }
        }
        .animate-idle-bob {
          animation: idleBob 2.2s ease-in-out infinite;
        }
        .animate-float-cube {
          animation: floatCube ease-in infinite;
        }
        .animate-eye-blink {
          animation: eyeBlink 3.5s infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-idle-bob,
          .animate-float-cube,
          .animate-eye-blink {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
