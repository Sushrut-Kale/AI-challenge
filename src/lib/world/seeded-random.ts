// Seeded pseudo-random number generator (mulberry32)
export function createSeededRandom(seed: number) {
  let s = seed;
  return function random(): number {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededRandRange(rand: () => number, min: number, max: number): number {
  return min + rand() * (max - min);
}

export function seededRandInt(rand: () => number, min: number, max: number): number {
  return Math.floor(seededRandRange(rand, min, max + 1));
}
