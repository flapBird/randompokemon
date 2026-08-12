"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NATURES } from "@/data/natures";
import { calculateDefensiveMultiplier } from "@/data/type-chart";
import { filterPokemon, generationRegionConflictMessage } from "@/lib/filters";
import { generatePokemon, rerollAt, rerollUnlocked } from "@/lib/random";
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
  const filterIssue = useMemo(() => {
    if (loadingData || !dataset.length) return "";
    if (filters.minBst < 100 || filters.maxBst > 800) return "Base stat totals must stay between 100 and 800.";
    if (filters.minBst > filters.maxBst) return "Minimum BST cannot be greater than maximum BST.";
    const conflict = generationRegionConflictMessage(filters);
    if (conflict) return conflict;
    if (!pool.length) return "No Pokémon match these filters. Remove a restriction or reset the filters.";
    if (!filters.allowDuplicates && pool.length < filters.count) return `Only ${pool.length} unique Pokémon match. Reduce the team size or allow duplicates.`;
    return "";
  }, [dataset.length, filters, loadingData, pool.length]);

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

  const generateFrom = useCallback((source: PokemonRecord[], nextFilters: GeneratorFilters, requestedSeed?: string, save = true) => {
    setLoading(true);
    setError("");
    window.setTimeout(() => {
      try {
        if (!source.length) throw new Error("Pokémon data is still loading. Please try again in a moment.");
        if (nextFilters.minBst > nextFilters.maxBst) throw new Error("Minimum BST cannot be greater than maximum BST.");
        const generationRegionConflict = generationRegionConflictMessage(nextFilters);
        if (generationRegionConflict) throw new Error(generationRegionConflict);
        const nextPool = filterPokemon(source, nextFilters);
        if (!nextPool.length) throw new Error("No Pokémon match these filters. Try selecting more generations or removing some restrictions.");
        const nextSeed = requestedSeed?.trim().toUpperCase() || makeSeed();
        if (!isValidSeed(nextSeed)) throw new Error("Use a seed with 3–32 letters, numbers, or hyphens.");
        const generated = generatePokemon(nextPool, nextFilters, nextSeed);
        const nextResults = defaultShiny ? generated.map((entry) => ({ ...entry, shiny: true })) : generated;
        setSeed(nextSeed);
        setSeedInput(nextSeed);
        setResults(nextResults);
        setHighlightedWeakness(null);
        setFilters(nextFilters);
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
    generateFrom(dataset, nextFilters, requestedSeed, save);
  }, [dataset, filters, generateFrom]);

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
        const parsed = readUrlState(window.location.search, initialFilters);
        if (window.location.search) setActiveQuickMode(null);
        const restored = parsed.ids.map((slug) => loaded.find((entry) => entry.slug === slug)).filter(Boolean) as PokemonRecord[];
        if (parsed.ids.length && restored.length !== parsed.ids.length) {
          setFilters(parsed.filters);
          setSeedInput(parsed.seed && isValidSeed(parsed.seed) ? parsed.seed.toUpperCase() : "");
          setError("This share link is incomplete or out of date. Review the filters, then generate a fresh result.");
        } else if (parsed.seed && isValidSeed(parsed.seed) && restored.length) {
          const hydrated = hydratePokemon(restored, parsed.seed, parsed.members);
          setFilters({ ...parsed.filters, count: hydrated.length });
          setSeed(parsed.seed.toUpperCase());
          setSeedInput(parsed.seed.toUpperCase());
          setResults(hydrated);
        } else if (!initialResults.length) {
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

  const mutateResults = (next: GeneratedPokemon[], nextSeed = seed) => {
    setResults(next);
    setSeed(nextSeed);
    setSeedInput(nextSeed);
    setActiveSavedKey(null);
    clearUrlState();
  };

  const onSingleReroll = (index: number) => {
    try {
      const nextSeed = makeSeed();
      const next = rerollAt(results, index, pool, filters, nextSeed);
      if (defaultShiny) next[index] = { ...next[index], shiny: true };
      mutateResults(next, nextSeed);
      setHighlightedWeakness(null);
      addRecent(nextSeed, { ...filters, count: next.length }, next);
    } catch (rerollError) {
      setError(rerollError instanceof Error ? rerollError.message : "This slot could not be rerolled.");
    }
  };

  const onRerollUnlocked = () => {
    if (results.every((entry) => entry.locked)) return;
    try {
      const nextSeed = makeSeed();
      const next = rerollUnlocked(results, pool, { ...filters, count: results.length }, nextSeed);
      if (defaultShiny) {
        next.forEach((entry, index) => {
          if (!results[index].locked) next[index] = { ...entry, shiny: true };
        });
      }
      mutateResults(next, nextSeed);
      setHighlightedWeakness(null);
      addRecent(nextSeed, { ...filters, count: next.length }, next);
    } catch (rerollError) {
      setError(rerollError instanceof Error ? rerollError.message : "The unlocked slots could not be rerolled.");
    }
  };

  const addRandom = () => {
    if (results.length >= 6) return;
    try {
      const occupied = new Set(results.map((entry) => entry.pokemon.slug));
      const available = filters.allowDuplicates ? pool : pool.filter((entry) => !occupied.has(entry.slug));
      if (!available.length) throw new Error("No additional unique Pokémon match these filters.");
      const nextSeed = makeSeed();
      const generated = generatePokemon(available, { ...filters, count: 1, teamMode: "random" }, nextSeed);
      const added = defaultShiny ? generated.map((entry) => ({ ...entry, shiny: true })) : generated;
      const next = [...results, ...added];
      mutateResults(next, nextSeed);
      setHighlightedWeakness(null);
      addRecent(nextSeed, { ...filters, count: next.length }, next);
    } catch (addError) {
      setError(addError instanceof Error ? addError.message : "A Pokémon could not be added.");
    }
  };

  const rerollWeakness = (type: PokemonType) => {
    const affected = results.flatMap((entry, index) => !entry.locked && calculateDefensiveMultiplier(entry.pokemon.types, type) > 1 ? [index] : []);
    if (!affected.length) return setError(`No unlocked team members are weak to ${displayToken(type)}.`);
    try {
      const nextSeed = makeSeed();
      const next = affected.reduce((team, index) => rerollAt(team, index, pool, filters, `${nextSeed}-${index}`), results);
      if (defaultShiny) affected.forEach((index) => { next[index] = { ...next[index], shiny: true }; });
      mutateResults(next, nextSeed);
      addRecent(nextSeed, { ...filters, count: next.length }, next);
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
    const url = createShareUrl(seed, { ...filters, count: results.length }, results);
    if (navigator.share) {
      try {
        await navigator.share({
          title: results.length > 1 ? "My Random Pokémon Team" : "My Random Pokémon Pick",
          text: teamText(results, seed, filters),
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
      filters: { ...filters, count: results.length },
    };
    const saved = storage.saveFavorite(item);
    if (!saved) return setError("Favorite teams could not be saved because browser storage is unavailable.");
    setFavorites(savedForPage(saved, pageMode));
    setFavoriteName("");
    showToast(`${pageMode === "starter" ? "Starter" : results.length > 1 ? "Team" : "Pokémon"} saved to favorites.`);
  };

  const restoreSaved = (item: SavedGeneration, source: SavedSource) => {
    const storedMode = item.pageMode ?? "standard";
    if (storedMode !== pageMode && !(pageMode === "standard" && storedMode === "team")) return setError("Open this saved roll from the page where it was created.");
    const restored = item.pokemonIds.map((slug) => dataset.find((entry) => entry.slug === slug)).filter(Boolean) as PokemonRecord[];
    if (!restored.length || restored.length !== item.pokemonIds.length) return setError("This saved roll is incomplete with the current data version and was not restored.");
    const hydrated = hydratePokemon(restored, item.seed, item.members);
    setFilters({ ...item.filters, count: hydrated.length });
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
      <div className="instant-generator">
        <FilterControls
          filters={filters}
          onChange={(next) => { setFilters(next); setActiveQuickMode(null); setActiveSavedKey(null); setError(""); }}
          pageMode={pageMode}
          seedInput={seedInput}
          onSeedInputChange={(value) => { setSeedInput(value.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 32)); setActiveSavedKey(null); }}
          activeQuickMode={activeQuickMode}
          onQuickSelect={quickSelect}
        />
        <div className="generator-primary-actions">
          <button type="button" className="reset-filters-button" onClick={resetFilters}>Reset</button>
          <button
            className="generate-button primary-generate"
            onClick={() => runGeneration(filters, seedInput && seedInput !== seed ? seedInput : undefined)}
            disabled={loading || loadingData || Boolean(filterIssue)}
          >
            {loading
              ? "Generating…"
              : filters.starterOnly
                ? "Pick Random Starter"
                : filters.count > 1
                  ? "Generate Team"
                  : "Generate Pokémon"}
          </button>
        </div>
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

      {results.length > 0 && (
        <div id="generator-results" className={`results-section${pageMode === "starter" ? " starter-results" : ""}`} aria-busy={loading}>
          <p key={seed} className="sr-only" role="status" aria-live="polite">Generated {results.length} Pokémon with seed {seed}.</p>
          <div className="results-actions">
            <div className="generator-toolbar" aria-label="Result actions">
              <button onClick={onRerollUnlocked} disabled={results.every((entry) => entry.locked)}><span aria-hidden="true">↻</span>{results.length > 1 ? "Reroll Unlocked" : "Reroll"}</button>
              {pageMode !== "starter" && results.length < 6 && <button onClick={addRandom}><span aria-hidden="true">＋</span>Add Pokémon</button>}
              <button onClick={() => copyText(teamText(results, seed, filters), `${results.length > 1 ? "Team" : "Pokémon"} copied to clipboard.`)}><span aria-hidden="true">▣</span>Copy {results.length > 1 ? "Team" : "Pick"}</button>
              <button onClick={shareResults}><span aria-hidden="true">↗</span>Share</button>
            </div>
            <div className="favorite-save">
              <label>Favorite name <input value={favoriteName} onChange={(event) => setFavoriteName(event.target.value.slice(0, 40))} placeholder="Optional name" /></label>
              <button onClick={saveFavorite}>♡ Save {pageMode === "starter" ? "Starter" : results.length > 1 ? "Team" : "Pokémon"}</button>
            </div>
          </div>
          <div className={`pokemon-grid${pageMode === "starter" ? " starter-result-grid" : ""}`}>
            {results.map((result, index) => (
              <PokemonCard
                key={`${result.pokemon.slug}-${index}`}
                result={result}
                index={index}
                onLock={() => mutateResults(results.map((entry, slot) => slot === index ? { ...entry, locked: !entry.locked } : entry))}
                onReroll={() => onSingleReroll(index)}
                onShiny={() => mutateResults(results.map((entry, slot) => slot === index ? { ...entry, shiny: !entry.shiny } : entry))}
                onRemove={() => mutateResults(results.filter((_, slot) => slot !== index))}
                highlighted={highlightedWeakness ? calculateDefensiveMultiplier(result.pokemon.types, highlightedWeakness) > 1 : false}
              />
            ))}
          </div>
          {results.length > 1 && <TeamAnalysis team={results} selectedWeakness={highlightedWeakness} onSelectWeakness={setHighlightedWeakness} onRerollWeakness={rerollWeakness} />}
          <div className="library">
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
