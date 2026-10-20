'use client';

import React, { useState, useEffect, useRef } from 'react';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import PixelBadge from '@/components/ui/PixelBadge';
import { playMinecraftStoneHit, playMinecraftBlockBreak } from '@/components/ui/MinecraftAudioManager';

interface MiningPrizeVaultProps {
  totalPoolAmount: number;
}

interface BrownBoxShard {
  id: string;
  x: number;
  y: number;
  tx: number;
  ty: number;
  rot: number;
  size: number;
  baseColor: string;
  topColor: string;
  borderColor: string;
}

// Exactly 8 hits to reveal as requested
const REQUIRED_CLICKS = 8;

// 8 progressive crack levels across the Minecraft brown wooden blocks
const CRACK_LEVELS = [
  // 0: Pristine block
  [],
  // 1: First minor wood fracture
  [
    { x: 48, y: 46, w: 5, h: 4 },
    { x: 50, y: 50, w: 4, h: 5 },
  ],
  // 2: Spreading hairline cracks
  [
    { x: 44, y: 44, w: 9, h: 4 },
    { x: 48, y: 48, w: 6, h: 8 },
    { x: 38, y: 52, w: 7, h: 3 },
  ],
  // 3: Wood grain split emerging
  [
    { x: 42, y: 38, w: 12, h: 5 },
    { x: 48, y: 44, w: 8, h: 10 },
    { x: 36, y: 50, w: 10, h: 5 },
    { x: 55, y: 36, w: 5, h: 9 },
  ],
  // 4: Radiating box split
  [
    { x: 34, y: 34, w: 14, h: 5 },
    { x: 48, y: 40, w: 12, h: 12 },
    { x: 28, y: 46, w: 12, h: 6 },
    { x: 58, y: 30, w: 6, h: 14 },
    { x: 62, y: 52, w: 12, h: 6 },
  ],
  // 5: Deep structural cracks across planks
  [
    { x: 26, y: 30, w: 18, h: 6 },
    { x: 46, y: 36, w: 14, h: 14 },
    { x: 20, y: 48, w: 14, h: 7 },
    { x: 60, y: 26, w: 8, h: 16 },
    { x: 64, y: 50, w: 16, h: 6 },
    { x: 38, y: 62, w: 16, h: 6 },
  ],
  // 6: Heavy splintering throughout
  [
    { x: 20, y: 26, w: 22, h: 6 },
    { x: 42, y: 32, w: 18, h: 16 },
    { x: 16, y: 50, w: 16, h: 7 },
    { x: 62, y: 22, w: 10, h: 18 },
    { x: 66, y: 48, w: 18, h: 7 },
    { x: 34, y: 66, w: 22, h: 6 },
    { x: 54, y: 64, w: 16, h: 6 },
  ],
  // 7: Critical fragmentation (one hit from shattering completely)
  [
    { x: 16, y: 22, w: 26, h: 7 },
    { x: 38, y: 28, w: 22, h: 18 },
    { x: 12, y: 46, w: 20, h: 8 },
    { x: 60, y: 18, w: 12, h: 22 },
    { x: 64, y: 44, w: 22, h: 8 },
    { x: 30, y: 64, w: 26, h: 7 },
    { x: 50, y: 62, w: 20, h: 7 },
    { x: 70, y: 34, w: 14, h: 7 },
    { x: 24, y: 38, w: 12, h: 9 },
  ],
];

export default function MiningPrizeVault({ totalPoolAmount }: MiningPrizeVaultProps) {
  const [hits, setHits] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isShattering, setIsShattering] = useState(false);
  const [boxShards, setBoxShards] = useState<BrownBoxShard[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Restore revealed state if previously mined in session
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

    // Block vibration on strike
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 130);

    // Radiating Brown Box Splitting Animation (same ray-burst type as 9th option)
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const originX = e.clientX - rect.left;
      const originY = e.clientY - rect.top;

      const isFinalHit = nextHits >= REQUIRED_CLICKS;
      // 12-16 radiating rays per hit, 32 on the final shattering blow
      const rayCount = isFinalHit ? 32 : 14;

      // Authentic Minecraft brown oak wood & crate palette
      const woodPalette = [
        { base: '#8f562b', top: '#b8773e', border: '#4f2d12' }, // Oak plank warm face
        { base: '#704320', top: '#945b2b', border: '#3b200b' }, // Dark oak seam
        { base: '#a46736', top: '#c88a4e', border: '#593414' }, // Light oak bevel
        { base: '#5c3818', top: '#7d4e24', border: '#2d1808' }, // Wood crate shadow
        { base: '#3b220c', top: '#543214', border: '#1c1005' }, // Deep bedrock knot
      ];

      const newShards: BrownBoxShard[] = [];
      for (let r = 0; r < rayCount; r++) {
        const baseAngle = (r / rayCount) * Math.PI * 2 + (Math.random() * 0.2 - 0.1);
        const distance = isFinalHit
          ? Math.random() * 260 + 80
          : Math.random() * 140 + 40;
        const color = woodPalette[r % woodPalette.length];

        newShards.push({
          id: `shard-${Date.now()}-${r}-${Math.random()}`,
          x: originX,
          y: originY,
          tx: Math.cos(baseAngle) * distance,
          ty: Math.sin(baseAngle) * distance - (Math.random() * 40 + 15),
          rot: Math.floor(Math.random() * 360) - 180,
          size: Math.floor(Math.random() * 8) + 10, // Chunky Minecraft wooden box fragment
          baseColor: color.base,
          topColor: color.top,
          borderColor: color.border,
        });
      }

      setBoxShards((prev) => [...prev, ...newShards]);

      // Fail-safe cleanup after CSS animation finishes
      setTimeout(() => {
        setBoxShards((prev) => prev.filter((s) => !newShards.includes(s)));
      }, 750);
    }

    if (nextHits >= REQUIRED_CLICKS) {
      // 8th HIT: Complete block break explosion revealing prize pool
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
      // Hits 1 to 7: Wood block impact strike sound
      playMinecraftStoneHit();
    }
  };

  const crackStageIndex = Math.min(hits, CRACK_LEVELS.length - 1);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-xl mx-auto my-3 select-none"
      style={{ perspective: '900px', transformStyle: 'preserve-3d' }}
    >
      {/* ------------------------------------------------------------- */}
      {/* RADIATING BROWN BOX SPLITTING PARTICLES (FLYING OUTWARD)      */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-visible">
        {boxShards.map((s) => (
          <div
            key={s.id}
            className="absolute animate-mc-box-split pointer-events-none"
            style={
              {
                left: s.x,
                top: s.y,
                width: `${s.size}px`,
                height: `${s.size}px`,
                '--split-x': `${s.tx}px`,
                '--split-y': `${s.ty}px`,
                '--rot': `${s.rot}deg`,
                imageRendering: 'pixelated',
              } as React.CSSProperties
            }
          >
            {/* Minecraft 3D Textured Brown Box Piece */}
            <div
              className="w-full h-full border-2 shadow-lg"
              style={{
                backgroundColor: s.baseColor,
                borderColor: s.borderColor,
                boxShadow: `inset 2px 2px 0 ${s.topColor}, 0 4px 10px rgba(0,0,0,0.85)`,
              }}
            >
              {/* Highlight plank grain stripe */}
              <div
                className="w-full h-1/3"
                style={{
                  backgroundColor: s.topColor,
                  opacity: 0.8,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* UNDERNEATH: REVEALED PRIZE POOL COUNTER                       */}
      {/* ------------------------------------------------------------- */}
      <div
        className={`transition-all duration-500 flex flex-col items-center ${
          isRevealed
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-95 pointer-events-none absolute inset-0'
        }`}
      >
        <PixelBadge variant="gold" className="mb-2 animate-bounce">
          🎉 VAULT MINED! PRIZE REVEALED
        </PixelBadge>

        <h3 className="font-pixel text-xs sm:text-sm text-neutral-200 uppercase tracking-widest mb-1 font-bold">
          TOTAL PRIZE POOL
        </h3>

        {/* Grand ₹30,000 Championship Counter */}
        <div className="font-pixel text-3xl xs:text-4xl sm:text-6xl md:text-7xl text-amber-300 tracking-wider mb-2 drop-shadow-[0_4px_24px_rgba(251,191,36,0.6)] animate-pulse flex items-center justify-center text-center">
          <AnimatedCounter value={totalPoolAmount} prefix="₹" suffix="/-" />
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* COVER: CLASSICAL MINECRAFT BROWN BOXES / WOODEN CRATE VAULT   */}
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
          className={`relative p-6 sm:p-10 border-4 border-[#3a220e] shadow-[0_16px_36px_rgba(0,0,0,0.95)] rounded-none cursor-pointer transition-all duration-150 ${
            isShattering
              ? 'scale-110 opacity-0 filter blur-[2px]'
              : isShaking
              ? 'animate-mc-shake'
              : 'hover:scale-[1.01]'
          }`}
          style={{
            // Classical Minecraft Oak Wood Planks & Brown Crate Texture
            backgroundColor: '#6b421d',
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                #543214 0px,
                #543214 2px,
                transparent 2px,
                transparent 24px
              ),
              radial-gradient(circle at 50% 50%, #855325 0%, #633c19 70%, #42250d 100%)
            `,
            imageRendering: 'pixelated',
          }}
          data-interactive="true"
          title="Click 8 times to mine and reveal prize!"
        >
          {/* Classical Minecraft Wood Plank Seams & Nail Head Accents */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage:
                'linear-gradient(to right, #3b220c 1px, transparent 1px), linear-gradient(to bottom, #3b220c 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Minecraft Oak Wood Bevel Border & Corner Brackets */}
          <div className="pointer-events-none absolute inset-1.5 border-2 border-[#9b6330]/80 shadow-[inset_2px_2px_0_#c48344,inset_-2px_-2px_0_#2d1808]" />

          {/* Corner Reinforcement Brackets */}
          <div className="pointer-events-none absolute top-1.5 left-1.5 w-3 h-3 bg-[#3d2511] border border-[#a66d38]" />
          <div className="pointer-events-none absolute top-1.5 right-1.5 w-3 h-3 bg-[#3d2511] border border-[#a66d38]" />
          <div className="pointer-events-none absolute bottom-1.5 left-1.5 w-3 h-3 bg-[#3d2511] border border-[#a66d38]" />
          <div className="pointer-events-none absolute bottom-1.5 right-1.5 w-3 h-3 bg-[#3d2511] border border-[#a66d38]" />

          {/* EXACTLY ONE LINE OF TEXT AS EXPLICITLY REQUESTED */}
          <div className="relative z-10 flex flex-col items-center text-center py-1 sm:py-2">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 border-2 border-[#3d220b] bg-[#2a1708]/90 px-3 sm:px-5 py-2 sm:py-2.5 shadow-[inset_1px_1px_0_#8b5527,0_4px_12px_rgba(0,0,0,0.9)] max-w-full">
              <span className="font-pixel text-[9px] xs:text-[10px] sm:text-xs text-amber-200 font-bold uppercase tracking-wider whitespace-nowrap">
                ⛏️ MINE TO REVEAL PRIZE ⛏️
              </span>
            </div>
          </div>

          {/* PROGRESSIVE FRACTURE CRACKS ON THE WOOD BOXES */}
          {crackStageIndex > 0 && (
            <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
              {CRACK_LEVELS[crackStageIndex].map((crack, idx) => (
                <div
                  key={idx}
                  className="absolute bg-black/95"
                  style={{
                    left: `${crack.x}%`,
                    top: `${crack.y}%`,
                    width: `${crack.w}%`,
                    height: `${crack.h}%`,
                    boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.4), 1px 1px 0 #1b0e04',
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
