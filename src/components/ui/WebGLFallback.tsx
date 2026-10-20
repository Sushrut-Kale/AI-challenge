'use client';

import React from 'react';

export default function WebGLFallback() {
  const handleRetry = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#090d20] px-4 select-none">
      {/* Background sunset vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#090d20] via-[#1a0f28] to-[#2a0e14] opacity-90 pointer-events-none" />

      {/* Bedrock / Obsidian Error Card */}
      <div className="relative z-10 max-w-lg w-full bg-[#1e232a] border-4 border-[#0b0e14] p-6 md:p-8 text-center shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
        {/* Warning Icon */}
        <div className="w-16 h-16 mx-auto mb-5 bg-[#e11d48] border-2 border-[#fb7185] flex items-center justify-center shadow-lg">
          <span className="text-3xl text-white">⚠</span>
        </div>

        {/* Title */}
        <h2
          className="text-white font-bold mb-3 tracking-wide font-pixel"
          style={{
            fontSize: 'clamp(12px, 2.5vw, 16px)',
            textShadow: '2px 2px 0 #991b1b',
          }}
        >
          WebGL Initialisation Failed
        </h2>

        {/* Description */}
        <p className="text-gray-300 mb-5 text-sm md:text-base leading-relaxed font-terminal">
          Your browser or graphics card does not currently support WebGL hardware acceleration, which is required to render the 3D Minecraft Overworld.
        </p>

        {/* Tips Box */}
        <div className="bg-[#0b0e14]/80 border border-[#334155] p-3 text-left mb-6 font-terminal">
          <p className="text-[#fbbf24] text-xs font-bold mb-1 font-pixel">
            Suggested Fixes:
          </p>
          <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
            <li>Ensure &quot;Hardware Acceleration&quot; is enabled in browser settings.</li>
            <li>Update your graphics drivers to the latest version.</li>
            <li>Try accessing via modern Chrome, Edge, or Firefox.</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleRetry}
            className="px-5 py-3 bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold transition border-2 border-[#047857] shadow-md cursor-pointer font-pixel"
          >
            ↻ Retry Launch
          </button>
        </div>

        {/* Event Badge */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center gap-2">
          <span className="text-xs text-[#fbbf24]">⚔</span>
          <span className="text-xs text-gray-400 font-terminal">
            National Agentic AI Challenge · MIT AOE
          </span>
        </div>
      </div>
    </div>
  );
}
