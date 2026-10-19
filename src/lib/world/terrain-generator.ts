import { createSeededRandom } from './seeded-random';
import { WORLD_CONFIG } from './world-config';

export interface TerrainCell {
  x: number;
  z: number;
  height: number;
  type: 'grass' | 'dirt' | 'stone' | 'sand' | 'water' | 'gravel';
  hasTree: boolean;
  hasFlower: boolean;
  flowerType: 0 | 1 | 2 | 3;
  isEdge: boolean;
}

// Simple noise function using seeded random
function smoothNoise(x: number, z: number, rand: () => number): number {
  // Simple value noise with interpolation
  const ix = Math.floor(x);
  const iz = Math.floor(z);
  const fx = x - ix;
  const fz = z - iz;

  // smooth step
  const ux = fx * fx * (3 - 2 * fx);
  const uz = fz * fz * (3 - 2 * fz);

  // create reproducible values at grid points
  const r = createSeededRandom(WORLD_CONFIG.TERRAIN_SEED);
  const hash = (a: number, b: number) => {
    const rr = createSeededRandom(a * 1000 + b * 37 + WORLD_CONFIG.TERRAIN_SEED);
    return rr();
  };

  const v00 = hash(ix, iz);
  const v10 = hash(ix + 1, iz);
  const v01 = hash(ix, iz + 1);
  const v11 = hash(ix + 1, iz + 1);

  return v00 * (1 - ux) * (1 - uz) +
         v10 * ux * (1 - uz) +
         v01 * (1 - ux) * uz +
         v11 * ux * uz;
}

function fractalNoise(x: number, z: number): number {
  let value = 0;
  let amplitude = 1;
  let frequency = WORLD_CONFIG.TERRAIN_SCALE;
  let maxValue = 0;

  for (let o = 0; o < WORLD_CONFIG.TERRAIN_OCTAVES; o++) {
    value += smoothNoise(x * frequency, z * frequency, createSeededRandom(o * 100)) * amplitude;
    maxValue += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }
  return value / maxValue;
}

function islandMask(x: number, z: number, size: number): number {
  const cx = x / size;
  const cz = z / size;
  const dist = Math.sqrt(cx * cx + cz * cz);
  // Elliptical island with softer edges
  return Math.max(0, 1 - Math.pow(dist / 0.5, 2.5));
}

export function generateTerrain(
  seed: number = WORLD_CONFIG.TERRAIN_SEED
): TerrainCell[] {
  const rand = createSeededRandom(seed);
  const size = WORLD_CONFIG.ISLAND_SIZE;
  const half = size / 2;
  const cells: TerrainCell[] = [];

  for (let x = -half; x < half; x++) {
    for (let z = -half; z < half; z++) {
      const mask = islandMask(x, z, size);
      if (mask < 0.05) continue; // Skip ocean areas

      const noise = fractalNoise(x, z);
      const rawHeight = noise * WORLD_CONFIG.MAX_HEIGHT * mask;
      const height = Math.max(0, Math.round(rawHeight));

      let type: TerrainCell['type'] = 'grass';
      if (height <= WORLD_CONFIG.WATER_LEVEL) {
        type = 'sand';
      } else if (height >= WORLD_CONFIG.MAX_HEIGHT - 1) {
        type = 'stone';
      }

      const treeSeed = rand();
      const flowerSeed = rand();
      const hasTree = type === 'grass' && height > WORLD_CONFIG.WATER_LEVEL + 1 && treeSeed < WORLD_CONFIG.TREE_DENSITY;
      const hasFlower = type === 'grass' && !hasTree && height > WORLD_CONFIG.WATER_LEVEL + 1 && flowerSeed < WORLD_CONFIG.FLOWER_DENSITY;
      const flowerType = Math.floor(rand() * 4) as 0 | 1 | 2 | 3;

      const isEdge = mask < 0.15;

      cells.push({ x, z, height, type, hasTree, hasFlower, flowerType, isEdge });
    }
  }

  return cells;
}

export interface FloatingIslandData {
  x: number;
  y: number;
  z: number;
  radiusX: number;
  radiusZ: number;
  height: number;
}

export function generateFloatingIslands(seed: number = 99): FloatingIslandData[] {
  const rand = createSeededRandom(seed);
  const islands: FloatingIslandData[] = [
    { x: -35, y: 22, z: -30, radiusX: 8, radiusZ: 6, height: 4 },
    { x: 30, y: 28, z: -25, radiusX: 6, radiusZ: 5, height: 3 },
    { x: 20, y: 18, z: 35, radiusX: 5, radiusZ: 7, height: 3 },
    { x: -28, y: 25, z: 20, radiusX: 7, radiusZ: 6, height: 4 },
    { x: 0, y: 32, z: -40, radiusX: 9, radiusZ: 8, height: 5 },
  ];
  return islands;
}
