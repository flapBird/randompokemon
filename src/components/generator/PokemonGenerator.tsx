"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NATURES } from "@/data/natures";
import { filterPokemon } from "@/lib/filters";
import { generatePokemon, rerollAt, rerollUnlocked } from "@/lib/random";
import { createReadableSeed, createSeededRandom, isValidSeed, pickOne, randomInt } from "@/lib/seeded-random";
import { storage } from "@/lib/storage";
import { createShareUrl, readUrlState } from "@/lib/url-state";
import type { FavoriteTeam, GeneratedPokemon, GeneratorFilters, SavedGeneration } from "@/types/generator";
import type { PokemonRecord } from "@/types/pokemon";
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

function hydratePokemon(entries: PokemonRecord[], seed: string): GeneratedPokemon[] {
  const random = createSeededRandom(`${seed}-RESTORE`);
  return entries.map((pokemon) => ({
    pokemon,
    ability: pickOne(pokemon.abilities.length ? pokemon.abilities : ["Unknown"], random),
    nature: NATURES[randomInt(random, NATURES.length)],
    locked: false,
    shiny: false,
  }));
}

function teamText(results: GeneratedPokemon[]) {
  return [
    `My Random Pokémon ${results.length > 1 ? "Team" : "Pick"}`,
    "",
    ...results.map(({ pokemon }, index) => `${index + 1}. ${pokemon.name} — ${pokemon.types.map((type) => type[0].toUpperCase() + type.slice(1)).join(" / ")}`),
    "",
    "Generated at randompokemon.xyz",
  ].join("\n");
}

function savedGenerationName(item: SavedGeneration) {
  return "name" in item && typeof item.name === "string" && item.name.trim()
    ? item.name
    : item.seed;
}

export function PokemonGenerator({
  initialFilters,
  pageMode = "standard",
}: {
  initialFilters: GeneratorFilters;
  pageMode?: "standard" | "team" | "starter";
}) {
  const [filters, setFilters] = useState(initialFilters);
  const [dataset, setDataset] = useState<PokemonRecord[]>([]);
  const [results, setResults] = useState<GeneratedPokemon[]>([]);
  const [seed, setSeed] = useState("");
  const [seedInput, setSeedInput] = useState("");
  const [activeQuickMode, setActiveQuickMode] = useState<QuickMode | null>(pageMode === "team" ? "team" : pageMode === "starter" ? "starter" : null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [recent, setRecent] = useState<SavedGeneration[]>([]);
  const [favorites, setFavorites] = useState<FavoriteTeam[]>([]);
  const [libraryTab, setLibraryTab] = useState<"recent" | "favorites">("recent");
  const [favoriteName, setFavoriteName] = useState("");
  const initialized = useRef(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pool = useMemo(() => filterPokemon(dataset, filters), [dataset, filters]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2800);
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
      createdAt: new Date().toISOString(),
      pageMode,
      filters: { ...nextFilters, count: nextResults.length },
    };
    const saved = storage.saveRecent(item);
    if (saved) setRecent(saved);
  }, [pageMode]);

  const generateFrom = useCallback((source: PokemonRecord[], nextFilters: GeneratorFilters, requestedSeed?: string, save = true) => {
    setLoading(true);
    setError("");
    window.setTimeout(() => {
      try {
        if (!source.length) throw new Error("Pokémon data is still loading. Please try again in a moment.");
        if (nextFilters.minBst > nextFilters.maxBst) throw new Error("Minimum BST cannot be greater than maximum BST.");
        const nextPool = filterPokemon(source, nextFilters);
        if (!nextPool.length) throw new Error("No Pokémon match these filters. Try selecting more generations or removing some restrictions.");
        const nextSeed = requestedSeed?.trim().toUpperCase() || makeSeed();
        if (!isValidSeed(nextSeed)) throw new Error("Use a seed with 3–32 letters, numbers, or hyphens.");
        const nextResults = generatePokemon(nextPool, nextFilters, nextSeed);
        setSeed(nextSeed);
        setSeedInput(nextSeed);
        setResults(nextResults);
        setFilters(nextFilters);
        clearUrlState();
        if (save) addRecent(nextSeed, nextFilters, nextResults);
      } catch (generationError) {
        setError(generationError instanceof Error ? generationError.message : "Something went wrong while generating Pokémon.");
      } finally {
        setLoading(false);
      }
    }, 120);
  }, [addRecent, clearUrlState]);

  const runGeneration = useCallback((nextFilters = filters, requestedSeed?: string, save = true) => {
    generateFrom(dataset, nextFilters, requestedSeed, save);
  }, [dataset, filters, generateFrom]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
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
        setRecent(storage.recent());
        setFavorites(storage.favorites());
        const parsed = readUrlState(window.location.search, initialFilters);
        const restored = parsed.ids.map((slug) => loaded.find((entry) => entry.slug === slug)).filter(Boolean) as PokemonRecord[];
        if (parsed.seed && isValidSeed(parsed.seed) && restored.length) {
          const hydrated = hydratePokemon(restored, parsed.seed);
          setFilters({ ...parsed.filters, count: hydrated.length });
          setSeed(parsed.seed.toUpperCase());
          setSeedInput(parsed.seed.toUpperCase());
          setResults(hydrated);
        } else {
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
  }, [generateFrom, initialFilters]);

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  const mutateResults = (next: GeneratedPokemon[], nextSeed = seed) => {
    setResults(next);
    setSeed(nextSeed);
    setSeedInput(nextSeed);
    clearUrlState();
  };

  const onSingleReroll = (index: number) => {
    try {
      const nextSeed = makeSeed();
      mutateResults(rerollAt(results, index, pool, filters, nextSeed), nextSeed);
    } catch (rerollError) {
      setError(rerollError instanceof Error ? rerollError.message : "This slot could not be rerolled.");
    }
  };

  const onRerollUnlocked = () => {
    if (results.every((entry) => entry.locked)) return;
    try {
      const nextSeed = makeSeed();
      mutateResults(rerollUnlocked(results, pool, { ...filters, count: results.length }, nextSeed), nextSeed);
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
      const added = generatePokemon(available, { ...filters, count: 1, teamMode: "random" }, nextSeed);
      mutateResults([...results, ...added], nextSeed);
    } catch (addError) {
      setError(addError instanceof Error ? addError.message : "A Pokémon could not be added.");
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

  const saveFavorite = () => {
    if (!results.length) return;
    const item: FavoriteTeam = {
      id: `${seed}-${Date.now()}`,
      name: favoriteName.trim() || undefined,
      seed,
      pokemonIds: results.map((entry) => entry.pokemon.slug),
      createdAt: new Date().toISOString(),
      pageMode,
      filters: { ...filters, count: results.length },
    };
    const saved = storage.saveFavorite(item);
    if (!saved) return setError("Favorite teams could not be saved because browser storage is unavailable.");
    setFavorites(saved);
    setFavoriteName("");
    showToast("Team saved to favorites.");
  };

  const restoreSaved = (item: SavedGeneration) => {
    const restored = item.pokemonIds.map((slug) => dataset.find((entry) => entry.slug === slug)).filter(Boolean) as PokemonRecord[];
    if (!restored.length) return setError("This saved team could not be restored with the current data version.");
    const hydrated = hydratePokemon(restored, item.seed);
    setFilters({ ...item.filters, count: hydrated.length });
    setSeed(item.seed);
    setSeedInput(item.seed);
    setResults(hydrated);
    clearUrlState();
    window.scrollTo({ top: document.getElementById("generator-results")?.offsetTop ?? 0, behavior: "smooth" });
    showToast("Saved generation restored.");
  };

  const quickSelect = (mode: QuickMode, transform: (current: GeneratorFilters) => GeneratorFilters) => {
    setActiveQuickMode(mode);
    setFilters((current) => transform(current));
    setError("");
  };

  return (
    <section className="generator-shell" aria-label="Random Pokémon generator">
      <div className="instant-generator">
        <FilterControls
          filters={filters}
          onChange={(next) => { setFilters(next); setActiveQuickMode(null); setError(""); }}
          pageMode={pageMode}
          seedInput={seedInput}
          onSeedInputChange={(value) => setSeedInput(value.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 32))}
          activeQuickMode={activeQuickMode}
          onQuickSelect={quickSelect}
        />
        <button
          className="generate-button primary-generate"
          onClick={() => runGeneration(filters, seedInput && seedInput !== seed ? seedInput : undefined)}
          disabled={loading || loadingData}
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

      {error && <div className="inline-error generator-error" role="alert"><span aria-hidden="true">!</span><p>{error}</p><button onClick={() => setError("")} aria-label="Dismiss error">×</button></div>}

      {loadingData && (
        <div className="results-loading" role="status" aria-live="polite">
          <span className="loading-mark" aria-hidden="true">✦</span>
          <div><strong>Building your first team…</strong><p>Loading Generation 1–9 from the local Pokédex.</p></div>
        </div>
      )}

      {results.length > 0 && (
        <div id="generator-results" className="results-section">
          <h2 className="sr-only">{results.length > 1 ? "Your random Pokémon team" : "Your random Pokémon"}</h2>
          <div className="pokemon-grid">
            {results.map((result, index) => (
              <PokemonCard
                key={`${result.pokemon.slug}-${index}`}
                result={result}
                index={index}
                onLock={() => mutateResults(results.map((entry, slot) => slot === index ? { ...entry, locked: !entry.locked } : entry))}
                onReroll={() => onSingleReroll(index)}
                onShiny={() => mutateResults(results.map((entry, slot) => slot === index ? { ...entry, shiny: !entry.shiny } : entry))}
                onRemove={() => mutateResults(results.filter((_, slot) => slot !== index))}
              />
            ))}
          </div>
          <div className="generator-toolbar post-grid-toolbar" aria-label="Team actions">
            <button onClick={onRerollUnlocked} disabled={results.every((entry) => entry.locked)}><span aria-hidden="true">↻</span>Reroll Unlocked</button>
            {results.length < 6 && <button onClick={addRandom}><span aria-hidden="true">＋</span>Add Random Pokémon</button>}
            <button onClick={() => copyText(teamText(results), "Team copied to clipboard.")}><span aria-hidden="true">▣</span>Copy Team</button>
            <button onClick={() => copyText(createShareUrl(seed, { ...filters, count: results.length }, results.map((entry) => entry.pokemon.slug)), "Share link copied.")}><span aria-hidden="true">↗</span>Copy Share Link</button>
          </div>
          {results.length > 1 && <TeamAnalysis team={results} />}
          <div className="favorite-save">
            <label>Favorite name <input value={favoriteName} onChange={(event) => setFavoriteName(event.target.value.slice(0, 40))} placeholder="Optional team name" /></label>
            <button onClick={saveFavorite}>♡ Save Team</button>
          </div>
          <div className="library">
            <div className="library-header">
              <div><h2>Your saved rolls</h2><p>Stored only in this browser.</p></div>
              <div className="mini-segmented">
                <button className={libraryTab === "recent" ? "selected" : ""} onClick={() => setLibraryTab("recent")}>Recent ({recent.length})</button>
                <button className={libraryTab === "favorites" ? "selected" : ""} onClick={() => setLibraryTab("favorites")}>Favorites ({favorites.length})</button>
              </div>
            </div>
            <div className="saved-list">
              {(libraryTab === "recent" ? recent : favorites).length ? (libraryTab === "recent" ? recent : favorites).map((item) => (
                <div className="saved-item" key={item.id}>
                  <div><strong>{savedGenerationName(item)}</strong><span>{item.pokemonIds.length} Pokémon · {new Date(item.createdAt).toLocaleDateString()}</span></div>
                  <div><button onClick={() => restoreSaved(item)}>Restore</button><button aria-label={`Delete saved team ${item.seed}`} onClick={() => libraryTab === "recent" ? setRecent(storage.removeRecent(item.id)) : setFavorites(storage.removeFavorite(item.id))}>Delete</button></div>
                </div>
              )) : <p className="empty-saved">No {libraryTab} saved yet.</p>}
            </div>
            {libraryTab === "recent" && recent.length > 0 && <button className="text-button danger" onClick={() => { storage.clearRecent(); setRecent([]); }}>Clear generation history</button>}
          </div>
        </div>
      )}

      <div className={`toast ${toast ? "show" : ""}`} role="status" aria-live="polite">{toast}<span aria-hidden="true">✓</span></div>
    </section>
  );
}
