import type { GeneratedPokemon, GeneratorFilters, SavedPokemonSnapshot, SpecialCategory } from "@/types/generator";
import { POKEMON_TYPES } from "@/types/pokemon";

const bool = (value: string | null, fallback: boolean) => value === null ? fallback : value === "1";
const numbers = (value: string | null, min: number, max: number) =>
  (value ?? "").split(",").map(Number).filter((item) => Number.isInteger(item) && item >= min && item <= max);
const REGIONS = new Set(["kanto", "johto", "hoenn", "sinnoh", "unova", "kalos", "alola", "galar", "hisui", "paldea"]);

export function readUrlState(search: string, defaults: GeneratorFilters) {
  const params = new URLSearchParams(search);
  const requestedTypes = (params.get("type") ?? "").split(",").filter((type) => POKEMON_TYPES.includes(type as never)) as GeneratorFilters["types"];
  const categories = { ...defaults.categories };
  (Object.keys(categories) as SpecialCategory[]).forEach((category) => {
    const value = params.get(`cat_${category}`);
    if (value === "include" || value === "exclude" || value === "any") categories[category] = value;
  });
  const count = Number(params.get("count"));
  const minBst = Number(params.get("min"));
  const maxBst = Number(params.get("max"));
  const filters: GeneratorFilters = {
    ...defaults,
    count: Number.isInteger(count) && count >= 1 && count <= 6 ? count : defaults.count,
    generations: numbers(params.get("gen"), 1, 9),
    types: requestedTypes.slice(0, params.get("match") === "all" ? 2 : 18),
    typeMatch: params.get("match") === "all" ? "all" : "any",
    includeLegendaries: bool(params.get("legendary"), defaults.includeLegendaries),
    legendaryOnly: bool(params.get("legendaryOnly"), defaults.legendaryOnly),
    includeMythicals: bool(params.get("mythical"), defaults.includeMythicals),
    includeForms: bool(params.get("forms"), defaults.includeForms),
    fullyEvolvedOnly: bool(params.get("evolved"), defaults.fullyEvolvedOnly),
    allowDuplicates: bool(params.get("dupes"), defaults.allowDuplicates),
    regions: (params.get("region") ?? "").split(",").filter((region) => REGIONS.has(region)).slice(0, 10),
    evolutionStage: ["any", "basic", "middle", "final"].includes(params.get("stage") ?? "") ? params.get("stage") as GeneratorFilters["evolutionStage"] : defaults.evolutionStage,
    minBst: Number.isFinite(minBst) && minBst >= 100 && minBst <= 800 ? minBst : defaults.minBst,
    maxBst: Number.isFinite(maxBst) && maxBst >= 100 && maxBst <= 800 ? maxBst : defaults.maxBst,
    categories,
    starterOnly: bool(params.get("starter"), defaults.starterOnly),
    starterType: ["any", "grass", "fire", "water"].includes(params.get("starterType") ?? "") ? params.get("starterType") as GeneratorFilters["starterType"] : defaults.starterType,
    includePikachu: bool(params.get("pikachu"), defaults.includePikachu),
    includeEevee: bool(params.get("eevee"), defaults.includeEevee),
    teamMode: params.get("mode") === "smart" ? "smart" : params.get("mode") === "random" ? "random" : defaults.teamMode,
  };
  const ids = (params.get("ids") ?? "").split(",").filter(Boolean).slice(0, 6);
  const abilities = params.getAll("ability").slice(0, 6);
  const natures = params.getAll("nature").slice(0, 6);
  const shiny = new Set(numbers(params.get("shiny"), 0, 5));
  const locked = new Set(numbers(params.get("locked"), 0, 5));
  const members: SavedPokemonSnapshot[] | undefined = abilities.length === ids.length && natures.length === ids.length
    ? ids.map((slug, index) => ({ slug, ability: abilities[index], nature: natures[index], shiny: shiny.has(index), locked: locked.has(index) }))
    : undefined;
  return {
    seed: params.get("seed"),
    anchor: (params.get("pokemon") ?? "").toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 60) || null,
    ids,
    members,
    filters,
  };
}

export function createShareUrl(seed: string, filters: GeneratorFilters, results: GeneratedPokemon[]) {
  const params = new URLSearchParams();
  params.set("seed", seed);
  params.set("count", String(filters.count));
  // Explicit false values must override specialized page defaults on restore.
  for (const [parameter, enabled] of Object.entries({ legendary: filters.includeLegendaries, legendaryOnly: filters.legendaryOnly, mythical: filters.includeMythicals, forms: filters.includeForms, evolved: filters.fullyEvolvedOnly, dupes: filters.allowDuplicates, starter: filters.starterOnly, pikachu: filters.includePikachu, eevee: filters.includeEevee })) {
    params.set(parameter, enabled ? "1" : "0");
  }
  if (filters.generations.length) params.set("gen", filters.generations.join(","));
  if (filters.types.length) params.set("type", filters.types.join(","));
  if (filters.typeMatch === "all") params.set("match", "all");
  if (filters.includeLegendaries) params.set("legendary", "1");
  if (filters.legendaryOnly) params.set("legendaryOnly", "1");
  if (filters.includeMythicals) params.set("mythical", "1");
  if (filters.includeForms) params.set("forms", "1");
  if (filters.fullyEvolvedOnly) params.set("evolved", "1");
  if (filters.allowDuplicates) params.set("dupes", "1");
  if (filters.regions.length) params.set("region", filters.regions.join(","));
  if (filters.evolutionStage !== "any") params.set("stage", filters.evolutionStage);
  if (filters.minBst !== 100) params.set("min", String(filters.minBst));
  if (filters.maxBst !== 800) params.set("max", String(filters.maxBst));
  params.set("mode", filters.teamMode);
  if (filters.starterOnly) params.set("starter", "1");
  if (filters.starterType !== "any") params.set("starterType", filters.starterType);
  if (filters.includePikachu) params.set("pikachu", "1");
  if (filters.includeEevee) params.set("eevee", "1");
  Object.entries(filters.categories).forEach(([category, rule]) => {
    if (rule !== "any") params.set(`cat_${category}`, rule);
  });
  if (results.length) {
    params.set("ids", results.map((entry) => entry.pokemon.slug).join(","));
    results.forEach((entry) => {
      params.append("ability", entry.ability);
      params.append("nature", entry.nature);
    });
    const shiny = results.flatMap((entry, index) => entry.shiny ? [index] : []);
    const locked = results.flatMap((entry, index) => entry.locked ? [index] : []);
    if (shiny.length) params.set("shiny", shiny.join(","));
    if (locked.length) params.set("locked", locked.join(","));
  }
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
}
