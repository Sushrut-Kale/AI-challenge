'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

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
    name: 'Golden Apple',
    sectionId: '#prizes',
    icon: '/assets/items/golden_apple.png',
    tooltip: '₹30K Prize Pool',
    rarity: 'epic',
  },
  {
    id: 6,
    name: 'Guild Emerald',
    sectionId: '#sponsors',
    icon: '/assets/items/emerald.png',
    tooltip: 'Partners & Sponsors',
    rarity: 'rare',
  },
  {
    id: 7,
    name: 'Redstone Repeater',
    sectionId: '#faqs',
    icon: '/assets/items/redstone.png',
    tooltip: 'Frequently Asked Questions',
    rarity: 'rare',
  },
  {
    id: 8,
    name: 'Eye of Ender',
    sectionId: '#registration',
    icon: '/assets/items/ender_eye.png',
    tooltip: 'Register Desk (₹400)',
    rarity: 'epic',
  },
  {
    id: 9,
    name: 'Diamond Sword',
    sectionId: '#hero',
    icon: '/assets/items/diamond.png',
    tooltip: 'Mega Slash Attack!',
    rarity: 'rare',
  },
];

export default function MinecraftHotbar() {
  const [activeSlot, setActiveSlot] = useState<number>(1);
  const [hoveredSlot, setHoveredSlot] = useState<HotbarSlot | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLevelUp, setIsLevelUp] = useState(false);

  // Track active section and scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
      setScrollProgress(Math.min(1, Math.max(0, progress)));

      // Detect which section is currently on screen
      const sections = ['#about', '#rounds', '#timeline', '#rules', '#prizes', '#sponsors', '#faqs', '#registration'];
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

    if (slotId === 9) {
      // Slot 9 triggers a celebratory slash attack!
      triggerLevelUpCelebration();
    } else {
      const target = document.querySelector(slot.sectionId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
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

  return (
    <aside
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center pointer-events-auto select-none transition-all duration-200"
      aria-label="Minecraft Hotbar Quick Navigation"
    >
      {/* Minecraft Item Tooltip on Hover */}
      {hoveredSlot && (
        <div className="mb-2 px-3 py-1.5 bg-[#100028]/95 border-2 border-[#2b005e] shadow-[inset_1px_1px_0_#460098,inset_-1px_-1px_0_#1a003a,0_4px_16px_rgba(0,0,0,0.85)] flex flex-col items-center animate-in fade-in zoom-in-95 duration-100">
          <span
            className={`font-pixel text-[10px] sm:text-xs font-bold tracking-wide ${
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
          <span className="font-sans text-[11px] text-neutral-300 font-medium">
            [{hoveredSlot.id}] {hoveredSlot.tooltip}
          </span>
        </div>
      )}

      {/* Minecraft Experience Bar (XP Bar) */}
      <div className="w-[320px] sm:w-[440px] mb-1.5 flex flex-col items-center">
        {/* Level Number */}
        <div
          onClick={triggerLevelUpCelebration}
          className={`font-pixel text-xs sm:text-sm text-[#80ff20] font-bold cursor-pointer transition-transform hover:scale-110 active:scale-95 ${
            isLevelUp ? 'animate-bounce text-amber-300 scale-125' : ''
          }`}
          style={{ textShadow: '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000' }}
          title="Click for XP Level Up!"
        >
          26
        </div>

        {/* Green Pixelated XP Bar Track */}
        <div className="w-full h-2 bg-[#0c0e12] border border-[#2b2b2b] shadow-[inset_1px_1px_0_#000] relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#55aa00] via-[#80ff20] to-[#b3ff66] transition-all duration-150 shadow-[0_0_8px_rgba(128,255,32,0.6)]"
            style={{ width: `${Math.round(scrollProgress * 100)}%` }}
          />
        </div>
      </div>

      {/* 9-Slot Hotbar HUD Container */}
      <div
        className="flex items-center p-1 bg-[#8f8f8f] border-2 border-[#373737] shadow-[inset_2px_2px_0_#dbdbdb,inset_-2px_-2px_0_#555555,0_8px_24px_rgba(0,0,0,0.85)] rounded-none"
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
                relative w-8 h-8 sm:w-11 sm:h-11 flex items-center justify-center
                border-2 transition-transform duration-75 outline-none
                ${
                  isSelected
                    ? 'border-white bg-[#8b8b8b] scale-110 z-20 shadow-[inset_2px_2px_0_#fff,inset_-2px_-2px_0_#fff,0_0_12px_rgba(255,255,255,0.7)]'
                    : 'border-[#373737] bg-[#8b8b8b] hover:bg-[#9e9e9e] active:scale-95 shadow-[inset_2px_2px_0_#373737,inset_-2px_-2px_0_#dbdbdb]'
                }
              `}
              aria-label={slot.name}
              data-interactive="true"
            >
              <Image
                src={slot.icon}
                alt={slot.name}
                width={28}
                height={28}
                className="w-5 h-5 sm:w-7 sm:h-7 object-contain pointer-events-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]"
                priority
              />

              {/* Slot Index Number Badge */}
              <span
                className="absolute bottom-0 right-0.5 font-pixel text-[6px] sm:text-[7px] text-neutral-300 font-bold pointer-events-none"
                style={{ textShadow: '1px 1px 0 #000' }}
              >
                {slot.id}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
