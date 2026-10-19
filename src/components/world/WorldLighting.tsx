'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { WORLD_CONFIG, COLORS } from '@/lib/world/world-config';

// Custom sunset / twilight gradient sky dome that is NOT obscured by fog
function SunsetSkyDome() {
  const meshRef = useRef<THREE.Mesh>(null);

  const shaderArgs = useMemo(() => {
    return {
      uniforms: {
        topColor: { value: new THREE.Color('#080d22') },
        upperColor: { value: new THREE.Color('#22154d') },
        midColor: { value: new THREE.Color('#681c4e') },
        horizonColor: { value: new THREE.Color('#e65100') },
        glowColor: { value: new THREE.Color('#fbbf24') },
        bottomColor: { value: new THREE.Color('#0c0714') },
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 upperColor;
        uniform vec3 midColor;
        uniform vec3 horizonColor;
        uniform vec3 glowColor;
        uniform vec3 bottomColor;
        varying vec3 vWorldPosition;

        void main() {
          vec3 nPos = normalize(vWorldPosition);
          float h = nPos.y;
          vec3 finalColor;

          if (h > 0.35) {
            float t = (h - 0.35) / 0.65;
            finalColor = mix(upperColor, topColor, pow(t, 0.7));
          } else if (h > 0.08) {
            float t = (h - 0.08) / 0.27;
            finalColor = mix(midColor, upperColor, smoothstep(0.0, 1.0, t));
          } else if (h > -0.05) {
            float t = (h + 0.05) / 0.13;
            finalColor = mix(horizonColor, midColor, smoothstep(0.0, 1.0, t));
          } else {
            float t = (h + 0.3) / 0.25;
            finalColor = mix(bottomColor, horizonColor, clamp(t, 0.0, 1.0));
          }

          // Sunset glow towards sun position [-0.65, 0.25, -0.72]
          vec3 sunDir = normalize(vec3(-0.65, 0.22, -0.72));
          float sunDot = max(0.0, dot(nPos, sunDir));
          float sunGlow = pow(sunDot, 12.0) * 0.7 + pow(sunDot, 3.0) * 0.3;
          finalColor += glowColor * sunGlow;

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    };
  }, []);

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[450, 32, 24]} />
      <shaderMaterial
        args={[shaderArgs]}
        side={THREE.BackSide}
        depthWrite={false}
        fog={false}
      />
    </mesh>
  );
}

// Minecraft Square Sun setting low on the horizon
function MinecraftSun() {
  const sunGroupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (sunGroupRef.current) {
      // Gentle pulsing sun corona
      const t = clock.getElapsedTime();
      const s = 1 + Math.sin(t * 1.5) * 0.03;
      sunGroupRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group ref={sunGroupRef} position={[-160, 42, -190]} rotation={[0, Math.PI / 4, 0]}>
      {/* Square Minecraft Sun core */}
      <mesh>
        <boxGeometry args={[28, 28, 2]} />
        <meshBasicMaterial color={COLORS.SUN_CORE} fog={false} />
      </mesh>
      {/* Outer golden corona ring */}
      <mesh position={[0, 0, -0.5]}>
        <boxGeometry args={[42, 42, 1]} />
        <meshBasicMaterial
          color={COLORS.SUN_CORONA}
          transparent
          opacity={0.55}
          fog={false}
        />
      </mesh>
      {/* Soft atmospheric glow quad */}
      <mesh position={[0, 0, -1]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial
          color="#ff7a1a"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          fog={false}
        />
      </mesh>
    </group>
  );
}

// Authentic Minecraft Flat Voxel Clouds
function MinecraftVoxelCloud({
  initialPos,
  size,
  speed = 0.3,
}: {
  initialPos: [number, number, number];
  size: [number, number, number];
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const startX = initialPos[0];

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime();
      // Continuous drift from west to east, wrapping around
      const range = 240;
      const x = ((startX + t * speed * 2 + range) % (range * 2)) - range;
      meshRef.current.position.x = x;
    }
  });

  return (
    <mesh ref={meshRef} position={initialPos}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={COLORS.CLOUD_BODY}
        emissive="#ffe4cc"
        emissiveIntensity={0.12}
        transparent
        opacity={0.88}
        roughness={0.9}
      />
    </mesh>
  );
}

// Group of authentic blocky Minecraft clouds
function MinecraftClouds() {
  const clouds = [
    { pos: [-80, 52, -50] as [number, number, number], size: [28, 2, 16] as [number, number, number], speed: 0.35 },
    { pos: [10, 54, -70] as [number, number, number], size: [34, 2, 22] as [number, number, number], speed: 0.3 },
    { pos: [90, 51, -20] as [number, number, number], size: [24, 2, 14] as [number, number, number], speed: 0.4 },
    { pos: [-40, 55, 30] as [number, number, number], size: [30, 2, 18] as [number, number, number], speed: 0.32 },
    { pos: [50, 53, 50] as [number, number, number], size: [26, 2, 16] as [number, number, number], speed: 0.28 },
    { pos: [-120, 50, 0] as [number, number, number], size: [38, 2, 24] as [number, number, number], speed: 0.33 },
    { pos: [0, 56, 80] as [number, number, number], size: [22, 2, 12] as [number, number, number], speed: 0.36 },
  ];

  return (
    <group>
      {clouds.map((c, i) => (
        <MinecraftVoxelCloud
          key={i}
          initialPos={c.pos}
          size={c.size}
          speed={c.speed}
        />
      ))}
    </group>
  );
}

// Atmospheric golden dusk fireflies drifting above the island
function TwilightFireflies({ count = 90 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, phases, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const ph = new Float32Array(count);
    const sp = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Scatter over the main island radius ~35
      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * 36;
      pos[i * 3 + 0] = Math.cos(angle) * r;
      pos[i * 3 + 1] = 1.5 + Math.random() * 7;
      pos[i * 3 + 2] = Math.sin(angle) * r;

      ph[i] = Math.random() * Math.PI * 2;
      sp[i] = 0.5 + Math.random() * 0.8;
    }
    return [pos, ph, sp];
  }, [count]);

  const basePositions = useMemo(() => new Float32Array(positions), [positions]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const phase = phases[i];
      const speed = speeds[i];

      // Gentle vertical bobbing & drifting
      array[idx + 0] = basePositions[idx + 0] + Math.sin(t * speed * 0.4 + phase) * 0.8;
      array[idx + 1] = basePositions[idx + 1] + Math.sin(t * speed * 0.8 + phase) * 0.6;
      array[idx + 2] = basePositions[idx + 2] + Math.cos(t * speed * 0.4 + phase) * 0.8;
    }
    posAttr.needsUpdate = true;
  });

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 235, 120, 1.0)');
      grad.addColorStop(0.3, 'rgba(255, 180, 50, 0.8)');
      grad.addColorStop(0.7, 'rgba(255, 120, 20, 0.3)');
      grad.addColorStop(1, 'rgba(255, 80, 0, 0.0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.9}
        map={texture}
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Twinkling stars in the upper sky
function TwilightStars() {
  const pointsRef = useRef<THREE.Points>(null);

  const starPositions = useMemo(() => {
    const count = 450;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Upper hemisphere only
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(0.15 + v * 0.85); // keep above horizon
      const r = 380 + Math.random() * 20;

      pos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi);
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      const mat = pointsRef.current.material as THREE.PointsMaterial;
      const t = clock.getElapsedTime();
      mat.opacity = 0.75 + Math.sin(t * 1.2) * 0.15;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[starPositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1.4}
        color="#ffffff"
        transparent
        opacity={0.8}
        fog={false}
        depthWrite={false}
      />
    </points>
  );
}

// Glowing Minecraft Torch with warm point light
export function MinecraftTorch({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (lightRef.current) {
      const t = clock.getElapsedTime();
      // Minecraft torch flame flicker
      lightRef.current.intensity = 2.2 + Math.sin(t * 12 + position[0]) * 0.35 + Math.cos(t * 7) * 0.15;
    }
  });

  return (
    <group position={position}>
      {/* Wooden torch post */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial color="#5c3c1e" roughness={0.9} />
      </mesh>
      {/* Glowing coal / flame block */}
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[0.26, 0.26, 0.26]} />
        <meshStandardMaterial
          color="#ffaa22"
          emissive="#ff7700"
          emissiveIntensity={2.5}
          roughness={0.2}
        />
      </mesh>
      {/* Warm point light casting ambient glow */}
      <pointLight
        ref={lightRef}
        position={[0, 1.1, 0]}
        color="#ff9933"
        intensity={2.2}
        distance={14}
        decay={2}
      />
    </group>
  );
}

export default function WorldLighting() {
  const { scene } = useThree();

  // Harmonized Sunset Dusk Fog
  useEffect(() => {
    scene.fog = new THREE.Fog(
      WORLD_CONFIG.FOG_COLOR,
      WORLD_CONFIG.FOG_NEAR,
      WORLD_CONFIG.FOG_FAR
    );
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  // Strategic torch locations: along paths, near village, and castle entrance
  const torchPositions: Array<[number, number, number]> = [
    [0, 2.3, 0],
    [5, 2.3, 3],
    [-6, 2.3, 4],
    [12, 3.3, -4],
    [-12, 4.3, 6],
    [0, 5.3, -16],
    [-35, 12.3, -42],
    [35, 10.3, -46],
  ];

  return (
    <>
      {/* Gradient Sunset Sky Dome */}
      <SunsetSkyDome />

      {/* Twinkling Stars */}
      <TwilightStars />

      {/* Setting Minecraft Square Sun */}
      <MinecraftSun />

      {/* Authentic Minecraft Voxel Clouds */}
      <MinecraftClouds />

      {/* Floating Golden Twilight Fireflies */}
      <TwilightFireflies count={100} />

      {/* Minecraft Torches */}
      {torchPositions.map((pos, i) => (
        <MinecraftTorch key={i} position={pos} />
      ))}

      {/* Primary Directional Golden Sunlight (casts long warm shadows) */}
      <directionalLight
        position={WORLD_CONFIG.SUN_POSITION}
        intensity={WORLD_CONFIG.SUN_INTENSITY}
        color="#ffa652"
        castShadow
        shadow-mapSize={[WORLD_CONFIG.SHADOW_MAP_SIZE, WORLD_CONFIG.SHADOW_MAP_SIZE]}
        shadow-camera-near={1}
        shadow-camera-far={260}
        shadow-camera-left={-70}
        shadow-camera-right={70}
        shadow-camera-top={70}
        shadow-camera-bottom={-70}
        shadow-bias={-0.0006}
      />

      {/* Warm Front Fill Light to ensure terrain and foliage are clearly illuminated from camera view */}
      <directionalLight
        position={[45, 35, 55]}
        intensity={1.1}
        color="#ffcf9e"
      />

      {/* Warm Horizon Rim Light */}
      <directionalLight
        position={[-60, 14, -40]}
        intensity={0.8}
        color="#ff7a38"
      />

      {/* Cool Twilight Skylight (contrasting shadows) */}
      <directionalLight
        position={[20, 60, 20]}
        intensity={0.65}
        color="#7982f6"
      />

      {/* Hemisphere Light for Sunset Sky / Dark Ground */}
      <hemisphereLight
        args={[WORLD_CONFIG.SKY_COLOR, WORLD_CONFIG.GROUND_COLOR, 0.6]}
      />

      {/* Warm Ambient Base */}
      <ambientLight intensity={0.5} color="#ffbe88" />
    </>
  );
}
