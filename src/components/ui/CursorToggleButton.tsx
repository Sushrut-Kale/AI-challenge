'use client';

import React from 'react';
import { useCursor } from '@/context/CursorContext';
import { playMinecraftClick } from '@/components/ui/MinecraftAudioManager';

interface CursorToggleButtonProps {
  className?: string;
}

export default function CursorToggleButton({ className = '' }: CursorToggleButtonProps) {
  const { isCursorEnabled, toggleCursor } = useCursor();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playMinecraftClick();
    toggleCursor();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isCursorEnabled ? 'Animated cursor is ON (green). Click to turn off.' : 'Animated cursor is OFF. Click to turn on.'}
      aria-pressed={isCursorEnabled}
      title={isCursorEnabled ? 'Cursor: ON (Green)' : 'Cursor: OFF (Normal)'}
      data-interactive="true"
      className={`
        relative w-7 h-7 min-w-[28px] min-h-[28px]
        flex items-center justify-center p-0.5 border
        transition-all duration-150 cursor-pointer select-none outline-none
        hover:scale-105 active:scale-95
        ${
          isCursorEnabled
            ? 'border-[#22c55e] bg-[#072412] text-[#22c55e] shadow-[0_0_8px_rgba(34,197,94,0.5)]'
            : 'border-[#3f3f46] bg-[#18181b] text-neutral-400 hover:border-neutral-400'
        }
        ${className}
      `.trim()}
    >
      {/* Universal Cursor Sign (Mouse Pointer Arrow) */}
      <svg
        width="15"
        height="15"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
      >
        {/* Dark drop shadow / border for crisp pixel contrast */}
        <path
          d="M2 1V13.2L5.8 9.8L8.2 15L10.4 14L8 8.8H12.5L2 1Z"
          fill="#000000"
        />
        {/* Cursor arrow sign body: Vivid Green when ON, Grey when OFF */}
        <path
          d="M3 2.5V11.5L5.8 9.1L8.2 13.7L9.2 13.2L6.8 8.5H10.8L3 2.5Z"
          fill={isCursorEnabled ? '#22c55e' : '#9ca3af'}
        />
        {/* Subtle inner highlight on the pointer */}
        <path
          d="M3.5 3.5V9.8L5.5 8.2L5.8 8H9.2L3.5 3.5Z"
          fill={isCursorEnabled ? '#86efac' : '#cbd5e1'}
        />
      </svg>

      {/* Tiny active indicator pip: glowing green when cursor is ON */}
      <span
        className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full transition-all duration-200 ${
          isCursorEnabled
            ? 'bg-[#22c55e] shadow-[0_0_5px_#22c55e]'
            : 'bg-[#52525b]'
        }`}
        aria-hidden="true"
      />
    </button>
  );
}
