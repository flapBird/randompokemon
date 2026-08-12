import type { GeneratorFilters, SpecialCategory } from "@/types/generator";
import type { PokemonRecord } from "@/types/pokemon";

const categoryField: Record<SpecialCategory, keyof PokemonRecord> = {
  paradox: "isParadox",
  ultraBeast: "isUltraBeast",
  regionalForm: "isRegionalForm",
  mega: "isMega",
  gigantamax: "isGigantamax",
};

export const REGION_GENERATION: Record<string, number> = {
  kanto: 1,
  johto: 2,
  hoenn: 3,
  sinnoh: 4,
  unova: 5,
  kalos: 6,
  alola: 7,
  galar: 8,
  hisui: 8,
  paldea: 9,
};

export function generationRegionConflictMessage(filters: GeneratorFilters) {
  if (!filters.generations.length || !filters.regions.length) return null;
  const regionGenerations = [...new Set(filters.regions.map((region) => REGION_GENERATION[region]).filter(Boolean))].sort();
  if (regionGenerations.some((generation) => filters.generations.includes(generation))) return null;
  const regionNames = filters.regions.map((region) => region[0].toUpperCase() + region.slice(1)).join(", ");
  const generationNames = regionGenerations.map((generation) => `Generation ${generation}`).join(" or ");
  return `Generation and Region do not overlap. ${regionNames} Pokémon belong to ${generationNames}. Change one of these filters or reset them.`;
}

export function filterPokemon(pokemon: PokemonRecord[], filters: GeneratorFilters) {
  if (filters.minBst > filters.maxBst) return [];
  return pokemon.filter((entry) => {
    if (!filters.includeForms && !entry.isDefaultForm) return false;
    if (filters.generations.length && !filters.generations.includes(entry.generation)) return false;
    if (filters.regions.length && !filters.regions.includes(entry.region.toLowerCase())) return false;
    if (!filters.includeLegendaries && entry.isLegendary) return false;
    if (filters.legendaryOnly && !entry.isLegendary) return false;
    if (!filters.includeMythicals && entry.isMythical) return false;
    if (filters.fullyEvolvedOnly && !entry.fullyEvolved) return false;
    if (entry.bst < filters.minBst || entry.bst > filters.maxBst) return false;
    if (filters.evolutionStage !== "any") {
      if (filters.evolutionStage === "basic" && entry.evolutionStage !== 1) return false;
      if (filters.evolutionStage === "middle" && (entry.evolutionStage === 1 || entry.fullyEvolved)) return false;
      if (filters.evolutionStage === "final" && !entry.fullyEvolved) return false;
    }
    if (filters.types.length) {
      const matches = filters.types.map((type) => entry.types.includes(type));
      if (filters.typeMatch === "all" ? !matches.every(Boolean) : !matches.some(Boolean)) return false;
    }
    if (filters.starterOnly) {
      if (!entry.isStarter) return false;
      if (entry.slug === "pikachu" && !filters.includePikachu) return false;
      if (entry.slug === "eevee" && !filters.includeEevee) return false;
      if (filters.starterType !== "any" && !entry.types.includes(filters.starterType)) return false;
    }
    return Object.entries(filters.categories).every(([category, rule]) => {
      if (rule === "any") return true;
      const value = Boolean(entry[categoryField[category as SpecialCategory]]);
      return rule === "include" ? value : !value;
    });
  });
}
