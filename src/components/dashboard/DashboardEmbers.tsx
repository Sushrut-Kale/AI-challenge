'use client';

import React, { useEffect, useState } from 'react';

interface Ember {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

export default function DashboardEmbers() {
  const [embers, setEmbers] = useState<Ember[]>([]);

  useEffect(() => {
    // Generate 18 subtle floating embers
    const colors = [
      'rgba(245, 158, 11, 0.45)', // amber
      'rgba(234, 88, 12, 0.4)',   // orange
      'rgba(16, 185, 129, 0.35)', // emerald
      'rgba(168, 85, 247, 0.3)',  // purple/nether
      'rgba(251, 191, 36, 0.5)',  // gold
    ];

    const generated: Ember[] = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.floor(Math.random() * 3) + 2, // 2-4px pixel ember
      duration: Math.random() * 8 + 6,        // 6-14s float
      delay: Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    setEmbers(generated);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {embers.map((ember) => (
        <span
          key={ember.id}
          className="absolute rounded-none"
          style={{
            left: `${ember.x}%`,
            bottom: '-10px',
            width: `${ember.size}px`,
            height: `${ember.size}px`,
            backgroundColor: ember.color,
            boxShadow: `0 0 ${ember.size * 2}px ${ember.color}`,
            animation: `dashboardEmberFloat ${ember.duration}s linear infinite`,
            animationDelay: `${ember.delay}s`,
            opacity: 0.7,
            imageRendering: 'pixelated',
          }}
        />
      ))}
      <style jsx global>{`
        @keyframes dashboardEmberFloat {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          50% {
            transform: translateY(-50vh) translateX(${Math.random() > 0.5 ? '15px' : '-15px'}) scale(1.1);
            opacity: 0.9;
          }
          90% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(-105vh) translateX(${Math.random() > 0.5 ? '-20px' : '20px'}) scale(0.6);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
