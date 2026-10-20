'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import BuilderAgent from '@/components/world/agents/BuilderAgent';
import AnalystAgent from '@/components/world/agents/AnalystAgent';
import InnovatorAgent from '@/components/world/agents/InnovatorAgent';

interface CameraRigProps {
  scrollProgress: number; // 0 to 1 as user scrolls
}

function LibraryCamera({ scrollProgress }: CameraRigProps) {
  const currentPos = useRef(new THREE.Vector3(0, 4.2, 16));
  const currentTarget = useRef(new THREE.Vector3(0, 2.5, 0));

  useFrame((state, delta) => {
    // Base cinematic slow breathing/dolly
    const t = state.clock.getElapsedTime();
    const idleDolly = Math.sin(t * 0.3) * 0.4;
    const idleBob = Math.cos(t * 0.6) * 0.08;

    // Target position blends base + scroll progress zoom forward
    const clampedProg = Math.max(0, Math.min(1, scrollProgress));
    const targetZ = 16 - clampedProg * 10 + idleDolly;
    const targetY = 4.2 - clampedProg * 1.5 + idleBob;
    const targetX = Math.sin(t * 0.2) * 0.3 * (1 - clampedProg);

    const destPos = new THREE.Vector3(targetX, targetY, targetZ);
    currentPos.current.lerp(destPos, Math.min(1, delta * 3.5));
    state.camera.position.copy(currentPos.current);

    const destTarget = new THREE.Vector3(0, 2.4 - clampedProg * 0.4, 0);
    currentTarget.current.lerp(destTarget, Math.min(1, delta * 4));
    state.camera.lookAt(currentTarget.current);
  });

  return null;
}

// Procedural Minecraft Bookshelf Block
function BookshelfBlock({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Outer Oak Planks Frame */}
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#6a4325" roughness={0.9} />
      </mesh>
      {/* Top shelf books inset */}
      <mesh position={[0, 0.22, 0.46]}>
        <boxGeometry args={[0.88, 0.32, 0.12]} />
        <meshStandardMaterial color="#991b1b" roughness={0.8} />
      </mesh>
      {/* Bottom shelf books inset */}
      <mesh position={[0, -0.22, 0.46]}>
        <boxGeometry args={[0.88, 0.32, 0.12]} />
        <meshStandardMaterial color="#1e40af" roughness={0.8} />
      </mesh>
    </group>
  );
}

// Hanging Minecraft Lantern with warm flickering light
function HangingLantern({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (lightRef.current) {
      const t = clock.getElapsedTime();
      lightRef.current.intensity = 1.4 + Math.sin(t * 8) * 0.15 + Math.cos(t * 13) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Iron Chain */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.2, 4]} />
        <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Lantern Frame */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[0.42, 0.52, 0.42]} />
        <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Glowing Fire Core */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[0.26, 0.34, 0.26]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#d97706"
          emissiveIntensity={2.5}
          roughness={0.1}
        />
      </mesh>
      {/* Warm Point Light */}
      <pointLight
        ref={lightRef}
        position={[0, -0.1, 0]}
        color="#fbbf24"
        distance={9}
        decay={2}
      />
    </group>
  );
}

// Minecraft Voxel Library Hall Environment
function VoxelLibraryHall() {
  // Wood floor grid
  const floorPlanks = useMemo(() => {
    const list: Array<{ x: number; z: number; color: string }> = [];
    const colors = ['#54361c', '#603d20', '#4a2f18', '#6a4424'];
    for (let x = -8; x <= 8; x++) {
      for (let z = -6; z <= 18; z++) {
        const color = colors[(Math.abs(x * 7 + z * 13)) % colors.length];
        list.push({ x, z, color });
      }
    }
    return list;
  }, []);

  return (
    <group>
      {/* Wooden Floor */}
      {floorPlanks.map((p, i) => (
        <mesh key={i} position={[p.x, -0.5, p.z]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={p.color} roughness={0.85} />
        </mesh>
      ))}

      {/* Stone Brick Pillars along the hall */}
      {[-6, 6].map((x) =>
        [-4, 2, 8, 14].map((z) => (
          <group key={`${x}-${z}`} position={[x, 0, z]}>
            {[0, 1, 2, 3, 4, 5, 6].map((y) => (
              <mesh key={y} position={[0, y, 0]}>
                <boxGeometry args={[1.2, 1, 1.2]} />
                <meshStandardMaterial color="#475569" roughness={0.9} />
              </mesh>
            ))}
          </group>
        ))
      )}

      {/* Bookshelf Walls on Left & Right Aisle */}
      {[-4.8, 4.8].map((x) =>
        [-3, -2, -1, 0, 1, 3, 4, 5, 6, 7, 9, 10, 11, 12].map((z) =>
          [0, 1, 2, 3].map((y) => (
            <BookshelfBlock key={`${x}-${y}-${z}`} position={[x, y, z]} />
          ))
        )
      )}

      {/* Central Study Table / Lecterns */}
      <mesh position={[0, 0.4, 3]}>
        <boxGeometry args={[2.8, 0.8, 1.4]} />
        <meshStandardMaterial color="#452a15" roughness={0.8} />
      </mesh>
      {/* Open Knowledge Book on Table */}
      <mesh position={[0, 0.85, 3]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.8, 0.08, 0.6]} />
        <meshStandardMaterial color="#fef08a" roughness={0.6} />
      </mesh>

      {/* Warm Hanging Lanterns */}
      <HangingLantern position={[-2.2, 4.8, 0]} />
      <HangingLantern position={[2.2, 4.8, 0]} />
      <HangingLantern position={[-2.2, 4.8, 6]} />
      <HangingLantern position={[2.2, 4.8, 6]} />
      <HangingLantern position={[0, 5.2, 12]} />
    </group>
  );
}

interface IntroSceneProps {
  scrollProgress: number;
}

export default function IntroScene({ scrollProgress }: IntroSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 4.2, 16], fov: 46 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%', background: '#0b0908', pointerEvents: 'none' }}
    >
      <LibraryCamera scrollProgress={scrollProgress} />

      {/* Minecraft Library Interior Atmosphere */}
      <color attach="background" args={['#0c0a08']} />
      <fog attach="fog" args={['#0c0a08', 12, 28]} />

      {/* Ambient Fill */}
      <ambientLight intensity={0.4} color="#fed7aa" />

      {/* Overhead Skylight Shaft */}
      <directionalLight
        position={[0, 12, 4]}
        intensity={1.2}
        color="#fef3c7"
      />

      {/* Voxel Library Architecture */}
      <VoxelLibraryHall />

      {/* The 3 AI Agent Characters Stationed in the Library */}
      <group position={[0, 0, 0]}>
        {/* Builder Alpha (Left Desk) */}
        <BuilderAgent
          position={[-1.9, 0, 0.6]}
          rotation={[0, 0.35, 0]}
          scale={0.92}
        />

        {/* Innovator Gamma (Center Knowledge Hall) */}
        <InnovatorAgent
          position={[0, 0.05, 0.9]}
          rotation={[0, 0, 0]}
          scale={1.05}
        />

        {/* Analyst Beta (Right Desk) */}
        <AnalystAgent
          position={[1.9, 0, 0.6]}
          rotation={[0, -0.35, 0]}
          scale={0.92}
        />
      </group>
    </Canvas>
  );
}
