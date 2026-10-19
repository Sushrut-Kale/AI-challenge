'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS } from '@/lib/world/world-config';
import { FloatingIslandData } from '@/lib/world/terrain-generator';

function surfaceHeight(dist: number, maxH: number) {
  return Math.floor((1 - dist * 0.3) * maxH);
}

// Handcrafted compact voxel tree for floating islands
function IslandTree({ x, y, z }: { x: number; y: number; z: number }) {
  return (
    <group position={[x, y, z]}>
      {/* Trunk */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[1, 3, 1]} />
        <meshStandardMaterial color={COLORS.LOG_OAK} roughness={0.9} />
      </mesh>
      {/* Leaves */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <boxGeometry args={[3, 2, 3]} />
        <meshStandardMaterial color={COLORS.LEAVES_OAK} roughness={0.8} />
      </mesh>
      <mesh position={[0, 4.8, 0]} castShadow>
        <boxGeometry args={[1.5, 1, 1.5]} />
        <meshStandardMaterial color={COLORS.LEAVES_OAK_DARK} roughness={0.8} />
      </mesh>
    </group>
  );
}

interface FloatingIslandProps {
  data: FloatingIslandData;
  index: number;
}

function FloatingIsland({ data, index }: FloatingIslandProps) {
  const { x, y, z, radiusX, radiusZ, height } = data;
  const groupRef = useRef<THREE.Group>(null);

  // Subtle floating oscillation
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      groupRef.current.position.y = y + Math.sin(t * 0.6 + index * 1.8) * 0.5;
    }
  });

  const blocks = [];
  for (let bx = -radiusX; bx <= radiusX; bx++) {
    for (let bz = -radiusZ; bz <= radiusZ; bz++) {
      const nx = bx / radiusX;
      const nz = bz / radiusZ;
      const dist = Math.sqrt(nx * nx + nz * nz);
      if (dist > 1) continue;

      const surfaceH = Math.floor((1 - dist * 0.3) * height);

      // Top grass block
      blocks.push(
        <mesh key={`g_${bx}_${bz}`} position={[bx, surfaceH, bz]} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={index % 2 === 0 ? COLORS.GRASS_TOP : '#6a9e32'} roughness={0.85} />
        </mesh>
      );

      // Dirt/stone layers underneath
      for (let by = 0; by < surfaceH; by++) {
        blocks.push(
          <mesh key={`d_${bx}_${bz}_${by}`} position={[bx, by, bz]} castShadow receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={by < 2 ? COLORS.STONE : COLORS.DIRT} roughness={0.9} />
          </mesh>
        );
      }

      // Hanging stalactites underneath
      if (dist < 0.65 && Math.abs(bx + bz) % 3 === 0) {
        const stalHeight = 2 + Math.floor(dist * 3);
        for (let si = 1; si <= stalHeight; si++) {
          blocks.push(
            <mesh key={`s_${bx}_${bz}_${si}`} position={[bx, -si, bz]} castShadow>
              <boxGeometry args={[Math.max(0.3, 0.9 - si * 0.15), 1, Math.max(0.3, 0.9 - si * 0.15)]} />
              <meshStandardMaterial color={COLORS.STONE_DARK} roughness={0.8} />
            </mesh>
          );
        }
      }
    }
  }

  const treeY = surfaceHeight(0.3, height);

  return (
    <group ref={groupRef} position={[x, y, z]}>
      {blocks}
      <IslandTree x={0} y={treeY} z={0} />
    </group>
  );
}

interface FloatingIslandsProps {
  islands: FloatingIslandData[];
}

export default function FloatingIslands({ islands }: FloatingIslandsProps) {
  return (
    <group>
      {islands.map((island, i) => (
        <FloatingIsland key={i} data={island} index={i} />
      ))}
    </group>
  );
}
