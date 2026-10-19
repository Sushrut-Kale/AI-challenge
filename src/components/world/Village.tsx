'use client';

import React from 'react';
import { COLORS } from '@/lib/world/world-config';

function House({ x, y, z, scale = 1 }: { x: number; y: number; z: number; scale?: number }) {
  return (
    <group position={[x, y, z]} scale={scale}>
      {/* Foundation */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[6, 1, 5]} />
        <meshLambertMaterial color={COLORS.COBBLESTONE} />
      </mesh>
      {/* Walls */}
      {[0, 1, 2, 3].map(h => (
        <mesh key={h} position={[0, 1.5 + h, 0]} castShadow receiveShadow>
          <boxGeometry args={[6, 1, 5]} />
          <meshLambertMaterial color={h % 2 === 0 ? COLORS.WOOD_PLANK : '#A0855A'} />
        </mesh>
      ))}
      {/* Roof base */}
      <mesh position={[0, 5.5, 0]} castShadow>
        <boxGeometry args={[7, 1, 6]} />
        <meshLambertMaterial color={COLORS.STONE_DARK} />
      </mesh>
      {/* Roof ridge blocks */}
      {[-2, -1, 0, 1, 2].map(i => (
        <mesh key={i} position={[i, 6.5, 0]} castShadow>
          <boxGeometry args={[1, 2, 2]} />
          <meshLambertMaterial color={COLORS.STONE} />
        </mesh>
      ))}
      {/* Door */}
      <mesh position={[0, 2, 2.6]}>
        <boxGeometry args={[1.5, 2, 0.2]} />
        <meshLambertMaterial color="#5C3A1E" />
      </mesh>
      {/* Windows */}
      {[-2, 2].map(wx => (
        <mesh key={wx} position={[wx, 3, 2.6]}>
          <boxGeometry args={[1.2, 1.2, 0.2]} />
          <meshStandardMaterial color={COLORS.GLASS} transparent opacity={0.5} emissive="#FFD080" emissiveIntensity={0.4} />
        </mesh>
      ))}
      {/* Chimney */}
      <mesh position={[2, 7, -1]} castShadow>
        <boxGeometry args={[1, 3, 1]} />
        <meshLambertMaterial color={COLORS.COBBLESTONE} />
      </mesh>
    </group>
  );
}

function StonePathBlock({ x, y, z }: { x: number; y: number; z: number }) {
  return (
    <mesh position={[x, y + 0.1, z]} receiveShadow>
      <boxGeometry args={[1, 0.2, 1]} />
      <meshLambertMaterial color={COLORS.COBBLESTONE} />
    </mesh>
  );
}

function WoodBridge({ x, y, z, length = 10, rot = 0 }: { x: number; y: number; z: number; length?: number; rot?: number }) {
  return (
    <group position={[x, y, z]} rotation={[0, rot, 0]}>
      {/* Planks */}
      {Array.from({ length }, (_, i) => (
        <mesh key={i} position={[0, 0, i - length / 2 + 0.5]} castShadow receiveShadow>
          <boxGeometry args={[3, 0.3, 1]} />
          <meshLambertMaterial color={i % 2 === 0 ? COLORS.WOOD_PLANK : '#AA7A4A'} />
        </mesh>
      ))}
      {/* Railings */}
      {[-1.4, 1.4].map(rx => (
        Array.from({ length }, (_, i) => (
          <mesh key={`r_${rx}_${i}`} position={[rx, 0.6, i - length / 2 + 0.5]} castShadow>
            <boxGeometry args={[0.2, 1, 1]} />
            <meshLambertMaterial color={COLORS.LOG_OAK} />
          </mesh>
        ))
      ))}
    </group>
  );
}

export default function Village() {
  return (
    <group>
      {/* Houses */}
      <House x={-25} y={4} z={-20} scale={0.9} />
      <House x={-18} y={3} z={-26} scale={0.8} />
      <House x={-30} y={5} z={-28} scale={1} />
      <House x={22} y={4} z={-18} scale={0.85} />
      <House x={28} y={3} z={-10} scale={0.75} />

      {/* Stone path from village to bridge */}
      {Array.from({ length: 14 }, (_, i) => (
        <StonePathBlock key={i} x={-15 + i} y={3.5} z={-10} />
      ))}
      {Array.from({ length: 10 }, (_, i) => (
        <StonePathBlock key={i + 14} x={-22} y={3.8} z={-18 + i} />
      ))}

      {/* Bridge over river */}
      <WoodBridge x={12} y={2.2} z={8} length={8} rot={Math.PI / 2} />
      <WoodBridge x={-5} y={1.8} z={14} length={6} />

      {/* Lamp posts */}
      {[[-16, 3.5, -10], [16, 3.5, -10], [-22, 3.5, -12], [-22, 3.5, -22]].map(([lx, ly, lz], i) => (
        <group key={i} position={[lx as number, ly as number, lz as number]}>
          <mesh castShadow>
            <boxGeometry args={[0.3, 4, 0.3]} />
            <meshLambertMaterial color={COLORS.STONE_DARK} />
          </mesh>
          <mesh position={[0, 2.3, 0]}>
            <boxGeometry args={[0.8, 0.8, 0.8]} />
            <meshStandardMaterial
              color="#FFD080"
              emissive="#FFD080"
              emissiveIntensity={1.2}
              transparent
              opacity={0.85}
            />
          </mesh>
          <pointLight position={[0, 2.3, 0]} intensity={8} distance={10} color="#FFB040" castShadow={false} />
        </group>
      ))}

      {/* Well */}
      <group position={[-20, 4, -15]}>
        {[0, 1, 2].map(i => (
          <mesh key={i} position={[0, i + 0.5, 0]} castShadow>
            <cylinderGeometry args={[1.5, 1.5, 1, 8]} />
            <meshLambertMaterial color={COLORS.COBBLESTONE} />
          </mesh>
        ))}
        <mesh position={[0, 4, 0]} castShadow>
          <boxGeometry args={[3, 0.4, 0.4]} />
          <meshLambertMaterial color={COLORS.LOG_OAK} />
        </mesh>
      </group>
    </group>
  );
}
