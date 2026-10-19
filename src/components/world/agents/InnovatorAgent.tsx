'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AgentProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

export default function InnovatorAgent({
  position,
  rotation = [0, 0, 0],
  scale = 1.0,
}: AgentProps) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const prismCoreRef = useRef<THREE.Mesh>(null);
  const spark1Ref = useRef<THREE.Mesh>(null);
  const spark2Ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Energetic body bobbing
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 2.4 + 2.0) * 0.045;
    }

    // Creative head scanning
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.8) * 0.22;
      headRef.current.rotation.x = Math.sin(t * 1.3) * 0.06;
    }

    // Expressive arm gestures
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = -0.25 + Math.sin(t * 2.4) * 0.12;
      rightArmRef.current.rotation.z = -0.15 + Math.sin(t * 1.2) * 0.06;
    }

    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = -0.25 + Math.sin(t * 2.4 + Math.PI) * 0.12;
      leftArmRef.current.rotation.z = 0.15 + Math.cos(t * 1.2) * 0.06;
    }

    // Pulsing Innovation Prism Core
    if (prismCoreRef.current) {
      const mat = prismCoreRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 2.0 + Math.sin(t * 5.0) * 0.8;
      prismCoreRef.current.rotation.y = t * 1.5;
    }

    // Subtle floating creative sparks
    if (spark1Ref.current) {
      spark1Ref.current.position.x = 0.5 + Math.sin(t * 3.0) * 0.2;
      spark1Ref.current.position.y = 1.5 + Math.cos(t * 2.5) * 0.25;
      spark1Ref.current.position.z = 0.4 + Math.sin(t * 2.0) * 0.15;
    }

    if (spark2Ref.current) {
      spark2Ref.current.position.x = -0.5 + Math.cos(t * 2.8) * 0.2;
      spark2Ref.current.position.y = 1.3 + Math.sin(t * 3.2) * 0.25;
      spark2Ref.current.position.z = 0.4 + Math.cos(t * 2.2) * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Root offset */}
      <group position={[0, 1.1, 0]}>
        {/* Floating Creative Energy Sparks */}
        <mesh ref={spark1Ref}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial
            color="#f43f5e"
            emissive="#e11d48"
            emissiveIntensity={3.0}
          />
        </mesh>
        <mesh ref={spark2Ref}>
          <boxGeometry args={[0.08, 0.08, 0.08]} />
          <meshStandardMaterial
            color="#e879f9"
            emissive="#c026d3"
            emissiveIntensity={3.0}
          />
        </mesh>

        {/* ================= HEAD ================= */}
        <group ref={headRef} position={[0, 1.6, 0]}>
          {/* Main Skull Cube */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.88, 0.85, 0.85]} />
            <meshStandardMaterial color="#2e1065" roughness={0.6} metalness={0.3} />
          </mesh>

          {/* Magenta Crown Armor */}
          <mesh position={[0, 0.25, 0]} castShadow>
            <boxGeometry args={[0.94, 0.4, 0.9]} />
            <meshStandardMaterial color="#9333ea" roughness={0.4} metalness={0.4} />
          </mesh>

          {/* Dual Innovation Photon Antennae */}
          <group position={[-0.28, 0.55, 0]}>
            <mesh>
              <boxGeometry args={[0.08, 0.35, 0.08]} />
              <meshStandardMaterial color="#c026d3" />
            </mesh>
            <mesh position={[0, 0.2, 0]}>
              <boxGeometry args={[0.16, 0.16, 0.16]} />
              <meshStandardMaterial color="#f43f5e" emissive="#e11d48" emissiveIntensity={2.8} />
            </mesh>
          </group>

          <group position={[0.28, 0.55, 0]}>
            <mesh>
              <boxGeometry args={[0.08, 0.35, 0.08]} />
              <meshStandardMaterial color="#c026d3" />
            </mesh>
            <mesh position={[0, 0.2, 0]}>
              <boxGeometry args={[0.16, 0.16, 0.16]} />
              <meshStandardMaterial color="#f43f5e" emissive="#e11d48" emissiveIntensity={2.8} />
            </mesh>
          </group>

          {/* Glowing Purple/Magenta Eyes */}
          <mesh position={[-0.18, -0.05, 0.44]}>
            <boxGeometry args={[0.18, 0.18, 0.05]} />
            <meshStandardMaterial
              color="#f43f5e"
              emissive="#e11d48"
              emissiveIntensity={2.8}
            />
          </mesh>
          <mesh position={[0.18, -0.05, 0.44]}>
            <boxGeometry args={[0.18, 0.18, 0.05]} />
            <meshStandardMaterial
              color="#f43f5e"
              emissive="#e11d48"
              emissiveIntensity={2.8}
            />
          </mesh>

          {/* Golden Brow Accents */}
          <mesh position={[0, 0.12, 0.45]}>
            <boxGeometry args={[0.65, 0.08, 0.04]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.6} />
          </mesh>
        </group>

        {/* Neck */}
        <mesh position={[0, 1.15, 0]}>
          <boxGeometry args={[0.35, 0.15, 0.35]} />
          <meshStandardMaterial color="#4c1d95" />
        </mesh>

        {/* ================= TORSO ================= */}
        <group position={[0, 0.55, 0]}>
          {/* Main Torso */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.05, 1.15, 0.65]} />
            <meshStandardMaterial color="#581c87" roughness={0.6} metalness={0.3} />
          </mesh>

          {/* Chest Shield */}
          <mesh position={[0, 0.1, 0.34]} castShadow>
            <boxGeometry args={[0.82, 0.75, 0.06]} />
            <meshStandardMaterial color="#9333ea" roughness={0.4} metalness={0.4} />
          </mesh>

          {/* Glowing Innovation Prism Core */}
          <mesh ref={prismCoreRef} position={[0, 0.12, 0.4]}>
            <boxGeometry args={[0.28, 0.28, 0.12]} />
            <meshStandardMaterial
              color="#f43f5e"
              emissive="#e11d48"
              emissiveIntensity={2.4}
              roughness={0.2}
            />
          </mesh>

          {/* Energy Core Containment Ring */}
          <mesh position={[0, 0.12, 0.37]}>
            <boxGeometry args={[0.38, 0.38, 0.04]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.8} />
          </mesh>

          {/* Plasma Power Generator Backpack */}
          <mesh position={[0, 0.05, -0.42]} castShadow>
            <boxGeometry args={[0.68, 0.8, 0.28]} />
            <meshStandardMaterial color="#3b0764" />
          </mesh>
          <mesh position={[0, 0.25, -0.58]}>
            <boxGeometry args={[0.22, 0.22, 0.06]} />
            <meshStandardMaterial
              color="#c026d3"
              emissive="#9333ea"
              emissiveIntensity={2.0}
            />
          </mesh>
        </group>

        {/* ================= RIGHT ARM ================= */}
        <group ref={rightArmRef} position={[-0.72, 1.05, 0]}>
          {/* Angular Shoulder Pauldron */}
          <mesh position={[0, 0.05, 0]} castShadow>
            <boxGeometry args={[0.42, 0.38, 0.44]} />
            <meshStandardMaterial color="#c026d3" metalness={0.4} />
          </mesh>
          {/* Arm Limb */}
          <mesh position={[0, -0.45, 0]} castShadow>
            <boxGeometry args={[0.3, 0.8, 0.3]} />
            <meshStandardMaterial color="#2e1065" />
          </mesh>
          {/* Energy Gauntlet */}
          <mesh position={[0, -0.9, 0]}>
            <boxGeometry args={[0.26, 0.22, 0.26]} />
            <meshStandardMaterial color="#f43f5e" emissive="#e11d48" emissiveIntensity={1.2} />
          </mesh>
        </group>

        {/* ================= LEFT ARM ================= */}
        <group ref={leftArmRef} position={[0.72, 1.05, 0]}>
          <mesh position={[0, 0.05, 0]} castShadow>
            <boxGeometry args={[0.42, 0.38, 0.44]} />
            <meshStandardMaterial color="#c026d3" metalness={0.4} />
          </mesh>
          <mesh position={[0, -0.45, 0]} castShadow>
            <boxGeometry args={[0.3, 0.8, 0.3]} />
            <meshStandardMaterial color="#2e1065" />
          </mesh>
          <mesh position={[0, -0.9, 0]}>
            <boxGeometry args={[0.26, 0.22, 0.26]} />
            <meshStandardMaterial color="#f43f5e" emissive="#e11d48" emissiveIntensity={1.2} />
          </mesh>
        </group>

        {/* ================= LEGS ================= */}
        <group position={[0, -0.55, 0]}>
          <mesh position={[-0.25, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.36, 1.05, 0.4]} />
            <meshStandardMaterial color="#2e1065" />
          </mesh>
          <mesh position={[-0.25, 0.1, 0.21]}>
            <boxGeometry args={[0.28, 0.22, 0.06]} />
            <meshStandardMaterial color="#9333ea" />
          </mesh>

          <mesh position={[0.25, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.36, 1.05, 0.4]} />
            <meshStandardMaterial color="#2e1065" />
          </mesh>
          <mesh position={[0.25, 0.1, 0.21]}>
            <boxGeometry args={[0.28, 0.22, 0.06]} />
            <meshStandardMaterial color="#9333ea" />
          </mesh>
        </group>
      </group>
    </group>
  );
}
