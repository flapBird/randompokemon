import { describe, expect, it } from "vitest";
import { filterPokemon } from "../src/lib/filters";
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
  it("applies a BST range", () => {
    const result = filterPokemon(pool, { ...filters, minBst: 550, maxBst: 590 });
    expect(result.map((entry) => entry.name)).toEqual(["Articuno"]);
  });
  it("limits the candidate pool to starters", () => {
    expect(filterPokemon(pool, { ...filters, starterOnly: true }).every((entry) => entry.isStarter)).toBe(true);
  });
});
