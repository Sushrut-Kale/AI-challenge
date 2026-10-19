'use client';

import React from 'react';

export type BadgeVariant = 'emerald' | 'gold' | 'grass' | 'stone' | 'obsidian' | 'diamond' | 'dirt';

interface PixelBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  className?: string;
}

const badgeVariants: Record<BadgeVariant, string> = {
  emerald: 'bg-emerald-950/80 border-emerald-500/70 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.3)]',
  gold: 'bg-amber-950/80 border-amber-500/70 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)]',
  grass: 'bg-[#1b2b11]/90 border-[#5d8a2e] text-[#86efac] shadow-[0_0_8px_rgba(93,138,46,0.3)]',
  stone: 'bg-neutral-900/90 border-neutral-600 text-neutral-300',
  obsidian: 'bg-purple-950/80 border-purple-500/70 text-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.3)]',
  diamond: 'bg-sky-950/80 border-sky-400/70 text-sky-300 shadow-[0_0_8px_rgba(56,189,248,0.3)]',
  dirt: 'bg-[#2b1e15]/90 border-[#8b6343] text-amber-200',
};

export default function PixelBadge({
  children,
  variant = 'emerald',
  icon,
  className = '',
}: PixelBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        border-2 px-2.5 py-1
        font-pixel text-[8px] sm:text-[9px] tracking-wider uppercase
        select-none backdrop-blur-sm
        ${badgeVariants[variant]}
        ${className}
      `.trim()}
      style={{ imageRendering: 'pixelated' }}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
