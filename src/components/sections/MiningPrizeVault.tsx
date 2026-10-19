'use client';

import React, { useState, useEffect, useRef } from 'react';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import PixelBadge from '@/components/ui/PixelBadge';
import { playMinecraftStoneHit, playMinecraftBlockBreak } from '@/components/ui/MinecraftAudioManager';

interface MiningPrizeVaultProps {
  totalPoolAmount: number;
}

interface MiningParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  vx: number;
  vy: number;
  size: number;
}

const REQUIRED_CLICKS = 5;

// Authentic Minecraft Progressive Fracture Crack Paths
const CRACK_STAGES = [
  // Stage 0: Clean
  '',
  // Stage 1: Fine hairline fissures in center
  'M 40,50 L 52,44 L 60,52 M 52,44 L 54,34',
  // Stage 2: Spreading fracture lines
  'M 30,58 L 42,48 L 54,42 L 68,54 M 42,48 L 38,34 L 46,26 M 54,42 L 58,30',
  // Stage 3: Deep spiderweb cracks across the blocks
  'M 20,65 L 34,52 L 48,46 L 62,56 L 80,48 M 34,52 L 28,34 L 38,20 M 48,46 L 52,28 L 66,18 M 48,46 L 46,68 L 36,82 M 62,56 L 70,74',
  // Stage 4: Severe breakage across entire block face
  'M 12,72 L 28,56 L 44,48 L 60,58 L 76,46 L 88,58 M 28,56 L 20,36 L 32,18 L 44,12 M 44,48 L 48,26 L 62,14 M 44,48 L 42,74 L 30,90 M 60,58 L 72,78 L 84,86 M 28,56 L 16,58 M 76,46 L 88,34',
];

export default function MiningPrizeVault({ totalPoolAmount }: MiningPrizeVaultProps) {
  const [hits, setHits] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [particles, setParticles] = useState<MiningParticle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check sessionStorage on client
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('agentcraft_prize_vault_mined');
      if (saved === 'true') {
        setIsRevealed(true);
        setHits(REQUIRED_CLICKS);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleMineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isRevealed) return;

    const nextHits = hits + 1;
    setHits(nextHits);

    // Trigger visual block shake
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 130);

    // Spawn block fragment particles
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const particleColors = ['#475569', '#334155', '#64748b', '#0f172a', '#fbbf24', '#38bdf8'];
      const newParticles: MiningParticle[] = Array.from({ length: 9 }, (_, i) => ({
        id: Date.now() + i,
        x: clickX,
        y: clickY,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.7) * 6,
        size: Math.floor(Math.random() * 4) + 3,
      }));

      setParticles((prev) => [...prev, ...newParticles]);
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => !newParticles.includes(p)));
      }, 450);
    }

    if (nextHits >= REQUIRED_CLICKS) {
      // BLOCK DESTROYED! REVEAL ₹30,000 PRIZE POOL!
      playMinecraftBlockBreak();
      setIsRevealed(true);
      try {
        sessionStorage.setItem('agentcraft_prize_vault_mined', 'true');
      } catch {
        // ignore
      }
    } else {
      // Play stone mining hit sound
      playMinecraftStoneHit();
    }
  };

  const handleResetVault = () => {
    setHits(0);
    setIsRevealed(false);
    try {
      sessionStorage.removeItem('agentcraft_prize_vault_mined');
    } catch {
      // ignore
    }
  };

  const crackIndex = Math.min(hits, CRACK_STAGES.length - 1);
  const remainingHits = Math.max(0, REQUIRED_CLICKS - hits);

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto my-3 select-none">
      {/* ------------------------------------------------------------- */}
      {/* UNDERNEATH: THE REVEALED PRIZE POOL COUNTER                   */}
      {/* ------------------------------------------------------------- */}
      <div
        className={`transition-all duration-500 flex flex-col items-center ${
          isRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none absolute inset-0'
        }`}
      >
        <PixelBadge variant="gold" className="mb-2 animate-bounce">
          🎉 VAULT MINED! CHAMPIONSHIP REVEALED
        </PixelBadge>

        <h3 className="font-pixel text-xs sm:text-sm text-neutral-200 uppercase tracking-widest mb-1 font-bold">
          TOTAL PRIZE POOL
        </h3>

        {/* Grand ₹30,000 Championship Counter */}
        <div className="font-pixel text-4xl sm:text-6xl md:text-7xl text-amber-300 tracking-wider mb-2 drop-shadow-[0_4px_24px_rgba(251,191,36,0.6)] animate-pulse">
          <AnimatedCounter value={totalPoolAmount} prefix="₹" suffix="/-" />
        </div>

        <button
          type="button"
          onClick={handleResetVault}
          className="mt-2 text-[9px] font-pixel text-neutral-400 hover:text-amber-300 underline uppercase tracking-wider transition-colors"
          data-interactive="true"
        >
          [ ↺ RE-SEAL VAULT TO MINE AGAIN ]
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* COVER OVERLAY: MINECRAFT STONE & BEDROCK MINING VAULT         */}
      {/* ------------------------------------------------------------- */}
      {!isRevealed && (
        <div
          role="button"
          tabIndex={0}
          onClick={handleMineClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleMineClick(e as unknown as React.MouseEvent<HTMLDivElement>);
            }
          }}
          className={`relative p-6 sm:p-8 border-4 border-[#1c1917] bg-[#1a1c23] shadow-[0_12px_28px_rgba(0,0,0,0.85)] rounded-sm cursor-pointer transition-transform ${
            isShaking ? 'animate-mc-shake' : 'hover:scale-[1.01]'
          }`}
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 50%, #262a36 0%, #151821 70%, #0d0f14 100%)',
            imageRendering: 'pixelated',
          }}
          data-interactive="true"
          title="Click to mine with your hammer!"
        >
          {/* Voxel Grid Texture Inlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(to right, #475569 1px, transparent 1px), linear-gradient(to bottom, #475569 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />

          {/* Golden Pixel Bevel Inset */}
          <div className="pointer-events-none absolute inset-1.5 border-2 border-[#334155]/60" />

          {/* Central Mining Prompt */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 border-2 border-amber-500/80 bg-black/75 px-4 py-1.5 mb-3 shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              <span className="text-lg animate-bounce">⛏️</span>
              <span className="font-pixel text-[11px] sm:text-xs text-amber-300 font-bold uppercase tracking-wider">
                MINE TO REVEAL PRIZE POOL!
              </span>
              <span className="text-lg animate-bounce">⛏️</span>
            </div>

            <p className="font-pixel text-[9px] sm:text-[10px] text-neutral-300 uppercase tracking-widest mb-3">
              CLICK MULTIPLE TIMES WITH HAMMER
            </p>

            {/* Durability / Cracks Gauge */}
            <div className="w-full max-w-xs flex flex-col items-center gap-1.5">
              <div className="w-full h-3.5 bg-black/80 border-2 border-[#475569] p-0.5 relative overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300 transition-all duration-150"
                  style={{
                    width: `${(hits / REQUIRED_CLICKS) * 100}%`,
                    imageRendering: 'pixelated',
                  }}
                />
              </div>

              <span className="font-pixel text-[8px] sm:text-[9px] text-amber-200/90 tracking-wider">
                {hits === 0
                  ? 'BEDROCK VAULT IS SEALED • [ 5 HITS TO CRACK ]'
                  : `VAULT CRACKING! • [ ${remainingHits} HIT${remainingHits === 1 ? '' : 'S'} REMAINING ]`}
              </span>
            </div>
          </div>

          {/* AUTHENTIC MINECRAFT PROGRESSIVE CRACKS OVERLAY (SVG FRACTURES) */}
          {crackIndex > 0 && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-20"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              style={{ imageRendering: 'pixelated' }}
            >
              {/* Black fissure shadow */}
              <path
                d={CRACK_STAGES[crackIndex]}
                stroke="#000000"
                strokeWidth="3.2"
                strokeLinecap="square"
                strokeLinejoin="miter"
                fill="none"
              />
              {/* White fracture core */}
              <path
                d={CRACK_STAGES[crackIndex]}
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeLinecap="square"
                strokeLinejoin="miter"
                fill="none"
                opacity="0.9"
              />
            </svg>
          )}

          {/* Block Break Chips Explosion on Click */}
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute pointer-events-none z-30 transition-transform duration-300"
              style={{
                left: p.x,
                top: p.y,
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                boxShadow: '0 0 4px rgba(0,0,0,0.8)',
                transform: `translate(${p.vx * 7}px, ${p.vy * 7}px)`,
                imageRendering: 'pixelated',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
