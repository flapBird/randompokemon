import pokemonData from "@/data/pokemon.json";
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
