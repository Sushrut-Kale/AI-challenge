'use client';

import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '@/context/ThemeContext';
import useReducedMotion from '@/hooks/useReducedMotion';
import ThemeSky from './ThemeSky';
import ThemeVoxelLandscape from './ThemeVoxelLandscape';
import ThemeParticles from './ThemeParticles';

function SceneContent() {
  const { theme } = useTheme();
  const { scene, camera } = useThree();
  const prefersReducedMotion = useReducedMotion();

  // Scroll parallax reference
  const scrollYRef = useRef(0);
  const targetYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update dynamic fog
  useEffect(() => {
    scene.fog = new THREE.FogExp2(theme.sky.fog, theme.sky.fogDensity);
    return () => {
      scene.fog = null;
    };
  }, [scene, theme.sky.fog, theme.sky.fogDensity]);

  // Gentle scroll parallax camera movement
  useFrame((_, delta) => {
    if (prefersReducedMotion) return;

    // Subtly shift camera based on document scroll
    const maxScroll = typeof document !== 'undefined' ? document.documentElement.scrollHeight - window.innerHeight : 1000;
    const progress = maxScroll > 0 ? scrollYRef.current / maxScroll : 0;

    // Range: camera moves gently from 0 down to -5 in depth and slightly rotates
    const targetY = -progress * 6;
    targetYRef.current += (targetY - targetYRef.current) * Math.min(1, delta * 3.0);

    camera.position.y = targetYRef.current;
  });

  return (
    <>
      {/* Dynamic Lighting for Active Theme */}
      <ambientLight
        color={theme.lighting.ambientColor}
        intensity={theme.lighting.ambientIntensity}
      />
      <directionalLight
        color={theme.lighting.sunColor}
        intensity={theme.lighting.sunIntensity}
        position={theme.lighting.sunPos}
      />
      <pointLight
        color={theme.lighting.pointColor}
        intensity={theme.lighting.pointIntensity}
        position={[0, 0, -8]}
        distance={45}
        decay={2}
      />

      {/* Sky Dome with smoothly tweening gradient */}
      <ThemeSky />

      {/* Floating Voxel Islands & Block Formations */}
      <ThemeVoxelLandscape />

      {/* Theme Particles (Fireflies, Emerald Motes, Nether Embers, Ender Dust, Redstone Sparks) */}
      <ThemeParticles />
    </>
  );
}

export default function WorldBackgroundCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 16], fov: 48, near: 0.1, far: 280 }}
      gl={{
        antialias: false, // pixel-art aesthetic & maximum performance
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      dpr={[1, Math.min(1.5, typeof window !== 'undefined' ? window.devicePixelRatio : 1)]}
      style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
    >
      <SceneContent />
    </Canvas>
  );
}
