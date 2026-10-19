'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';

export default function WorldBackgroundFallback() {
  const { theme } = useTheme();

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-colors duration-700"
      style={{
        background: `radial-gradient(circle at 50% 20%, ${theme.sky.mid} 0%, ${theme.sky.top} 60%, ${theme.sky.bottom} 100%)`,
      }}
    >
      {/* Minecraft Pixel Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Ambient Theme Glow Orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] opacity-25 animate-pulse transition-colors duration-700"
        style={{ backgroundColor: theme.accentColor }}
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-[100px] opacity-20 transition-colors duration-700"
        style={{ backgroundColor: theme.glowColor }}
      />
    </div>
  );
}
