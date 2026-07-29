export type RandomSource = () => number;

function xmur3(value: string) {
  let hash = 1779033703 ^ value.length;
  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(hash ^ value.charCodeAt(index), 3432918353);
    hash = (hash << 13) | (hash >>> 19);
  }
  return () => {
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
    return (hash ^= hash >>> 16) >>> 0;
  };
}

export function createSeededRandom(seed: string): RandomSource {
  const seedHash = xmur3(seed.trim().toUpperCase())();
  let state = seedHash;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomInt(random: RandomSource, max: number) {
  return Math.floor(random() * max);
}

export function pickOne<T>(items: T[], random: RandomSource): T {
  return items[randomInt(random, items.length)];
}

export function createReadableSeed(random: RandomSource = Math.random) {
  const words = ["KANTO", "JOHTO", "HOENN", "SINNOH", "UNOVA", "KALOS", "ALOLA", "GALAR", "PALDEA"];
  return `${words[randomInt(random, words.length)]}-${String(randomInt(random, 100000)).padStart(5, "0")}`;
}

export function isValidSeed(seed: string) {
  return /^[A-Z0-9][A-Z0-9-]{2,31}$/i.test(seed);
}
