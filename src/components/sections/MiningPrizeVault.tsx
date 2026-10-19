'use client';

import React, { useState, useEffect, useRef } from 'react';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import PixelBadge from '@/components/ui/PixelBadge';
import { playMinecraftStoneHit, playMinecraftBlockBreak } from '@/components/ui/MinecraftAudioManager';

interface MiningPrizeVaultProps {
  totalPoolAmount: number;
}

interface SpallParticle {
  id: number;
  x: number;
  y: number;
  tx: number;
  ty: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  size: number;
  baseColor: string;
  topColor: string;
  isDiamond?: boolean;
}

const REQUIRED_CLICKS = 5;

// Authentic Minecraft Pixel-Art Destruction Stages (Progressive Block Break Grid)
const CRACK_LEVELS = [
  // 0: Clean block
  [],
  // 1: Initial center impact fractures
  [
    { x: 48, y: 46, w: 6, h: 4 },
    { x: 50, y: 50, w: 4, h: 6 },
    { x: 44, y: 48, w: 5, h: 3 },
  ],
  // 2: Radiating fractures
  [
    { x: 44, y: 42, w: 12, h: 5 },
    { x: 48, y: 47, w: 8, h: 10 },
    { x: 38, y: 52, w: 8, h: 4 },
    { x: 54, y: 38, w: 4, h: 8 },
    { x: 34, y: 44, w: 6, h: 4 },
    { x: 58, y: 56, w: 7, h: 4 },
  ],
  // 3: Spiderweb fracture network across the face
  [
    { x: 32, y: 36, w: 16, h: 5 },
    { x: 48, y: 41, w: 14, h: 12 },
    { x: 26, y: 48, w: 12, h: 6 },
    { x: 58, y: 32, w: 6, h: 14 },
    { x: 62, y: 54, w: 14, h: 6 },
    { x: 40, y: 64, w: 16, h: 5 },
    { x: 22, y: 60, w: 10, h: 4 },
    { x: 68, y: 42, w: 10, h: 5 },
    { x: 44, y: 24, w: 8, h: 12 },
  ],
  // 4: Critical structural failure (almost completely fractured)
  [
    { x: 18, y: 28, w: 22, h: 6 },
    { x: 40, y: 34, w: 18, h: 14 },
    { x: 14, y: 52, w: 18, h: 7 },
    { x: 62, y: 24, w: 10, h: 18 },
    { x: 66, y: 52, w: 18, h: 7 },
    { x: 34, y: 68, w: 24, h: 6 },
    { x: 12, y: 68, w: 14, h: 6 },
    { x: 74, y: 38, w: 14, h: 7 },
    { x: 38, y: 16, w: 12, h: 18 },
    { x: 56, y: 68, w: 18, h: 6 },
    { x: 24, y: 40, w: 10, h: 8 },
    { x: 70, y: 72, w: 12, h: 6 },
  ],
];

export default function MiningPrizeVault({ totalPoolAmount }: MiningPrizeVaultProps) {
  const [hits, setHits] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isShattering, setIsShattering] = useState(false);
  const [spallParticles, setSpallParticles] = useState<SpallParticle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load persistence from sessionStorage
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
    if (isRevealed || isShattering) return;

    const nextHits = hits + 1;
    setHits(nextHits);

    // Visual block vibration on hit
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 120);

    // Spall stone particles flying OUTWARD TOWARD THE SCREEN
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const originX = e.clientX - rect.left;
      const originY = e.clientY - rect.top;

      const isFinalHit = nextHits >= REQUIRED_CLICKS;
      const count = isFinalHit ? 30 : 10;

      const stonePalette = [
        { base: '#334155', top: '#64748b' },
        { base: '#1e293b', top: '#475569' },
        { base: '#0f172a', top: '#334155' },
        { base: '#475569', top: '#94a3b8' },
        { base: '#0284c7', top: '#38bdf8', isDiamond: true }, // Diamond ore chip
        { base: '#d97706', top: '#fbbf24' }, // Gold ore chip
      ];

      const newSpall: SpallParticle[] = Array.from({ length: count }, (_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = isFinalHit ? Math.random() * 180 + 40 : Math.random() * 80 + 20;
        const color = stonePalette[Math.floor(Math.random() * stonePalette.length)];

        return {
          id: Date.now() + i + Math.random(),
          x: originX,
          y: originY,
          tx: Math.cos(angle) * distance,
          ty: Math.sin(angle) * distance - (Math.random() * 50 + 20), // Pop upwards before falling
          rotX: Math.floor(Math.random() * 360) - 180,
          rotY: Math.floor(Math.random() * 360) - 180,
          rotZ: Math.floor(Math.random() * 360) - 180,
          size: Math.floor(Math.random() * 8) + 8, // Substantial 3D voxel cubes
          baseColor: color.base,
          topColor: color.top,
          isDiamond: color.isDiamond,
        };
      });

      setSpallParticles((prev) => [...prev, ...newSpall]);

      setTimeout(() => {
        setSpallParticles((prev) => prev.filter((p) => !newSpall.includes(p)));
      }, 700);
    }

    if (nextHits >= REQUIRED_CLICKS) {
      // BLOCK SHATTERS! Stones spall toward screen and reveal the prize pool
      playMinecraftBlockBreak();
      setIsShattering(true);

      setTimeout(() => {
        setIsRevealed(true);
        setIsShattering(false);
        try {
          sessionStorage.setItem('agentcraft_prize_vault_mined', 'true');
        } catch {
          // ignore
        }
      }, 350);
    } else {
      // Crisp stone chip impact sound
      playMinecraftStoneHit();
    }
  };

  const handleResetVault = () => {
    setHits(0);
    setIsRevealed(false);
    setIsShattering(false);
    try {
      sessionStorage.removeItem('agentcraft_prize_vault_mined');
    } catch {
      // ignore
    }
  };

  const crackStageIndex = Math.min(hits, CRACK_LEVELS.length - 1);
  const remainingHits = Math.max(0, REQUIRED_CLICKS - hits);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-xl mx-auto my-3 select-none"
      style={{ perspective: '800px', transformStyle: 'preserve-3d' }}
    >
      {/* ------------------------------------------------------------- */}
      {/* 3D SPALLING STONE PARTICLES (FLYING TOWARDS SCREEN / VIEWER)  */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-visible">
        {spallParticles.map((p) => (
          <div
            key={p.id}
            className="absolute animate-mc-spall mc-voxel-cube pointer-events-none"
            style={
              {
                left: p.x,
                top: p.y,
                width: p.size,
                height: p.size,
                '--spall-x': `${p.tx}px`,
                '--spall-y': `${p.ty}px`,
                '--rot-x': `${p.rotX}deg`,
                '--rot-y': `${p.rotY}deg`,
                '--rot-z': `${p.rotZ}deg`,
              } as React.CSSProperties
            }
          >
            {/* 3D Minecraft Textured Voxel Block */}
            <div
              className="w-full h-full border border-black/60 shadow-lg"
              style={{
                backgroundColor: p.baseColor,
                boxShadow: p.isDiamond
                  ? 'inset 1px 1px 0 #e0f2fe, 0 0 8px rgba(56,189,248,0.8)'
                  : 'inset 1px 1px 0 rgba(255,255,255,0.3)',
              }}
            >
              {/* Top bevel highlight face */}
              <div
                className="w-full h-1/3"
                style={{
                  backgroundColor: p.topColor,
                  opacity: 0.85,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* UNDERNEATH: THE REVEALED PRIZE POOL COUNTER                   */}
      {/* ------------------------------------------------------------- */}
      <div
        className={`transition-all duration-500 flex flex-col items-center ${
          isRevealed
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-95 pointer-events-none absolute inset-0'
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
          className={`relative p-6 sm:p-8 border-4 border-[#1c1917] bg-[#1a1c23] shadow-[0_14px_32px_rgba(0,0,0,0.95)] rounded-sm cursor-pointer transition-all duration-150 ${
            isShattering
              ? 'scale-110 opacity-0 filter blur-[2px]'
              : isShaking
              ? 'animate-mc-shake'
              : 'hover:scale-[1.01]'
          }`}
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 50%, #292d3b 0%, #161922 65%, #0d0f14 100%)',
            imageRendering: 'pixelated',
          }}
          data-interactive="true"
          title="Click to mine with your hammer!"
        >
          {/* Deepslate Voxel Texture Grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25"
            style={{
              backgroundImage:
                'linear-gradient(to right, #475569 1px, transparent 1px), linear-gradient(to bottom, #475569 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />

          {/* Minecraft Block Bevel Edge */}
          <div className="pointer-events-none absolute inset-1.5 border-2 border-[#334155]/70 shadow-[inset_2px_2px_0_rgba(255,255,255,0.1),inset_-2px_-2px_0_rgba(0,0,0,0.6)]" />

          {/* Central Mining Call-to-Action */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 border-2 border-amber-500/80 bg-black/80 px-4 py-1.5 mb-3 shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              <span className="text-lg animate-bounce">⛏️</span>
              <span className="font-pixel text-[11px] sm:text-xs text-amber-300 font-bold uppercase tracking-wider">
                MINE TO REVEAL PRIZE POOL!
              </span>
              <span className="text-lg animate-bounce">⛏️</span>
            </div>

            <p className="font-pixel text-[9px] sm:text-[10px] text-neutral-300 uppercase tracking-widest mb-3">
              CLICK MULTIPLE TIMES WITH HAMMER
            </p>

            {/* Durability / Cracks Gauge Bar */}
            <div className="w-full max-w-xs flex flex-col items-center gap-1.5">
              <div className="w-full h-3.5 bg-black/80 border-2 border-[#475569] p-0.5 relative overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-yellow-300 transition-all duration-150"
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

          {/* AUTHENTIC MINECRAFT PROGRESSIVE CRACKS OVERLAY */}
          {crackStageIndex > 0 && (
            <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
              {CRACK_LEVELS[crackStageIndex].map((crack, idx) => (
                <div
                  key={idx}
                  className="absolute bg-black/90 shadow-[0_0_2px_#ffffff]"
                  style={{
                    left: `${crack.x}%`,
                    top: `${crack.y}%`,
                    width: `${crack.w}%`,
                    height: `${crack.h}%`,
                    boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.7), 1px 1px 0 #000',
                    imageRendering: 'pixelated',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
