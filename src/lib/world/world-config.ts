// World configuration constants

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
  MAX_INSTANCES: 2000,
  SHADOW_MAP_SIZE: 1024,
  PIXEL_RATIO_LIMIT: 2,

  // Camera
  CAMERA_FOV: 60,
  CAMERA_NEAR: 0.1,
  CAMERA_FAR: 500,
  CAMERA_INITIAL_POSITION: [40, 35, 55] as [number, number, number],
  CAMERA_TARGET: [0, 0, 0] as [number, number, number],

  // Fog
  FOG_COLOR: '#87CEEB',
  FOG_NEAR: 60,
  FOG_FAR: 200,

  // Lighting
  SUN_POSITION: [50, 60, 30] as [number, number, number],
  SUN_INTENSITY: 2.5,
  AMBIENT_INTENSITY: 0.6,
  SKY_COLOR: '#5BB2E8',
  GROUND_COLOR: '#3D5A1E',
} as const;

export const COLORS = {
  // Block colors
  GRASS_TOP: '#5D8A2E',
  GRASS_SIDE: '#4E7A28',
  DIRT: '#8B6343',
  STONE: '#828282',
  STONE_DARK: '#6B6B6B',
  SAND: '#D4C078',
  GRAVEL: '#9E9E9E',
  SNOW: '#FFFFFF',

  // Vegetation
  LEAVES_OAK: '#2D7D16',
  LEAVES_OAK_DARK: '#1E6B0A',
  LEAVES_BIRCH: '#80A755',
  LOG_OAK: '#7B5928',
  LOG_TOP: '#9E7B40',

  // Water
  WATER_SURFACE: '#3F76E4',
  WATER_DEEP: '#1A4FA0',
  WATER_FOAM: '#7FC4FD',

  // Structures
  STONE_BRICK: '#7A7A7A',
  COBBLESTONE: '#686868',
  WOOD_PLANK: '#BC9862',
  GLASS: '#B0D6F5',
  CASTLE_STONE: '#6B6B6B',

  // Flowers
  FLOWER_RED: '#FF3030',
  FLOWER_YELLOW: '#FFD700',
  FLOWER_BLUE: '#4169E1',
  FLOWER_ORANGE: '#FF8C00',

  // Sky
  SKY_TOP: '#1E3A8A',
  SKY_HORIZON: '#5BB2E8',
  SUNSET_LOW: '#FF8C42',
  SUNSET_ORANGE: '#FF6B35',
  CLOUD_WHITE: '#FFFFFF',
} as const;
