'use client';

import React from 'react';
import { COLORS } from '@/lib/world/world-config';

interface CastleProps {
  x?: number;
  y?: number;
  z?: number;
  scale?: number;
}

function CastleTower({ x, y, z, height = 10, radius = 2 }: { x: number; y: number; z: number; height?: number; radius?: number }) {
  const blocks = [];
  for (let i = 0; i < height; i++) {
    blocks.push(
      <mesh key={i} position={[x, y + i + 0.5, z]} castShadow receiveShadow>
        <boxGeometry args={[radius * 2, 1, radius * 2]} />
        <meshLambertMaterial color={i % 3 === 0 ? COLORS.STONE_DARK : COLORS.CASTLE_STONE} />
      </mesh>
    );
  }
  // Battlements
  for (let b = 0; b < 4; b++) {
    const angle = (b / 4) * Math.PI * 2;
    const bx = Math.cos(angle) * (radius - 0.5);
    const bz = Math.sin(angle) * (radius - 0.5);
    blocks.push(
      <mesh key={`b${b}`} position={[x + bx, y + height + 0.5, z + bz]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshLambertMaterial color={COLORS.STONE_DARK} />
      </mesh>
    );
  }
  return <>{blocks}</>;
}

function CastleWall({ x1, z1, x2, z2, y, height = 6 }: { x1: number; z1: number; x2: number; z2: number; y: number; height?: number }) {
  const dx = x2 - x1;
  const dz = z2 - z1;
  const len = Math.sqrt(dx * dx + dz * dz);
  const cx = (x1 + x2) / 2;
  const cz = (z1 + z2) / 2;
  const angle = Math.atan2(dz, dx);

  const blocks = [];
  for (let i = 0; i < height; i++) {
    blocks.push(
      <mesh key={i} position={[cx, y + i + 0.5, cz]} rotation={[0, angle, 0]} castShadow receiveShadow>
        <boxGeometry args={[len, 1, 2]} />
        <meshLambertMaterial color={i % 4 === 0 ? COLORS.STONE_DARK : COLORS.CASTLE_STONE} />
      </mesh>
    );
  }
  return <>{blocks}</>;
}

export function Castle({ x = 0, y = 0, z = 0, scale = 1 }: CastleProps) {
  const s = scale;
  return (
    <group position={[x, y, z]} scale={s}>
      {/* Four corner towers */}
      <CastleTower x={-8} y={0} z={-8} height={14} radius={2} />
      <CastleTower x={8} y={0} z={-8} height={14} radius={2} />
      <CastleTower x={-8} y={0} z={8} height={12} radius={2} />
      <CastleTower x={8} y={0} z={8} height={12} radius={2} />

      {/* Central keep - taller */}
      <CastleTower x={0} y={0} z={-3} height={18} radius={3} />

      {/* Connecting walls */}
      <CastleWall x1={-8} z1={-8} x2={8} z2={-8} y={0} height={8} />
      <CastleWall x1={-8} z1={8} x2={8} z2={8} y={0} height={8} />
      <CastleWall x1={-8} z1={-8} x2={-8} z2={8} y={0} height={8} />
      <CastleWall x1={8} z1={-8} x2={8} z2={8} y={0} height={8} />

      {/* Gate archway blocks */}
      {[-1, 0, 1].map(i => (
        <mesh key={`gate_${i}`} position={[i, 4 + 0.5, 8]} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 2]} />
          <meshLambertMaterial color={COLORS.STONE_DARK} />
        </mesh>
      ))}

      {/* Ground floor - foundation blocks */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <boxGeometry args={[22, 1, 22]} />
        <meshLambertMaterial color={COLORS.COBBLESTONE} />
      </mesh>

      {/* Windows on keep */}
      {[6, 10, 14].map(hy => (
        <mesh key={`win_${hy}`} position={[0, hy, -2.5]} castShadow>
          <boxGeometry args={[1, 2, 0.3]} />
          <meshStandardMaterial
            color={COLORS.GLASS}
            transparent
            opacity={0.4}
            emissive="#FFD080"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

// Add a small distant castle for background depth
export function DistantCastle({ x = 0, y = 0, z = 0, scale = 0.7 }: CastleProps) {
  return (
    <group position={[x, y, z]} scale={scale}>
      <CastleTower x={-5} y={0} z={-5} height={10} radius={1.5} />
      <CastleTower x={5} y={0} z={-5} height={10} radius={1.5} />
      <CastleTower x={0} y={0} z={-2} height={14} radius={2} />
      <CastleWall x1={-5} z1={-5} x2={5} z2={-5} y={0} height={6} />
      <CastleWall x1={-5} z1={5} x2={5} z2={5} y={0} height={6} />
      <CastleWall x1={-5} z1={-5} x2={-5} z2={5} y={0} height={6} />
      <CastleWall x1={5} z1={-5} x2={5} z2={5} y={0} height={6} />
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <boxGeometry args={[16, 1, 16]} />
        <meshLambertMaterial color={COLORS.COBBLESTONE} />
      </mesh>
    </group>
  );
}
