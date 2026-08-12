import { describe, expect, it } from "vitest";
import {
  KANTO_FILTERS,
  LEGENDARY_FILTERS,
  NUZLOCKE_FILTERS,
  PALDEA_FILTERS,
  SHINY_FILTERS,
  STANDARD_FILTERS,
  STARTER_FILTERS,
} from "../src/lib/defaults";
import { createStaticGeneration } from "../src/lib/static-generation";

describe("static first generation", () => {
  it("prerenders a stable six-Pokémon homepage result", () => {
    const first = createStaticGeneration(STANDARD_FILTERS, "WELCOME-TEAM");
    const second = createStaticGeneration(STANDARD_FILTERS, "WELCOME-TEAM");

    expect(first.results).toHaveLength(6);
    expect(first.results.map((entry) => entry.pokemon.slug)).toEqual(
      second.results.map((entry) => entry.pokemon.slug),
    );
  });

  it("prerenders one eligible starter on the starter page", () => {
    const generation = createStaticGeneration(STARTER_FILTERS, "WELCOME-STARTER");

    expect(generation.results).toHaveLength(1);
    expect(generation.results[0].pokemon.isStarter).toBe(true);
  });

  it("prerenders eligible results for every specialized generator", () => {
    const legendary = createStaticGeneration(LEGENDARY_FILTERS, "WELCOME-LEGENDARY");
    const shiny = createStaticGeneration(SHINY_FILTERS, "WELCOME-SHINY");
    const nuzlocke = createStaticGeneration(NUZLOCKE_FILTERS, "WELCOME-NUZLOCKE");
    const kanto = createStaticGeneration(KANTO_FILTERS, "WELCOME-KANTO");
    const paldea = createStaticGeneration(PALDEA_FILTERS, "WELCOME-PALDEA");

    expect(legendary.results).toHaveLength(1);
    expect(legendary.results[0].pokemon.isLegendary).toBe(true);
    expect(shiny.results).toHaveLength(1);
    expect(nuzlocke.results[0].pokemon.isLegendary).toBe(false);
    expect(nuzlocke.results[0].pokemon.isMythical).toBe(false);
    expect(kanto.results).toHaveLength(6);
    expect(kanto.results.every((entry) => entry.pokemon.generation === 1 && entry.pokemon.region === "Kanto")).toBe(true);
    expect(paldea.results).toHaveLength(6);
    expect(paldea.results.every((entry) => entry.pokemon.generation === 9 && entry.pokemon.region === "Paldea")).toBe(true);
  });
});
