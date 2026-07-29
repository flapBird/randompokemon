"use client";

import { useState } from "react";
import { POKEMON_TYPES, type PokemonType } from "@/types/pokemon";
import type { CategoryRule, GeneratorFilters, SpecialCategory } from "@/types/generator";
import { title } from "@/lib/team-analysis";

const regions = ["kanto", "johto", "hoenn", "sinnoh", "unova", "kalos", "alola", "galar", "hisui", "paldea"];
const specialLabels: Record<SpecialCategory, string> = {
  paradox: "Paradox Pokémon",
  ultraBeast: "Ultra Beasts",
  regionalForm: "Regional Forms",
  mega: "Mega Evolutions",
  gigantamax: "Gigantamax Forms",
};

function Toggle({ checked, onChange, label, disabled }: { checked: boolean; onChange: (value: boolean) => void; label: string; disabled?: boolean }) {
  return (
    <label className={`toggle-row ${disabled ? "disabled" : ""}`}>
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} disabled={disabled} />
      <span className="toggle" aria-hidden="true"><span /></span>
    </label>
  );
}

export function GeneratorFilters({
  filters,
  onChange,
  pageMode,
}: {
  filters: GeneratorFilters;
  onChange: (filters: GeneratorFilters) => void;
  pageMode: "standard" | "team" | "starter";
}) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const update = <K extends keyof GeneratorFilters>(key: K, value: GeneratorFilters[K]) => onChange({ ...filters, [key]: value });
  const toggleNumber = (key: "generations", value: number) => {
    const current = filters[key];
    update(key, current.includes(value) ? current.filter((item) => item !== value) : [...current, value].sort());
  };
  const toggleType = (type: PokemonType) => {
    const exists = filters.types.includes(type);
    if (!exists && filters.typeMatch === "all" && filters.types.length >= 2) return;
    update("types", exists ? filters.types.filter((item) => item !== type) : [...filters.types, type]);
  };
  const toggleRegion = (region: string) => update("regions", filters.regions.includes(region) ? filters.regions.filter((item) => item !== region) : [...filters.regions, region]);
  const category = (key: SpecialCategory, value: CategoryRule) => update("categories", { ...filters.categories, [key]: value });

  return (
    <div className="filter-stack">
      {pageMode === "starter" ? (
        <div className="filter-card starter-controls">
          <div className="filter-heading"><span>Starter pool</span><small>Choose a generation and classic starter type.</small></div>
          <fieldset>
            <legend>Generation</legend>
            <div className="chip-grid compact">
              <button type="button" className={!filters.generations.length ? "selected" : ""} onClick={() => update("generations", [])}>All</button>
              {Array.from({ length: 9 }, (_, index) => index + 1).map((gen) => <button type="button" key={gen} className={filters.generations.includes(gen) ? "selected" : ""} onClick={() => toggleNumber("generations", gen)}>Gen {gen}</button>)}
            </div>
          </fieldset>
          <fieldset>
            <legend>Starter type</legend>
            <div className="segmented">
              {(["any", "grass", "fire", "water"] as const).map((type) => <button key={type} type="button" className={filters.starterType === type ? "selected" : ""} onClick={() => update("starterType", type)}>{title(type)}</button>)}
            </div>
          </fieldset>
          <div className="toggle-grid">
            <Toggle checked={filters.includePikachu} onChange={(value) => update("includePikachu", value)} label="Include Pikachu" />
            <Toggle checked={filters.includeEevee} onChange={(value) => update("includeEevee", value)} label="Include Eevee" />
          </div>
        </div>
      ) : (
        <>
          <div className="filter-card">
            <div className="filter-heading"><span>Team setup</span><small>Choose how many Pokémon to roll.</small></div>
            <fieldset>
              <legend>Generate count</legend>
              <div className="count-selector segmented">
                {[1, 2, 3, 4, 5, 6].map((count) => <button type="button" key={count} onClick={() => update("count", count)} className={filters.count === count ? "selected" : ""} aria-pressed={filters.count === count}>{count}</button>)}
              </div>
            </fieldset>
            {filters.count > 1 && (
              <fieldset>
                <div className="legend-row"><legend>Generation style</legend><span className="help-tip" title="Smart Team samples multiple valid teams and favors type variety.">?</span></div>
                <div className="segmented">
                  <button type="button" className={filters.teamMode === "random" ? "selected" : ""} onClick={() => update("teamMode", "random")}>Pure Random</button>
                  <button type="button" className={filters.teamMode === "smart" ? "selected" : ""} onClick={() => update("teamMode", "smart")}>Smart Team</button>
                </div>
                {filters.teamMode === "smart" && <p className="field-note">Smart Team improves type variety and balance, but it does not create a competitive battle team.</p>}
              </fieldset>
            )}
          </div>
          <div className="filter-card">
            <div className="filter-heading"><span>Generation</span><small>Select one or more. None means all generations.</small></div>
            <div className="chip-grid compact" role="group" aria-label="Filter by generation">
              <button type="button" className={!filters.generations.length ? "selected" : ""} onClick={() => update("generations", [])}>All</button>
              {Array.from({ length: 9 }, (_, index) => index + 1).map((gen) => <button type="button" key={gen} className={filters.generations.includes(gen) ? "selected" : ""} onClick={() => toggleNumber("generations", gen)}>Gen {gen}</button>)}
            </div>
          </div>
          <div className="filter-card type-filter">
            <div className="filter-heading horizontal">
              <div><span>Type</span><small>Pick any type combination.</small></div>
              <div className="mini-segmented" role="group" aria-label="Type matching mode">
                <button type="button" className={filters.typeMatch === "any" ? "selected" : ""} onClick={() => update("typeMatch", "any")}>Match Any</button>
                <button type="button" className={filters.typeMatch === "all" ? "selected" : ""} onClick={() => update("typeMatch", "all")}>Match All</button>
              </div>
            </div>
            <div className="type-selector" role="group" aria-label="Filter by Pokémon type">
              {POKEMON_TYPES.map((type) => <button type="button" key={type} data-type={type} className={filters.types.includes(type) ? "selected" : ""} onClick={() => toggleType(type)} aria-pressed={filters.types.includes(type)}><span className="type-dot" />{title(type)}</button>)}
            </div>
            {filters.typeMatch === "all" && <p className="field-note">Match All supports up to two types because Pokémon have at most two types.</p>}
          </div>
          <div className="filter-card">
            <div className="filter-heading"><span>Special Pokémon</span><small>Control rare Pokémon and alternate forms.</small></div>
            <div className="toggle-grid">
              <Toggle checked={filters.includeLegendaries} onChange={(value) => onChange({ ...filters, includeLegendaries: value, legendaryOnly: value ? filters.legendaryOnly : false })} label="Include Legendaries" />
              <Toggle checked={filters.includeMythicals} onChange={(value) => update("includeMythicals", value)} label="Include Mythicals" />
              <Toggle checked={filters.includeForms} onChange={(value) => update("includeForms", value)} label="Include Forms" />
              <Toggle checked={filters.fullyEvolvedOnly} onChange={(value) => update("fullyEvolvedOnly", value)} label="Fully Evolved Only" />
              <Toggle checked={filters.allowDuplicates} onChange={(value) => update("allowDuplicates", value)} label="Allow Duplicate Pokémon" />
            </div>
          </div>
        </>
      )}
      {pageMode !== "starter" && (
        <div className="advanced-wrap t-acc" data-open={advancedOpen}>
          <button type="button" className="advanced-trigger" onClick={() => setAdvancedOpen((value) => !value)} aria-expanded={advancedOpen} aria-controls="advanced-filters">
            <span><strong>Advanced Filters</strong><small>Region, evolution stage, base stats, and categories</small></span>
            <span className="chevron t-acc-chevron" aria-hidden="true">⌄</span>
          </button>
          <div id="advanced-filters" className="advanced-panel t-acc-panel">
            <div className="advanced-inner t-acc-panel-inner">
              <fieldset>
                <legend>Region</legend>
                <div className="chip-grid">
                  <button type="button" className={!filters.regions.length ? "selected" : ""} onClick={() => update("regions", [])}>All Regions</button>
                  {regions.map((region) => <button type="button" key={region} className={filters.regions.includes(region) ? "selected" : ""} onClick={() => toggleRegion(region)}>{title(region)}</button>)}
                </div>
              </fieldset>
              <div className="advanced-grid">
                <label>Evolution stage
                  <select value={filters.evolutionStage} onChange={(event) => update("evolutionStage", event.target.value as GeneratorFilters["evolutionStage"])}>
                    <option value="any">Any Stage</option><option value="basic">Basic</option><option value="middle">Middle Evolution</option><option value="final">Final Evolution</option>
                  </select>
                </label>
                <label>Min BST
                  <input type="number" min="100" max="800" value={filters.minBst} onChange={(event) => update("minBst", Number(event.target.value))} />
                </label>
                <label>Max BST
                  <input type="number" min="100" max="800" value={filters.maxBst} onChange={(event) => update("maxBst", Number(event.target.value))} />
                </label>
              </div>
              <fieldset>
                <legend>Special categories</legend>
                <div className="category-grid">
                  {(Object.keys(specialLabels) as SpecialCategory[]).map((key) => (
                    <label key={key}>{specialLabels[key]}
                      <select value={filters.categories[key]} onChange={(event) => category(key, event.target.value as CategoryRule)}>
                        <option value="any">Any</option><option value="include">Only</option><option value="exclude">Exclude</option>
                      </select>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
