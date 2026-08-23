import pokemonData from "@/data/pokemon.json";
import { calculateDefensiveMultiplier } from "@/data/type-chart";
import { POKEMON_TYPES, type PokemonType } from "@/types/pokemon";
import type { PokemonRecord } from "@/types/pokemon";

export const pokemon = pokemonData as PokemonRecord[];
export const defaultPokemon = pokemon.filter((entry) => entry.isDefaultForm);

export const PRIORITY_POKEMON_SLUGS = [
  "pikachu", "froakie", "kyogre", "kyurem", "lugia", "reshiram",
  "solgaleo", "yveltal", "zapdos", "zekrom", "zygarde",
] as const;

export const priorityPokemon = PRIORITY_POKEMON_SLUGS
  .map((slug) => defaultPokemon.find((entry) => entry.slug === slug))
  .filter((entry): entry is PokemonRecord => Boolean(entry));

export function getPokemon(slug: string) {
  return pokemon.find((entry) => entry.slug === slug);
}

export const getPokemonBySlug = getPokemon;

export function getPokemonById(id: number) {
  return defaultPokemon.find((entry) => entry.id === id);
}

export function getPokemonByType(type: PokemonType) {
  return defaultPokemon.filter((entry) => entry.types.includes(type));
}

export function getPokemonByGeneration(generation: number) {
  return defaultPokemon.filter((entry) => entry.generation === generation);
}

export function getPokemonByRegion(region: string) {
  return defaultPokemon.filter((entry) => entry.region.toLowerCase() === region.toLowerCase());
}

export function getTypeMatchups(types: PokemonType[]) {
  const matchups = POKEMON_TYPES.map((type) => ({
    type,
    multiplier: calculateDefensiveMultiplier(types, type),
  }));
  return {
    weaknesses: matchups.filter((entry) => entry.multiplier > 1),
    resistances: matchups.filter((entry) => entry.multiplier > 0 && entry.multiplier < 1),
    immunities: matchups.filter((entry) => entry.multiplier === 0),
  };
}

export function getRelatedPokemon(entry: PokemonRecord, limit = 6) {
  const family = new Set(evolutionFamily(entry).map((member) => member.slug));
  const candidates = defaultPokemon
    .filter((candidate) => candidate.slug !== entry.slug && !family.has(candidate.slug))
    .map((candidate) => ({
      candidate,
      score:
        candidate.types.filter((type) => entry.types.includes(type)).length * 5 +
        (candidate.generation === entry.generation ? 2 : 0) +
        (candidate.region === entry.region ? 2 : 0),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.candidate.id - b.candidate.id);
  return candidates.slice(0, limit).map(({ candidate }) => candidate);
}

export function getAdjacentPokemon(entry: PokemonRecord) {
  const index = defaultPokemon.findIndex((candidate) => candidate.slug === entry.slug);
  return {
    previous: index > 0 ? defaultPokemon[index - 1] : null,
    next: index >= 0 && index < defaultPokemon.length - 1 ? defaultPokemon[index + 1] : null,
  };
}

export function titleToken(value: string) {
  return value.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function pokemonSummary(entry: PokemonRecord) {
  const role = entry.isLegendary ? "Legendary " : entry.isMythical ? "Mythical " : entry.isStarter ? "starter " : "";
  return `${entry.name} is a ${entry.types.map(titleToken).join("/ ")}-type ${role}Pokémon introduced in Generation ${entry.generation}. View its normal and Shiny forms, base stats, abilities, and evolution details.`;
}

export function evolutionFamily(entry: PokemonRecord) {
  let root = entry;
  const visited = new Set<string>();
  while (root.preEvolution && !visited.has(root.slug)) {
    visited.add(root.slug);
    const parent = getPokemon(root.preEvolution);
    if (!parent) break;
    root = parent;
  }
  const result: PokemonRecord[] = [];
  const walk = (member: PokemonRecord) => {
    if (result.some((item) => item.slug === member.slug)) return;
    result.push(member);
    member.evolutions.forEach((slug) => {
      const child = getPokemon(slug);
      if (child) walk(child);
    });
  };
  walk(root);
  return result;
}

export function generationLabel(generation: number) {
  return `Generation ${generation}`;
}
