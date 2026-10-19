// World configuration constants — Sunset / Golden Hour Twilight Overworld

export const WORLD_CONFIG = {
  // Island dimensions
  ISLAND_SIZE: 80,
  ISLAND_HEIGHT_LEVELS: 6,
  BLOCK_SIZE: 1,

  // Terrain generation
  TERRAIN_SEED: 42,
  TERRAIN_OCTAVES: 4,
  TERRAIN_SCALE: 0.08,
  MAX_HEIGHT: 10,
  WATER_LEVEL: 1,

  // Vegetation
  TREE_DENSITY: 0.04,
  FLOWER_DENSITY: 0.08,
  MIN_TREE_HEIGHT: 4,
  MAX_TREE_HEIGHT: 7,

  // Performance
  MAX_INSTANCES: 4000,
  SHADOW_MAP_SIZE: 2048,
  PIXEL_RATIO_LIMIT: 2,

  // Camera
  CAMERA_FOV: 55,
  CAMERA_NEAR: 0.1,
  CAMERA_FAR: 600,
  CAMERA_INITIAL_POSITION: [46, 30, 52] as [number, number, number],
  CAMERA_TARGET: [0, 2, 0] as [number, number, number],

  // Fog — Twilight sunset horizon dusk tone
  FOG_COLOR: '#241228',
  FOG_NEAR: 65,
  FOG_FAR: 220,

  // Lighting — Low Golden Hour Sun
  SUN_POSITION: [-70, 26, -80] as [number, number, number],
  SUN_INTENSITY: 2.8,
  AMBIENT_INTENSITY: 0.45,
  SKY_COLOR: '#1a103c',
  GROUND_COLOR: '#1f130b',
} as const;

export const COLORS = {
  // Block colors
  GRASS_TOP: '#55822b',
  GRASS_SIDE: '#466e24',
  DIRT: '#7c5332',
  STONE: '#6e6e6e',
  STONE_DARK: '#4e4e54',
  SAND: '#c9b46e',
  GRAVEL: '#888888',
  SNOW: '#f0f4f8',

  // Vegetation
  LEAVES_OAK: '#2a7416',
  LEAVES_OAK_DARK: '#1b560a',
  LEAVES_BIRCH: '#72984a',
  LOG_OAK: '#684520',
  LOG_TOP: '#8b6732',

  // Water
  WATER_SURFACE: '#2962c4',
  WATER_DEEP: '#123b7e',
  WATER_FOAM: '#6eb8ff',

  // Structures
  STONE_BRICK: '#74747a',
  COBBLESTONE: '#5a5a60',
  WOOD_PLANK: '#a87948',
  GLASS: '#a0c8ee',
  CASTLE_STONE: '#62626b',

  // Flowers
  FLOWER_RED: '#e53935',
  FLOWER_YELLOW: '#fbc02d',
  FLOWER_BLUE: '#3949ab',
  FLOWER_ORANGE: '#fb8c00',

  // Sunset & Twilight Atmosphere
  SKY_ZENITH: '#090d20',
  SKY_UPPER: '#1e1642',
  SKY_MID: '#6d1e4e',
  SKY_HORIZON: '#ea580c',
  SKY_GLOW: '#fbbf24',
  SUN_CORE: '#fff7ed',
  SUN_CORONA: '#f97316',
  CLOUD_BODY: '#fff0e5',
  CLOUD_SHADOW: '#c8a8c0',
  TORCH_FIRE: '#ff9800',
} as const;
