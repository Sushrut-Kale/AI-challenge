'use client';

import React, { useEffect, useState } from 'react';
import useReducedMotion from '@/hooks/useReducedMotion';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll <= 0) {
        setProgress(0);
        return;
      }
      const currentScroll = window.scrollY;
      const pct = Math.min(100, Math.max(0, (currentScroll / totalScroll) * 100));
      setProgress(pct);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (prefersReducedMotion) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-1.5 bg-[#14161f] border-b border-[#232736] pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-[#5d8a2e] via-[#10b981] to-[#34d399] transition-[width] duration-75 ease-out shadow-[0_0_8px_rgba(16,185,129,0.8)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
