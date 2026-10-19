'use client';

import React from 'react';

interface SectionContainerProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'alt' | 'stone' | 'grid';
  showTopSeam?: boolean;
}

export default function SectionContainer({
  id,
  children,
  className = '',
  variant = 'default',
  showTopSeam = false,
}: SectionContainerProps) {
  const bgStyles = {
    default: 'bg-[#0d0b09]',
    alt: 'bg-[#14110e] border-y border-[#261d15]',
    stone: 'bg-[#181512] border-y border-[#2b2118]',
    grid: 'bg-[#0d0b09] bg-minecraft-grid',
  };

  return (
    <section
      id={id}
      className={`relative w-full overflow-hidden scroll-mt-20 sm:scroll-mt-24 ${bgStyles[variant]} ${className}`}
    >
      {/* Minecraft Wooden Seam Divider */}
      {showTopSeam && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 inset-x-0 h-4 z-20"
          style={{
            backgroundImage: 'url(/assets/wooden_seam.png)',
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            imageRendering: 'pixelated',
          }}
        />
      )}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 z-10">
        {children}
      </div>
    </section>
  );
}
