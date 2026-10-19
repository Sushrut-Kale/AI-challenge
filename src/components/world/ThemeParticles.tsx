'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '@/context/ThemeContext';
import useReducedMotion from '@/hooks/useReducedMotion';

const PARTICLE_COUNT = 60;

export default function ThemeParticles() {
  const { theme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const instancedRef = useRef<THREE.InstancedMesh>(null);

  // Pre-generate particle initial states
  const particleData = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      x: (Math.random() - 0.5) * 60,
      y: (Math.random() - 0.5) * 40,
      z: -10 - Math.random() * 40,
      speedY: 0.2 + Math.random() * 0.4,
      speedX: (Math.random() - 0.5) * 0.2,
      phase: Math.random() * Math.PI * 2,
      scale: 0.15 + Math.random() * 0.2,
    }));
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Update instance colors smoothly on theme change
  useEffect(() => {
    if (!instancedRef.current) return;
    const c1 = new THREE.Color(theme.particles.color);
    const c2 = new THREE.Color(theme.particles.secondaryColor);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const color = i % 2 === 0 ? c1 : c2;
      instancedRef.current.setColorAt(i, color);
    }
    if (instancedRef.current.instanceColor) {
      instancedRef.current.instanceColor.needsUpdate = true;
    }
  }, [theme.particles.color, theme.particles.secondaryColor]);

  useFrame(({ clock }, delta) => {
    if (!instancedRef.current) return;
    if (prefersReducedMotion) return;

    const t = clock.getElapsedTime();
    const speedMult = theme.particles.speed;

    particleData.forEach((p, i) => {
      // Drift mechanics based on theme type
      if (theme.particles.type === 'embers') {
        // Nether embers rise rapidly
        p.y += p.speedY * speedMult * 1.6 * delta * 20;
        p.x += Math.sin(t * 1.5 + p.phase) * delta * 0.8;
      } else if (theme.particles.type === 'fireflies') {
        // Fireflies gently hover in sinusoidal paths
        p.y += Math.sin(t * 0.8 + p.phase) * delta * 0.5;
        p.x += Math.cos(t * 0.6 + p.phase) * delta * 0.6;
      } else if (theme.particles.type === 'redstone-sparks') {
        // Redstone data sparks move horizontally along circuits
        p.x += p.speedY * speedMult * 2.0 * delta * 25;
        p.y += Math.sin(t * 2.0 + p.phase) * delta * 0.3;
      } else {
        // Emerald motes / Ender dust drift slowly upwards
        p.y += p.speedY * speedMult * delta * 12;
        p.x += Math.sin(t * 0.5 + p.phase) * delta * 0.4;
      }

      // Wrap around bounds
      if (p.y > 22) p.y = -22;
      if (p.y < -22) p.y = 22;
      if (p.x > 32) p.x = -32;
      if (p.x < -32) p.x = 32;

      dummy.position.set(p.x, p.y, p.z);
      const pulse = 1 + Math.sin(t * 2.5 + p.phase) * 0.25;
      const s = p.scale * (theme.particles.size / 0.2) * pulse;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();

      instancedRef.current?.setMatrixAt(i, dummy.matrix);
    });

    instancedRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={instancedRef}
      args={[undefined, undefined, PARTICLE_COUNT]}
      frustumCulled={false}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </instancedMesh>
  );
}
