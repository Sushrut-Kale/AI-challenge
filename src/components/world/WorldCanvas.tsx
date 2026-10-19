'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import MinecraftLoadingScreen from '@/components/ui/MinecraftLoadingScreen';
import WebGLFallback from '@/components/ui/WebGLFallback';

// Dynamically import CanvasWrapper with no SSR
const DynamicCanvas = dynamic(
  () => import('./CanvasWrapper'),
  {
    ssr: false,
    loading: () => <MinecraftLoadingScreen progress={25} isReady={false} />,
  }
);

function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const ctx =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return !!ctx;
  } catch {
    return false;
  }
}

export default function WorldCanvas() {
  const [webGLSupported, setWebGLSupported] = useState<boolean | null>(null);
  const [loadProgress, setLoadProgress] = useState(15);
  const [isWorldReady, setIsWorldReady] = useState(false);
  const [overlayFinished, setOverlayFinished] = useState(false);

  useEffect(() => {
    const supported = checkWebGLSupport();
    setWebGLSupported(supported);

    if (supported) {
      // Milestone 1: WebGL verified & environment initialization
      const t1 = setTimeout(() => setLoadProgress((p) => Math.max(p, 35)), 200);
      const t2 = setTimeout(() => setLoadProgress((p) => Math.max(p, 60)), 600);

      // Milestone fallback safety timer (never hang indefinitely)
      const safetyTimer = setTimeout(() => {
        setLoadProgress(100);
        setIsWorldReady(true);
      }, 3200);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(safetyTimer);
      };
    }
  }, []);

  // Milestone 2: Canvas context created & shadow maps ready
  const handleCreated = useCallback(() => {
    setLoadProgress((p) => Math.max(p, 85));
  }, []);

  // Milestone 3: First actual 3D frame rendered on screen
  const handleFirstFrame = useCallback(() => {
    setLoadProgress(100);
    setIsWorldReady(true);
  }, []);

  const handleFadeComplete = useCallback(() => {
    setOverlayFinished(true);
  }, []);

  if (webGLSupported === false) {
    return <WebGLFallback />;
  }

  return (
    <div className="relative w-full h-full bg-[#080d22]">
      {/* 3D World Canvas renders behind loading overlay */}
      <DynamicCanvas
        onCreated={handleCreated}
        onFirstFrame={handleFirstFrame}
      />

      {/* Full-screen Minecraft Loading Screen overlay with smooth fade transition */}
      {!overlayFinished && (
        <MinecraftLoadingScreen
          progress={loadProgress}
          isReady={isWorldReady}
          onFadeComplete={handleFadeComplete}
        />
      )}
    </div>
  );
}
