'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { COLORS } from '@/lib/world/world-config';
import { createSeededRandom } from '@/lib/world/seeded-random';

const FLOWER_COLORS = [
  COLORS.FLOWER_RED,
  COLORS.FLOWER_YELLOW,
  COLORS.FLOWER_BLUE,
  COLORS.FLOWER_ORANGE,
];

interface VegetationProps {
  flowers: Array<{ x: number; z: number; height: number; flowerType: number }>;
}

// Single cross-shaped flower (two quads crossing)
function Flower({ x, y, z, color }: { x: number; y: number; z: number; color: string }) {
  return (
    <group position={[x, y + 0.5, z]}>
      <mesh rotation={[0, Math.PI / 4, 0]}>
        <planeGeometry args={[0.6, 0.8]} />
        <meshLambertMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[0, -Math.PI / 4, 0]}>
        <planeGeometry args={[0.6, 0.8]} />
        <meshLambertMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Grass tuft
function GrassTuft({ x, y, z }: { x: number; y: number; z: number }) {
  return (
    <group position={[x, y + 0.4, z]}>
      <mesh rotation={[0, 0, 0]}>
        <planeGeometry args={[0.5, 0.7]} />
        <meshLambertMaterial color="#4D7B24" side={THREE.DoubleSide} transparent opacity={0.9} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.5, 0.7]} />
        <meshLambertMaterial color="#4D7B24" side={THREE.DoubleSide} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

export default function Vegetation({ flowers }: VegetationProps) {
  const rand = createSeededRandom(55);
  return (
    <group>
      {flowers.slice(0, 200).map((f, i) => {
        const color = FLOWER_COLORS[f.flowerType % 4];
        const isGrass = rand() < 0.35;
        if (isGrass) {
          return <GrassTuft key={i} x={f.x} y={f.height} z={f.z} />;
        }
        return (
          <Flower
            key={i}
            x={f.x}
            y={f.height}
            z={f.z}
            color={color}
          />
        );
      })}
    </group>
  );
}
