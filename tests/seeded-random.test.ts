import { describe, expect, it } from "vitest";
import { generatePokemon, rerollAt, rerollUnlocked } from "../src/lib/random";
import { createSeededRandom } from "../src/lib/seeded-random";
import { filters, generated, pool } from "./fixtures";

describe("seeded random generation", () => {
  it("returns the same sequence for the same seed", () => {
    const one = createSeededRandom("KANTO-12345");
    const two = createSeededRandom("KANTO-12345");
    expect(Array.from({ length: 8 }, one)).toEqual(Array.from({ length: 8 }, two));
  });
  it("usually returns a different sequence for a different seed", () => {
    const one = createSeededRandom("KANTO-12345");
    const two = createSeededRandom("HOENN-98765");
    expect(Array.from({ length: 5 }, one)).not.toEqual(Array.from({ length: 5 }, two));
  });
  it("does not generate duplicate Pokémon when duplicates are disabled", () => {
    const result = generatePokemon(pool, { ...filters, count: 6, allowDuplicates: false }, "UNOVA-10101");
    expect(new Set(result.map((entry) => entry.pokemon.slug)).size).toBe(6);
  });
  it("keeps locked members during Reroll Unlocked", () => {
    const current = [generated(pool[0], true), generated(pool[1]), generated(pool[2])];
    const result = rerollUnlocked(current, pool, { ...filters, count: 3 }, "ALOLA-22222");
    expect(result[0]).toBe(current[0]);
  });
  it("single-card reroll does not change other positions", () => {
    const current = [generated(pool[0]), generated(pool[1]), generated(pool[2])];
    const result = rerollAt(current, 1, pool, filters, "GALAR-33333");
    expect(result[0]).toBe(current[0]);
    expect(result[2]).toBe(current[2]);
    expect(result[1].pokemon.slug).not.toBe(current[1].pokemon.slug);
  });
});
