import type { GeneratorFilters } from "@/types/generator";

const categoryDefaults = {
  paradox: "any",
  ultraBeast: "any",
  regionalForm: "any",
  mega: "any",
  gigantamax: "any",
} as const;

export const STANDARD_FILTERS: GeneratorFilters = {
  count: 6,
  generations: [],
  types: [],
  typeMatch: "any",
  includeLegendaries: false,
  legendaryOnly: false,
  includeMythicals: false,
  includeForms: false,
  fullyEvolvedOnly: false,
  allowDuplicates: false,
  regions: [],
  evolutionStage: "any",
  minBst: 100,
  maxBst: 800,
  categories: { ...categoryDefaults },
  starterOnly: false,
  starterType: "any",
  includePikachu: false,
  includeEevee: false,
  teamMode: "smart",
};

export const STARTER_FILTERS: GeneratorFilters = {
  ...STANDARD_FILTERS,
  count: 1,
  starterOnly: true,
  includeLegendaries: false,
  includeMythicals: false,
  teamMode: "random",
};

export const LEGENDARY_FILTERS: GeneratorFilters = {
  ...STANDARD_FILTERS,
  count: 1,
  includeLegendaries: true,
  legendaryOnly: true,
  teamMode: "random",
};

export const SHINY_FILTERS: GeneratorFilters = {
  ...STANDARD_FILTERS,
  count: 1,
  includeLegendaries: true,
  includeMythicals: true,
  teamMode: "random",
};

export const KANTO_FILTERS: GeneratorFilters = {
  ...STANDARD_FILTERS,
  generations: [1],
  regions: ["kanto"],
};

export const PALDEA_FILTERS: GeneratorFilters = {
  ...STANDARD_FILTERS,
  generations: [9],
  regions: ["paldea"],
};

export const NUZLOCKE_FILTERS: GeneratorFilters = {
  ...STANDARD_FILTERS,
  count: 1,
  teamMode: "random",
};
