/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        minecraft: ['var(--font-pixel)', '"Press Start 2P"', 'monospace'],
        pixel: ['var(--font-pixel)', '"Press Start 2P"', 'monospace'],
        terminal: ['var(--font-terminal)', 'VT323', 'monospace'],
        sans: ['var(--font-terminal)', 'VT323', 'monospace'],
        mono: ['var(--font-terminal)', 'VT323', 'monospace'],
      },
      colors: {
        minecraft: {
          grass: '#5D8A2E',
          'grass-dark': '#3D5A1E',
          'grass-light': '#7BB53B',
          dirt: '#8B6343',
          'dirt-dark': '#583D29',
          'dirt-light': '#A77854',
          stone: '#737373',
          'stone-dark': '#404040',
          'stone-light': '#9E9E9E',
          bedrock: '#171923',
          wood: '#9A6A38',
          'wood-dark': '#613E1B',
          water: '#3F76E4',
          sky: '#5BB2E8',
          sunset: '#FF8C42',
          gold: '#FBBF24',
          'gold-dark': '#B45309',
          emerald: '#10B981',
          'emerald-dark': '#047857',
          'emerald-glow': '#34D399',
          diamond: '#38BDF8',
          obsidian: '#1E1435',
          redstone: '#EF4444',
        },
      },
      boxShadow: {
        'pixel-btn': 'inset 2px 2px 0 rgba(255,255,255,0.35), inset -2px -2px 0 rgba(0,0,0,0.4), 0 4px 0 #111',
        'pixel-btn-active': 'inset 2px 2px 0 rgba(0,0,0,0.5), inset -2px -2px 0 rgba(255,255,255,0.2), 0 1px 0 #111',
        'pixel-card': 'inset 2px 2px 0 rgba(255,255,255,0.15), inset -2px -2px 0 rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.6)',
        'pixel-card-hover': 'inset 2px 2px 0 rgba(255,255,255,0.25), inset -2px -2px 0 rgba(0,0,0,0.6), 0 12px 32px rgba(16,185,129,0.2)',
      },
    },
  },
  plugins: [],
};
