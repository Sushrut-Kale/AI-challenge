'use client';

import React from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  tag?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  tag,
  centered = true,
  className = '',
}: SectionHeadingProps) {
  return (
    <div
      className={`mb-12 sm:mb-16 ${centered ? 'text-center' : 'text-left'} ${className}`}
    >
      {tag && (
        <div className={`mb-3 flex ${centered ? 'justify-center' : 'justify-start'}`}>
          <span className="inline-flex items-center gap-2 border-2 border-[#5d8a2e] bg-[#1a2e14]/90 px-3.5 py-1.5 font-pixel text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#86efac] shadow-[0_2px_8px_rgba(93,138,46,0.3)]">
            <span className="inline-block w-1.5 h-1.5 bg-[#86efac]" />
            {tag}
          </span>
        </div>
      )}

      <h2 className="pixel-heading text-lg xs:text-xl sm:text-3xl md:text-4xl text-white tracking-wide sm:tracking-wider">
        {title}
      </h2>

      {/* Decorative Minecraft-style Block Divider */}
      <div
        className={`my-4 flex items-center gap-1.5 ${
          centered ? 'justify-center' : 'justify-start'
        }`}
      >
        <span className="w-8 h-1 bg-[#5d8a2e]" />
        <span className="w-2 h-2 bg-[#10b981] rotate-45 shadow-[0_0_8px_#10b981]" />
        <span className="w-8 h-1 bg-[#5d8a2e]" />
      </div>

      {subtitle && (
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-200 font-sans leading-relaxed font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
}
