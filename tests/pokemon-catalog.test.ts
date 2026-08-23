import { describe, expect, it } from "vitest";
import { REGION_GUIDES } from "@/data/regions";
import { defaultPokemon, getAdjacentPokemon, getPokemon, getPokemonByGeneration, getPokemonByRegion, getPokemonByType, getTypeMatchups } from "@/lib/pokemon-catalog";

describe("shared Pokémon catalog", () => {
  it("exposes all 1,025 default species for static pages and tools", () => {
    expect(defaultPokemon).toHaveLength(1025);
    expect(getPokemonByGeneration(1)).toHaveLength(151);
    expect(getPokemonByRegion("Kanto")).toHaveLength(151);
    expect(getPokemonByType("fire").length).toBeGreaterThan(50);
  });

  it("calculates combined defensive matchups", () => {
    const charizard = getPokemon("charizard");
    expect(charizard).toBeTruthy();
    const matchups = getTypeMatchups(charizard!.types);
    expect(matchups.weaknesses.find(({ type }) => type === "rock")?.multiplier).toBe(4);
    expect(matchups.immunities.map(({ type }) => type)).toContain("ground");
  });

  it("links adjacent Pokédex entries", () => {
    const charizard = getPokemon("charizard")!;
    const adjacent = getAdjacentPokemon(charizard);
    expect(adjacent.previous?.slug).toBe("charmeleon");
    expect(adjacent.next?.slug).toBe("squirtle");
  });

  it("keeps every curated region link resolvable", () => {
    const slugs = REGION_GUIDES.flatMap((region) => [...region.starters, ...region.legendaries, ...region.representatives]);
    expect(slugs.filter((slug) => !getPokemon(slug))).toEqual([]);
  });
});
