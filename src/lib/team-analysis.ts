import { calculateDefensiveMultiplier } from "@/data/type-chart";
import type { GeneratedPokemon } from "@/types/generator";
import { POKEMON_TYPES, type PokemonType } from "@/types/pokemon";

export interface TeamAnalysisResult {
  typeDistribution: Array<{ type: PokemonType; count: number }>;
  weaknesses: Array<{ type: PokemonType; count: number }>;
  resistances: Array<{ type: PokemonType; count: number }>;
  total: number;
  uniqueTypes: number;
  averageBst: number;
  highestBst: number;
  lowestBst: number;
  legendaryCount: number;
  tips: string[];
}

export function analyzeTeam(team: GeneratedPokemon[]): TeamAnalysisResult {
  const distribution = new Map<PokemonType, number>();
  team.forEach(({ pokemon }) => pokemon.types.forEach((type) => distribution.set(type, (distribution.get(type) ?? 0) + 1)));
  const typeDistribution = [...distribution.entries()]
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count || a.type.localeCompare(b.type));
  const weaknesses = POKEMON_TYPES.map((type) => ({
    type,
    count: team.filter(({ pokemon }) => calculateDefensiveMultiplier(pokemon.types, type) > 1).length,
  })).filter((item) => item.count >= 2).sort((a, b) => b.count - a.count).slice(0, 5);
  const resistances = POKEMON_TYPES.map((type) => ({
    type,
    count: team.filter(({ pokemon }) => calculateDefensiveMultiplier(pokemon.types, type) < 1).length,
  })).filter((item) => item.count >= 2).sort((a, b) => b.count - a.count).slice(0, 5);
  const bsts = team.map(({ pokemon }) => pokemon.bst);
  const primaryCounts = new Map<string, number>();
  team.forEach(({ pokemon }) => primaryCounts.set(pokemon.primaryType, (primaryCounts.get(pokemon.primaryType) ?? 0) + 1));
  const tips: string[] = [];
  if (distribution.size >= Math.min(8, team.length + 2)) tips.push("Your team has strong type variety.");
  if (weaknesses[0]?.count >= 3) tips.push(`${weaknesses[0].count} team members are weak to ${title(weaknesses[0].type)}.`);
  const repeatedPrimary = [...primaryCounts.entries()].find(([, count]) => count >= 3);
  if (repeatedPrimary) tips.push(`Your team has ${repeatedPrimary[1]} Pokémon sharing the ${title(repeatedPrimary[0])} primary type.`);
  if (!tips.length) tips.push("This team has a fairly even spread of types and weaknesses.");
  return {
    typeDistribution,
    weaknesses,
    resistances,
    total: team.length,
    uniqueTypes: distribution.size,
    averageBst: bsts.length ? Math.round(bsts.reduce((sum, value) => sum + value, 0) / bsts.length) : 0,
    highestBst: bsts.length ? Math.max(...bsts) : 0,
    lowestBst: bsts.length ? Math.min(...bsts) : 0,
    legendaryCount: team.filter(({ pokemon }) => pokemon.isLegendary).length,
    tips,
  };
}

export const title = (value: string) => value.replace(/-/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());
