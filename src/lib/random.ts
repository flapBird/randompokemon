import { NATURES } from "@/data/natures";
import { calculateDefensiveMultiplier } from "@/data/type-chart";
import type { GeneratedPokemon, GeneratorFilters } from "@/types/generator";
import { POKEMON_TYPES, type PokemonRecord } from "@/types/pokemon";
import { createSeededRandom, pickOne, randomInt, type RandomSource } from "./seeded-random";

function toGenerated(pokemon: PokemonRecord, random: RandomSource): GeneratedPokemon {
  return {
    pokemon,
    ability: pickOne(pokemon.abilities.length ? pokemon.abilities : ["Unknown"], random),
    nature: NATURES[randomInt(random, NATURES.length)],
    locked: false,
    shiny: false,
  };
}

function sampleUnique(pool: PokemonRecord[], count: number, random: RandomSource) {
  const copy = [...pool];
  const chosen: PokemonRecord[] = [];
  while (copy.length && chosen.length < count) {
    const index = randomInt(random, copy.length);
    chosen.push(copy[index]);
    copy.splice(index, 1);
  }
  return chosen;
}

function scoreTeam(team: PokemonRecord[]) {
  const uniqueTypes = new Set(team.flatMap((entry) => entry.types)).size;
  const primaryCounts = new Map<string, number>();
  team.forEach((entry) => primaryCounts.set(entry.primaryType, (primaryCounts.get(entry.primaryType) ?? 0) + 1));
  const primaryPenalty = [...primaryCounts.values()].reduce((score, count) => score + Math.max(0, count - 1) * 3, 0);
  const sharedPenalty = POKEMON_TYPES.reduce((score, attackType) => {
    const weak = team.filter((entry) => calculateDefensiveMultiplier(entry.types, attackType) > 1).length;
    return score + Math.max(0, weak - 3) * 4;
  }, 0);
  const lowStagePenalty = Math.max(0, team.filter((entry) => entry.evolutionStage === 1).length - 2) * 2;
  return uniqueTypes * 5 - primaryPenalty - sharedPenalty - lowStagePenalty;
}

export function generatePokemon(
  pool: PokemonRecord[],
  filters: GeneratorFilters,
  seed: string,
  locked: GeneratedPokemon[] = [],
) {
  const random = createSeededRandom(seed);
  const count = Math.max(0, filters.count - locked.length);
  const lockedSlugs = new Set(locked.map((entry) => entry.pokemon.slug));
  const available = filters.allowDuplicates ? pool : pool.filter((entry) => !lockedSlugs.has(entry.slug));
  if (!filters.allowDuplicates && available.length < count) {
    throw new Error(`Only ${available.length + locked.length} unique Pokémon match these filters. Reduce the count or allow duplicates.`);
  }
  if (!available.length && count) throw new Error("No Pokémon match these filters. Try selecting more generations or removing some restrictions.");

  let selected: PokemonRecord[];
  if (filters.teamMode === "smart" && count > 1) {
    let best: PokemonRecord[] = [];
    let bestScore = -Infinity;
    for (let attempt = 0; attempt < Math.min(120, Math.max(30, available.length)); attempt += 1) {
      const candidate = filters.allowDuplicates
        ? Array.from({ length: count }, () => pickOne(available, random))
        : sampleUnique(available, count, random);
      const score = scoreTeam([...locked.map((entry) => entry.pokemon), ...candidate]);
      if (score > bestScore) {
        best = candidate;
        bestScore = score;
      }
    }
    selected = best;
  } else {
    selected = filters.allowDuplicates
      ? Array.from({ length: count }, () => pickOne(available, random))
      : sampleUnique(available, count, random);
  }
  return selected.map((entry) => toGenerated(entry, random));
}

export function rerollUnlocked(
  current: GeneratedPokemon[],
  pool: PokemonRecord[],
  filters: GeneratorFilters,
  seed: string,
) {
  const locked = current.filter((entry) => entry.locked);
  const currentSlugs = new Set(current.map((entry) => entry.pokemon.slug));
  const freshPool = pool.filter((entry) => !currentSlugs.has(entry.slug));
  const replacementCount = current.length - locked.length;
  const canReplaceEverySlot = filters.allowDuplicates
    ? freshPool.length > 0
    : freshPool.length >= replacementCount;
  const next = generatePokemon(
    canReplaceEverySlot ? freshPool : pool,
    { ...filters, count: current.length },
    `${seed}-REROLL`,
    locked,
  );
  let replacementIndex = 0;
  return current.map((entry) => (entry.locked ? entry : next[replacementIndex++]));
}

export function rerollAt(
  current: GeneratedPokemon[],
  index: number,
  pool: PokemonRecord[],
  filters: GeneratorFilters,
  seed: string,
) {
  const excluded = filters.allowDuplicates
    ? new Set([current[index].pokemon.slug])
    : new Set(current.map((entry) => entry.pokemon.slug));
  const available = pool.filter((entry) => !excluded.has(entry.slug));
  if (!available.length) throw new Error("No different Pokémon is available for this slot with the current filters.");
  const random = createSeededRandom(`${seed}-SLOT-${index}`);
  const replacement = toGenerated(pickOne(available, random), random);
  return current.map((entry, slot) => (slot === index ? replacement : entry));
}
