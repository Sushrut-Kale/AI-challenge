'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerformanceMonitor, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import * as THREE from 'three';
import WorldScene from './WorldScene';
import { WORLD_CONFIG } from '@/lib/world/world-config';

interface CanvasWrapperProps {
  onCreated?: () => void;
  onFirstFrame?: () => void;
}

function FirstFrameDetector({ onFirstFrame }: { onFirstFrame?: () => void }) {
  const fired = useRef(false);
  useFrame(() => {
    if (!fired.current) {
      fired.current = true;
      onFirstFrame?.();
    }
  });
  return null;
}

export default function CanvasWrapper({ onCreated, onFirstFrame }: CanvasWrapperProps) {
  const dpr = typeof window !== 'undefined'
    ? [1, Math.min(window.devicePixelRatio, WORLD_CONFIG.PIXEL_RATIO_LIMIT)] as [number, number]
    : [1, 2] as [number, number];

  return (
    <Canvas
      shadows
      dpr={dpr}
      camera={{
        fov: WORLD_CONFIG.CAMERA_FOV,
        near: WORLD_CONFIG.CAMERA_NEAR,
        far: WORLD_CONFIG.CAMERA_FAR,
        position: WORLD_CONFIG.CAMERA_INITIAL_POSITION,
      }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      onCreated={({ gl }) => {
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        onCreated?.();
      }}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Adaptive quality based on device performance */}
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <PerformanceMonitor
        onFallback={() => {
          if (process.env.NODE_ENV === 'development') {
            console.log('[WorldCanvas] Performance fallback triggered — reducing quality');
          }
        }}
      />

      <FirstFrameDetector onFirstFrame={onFirstFrame} />

      <Suspense fallback={null}>
        <WorldScene />
      </Suspense>
    </Canvas>
  );
}
