'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AgentProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

export default function AnalystAgent({
  position,
  rotation = [0, 0, 0],
  scale = 1.0,
}: AgentProps) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  // Holographic data cubes refs
  const cube1Ref = useRef<THREE.Mesh>(null);
  const cube2Ref = useRef<THREE.Mesh>(null);
  const cube3Ref = useRef<THREE.Mesh>(null);
  const visorMatRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Gentle body bobbing
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 1.8 + 1.2) * 0.04;
    }

    // Calculating head motion
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.6) * 0.2;
      headRef.current.rotation.z = Math.cos(t * 0.9) * 0.04;
    }

    // Left arm holding scanner tablet
    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = -0.55 + Math.sin(t * 1.8) * 0.08;
      leftArmRef.current.rotation.y = 0.25;
    }

    // Right arm subtle swing
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = 0.15 + Math.sin(t * 1.8 + Math.PI) * 0.1;
    }

    // Digital visor pulse
    if (visorMatRef.current) {
      visorMatRef.current.emissiveIntensity = 2.4 + Math.sin(t * 4.0) * 0.6;
    }

    // Orbiting Holographic Data Cubes
    if (cube1Ref.current) {
      const angle1 = t * 1.2;
      cube1Ref.current.position.x = Math.cos(angle1) * 1.2;
      cube1Ref.current.position.z = Math.sin(angle1) * 1.2;
      cube1Ref.current.position.y = 1.6 + Math.sin(t * 2.5) * 0.15;
      cube1Ref.current.rotation.x = t * 2.0;
      cube1Ref.current.rotation.y = t * 1.5;
    }

    if (cube2Ref.current) {
      const angle2 = t * 1.0 + (Math.PI * 2) / 3;
      cube2Ref.current.position.x = Math.cos(angle2) * 1.35;
      cube2Ref.current.position.z = Math.sin(angle2) * 1.35;
      cube2Ref.current.position.y = 1.8 + Math.sin(t * 2.0 + 1.0) * 0.15;
      cube2Ref.current.rotation.x = t * 1.8;
      cube2Ref.current.rotation.z = t * 1.2;
    }

    if (cube3Ref.current) {
      const angle3 = t * 1.4 + (Math.PI * 4) / 3;
      cube3Ref.current.position.x = Math.cos(angle3) * 1.1;
      cube3Ref.current.position.z = Math.sin(angle3) * 1.1;
      cube3Ref.current.position.y = 1.4 + Math.sin(t * 2.8 + 2.0) * 0.15;
      cube3Ref.current.rotation.y = t * 2.2;
      cube3Ref.current.rotation.z = t * 1.6;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Root offset */}
      <group position={[0, 1.1, 0]}>
        {/* ================= FLOATING HOLOGRAPHIC DATA CUBES ================= */}
        <mesh ref={cube1Ref}>
          <boxGeometry args={[0.18, 0.18, 0.18]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={2.5}
            transparent
            opacity={0.85}
          />
        </mesh>
        <mesh ref={cube2Ref}>
          <boxGeometry args={[0.14, 0.14, 0.14]} />
          <meshStandardMaterial
            color="#67e8f9"
            emissive="#06b6d4"
            emissiveIntensity={2.8}
            transparent
            opacity={0.9}
          />
        </mesh>
        <mesh ref={cube3Ref}>
          <boxGeometry args={[0.16, 0.16, 0.16]} />
          <meshStandardMaterial
            color="#60a5fa"
            emissive="#2563eb"
            emissiveIntensity={2.2}
            transparent
            opacity={0.8}
          />
        </mesh>

        {/* ================= HEAD ================= */}
        <group ref={headRef} position={[0, 1.55, 0]}>
          {/* Main Skull Cube */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.88, 0.85, 0.85]} />
            <meshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.4} />
          </mesh>

          {/* Cyan/Blue Cyber Sensor Crown */}
          <mesh position={[0, 0.44, 0]}>
            <boxGeometry args={[0.7, 0.15, 0.7]} />
            <meshStandardMaterial color="#2563eb" roughness={0.4} metalness={0.5} />
          </mesh>

          {/* Central Satellite Dish Antenna */}
          <mesh position={[0, 0.65, 0]}>
            <boxGeometry args={[0.1, 0.3, 0.1]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
          <mesh position={[0, 0.78, 0]}>
            <boxGeometry args={[0.26, 0.08, 0.26]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={2.2} />
          </mesh>

          {/* Segmented Digital Visor Panel */}
          <mesh position={[0, -0.05, 0.44]}>
            <boxGeometry args={[0.72, 0.24, 0.05]} />
            <meshStandardMaterial
              ref={visorMatRef}
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={2.6}
              roughness={0.1}
            />
          </mesh>

          {/* Digital Grid Dots on Visor */}
          {[-0.22, 0, 0.22].map((x, i) => (
            <mesh key={i} position={[x, -0.05, 0.47]}>
              <boxGeometry args={[0.08, 0.08, 0.02]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#ffffff"
                emissiveIntensity={3.0}
              />
            </mesh>
          ))}
        </group>

        {/* Neck */}
        <mesh position={[0, 1.12, 0]}>
          <boxGeometry args={[0.35, 0.14, 0.35]} />
          <meshStandardMaterial color="#334155" />
        </mesh>

        {/* ================= TORSO ================= */}
        <group position={[0, 0.55, 0]}>
          {/* Main Chassis */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.0, 1.1, 0.6]} />
            <meshStandardMaterial color="#1e3a8a" roughness={0.5} metalness={0.4} />
          </mesh>

          {/* Digital Metrics Matrix on Chest */}
          <mesh position={[0, 0.12, 0.31]}>
            <boxGeometry args={[0.75, 0.65, 0.04]} />
            <meshStandardMaterial color="#0284c7" roughness={0.4} metalness={0.3} />
          </mesh>

          {/* Blue Glowing Analytics Core */}
          <mesh position={[0, 0.12, 0.34]}>
            <boxGeometry args={[0.32, 0.32, 0.04]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={2.2}
            />
          </mesh>

          {/* Server Heat Sink / Exhaust Vents on Back */}
          <mesh position={[0, 0.05, -0.34]}>
            <boxGeometry args={[0.65, 0.75, 0.16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
        </group>

        {/* ================= LEFT ARM (Holding Scanner Tablet) ================= */}
        <group ref={leftArmRef} position={[0.68, 1.05, 0]}>
          {/* Shoulder */}
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.35, 0.32, 0.38]} />
            <meshStandardMaterial color="#2563eb" />
          </mesh>
          {/* Arm Limb */}
          <mesh position={[0, -0.45, 0]} castShadow>
            <boxGeometry args={[0.3, 0.8, 0.3]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>

          {/* Holographic Data Tablet in Hand */}
          <group position={[0, -0.85, 0.25]} rotation={[-0.4, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.55, 0.4, 0.06]} />
              <meshStandardMaterial color="#1e293b" metalness={0.5} />
            </mesh>
            {/* Glowing Screen */}
            <mesh position={[0, 0, 0.04]}>
              <boxGeometry args={[0.48, 0.34, 0.02]} />
              <meshStandardMaterial
                color="#38bdf8"
                emissive="#0284c7"
                emissiveIntensity={2.5}
                roughness={0.1}
              />
            </mesh>
          </group>
        </group>

        {/* ================= RIGHT ARM ================= */}
        <group ref={rightArmRef} position={[-0.68, 1.05, 0]}>
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.35, 0.32, 0.38]} />
            <meshStandardMaterial color="#2563eb" />
          </mesh>
          <mesh position={[0, -0.45, 0]} castShadow>
            <boxGeometry args={[0.3, 0.8, 0.3]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, -0.9, 0]}>
            <boxGeometry args={[0.24, 0.18, 0.24]} />
            <meshStandardMaterial color="#1e3a8a" />
          </mesh>
        </group>

        {/* ================= LEGS ================= */}
        <group position={[0, -0.55, 0]}>
          <mesh position={[-0.24, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.35, 1.05, 0.38]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[-0.24, 0.1, 0.2]}>
            <boxGeometry args={[0.28, 0.22, 0.06]} />
            <meshStandardMaterial color="#2563eb" />
          </mesh>

          <mesh position={[0.24, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.35, 1.05, 0.38]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0.24, 0.1, 0.2]}>
            <boxGeometry args={[0.28, 0.22, 0.06]} />
            <meshStandardMaterial color="#2563eb" />
          </mesh>
        </group>
      </group>
    </group>
  );
}
