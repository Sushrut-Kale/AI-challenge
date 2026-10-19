'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const PRESETS: Record<string, { pos: [number, number, number]; target: [number, number, number] }> = {
  overview: { pos: [46, 30, 52], target: [0, 2, 0] },
  sunset: { pos: [48, 16, 50], target: [-25, 6, -30] },
  castle: { pos: [-15, 22, -15], target: [-40, 13, -45] },
  closeup: { pos: [22, 15, 25], target: [0, 5.2, 0] },
};

export default function WorldCamera() {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  const [autoRotate, setAutoRotate] = useState(true);
  const targetPos = useRef<THREE.Vector3 | null>(null);
  const targetLook = useRef<THREE.Vector3 | null>(null);

  useEffect(() => {
    const handlePreset = (e: any) => {
      const presetName = e.detail as keyof typeof PRESETS;
      const preset = PRESETS[presetName];
      if (preset) {
        targetPos.current = new THREE.Vector3(...preset.pos);
        targetLook.current = new THREE.Vector3(...preset.target);
      }
    };

    const handleToggleOrbit = (e: any) => {
      setAutoRotate(e.detail !== undefined ? !!e.detail : (prev) => !prev);
    };

    const handleCameraTarget = (e: any) => {
      if (e.detail?.pos && e.detail?.target) {
        targetPos.current = new THREE.Vector3(...e.detail.pos);
        targetLook.current = new THREE.Vector3(...e.detail.target);
        setAutoRotate(false); // pause auto-rotate while inspecting
      }
    };

    const handleResetCamera = () => {
      const preset = PRESETS.overview;
      targetPos.current = new THREE.Vector3(...preset.pos);
      targetLook.current = new THREE.Vector3(...preset.target);
      setAutoRotate(true);
    };

    window.addEventListener('minecraft:camera-preset', handlePreset);
    window.addEventListener('minecraft:camera-target', handleCameraTarget);
    window.addEventListener('minecraft:reset-camera', handleResetCamera);
    window.addEventListener('minecraft:toggle-orbit', handleToggleOrbit);

    return () => {
      window.removeEventListener('minecraft:camera-preset', handlePreset);
      window.removeEventListener('minecraft:camera-target', handleCameraTarget);
      window.removeEventListener('minecraft:reset-camera', handleResetCamera);
      window.removeEventListener('minecraft:toggle-orbit', handleToggleOrbit);
    };
  }, []);

  // Smooth lerp to preset position and breathing animation
  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();

    // Subtle breathing bob
    camera.position.y += Math.sin(t * 0.8) * 0.008;

    if (targetPos.current && targetLook.current && controlsRef.current) {
      // Lerp camera position
      camera.position.lerp(targetPos.current, 0.05);

      // Lerp controls target
      controlsRef.current.target.lerp(targetLook.current, 0.05);

      if (camera.position.distanceTo(targetPos.current) < 0.2) {
        targetPos.current = null;
        targetLook.current = null;
      }
    }

    if (controlsRef.current) {
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      autoRotate={autoRotate}
      autoRotateSpeed={0.35}
      minDistance={16}
      maxDistance={150}
      minPolarAngle={0.15}
      maxPolarAngle={Math.PI / 2.05}
      target={[0, 2, 0]}
      enableDamping={true}
      dampingFactor={0.05}
      rotateSpeed={0.6}
      zoomSpeed={0.8}
      panSpeed={0.6}
    />
  );
}
