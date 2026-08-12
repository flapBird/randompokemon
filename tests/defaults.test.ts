import { describe, expect, it } from "vitest";
import { applyQuickMode } from "../src/components/generator/QuickModes";
import {
  KANTO_FILTERS,
  LEGENDARY_FILTERS,
  NUZLOCKE_FILTERS,
  PALDEA_FILTERS,
  SHINY_FILTERS,
  STANDARD_FILTERS,
  STARTER_FILTERS,
} from "../src/lib/defaults";

describe("page defaults", () => {
  it("starts the homepage with a Smart Team of six", () => {
    expect(STANDARD_FILTERS.count).toBe(6);
    expect(STANDARD_FILTERS.teamMode).toBe("smart");
  });

  it("keeps the Starter Generator as a single-pick page", () => {
    expect(STARTER_FILTERS.count).toBe(1);
    expect(STARTER_FILTERS.starterOnly).toBe(true);
  });

  it("keeps homepage quick presets team-sized", () => {
    expect(applyQuickMode("random", STANDARD_FILTERS).count).toBe(6);
    expect(applyQuickMode("team", STANDARD_FILTERS).teamMode).toBe("smart");
    expect(applyQuickMode("legendary", STANDARD_FILTERS).count).toBe(6);
  });

  it("gives specialized pages distinct search-intent defaults", () => {
    expect(LEGENDARY_FILTERS).toMatchObject({ count: 1, legendaryOnly: true, includeLegendaries: true, teamMode: "random" });
    expect(SHINY_FILTERS).toMatchObject({ count: 1, includeLegendaries: true, includeMythicals: true, teamMode: "random" });
    expect(NUZLOCKE_FILTERS).toMatchObject({ count: 1, includeLegendaries: false, includeMythicals: false, teamMode: "random" });
    expect(KANTO_FILTERS).toMatchObject({ generations: [1], regions: ["kanto"] });
    expect(PALDEA_FILTERS).toMatchObject({ generations: [9], regions: ["paldea"] });
  });
});
