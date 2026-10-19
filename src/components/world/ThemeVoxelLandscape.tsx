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
  const endCrystalRef = useRef<THREE.Group>(null);
  const redstoneCoreRef = useRef<THREE.Group>(null);
  const lavaPulseRef = useRef<THREE.MeshStandardMaterial>(null);

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

    // Slow cloud drift for Overworld
    if (cloudsRef.current && theme.features.hasClouds) {
      cloudsRef.current.position.x = ((t * 0.6 + 40) % 90) - 45;
    }

    // End Crystal spinning animation
    if (endCrystalRef.current) {
      endCrystalRef.current.rotation.y = t * 1.4;
      endCrystalRef.current.rotation.x = Math.sin(t * 0.8) * 0.2;
      endCrystalRef.current.position.y = 8 + Math.sin(t * 1.8) * 0.4;
    }

    // Redstone AI core rotation and pulsation
    if (redstoneCoreRef.current) {
      redstoneCoreRef.current.rotation.y = t * 1.8;
      redstoneCoreRef.current.rotation.z = Math.cos(t * 1.2) * 0.15;
    }

    // Lava/Magma thermal pulse
    if (lavaPulseRef.current) {
      lavaPulseRef.current.emissiveIntensity = 1.4 + Math.sin(t * 3.5) * 0.6;
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
                  emissiveIntensity={isEmissive ? 1.6 : 0}
                />
              </mesh>
            );
          })}
        </group>
      ))}

      {/* OVERWORLD THEME: Voxel Oak Trees & Drifting Clouds */}
      {theme.id === 'overworld' && (
        <>
          {/* Voxel Oak Tree on Center Island */}
          <group position={[-14, -2, -22]}>
            {/* Trunk */}
            <mesh position={[0, 1.5, 0]}>
              <boxGeometry args={[0.8, 3, 0.8]} />
              <meshStandardMaterial color="#5c3d21" roughness={0.9} />
            </mesh>
            {/* Leaves Tier 1 */}
            <mesh position={[0, 3.2, 0]}>
              <boxGeometry args={[3, 1.4, 3]} />
              <meshStandardMaterial color="#2e7d32" roughness={0.8} />
            </mesh>
            {/* Leaves Tier 2 */}
            <mesh position={[0, 4.4, 0]}>
              <boxGeometry args={[2, 1.2, 2]} />
              <meshStandardMaterial color="#388e3c" roughness={0.8} />
            </mesh>
          </group>

          {/* Voxel Oak Tree on Right Island */}
          <group position={[16, 4, -26]}>
            <mesh position={[0, 1.5, 0]}>
              <boxGeometry args={[0.8, 3, 0.8]} />
              <meshStandardMaterial color="#5c3d21" roughness={0.9} />
            </mesh>
            <mesh position={[0, 3.2, 0]}>
              <boxGeometry args={[2.8, 1.3, 2.8]} />
              <meshStandardMaterial color="#2e7d32" roughness={0.8} />
            </mesh>
            <mesh position={[0, 4.3, 0]}>
              <boxGeometry args={[1.8, 1, 1.8]} />
              <meshStandardMaterial color="#4caf50" roughness={0.8} />
            </mesh>
          </group>

          {/* Minecraft Voxel Clouds */}
          <group ref={cloudsRef} position={[0, 14, -32]}>
            <mesh position={[-16, 0, 0]}>
              <boxGeometry args={[14, 1.4, 9]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.38} roughness={0.9} />
            </mesh>
            <mesh position={[12, -2, -6]}>
              <boxGeometry args={[18, 1.5, 10]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.35} roughness={0.9} />
            </mesh>
            <mesh position={[0, 3, -12]}>
              <boxGeometry args={[22, 1.6, 12]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.3} roughness={0.9} />
            </mesh>
          </group>
        </>
      )}

      {/* REDSTONE LAB THEME: Animated AI Neural Core & Circuit Grids */}
      {theme.id === 'redstone-lab' && (
        <group>
          {/* Animated Central AI Core */}
          <group ref={redstoneCoreRef} position={[0, 4, -28]}>
            {/* Floating Outer Cyber Cube */}
            <mesh>
              <boxGeometry args={[2.5, 2.5, 2.5]} />
              <meshStandardMaterial color="#1e293b" wireframe />
            </mesh>
            {/* Glowing Redstone Inner Core */}
            <mesh>
              <boxGeometry args={[1.6, 1.6, 1.6]} />
              <meshStandardMaterial
                color="#ef4444"
                emissive="#ef4444"
                emissiveIntensity={2.5}
                roughness={0.2}
              />
            </mesh>
            {/* Data Conduits */}
            <mesh position={[0, 2, 0]}>
              <boxGeometry args={[0.2, 2.5, 0.2]} />
              <meshBasicMaterial color="#06b6d4" />
            </mesh>
            <mesh position={[0, -2, 0]}>
              <boxGeometry args={[0.2, 2.5, 0.2]} />
              <meshBasicMaterial color="#ef4444" />
            </mesh>
          </group>

          {/* Active Redstone Lines & Repeaters */}
          <group position={[0, -5, -16]}>
            <mesh position={[-6, 0, 0]}>
              <boxGeometry args={[12, 0.1, 0.3]} />
              <meshBasicMaterial color="#ef4444" />
            </mesh>
            <mesh position={[6, 0, 0]}>
              <boxGeometry args={[12, 0.1, 0.3]} />
              <meshBasicMaterial color="#06b6d4" />
            </mesh>
            <mesh position={[0, 0, 4]}>
              <boxGeometry args={[0.3, 0.1, 10]} />
              <meshBasicMaterial color="#ef4444" />
            </mesh>
          </group>
        </group>
      )}

      {/* DEEP CAVE THEME: Stalactites, Stalagmites & Glowing Emerald Ore Formations */}
      {theme.id === 'deep-cave' && (
        <group>
          {/* Hanging Stalactites from ceiling */}
          <group position={[0, 16, -24]}>
            <mesh position={[-8, -2, 0]} rotation={[0, 0, Math.PI]}>
              <coneGeometry args={[1.2, 4.5, 4]} />
              <meshStandardMaterial color="#1a1f24" roughness={0.9} />
            </mesh>
            <mesh position={[6, -2.5, -2]} rotation={[0, 0, Math.PI]}>
              <coneGeometry args={[1.5, 5.5, 4]} />
              <meshStandardMaterial color="#1e293b" roughness={0.9} />
            </mesh>
            <mesh position={[0, -3, 2]} rotation={[0, 0, Math.PI]}>
              <coneGeometry args={[1.8, 6, 4]} />
              <meshStandardMaterial color="#0f172a" roughness={0.9} />
            </mesh>
          </group>

          {/* Glowing Emerald Crystals on Lower Shelf */}
          <group position={[12, -7, -18]}>
            <mesh position={[0, 1.2, 0]} rotation={[0.2, 0.3, 0.1]}>
              <boxGeometry args={[0.8, 2.2, 0.8]} />
              <meshStandardMaterial
                color="#00e676"
                emissive="#00e676"
                emissiveIntensity={2.8}
                roughness={0.1}
              />
            </mesh>
            <mesh position={[-0.8, 0.8, 0.4]} rotation={[-0.3, 0.2, -0.2]}>
              <boxGeometry args={[0.6, 1.6, 0.6]} />
              <meshStandardMaterial
                color="#10b981"
                emissive="#10b981"
                emissiveIntensity={2.2}
                roughness={0.1}
              />
            </mesh>
          </group>
        </group>
      )}

      {/* END DIMENSION THEME: Obsidian Pillar & Floating Animated End Crystal */}
      {theme.id === 'end' && (
        <group>
          {/* Mighty Obsidian Pillar */}
          <group position={[0, 0, -32]}>
            <mesh position={[0, 1, 0]}>
              <boxGeometry args={[4, 12, 4]} />
              <meshStandardMaterial color="#120c1f" roughness={0.5} metalness={0.3} />
            </mesh>
            {/* Bedrock Base Cap */}
            <mesh position={[0, 7.2, 0]}>
              <boxGeometry args={[4.4, 0.6, 4.4]} />
              <meshStandardMaterial color="#2d2238" roughness={0.9} />
            </mesh>
          </group>

          {/* Floating Spinning End Crystal */}
          <group ref={endCrystalRef} position={[0, 8.5, -32]}>
            {/* Outer Glass Cube */}
            <mesh>
              <boxGeometry args={[1.8, 1.8, 1.8]} />
              <meshStandardMaterial
                color="#e9d5ff"
                transparent
                opacity={0.45}
                roughness={0.1}
              />
            </mesh>
            {/* Inner Rotating Purple Crystal Core */}
            <mesh rotation={[Math.PI / 4, 0, Math.PI / 4]}>
              <boxGeometry args={[1.1, 1.1, 1.1]} />
              <meshStandardMaterial
                color="#c084fc"
                emissive="#a855f7"
                emissiveIntensity={3.2}
                roughness={0.1}
              />
            </mesh>
          </group>
        </group>
      )}

      {/* NETHER THEME: Molten Magma Fissures & Basalt Spires */}
      {theme.id === 'nether' && (
        <group>
          {/* Jagged Basalt Spire */}
          <group position={[-12, -4, -20]}>
            <mesh position={[0, 3, 0]}>
              <boxGeometry args={[2, 6, 2]} />
              <meshStandardMaterial color="#1c1917" roughness={0.95} />
            </mesh>
            <mesh position={[1, 1, 1]}>
              <boxGeometry args={[1.5, 3, 1.5]} />
              <meshStandardMaterial color="#292524" roughness={0.95} />
            </mesh>
          </group>

          {/* Blazing Magma Chamber Blocks */}
          <group position={[10, -5, -20]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[4, 1.5, 3]} />
              <meshStandardMaterial
                ref={lavaPulseRef}
                color="#ea580c"
                emissive="#f97316"
                emissiveIntensity={1.8}
                roughness={0.4}
              />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
}
