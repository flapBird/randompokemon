"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useMemo, useState } from "react";
import { calculateDefensiveMultiplier } from "@/data/type-chart";
import { title } from "@/lib/team-analysis";
import { usePokemonDataset } from "@/lib/use-pokemon-dataset";
import { POKEMON_TYPES, type PokemonRecord } from "@/types/pokemon";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { PokemonSelector } from "./PokemonSelector";

const stats = [["hp", "HP"], ["attack", "Attack"], ["defense", "Defense"], ["specialAttack", "Sp. Atk"], ["specialDefense", "Sp. Def"], ["speed", "Speed"]] as const;
export function ComparePokemon({ initialEntries }: { initialEntries: PokemonRecord[] }) {
  const { entries, error, loading } = usePokemonDataset();
  const [selectedSlugs, setSelectedSlugs] = useState(["charizard", "dragonite"]);
  const selected = useMemo(() => selectedSlugs.map((slug) => entries.find((entry) => entry.slug === slug) ?? initialEntries.find((entry) => entry.slug === slug)).filter((entry): entry is PokemonRecord => Boolean(entry)), [entries, initialEntries, selectedSlugs]);
  const best = useMemo(() => Object.fromEntries(stats.map(([key]) => [key, Math.max(...selected.map((entry) => entry.stats[key]))])), [selected]);
  return <section className="tool-shell compare-tool"><div className="compare-builder"><div><span className="eyebrow">COMPARE 2–4</span><h2>Choose Pokémon to compare</h2><p>Charizard and Dragonite are loaded as an example. Remove either one or search for another Pokémon to compare stats, abilities, and defensive matchups.</p></div><div className="compare-selector-wrap">{selected.length < 4 && <PokemonSelector entries={entries} selected={selectedSlugs} onSelect={(entry) => setSelectedSlugs([...selectedSlugs, entry.slug])} label="Add another Pokémon" />}<button type="button" className="compare-example-button" onClick={() => setSelectedSlugs(["charizard", "dragonite"])}>Reset example</button></div>{loading && <p className="tool-message">Loading the searchable Pokédex…</p>}{error && <p className="tool-message">{error}</p>}</div>
    {selected.length ? <><p className="compare-scroll-hint">Swipe left and right to compare every Pokémon. Metric labels stay pinned.</p><div className="compare-table-wrap"><table className="pokemon-compare-table"><thead><tr><th scope="col">Metric</th>{selected.map((entry) => <th scope="col" key={entry.slug}><button onClick={() => setSelectedSlugs(selectedSlugs.filter((slug) => slug !== entry.slug))} aria-label={`Remove ${entry.name}`}>×</button>{ }<img src={entry.sprite} alt="" /><Link href={`/pokemon/${entry.slug}`}>{entry.name}</Link><div>{entry.types.map((type) => <TypeBadge type={type} key={type} />)}</div></th>)}</tr></thead><tbody>
      <tr><th scope="row">Generation</th>{selected.map((entry) => <td key={entry.slug}>Gen {entry.generation} · {entry.region}</td>)}</tr><tr><th scope="row">Abilities</th>{selected.map((entry) => <td key={entry.slug}>{entry.abilities.join(", ")}</td>)}</tr>
      {stats.map(([key, label]) => <tr key={key}><th scope="row">{label}</th>{selected.map((entry) => <td className={selected.length > 1 && entry.stats[key] === best[key] ? "best-stat" : ""} key={entry.slug}>{entry.stats[key]}</td>)}</tr>)}<tr><th scope="row">BST</th>{selected.map((entry) => <td key={entry.slug}><strong>{entry.bst}</strong></td>)}</tr>
      <tr><th scope="row">Weaknesses</th>{selected.map((entry) => <td key={entry.slug}><div className="type-cloud">{POKEMON_TYPES.filter((type) => calculateDefensiveMultiplier(entry.types, type) > 1).map((type) => <TypeBadge type={type} key={type} />)}</div></td>)}</tr><tr><th scope="row">Resistances</th>{selected.map((entry) => <td key={entry.slug}><div className="type-cloud">{POKEMON_TYPES.filter((type) => { const value = calculateDefensiveMultiplier(entry.types, type); return value > 0 && value < 1; }).map((type) => <TypeBadge type={type} key={type} />)}</div></td>)}</tr><tr><th scope="row">Immunities</th>{selected.map((entry) => <td key={entry.slug}>{POKEMON_TYPES.filter((type) => calculateDefensiveMultiplier(entry.types, type) === 0).map(title).join(", ") || "None"}</td>)}</tr>
    </tbody></table></div></> : <div className="compare-empty"><span>VS</span><p>Select at least two Pokémon for a side-by-side comparison.</p></div>}
  </section>;
}
