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
        // Offset so the hammer striking face is precisely at (mouse.x, mouse.y)
        cursorRef.current.style.transform = `translate3d(${mouse.x - 8}px, ${mouse.y - 6}px, 0)`;
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

      // Trailing anvil/diamond sparks when moving
      const now = performance.now();
      if (!prefersReducedMotion && now - lastParticleTime > 45 && particles.length < 24) {
        lastParticleTime = now;
        particles.push({
          x: mouse.x + (Math.random() * 6 - 3),
          y: mouse.y + 6 + (Math.random() * 6 - 3),
          size: Math.floor(Math.random() * 2) + 2,
          alpha: 0.85,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 1.0,
          vy: Math.random() * 1.0 + 0.3,
        });
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);

      // Spawn burst of smithing hammer impact sparks on click!
      if (!prefersReducedMotion) {
        for (let i = 0; i < 9; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 3.2 + 1.5;
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
          className="relative transition-transform duration-100 select-none"
          style={{
            transform: isHovering ? 'scale(1.1)' : 'scale(1)',
            filter: isHovering
              ? 'drop-shadow(0 0 8px rgba(251,191,36,0.95)) drop-shadow(0 0 14px rgba(34,211,238,0.7))'
              : 'drop-shadow(0 3px 6px rgba(0,0,0,0.85))',
          }}
        >
          {/* Animated SVG Character (Steve/Agent) holding Hammer */}
          <svg
            width="56"
            height="56"
            viewBox="0 0 56 56"
            fill="none"
            style={{ imageRendering: 'pixelated' }}
            className="overflow-visible"
          >
            {/* CHARACTER BODY (Left Side) */}
            <g
              style={{
                transformOrigin: '28px 46px',
                transform: isClicking
                  ? 'rotate(8deg) translateY(2px)'
                  : isHovering
                  ? 'translateY(-1px)'
                  : 'none',
                transition: 'transform 80ms ease-out',
              }}
            >
              {/* Back Arm / Left Arm */}
              <rect x="20" y="24" width="4" height="12" fill="#006666" rx="0.5" />
              <rect x="20" y="31" width="4" height="5" fill="#d49b72" rx="0.5" />

              {/* Legs */}
              {/* Left leg */}
              <rect x="22" y="38" width="5" height="11" fill="#1e293b" />
              <rect x="22" y="38" width="5" height="8" fill="#1d4ed8" />
              <rect x="22" y="46" width="5" height="3" fill="#0f172a" />
              {/* Right leg */}
              <rect x="28" y="38" width="5" height="11" fill="#1e293b" />
              <rect x="28" y="38" width="5" height="8" fill="#2563eb" />
              <rect x="28" y="46" width="5" height="3" fill="#0f172a" />

              {/* Torso - Agentcraft Cyan Shirt */}
              <rect x="22" y="23" width="11" height="15" fill="#0d9488" rx="1" />
              <rect x="24" y="23" width="7" height="14" fill="#14b8a6" />
              <rect x="25" y="24" width="5" height="3" fill="#d49b72" /> {/* Neck */}
              <rect x="22" y="36" width="11" height="2" fill="#042f2e" /> {/* Belt */}

              {/* Character Head */}
              {/* Hair Base */}
              <rect x="21" y="10" width="13" height="13" fill="#382215" rx="1" />
              <rect x="21" y="10" width="13" height="4" fill="#24140b" />
              {/* Skin */}
              <rect x="22" y="14" width="11" height="9" fill="#d49b72" />
              {/* Hair Bangs */}
              <rect x="21" y="12" width="3" height="4" fill="#382215" />
              <rect x="31" y="12" width="3" height="4" fill="#382215" />
              <rect x="24" y="13" width="7" height="2" fill="#382215" />
              {/* Eyes */}
              <rect x="23" y="16" width="3" height="2" fill="#ffffff" />
              <rect x="24" y="16" width="2" height="2" fill="#2563eb" /> {/* Eye pupil */}
              <rect x="29" y="16" width="3" height="2" fill="#ffffff" />
              <rect x="30" y="16" width="2" height="2" fill="#2563eb" /> {/* Eye pupil */}
              {/* Nose & Mouth */}
              <rect x="26" y="18" width="3" height="2" fill="#b97c55" />
              <rect x="25" y="20" width="5" height="2" fill="#6c3b24" />
            </g>

            {/* SWINGING RIGHT ARM + HAMMER GROUP */}
            <g
              style={{
                transformOrigin: '28px 24px', // Right shoulder pivot
                transform: isClicking
                  ? 'rotate(-55deg) translate(-10px, 8px)'
                  : isHovering
                  ? 'rotate(-10deg) translate(-1px, -2px)'
                  : 'rotate(0deg)',
                transition: 'transform 70ms cubic-bezier(0.18, 0.89, 0.32, 1.28)',
              }}
            >
              {/* Right Arm (Reaching forward towards hammer) */}
              <rect x="27" y="22" width="6" height="5" fill="#0d9488" rx="0.5" />
              <rect x="23" y="20" width="7" height="4" fill="#14b8a6" />
              <rect x="18" y="18" width="7" height="4" fill="#d49b72" /> {/* Hand gripping */}

              {/* MINECRAFT SMITHING HAMMER */}
              {/* Wooden Handle */}
              <rect x="15" y="14" width="4" height="15" fill="#3d2314" transform="rotate(-30 17 21)" />
              <rect x="16" y="15" width="2" height="13" fill="#854d0e" transform="rotate(-30 17 21)" />
              {/* Gold Collar Band */}
              <rect x="13" y="11" width="5" height="3" fill="#fbbf24" transform="rotate(-30 15 12)" />

              {/* Heavy Double-Beveled Steel Anvil Head */}
              {/* Dark Outline */}
              <rect x="2" y="2" width="14" height="10" fill="#0f172a" rx="1" />
              <rect x="4" y="0" width="10" height="14" fill="#0f172a" rx="1" />

              {/* Steel Head Face */}
              <rect x="3" y="2" width="12" height="10" fill="#475569" />
              <rect x="4" y="1" width="10" height="12" fill="#64748b" />
              {/* Metallic Highlights */}
              <rect x="4" y="2" width="5" height="4" fill="#cbd5e1" />
              <rect x="3" y="1" width="3" height="3" fill="#f8fafc" />
              <rect x="2" y="3" width="2" height="6" fill="#f1f5f9" /> {/* Striking face */}
              <rect x="12" y="3" width="2" height="6" fill="#1e293b" /> {/* Back face */}

              {/* Gold Core Accent on Hammer */}
              <rect x="7" y="5" width="4" height="4" fill="#d97706" />
              <rect x="8" y="6" width="2" height="2" fill="#fef08a" />
            </g>

            {/* IMPACT SPARK AT STRIKE POINT (when clicking) */}
            {isClicking && (
              <g className="animate-ping">
                <rect x="0" y="0" width="6" height="6" fill="#fbbf24" />
                <rect x="1" y="1" width="4" height="4" fill="#ffffff" />
                <rect x="-3" y="2" width="12" height="2" fill="#38bdf8" />
                <rect x="2" y="-3" width="2" height="12" fill="#38bdf8" />
              </g>
            )}

            {/* Hover Sparkle */}
            {isHovering && !isClicking && (
              <g className="animate-pulse">
                <rect x="0" y="0" width="3" height="3" fill="#fbbf24" />
                <rect x="14" y="0" width="2" height="2" fill="#fef08a" />
                <rect x="2" y="12" width="2" height="2" fill="#38bdf8" />
              </g>
            )}
          </svg>
        </div>
      </div>
    </>
  );
}
