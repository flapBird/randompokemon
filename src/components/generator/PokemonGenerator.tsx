"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NATURES } from "@/data/natures";
import { calculateDefensiveMultiplier } from "@/data/type-chart";
import { filterPokemon, generationRegionConflictMessage } from "@/lib/filters";
import { generatePokemon, generateWithLocks, rerollAt } from "@/lib/random";
import { createReadableSeed, createSeededRandom, isValidSeed, pickOne, randomInt } from "@/lib/seeded-random";
import { storage } from "@/lib/storage";
import { createShareUrl, readUrlState } from "@/lib/url-state";
import type { FavoriteTeam, GeneratedPokemon, GeneratorFilters, SavedGeneration, SavedPokemonSnapshot } from "@/types/generator";
import type { PokemonRecord, PokemonType } from "@/types/pokemon";
import { PokemonCard } from "../pokemon/PokemonCard";
import { TeamAnalysis } from "../team/TeamAnalysis";
import { GeneratorFilters as FilterControls } from "./GeneratorFilters";
import type { QuickMode } from "./QuickModes";

function makeSeed() {
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const values = new Uint32Array(2);
    crypto.getRandomValues(values);
    return createReadableSeed(createSeededRandom(`${values[0]}-${values[1]}`));
  }
  return createReadableSeed();
}

function hydratePokemon(entries: PokemonRecord[], seed: string, snapshots?: SavedPokemonSnapshot[]): GeneratedPokemon[] {
  const random = createSeededRandom(`${seed}-RESTORE`);
  return entries.map((pokemon, index) => {
    const snapshot = snapshots?.[index]?.slug === pokemon.slug ? snapshots[index] : undefined;
    return {
      pokemon,
      ability: snapshot && pokemon.abilities.includes(snapshot.ability) ? snapshot.ability : pickOne(pokemon.abilities.length ? pokemon.abilities : ["Unknown"], random),
      nature: snapshot && NATURES.some((nature) => nature === snapshot.nature) ? snapshot.nature : NATURES[randomInt(random, NATURES.length)],
      locked: snapshot?.locked ?? false,
      shiny: snapshot?.shiny ?? false,
    };
  });
}

function snapshotResults(results: GeneratedPokemon[]): SavedPokemonSnapshot[] {
  return results.map((entry) => ({ slug: entry.pokemon.slug, ability: entry.ability, nature: entry.nature, locked: entry.locked, shiny: entry.shiny }));
}

function teamText(results: GeneratedPokemon[], seed: string, filters: GeneratorFilters) {
  return [
    `My Random Pokémon ${results.length > 1 ? "Team" : "Pick"}`,
    `Seed: ${seed}`,
    `Mode: ${filters.teamMode === "smart" && results.length > 1 ? "Smart Team" : "Pure Random"}`,
    "",
    ...results.map(({ pokemon, ability, nature, shiny }, index) => `${index + 1}. ${shiny ? "Shiny " : ""}${pokemon.name} — ${pokemon.types.map((type) => type[0].toUpperCase() + type.slice(1)).join(" / ")} · ${ability} · ${nature}`),
    "",
    "Generated at randompokemon.xyz",
  ].join("\n");
}

function savedGenerationName(item: SavedGeneration) {
  return "name" in item && typeof item.name === "string" && item.name.trim()
    ? item.name
    : item.seed;
}

function displayToken(value: string) {
  return value[0].toUpperCase() + value.slice(1);
}

function savedFilterSummary(item: SavedGeneration) {
  const { filters } = item;
  const parts = [item.pageMode === "starter" ? "Starter" : filters.count > 1 ? `Team of ${filters.count}` : "Single pick"];
  if (filters.generations.length) parts.push(filters.generations.map((generation) => `Gen ${generation}`).join(" + "));
  else parts.push("All generations");
  if (filters.types.length) parts.push(filters.types.map(displayToken).join(" + "));
  if (filters.regions.length) parts.push(filters.regions.map(displayToken).join(" + "));
  if (filters.teamMode === "smart" && filters.count > 1) parts.push("Smart");
  return parts.join(" · ");
}

function savedPokemonPreview(item: SavedGeneration, dataset: PokemonRecord[]) {
  const names = item.pokemonIds.slice(0, 3).map((slug) => dataset.find((entry) => entry.slug === slug)?.name ?? displayToken(slug));
  return `${names.join(", ")}${item.pokemonIds.length > 3 ? ` +${item.pokemonIds.length - 3}` : ""}`;
}

function cloneFilters(filters: GeneratorFilters): GeneratorFilters {
  return {
    ...filters,
    generations: [...filters.generations],
    types: [...filters.types],
    regions: [...filters.regions],
    categories: { ...filters.categories },
  };
}

function savedForPage<T extends SavedGeneration>(items: T[], pageMode: "standard" | "team" | "starter") {
  return items.filter((item) => {
    const storedMode = item.pageMode ?? "standard";
    return pageMode === "standard" ? storedMode === "standard" || storedMode === "team" : storedMode === pageMode;
  });
}

type SavedSource = "recent" | "favorites";
type DeletedSaved = { item: SavedGeneration; source: SavedSource; wasActive: boolean };

export function PokemonGenerator({
  initialFilters,
  initialResults = [],
  initialSeed = "",
  pageMode = "standard",
  initialQuickMode = pageMode === "starter" ? "starter" : "team",
  defaultShiny = false,
}: {
  initialFilters: GeneratorFilters;
  initialResults?: GeneratedPokemon[];
  initialSeed?: string;
  pageMode?: "standard" | "team" | "starter";
  initialQuickMode?: QuickMode | null;
  defaultShiny?: boolean;
}) {
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [removedTeam, setRemovedTeam] = useState<GeneratedPokemon[] | null>(null);
  const pendingFilters = JSON.stringify(filters) !== JSON.stringify(appliedFilters);
  const [dataset, setDataset] = useState<PokemonRecord[]>([]);
  const [results, setResults] = useState<GeneratedPokemon[]>(initialResults);
  const [seed, setSeed] = useState(initialSeed);
  const [seedInput, setSeedInput] = useState(initialSeed);
  const [activeQuickMode, setActiveQuickMode] = useState<QuickMode | null>(initialQuickMode);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [recent, setRecent] = useState<SavedGeneration[]>([]);
  const [favorites, setFavorites] = useState<FavoriteTeam[]>([]);
  const [libraryTab, setLibraryTab] = useState<"recent" | "favorites">("recent");
  const [favoriteName, setFavoriteName] = useState("");
  const [highlightedWeakness, setHighlightedWeakness] = useState<PokemonType | null>(null);
  const [activeSavedKey, setActiveSavedKey] = useState<string | null>(null);
  const [deletedSaved, setDeletedSaved] = useState<DeletedSaved | null>(null);
  const [confirmClearRecent, setConfirmClearRecent] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pool = useMemo(() => filterPokemon(dataset, filters), [dataset, filters]);
  const resultPool = useMemo(() => filterPokemon(dataset, appliedFilters), [dataset, appliedFilters]);
  const lockedCount = results.filter((entry) => entry.locked).length;
  const filterIssue = useMemo(() => {
    if (loadingData || !dataset.length) return "";
    if (filters.minBst < 100 || filters.maxBst > 800) return "Base stat totals must stay between 100 and 800.";
    if (filters.minBst > filters.maxBst) return "Minimum BST cannot be greater than maximum BST.";
    const conflict = generationRegionConflictMessage(filters);
    if (conflict) return conflict;
    if (results.some((entry, index) => entry.locked && index >= filters.count)) return "Unlock the Pokémon in the extra slots before reducing the team size.";
    const needed = filters.count - lockedCount;
    const available = filters.allowDuplicates ? pool : pool.filter((entry) => !results.some((member) => member.locked && member.pokemon.slug === entry.slug));
    if (needed > 0 && !pool.length) return "No Pokémon match these filters. Remove a restriction or reset the filters.";
    if (!filters.allowDuplicates && available.length < needed) return `Only ${pool.length} unique Pokémon match. Reduce the team size or allow duplicates.`;
    return "";
  }, [dataset.length, filters, loadingData, pool, results, lockedCount]);

  const showToast = useCallback((message: string, keepUndo = false) => {
    setToast(message);
    if (!keepUndo) setDeletedSaved(null);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setToast("");
      setDeletedSaved(null);
    }, keepUndo ? 5000 : 2800);
  }, []);

  const clearUrlState = useCallback(() => {
    if (window.location.search) {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const addRecent = useCallback((nextSeed: string, nextFilters: GeneratorFilters, nextResults: GeneratedPokemon[]) => {
    const item: SavedGeneration = {
      id: `${nextSeed}-${Date.now()}`,
      seed: nextSeed,
      pokemonIds: nextResults.map((entry) => entry.pokemon.slug),
      members: snapshotResults(nextResults),
      createdAt: new Date().toISOString(),
      pageMode,
      filters: { ...nextFilters, count: nextResults.length },
    };
    const saved = storage.saveRecent(item);
    if (saved) setRecent(savedForPage(saved, pageMode));
  }, [pageMode]);

  const generateFrom = useCallback((source: PokemonRecord[], nextFilters: GeneratorFilters, requestedSeed?: string, save = true, current: GeneratedPokemon[] = []) => {
    setLoading(true);
    setError("");
    window.setTimeout(() => {
      try {
        if (!source.length) throw new Error("Pokémon data is still loading. Please try again in a moment.");
        if (nextFilters.minBst > nextFilters.maxBst) throw new Error("Minimum BST cannot be greater than maximum BST.");
        const generationRegionConflict = generationRegionConflictMessage(nextFilters);
        if (generationRegionConflict) throw new Error(generationRegionConflict);
        const nextPool = filterPokemon(source, nextFilters);
        if (!nextPool.length && current.filter((entry) => entry.locked).length < nextFilters.count) throw new Error("No Pokémon match these filters. Try selecting more generations or removing some restrictions.");
        const nextSeed = requestedSeed?.trim().toUpperCase() || makeSeed();
        if (!isValidSeed(nextSeed)) throw new Error("Use a seed with 3–32 letters, numbers, or hyphens.");
        const generated = generateWithLocks(current, nextPool, nextFilters, nextSeed);
        const nextResults = defaultShiny ? generated.map((entry) => entry.locked ? entry : ({ ...entry, shiny: true })) : generated;
        setSeed(nextSeed);
        setSeedInput(nextSeed);
        setResults(nextResults);
        setHighlightedWeakness(null);
        setFilters(nextFilters);
        setAppliedFilters(nextFilters);
        setFiltersOpen(false);
        setRemovedTeam(null);
        setActiveSavedKey(null);
        clearUrlState();
        if (save) addRecent(nextSeed, nextFilters, nextResults);
      } catch (generationError) {
        setError(generationError instanceof Error ? generationError.message : "Something went wrong while generating Pokémon.");
      } finally {
        setLoading(false);
      }
    }, 120);
  }, [addRecent, clearUrlState, defaultShiny]);

  const runGeneration = useCallback((nextFilters = filters, requestedSeed?: string, save = true) => {
    generateFrom(dataset, nextFilters, requestedSeed, save, results);
  }, [dataset, filters, generateFrom, results]);

  useEffect(() => {
    let cancelled = false;
    fetch("/data/pokemon.json")
      .then((response) => {
        if (!response.ok) throw new Error(`Data request returned ${response.status}`);
        return response.json() as Promise<PokemonRecord[]>;
      })
      .then((loaded) => {
        if (cancelled) return;
        if (!Array.isArray(loaded) || loaded.length < 1000) throw new Error("The local Pokémon data file is incomplete.");
        setDataset(loaded);
        setLoadingData(false);
        setRecent(savedForPage(storage.recent(), pageMode));
        setFavorites(savedForPage(storage.favorites(), pageMode));
        let search = window.location.search;
        if (!search) {
          try { search = localStorage.getItem(`pokemon-generator-draft:${window.location.pathname}`) ?? ""; } catch { /* The generator also works without browser storage. */ }
        }
        const parsed = readUrlState(search, initialFilters);
        if (search) setActiveQuickMode(null);
        const restored = parsed.ids.map((slug) => loaded.find((entry) => entry.slug === slug)).filter(Boolean) as PokemonRecord[];
        const anchorPokemon = parsed.anchor ? loaded.find((entry) => entry.slug === parsed.anchor && entry.isDefaultForm) : undefined;
        if (parsed.anchor && !anchorPokemon) {
          setError("The Pokémon in this team-building link could not be found. Generate a fresh team instead.");
        } else if (anchorPokemon) {
          const nextSeed = parsed.seed && isValidSeed(parsed.seed) ? parsed.seed.toUpperCase() : `AROUND-${anchorPokemon.id}`;
          const anchor = { ...hydratePokemon([anchorPokemon], nextSeed)[0], locked: true };
          const nextFilters = { ...parsed.filters, count: Math.max(2, parsed.filters.count), teamMode: "smart" as const };
          const nextPool = filterPokemon(loaded, nextFilters);
          const companions = generatePokemon(nextPool, nextFilters, nextSeed, [anchor]);
          setFilters(nextFilters);
          setAppliedFilters(nextFilters);
          setSeed(nextSeed);
          setSeedInput(nextSeed);
          setResults([anchor, ...companions]);
          setActiveQuickMode(null);
        } else if (parsed.ids.length && restored.length !== parsed.ids.length) {
          setFilters(parsed.filters);
          setSeedInput(parsed.seed && isValidSeed(parsed.seed) ? parsed.seed.toUpperCase() : "");
          setError("This share link is incomplete or out of date. Review the filters, then generate a fresh result.");
        } else if (parsed.seed && isValidSeed(parsed.seed) && restored.length) {
          const hydrated = hydratePokemon(restored, parsed.seed, parsed.members);
          setFilters({ ...parsed.filters, count: hydrated.length });
          setAppliedFilters({ ...parsed.filters, count: hydrated.length });
          setSeed(parsed.seed.toUpperCase());
          setSeedInput(parsed.seed.toUpperCase());
          setResults(hydrated);
        } else if (!initialResults.length || window.location.search) {
          generateFrom(loaded, parsed.filters, parsed.seed && isValidSeed(parsed.seed) ? parsed.seed : undefined, false);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setLoadingData(false);
        setError("Pokémon data could not be loaded. Refresh the page or try again in a moment.");
      });
    return () => {
      cancelled = true;
    };
  }, [generateFrom, initialFilters, initialResults.length, pageMode]);

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  useEffect(() => {
    if (loadingData || !dataset.length) return;
    try {
      const key = `pokemon-generator-draft:${window.location.pathname}`;
      if (!results.length) localStorage.removeItem(key);
      else localStorage.setItem(key, new URL(createShareUrl(seed, { ...appliedFilters, count: results.length }, results)).search);
    } catch { /* Explicit Save reports a storage error when persistence is required. */ }
  }, [loadingData, dataset.length, results, seed, appliedFilters]);

  const mutateResults = (next: GeneratedPokemon[], nextSeed = seed) => {
    setResults(next);
    setFilters((value) => ({ ...value, count: Math.max(1, next.length) }));
    setAppliedFilters((value) => ({ ...value, count: Math.max(1, next.length) }));
    setSeed(nextSeed);
    setSeedInput(nextSeed);
    setActiveSavedKey(null);
    clearUrlState();
  };

  const onSingleReroll = (index: number) => {
    try {
      const nextSeed = makeSeed();
      const next = rerollAt(results, index, resultPool, appliedFilters, nextSeed);
      if (defaultShiny) next[index] = { ...next[index], shiny: true };
      mutateResults(next, nextSeed);
      setHighlightedWeakness(null);
      addRecent(nextSeed, { ...appliedFilters, count: next.length }, next);
    } catch (rerollError) {
      setError(rerollError instanceof Error ? rerollError.message : "This slot could not be rerolled.");
    }
  };

  const addRandom = () => {
    if (results.length >= 6) return;
    try {
      const occupied = new Set(results.map((entry) => entry.pokemon.slug));
      const available = appliedFilters.allowDuplicates ? resultPool : resultPool.filter((entry) => !occupied.has(entry.slug));
      if (!available.length) throw new Error("No additional unique Pokémon match these filters.");
      const nextSeed = makeSeed();
      const generated = generatePokemon(available, { ...appliedFilters, count: 1, teamMode: "random" }, nextSeed);
      const added = defaultShiny ? generated.map((entry) => ({ ...entry, shiny: true })) : generated;
      const next = [...results, ...added];
      mutateResults(next, nextSeed);
      setHighlightedWeakness(null);
      addRecent(nextSeed, { ...appliedFilters, count: next.length }, next);
    } catch (addError) {
      setError(addError instanceof Error ? addError.message : "A Pokémon could not be added.");
    }
  };

  const rerollWeakness = (type: PokemonType) => {
    const affected = results.flatMap((entry, index) => !entry.locked && calculateDefensiveMultiplier(entry.pokemon.types, type) > 1 ? [index] : []);
    if (!affected.length) return setError(`No unlocked team members are weak to ${displayToken(type)}.`);
    try {
      const nextSeed = makeSeed();
      const next = affected.reduce((team, index) => rerollAt(team, index, resultPool, appliedFilters, `${nextSeed}-${index}`), results);
      if (defaultShiny) affected.forEach((index) => { next[index] = { ...next[index], shiny: true }; });
      mutateResults(next, nextSeed);
      addRecent(nextSeed, { ...appliedFilters, count: next.length }, next);
      setHighlightedWeakness(null);
      showToast(`${affected.length} weak slot${affected.length > 1 ? "s" : ""} rerolled.`);
    } catch (rerollError) {
      setError(rerollError instanceof Error ? rerollError.message : "The highlighted slots could not be rerolled.");
    }
  };

  const copyText = async (value: string, success: string) => {
    try {
      await navigator.clipboard.writeText(value);
      showToast(success);
    } catch {
      setError("Clipboard access is unavailable in this browser. You can still select and copy the text manually.");
    }
  };

  const shareResults = async () => {
    const url = createShareUrl(seed, { ...appliedFilters, count: results.length }, results);
    if (navigator.share) {
      try {
        await navigator.share({
          title: results.length > 1 ? "My Random Pokémon Team" : "My Random Pokémon Pick",
          text: teamText(results, seed, appliedFilters),
          url,
        });
        showToast("Share sheet opened.");
        return;
      } catch (shareError) {
        if (shareError instanceof DOMException && shareError.name === "AbortError") return;
      }
    }
    await copyText(url, "Share link copied.");
  };

  const saveFavorite = () => {
    if (!results.length) return;
    const item: FavoriteTeam = {
      id: `${seed}-${Date.now()}`,
      name: favoriteName.trim() || undefined,
      seed,
      pokemonIds: results.map((entry) => entry.pokemon.slug),
      members: snapshotResults(results),
      createdAt: new Date().toISOString(),
      pageMode,
      filters: { ...appliedFilters, count: results.length },
    };
    const saved = storage.saveFavorite(item);
    if (!saved) return setError("Favorite teams could not be saved because browser storage is unavailable.");
    setFavorites(savedForPage(saved, pageMode));
    setFavoriteName("");
    setSaveOpen(false);
    showToast(`${pageMode === "starter" ? "Starter" : results.length > 1 ? "Team" : "Pokémon"} saved to favorites.`);
  };

  const restoreSaved = (item: SavedGeneration, source: SavedSource) => {
    const storedMode = item.pageMode ?? "standard";
    if (storedMode !== pageMode && !(pageMode === "standard" && storedMode === "team")) return setError("Open this saved roll from the page where it was created.");
    const restored = item.pokemonIds.map((slug) => dataset.find((entry) => entry.slug === slug)).filter(Boolean) as PokemonRecord[];
    if (!restored.length || restored.length !== item.pokemonIds.length) return setError("This saved roll is incomplete with the current data version and was not restored.");
    const hydrated = hydratePokemon(restored, item.seed, item.members);
    setFilters({ ...item.filters, count: hydrated.length });
    setAppliedFilters({ ...item.filters, count: hydrated.length });
    setSeed(item.seed);
    setSeedInput(item.seed);
    setResults(hydrated);
    setHighlightedWeakness(null);
    setActiveSavedKey(`${source}:${item.id}`);
    clearUrlState();
    window.scrollTo({ top: document.getElementById("generator-results")?.offsetTop ?? 0, behavior: "smooth" });
    showToast(`${savedGenerationName(item)} restored.`);
  };

  const resetFilters = () => {
    setFilters(cloneFilters(initialFilters));
    setSeedInput("");
    setActiveQuickMode(initialQuickMode);
    setActiveSavedKey(null);
    setError("");
    showToast("Filters reset to page defaults.");
  };

  const deleteSaved = (item: SavedGeneration, source: SavedSource) => {
    const key = `${source}:${item.id}`;
    const wasActive = activeSavedKey === key;
    if (source === "recent") setRecent(savedForPage(storage.removeRecent(item.id), pageMode));
    else setFavorites(savedForPage(storage.removeFavorite(item.id), pageMode));
    if (wasActive) setActiveSavedKey(null);
    setDeletedSaved({ item, source, wasActive });
    showToast("Saved roll deleted.", true);
  };

  const undoSavedDelete = () => {
    if (!deletedSaved) return;
    const { item, source, wasActive } = deletedSaved;
    if (source === "recent") {
      const saved = storage.saveRecent(item);
      if (saved) setRecent(savedForPage(saved, pageMode));
    } else {
      const saved = storage.saveFavorite(item as FavoriteTeam);
      if (saved) setFavorites(savedForPage(saved, pageMode));
    }
    if (wasActive) setActiveSavedKey(`${source}:${item.id}`);
    showToast("Deletion undone.");
  };

  const quickSelect = (mode: QuickMode, transform: (current: GeneratorFilters) => GeneratorFilters) => {
    setActiveQuickMode(mode);
    setFilters((current) => transform(current));
    setActiveSavedKey(null);
    setError("");
  };

  return (
    <section className={`generator-shell${pageMode === "starter" ? " starter-generator-shell" : ""}`} aria-label="Random Pokémon generator">
      <div className="instant-generator simple-generator-controls">
        <div className="generator-task-row">
          {pageMode !== "starter" && <div className="segmented task-switch" aria-label="Choose what to generate">
            <button aria-pressed={filters.count === 1} className={filters.count === 1 ? "selected" : ""} onClick={() => { setFilters({ ...filters, count: 1 }); setActiveQuickMode(null); }}>One Pokémon</button>
            <button aria-pressed={filters.count > 1} className={filters.count > 1 ? "selected" : ""} onClick={() => { setFilters({ ...filters, count: 6 }); setActiveQuickMode(null); }}>A team</button>
          </div>}
          <button className="secondary-button filter-disclosure" aria-expanded={filtersOpen} aria-controls="generator-options" onClick={() => setFiltersOpen(!filtersOpen)}>Filters{pendingFilters ? " · changed" : ""}</button>
          <button className="text-button" aria-expanded={libraryOpen} aria-controls="saved-rolls" onClick={() => { setLibraryOpen(!libraryOpen); setLibraryTab("favorites"); if (!libraryOpen) requestAnimationFrame(() => document.getElementById("saved-rolls")?.scrollIntoView({ behavior: "smooth", block: "start" })); }}>Saved ({favorites.length})</button>
        </div>
        {filtersOpen && <div id="generator-options" className="generator-options"><FilterControls
          filters={filters}
          onChange={(next) => { setFilters(next); setActiveQuickMode(null); setActiveSavedKey(null); setError(""); }}
          pageMode={pageMode}
          seedInput={seedInput}
          onSeedInputChange={(value) => { setSeedInput(value.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 32)); setActiveSavedKey(null); }}
          activeQuickMode={activeQuickMode}
          onQuickSelect={quickSelect}
        /><p className="filter-help">Choose your options, then generate to apply them. Locked Pokémon stay in your team.</p></div>}
        <div className="generator-primary-actions">
          {filtersOpen && <button type="button" className="reset-filters-button" onClick={resetFilters}>Reset filters</button>}
          <button
            className="generate-button primary-generate"
            onClick={() => runGeneration(filters, seedInput && seedInput !== seed ? seedInput : undefined)}
            disabled={loading || loadingData || Boolean(filterIssue) || (lockedCount === filters.count && results.length === filters.count)}
          >
            {loading
              ? "Generating…"
              : lockedCount ? `Keep ${lockedCount} · Reroll the rest`
              : filters.starterOnly
                ? "Pick Random Starter"
                : filters.count > 1
                  ? "Generate Team"
                  : "Generate Pokémon"}
          </button>
        </div>
        {pendingFilters && !filterIssue && <p className="filter-help" role="status">Options changed. Generate to update your result.</p>}
        {lockedCount > 0 && <p className="filter-help">{lockedCount} locked · {lockedCount === filters.count ? "Unlock a Pokémon to roll again." : "Kept even when filters change."}</p>}
        {filterIssue && (
          <div className="filter-feedback invalid" role="status" aria-live="polite">
            <span aria-hidden="true">!</span>
            <p>{filterIssue}</p>
          </div>
        )}
      </div>

      {error && <div className="inline-error generator-error" role="alert"><span aria-hidden="true">!</span><p>{error}</p><button onClick={() => setError("")} aria-label="Dismiss error">×</button></div>}

      {loadingData && results.length === 0 && (
        <div className="results-loading" role="status" aria-live="polite">
          <span className="loading-mark" aria-hidden="true">✦</span>
          <div><strong>Building your first team…</strong><p>Loading Generation 1–9 from the local Pokédex.</p></div>
        </div>
      )}

      {removedTeam && <div className="removed-notice" role="status">Pokémon removed. <button onClick={() => { mutateResults(removedTeam); setRemovedTeam(null); }}>Undo</button></div>}
      {(
        <div id="generator-results" className={`results-section${pageMode === "starter" ? " starter-results" : ""}`} aria-busy={loading}>
          <p key={seed} className="sr-only" role="status" aria-live="polite">Generated {results.length} Pokémon with seed {seed}.</p>
          <div className="result-summary"><h2>{results.length === 1 ? "Your Pokémon" : `Your team · ${results.length}/6`}</h2><span>{appliedFilters.teamMode === "smart" && results.length > 1 ? "Smart Team" : "Pure Random"}</span></div>
          <div className={`pokemon-grid${pageMode === "starter" ? " starter-result-grid" : ""}`}>
            {results.map((result, index) => (
              <PokemonCard
                key={`${result.pokemon.slug}-${index}`}
                result={result}
                index={index}
                busy={loading || loadingData}
                onLock={() => mutateResults(results.map((entry, slot) => slot === index ? { ...entry, locked: !entry.locked } : entry))}
                onReroll={() => onSingleReroll(index)}
                onShiny={() => mutateResults(results.map((entry, slot) => slot === index ? { ...entry, shiny: !entry.shiny } : entry))}
                onRemove={() => { setRemovedTeam(results); mutateResults(results.filter((_, slot) => slot !== index)); }}
                highlighted={highlightedWeakness ? calculateDefensiveMultiplier(result.pokemon.types, highlightedWeakness) > 1 : false}
              />
            ))}
          </div>
          {results.length > 0 && <div className="result-utilities">
            <button className="secondary-button" onClick={() => setSaveOpen(!saveOpen)} aria-expanded={saveOpen}>Save {results.length > 1 ? "team" : "pick"}</button>
            <button className="secondary-button" onClick={shareResults}>Share</button>
            <Link className="secondary-button" href={`/team-planner?team=${results.map((entry) => entry.pokemon.slug).join(",")}`}>Edit team</Link>
            {pageMode !== "starter" && results.length < 6 && <button className="text-button" onClick={addRandom} disabled={loadingData}>Add Pokémon</button>}
            <button className="text-button" onClick={() => copyText(teamText(results, seed, appliedFilters), "Copied to clipboard.")}>Copy text</button>
          </div>}
          {saveOpen && results.length > 0 && <form className="favorite-save" onSubmit={(event) => { event.preventDefault(); saveFavorite(); }}><label>Team name (optional)<input value={favoriteName} onChange={(event) => setFavoriteName(event.target.value.slice(0, 40))} placeholder="My next adventure" /></label><button type="submit">Save to favorites</button></form>}
          {results.length > 1 && <details className="analysis-disclosure"><summary>Team strengths &amp; weaknesses</summary><TeamAnalysis team={results} selectedWeakness={highlightedWeakness} onSelectWeakness={setHighlightedWeakness} onRerollWeakness={rerollWeakness} /></details>}
          <div id="saved-rolls" className="library" hidden={!libraryOpen}>
            <div className="library-header">
              <div><h2>Your saved rolls</h2><p>Stored only in this browser.</p></div>
              <div className="mini-segmented" role="tablist" aria-label="Saved roll type">
                <button role="tab" aria-selected={libraryTab === "recent"} className={libraryTab === "recent" ? "selected" : ""} onClick={() => setLibraryTab("recent")}>Recent ({recent.length})</button>
                <button role="tab" aria-selected={libraryTab === "favorites"} className={libraryTab === "favorites" ? "selected" : ""} onClick={() => setLibraryTab("favorites")}>Favorites ({favorites.length})</button>
              </div>
            </div>
            <div className="saved-list" role="tabpanel">
              {(libraryTab === "recent" ? recent : favorites).length ? (libraryTab === "recent" ? recent : favorites).map((item) => {
                const savedKey = `${libraryTab}:${item.id}`;
                const isLoaded = activeSavedKey === savedKey;
                return (
                  <div className={isLoaded ? "saved-item loaded" : "saved-item"} key={item.id} aria-current={isLoaded ? "true" : undefined}>
                    <div className="saved-item-copy">
                      <div className="saved-item-title"><strong>{savedGenerationName(item)}</strong>{isLoaded && <span className="loaded-badge">Currently loaded</span>}</div>
                      <span>{new Date(item.createdAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                      <small>{savedFilterSummary(item)}</small>
                      <small className="saved-preview">{savedPokemonPreview(item, dataset)}</small>
                    </div>
                    <div>
                      <button onClick={() => restoreSaved(item, libraryTab)} disabled={isLoaded}>{isLoaded ? "Loaded" : "Restore"}</button>
                      <button aria-label={`Delete saved roll ${item.seed}`} onClick={() => deleteSaved(item, libraryTab)}>Delete</button>
                    </div>
                  </div>
                );
              }) : <p className="empty-saved">No {libraryTab} saved yet.</p>}
            </div>
            {libraryTab === "recent" && recent.length > 0 && (
              confirmClearRecent ? (
                <div className="clear-history-confirm" role="group" aria-label="Confirm clearing recent generations">
                  <span>Clear all recent rolls?</span>
                  <button className="text-button" onClick={() => setConfirmClearRecent(false)}>Cancel</button>
                  <button className="text-button danger" onClick={() => { storage.clearRecent(pageMode); setRecent([]); setConfirmClearRecent(false); if (activeSavedKey?.startsWith("recent:")) setActiveSavedKey(null); showToast("Generation history cleared."); }}>Clear all</button>
                </div>
              ) : <button className="text-button danger" onClick={() => setConfirmClearRecent(true)}>Clear generation history</button>
            )}
          </div>
        </div>
      )}

      <div className={`toast ${toast ? "show" : ""}`} role="status" aria-live="polite">
        <span className="toast-message">{toast}</span>
        {deletedSaved && <button type="button" onClick={undoSavedDelete}>Undo</button>}
        {!deletedSaved && <span className="toast-check" aria-hidden="true">✓</span>}
      </div>
    </section>
  );
}
