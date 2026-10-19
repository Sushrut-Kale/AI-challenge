'use client';

import React, { useEffect } from 'react';

interface IntroTransitionProps {
  isTransitioning: boolean;
  onTransitionEnd: () => void;
}

export default function IntroTransition({
  isTransitioning,
  onTransitionEnd,
}: IntroTransitionProps) {
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        onTransitionEnd();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning, onTransitionEnd]);

  if (!isTransitioning) return null;

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none transition-opacity duration-700 ease-out opacity-100 bg-[#0c0e14]"
      style={{
        backgroundImage:
          'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.15) 0%, #0c0e14 70%)',
      }}
      aria-hidden="true"
    />
  );
}
