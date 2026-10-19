'use client';

import React from 'react';
import InteractiveObject from './InteractiveObject';
import { MinecraftTorch } from '../WorldLighting';

interface QuestBoardProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  onSelect: () => void;
}

export default function QuestBoard({
  position,
  rotation = [0, 0, 0],
  onSelect,
}: QuestBoardProps) {
  return (
    <group position={position} rotation={rotation}>
      <InteractiveObject
        id="quest-board"
        name="Quest Board"
        badge="📜 Quest Board"
        icon="📜"
        badgeOffset={[0, 3.6, 0]}
        onClick={onSelect}
      >
        {/* Support Posts (Oak Wood) */}
        <mesh position={[-1.6, 1.5, 0]} castShadow>
          <boxGeometry args={[0.35, 3.0, 0.35]} />
          <meshStandardMaterial color="#5c3c1e" roughness={0.9} />
        </mesh>
        <mesh position={[1.6, 1.5, 0]} castShadow>
          <boxGeometry args={[0.35, 3.0, 0.35]} />
          <meshStandardMaterial color="#5c3c1e" roughness={0.9} />
        </mesh>

        {/* Crossbeam */}
        <mesh position={[0, 2.8, 0]} castShadow>
          <boxGeometry args={[3.8, 0.25, 0.35]} />
          <meshStandardMaterial color="#452712" roughness={0.9} />
        </mesh>

        {/* Notice Board Main Plank (Wood Planks) */}
        <mesh position={[0, 1.8, 0.05]} castShadow receiveShadow>
          <boxGeometry args={[3.4, 1.8, 0.2]} />
          <meshStandardMaterial color="#a87948" roughness={0.8} />
        </mesh>
        {/* Board Frame Border */}
        <mesh position={[0, 1.8, 0.16]}>
          <boxGeometry args={[3.5, 1.9, 0.05]} />
          <meshStandardMaterial color="#684520" roughness={0.9} />
        </mesh>

        {/* Parchment Notices (Paper Sheets with Red Wax Seals) */}
        {[-0.9, 0, 0.9].map((px, i) => (
          <group key={i} position={[px, 1.8, 0.2]}>
            {/* Parchment Sheet */}
            <mesh>
              <boxGeometry args={[0.7, 1.1, 0.02]} />
              <meshStandardMaterial color="#fef3c7" roughness={0.7} />
            </mesh>
            {/* Text lines */}
            {[-0.2, 0, 0.2].map((ly, j) => (
              <mesh key={j} position={[0, ly, 0.015]}>
                <boxGeometry args={[0.5, 0.04, 0.01]} />
                <meshBasicMaterial color="#78350f" />
              </mesh>
            ))}
            {/* Red Wax Seal */}
            <mesh position={[0, 0.42, 0.025]}>
              <boxGeometry args={[0.16, 0.16, 0.03]} />
              <meshStandardMaterial color="#dc2626" roughness={0.4} />
            </mesh>
          </group>
        ))}

        {/* Twin Torches on Top Posts */}
        <MinecraftTorch position={[-1.6, 3.0, 0]} />
        <MinecraftTorch position={[1.6, 3.0, 0]} />
      </InteractiveObject>
    </group>
  );
}
