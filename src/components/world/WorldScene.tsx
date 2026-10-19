'use client';

import React, { useMemo, Suspense, useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import WorldLighting from './WorldLighting';
import WorldCamera from './WorldCamera';
import Terrain from './Terrain';
import Trees from './Trees';
import Vegetation from './Vegetation';
import WaterBodies from './Water';
import { Castle, DistantCastle } from './Castle';
import Village from './Village';
import FloatingIslands from './FloatingIslands';
import AIAgentsGroup from './agents/AIAgentsGroup';
import WorldLocations from './interactive/WorldLocations';

import { generateTerrain, generateFloatingIslands } from '@/lib/world/terrain-generator';

// Performance monitor (dev only)
function PerformanceMonitor() {
  const { gl } = useThree();
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[WorldScene] WebGL Renderer:', gl.info);
    }
  }, [gl]);
  return null;
}

// AI staging platforms — clear areas for future robot characters
function StagingPlatforms() {
  const platforms = [
    { x: 0, y: 4.8, z: 0, w: 10, d: 10, label: 'main' },
    { x: 15, y: 3, z: -5, w: 6, d: 6, label: 'coding_station_1' },
    { x: -15, y: 4, z: 5, w: 6, d: 6, label: 'coding_station_2' },
    { x: 0, y: 5, z: -18, w: 8, d: 8, label: 'stage' },
  ];

  return (
    <group>
      {platforms.map(p => (
        <group key={p.label}>
          {/* Platform surface */}
          <mesh position={[p.x, p.y + 0.1, p.z]} receiveShadow>
            <boxGeometry args={[p.w, 0.3, p.d]} />
            <meshStandardMaterial
              color="#7A6848"
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>
          {/* Subtle edge highlight */}
          <mesh position={[p.x, p.y + 0.26, p.z]}>
            <boxGeometry args={[p.w + 0.1, 0.05, p.d + 0.1]} />
            <meshStandardMaterial
              color="#FF8C42"
              emissive="#FF8C42"
              emissiveIntensity={0.15}
              transparent
              opacity={0.5}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function WorldScene() {
  const terrain = useMemo(() => generateTerrain(42), []);
  const floatingIslands = useMemo(() => generateFloatingIslands(99), []);

  const treeCells = useMemo(
    () => terrain.filter(c => c.hasTree).map(c => ({ x: c.x, z: c.z, height: c.height })),
    [terrain]
  );

  const flowerCells = useMemo(
    () => terrain.filter(c => c.hasFlower).map(c => ({
      x: c.x, z: c.z, height: c.height, flowerType: c.flowerType,
    })),
    [terrain]
  );

  return (
    <>
      {process.env.NODE_ENV === 'development' && <PerformanceMonitor />}

      {/* Lighting & atmosphere */}
      <WorldLighting />

      {/* Camera controls */}
      <WorldCamera />

      {/* Main terrain */}
      <Suspense fallback={null}>
        <Terrain cells={terrain} />
      </Suspense>

      {/* Vegetation */}
      <Suspense fallback={null}>
        <Trees positions={treeCells} />
        <Vegetation flowers={flowerCells} />
      </Suspense>

      {/* Water */}
      <WaterBodies />

      {/* Structures */}
      <Suspense fallback={null}>
        {/* Main castle on elevated terrain */}
        <Castle x={-40} y={12} z={-45} scale={1.0} />
        {/* Distant secondary castle */}
        <DistantCastle x={40} y={10} z={-50} scale={0.8} />
        {/* Third distant background castle */}
        <DistantCastle x={-60} y={8} z={10} scale={0.6} />

        {/* Village */}
        <Village />

        {/* Floating islands */}
        <FloatingIslands islands={floatingIslands} />

        {/* AI staging areas */}
        <StagingPlatforms />

        {/* Minecraft Voxel AI Agent Characters (Alpha, Beta, Gamma) */}
        <AIAgentsGroup />

        {/* Interactive World Landmarks (Quest Board, Nether Portal, Landmarks) */}
        <WorldLocations />
      </Suspense>
    </>
  );
}
