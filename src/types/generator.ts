import type { PokemonRecord, PokemonType } from "./pokemon";

export type MatchMode = "any" | "all";
export type TeamMode = "random" | "smart";
export type EvolutionStage = "any" | "basic" | "middle" | "final";
export type CategoryRule = "any" | "include" | "exclude";
export type SpecialCategory =
  | "paradox"
  | "ultraBeast"
  | "regionalForm"
  | "mega"
  | "gigantamax";

export interface GeneratorFilters {
  count: number;
  generations: number[];
  types: PokemonType[];
  typeMatch: MatchMode;
  includeLegendaries: boolean;
  legendaryOnly: boolean;
  includeMythicals: boolean;
  includeForms: boolean;
  fullyEvolvedOnly: boolean;
  allowDuplicates: boolean;
  regions: string[];
  evolutionStage: EvolutionStage;
  minBst: number;
  maxBst: number;
  categories: Record<SpecialCategory, CategoryRule>;
  starterOnly: boolean;
  starterType: "any" | "grass" | "fire" | "water";
  includePikachu: boolean;
  includeEevee: boolean;
  teamMode: TeamMode;
}

export interface GeneratedPokemon {
  pokemon: PokemonRecord;
  ability: string;
  nature: string;
  locked: boolean;
  shiny: boolean;
}

export interface SavedPokemonSnapshot {
  slug: string;
  ability: string;
  nature: string;
  locked: boolean;
  shiny: boolean;
}

export interface SavedGeneration {
  id: string;
  seed: string;
  pokemonIds: string[];
  members?: SavedPokemonSnapshot[];
  createdAt: string;
  pageMode: "standard" | "team" | "starter";
  filters: GeneratorFilters;
}

export interface FavoriteTeam extends SavedGeneration {
  name?: string;
}
