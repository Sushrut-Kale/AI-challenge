'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '@/context/ThemeContext';
import useReducedMotion from '@/hooks/useReducedMotion';
import WorldBackgroundFallback from './WorldBackgroundFallback';

// Dynamically import Canvas components with SSR disabled
const ThreeCanvas = dynamic(() => import('./WorldBackgroundCanvas'), {
  ssr: false,
  loading: () => <WorldBackgroundFallback />,
});

function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    );
  } catch {
    return false;
  }
}

export default function WorldBackground() {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);

  useEffect(() => {
    setHasWebGL(checkWebGLSupport());
  }, []);

  if (hasWebGL === false) {
    return <WorldBackgroundFallback />;
  }

  if (hasWebGL === null) {
    return null; // Initial mount
  }

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      <ThreeCanvas />
    </div>
  );
}
