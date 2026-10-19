'use client';

import React, { useEffect, useRef, useState } from 'react';
import useReducedMotion from '@/hooks/useReducedMotion';

interface Particle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  color: string;
  vx: number;
  vy: number;
}

export default function MinecraftCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isTextInput, setIsTextInput] = useState(false);

  useEffect(() => {
    // Only enable on desktop mouse/fine pointer devices
    if (typeof window === 'undefined') return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    setIsEnabled(true);

    const mouse = { x: -100, y: -100 };
    let lastParticleTime = 0;
    const particles: Particle[] = [];
    const colors = ['#22d3ee', '#38bdf8', '#67e8f9', '#10b981', '#fbbf24', '#ffffff'];
    let animId: number;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
      }

      // Check hovered interactive target
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest('a, button, [role="button"], input[type="submit"], input[type="button"], .mc-card, .mc-interactive, [data-interactive]')
        );
        setIsHovering(isInteractive);

        const isText = Boolean(
          target.closest('input[type="text"], input[type="email"], textarea, [contenteditable="true"]')
        );
        setIsTextInput(isText);
      }

      // Trailing critical hit & diamond sparkle particles
      const now = performance.now();
      if (!prefersReducedMotion && now - lastParticleTime > 40 && particles.length < 24) {
        lastParticleTime = now;
        particles.push({
          x: mouse.x + (Math.random() * 8 - 4),
          y: mouse.y + 14 + (Math.random() * 6 - 3),
          size: Math.floor(Math.random() * 3) + 3,
          alpha: 0.9,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 1.2,
          vy: Math.random() * 1.2 + 0.4,
        });
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);

      // Spawn burst of critical hit sparkles on click!
      if (!prefersReducedMotion) {
        for (let i = 0; i < 7; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 2.5 + 1.2;
          particles.push({
            x: e.clientX,
            y: e.clientY,
            size: Math.floor(Math.random() * 3) + 4,
            alpha: 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
          });
        }
      }
    };

    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Particle render loop
    const render = () => {
      if (ctx && canvas && !prefersReducedMotion) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= 0.035;

          if (p.alpha <= 0) {
            particles.splice(i, 1);
            continue;
          }

          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          // Minecraft square block particle
          ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
        }
        ctx.globalAlpha = 1;
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [prefersReducedMotion]);

  if (!isEnabled) return null;

  return (
    <>
      {/* Background canvas for sword sparkles */}
      {!prefersReducedMotion && (
        <canvas
          ref={canvasRef}
          className="pointer-events-none fixed inset-0 z-[9998]"
          style={{ imageRendering: 'pixelated' }}
          aria-hidden="true"
        />
      )}

      {/* Main Big Minecraft Diamond Sword Cursor */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 z-[9999] transition-opacity duration-150 ${
          isTextInput ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          willChange: 'transform',
        }}
      >
        <div
          className="relative transition-transform duration-75 ease-out select-none"
          style={{
            transformOrigin: '4px 4px',
            transform: isClicking
              ? 'rotate(-38deg) scale(1.18) translate(-2px, 6px)'
              : isHovering
              ? 'scale(1.12) rotate(6deg)'
              : 'scale(1) rotate(0deg)',
            filter: isHovering
              ? 'drop-shadow(0 0 10px rgba(251,191,36,0.9)) drop-shadow(0 0 16px rgba(16,185,129,0.7))'
              : 'drop-shadow(0 4px 8px rgba(0,0,0,0.85))',
          }}
        >
          {/* Authentic Minecraft Smithing Hammer Pixel Art SVG (Striking Hotspot at 4, 4) */}
          <svg
            width="38"
            height="38"
            viewBox="0 0 38 38"
            fill="none"
            style={{ imageRendering: 'pixelated' }}
          >
            {/* Hammer Head - Heavy Double-Beveled Steel Anvil Head */}
            {/* Dark Outline */}
            <rect x="0" y="2" width="16" height="12" fill="#0f172a" rx="1" />
            <rect x="2" y="0" width="12" height="16" fill="#0f172a" rx="1" />

            {/* Iron / Steel Face Plates */}
            <rect x="2" y="3" width="12" height="10" fill="#475569" />
            <rect x="3" y="2" width="10" height="12" fill="#64748b" />
            <rect x="3" y="3" width="6" height="5" fill="#cbd5e1" />
            <rect x="2" y="2" width="4" height="4" fill="#f8fafc" />

            {/* Steel Striking Edge Highlight */}
            <rect x="1" y="4" width="2" height="8" fill="#e2e8f0" />
            <rect x="13" y="4" width="2" height="8" fill="#334155" />

            {/* Gold / Brass Reinforcement Collar Socket */}
            <rect x="7" y="12" width="6" height="4" fill="#78350f" />
            <rect x="8" y="13" width="4" height="3" fill="#fbbf24" />
            <rect x="9" y="14" width="2" height="1" fill="#fef08a" />

            {/* Angled Oak Wood Shaft */}
            <rect x="11" y="16" width="4" height="4" fill="#382516" />
            <rect x="12" y="17" width="3" height="3" fill="#78471f" />
            <rect x="14" y="19" width="4" height="4" fill="#382516" />
            <rect x="15" y="20" width="3" height="3" fill="#a06028" />
            <rect x="17" y="22" width="4" height="4" fill="#382516" />
            <rect x="18" y="23" width="3" height="3" fill="#78471f" />
            <rect x="20" y="25" width="4" height="4" fill="#382516" />
            <rect x="21" y="26" width="3" height="3" fill="#a06028" />
            <rect x="23" y="28" width="4" height="4" fill="#382516" />
            <rect x="24" y="29" width="3" height="3" fill="#78471f" />

            {/* Hammer Pommel / End Cap */}
            <rect x="26" y="31" width="5" height="5" fill="#0f172a" />
            <rect x="27" y="32" width="3" height="3" fill="#94a3b8" />
            <rect x="28" y="33" width="1" height="1" fill="#f8fafc" />

            {/* Glowing Golden Sparkle when hovering */}
            {isHovering && (
              <g className="animate-pulse">
                <rect x="0" y="0" width="2" height="2" fill="#fbbf24" />
                <rect x="14" y="2" width="2" height="2" fill="#fef08a" />
                <rect x="4" y="14" width="2" height="2" fill="#38bdf8" />
              </g>
            )}
          </svg>
        </div>
      </div>
    </>
  );
}
