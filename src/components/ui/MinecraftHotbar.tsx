'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface HotbarSlot {
  id: number;
  name: string;
  sectionId: string;
  icon: string;
  tooltip: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic';
}

const HOTBAR_SLOTS: HotbarSlot[] = [
  {
    id: 1,
    name: 'Surveyor Compass',
    sectionId: '#about',
    icon: '/assets/items/compass.png',
    tooltip: 'About Event',
    rarity: 'common',
  },
  {
    id: 2,
    name: 'Excavator Pickaxe',
    sectionId: '#rounds',
    icon: '/assets/items/iron_pickaxe.png',
    tooltip: '2 Competition Rounds',
    rarity: 'uncommon',
  },
  {
    id: 3,
    name: 'Expedition Clock',
    sectionId: '#timeline',
    icon: '/assets/items/clock.png',
    tooltip: 'Event Timeline',
    rarity: 'uncommon',
  },
  {
    id: 4,
    name: 'Book & Quill',
    sectionId: '#rules',
    icon: '/assets/items/book_quill.png',
    tooltip: 'Rules & Tracks',
    rarity: 'common',
  },
  {
    id: 5,
    name: 'Archival Chest',
    sectionId: '#docs',
    icon: '/assets/items/chest.png',
    tooltip: 'Docs & Pitch Template',
    rarity: 'rare',
  },
  {
    id: 6,
    name: 'Golden Apple',
    sectionId: '#prizes',
    icon: '/assets/items/golden_apple.png',
    tooltip: 'Rewards & Perks',
    rarity: 'epic',
  },
  {
    id: 7,
    name: 'Guild Emerald',
    sectionId: '#sponsors',
    icon: '/assets/items/emerald.png',
    tooltip: 'Partners & Sponsors',
    rarity: 'rare',
  },
  {
    id: 8,
    name: 'Redstone Repeater',
    sectionId: '#faqs',
    icon: '/assets/items/redstone.png',
    tooltip: 'Frequently Asked Questions',
    rarity: 'rare',
  },
  {
    id: 9,
    name: 'Eye of Ender',
    sectionId: '#contact',
    icon: '/assets/items/ender_eye.png',
    tooltip: 'Coordinators & Support',
    rarity: 'epic',
  },
];

export default function MinecraftHotbar() {
  const pathname = usePathname();
  const [activeSlot, setActiveSlot] = useState<number>(1);
  const [hoveredSlot, setHoveredSlot] = useState<HotbarSlot | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLevelUp, setIsLevelUp] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const tooltipTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Track active section and scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
      setScrollProgress(Math.min(1, Math.max(0, progress)));

      // Detect which section is currently on screen
      const sections = [
        '#about',
        '#rounds',
        '#timeline',
        '#rules',
        '#docs',
        '#prizes',
        '#sponsors',
        '#faqs',
        '#contact',
      ];
      let current = 1;
      for (let i = 0; i < sections.length; i++) {
        const el = document.querySelector(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.15) {
            current = i + 1;
          }
        }
      }
      setActiveSlot(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const triggerLevelUpCelebration = useCallback(() => {
    setIsLevelUp(true);
    setTimeout(() => setIsLevelUp(false), 1200);

    // Dispatch a custom event so cursor or particles burst
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('minecraft-slash-burst'));
    }
  }, []);

  const selectSlot = useCallback((slotId: number) => {
    setActiveSlot(slotId);
    const slot = HOTBAR_SLOTS.find((s) => s.id === slotId);
    if (!slot) return;

    // Show tooltip briefly on touch
    setHoveredSlot(slot);
    if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    tooltipTimeoutRef.current = setTimeout(() => {
      setHoveredSlot(null);
    }, 1800);

    const target = document.querySelector(slot.sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }

    if (slotId === 9) {
      triggerLevelUpCelebration();
    }
  }, [triggerLevelUpCelebration]);

  // Keyboard navigation 1-9
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = parseInt(e.key, 10);
      if (key >= 1 && key <= 9) {
        selectSlot(key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectSlot]);

  // Hide hotbar completely on dashboard, admin and login routes
  if (
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/admin') ||
    pathname === '/login'
  ) {
    return null;
  }

  return (
    <aside
      className="fixed bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center pointer-events-none select-none transition-all duration-200"
      aria-label="Minecraft Hotbar Quick Navigation"
    >
      {/* Mobile Collapse / Expand Badge */}
      <button
        type="button"
        onClick={() => setIsCollapsed((prev) => !prev)}
        className="pointer-events-auto mb-1 px-2.5 py-1 min-h-[26px] border border-[#3d2e20] bg-black/80 font-pixel text-[7px] text-amber-300 uppercase tracking-widest hover:text-white transition-colors backdrop-blur-sm cursor-pointer"
        aria-label={isCollapsed ? 'Show hotbar' : 'Hide hotbar'}
        data-interactive="true"
      >
        {isCollapsed ? '▲ SHOW HOTBAR' : '▼ HIDE'}
      </button>

      {/* Minecraft Item Tooltip on Hover / Touch */}
      {hoveredSlot && (
        <div className="mb-1.5 px-3 py-1 bg-[#100028]/95 border-2 border-[#2b005e] shadow-[inset_1px_1px_0_#460098,inset_-1px_-1px_0_#1a003a,0_4px_16px_rgba(0,0,0,0.85)] flex flex-col items-center animate-in fade-in zoom-in-95 duration-100 max-w-[280px] text-center">
          <span
            className={`font-pixel text-[9px] sm:text-xs font-bold tracking-wide ${
              hoveredSlot.rarity === 'epic'
                ? 'text-[#d946ef]'
                : hoveredSlot.rarity === 'rare'
                ? 'text-[#38bdf8]'
                : hoveredSlot.rarity === 'uncommon'
                ? 'text-[#facc15]'
                : 'text-white'
            }`}
          >
            {hoveredSlot.name}
          </span>
          <span className="font-sans text-[10px] sm:text-[11px] text-neutral-300 font-medium truncate w-full">
            [{hoveredSlot.id}] {hoveredSlot.tooltip}
          </span>
        </div>
      )}

      {/* Minecraft Experience Bar (XP Bar) */}
      <div className="w-[280px] xs:w-[310px] sm:w-[420px] mb-1 flex flex-col items-center pointer-events-none">
        {/* Level Number with classic lime green font and 3D pixel shadow */}
        <button
          type="button"
          onClick={triggerLevelUpCelebration}
          className={`pointer-events-auto font-pixel text-xs sm:text-sm text-[#80ff20] font-bold cursor-pointer transition-transform hover:scale-110 active:scale-95 select-none min-h-[30px] min-w-[32px] flex items-center justify-center p-0.5 ${
            isLevelUp ? 'animate-bounce text-amber-300 scale-125' : ''
          }`}
          style={{
            textShadow: '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000',
          }}
          data-interactive="true"
          title="Click to trigger Hammer Strike celebration!"
          aria-label="Level 26 - Click to trigger Hammer Strike celebration"
        >
          26
        </button>

        {/* Green Pixelated XP Bar with authentic segment ticks */}
        <div className="w-full h-2 sm:h-2.5 bg-[#0a0d0a] border-2 border-[#1c241c] shadow-[inset_1px_1px_0_#000,0_2px_8px_rgba(0,0,0,0.8)] relative overflow-hidden flex items-center">
          {/* Progress fill */}
          <div
            className="h-full bg-gradient-to-r from-[#44aa00] via-[#80ff20] to-[#b3ff66] transition-all duration-150 shadow-[0_0_10px_rgba(128,255,32,0.8)]"
            style={{ width: `${Math.round(scrollProgress * 100)}%` }}
          />

          {/* 18 Notch Overlay for authentic Minecraft segment lines */}
          <div className="absolute inset-0 flex justify-between pointer-events-none opacity-40">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="w-[1px] h-full bg-black/70" />
            ))}
          </div>
        </div>
      </div>

      {/* 9-Slot Hotbar HUD Container with dark bedrock/deepslate styling */}
      {!isCollapsed && (
        <div
          className="pointer-events-auto flex items-center p-1 sm:p-1.5 bg-[#161311]/95 border-2 border-[#3d2e20] shadow-[inset_1px_1px_0_#543b22,inset_-1px_-1px_0_#0a0806,0_12px_32px_rgba(0,0,0,0.95)] backdrop-blur-md rounded-none gap-0.5 sm:gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-150"
          style={{ imageRendering: 'pixelated' }}
        >
        {HOTBAR_SLOTS.map((slot) => {
          const isSelected = activeSlot === slot.id;

          return (
            <button
              key={slot.id}
              type="button"
              onClick={() => selectSlot(slot.id)}
              onMouseEnter={() => setHoveredSlot(slot)}
              onMouseLeave={() => setHoveredSlot(null)}
              className={`
                relative w-8.5 h-8.5 sm:w-11 sm:h-11 min-w-[34px] min-h-[34px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center
                border-2 transition-all duration-100 outline-none cursor-pointer
                ${
                  isSelected
                    ? 'border-amber-300 bg-[#35291d] scale-110 z-30 shadow-[0_0_16px_rgba(251,191,36,0.6),inset_1px_1px_0_#ffffff]'
                    : 'border-[#261d15] bg-[#221a14] hover:border-amber-500/70 hover:bg-[#2c221a] active:scale-95 shadow-[inset_2px_2px_0_#120d09,inset_-1px_-1px_0_#382b20]'
                }
              `}
              aria-label={slot.name}
              data-slot={slot.id}
              data-interactive="true"
            >
              {/* Corner Brackets for active slot */}
              {isSelected && (
                <>
                  <span className="pointer-events-none absolute -top-1 -left-1 w-1.5 h-1.5 bg-amber-200" />
                  <span className="pointer-events-none absolute -top-1 -right-1 w-1.5 h-1.5 bg-amber-200" />
                  <span className="pointer-events-none absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-amber-200" />
                  <span className="pointer-events-none absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-amber-200" />
                </>
              )}

              <Image
                src={slot.icon}
                alt={slot.name}
                width={28}
                height={28}
                className={`w-5 h-5 sm:w-7 sm:h-7 object-contain pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-transform ${
                  isSelected ? 'scale-105' : 'hover:-translate-y-0.5'
                }`}
                priority
              />

              {/* Slot Index Number Badge */}
              <span
                className={`absolute bottom-0 right-0.5 font-pixel text-[6px] sm:text-[7px] font-bold pointer-events-none ${
                  isSelected ? 'text-amber-300' : 'text-neutral-400'
                }`}
                style={{ textShadow: '1px 1px 0 #000' }}
              >
                {slot.id}
              </span>
            </button>
          );
        })}
      </div>
      )}
    </aside>
  );
}
