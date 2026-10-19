'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AgentProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

export default function BuilderAgent({
  position,
  rotation = [0, 0, 0],
  scale = 1.0,
}: AgentProps) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const visorMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const chestCoreMatRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Gentle body bobbing
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 2.2) * 0.04;
    }

    // Inspecting head movement
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.7) * 0.25;
      headRef.current.rotation.x = Math.sin(t * 1.1) * 0.08;
    }

    // Builder arm holding tool with subtle mechanical gesture
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = -0.35 + Math.sin(t * 2.2) * 0.15;
      rightArmRef.current.rotation.z = -0.1 + Math.cos(t * 1.1) * 0.05;
    }

    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = 0.15 + Math.sin(t * 2.2 + Math.PI) * 0.1;
    }

    // Visor eye glow pulsation
    if (visorMatRef.current) {
      visorMatRef.current.emissiveIntensity = 2.2 + Math.sin(t * 3.5) * 0.6;
    }

    // Chest core power pulse
    if (chestCoreMatRef.current) {
      chestCoreMatRef.current.emissiveIntensity = 1.8 + Math.cos(t * 2.5) * 0.4;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Root offset so base of feet rests exactly at y = 0 */}
      <group position={[0, 1.1, 0]}>
        {/* ================= HEAD ================= */}
        <group ref={headRef} position={[0, 1.6, 0]}>
          {/* Main Skull Cube */}
          <mesh castShadow receiveShadow position={[0, 0, 0]}>
            <boxGeometry args={[0.9, 0.85, 0.85]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.2} />
          </mesh>

          {/* Emerald Builder Helmet Cap */}
          <mesh castShadow position={[0, 0.22, 0]}>
            <boxGeometry args={[0.96, 0.45, 0.92]} />
            <meshStandardMaterial color="#059669" roughness={0.5} metalness={0.3} />
          </mesh>

          {/* Antenna / Beacon */}
          <mesh position={[0, 0.6, 0]}>
            <boxGeometry args={[0.12, 0.35, 0.12]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          <mesh position={[0, 0.8, 0]}>
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshStandardMaterial
              color="#22d3ee"
              emissive="#06b6d4"
              emissiveIntensity={2.5}
            />
          </mesh>

          {/* Glowing Cyan Visor Eyes */}
          <mesh position={[0, -0.05, 0.44]}>
            <boxGeometry args={[0.65, 0.22, 0.05]} />
            <meshStandardMaterial
              ref={visorMatRef}
              color="#22d3ee"
              emissive="#06b6d4"
              emissiveIntensity={2.4}
              roughness={0.1}
            />
          </mesh>

          {/* Ear Bolts / Sensor Modules */}
          <mesh position={[-0.48, 0, 0]}>
            <boxGeometry args={[0.12, 0.25, 0.25]} />
            <meshStandardMaterial color="#10b981" />
          </mesh>
          <mesh position={[0.48, 0, 0]}>
            <boxGeometry args={[0.12, 0.25, 0.25]} />
            <meshStandardMaterial color="#10b981" />
          </mesh>
        </group>

        {/* Neck Joint */}
        <mesh position={[0, 1.15, 0]}>
          <boxGeometry args={[0.4, 0.15, 0.4]} />
          <meshStandardMaterial color="#334155" />
        </mesh>

        {/* ================= TORSO ================= */}
        <group position={[0, 0.55, 0]}>
          {/* Main Body */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.05, 1.15, 0.65]} />
            <meshStandardMaterial color="#047857" roughness={0.6} metalness={0.25} />
          </mesh>

          {/* Front Emerald Chest Plate Armor */}
          <mesh position={[0, 0.1, 0.34]} castShadow>
            <boxGeometry args={[0.85, 0.75, 0.06]} />
            <meshStandardMaterial color="#10b981" roughness={0.4} metalness={0.3} />
          </mesh>

          {/* Glowing Reactor / SDG Core Badge */}
          <mesh position={[0, 0.15, 0.38]}>
            <boxGeometry args={[0.3, 0.3, 0.05]} />
            <meshStandardMaterial
              ref={chestCoreMatRef}
              color="#34d399"
              emissive="#10b981"
              emissiveIntensity={2.0}
            />
          </mesh>

          {/* Utility Backpack / Battery Pack */}
          <mesh position={[0, 0.05, -0.42]} castShadow>
            <boxGeometry args={[0.7, 0.85, 0.26]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </mesh>
          {/* Backpack Status Light */}
          <mesh position={[0, 0.32, -0.56]}>
            <boxGeometry args={[0.2, 0.12, 0.04]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#d97706"
              emissiveIntensity={1.8}
            />
          </mesh>
        </group>

        {/* ================= RIGHT ARM (Holding Tool) ================= */}
        <group ref={rightArmRef} position={[-0.72, 1.05, 0]}>
          {/* Shoulder Armor Pad */}
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.38, 0.35, 0.42]} />
            <meshStandardMaterial color="#10b981" />
          </mesh>
          {/* Arm Limb */}
          <mesh position={[0, -0.5, 0]} castShadow>
            <boxGeometry args={[0.32, 0.85, 0.32]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>

          {/* Voxel Building Tool / Pickaxe in Hand */}
          <group position={[0, -0.9, 0.15]} rotation={[0.4, 0, 0]}>
            {/* Tool Handle */}
            <mesh position={[0, 0.15, 0]} castShadow>
              <boxGeometry args={[0.1, 0.85, 0.1]} />
              <meshStandardMaterial color="#78350f" roughness={0.9} />
            </mesh>
            {/* Tool Head (Golden Emerald Pickaxe) */}
            <mesh position={[0, 0.55, 0]} castShadow>
              <boxGeometry args={[0.55, 0.2, 0.22]} />
              <meshStandardMaterial
                color="#fbbf24"
                emissive="#d97706"
                emissiveIntensity={0.6}
                roughness={0.3}
                metalness={0.7}
              />
            </mesh>
            {/* Tool Pointy Tips */}
            <mesh position={[-0.32, 0.5, 0]}>
              <boxGeometry args={[0.12, 0.14, 0.14]} />
              <meshStandardMaterial color="#22d3ee" emissive="#06b6d4" emissiveIntensity={1.5} />
            </mesh>
            <mesh position={[0.32, 0.5, 0]}>
              <boxGeometry args={[0.12, 0.14, 0.14]} />
              <meshStandardMaterial color="#22d3ee" emissive="#06b6d4" emissiveIntensity={1.5} />
            </mesh>
          </group>
        </group>

        {/* ================= LEFT ARM ================= */}
        <group ref={leftArmRef} position={[0.72, 1.05, 0]}>
          {/* Shoulder Armor Pad */}
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.38, 0.35, 0.42]} />
            <meshStandardMaterial color="#10b981" />
          </mesh>
          {/* Arm Limb */}
          <mesh position={[0, -0.5, 0]} castShadow>
            <boxGeometry args={[0.32, 0.85, 0.32]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          {/* Left Fist */}
          <mesh position={[0, -0.95, 0]}>
            <boxGeometry args={[0.26, 0.2, 0.26]} />
            <meshStandardMaterial color="#047857" />
          </mesh>
        </group>

        {/* ================= LEGS ================= */}
        <group position={[0, -0.55, 0]}>
          {/* Left Leg */}
          <mesh position={[-0.26, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.38, 1.05, 0.42]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </mesh>
          {/* Left Knee Guard */}
          <mesh position={[-0.26, 0.1, 0.22]}>
            <boxGeometry args={[0.3, 0.25, 0.08]} />
            <meshStandardMaterial color="#059669" />
          </mesh>

          {/* Right Leg */}
          <mesh position={[0.26, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.38, 1.05, 0.42]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </mesh>
          {/* Right Knee Guard */}
          <mesh position={[0.26, 0.1, 0.22]}>
            <boxGeometry args={[0.3, 0.25, 0.08]} />
            <meshStandardMaterial color="#059669" />
          </mesh>
        </group>
      </group>
    </group>
  );
}
