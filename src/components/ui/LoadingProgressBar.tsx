'use client';

import React, { useState, useEffect } from 'react';

interface LoadingProgressBarProps {
  progress: number; // 0 - 100
}

const LOADING_MESSAGES = [
  'Generating Overworld...',
  'Synthesizing Voxel Terrain...',
  'Preparing AI Agents...',
  'Loading Chunks & Biospheres...',
  'Igniting Sunset Sky Shaders...',
  'Activating the Agentic Portal...',
  'Almost Ready...',
];

const GAMEPLAY_TIPS = [
  'Tip: Great ideas can change entire worlds.',
  'Tip: Builder Alpha constructs sustainable infrastructure across SDGs.',
  'Tip: Analyst Beta computes data streams to optimize resource usage.',
  'Tip: Innovator Gamma experiments with agentic creative problem-solving.',
  'Tip: Use number keys 1–4 to cycle through cinematic camera views.',
  'Tip: Press Spacebar to toggle the cinematic world orbit.',
  'Tip: Press H anytime to toggle the pixel-art HUD overlay.',
];

export default function LoadingProgressBar({ progress }: LoadingProgressBarProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  // Rotate messages based on progress milestones or gentle timer
  useEffect(() => {
    const msgTimer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1800);

    const tipTimer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % GAMEPLAY_TIPS.length);
    }, 3200);

    return () => {
      clearInterval(msgTimer);
      clearInterval(tipTimer);
    };
  }, []);

  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center select-none px-4">
      {/* Current Loading Status Message */}
      <div className="h-6 flex items-center justify-center mb-2">
        <p
          className="text-[#fbbf24] text-center tracking-wider text-[10px] md:text-xs flex items-center gap-2"
          style={{
            fontFamily: '"Press Start 2P", monospace',
            textShadow: '2px 2px 0 #78350f',
          }}
        >
          <span className="inline-block w-2 h-2 bg-[#10b981] animate-ping rounded-none" />
          <span>{LOADING_MESSAGES[messageIndex]}</span>
        </p>
      </div>

      {/* Minecraft Experience Bar Container */}
      <div className="relative w-full py-2">
        {/* Outer Dark Obsidian Beveled Border */}
        <div
          className="w-full h-7 bg-[#1e232a] border-4 border-[#0b0e14] relative rounded-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_4px_12px_rgba(0,0,0,0.6)]"
          style={{ imageRendering: 'pixelated' }}
        >
          {/* XP Bar Notch Overlay (Minecraft Segment Grid) */}
          <div className="absolute inset-0 z-10 flex justify-between pointer-events-none px-1">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="w-[2px] h-full bg-[#0b0e14]/70" />
            ))}
          </div>

          {/* Filled Experience Bar */}
          <div
            className="h-full bg-gradient-to-r from-[#059669] via-[#10b981] to-[#84cc16] relative transition-all duration-300 ease-out shadow-[0_0_12px_rgba(16,185,129,0.7)]"
            style={{ width: `${clampedProgress}%` }}
          >
            {/* Top Gloss Highlight */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/35" />
            {/* Bottom Inner Shadow */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30" />
          </div>
        </div>

        {/* Central XP Level Badge / Number (Minecraft Experience Level Style) */}
        <div className="absolute left-1/2 -top-1 -translate-x-1/2 z-20 flex items-center justify-center pointer-events-none">
          <span
            className="text-[#84cc16] font-bold text-sm md:text-base tracking-wider"
            style={{
              fontFamily: '"Press Start 2P", monospace',
              textShadow:
                '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 3px 0 #064e3b',
            }}
          >
            {clampedProgress}%
          </span>
        </div>
      </div>

      {/* Rotating Tip Area */}
      <div className="mt-4 px-4 py-2 bg-[#0b0e14]/70 border border-[#334155]/60 rounded-sm max-w-md w-full text-center">
        <p
          className="text-gray-300 text-[9px] md:text-[10px] leading-relaxed transition-all duration-300"
          style={{ fontFamily: 'monospace' }}
        >
          <span className="text-[#10b981] font-bold">💡 </span>
          {GAMEPLAY_TIPS[tipIndex]}
        </p>
      </div>
    </div>
  );
}
