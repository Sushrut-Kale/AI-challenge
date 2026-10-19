'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeSky() {
  const { theme } = useTheme();
  const meshRef = useRef<THREE.Mesh>(null);

  // Shader uniforms holding current colors
  const uniforms = useMemo(() => {
    return {
      topColor: { value: new THREE.Color(theme.sky.top) },
      midColor: { value: new THREE.Color(theme.sky.mid) },
      horizonColor: { value: new THREE.Color(theme.sky.horizon) },
      bottomColor: { value: new THREE.Color(theme.sky.bottom) },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Target colors for smooth lerping
  const targetTop = useMemo(() => new THREE.Color(), []);
  const targetMid = useMemo(() => new THREE.Color(), []);
  const targetHorizon = useMemo(() => new THREE.Color(), []);
  const targetBottom = useMemo(() => new THREE.Color(), []);

  useFrame((_, delta) => {
    targetTop.set(theme.sky.top);
    targetMid.set(theme.sky.mid);
    targetHorizon.set(theme.sky.horizon);
    targetBottom.set(theme.sky.bottom);

    // Smooth lerp transition (speed clamped)
    const factor = Math.min(1, delta * 3.5);
    uniforms.topColor.value.lerp(targetTop, factor);
    uniforms.midColor.value.lerp(targetMid, factor);
    uniforms.horizonColor.value.lerp(targetHorizon, factor);
    uniforms.bottomColor.value.lerp(targetBottom, factor);
  });

  const vertexShader = `
    varying vec3 vWorldPosition;
    void main() {
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform vec3 topColor;
    uniform vec3 midColor;
    uniform vec3 horizonColor;
    uniform vec3 bottomColor;
    varying vec3 vWorldPosition;

    void main() {
      vec3 nPos = normalize(vWorldPosition);
      float h = nPos.y;
      vec3 finalColor;

      if (h > 0.3) {
        float t = (h - 0.3) / 0.7;
        finalColor = mix(midColor, topColor, pow(clamp(t, 0.0, 1.0), 0.8));
      } else if (h > -0.05) {
        float t = (h + 0.05) / 0.35;
        finalColor = mix(horizonColor, midColor, smoothstep(0.0, 1.0, clamp(t, 0.0, 1.0)));
      } else {
        float t = (h + 0.5) / 0.45;
        finalColor = mix(bottomColor, horizonColor, clamp(t, 0.0, 1.0));
      }

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[220, 24, 24]} />
      <shaderMaterial
        side={THREE.BackSide}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        depthWrite={false}
      />
    </mesh>
  );
}
