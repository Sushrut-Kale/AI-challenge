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
    const colors = ['#fbbf24', '#f59e0b', '#38bdf8', '#22d3ee', '#10b981', '#ffffff'];
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
        // Hotspot is exactly at the hammer striking face (0, 0)
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

      // Trailing subtle sparks when moving
      const now = performance.now();
      if (!prefersReducedMotion && now - lastParticleTime > 45 && particles.length < 24) {
        lastParticleTime = now;
        particles.push({
          x: mouse.x + (Math.random() * 4 - 2),
          y: mouse.y + (Math.random() * 4 - 2),
          size: Math.floor(Math.random() * 2) + 2,
          alpha: 0.85,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 0.8,
          vy: Math.random() * 0.8 + 0.2,
        });
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);

      // Spawn burst of smithing hammer impact sparks precisely at click coordinate!
      if (!prefersReducedMotion) {
        for (let i = 0; i < 10; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 3.0 + 1.2;
          particles.push({
            x: e.clientX,
            y: e.clientY,
            size: Math.floor(Math.random() * 3) + 3,
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
          p.alpha -= 0.04;

          if (p.alpha <= 0) {
            particles.splice(i, 1);
            continue;
          }

          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          // Minecraft block particle
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
      {/* Background canvas for sparks */}
      {!prefersReducedMotion && (
        <canvas
          ref={canvasRef}
          className="pointer-events-none fixed inset-0 z-[9998]"
          style={{ imageRendering: 'pixelated' }}
          aria-hidden="true"
        />
      )}

      {/* Main Character with Hammer Cursor */}
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
          className="relative transition-transform duration-75 select-none"
          style={{
            transformOrigin: '0px 0px', // Hammer striking face is anchored at (0, 0)
            transform: isClicking
              ? 'rotate(-24deg) scale(1.08)'
              : isHovering
              ? 'scale(1.06) rotate(4deg)'
              : 'scale(1) rotate(0deg)',
            filter: isHovering
              ? 'drop-shadow(0 0 6px rgba(251,191,36,0.95)) drop-shadow(0 0 12px rgba(34,211,238,0.7))'
              : 'drop-shadow(0 2px 5px rgba(0,0,0,0.85))',
          }}
        >
          {/* Animated SVG Character (Steve/Agent) holding Hammer with Hotspot at (0, 0) */}
          <svg
            width="52"
            height="52"
            viewBox="0 0 52 52"
            fill="none"
            style={{ imageRendering: 'pixelated' }}
            className="overflow-visible"
          >
            {/* MINECRAFT SMITHING HAMMER (Impact point at 0, 0) */}
            <g id="hammer-head">
              {/* Dark Outline */}
              <rect x="0" y="0" width="13" height="9" fill="#0f172a" rx="0.5" />
              <rect x="1" y="0" width="11" height="11" fill="#0f172a" rx="0.5" />

              {/* Steel Hammer Plates */}
              <rect x="1" y="1" width="11" height="7" fill="#475569" />
              <rect x="2" y="1" width="9" height="9" fill="#64748b" />
              <rect x="2" y="2" width="4" height="4" fill="#cbd5e1" />
              <rect x="1" y="1" width="3" height="2" fill="#f8fafc" />
              {/* Striking Face Highlight */}
              <rect x="0" y="1" width="2" height="6" fill="#ffffff" />

              {/* Gold Hammer Core Inlay */}
              <rect x="5" y="3" width="3" height="3" fill="#d97706" />
              <rect x="6" y="4" width="1" height="1" fill="#fef08a" />

              {/* Angled Wooden Shaft extending to Steve's hand */}
              <rect x="9" y="8" width="12" height="3" fill="#3d2314" transform="rotate(35 9 8)" />
              <rect x="10" y="9" width="10" height="1.5" fill="#854d0e" transform="rotate(35 9 8)" />
              {/* Gold Collar socket */}
              <rect x="8" y="7" width="4" height="3" fill="#fbbf24" transform="rotate(35 8 7)" />
            </g>

            {/* MINECRAFT CHARACTER STEVE / AGENT (Standing to bottom-right of hammer) */}
            <g id="character-body">
              {/* Left Arm / Back Arm */}
              <rect x="20" y="16" width="3" height="8" fill="#006666" rx="0.5" />
              <rect x="20" y="22" width="3" height="3" fill="#d49b72" rx="0.5" />

              {/* Legs */}
              <rect x="22" y="26" width="4" height="9" fill="#1d4ed8" />
              <rect x="27" y="26" width="4" height="9" fill="#2563eb" />
              <rect x="22" y="32" width="4" height="3" fill="#0f172a" />
              <rect x="27" y="32" width="4" height="3" fill="#0f172a" />

              {/* Torso - Agentcraft Cyan Shirt */}
              <rect x="21" y="14" width="10" height="13" fill="#0d9488" rx="0.5" />
              <rect x="22" y="14" width="7" height="11" fill="#14b8a6" />
              <rect x="23" y="14" width="4" height="2" fill="#d49b72" /> {/* Neck */}
              <rect x="21" y="24" width="10" height="2" fill="#042f2e" /> {/* Belt */}

              {/* Character Head */}
              {/* Hair Base */}
              <rect x="21" y="3" width="11" height="11" fill="#382215" rx="0.5" />
              <rect x="21" y="3" width="11" height="3.5" fill="#24140b" />
              {/* Skin */}
              <rect x="22" y="6.5" width="9" height="7.5" fill="#d49b72" />
              {/* Hair Bangs */}
              <rect x="21" y="5" width="2" height="3" fill="#382215" />
              <rect x="30" y="5" width="2" height="3" fill="#382215" />
              <rect x="23" y="6" width="5" height="1.5" fill="#382215" />
              {/* Eyes */}
              <rect x="23" y="8" width="2" height="2" fill="#ffffff" />
              <rect x="24" y="8" width="1" height="2" fill="#2563eb" />
              <rect x="27" y="8" width="2" height="2" fill="#ffffff" />
              <rect x="28" y="8" width="1" height="2" fill="#2563eb" />
              {/* Mouth */}
              <rect x="25" y="11" width="3" height="1" fill="#6c3b24" />

              {/* Right Arm Reaching Forward Gripping Hammer Handle */}
              <rect x="18" y="14" width="4" height="4" fill="#0d9488" rx="0.5" />
              <rect x="15" y="13" width="5" height="4" fill="#d49b72" rx="0.5" />
            </g>

            {/* IMPACT FLASH PRECISELY AT (0, 0) WHEN CLICKING */}
            {isClicking && (
              <g className="animate-ping">
                <rect x="-2" y="-2" width="6" height="6" fill="#fbbf24" />
                <rect x="-1" y="-1" width="4" height="4" fill="#ffffff" />
                <rect x="-4" y="0" width="10" height="2" fill="#38bdf8" />
                <rect x="0" y="-4" width="2" height="10" fill="#38bdf8" />
              </g>
            )}

            {/* Hover Sparkle */}
            {isHovering && !isClicking && (
              <g className="animate-pulse">
                <rect x="-1" y="-1" width="3" height="3" fill="#fbbf24" />
                <rect x="10" y="0" width="2" height="2" fill="#fef08a" />
              </g>
            )}
          </svg>
        </div>
      </div>
    </>
  );
}
