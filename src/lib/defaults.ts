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
  teamMode: "random",
};

export const TEAM_FILTERS: GeneratorFilters = {
  ...STANDARD_FILTERS,
  count: 6,
  teamMode: "smart",
};

export const STARTER_FILTERS: GeneratorFilters = {
  ...STANDARD_FILTERS,
  starterOnly: true,
  includeLegendaries: false,
  includeMythicals: false,
};
