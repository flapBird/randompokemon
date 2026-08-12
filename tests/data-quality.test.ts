import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { PokemonRecord } from "../src/types/pokemon";

const dataset = JSON.parse(readFileSync(fileURLToPath(new URL("../public/data/pokemon.json", import.meta.url)), "utf8")) as PokemonRecord[];
const defaultForms = dataset.filter((entry) => entry.isDefaultForm);

describe("bundled Pokémon data", () => {
  it("contains complete and varied species metadata", () => {
    expect(defaultForms).toHaveLength(1025);
    expect(new Set(defaultForms.map((entry) => entry.height)).size).toBeGreaterThanOrEqual(50);
    expect(new Set(defaultForms.map((entry) => entry.category)).size).toBeGreaterThanOrEqual(100);
  });

  it("contains usable Mega Evolution records", () => {
    expect(dataset.filter((entry) => entry.isMega).length).toBeGreaterThanOrEqual(40);
  });

  it("contains navigable evolution data and readable conditions", () => {
    const froakie = dataset.find((entry) => entry.slug === "froakie");
    const frogadier = dataset.find((entry) => entry.slug === "frogadier");
    const greninja = dataset.find((entry) => entry.slug === "greninja");
    expect(froakie?.evolutions).toContain("frogadier");
    expect(frogadier?.preEvolution).toBe("froakie");
    expect(frogadier?.evolutionMethod).toBe("Level 16");
    expect(greninja?.evolutionMethod).toBe("Level 36");
  });
});
