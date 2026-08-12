import { describe, expect, it } from "vitest";
import { filterPokemon, generationRegionConflictMessage } from "../src/lib/filters";
import { pokemon } from "./fixtures";
import { filters, pool } from "./fixtures";

describe("filterPokemon", () => {
  it("filters by generation", () => {
    expect(filterPokemon(pool, { ...filters, generations: [2] }).every((entry) => entry.generation === 2)).toBe(true);
  });
  it("matches any selected type", () => {
    const result = filterPokemon(pool, { ...filters, types: ["fire", "water"], typeMatch: "any" });
    expect(result.map((entry) => entry.name)).toEqual(["Charmander", "Squirtle"]);
  });
  it("matches all selected types", () => {
    const result = filterPokemon(pool, { ...filters, types: ["grass", "poison"], typeMatch: "all" });
    expect(result.map((entry) => entry.name)).toEqual(["Bulbasaur"]);
  });
  it("excludes legendary and mythical Pokémon", () => {
    const result = filterPokemon(pool, { ...filters, includeLegendaries: false, includeMythicals: false });
    expect(result.some((entry) => entry.isLegendary || entry.isMythical)).toBe(false);
  });
  it("filters fully evolved Pokémon", () => {
    expect(filterPokemon(pool, { ...filters, fullyEvolvedOnly: true }).every((entry) => entry.fullyEvolved)).toBe(true);
  });
  it("treats every terminal evolution as final regardless of chain length", () => {
    const stages = [
      pokemon(20, "Raticate", ["normal"], { evolutionStage: 2, fullyEvolved: true }),
      pokemon(59, "Arcanine", ["fire"], { evolutionStage: 2, fullyEvolved: true }),
      pokemon(133, "Eevee", ["normal"], { evolutionStage: 1, fullyEvolved: false }),
    ];
    expect(filterPokemon(stages, { ...filters, evolutionStage: "final" }).map((entry) => entry.name)).toEqual(["Raticate", "Arcanine"]);
  });
  it("does not mix terminal two-stage Pokémon into middle evolutions", () => {
    const stages = [
      pokemon(2, "Ivysaur", ["grass"], { evolutionStage: 2, fullyEvolved: false }),
      pokemon(20, "Raticate", ["normal"], { evolutionStage: 2, fullyEvolved: true }),
    ];
    expect(filterPokemon(stages, { ...filters, evolutionStage: "middle" }).map((entry) => entry.name)).toEqual(["Ivysaur"]);
  });
  it("applies a BST range", () => {
    const result = filterPokemon(pool, { ...filters, minBst: 550, maxBst: 590 });
    expect(result.map((entry) => entry.name)).toEqual(["Articuno"]);
  });
  it("limits the candidate pool to starters", () => {
    expect(filterPokemon(pool, { ...filters, starterOnly: true }).every((entry) => entry.isStarter)).toBe(true);
  });
  it("explains a generation and region conflict", () => {
    expect(generationRegionConflictMessage({ ...filters, generations: [1, 2], regions: ["kalos"] })).toContain("Generation 6");
  });
  it("allows a region when at least one selected generation overlaps", () => {
    expect(generationRegionConflictMessage({ ...filters, generations: [2, 6], regions: ["kalos"] })).toBeNull();
  });
});
