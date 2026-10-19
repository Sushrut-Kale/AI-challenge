'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { COLORS } from '@/lib/world/world-config';

interface WaterProps {
  x?: number;
  z?: number;
  width?: number;
  depth?: number;
  y?: number;
}

export function Water({ x = 0, z = 0, width = 20, depth = 15, y = 0.5 }: WaterProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => new THREE.PlaneGeometry(width, depth, 6, 6), [width, depth]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime();
      meshRef.current.position.y = y + Math.sin(t * 1.2 + x) * 0.03;
      meshRef.current.rotation.z = Math.sin(t * 0.5) * 0.003;
    }
  });

  return (
    <mesh ref={meshRef} position={[x, y, z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <primitive object={geo} attach="geometry" />
      <meshStandardMaterial
        color={COLORS.WATER_SURFACE}
        roughness={0.1}
        metalness={0.35}
        transparent
        opacity={0.82}
      />
    </mesh>
  );
}

interface WaterfallProps {
  x: number;
  y: number;
  z: number;
  height?: number;
  width?: number;
}

export function Waterfall({ x, y, z, height = 6, width = 2 }: WaterfallProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => new THREE.BoxGeometry(width, height, 0.4), [width, height]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime();
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = 0.65 + Math.sin(t * 4) * 0.12;
    }
  });

  return (
    <mesh ref={meshRef} position={[x, y, z]} castShadow>
      <primitive object={geo} attach="geometry" />
      <meshStandardMaterial
        color={COLORS.WATER_FOAM}
        transparent
        opacity={0.7}
        roughness={0.25}
        metalness={0.2}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Distant low twilight sea stretching out beneath the floating archipelago
function LowerSea() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = -22 + Math.sin(clock.getElapsedTime() * 0.4) * 0.06;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[420, 420]} />
      <meshStandardMaterial
        color="#132345"
        roughness={0.15}
        metalness={0.45}
        transparent
        opacity={0.75}
      />
    </mesh>
  );
}

// River/lake collection for the main world
export default function WaterBodies() {
  return (
    <group>
      {/* Lower twilight sea reflecting the setting sky */}
      <LowerSea />

      {/* Main central lake */}
      <Water x={-8} z={4} width={22} depth={18} y={0.6} />

      {/* River leading from lake */}
      <Water x={10} z={8} width={8} depth={28} y={0.5} />
      <Water x={16} z={20} width={6} depth={12} y={0.4} />

      {/* Small pond near village */}
      <Water x={-20} z={-15} width={10} depth={8} y={0.5} />

      {/* Waterfall from cliff */}
      <Waterfall x={-12} y={6} z={-2} height={8} width={3} />
      <Waterfall x={8} y={4} z={12} height={5} width={2} />

      {/* Splash pool at base of waterfall */}
      <Water x={-12} z={-2} width={5} depth={5} y={0.3} />
    </group>
  );
}
