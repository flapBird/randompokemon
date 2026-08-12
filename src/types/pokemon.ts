export const POKEMON_TYPES = [
  "normal", "fire", "water", "electric", "grass", "ice", "fighting",
  "poison", "ground", "flying", "psychic", "bug", "rock", "ghost",
  "dragon", "dark", "steel", "fairy",
] as const;

export type PokemonType = (typeof POKEMON_TYPES)[number];

export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export interface PokemonRecord {
  id: number;
  slug: string;
  name: string;
  generation: number;
  region: string;
  types: PokemonType[];
  primaryType: PokemonType;
  abilities: string[];
  height: number;
  weight: number;
  stats: PokemonStats;
  bst: number;
  evolutionStage: 1 | 2 | 3;
  preEvolution: string | null;
  evolutions: string[];
  evolutionMethod: string | null;
  fullyEvolved: boolean;
  isStarter: boolean;
  isLegendary: boolean;
  isMythical: boolean;
  isParadox: boolean;
  isUltraBeast: boolean;
  isRegionalForm: boolean;
  isMega: boolean;
  isGigantamax: boolean;
  isDefaultForm: boolean;
  category: string;
  sprite: string;
  shinySprite: string;
}
