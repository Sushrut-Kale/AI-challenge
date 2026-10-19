'use client';

import React from 'react';

export type CardVariant = 'stone' | 'grass' | 'emerald' | 'wood' | 'obsidian';

interface PixelCardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
  accentBarColor?: string;
  headerIcon?: React.ReactNode;
  title?: string;
  badge?: React.ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  stone: 'mc-card-stone text-neutral-200 hover:border-neutral-400',
  grass: 'mc-card-grass text-emerald-100 hover:border-[#7bb53b]',
  emerald: 'mc-card-emerald text-emerald-100 hover:border-[#34d399] pulse-emerald',
  wood: 'mc-card-wood text-amber-100 hover:border-[#a77854]',
  obsidian: 'mc-card-obsidian text-purple-100 hover:border-[#a855f7]',
};

export default function PixelCard({
  children,
  variant = 'stone',
  className = '',
  interactive = true,
  onClick,
  accentBarColor,
  headerIcon,
  title,
  badge,
}: PixelCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        mc-card relative p-5 sm:p-6
        ${variantStyles[variant]}
        ${interactive ? 'cursor-pointer hover:-translate-y-1.5 transition-all duration-200' : ''}
        ${className}
      `.trim()}
      data-interactive={interactive ? 'true' : undefined}
    >
      {/* Decorative Pixel Corner Accents */}
      <div className="pointer-events-none absolute top-1 left-1 w-1.5 h-1.5 bg-white/30" />
      <div className="pointer-events-none absolute top-1 right-1 w-1.5 h-1.5 bg-black/40" />
      <div className="pointer-events-none absolute bottom-1 left-1 w-1.5 h-1.5 bg-white/20" />
      <div className="pointer-events-none absolute bottom-1 right-1 w-1.5 h-1.5 bg-black/60" />

      {/* Optional Top Color Accent Line */}
      {accentBarColor && (
        <div
          className="absolute top-0 left-0 right-0 h-1.5 opacity-90"
          style={{ backgroundColor: accentBarColor }}
        />
      )}

      {/* Card Header if title or icon provided */}
      {(title || headerIcon || badge) && (
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            {headerIcon && (
              <span className="shrink-0 text-xl sm:text-2xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                {headerIcon}
              </span>
            )}
            {title && (
              <h3 className="font-pixel text-xs sm:text-sm tracking-wider uppercase text-white truncate">
                {title}
              </h3>
            )}
          </div>
          {badge && <div className="shrink-0">{badge}</div>}
        </div>
      )}

      {/* Card Body */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
