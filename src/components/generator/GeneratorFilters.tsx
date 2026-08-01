"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { POKEMON_TYPES, type PokemonType } from "@/types/pokemon";
import type { CategoryRule, GeneratorFilters, SpecialCategory } from "@/types/generator";
import { title } from "@/lib/team-analysis";
import { applyQuickMode, QUICK_MODES, type QuickMode } from "./QuickModes";

const regions = ["kanto", "johto", "hoenn", "sinnoh", "unova", "kalos", "alola", "galar", "hisui", "paldea"];
const specialLabels: Record<SpecialCategory, string> = {
  paradox: "Paradox Pokémon",
  ultraBeast: "Ultra Beasts",
  regionalForm: "Regional Forms",
  mega: "Mega Evolutions",
  gigantamax: "Gigantamax Forms",
};
type MenuId = "preset" | "count" | "generation" | "type" | "region" | "starter-type" | "more";

function Toggle({ checked, onChange, label, disabled }: { checked: boolean; onChange: (value: boolean) => void; label: string; disabled?: boolean }) {
  return (
    <label className={`toggle-row ${disabled ? "disabled" : ""}`}>
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} disabled={disabled} />
      <span className="toggle" aria-hidden="true"><span /></span>
    </label>
  );
}

function FilterDropdown({
  id,
  label,
  value,
  openMenu,
  closingMenu,
  onToggle,
  children,
  wide = false,
  more = false,
}: {
  id: MenuId;
  label: string;
  value: string;
  openMenu: MenuId | null;
  closingMenu: MenuId | null;
  onToggle: (id: MenuId) => void;
  children: ReactNode;
  wide?: boolean;
  more?: boolean;
}) {
  const open = openMenu === id;
  const closing = closingMenu === id;
  return (
    <div className={`filter-dropdown filter-dropdown-${id}`}>
      <button
        type="button"
        className={open ? "filter-trigger active" : "filter-trigger"}
        data-filter-trigger={id}
        aria-expanded={open}
        aria-controls={`filter-menu-${id}`}
        onClick={() => onToggle(id)}
      >
        <span><small>{label}</small><strong>{value}</strong></span>
        <span className="filter-trigger-chevron" aria-hidden="true">⌄</span>
      </button>
      <div
        id={`filter-menu-${id}`}
        className={`filter-menu t-dropdown${open ? " is-open" : ""}${closing ? " is-closing" : ""}${wide ? " filter-menu-wide" : ""}${more ? " filter-menu-more" : ""}`}
        data-origin={more ? "top-right" : "top-left"}
        aria-hidden={!open}
        inert={!open ? true : undefined}
      >
        {children}
      </div>
    </div>
  );
}

export function GeneratorFilters({
  filters,
  onChange,
  pageMode,
  seedInput,
  onSeedInputChange,
  activeQuickMode,
  onQuickSelect,
}: {
  filters: GeneratorFilters;
  onChange: (filters: GeneratorFilters) => void;
  pageMode: "standard" | "team" | "starter";
  seedInput: string;
  onSeedInputChange: (value: string) => void;
  activeQuickMode: QuickMode | null;
  onQuickSelect: (mode: QuickMode, next: (filters: GeneratorFilters) => GeneratorFilters) => void;
}) {
  const [openMenu, setOpenMenu] = useState<MenuId | null>(null);
  const [closingMenu, setClosingMenu] = useState<MenuId | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const update = <K extends keyof GeneratorFilters>(key: K, value: GeneratorFilters[K]) => onChange({ ...filters, [key]: value });

  const beginClose = useCallback((menu: MenuId, restoreFocus = false) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu((current) => current === menu ? null : current);
    setClosingMenu(menu);
    if (restoreFocus) window.requestAnimationFrame(() => rootRef.current?.querySelector<HTMLButtonElement>(`[data-filter-trigger="${menu}"]`)?.focus());
    const rawDuration = getComputedStyle(document.documentElement).getPropertyValue("--dropdown-close-dur");
    const duration = Math.max(0, Number.parseFloat(rawDuration) || 150);
    closeTimer.current = setTimeout(() => setClosingMenu((current) => current === menu ? null : current), duration);
  }, []);

  const toggleMenu = useCallback((menu: MenuId) => {
    if (openMenu === menu) {
      beginClose(menu);
      return;
    }
    if (openMenu) beginClose(openMenu);
    setOpenMenu(menu);
  }, [beginClose, openMenu]);

  useEffect(() => {
    const closeFromOutside = (event: PointerEvent) => {
      if (openMenu && rootRef.current && !rootRef.current.contains(event.target as Node)) beginClose(openMenu);
    };
    const closeFromKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape" && openMenu) beginClose(openMenu, true);
    };
    document.addEventListener("pointerdown", closeFromOutside);
    document.addEventListener("keydown", closeFromKeyboard);
    return () => {
      document.removeEventListener("pointerdown", closeFromOutside);
      document.removeEventListener("keydown", closeFromKeyboard);
    };
  }, [beginClose, openMenu]);

  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

  const toggleNumber = (value: number) => update("generations", filters.generations.includes(value) ? filters.generations.filter((item) => item !== value) : [...filters.generations, value].sort());
  const toggleType = (type: PokemonType) => {
    const exists = filters.types.includes(type);
    if (!exists && filters.typeMatch === "all" && filters.types.length >= 2) return;
    update("types", exists ? filters.types.filter((item) => item !== type) : [...filters.types, type]);
  };
  const toggleRegion = (region: string) => update("regions", filters.regions.includes(region) ? filters.regions.filter((item) => item !== region) : [...filters.regions, region]);
  const category = (key: SpecialCategory, value: CategoryRule) => update("categories", { ...filters.categories, [key]: value });
  const generationSummary = filters.generations.length ? filters.generations.length === 1 ? `Gen ${filters.generations[0]}` : `${filters.generations.length} generations` : "All generations";
  const typeSummary = filters.types.length ? filters.types.length === 1 ? title(filters.types[0]) : `${filters.types.length} types` : "Any type";
  const regionSummary = filters.regions.length ? filters.regions.length === 1 ? title(filters.regions[0]) : `${filters.regions.length} regions` : "All regions";
  const presetSummary = useMemo(() => QUICK_MODES.find((mode) => mode.id === activeQuickMode)?.label ?? "Custom", [activeQuickMode]);
  const advancedCount = [
    filters.includeLegendaries,
    filters.includeMythicals,
    filters.includeForms,
    filters.fullyEvolvedOnly,
    filters.allowDuplicates,
    filters.evolutionStage !== "any",
    filters.minBst !== 100,
    filters.maxBst !== 800,
    Object.values(filters.categories).some((value) => value !== "any"),
  ].filter(Boolean).length;
  const moreSummary = pageMode === "starter"
    ? filters.includePikachu || filters.includeEevee ? "Options set" : "Optional"
    : advancedCount ? `${advancedCount} active` : "Optional";
  const done = (menu: MenuId) => <button type="button" className="filter-menu-done" onClick={() => beginClose(menu, true)}>Done</button>;

  return (
    <div className="compact-filter-bar" ref={rootRef} aria-label="Generator filters">
      {pageMode === "standard" && (
        <FilterDropdown id="preset" label="Preset" value={presetSummary} openMenu={openMenu} closingMenu={closingMenu} onToggle={toggleMenu} wide>
          <div className="filter-menu-heading"><strong>Quick presets</strong><span>Set the common options in one click.</span></div>
          <div className="filter-option-list">
            {QUICK_MODES.map((mode) => (
              <button
                key={mode.id}
                type="button"
                className={activeQuickMode === mode.id ? "filter-option selected" : "filter-option"}
                onClick={() => {
                  onQuickSelect(mode.id, (current) => applyQuickMode(mode.id, current));
                  beginClose("preset", true);
                }}
              >
                <span aria-hidden="true">{mode.icon}</span><span><strong>{mode.label}</strong><small>{mode.note}</small></span>
              </button>
            ))}
          </div>
        </FilterDropdown>
      )}

      {pageMode !== "starter" && (
        <FilterDropdown id="count" label="Team size" value={`${filters.count} Pokémon`} openMenu={openMenu} closingMenu={closingMenu} onToggle={toggleMenu}>
          <div className="filter-menu-heading"><strong>Team size</strong><span>Generate between one and six Pokémon.</span></div>
          <div className="segmented count-selector">
            {[1, 2, 3, 4, 5, 6].map((count) => <button type="button" key={count} className={filters.count === count ? "selected" : ""} onClick={() => { update("count", count); beginClose("count", true); }}>{count}</button>)}
          </div>
        </FilterDropdown>
      )}

      <FilterDropdown id="generation" label="Generation" value={generationSummary} openMenu={openMenu} closingMenu={closingMenu} onToggle={toggleMenu} wide>
        <div className="filter-menu-heading"><strong>Generation</strong><span>Select one or more. All is the default.</span></div>
        <div className="chip-grid compact filter-menu-chips" role="group" aria-label="Filter by generation">
          <button type="button" className={!filters.generations.length ? "selected" : ""} onClick={() => update("generations", [])}>All</button>
          {Array.from({ length: 9 }, (_, index) => index + 1).map((gen) => <button type="button" key={gen} className={filters.generations.includes(gen) ? "selected" : ""} onClick={() => toggleNumber(gen)}>Gen {gen}</button>)}
        </div>
        {done("generation")}
      </FilterDropdown>

      {pageMode === "starter" ? (
        <FilterDropdown id="starter-type" label="Starter type" value={title(filters.starterType)} openMenu={openMenu} closingMenu={closingMenu} onToggle={toggleMenu}>
          <div className="filter-menu-heading"><strong>Starter type</strong><span>Choose a classic starter type.</span></div>
          <div className="filter-option-list simple-options">
            {(["any", "grass", "fire", "water"] as const).map((type) => <button type="button" key={type} className={filters.starterType === type ? "filter-option selected" : "filter-option"} onClick={() => { update("starterType", type); beginClose("starter-type", true); }}><strong>{title(type)}</strong></button>)}
          </div>
        </FilterDropdown>
      ) : (
        <>
          <FilterDropdown id="type" label="Type" value={typeSummary} openMenu={openMenu} closingMenu={closingMenu} onToggle={toggleMenu} wide>
            <div className="filter-menu-heading"><strong>Pokémon type</strong><span>Select one or more types.</span></div>
            <div
              className="type-selector filter-type-grid"
              style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
              role="group"
              aria-label="Filter by Pokémon type"
            >
              {POKEMON_TYPES.map((type) => <button type="button" key={type} data-type={type} className={filters.types.includes(type) ? "selected" : ""} onClick={() => toggleType(type)} aria-pressed={filters.types.includes(type)}><span className="type-dot" />{title(type)}</button>)}
            </div>
            {filters.types.length >= 2 && (
              <div className="filter-menu-inline"><span>Type match</span><div className="mini-segmented"><button type="button" className={filters.typeMatch === "any" ? "selected" : ""} onClick={() => update("typeMatch", "any")}>Any</button><button type="button" className={filters.typeMatch === "all" ? "selected" : ""} onClick={() => onChange({ ...filters, typeMatch: "all", types: filters.types.slice(0, 2) })}>All</button></div></div>
            )}
            {filters.typeMatch === "all" && filters.types.length >= 2 && <p className="field-note">Match All allows up to two selected types.</p>}
            {done("type")}
          </FilterDropdown>

          <FilterDropdown id="region" label="Region" value={regionSummary} openMenu={openMenu} closingMenu={closingMenu} onToggle={toggleMenu} wide>
            <div className="filter-menu-heading"><strong>Region</strong><span>Select one or more regions.</span></div>
            <div className="chip-grid filter-menu-chips">
              <button type="button" className={!filters.regions.length ? "selected" : ""} onClick={() => update("regions", [])}>All Regions</button>
              {regions.map((region) => <button type="button" key={region} className={filters.regions.includes(region) ? "selected" : ""} onClick={() => toggleRegion(region)}>{title(region)}</button>)}
            </div>
            {done("region")}
          </FilterDropdown>
        </>
      )}

      <FilterDropdown id="more" label="More filters" value={moreSummary} openMenu={openMenu} closingMenu={closingMenu} onToggle={toggleMenu} wide more>
        <div className="filter-menu-heading"><strong>More filters</strong><span>{pageMode === "starter" ? "Partner starters and seed." : "Special Pokémon, stats, team style, and seed."}</span></div>
        <div className="filter-menu-scroll">
          {pageMode === "starter" ? (
            <fieldset className="menu-section">
              <legend>Partner starters</legend>
              <div className="toggle-grid"><Toggle checked={filters.includePikachu} onChange={(value) => update("includePikachu", value)} label="Include Pikachu" /><Toggle checked={filters.includeEevee} onChange={(value) => update("includeEevee", value)} label="Include Eevee" /></div>
            </fieldset>
          ) : (
            <>
              {filters.count > 1 && (
                <fieldset className="menu-section">
                  <legend>Team generation style</legend>
                  <div className="segmented"><button type="button" className={filters.teamMode === "random" ? "selected" : ""} onClick={() => update("teamMode", "random")}>Pure Random</button><button type="button" className={filters.teamMode === "smart" ? "selected" : ""} onClick={() => update("teamMode", "smart")}>Smart Team</button></div>
                  {filters.teamMode === "smart" && <p className="field-note">Improves variety and balance, but does not create a competitive team.</p>}
                </fieldset>
              )}
              <fieldset className="menu-section">
                <legend>Special Pokémon</legend>
                <div className="toggle-grid">
                  <Toggle checked={filters.includeLegendaries} onChange={(value) => onChange({ ...filters, includeLegendaries: value, legendaryOnly: value ? filters.legendaryOnly : false })} label="Include Legendaries" />
                  <Toggle checked={filters.includeMythicals} onChange={(value) => update("includeMythicals", value)} label="Include Mythicals" />
                  <Toggle checked={filters.includeForms} onChange={(value) => update("includeForms", value)} label="Include Forms" />
                  <Toggle checked={filters.fullyEvolvedOnly} onChange={(value) => update("fullyEvolvedOnly", value)} label="Fully Evolved Only" />
                  <Toggle checked={filters.allowDuplicates} onChange={(value) => update("allowDuplicates", value)} label="Allow Duplicate Pokémon" />
                </div>
              </fieldset>
              <div className="advanced-grid menu-section">
                <label>Evolution stage<select value={filters.evolutionStage} onChange={(event) => update("evolutionStage", event.target.value as GeneratorFilters["evolutionStage"])}><option value="any">Any Stage</option><option value="basic">Basic</option><option value="middle">Middle Evolution</option><option value="final">Final Evolution</option></select></label>
                <label>Min BST<input type="number" min="100" max="800" value={filters.minBst} onChange={(event) => update("minBst", Number(event.target.value))} /></label>
                <label>Max BST<input type="number" min="100" max="800" value={filters.maxBst} onChange={(event) => update("maxBst", Number(event.target.value))} /></label>
              </div>
              <fieldset className="menu-section">
                <legend>Special categories</legend>
                <div className="category-grid">
                  {(Object.keys(specialLabels) as SpecialCategory[]).map((key) => <label key={key}>{specialLabels[key]}<select value={filters.categories[key]} onChange={(event) => category(key, event.target.value as CategoryRule)}><option value="any">Any</option><option value="include">Only</option><option value="exclude">Exclude</option></select></label>)}
                </div>
              </fieldset>
            </>
          )}
          <label className="filter-seed menu-section">Seed<input value={seedInput} onChange={(event) => onSeedInputChange(event.target.value)} placeholder="Leave blank for a new seed" aria-describedby={`seed-help-${pageMode}`} /><small id={`seed-help-${pageMode}`}>Use the same seed and filters to reproduce a roll.</small></label>
        </div>
        {done("more")}
      </FilterDropdown>
    </div>
  );
}
