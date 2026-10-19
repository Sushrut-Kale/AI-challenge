'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { THEME_LIST, ThemeId } from '@/types/theme';

export default function ThemeSelector() {
  const { themeId, theme, setTheme, soundEnabled, toggleSound } = useTheme();
  const [hoveredTheme, setHoveredTheme] = useState<ThemeId | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside
      className="fixed top-20 right-3 sm:right-6 z-40 flex flex-col items-end pointer-events-auto select-none"
      aria-label="Minecraft Dimension & Background Selector"
    >
      {/* Dimension Badge Toggle */}
      <div className="flex items-center gap-1.5">
        {/* Optional 8-Bit Sound FX Toggle */}
        <button
          onClick={toggleSound}
          type="button"
          aria-label={soundEnabled ? 'Disable 8-bit Minecraft Sound FX' : 'Enable 8-bit Minecraft Sound FX'}
          title={soundEnabled ? 'Sound: ON' : 'Sound: OFF'}
          className={`h-7 px-2 flex items-center gap-1 border-2 font-pixel text-[9px] uppercase transition-all shadow-[2px_2px_0_rgba(0,0,0,0.8)] ${
            soundEnabled
              ? 'bg-[#1b3d1c] border-[#48bb78] text-[#48bb78]'
              : 'bg-[#1c1917]/90 border-[#3d2e20] text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <span>{soundEnabled ? '🔊 SFX' : '🔇 SFX'}</span>
        </button>

        {/* Dimension Switcher Pill */}
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          type="button"
          aria-expanded={isExpanded}
          aria-label="Toggle Minecraft dimension selector"
          className="flex items-center gap-2 px-2.5 py-1.5 bg-[#14110e]/95 border-2 border-[#3d2e20] shadow-[0_4px_16px_rgba(0,0,0,0.8)] hover:border-amber-400 transition-colors"
        >
          <div className="relative w-4 h-4 shrink-0">
            <Image
              src={theme.icon}
              alt=""
              fill
              className="object-contain"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          <span className="font-pixel text-[9px] sm:text-[10px] text-amber-300 tracking-wider hidden xs:inline">
            {theme.shortName.toUpperCase()}
          </span>
          <span className="text-[10px] text-neutral-400 transform transition-transform duration-200">
            {isExpanded ? '▲' : '▼'}
          </span>
        </button>
      </div>

      {/* Expanded Minecraft Theme Selection Panel */}
      {isExpanded && (
        <div className="mt-2 p-2 bg-[#100d0a]/95 border-2 border-[#3d2e20] shadow-[0_12px_32px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.1)] flex flex-col gap-1.5 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-sm">
          <div className="px-1 text-[8px] font-pixel text-neutral-400 tracking-wider uppercase border-b border-[#2d2218] pb-1 flex justify-between items-center">
            <span>SELECT REALM</span>
            <span className="text-amber-400 font-mono text-[7px]">5 THEMES</span>
          </div>

          <div className="flex sm:flex-col gap-1.5">
            {THEME_LIST.map((t) => {
              const isActive = t.id === themeId;
              const isHovered = hoveredTheme === t.id;

              return (
                <div key={t.id} className="relative group">
                  <button
                    onClick={() => {
                      setTheme(t.id);
                      setIsExpanded(false);
                    }}
                    onMouseEnter={() => setHoveredTheme(t.id)}
                    onMouseLeave={() => setHoveredTheme(null)}
                    type="button"
                    aria-label={`Switch to ${t.name} background`}
                    aria-pressed={isActive}
                    className={`w-9 h-9 sm:w-auto sm:px-2 sm:py-1.5 flex items-center justify-center sm:justify-start gap-2 border-2 transition-all relative ${
                      isActive
                        ? 'border-amber-400 bg-[#2b2118] shadow-[inset_0_0_8px_rgba(251,191,36,0.3)]'
                        : 'border-[#373737] bg-[#1a1714] hover:border-neutral-300 hover:bg-[#25201b]'
                    }`}
                  >
                    {/* Item Icon */}
                    <div className="relative w-6 h-6 shrink-0">
                      <Image
                        src={t.icon}
                        alt={t.name}
                        fill
                        className="object-contain"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    </div>

                    {/* Label (desktop) */}
                    <span
                      className={`hidden sm:inline font-pixel text-[9px] tracking-wide whitespace-nowrap ${
                        isActive ? 'text-amber-300 font-bold' : 'text-neutral-300'
                      }`}
                    >
                      {t.name}
                    </span>

                    {/* Active Check Indicator */}
                    {isActive && (
                      <span className="hidden sm:inline-block ml-auto text-amber-400 text-xs">
                        ●
                      </span>
                    )}
                  </button>

                  {/* Mobile hover/long-press tooltip */}
                  {isHovered && (
                    <div className="sm:hidden absolute top-full right-0 mt-1 z-50 px-2 py-1 bg-[#100028]/95 border border-[#3b0764] whitespace-nowrap font-pixel text-[8px] text-amber-300 pointer-events-none">
                      {t.name}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Active Realm Lore Description */}
          <div className="mt-1 pt-1.5 border-t border-[#2d2218] max-w-[210px] hidden sm:block">
            <p className="text-[10px] text-neutral-300 leading-tight">
              {hoveredTheme
                ? THEME_LIST.find((t) => t.id === hoveredTheme)?.lore
                : theme.lore}
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
