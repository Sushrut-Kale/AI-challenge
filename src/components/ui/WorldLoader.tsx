'use client';

import React, { useEffect, useState } from 'react';

interface WorldLoaderProps {
  progress?: number;
}

export default function WorldLoader({ progress = 0 }: WorldLoaderProps) {
  const [dots, setDots] = useState('');
  const [tip, setTip] = useState(0);

  const tips = [
    'Generating terrain...',
    'Planting trees...',
    'Filling the oceans...',
    'Building castles...',
    'Painting the sunset...',
    'Summoning floating islands...',
  ];

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots(d => (d.length >= 3 ? '' : d + '.'));
    }, 400);
    const tipInterval = setInterval(() => {
      setTip(t => (t + 1) % tips.length);
    }, 1800);
    return () => {
      clearInterval(dotInterval);
      clearInterval(tipInterval);
    };
  }, [tips.length]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      {/* Pixel art block animation */}
      <div className="flex gap-2 mb-8">
        {['#5D8A2E', '#8B6343', '#828282', '#3F76E4', '#FF8C42'].map((color, i) => (
          <div
            key={i}
            className="w-8 h-8 rounded-sm animate-bounce"
            style={{
              backgroundColor: color,
              animationDelay: `${i * 0.15}s`,
              boxShadow: `0 4px 0 ${color}88`,
            }}
          />
        ))}
      </div>

      {/* Title */}
      <h1
        className="text-center text-white font-bold mb-2 tracking-wider font-pixel"
        style={{
          fontSize: 'clamp(10px, 2vw, 16px)',
          textShadow: '3px 3px 0 #FF8C42',
        }}
      >
        AI Challenge World
      </h1>
      <p className="text-[#87CEEB] mb-8 text-sm text-center font-terminal">
        National Agentic AI Challenge · MIT Academy of Engineering
      </p>

      {/* Progress bar */}
      <div className="w-64 bg-gray-800 border-2 border-gray-600 rounded overflow-hidden mb-4">
        <div
          className="h-4 bg-gradient-to-r from-[#5D8A2E] to-[#FF8C42] transition-all duration-300"
          style={{ width: `${Math.max(5, progress)}%` }}
        />
      </div>

      {/* Loading tip */}
      <p className="text-gray-300 text-sm text-center h-5 font-terminal">
        {tips[tip]}{dots}
      </p>
    </div>
  );
}
