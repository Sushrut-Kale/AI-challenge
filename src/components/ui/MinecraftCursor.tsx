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
          className="relative transition-transform duration-100 ease-out select-none"
          style={{
            transformOrigin: '2px 2px',
            transform: isClicking
              ? 'rotate(-32deg) scale(1.15) translate(2px, -2px)'
              : isHovering
              ? 'scale(1.14) rotate(4deg)'
              : 'scale(1) rotate(0deg)',
            filter: isHovering
              ? 'drop-shadow(0 0 8px rgba(34,211,238,0.9)) drop-shadow(0 0 14px rgba(168,85,247,0.7))'
              : 'drop-shadow(0 3px 6px rgba(0,0,0,0.85))',
          }}
        >
          {/* Authentic 38x38 Minecraft Diamond Sword Pixel Art SVG with Tip at (2, 2) */}
          <svg
            width="38"
            height="38"
            viewBox="0 0 38 38"
            fill="none"
            style={{ imageRendering: 'pixelated' }}
          >
            {/* Sword Blade Tip & Outer Dark Border (083344) */}
            <path
              d="M0 2h4v2h2v2h2v2h2v2h2v2h2v2h2v2h2v2h2v-2h2v-2h2v-2h2v-2h2v-2h2v-2h2v-2h2V0h-4v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v-2h-2v-2h-2v-2H8V6H6V4H4V2H2V0H0v2z"
              fill="#083344"
              transform="translate(2, 2)"
            />

            {/* Diamond Blade Body - Cyan (#22d3ee / #06b6d4) */}
            <rect x="4" y="4" width="4" height="4" fill="#67e8f9" />
            <rect x="6" y="6" width="4" height="4" fill="#a5f3fc" />
            <rect x="8" y="8" width="4" height="4" fill="#22d3ee" />
            <rect x="10" y="10" width="4" height="4" fill="#a5f3fc" />
            <rect x="12" y="12" width="4" height="4" fill="#22d3ee" />
            <rect x="14" y="14" width="4" height="4" fill="#06b6d4" />
            <rect x="16" y="16" width="4" height="4" fill="#22d3ee" />
            <rect x="18" y="18" width="4" height="4" fill="#0891b2" />
            <rect x="20" y="20" width="4" height="4" fill="#22d3ee" />

            {/* Sword Crossguard - Dark Oak & Netherite */}
            <rect x="16" y="24" width="4" height="4" fill="#1e1814" />
            <rect x="20" y="22" width="4" height="4" fill="#382516" />
            <rect x="22" y="20" width="4" height="4" fill="#1e1814" />
            <rect x="24" y="16" width="4" height="4" fill="#382516" />
            <rect x="26" y="14" width="4" height="4" fill="#1e1814" />

            <rect x="18" y="22" width="3" height="3" fill="#06b6d4" />
            <rect x="22" y="18" width="3" height="3" fill="#06b6d4" />

            {/* Wood Handle */}
            <rect x="22" y="24" width="4" height="4" fill="#5c3c1e" />
            <rect x="24" y="26" width="4" height="4" fill="#82552b" />
            <rect x="26" y="28" width="4" height="4" fill="#5c3c1e" />

            {/* Pommel (Bottom Cap) */}
            <rect x="28" y="30" width="4" height="4" fill="#1e1814" />
            <rect x="30" y="32" width="4" height="4" fill="#0891b2" />
            <rect x="32" y="34" width="3" height="3" fill="#22d3ee" />

            {/* Enchantment glint overlay when hovering */}
            {isHovering && (
              <g className="animate-pulse opacity-80">
                <circle cx="8" cy="8" r="3" fill="#f0abfc" />
                <circle cx="16" cy="16" r="3" fill="#c084fc" />
                <circle cx="24" cy="24" r="2" fill="#e879f9" />
              </g>
            )}
          </svg>
        </div>
      </div>
    </>
  );
}
