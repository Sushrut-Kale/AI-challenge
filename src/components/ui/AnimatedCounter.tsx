'use client';

import React, { useEffect, useRef, useState } from 'react';
import useReducedMotion from '@/hooks/useReducedMotion';

interface AnimatedCounterProps {
  value: number;
  duration?: number; // duration in ms, default 1800ms
  prefix?: string;
  suffix?: string;
  formatNumber?: boolean;
  className?: string;
  ariaLabel?: string;
}

export default function AnimatedCounter({
  value,
  duration = 1800,
  prefix = '',
  suffix = '',
  formatNumber = true,
  className = '',
  ariaLabel,
}: AnimatedCounterProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState<number>(() => prefersReducedMotion ? value : 0);
  const hasAnimatedRef = useRef<boolean>(false);
  const isFinishedRef = useRef<boolean>(false);

  useEffect(() => {
    // If reduced motion is preferred, immediately render target value
    if (prefersReducedMotion) {
      setDisplayValue(value);
      hasAnimatedRef.current = true;
      isFinishedRef.current = true;
      return;
    }

    // If already animated, guarantee target value is maintained
    if (hasAnimatedRef.current && isFinishedRef.current) {
      setDisplayValue(value);
      return;
    }

    const node = containerRef.current;
    if (!node) return;

    let animId: number;
    let startTime: number | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          // Disconnect observer immediately so it can never re-trigger
          observer.unobserve(node);
          observer.disconnect();

          const step = (timestamp: number) => {
            if (startTime === null) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(1, elapsed / duration);

            // Smooth easeOutQuart easing
            const ease = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(ease * value);

            if (progress < 1) {
              setDisplayValue(current);
              animId = requestAnimationFrame(step);
            } else {
              isFinishedRef.current = true;
              setDisplayValue(value);
            }
          };

          animId = requestAnimationFrame(step);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (animId) cancelAnimationFrame(animId);
    };
  }, [value, duration, prefersReducedMotion]);

  const formattedNumber = formatNumber
    ? new Intl.NumberFormat('en-IN').format(displayValue)
    : displayValue.toString();

  const finalFormatted = `${prefix}${new Intl.NumberFormat('en-IN').format(value)}${suffix}`;

  return (
    <span
      ref={containerRef}
      className={`inline-block tabular-nums select-none ${className}`}
      aria-label={ariaLabel || finalFormatted}
    >
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
}
