'use client';

/**
 * Reusable animation math and timing helpers for voxel agents.
 * All functions operate with zero React state allocation to ensure 60 FPS.
 */

// Gentle sine-wave breathing idle offset
export function calculateBreathingOffset(time: number, speed = 2.0, amplitude = 0.04): number {
  return Math.sin(time * speed) * amplitude;
}

// Scanning head tilt angles
export function calculateHeadScan(time: number, speed = 0.7, maxAngle = 0.25): { yaw: number; pitch: number } {
  return {
    yaw: Math.sin(time * speed) * maxAngle,
    pitch: Math.sin(time * speed * 1.5) * (maxAngle * 0.3),
  };
}

// Orbit position for holographic data cubes
export function calculateOrbitPosition(
  time: number,
  speed: number,
  radius: number,
  baseHeight: number,
  phaseOffset = 0
): [number, number, number] {
  const angle = time * speed + phaseOffset;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  const y = baseHeight + Math.sin(time * 2.5 + phaseOffset) * 0.15;
  return [x, y, z];
}

// Emissive light pulse intensity
export function calculatePulseIntensity(
  time: number,
  speed = 3.0,
  minIntensity = 1.8,
  maxIntensity = 2.8
): number {
  const norm = (Math.sin(time * speed) + 1) * 0.5;
  return minIntensity + norm * (maxIntensity - minIntensity);
}
