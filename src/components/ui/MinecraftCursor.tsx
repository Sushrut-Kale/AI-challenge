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
    // Only enable on fine pointer devices (desktop mouse, trackpad)
    if (typeof window === 'undefined') return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    setIsEnabled(true);

    const mouse = { x: -100, y: -100 };
    let lastParticleTime = 0;
    const particles: Particle[] = [];
    const colors = ['#10b981', '#5d8a2e', '#fbbf24', '#34d399', '#7bb53b'];
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

      // Check hovered element
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

      // Spawn trailing block particle if motion enabled
      const now = performance.now();
      if (!prefersReducedMotion && now - lastParticleTime > 45 && particles.length < 16) {
        lastParticleTime = now;
        particles.push({
          x: mouse.x + (Math.random() * 8 - 4),
          y: mouse.y + 12 + (Math.random() * 6 - 3),
          size: Math.floor(Math.random() * 3) + 3, // 3 to 5px pixel block
          alpha: 0.8,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 0.8,
          vy: Math.random() * 0.8 + 0.3,
        });
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Render loop for trailing pixel blocks
    const render = () => {
      if (ctx && canvas && !prefersReducedMotion) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= 0.025;

          if (p.alpha <= 0) {
            particles.splice(i, 1);
            continue;
          }

          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          // Minecraft block particle: crisp square pixel
          ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
          // Darker pixel outline on bottom/right
          ctx.fillStyle = 'rgba(0,0,0,0.4)';
          ctx.fillRect(Math.floor(p.x), Math.floor(p.y) + p.size - 1, p.size, 1);
          ctx.fillRect(Math.floor(p.x) + p.size - 1, Math.floor(p.y), 1, p.size);
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
      cancelAnimationFrame(animId);
    };
  }, [prefersReducedMotion]);

  if (!isEnabled) return null;

  return (
    <>
      {/* Background canvas for particle trail */}
      {!prefersReducedMotion && (
        <canvas
          ref={canvasRef}
          className="pointer-events-none fixed inset-0 z-[9998]"
          style={{ imageRendering: 'pixelated' }}
          aria-hidden="true"
        />
      )}

      {/* Main Minecraft Pixel Cursor */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-150 ${
          isTextInput ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          willChange: 'transform',
        }}
      >
        <div
          className={`relative transition-transform duration-100 ${
            isClicking ? 'scale-90' : isHovering ? 'scale-125' : 'scale-100'
          }`}
        >
          {isHovering ? (
            /* Hover State: Glowing Emerald Crosshair / Pointer */
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="drop-shadow-[0_2px_6px_rgba(16,185,129,0.8)]"
              style={{ imageRendering: 'pixelated' }}
            >
              {/* Outer Pixelated Diamond Pointer */}
              <polygon
                points="12,2 18,8 18,16 12,22 6,16 6,8"
                fill="#10B981"
                stroke="#022c22"
                strokeWidth="2"
              />
              {/* Inner Core Highlight */}
              <polygon
                points="12,6 15,10 15,14 12,18 9,14 9,10"
                fill="#34D399"
              />
              <rect x="11" y="11" width="2" height="2" fill="#FFFFFF" />
            </svg>
          ) : (
            /* Normal State: Crisp Minecraft Pixel Arrow / Sword Tip */
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]"
              style={{ imageRendering: 'pixelated' }}
            >
              {/* Pixel Art Pointer with stepped edges */}
              <path
                d="M2,2 L14,8 L9,10 L7,15 Z"
                fill="#F3F4F6"
                stroke="#111827"
                strokeWidth="1.5"
                strokeLinejoin="miter"
              />
              {/* Grass Green accent tip */}
              <polygon points="2,2 6,4 4,6" fill="#5D8A2E" />
              {/* Shadow edge */}
              <polygon points="8,10 14,8 11,11" fill="#9CA3AF" />
            </svg>
          )}
        </div>
      </div>
    </>
  );
}
