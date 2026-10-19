'use client';

import React, { useEffect, useState } from 'react';

interface CelebrationParticle {
  id: string;
  tx: number;
  ty: number;
  color: string;
  size: number;
}

interface CelebrationBurst {
  id: number;
  originX: number;
  originY: number;
  particles: CelebrationParticle[];
}

interface AmbientOrb {
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
  const [ambientOrbs, setAmbientOrbs] = useState<AmbientOrb[]>([]);
  const [bursts, setBursts] = useState<CelebrationBurst[]>([]);

  // 1. Ambient gentle floating XP orbs
  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof window === 'undefined') return;

      setAmbientOrbs((prev) => {
        if (prev.length > 20) return prev;

        const newOrb: AmbientOrb = {
          id: Math.random() + Date.now(),
          x: Math.random() * window.innerWidth,
          y: window.innerHeight + 10,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -(0.8 + Math.random() * 1.2),
          color: Math.random() > 0.4 ? '#80ff20' : '#55ff55',
          size: 4 + Math.floor(Math.random() * 4),
          life: 0,
          maxLife: 150 + Math.random() * 80,
        };
        return [...prev, newOrb];
      });
    }, 550);

    return () => clearInterval(interval);
  }, []);

  // Ambient orbs physics loop (self-cleaning)
  useEffect(() => {
    let animId: number;

    const tick = () => {
      setAmbientOrbs((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life + 1,
          }))
          .filter(
            (p) =>
              p.life < p.maxLife &&
              p.y > -20 &&
              p.x > -20 &&
              (typeof window !== 'undefined' ? p.x < window.innerWidth + 20 : true)
          )
      );
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  // 2. 9th Option Celebratory Slash Burst (Guaranteed auto-disappearing via CSS + timeout)
  useEffect(() => {
    const handleBurst = () => {
      if (typeof window === 'undefined') return;

      const burstId = Date.now() + Math.random();
      const originX = window.innerWidth / 2;
      const originY = window.innerHeight * 0.65;

      const colors = ['#fbbf24', '#38bdf8', '#10b981', '#f43f5e', '#a855f7', '#fef08a'];
      const particles: CelebrationParticle[] = [];

      // 16 radiating directions with 2-3 step particles per ray
      const numRays = 16;
      for (let r = 0; r < numRays; r++) {
        const baseAngle = (r / numRays) * Math.PI * 2 + (Math.random() * 0.15 - 0.075);
        const rayColor = colors[r % colors.length];

        for (let step = 1; step <= 2; step++) {
          const distance = step * 120 + Math.random() * 60;
          particles.push({
            id: `p-${burstId}-${r}-${step}`,
            tx: Math.cos(baseAngle) * distance,
            ty: Math.sin(baseAngle) * distance,
            color: rayColor,
            size: Math.floor(Math.random() * 4) + 6,
          });
        }
      }

      const newBurst: CelebrationBurst = {
        id: burstId,
        originX,
        originY,
        particles,
      };

      setBursts((prev) => [...prev, newBurst]);

      // FAIL-SAFE CLEANUP: Remove burst DOM nodes completely after CSS animation finishes (750ms)
      setTimeout(() => {
        setBursts((prev) => prev.filter((b) => b.id !== burstId));
      }, 800);
    };

    window.addEventListener('minecraft-slash-burst', handleBurst);
    return () => window.removeEventListener('minecraft-slash-burst', handleBurst);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-30 overflow-hidden"
      aria-hidden="true"
    >
      {/* Gentle Floating XP Orbs */}
      {ambientOrbs.map((p) => {
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

      {/* 9th Option Radiating Bursts - 100% Guaranteed to vanish cleanly */}
      {bursts.map((burst) => (
        <div
          key={burst.id}
          className="absolute inset-0 pointer-events-none"
          style={{ transform: `translate3d(${burst.originX}px, ${burst.originY}px, 0)` }}
        >
          {burst.particles.map((p) => (
            <div
              key={p.id}
              className="absolute animate-mc-celebration-ray rounded-none"
              style={
                {
                  left: 0,
                  top: 0,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  backgroundColor: p.color,
                  boxShadow: `0 0 8px ${p.color}, inset 1px 1px 0 rgba(255,255,255,0.7)`,
                  '--burst-x': `${p.tx}px`,
                  '--burst-y': `${p.ty}px`,
                  imageRendering: 'pixelated',
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
}
