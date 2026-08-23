"use client";
/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from "react";
import type { PokemonRecord } from "@/types/pokemon";

export function PokemonSelector({ entries, selected, onSelect, label = "Add Pokémon" }: { entries: PokemonRecord[]; selected: string[]; onSelect: (entry: PokemonRecord) => void; label?: string }) {
  const [query, setQuery] = useState("");
  const matches = useMemo(() => { const value = query.trim().toLowerCase(); if (!value) return []; return entries.filter((entry) => !selected.includes(entry.slug) && (entry.name.toLowerCase().includes(value) || entry.slug.includes(value))).slice(0, 8); }, [entries, query, selected]);
  return <div className="pokemon-selector"><label><span>{label}</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Pikachu, Charizard…" autoComplete="off" /></label>{query && <div className="selector-results">{matches.length ? matches.map((entry) => <button type="button" onClick={() => { onSelect(entry); setQuery(""); }} key={entry.slug}>{ }<img src={entry.sprite} alt="" loading="lazy" /><span><strong>{entry.name}</strong><small>#{String(entry.id).padStart(4, "0")} · Gen {entry.generation} · {entry.types.join(" / ")}</small></span></button>) : <p>No matching Pokémon.</p>}</div>}</div>;
}
