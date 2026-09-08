import { describe, expect, it } from "vitest";
import { generatePokemon, generateWithLocks, rerollAt, rerollUnlocked } from "../src/lib/random";
import { createReadableSeed, createSeededRandom, isValidSeed } from "../src/lib/seeded-random";
import { filters, generated, pool } from "./fixtures";

describe("seeded random generation", () => {
  it("preserves a locked slot and its build while growing a team", () => {
    const locked = { ...generated(pool[0], true), shiny: true };
    const result = generateWithLocks([generated(pool[1]), locked], pool, { ...filters, count: 6 }, "LOCK-GROW");
    expect(result).toHaveLength(6);
    expect(result[1]).toBe(locked);
    expect(new Set(result.map((entry) => entry.pokemon.slug)).size).toBe(6);
  });
  it("refuses to silently discard a locked slot when shrinking", () => {
    expect(() => generateWithLocks([generated(pool[0]), generated(pool[1], true)], pool, { ...filters, count: 1 }, "LOCK-SHRINK")).toThrow(/Unlock/);
  });
  it("can retain a locked Pokémon outside new filters with a small remaining pool", () => {
    const locked = generated(pool[0], true);
    const result = generateWithLocks([locked], [pool[1]], { ...filters, count: 2 }, "LOCK-FILTER");
    expect(result[0]).toBe(locked);
    expect(result[1].pokemon).toBe(pool[1]);
  });
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
  it("creates a valid readable seed from a seeded random source", () => {
    const seed = createReadableSeed(createSeededRandom("browser-entropy"));
    expect(seed).toMatch(/^(KANTO|JOHTO|HOENN|SINNOH|UNOVA|KALOS|ALOLA|GALAR|PALDEA)-\d{5}$/);
    expect(isValidSeed(seed)).toBe(true);
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
  it("does not immediately return previously unlocked Pokémon when alternatives exist", () => {
    const current = [generated(pool[0]), generated(pool[1]), generated(pool[2])];
    const previous = new Set(current.map((entry) => entry.pokemon.slug));
    const result = rerollUnlocked(current, pool, { ...filters, count: 3 }, "KALOS-24242");
    expect(result.every((entry) => !previous.has(entry.pokemon.slug))).toBe(true);
  });
  it("single-card reroll does not change other positions", () => {
    const current = [generated(pool[0]), generated(pool[1]), generated(pool[2])];
    const result = rerollAt(current, 1, pool, filters, "GALAR-33333");
    expect(result[0]).toBe(current[0]);
    expect(result[2]).toBe(current[2]);
    expect(result[1].pokemon.slug).not.toBe(current[1].pokemon.slug);
  });
});
