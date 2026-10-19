'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import InteractiveObject from './InteractiveObject';

interface NetherPortalProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  onSelect: () => void;
}

export default function NetherPortal({
  position,
  rotation = [0, 0, 0],
  onSelect,
}: NetherPortalProps) {
  const portalVortexRef = useRef<THREE.Mesh>(null);
  const portalLightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (portalVortexRef.current) {
      const mat = portalVortexRef.current.material as THREE.MeshStandardMaterial;
      // Pulsing swirling portal energy
      mat.opacity = 0.72 + Math.sin(t * 3.0) * 0.15;
      mat.emissiveIntensity = 2.0 + Math.sin(t * 2.5) * 0.6;
    }

    if (portalLightRef.current) {
      portalLightRef.current.intensity = 3.5 + Math.sin(t * 4.0) * 0.8;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      <InteractiveObject
        id="nether-portal"
        name="Registration Portal"
        badge="🔮 Registration Portal"
        icon="🔮"
        badgeOffset={[0, 6.0, 0]}
        onClick={onSelect}
      >
        {/* ================= OBSIDIAN FRAME (4x5 blocks) ================= */}
        {/* Bottom Sill (4 blocks) */}
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[4, 1, 1]} />
          <meshStandardMaterial color="#110d1e" roughness={0.3} metalness={0.6} />
        </mesh>

        {/* Left Column (3 blocks) */}
        <mesh position={[-1.5, 2.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[1, 3, 1]} />
          <meshStandardMaterial color="#110d1e" roughness={0.3} metalness={0.6} />
        </mesh>

        {/* Right Column (3 blocks) */}
        <mesh position={[1.5, 2.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[1, 3, 1]} />
          <meshStandardMaterial color="#110d1e" roughness={0.3} metalness={0.6} />
        </mesh>

        {/* Top Header (4 blocks) */}
        <mesh position={[0, 4.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[4, 1, 1]} />
          <meshStandardMaterial color="#110d1e" roughness={0.3} metalness={0.6} />
        </mesh>

        {/* Corner Obsidian Accents */}
        {[-1.5, 1.5].map((cx, i) => (
          <React.Fragment key={i}>
            <mesh position={[cx, 0.5, 0]}>
              <boxGeometry args={[1.05, 1.05, 1.05]} />
              <meshStandardMaterial color="#1c1430" roughness={0.4} />
            </mesh>
            <mesh position={[cx, 4.5, 0]}>
              <boxGeometry args={[1.05, 1.05, 1.05]} />
              <meshStandardMaterial color="#1c1430" roughness={0.4} />
            </mesh>
          </React.Fragment>
        ))}

        {/* ================= PURPLE PORTAL VORTEX ================= */}
        <mesh ref={portalVortexRef} position={[0, 2.5, 0]}>
          <boxGeometry args={[2.0, 3.0, 0.2]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive="#9333ea"
            emissiveIntensity={2.2}
            transparent
            opacity={0.8}
            roughness={0.1}
          />
        </mesh>

        {/* Floating Portal Energy Sparks */}
        {[-0.5, 0.5].map((x, i) => (
          <mesh key={i} position={[x, 2.5 + i * 0.5, 0.25]}>
            <boxGeometry args={[0.15, 0.15, 0.15]} />
            <meshStandardMaterial
              color="#e879f9"
              emissive="#c026d3"
              emissiveIntensity={3.0}
            />
          </mesh>
        ))}

        {/* Purple Point Light illuminating surroundings */}
        <pointLight
          ref={portalLightRef}
          position={[0, 2.5, 0.6]}
          color="#c026d3"
          intensity={3.5}
          distance={12}
          decay={2}
        />
      </InteractiveObject>
    </group>
  );
}
