'use client';

import React, { useEffect, useState } from 'react';
import useReducedMotion from '@/hooks/useReducedMotion';

interface CountdownProps {
  targetDateISO: string; // ISO string e.g. 2026-11-17T09:00:00+05:30
  label?: string;
  className?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function calculateTimeRemaining(targetISO: string): TimeRemaining {
  const target = new Date(targetISO).getTime();
  const now = new Date().getTime();
  const diff = target - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isPast: false };
}

export default function EventCountdown({
  targetDateISO,
  label = 'COUNTDOWN TO FINALE',
  className = '',
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setTimeLeft(calculateTimeRemaining(targetDateISO));

    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(targetDateISO));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDateISO, prefersReducedMotion]);

  if (!timeLeft) {
    return null;
  }

  if (timeLeft.isPast) {
    return (
      <div className={`p-3 bg-[#17140f] border-2 border-amber-600/60 text-center ${className}`}>
        <span className="font-pixel text-[10px] text-amber-300 uppercase tracking-wider">
          ★ EVENT HAS COMMENCED AT MIT AOE
        </span>
      </div>
    );
  }

  const units = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds },
  ];

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {label && (
        <span className="font-pixel text-[8px] sm:text-[9px] text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-emerald-400 animate-pulse" />
          {label}
        </span>
      )}

      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {units.map((u) => (
          <div
            key={u.label}
            className="flex flex-col items-center p-2 sm:p-2.5 border-2 border-[#382618] bg-[#1a130c] shadow-[inset_1px_1px_0_rgba(255,255,255,0.1),0_4px_0_#0f0b07] min-w-[56px] sm:min-w-[70px]"
          >
            <span className="font-pixel text-base sm:text-2xl text-amber-300 tabular-nums">
              {String(u.value).padStart(2, '0')}
            </span>
            <span className="font-pixel text-[7px] sm:text-[8px] text-neutral-400 uppercase mt-1 tracking-wider">
              {u.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
