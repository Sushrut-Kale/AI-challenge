'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '@/context/ThemeContext';
import useReducedMotion from '@/hooks/useReducedMotion';

interface IslandData {
  pos: [number, number, number];
  blocks: Array<{ x: number; y: number; z: number; isTop?: boolean; isEmissive?: boolean }>;
  phase: number;
}

// Generate stylized floating Minecraft block clusters
function generateIslands(): IslandData[] {
  const islands: IslandData[] = [
    // Center-left floating island
    {
      pos: [-14, -2, -22],
      phase: 0,
      blocks: [
        { x: 0, y: 0, z: 0, isTop: true },
        { x: 1, y: 0, z: 0, isTop: true },
        { x: -1, y: 0, z: 0, isTop: true },
        { x: 0, y: 0, z: 1, isTop: true },
        { x: 0, y: 0, z: -1, isTop: true, isEmissive: true },
        { x: 0, y: -1, z: 0 },
        { x: 1, y: -1, z: 0 },
        { x: 0, y: -2, z: 0 },
      ],
    },
    // Upper-right floating island
    {
      pos: [16, 4, -26],
      phase: 1.5,
      blocks: [
        { x: 0, y: 0, z: 0, isTop: true },
        { x: -1, y: 0, z: 0, isTop: true },
        { x: 0, y: 0, z: 1, isTop: true },
        { x: 1, y: 0, z: 1, isTop: true, isEmissive: true },
        { x: 0, y: -1, z: 0 },
        { x: -1, y: -1, z: 0 },
        { x: 0, y: -2, z: 0 },
      ],
    },
    // Distant background center island
    {
      pos: [0, 8, -36],
      phase: 3.0,
      blocks: [
        { x: 0, y: 0, z: 0, isTop: true },
        { x: 1, y: 0, z: 0, isTop: true },
        { x: -1, y: 0, z: 0, isTop: true },
        { x: 0, y: 0, z: -1, isTop: true },
        { x: 0, y: 1, z: 0, isEmissive: true }, // Crystal/Glowstone pinnacle
        { x: 0, y: -1, z: 0 },
        { x: 0, y: -2, z: 0 },
      ],
    },
    // Lower-right subtle cluster
    {
      pos: [12, -8, -18],
      phase: 4.2,
      blocks: [
        { x: 0, y: 0, z: 0, isTop: true },
        { x: 1, y: 0, z: 0, isTop: true },
        { x: 0, y: 0, z: 1, isTop: true },
        { x: 0, y: -1, z: 0 },
        { x: 1, y: 0, z: 1, isEmissive: true },
      ],
    },
    // Lower-left deep cluster
    {
      pos: [-16, -10, -20],
      phase: 2.1,
      blocks: [
        { x: 0, y: 0, z: 0, isTop: true },
        { x: -1, y: 0, z: 0, isTop: true },
        { x: 0, y: -1, z: 0 },
        { x: 0, y: 0, z: -1, isEmissive: true },
      ],
    },
  ];

  return islands;
}

export default function ThemeVoxelLandscape() {
  const { theme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const islands = useMemo(() => generateIslands(), []);
  const islandGroupsRef = useRef<Array<THREE.Group | null>>([]);
  const cloudsRef = useRef<THREE.Group>(null);

  // Colors for active theme
  const topColor = useMemo(() => new THREE.Color(theme.features.primaryBlockColor), [theme]);
  const bottomColor = useMemo(() => new THREE.Color(theme.features.secondaryBlockColor), [theme]);
  const emissiveColor = useMemo(() => new THREE.Color(theme.features.emissiveBlockColor), [theme]);

  useFrame(({ clock }) => {
    if (prefersReducedMotion) return;
    const t = clock.getElapsedTime();

    // Gentle vertical bobbing for each floating island
    islands.forEach((island, i) => {
      const grp = islandGroupsRef.current[i];
      if (grp) {
        grp.position.y = island.pos[1] + Math.sin(t * 0.7 + island.phase) * 0.45;
        grp.rotation.y = Math.sin(t * 0.2 + island.phase) * 0.05;
      }
    });

    // Slow cloud drift
    if (cloudsRef.current && theme.features.hasClouds) {
      cloudsRef.current.position.x = ((t * 0.5 + 40) % 80) - 40;
    }
  });

  return (
    <group>
      {/* Floating Voxel Islands */}
      {islands.map((island, idx) => (
        <group
          key={idx}
          ref={(el) => {
            islandGroupsRef.current[idx] = el;
          }}
          position={island.pos}
        >
          {island.blocks.map((b, bIdx) => {
            const isEmissive = b.isEmissive;
            const isTop = b.isTop;
            const color = isEmissive ? emissiveColor : isTop ? topColor : bottomColor;

            return (
              <mesh key={bIdx} position={[b.x, b.y, b.z]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial
                  color={color}
                  roughness={isEmissive ? 0.2 : 0.8}
                  metalness={0.1}
                  emissive={isEmissive ? emissiveColor : undefined}
                  emissiveIntensity={isEmissive ? 1.5 : 0}
                />
              </mesh>
            );
          })}
        </group>
      ))}

      {/* Minecraft Voxel Clouds (When enabled by theme) */}
      {theme.features.hasClouds && (
        <group ref={cloudsRef} position={[0, 14, -32]}>
          <mesh position={[-15, 0, 0]}>
            <boxGeometry args={[12, 1.2, 8]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.35} roughness={0.9} />
          </mesh>
          <mesh position={[12, -2, -6]}>
            <boxGeometry args={[16, 1.4, 9]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.32} roughness={0.9} />
          </mesh>
          <mesh position={[0, 3, -12]}>
            <boxGeometry args={[20, 1.5, 10]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.28} roughness={0.9} />
          </mesh>
        </group>
      )}

      {/* Redstone Laboratory Circuit Lines (When in Redstone Lab theme) */}
      {theme.features.hasCircuitLines && (
        <group position={[0, -5, -16]}>
          <mesh position={[-6, 0, 0]}>
            <boxGeometry args={[10, 0.08, 0.25]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
          <mesh position={[6, 0, 0]}>
            <boxGeometry args={[10, 0.08, 0.25]} />
            <meshBasicMaterial color="#06b6d4" />
          </mesh>
          <mesh position={[0, 0, 4]}>
            <boxGeometry args={[0.25, 0.08, 8]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        </group>
      )}
    </group>
  );
}
