"use client";

import { useMemo, useState } from "react";
import type { PokemonRecord, PokemonStats } from "@/types/pokemon";
import { usePokemonDataset } from "@/lib/use-pokemon-dataset";

interface Nature {
  name: string;
  plus?: keyof PokemonStats;
  minus?: keyof PokemonStats;
}

const NATURES: Nature[] = [
  { name: "Hardy" }, { name: "Lonely", plus: "attack", minus: "defense" }, { name: "Brave", plus: "attack", minus: "speed" }, { name: "Adamant", plus: "attack", minus: "specialAttack" }, { name: "Naughty", plus: "attack", minus: "specialDefense" },
  { name: "Bold", plus: "defense", minus: "attack" }, { name: "Docile" }, { name: "Relaxed", plus: "defense", minus: "speed" }, { name: "Impish", plus: "defense", minus: "specialAttack" }, { name: "Lax", plus: "defense", minus: "specialDefense" },
  { name: "Timid", plus: "speed", minus: "attack" }, { name: "Hasty", plus: "speed", minus: "defense" }, { name: "Serious" }, { name: "Jolly", plus: "speed", minus: "specialAttack" }, { name: "Naive", plus: "speed", minus: "specialDefense" },
  { name: "Modest", plus: "specialAttack", minus: "attack" }, { name: "Mild", plus: "specialAttack", minus: "defense" }, { name: "Quiet", plus: "specialAttack", minus: "speed" }, { name: "Bashful" }, { name: "Rash", plus: "specialAttack", minus: "specialDefense" },
  { name: "Calm", plus: "specialDefense", minus: "attack" }, { name: "Gentle", plus: "specialDefense", minus: "defense" }, { name: "Sassy", plus: "specialDefense", minus: "speed" }, { name: "Careful", plus: "specialDefense", minus: "specialAttack" }, { name: "Quirky" },
];

const STAT_ROWS: Array<{ key: keyof PokemonStats; label: string }> = [
  { key: "hp", label: "HP" },
  { key: "attack", label: "Attack" },
  { key: "defense", label: "Defense" },
  { key: "specialAttack", label: "Sp. Attack" },
  { key: "specialDefense", label: "Sp. Defense" },
  { key: "speed", label: "Speed" },
];

function natureModifier(nature: Nature, key: keyof PokemonStats) {
  if (nature.plus === key) return 1.1;
  if (nature.minus === key) return 0.9;
  return 1;
}

function statFormula(base: number, iv: number, ev: number, level: number, isHp: boolean, mod: number) {
  if (isHp) return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
  return Math.floor((Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + 5) * mod);
}

function possibleIvs(base: number, level: number, ev: number, observed: number, mod: number, isHp: boolean) {
  const matches: number[] = [];
  for (let iv = 0; iv <= 31; iv += 1) {
    if (statFormula(base, iv, ev, level, isHp, mod) === observed) matches.push(iv);
  }
  return matches;
}

function ivLabel(matches: number[]) {
  if (!matches.length) return { text: "Impossible", state: "impossible" as const };
  if (matches.length === 1) return { text: `IV ${matches[0]}`, state: "exact" as const };
  return { text: `IV ${matches[0]}–${matches[matches.length - 1]}`, state: "range" as const };
}

export function PokemonIvCalculator() {
  const { entries, error, loading } = usePokemonDataset();
  const [query, setQuery] = useState("");
  const [species, setSpecies] = useState<PokemonRecord | null>(null);
  const [level, setLevel] = useState("50");
  const [natureIndex, setNatureIndex] = useState(0);
  const [inputs, setInputs] = useState<Record<string, { observed: string; ev: string }>>({});

  const suggestions = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return entries.filter((entry) => entry.name.toLowerCase().includes(term)).slice(0, 6);
  }, [entries, query]);

  const levelNumber = Math.min(100, Math.max(1, Number(level) || 50));
  const nature = NATURES[natureIndex];

  const results = useMemo(() => {
    if (!species) return {};
    const output: Record<string, ReturnType<typeof ivLabel>> = {};
    for (const row of STAT_ROWS) {
      const input = inputs[row.key];
      const observed = Number(input?.observed);
      const ev = Math.min(252, Math.max(0, Number(input?.ev) || 0));
      if (!input?.observed || !Number.isFinite(observed) || observed <= 0) continue;
      const matches = possibleIvs(species.stats[row.key], levelNumber, ev, observed, natureModifier(nature, row.key), row.key === "hp");
      output[row.key] = ivLabel(matches);
    }
    return output;
  }, [inputs, levelNumber, nature, species]);

  if (loading || error) {
    return (
      <section className="tool-shell ivc-shell">
        <p className="wheel-result-status">{loading ? "Loading the Pokédex…" : error}</p>
      </section>
    );
  }

  return (
    <section className="tool-shell ivc-shell">
      <div className="ivc-picker">
        <span className="eyebrow">POKÉMON</span>
        <h2>Pick the species</h2>
        {species ? (
          <div className="ivc-species" data-type={species.primaryType}>
            <strong>{species.name}</strong>
            <button type="button" onClick={() => { setSpecies(null); setQuery(""); }}>Change</button>
          </div>
        ) : (
          <div className="wordle-input">
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Type a Pokémon name…"
              aria-label="Search for a Pokémon"
              autoComplete="off"
            />
            {query && (
              <ul className="wordle-suggestions">
                {suggestions.map((entry) => (
                  <li key={entry.slug}>
                    <button type="button" onClick={() => { setSpecies(entry); setQuery(""); }}>
                      <span>{entry.name}</span>
                      <small>Gen {entry.generation}</small>
                    </button>
                  </li>
                ))}
                {!suggestions.length && <li className="wordle-no-match">No species matches “{query}”.</li>}
              </ul>
            )}
          </div>
        )}

        <div className="ivc-level-nature">
          <label>Level<input type="number" min={1} max={100} value={level} onChange={(event) => setLevel(event.target.value)} /></label>
          <label>Nature
            <select value={natureIndex} onChange={(event) => setNatureIndex(Number(event.target.value))}>
              {NATURES.map((entry, index) => <option value={index} key={entry.name}>{entry.name}</option>)}
            </select>
          </label>
        </div>
        <p className="ivc-note">Works for Generations 3 and later. Leave EVs at 0 for freshly caught or hatched Pokémon.</p>
      </div>

      <div className="ivc-stats">
        <span className="eyebrow">OBSERVED STATS</span>
        <h2>Enter what the summary screen shows</h2>
        {!species && <p className="ivc-note">Pick a species first — the calculator needs its base stats.</p>}
        {species && (
          <div className="ivc-rows">
            {STAT_ROWS.map((row) => {
              const result = results[row.key];
              return (
                <div className="ivc-row" key={row.key}>
                  <span className="ivc-label">{row.label}<small>Base {species.stats[row.key]}</small></span>
                  <input type="number" min={1} max={1500} placeholder="Stat" aria-label={`${row.label} stat`} value={inputs[row.key]?.observed ?? ""} onChange={(event) => setInputs((current) => ({ ...current, [row.key]: { observed: event.target.value, ev: current[row.key]?.ev ?? "0" } }))} />
                  <input type="number" min={0} max={252} step={4} placeholder="EVs" aria-label={`${row.label} EVs`} value={inputs[row.key]?.ev ?? ""} onChange={(event) => setInputs((current) => ({ ...current, [row.key]: { observed: current[row.key]?.observed ?? "", ev: event.target.value } }))} />
                  {result ? <span className={`ivc-result ivc-result-${result.state}`}>{result.text}</span> : <span className="ivc-result ivc-result-empty">—</span>}
                </div>
              );
            })}
          </div>
        )}
        <p className="ivc-note">Columns: the stat value your Pokémon shows, then its EV investment (0 for untrained). Ranges narrow as the level rises—level 100 gives exact IVs.</p>
      </div>
    </section>
  );
}
