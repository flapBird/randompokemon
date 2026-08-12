import pokemonData from "@/data/pokemon.json";
import type { GeneratedPokemon, GeneratorFilters } from "@/types/generator";
import type { PokemonRecord } from "@/types/pokemon";
import { filterPokemon } from "./filters";
import { generatePokemon } from "./random";

const dataset = pokemonData as PokemonRecord[];

export interface StaticGeneration {
  seed: string;
  results: GeneratedPokemon[];
}

/**
 * Creates a deterministic first roll during Next.js prerendering. Only the
 * selected cards cross the server/client boundary; the full Pokédex remains in
 * the static data file that the interactive generator loads in the background.
 */
export function createStaticGeneration(filters: GeneratorFilters, seed: string): StaticGeneration {
  const pool = filterPokemon(dataset, filters);
  return {
    seed,
    results: generatePokemon(pool, filters, seed),
  };
}
