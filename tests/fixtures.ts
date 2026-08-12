import { STANDARD_FILTERS } from "../src/lib/defaults";
import type { GeneratedPokemon, GeneratorFilters } from "../src/types/generator";
import type { PokemonRecord, PokemonType } from "../src/types/pokemon";

export function pokemon(
  id: number,
  name: string,
  types: PokemonType[],
  overrides: Partial<PokemonRecord> = {},
): PokemonRecord {
  return {
    id,
    slug: name.toLowerCase(),
    name,
    generation: 1,
    region: "Kanto",
    types,
    primaryType: types[0],
    abilities: ["Test Ability"],
    height: 1,
    weight: 10,
    stats: { hp: 50, attack: 50, defense: 50, specialAttack: 50, specialDefense: 50, speed: 50 },
    bst: 300,
    evolutionStage: 1,
    preEvolution: null,
    evolutions: [],
    evolutionMethod: null,
    fullyEvolved: false,
    isStarter: false,
    isLegendary: false,
    isMythical: false,
    isParadox: false,
    isUltraBeast: false,
    isRegionalForm: false,
    isMega: false,
    isGigantamax: false,
    isDefaultForm: true,
    category: "Test Pokémon",
    sprite: "",
    shinySprite: "",
    ...overrides,
  };
}

export const pool = [
  pokemon(1, "Bulbasaur", ["grass", "poison"], { isStarter: true }),
  pokemon(4, "Charmander", ["fire"], { isStarter: true }),
  pokemon(7, "Squirtle", ["water"], { isStarter: true }),
  pokemon(25, "Pikachu", ["electric"]),
  pokemon(92, "Gastly", ["ghost", "poison"]),
  pokemon(144, "Articuno", ["ice", "flying"], { isLegendary: true, fullyEvolved: true, evolutionStage: 3, bst: 580 }),
  pokemon(151, "Mew", ["psychic"], { isMythical: true, fullyEvolved: true, evolutionStage: 3, bst: 600 }),
  pokemon(152, "Chikorita", ["grass"], { generation: 2, region: "Johto", isStarter: true }),
  pokemon(248, "Tyranitar", ["rock", "dark"], { generation: 2, region: "Johto", fullyEvolved: true, evolutionStage: 3, bst: 600 }),
];

export const filters: GeneratorFilters = { ...STANDARD_FILTERS, categories: { ...STANDARD_FILTERS.categories }, includeLegendaries: true, includeMythicals: true };

export function generated(entry: PokemonRecord, locked = false): GeneratedPokemon {
  return { pokemon: entry, ability: "Test Ability", nature: "Hardy", locked, shiny: false };
}
