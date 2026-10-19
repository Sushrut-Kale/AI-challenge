import * as THREE from 'three';
import { COLORS } from './world-config';

// Material cache for reuse
const materialCache = new Map<string, THREE.MeshLambertMaterial>();
const standardMaterialCache = new Map<string, THREE.MeshStandardMaterial>();

export function getLambertMaterial(color: string, options: Partial<THREE.MeshLambertMaterialParameters> = {}): THREE.MeshLambertMaterial {
  const key = `lambert_${color}_${JSON.stringify(options)}`;
  if (!materialCache.has(key)) {
    materialCache.set(key, new THREE.MeshLambertMaterial({ color, ...options }));
  }
  return materialCache.get(key)!;
}

export function getStandardMaterial(color: string, options: Partial<THREE.MeshStandardMaterialParameters> = {}): THREE.MeshStandardMaterial {
  const key = `standard_${color}_${JSON.stringify(options)}`;
  if (!standardMaterialCache.has(key)) {
    standardMaterialCache.set(key, new THREE.MeshStandardMaterial({ color, ...options }));
  }
  return standardMaterialCache.get(key)!;
}

// Pre-create common world materials
export const WorldMaterials = {
  grassTop: () => getLambertMaterial(COLORS.GRASS_TOP),
  grassSide: () => getLambertMaterial(COLORS.GRASS_SIDE),
  dirt: () => getLambertMaterial(COLORS.DIRT),
  stone: () => getLambertMaterial(COLORS.STONE),
  stoneDark: () => getLambertMaterial(COLORS.STONE_DARK),
  sand: () => getLambertMaterial(COLORS.SAND),
  leavesOak: () => getLambertMaterial(COLORS.LEAVES_OAK, { side: THREE.DoubleSide }),
  leavesOakDark: () => getLambertMaterial(COLORS.LEAVES_OAK_DARK, { side: THREE.DoubleSide }),
  logOak: () => getLambertMaterial(COLORS.LOG_OAK),
  logTop: () => getLambertMaterial(COLORS.LOG_TOP),
  water: () => getStandardMaterial(COLORS.WATER_SURFACE, {
    transparent: true,
    opacity: 0.78,
    roughness: 0.1,
    metalness: 0.3,
  }),
  waterfall: () => getStandardMaterial(COLORS.WATER_FOAM, {
    transparent: true,
    opacity: 0.6,
    roughness: 0.2,
  }),
  stoneBrick: () => getLambertMaterial(COLORS.STONE_BRICK),
  cobblestone: () => getLambertMaterial(COLORS.COBBLESTONE),
  woodPlank: () => getLambertMaterial(COLORS.WOOD_PLANK),
  glass: () => getStandardMaterial(COLORS.GLASS, {
    transparent: true,
    opacity: 0.4,
    roughness: 0.0,
    metalness: 0.1,
  }),
  castleStone: () => getLambertMaterial(COLORS.CASTLE_STONE),
  flowerRed: () => getLambertMaterial(COLORS.FLOWER_RED, { side: THREE.DoubleSide }),
  flowerYellow: () => getLambertMaterial(COLORS.FLOWER_YELLOW, { side: THREE.DoubleSide }),
  flowerBlue: () => getLambertMaterial(COLORS.FLOWER_BLUE, { side: THREE.DoubleSide }),
  flowerOrange: () => getLambertMaterial(COLORS.FLOWER_ORANGE, { side: THREE.DoubleSide }),
  snow: () => getLambertMaterial(COLORS.SNOW),
} as const;

// Shared geometry cache
const geometryCache = new Map<string, THREE.BufferGeometry>();

export function getBoxGeometry(w = 1, h = 1, d = 1): THREE.BoxGeometry {
  const key = `box_${w}_${h}_${d}`;
  if (!geometryCache.has(key)) {
    geometryCache.set(key, new THREE.BoxGeometry(w, h, d));
  }
  return geometryCache.get(key) as THREE.BoxGeometry;
}

export function disposeMaterials() {
  materialCache.forEach(m => m.dispose());
  materialCache.clear();
  standardMaterialCache.forEach(m => m.dispose());
  standardMaterialCache.clear();
  geometryCache.forEach(g => g.dispose());
  geometryCache.clear();
}
