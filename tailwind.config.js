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
        minecraft: ['"Press Start 2P"', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        minecraft: {
          grass: '#5D8A2E',
          dirt: '#8B6343',
          stone: '#8E8E8E',
          water: '#3F76E4',
          sky: '#5BB2E8',
          sunset: '#FF8C42',
          gold: '#FFD700',
        },
      },
    },
  },
  plugins: [],
};
