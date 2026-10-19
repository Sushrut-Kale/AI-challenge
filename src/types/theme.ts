export type ThemeId = 'overworld' | 'deep-cave' | 'nether' | 'end' | 'redstone-lab';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  shortName: string;
  dimension: string;
  icon: string;
  lore: string;
  accentColor: string;
  glowColor: string;
  borderColor: string;
  badgeBg: string;
  // Visual sky & fog
  sky: {
    top: string;
    mid: string;
    horizon: string;
    bottom: string;
    fog: string;
    fogDensity: number;
  };
  // 3D Lighting
  lighting: {
    ambientColor: string;
    ambientIntensity: number;
    sunColor: string;
    sunIntensity: number;
    sunPos: [number, number, number];
    pointColor: string;
    pointIntensity: number;
  };
  // Particle style
  particles: {
    color: string;
    secondaryColor: string;
    count: number;
    size: number;
    speed: number;
    type: 'fireflies' | 'emerald-motes' | 'embers' | 'ender-dust' | 'redstone-sparks';
  };
  // Environment blocks & features
  features: {
    hasClouds: boolean;
    hasFloatingIslands: boolean;
    hasCrystals: boolean;
    hasCircuitLines: boolean;
    primaryBlockColor: string;
    secondaryBlockColor: string;
    emissiveBlockColor: string;
  };
  // Sound FX freq
  soundPitch: number;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  overworld: {
    id: 'overworld',
    name: 'Overworld Forest',
    shortName: 'Overworld',
    dimension: 'Surface Dimension',
    icon: '/assets/items/grass_block.png',
    lore: 'Lush grass terrain, drifting voxel clouds, and golden fireflies in the twilight sky.',
    accentColor: '#38a169',
    glowColor: '#48bb78',
    borderColor: '#2f855a',
    badgeBg: 'rgba(56, 161, 105, 0.15)',
    sky: {
      top: '#080d22',
      mid: '#1a1038',
      horizon: '#78350f',
      bottom: '#0d0b09',
      fog: '#0d0b09',
      fogDensity: 0.02,
    },
    lighting: {
      ambientColor: '#c7d2fe',
      ambientIntensity: 0.6,
      sunColor: '#fbbf24',
      sunIntensity: 1.8,
      sunPos: [-30, 25, -40],
      pointColor: '#48bb78',
      pointIntensity: 1.2,
    },
    particles: {
      color: '#fbbf24',
      secondaryColor: '#48bb78',
      count: 45,
      size: 0.22,
      speed: 0.35,
      type: 'fireflies',
    },
    features: {
      hasClouds: true,
      hasFloatingIslands: true,
      hasCrystals: false,
      hasCircuitLines: false,
      primaryBlockColor: '#3d7826', // grass
      secondaryBlockColor: '#6e4c2b', // dirt
      emissiveBlockColor: '#fbbf24', // glowstone
    },
    soundPitch: 440,
  },
  'deep-cave': {
    id: 'deep-cave',
    name: 'Deep Cave & Emerald',
    shortName: 'Deep Cave',
    dimension: 'Deepslate Caverns',
    icon: '/assets/items/emerald.png',
    lore: 'Dark deepslate stone walls, glowing emerald ore veins, and mystical subterranean fog.',
    accentColor: '#00e676',
    glowColor: '#00ff88',
    borderColor: '#00a854',
    badgeBg: 'rgba(0, 230, 118, 0.15)',
    sky: {
      top: '#04070a',
      mid: '#071510',
      horizon: '#00281b',
      bottom: '#020504',
      fog: '#06130e',
      fogDensity: 0.022,
    },
    lighting: {
      ambientColor: '#064e3b',
      ambientIntensity: 0.45,
      sunColor: '#00e676',
      sunIntensity: 1.2,
      sunPos: [20, -10, -25],
      pointColor: '#10b981',
      pointIntensity: 2.2,
    },
    particles: {
      color: '#00e676',
      secondaryColor: '#06b6d4',
      count: 40,
      size: 0.18,
      speed: 0.25,
      type: 'emerald-motes',
    },
    features: {
      hasClouds: false,
      hasFloatingIslands: true,
      hasCrystals: true,
      hasCircuitLines: false,
      primaryBlockColor: '#1a1f24', // deepslate
      secondaryBlockColor: '#2d3748', // stone
      emissiveBlockColor: '#00e676', // emerald ore
    },
    soundPitch: 320,
  },
  nether: {
    id: 'nether',
    name: 'Nether Reactor',
    shortName: 'The Nether',
    dimension: 'Crimson Nether',
    icon: '/assets/items/magma_block.png',
    lore: 'Dark basalt terrain, glowing lava fissures, and floating embers in a blazing atmospheric fog.',
    accentColor: '#f97316',
    glowColor: '#ef4444',
    borderColor: '#c2410c',
    badgeBg: 'rgba(249, 115, 22, 0.15)',
    sky: {
      top: '#180404',
      mid: '#310a0a',
      horizon: '#701a08',
      bottom: '#100202',
      fog: '#2c0808',
      fogDensity: 0.018,
    },
    lighting: {
      ambientColor: '#450a0a',
      ambientIntensity: 0.5,
      sunColor: '#ea580c',
      sunIntensity: 1.6,
      sunPos: [-20, 15, -30],
      pointColor: '#f97316',
      pointIntensity: 2.5,
    },
    particles: {
      color: '#f97316',
      secondaryColor: '#ef4444',
      count: 55,
      size: 0.24,
      speed: 0.55,
      type: 'embers',
    },
    features: {
      hasClouds: false,
      hasFloatingIslands: true,
      hasCrystals: false,
      hasCircuitLines: false,
      primaryBlockColor: '#4a1212', // netherrack
      secondaryBlockColor: '#1c1917', // basalt
      emissiveBlockColor: '#ea580c', // magma/lava
    },
    soundPitch: 220,
  },
  end: {
    id: 'end',
    name: 'End Dimension',
    shortName: 'The End',
    dimension: 'Void Dimension',
    icon: '/assets/items/end_crystal.png',
    lore: 'Floating end stone islands in the starry void, mysterious purple aura, and drifting ender particles.',
    accentColor: '#a855f7',
    glowColor: '#c084fc',
    borderColor: '#7e22ce',
    badgeBg: 'rgba(168, 85, 247, 0.15)',
    sky: {
      top: '#05020a',
      mid: '#120524',
      horizon: '#240940',
      bottom: '#030106',
      fog: '#0f051c',
      fogDensity: 0.014,
    },
    lighting: {
      ambientColor: '#3b0764',
      ambientIntensity: 0.5,
      sunColor: '#c084fc',
      sunIntensity: 1.4,
      sunPos: [15, 30, -35],
      pointColor: '#a855f7',
      pointIntensity: 2.0,
    },
    particles: {
      color: '#c084fc',
      secondaryColor: '#38bdf8',
      count: 45,
      size: 0.2,
      speed: 0.3,
      type: 'ender-dust',
    },
    features: {
      hasClouds: false,
      hasFloatingIslands: true,
      hasCrystals: true,
      hasCircuitLines: false,
      primaryBlockColor: '#d6d396', // end stone
      secondaryBlockColor: '#2b1b3d', // obsidian
      emissiveBlockColor: '#c084fc', // end crystal
    },
    soundPitch: 580,
  },
  'redstone-lab': {
    id: 'redstone-lab',
    name: 'Redstone AI Lab',
    shortName: 'Redstone Lab',
    dimension: 'Agentic Engineering',
    icon: '/assets/items/redstone.png',
    lore: 'Futuristic block laboratory with animated redstone circuitry, neural cores, and autonomous AI nodes.',
    accentColor: '#ef4444',
    glowColor: '#06b6d4',
    borderColor: '#b91c1c',
    badgeBg: 'rgba(239, 68, 68, 0.15)',
    sky: {
      top: '#040b14',
      mid: '#081726',
      horizon: '#0f2942',
      bottom: '#02060b',
      fog: '#071624',
      fogDensity: 0.015,
    },
    lighting: {
      ambientColor: '#0e7490',
      ambientIntensity: 0.55,
      sunColor: '#06b6d4',
      sunIntensity: 1.5,
      sunPos: [-25, 20, -35],
      pointColor: '#ef4444',
      pointIntensity: 2.2,
    },
    particles: {
      color: '#ef4444',
      secondaryColor: '#06b6d4',
      count: 50,
      size: 0.18,
      speed: 0.45,
      type: 'redstone-sparks',
    },
    features: {
      hasClouds: true,
      hasFloatingIslands: true,
      hasCrystals: true,
      hasCircuitLines: true,
      primaryBlockColor: '#334155', // smooth stone / iron block
      secondaryBlockColor: '#1e293b', // polished deepslate
      emissiveBlockColor: '#ef4444', // glowing redstone
    },
    soundPitch: 660,
  },
};

export const THEME_LIST = Object.values(THEMES);

export const SECTION_THEME_MAP: Record<string, ThemeId> = {
  about: 'overworld',
  rounds: 'redstone-lab',
  timeline: 'deep-cave',
  rules: 'end',
  prizes: 'nether',
  sponsors: 'overworld',
  faqs: 'deep-cave',
  contact: 'redstone-lab',
  registration: 'nether',
};
