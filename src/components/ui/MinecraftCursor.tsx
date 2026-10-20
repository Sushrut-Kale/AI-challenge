'use client';

import React, { useEffect, useRef, useState } from 'react';
import useReducedMotion from '@/hooks/useReducedMotion';
import { useCursor } from '@/context/CursorContext';

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
  const characterRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { isCursorEnabled, setCursorEnabled } = useCursor();

  const [isEnabled, setIsEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [facingRight, setFacingRight] = useState(true);

  useEffect(() => {
    // Only enable on desktop pointer devices when cursor is turned ON
    if (typeof window === 'undefined') return;

    if (!isCursorEnabled) {
      document.documentElement.classList.remove('custom-cursor-active');
      setIsEnabled(false);
      return;
    }

    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasFinePointer) {
      document.documentElement.classList.remove('custom-cursor-active');
      setIsEnabled(false);
      return;
    }

    setIsEnabled(true);
    document.documentElement.classList.add('custom-cursor-active');

    // Mouse coordinates (actual user pointer)
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    // Follower character position (smooth lerped)
    const charPos = { x: mouse.x, y: mouse.y };

    let lastParticleTime = 0;
    const particles: Particle[] = [];
    const colors = ['#fbbf24', '#f59e0b', '#38bdf8', '#22d3ee', '#10b981', '#ffffff'];
    let animId: number;
    let walkPhase = 0;

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

    const checkElementUnderPointer = (target: HTMLElement | null) => {
      if (!target) {
        setIsHovering(false);
        return;
      }

      const closestInteractive = target.closest(
        'a[href], button, [role="button"], input, select, textarea, label, summary, [tabindex]:not([tabindex="-1"]), .mc-card[data-interactive="true"], .mc-interactive, [data-interactive="true"], .cursor-pointer, [data-slot]'
      ) as HTMLElement | null;

      let isInteractive = false;
      if (closestInteractive) {
        const isDisabled = Boolean(
          closestInteractive.closest(':disabled, [aria-disabled="true"], .pointer-events-none, .cursor-not-allowed')
        );
        isInteractive = !isDisabled;
      }
      setIsHovering(isInteractive);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      setIsVisible(true);

      const target = e.target as HTMLElement | null;
      checkElementUnderPointer(target);
    };

    const handleScroll = () => {
      if (mouse.x < 0 || mouse.y < 0) return;
      const target = document.elementFromPoint(mouse.x, mouse.y) as HTMLElement | null;
      checkElementUnderPointer(target);
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      setIsClicking(true);

      // Spawn spark burst around cursor on click
      if (!prefersReducedMotion) {
        for (let i = 0; i < 8; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 2.5 + 1.0;
          particles.push({
            x: e.clientX,
            y: e.clientY,
            size: Math.floor(Math.random() * 3) + 2,
            alpha: 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
          });
        }
      }
    };

    const handleMouseUp = () => setIsClicking(false);

    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsHovering(false);
      setIsClicking(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleBlur = () => {
      setIsClicking(false);
      setIsHovering(false);
    };

    const handleTouchStart = () => {
      setCursorEnabled(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('blur', handleBlur);
    window.addEventListener('touchstart', handleTouchStart, { passive: true, once: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Physics & Render Loop: character smoothly follows cursor
    const render = (time: number) => {
      // Offset character slightly behind and below the cursor so it doesn't block clicks
      const targetFacingRight = mouse.x >= charPos.x;
      setFacingRight(targetFacingRight);

      // Character floats beside cursor: to the left when moving right, to the right when moving left
      const targetX = targetFacingRight ? mouse.x - 30 : mouse.x + 30;
      const targetY = mouse.y + 12;

      // Smooth lerp (0.14 = fluid follow)
      const dx = targetX - charPos.x;
      const dy = targetY - charPos.y;
      charPos.x += dx * 0.14;
      charPos.y += dy * 0.14;

      const speed = Math.hypot(dx, dy);

      // Walking bobbing motion while following, breathing hover when idle
      let bobY = 0;
      if (speed > 1.2) {
        walkPhase += Math.min(speed * 0.08, 0.35);
        bobY = Math.sin(walkPhase) * 3.5;

        // Particle footsteps while running
        if (!prefersReducedMotion && time - lastParticleTime > 65 && particles.length < 20) {
          lastParticleTime = time;
          particles.push({
            x: charPos.x + (Math.random() * 6 - 3),
            y: charPos.y + 20,
            size: Math.floor(Math.random() * 2) + 2,
            alpha: 0.75,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 0.5,
            vy: Math.random() * 0.5 + 0.3,
          });
        }
      } else {
        // Subtle floating breath when near cursor
        bobY = Math.sin(time * 0.004) * 2;
      }

      if (characterRef.current) {
        characterRef.current.style.transform = `translate3d(${charPos.x}px, ${charPos.y + bobY}px, 0)`;
      }

      // Draw trailing dust/sparks
      if (ctx && canvas && !prefersReducedMotion) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= 0.022;

          if (p.alpha <= 0) {
            particles.splice(i, 1);
            continue;
          }

          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
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
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [prefersReducedMotion, isCursorEnabled, setCursorEnabled]);

  if (!isEnabled || !isCursorEnabled || !isVisible) return null;

  return (
    <>
      {/* Background canvas for footsteps & click sparks */}
      {!prefersReducedMotion && (
        <canvas
          ref={canvasRef}
          className="pointer-events-none fixed inset-0 z-[9990]"
          style={{ imageRendering: 'pixelated' }}
          aria-hidden="true"
        />
      )}

      {/* Minecraft Steve Follower Companion */}
      <div
        ref={characterRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9995] will-change-transform"
      >
        <div
          className="relative select-none transition-all duration-100"
          style={{
            transform: `scaleX(${facingRight ? 1 : -1}) scale(${isHovering ? 1.1 : 1})`,
            filter: isHovering
              ? 'drop-shadow(0 0 8px rgba(251,191,36,0.95)) drop-shadow(0 0 14px rgba(34,211,238,0.7))'
              : 'drop-shadow(0 4px 8px rgba(0,0,0,0.85))',
          }}
        >
          {/* Minecraft Character with Animated Swinging Hammer */}
          <svg
            width="52"
            height="52"
            viewBox="-16 -20 44 44"
            fill="none"
            style={{ imageRendering: 'pixelated' }}
            className="overflow-visible"
          >
            {/* STEVE CHARACTER BODY */}
            <g id="steve-body">
              {/* Back Arm */}
              <rect x="7" y="-3" width="3" height="8" fill="#006666" rx="0.5" />
              <rect x="7" y="3" width="3" height="3" fill="#d49b72" rx="0.5" />

              {/* Legs */}
              <rect x="-1" y="7" width="4" height="9" fill="#1d4ed8" />
              <rect x="3.5" y="7" width="4" height="9" fill="#2563eb" />
              <rect x="-1" y="13" width="4" height="3" fill="#0f172a" />
              <rect x="3.5" y="13" width="4" height="3" fill="#0f172a" />

              {/* Torso - AgentCraft Teal Shirt */}
              <rect x="-2" y="-4" width="9" height="11" fill="#0d9488" rx="0.5" />
              <rect x="-1" y="-4" width="7" height="9" fill="#14b8a6" />
              <rect x="0" y="-4" width="3" height="2" fill="#d49b72" /> {/* Neck */}
              <rect x="-2" y="5" width="9" height="2" fill="#042f2e" /> {/* Belt */}

              {/* Head */}
              <rect x="-2" y="-14" width="9.5" height="9.5" fill="#382215" rx="0.5" />
              <rect x="-2" y="-14" width="9.5" height="3" fill="#24140b" />
              {/* Face Skin */}
              <rect x="-1" y="-11" width="8" height="6.5" fill="#d49b72" />
              {/* Hair Bangs */}
              <rect x="-2" y="-12.5" width="2" height="2.5" fill="#382215" />
              <rect x="5.5" y="-12.5" width="2" height="2.5" fill="#382215" />
              <rect x="0" y="-12" width="4.5" height="1.5" fill="#382215" />
              {/* Eyes */}
              <rect x="0" y="-9.5" width="1.5" height="1.5" fill="#ffffff" />
              <rect x="1" y="-9.5" width="1" height="1.5" fill="#2563eb" />
              <rect x="4" y="-9.5" width="1.5" height="1.5" fill="#ffffff" />
              <rect x="5" y="-9.5" width="1" height="1.5" fill="#2563eb" />
              {/* Mouth */}
              <rect x="1.5" y="-7" width="2.5" height="1" fill="#6c3b24" />
            </g>

            {/* SWINGING ARM + MINECRAFT HAMMER */}
            <g
              id="steve-arm-hammer"
              style={{
                transformOrigin: '-2px -1px',
                transform: isClicking
                  ? 'rotate(-38deg) translate(-4px, 2px)'
                  : isHovering
                  ? 'rotate(-12deg)'
                  : 'rotate(0deg)',
                transition: 'transform 80ms cubic-bezier(0.2, 0.85, 0.32, 1.2)',
              }}
            >
              {/* Front Arm */}
              <rect x="-5" y="-2" width="5" height="3.5" fill="#0d9488" rx="0.5" />
              <rect x="-9" y="-1" width="5" height="3" fill="#d49b72" rx="0.5" />

              {/* Wooden Handle */}
              <rect x="-15" y="-0.5" width="8" height="2.2" fill="#3d2314" transform="rotate(-15 -9 0)" />
              <rect x="-14" y="0.2" width="6" height="1" fill="#854d0e" transform="rotate(-15 -9 0)" />
              {/* Gold Socket Collar */}
              <rect x="-15.5" y="-1.5" width="3" height="3" fill="#fbbf24" transform="rotate(-15 -12 0)" />

              {/* SMITHING HAMMER HEAD */}
              <g id="hammer-head">
                <rect x="-21" y="-5" width="9" height="9" fill="#0f172a" rx="0.5" />
                <rect x="-20" y="-4" width="7" height="7" fill="#475569" />
                <rect x="-19" y="-4.5" width="5" height="8" fill="#64748b" />
                <rect x="-21" y="-4" width="1.5" height="6" fill="#ffffff" />
                <rect x="-16.5" y="-2" width="2.5" height="2.5" fill="#d97706" />
                <rect x="-16" y="-1.5" width="1" height="1" fill="#fef08a" />
              </g>
            </g>

            {/* CLICK IMPACT SPARK */}
            {isClicking && (
              <g className="animate-ping">
                <rect x="-20" y="-2" width="5" height="5" fill="#fbbf24" />
                <rect x="-18" y="0" width="2" height="2" fill="#ffffff" />
              </g>
            )}

            {/* CURIOUS EMOJI BALLOON ON HOVER */}
            {isHovering && !isClicking && (
              <g className="animate-bounce">
                <rect x="8" y="-18" width="8" height="7" fill="#fbbf24" rx="1" />
                <polygon points="8,-11 11,-11 8,-9" fill="#fbbf24" />
                <text x="10" y="-13" fill="#1a1206" fontSize="5" fontWeight="bold" fontFamily="monospace">
                  !
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>
    </>
  );
}
