'use client';

import React from 'react';
import Image from 'next/image';

interface MinecraftHangingSignProps {
  title: string;
  subtitle?: string;
  icon?: string;
  accentColor?: string;
  badge?: string;
  className?: string;
}

export default function MinecraftHangingSign({
  title,
  subtitle,
  icon,
  accentColor = '#f59e0b',
  badge,
  className = '',
}: MinecraftHangingSignProps) {
  return (
    <div className={`relative pt-3 flex flex-col items-center select-none group ${className}`}>
      {/* Hanging Chains (left and right) */}
      <div className="w-3/4 flex justify-between px-6 z-10 pointer-events-none">
        <div
          className="w-2 h-4 border-x border-[#1a1208] shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
          style={{
            backgroundImage: 'url(/assets/chain_strip.png)',
            backgroundSize: '8px 16px',
            backgroundRepeat: 'repeat-y',
            imageRendering: 'pixelated',
          }}
          aria-hidden="true"
        />
        <div
          className="w-2 h-4 border-x border-[#1a1208] shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
          style={{
            backgroundImage: 'url(/assets/chain_strip.png)',
            backgroundSize: '8px 16px',
            backgroundRepeat: 'repeat-y',
            imageRendering: 'pixelated',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Swinging Wooden Sign Body */}
      <div
        className="mc-swing w-full p-4 border-3 border-[#4b3418] bg-[#bc9862] shadow-[inset_2px_2px_0_rgba(255,255,255,0.25),inset_-2px_-2px_0_rgba(0,0,0,0.35),0_8px_20px_rgba(0,0,0,0.7)] text-center transition-transform hover:rotate-1"
        style={{
          backgroundImage: 'linear-gradient(rgba(233,207,157,0.7), rgba(233,207,157,0.7)), url(/assets/items/oak_sign.png)',
          backgroundSize: 'auto, 48px 48px',
          imageRendering: 'pixelated',
        }}
      >
        {badge && (
          <span className="inline-block px-2.5 py-0.5 mb-1.5 bg-[#4b3418] text-[#fde047] font-pixel text-[8px] sm:text-[9px] uppercase tracking-wider font-bold shadow-sm">
            {badge}
          </span>
        )}

        <div className="flex items-center justify-center gap-2.5 mb-1">
          {icon && (
            <Image
              src={icon}
              alt=""
              width={24}
              height={24}
              className="w-5 h-5 sm:w-6 sm:h-6 object-contain pointer-events-none drop-shadow"
            />
          )}
          <h4
            className="font-pixel text-xs sm:text-sm uppercase tracking-wide font-bold"
            style={{ color: '#241608', textShadow: '1px 1px 0 rgba(255,255,255,0.4)' }}
          >
            {title}
          </h4>
        </div>

        {/* Separator line */}
        <div
          className="h-[2px] w-full my-1.5 opacity-80"
          style={{ backgroundColor: accentColor }}
        />

        {subtitle && (
          <p className="font-sans text-xs text-[#241608] font-medium leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
