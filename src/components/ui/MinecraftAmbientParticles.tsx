'use client';

import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

export default function MinecraftAmbientParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate gentle ambient floating XP orbs
    const interval = setInterval(() => {
      if (typeof window === 'undefined') return;

      setParticles((prev) => {
        // limit maximum particles
        if (prev.length > 25) return prev;

        const newP: Particle = {
          id: Math.random() + Date.now(),
          x: Math.random() * window.innerWidth,
          y: window.innerHeight + 10,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -(0.8 + Math.random() * 1.2),
          color: Math.random() > 0.4 ? '#80ff20' : '#55ff55',
          size: 4 + Math.floor(Math.random() * 5),
          life: 0,
          maxLife: 180 + Math.random() * 120,
        };
        return [...prev, newP];
      });
    }, 450);

    return () => clearInterval(interval);
  }, []);

  // Listen to slash burst celebration
  useEffect(() => {
    const handleBurst = () => {
      if (typeof window === 'undefined') return;
      const burstParticles: Particle[] = [];
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight * 0.7;

      for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 6;
        burstParticles.push({
          id: Math.random() + Date.now(),
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: ['#fbbf24', '#38bdf8', '#10b981', '#f43f5e', '#a855f7'][Math.floor(Math.random() * 5)],
          size: 6 + Math.floor(Math.random() * 6),
          life: 0,
          maxLife: 60 + Math.random() * 30,
        });
      }
      setParticles((prev) => [...prev, ...burstParticles]);
    };

    window.addEventListener('minecraft-slash-burst', handleBurst);
    return () => window.removeEventListener('minecraft-slash-burst', handleBurst);
  }, []);

  // Animation frame loop
  useEffect(() => {
    let animId: number;

    const tick = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life + 1,
          }))
          .filter((p) => p.life < p.maxLife && p.y > -20 && p.x > -20 && (typeof window !== 'undefined' ? p.x < window.innerWidth + 20 : true))
      );
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-30 overflow-hidden"
      aria-hidden="true"
    >
      {particles.map((p) => {
        const progress = p.life / p.maxLife;
        const opacity = progress < 0.2 ? progress / 0.2 : 1 - (progress - 0.2) / 0.8;

        return (
          <div
            key={p.id}
            className="absolute rounded-none shadow-[0_0_6px_currentColor]"
            style={{
              transform: `translate3d(${p.x}px, ${p.y}px, 0)`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              color: p.color,
              opacity: Math.max(0, Math.min(1, opacity * 0.75)),
              imageRendering: 'pixelated',
            }}
          />
        );
      })}
    </div>
  );
}
