"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { PokemonType } from "@/types/pokemon";
import { TypeBadge } from "./TypeBadge";

export type DirectoryPokemon = {
  id: number;
  slug: string;
  name: string;
  generation: number;
  types: PokemonType[];
  sprite: string;
  shinySprite: string;
};

export function PokemonDirectory({
  entries,
  mode = "normal",
  searchable = true,
  limit,
}: {
  entries: DirectoryPokemon[];
  mode?: "normal" | "shiny" | "compare";
  searchable?: boolean;
  limit?: number;
}) {
  const [query, setQuery] = useState("");
  const [generation, setGeneration] = useState("all");
  const [shown, setShown] = useState(limit ?? 48);
  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return entries.filter((entry) =>
      (!normalized || entry.name.toLowerCase().includes(normalized) || entry.slug.includes(normalized)) &&
      (generation === "all" || entry.generation === Number(generation))
    );
  }, [entries, generation, query]);
  const visible = matches.slice(0, shown);
  const resetShown = () => setShown(limit ?? 48);

  return (
    <div className="directory-block">
      {searchable && (
        <div className="directory-controls">
          <label>
            <span>Search Pokémon</span>
            <input value={query} onChange={(event) => { setQuery(event.target.value); resetShown(); }} placeholder="Try Pikachu, Kyogre, Froakie…" />
          </label>
          <label>
            <span>Generation</span>
            <select value={generation} onChange={(event) => { setGeneration(event.target.value); resetShown(); }}>
              <option value="all">All generations</option>
              {Array.from({ length: 9 }, (_, index) => index + 1).map((number) => <option value={number} key={number}>Generation {number}</option>)}
            </select>
          </label>
          <p><strong>{matches.length}</strong> matching Pokémon</p>
        </div>
      )}
      {visible.length ? (
        <div className={`directory-grid directory-${mode}`}>
          {visible.map((entry) => (
            <article className="directory-card" key={entry.slug}>
              <Link href={`/pokemon/${entry.slug}`} aria-label={`View ${entry.name} Pokédex details`}>
                <div className="directory-art">
                  {mode === "compare" ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={entry.sprite} alt={`${entry.name} normal form`} loading="lazy" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={entry.shinySprite} alt={`Shiny ${entry.name}`} loading="lazy" />
                    </>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={mode === "shiny" ? entry.shinySprite : entry.sprite} alt={mode === "shiny" ? `Shiny ${entry.name}` : entry.name} loading="lazy" />
                  )}
                </div>
                <div className="directory-copy">
                  <small>#{String(entry.id).padStart(4, "0")} · Gen {entry.generation}</small>
                  <h2>{mode === "shiny" ? `Shiny ${entry.name}` : entry.name}</h2>
                  <div className="type-row">{entry.types.map((type) => <TypeBadge type={type} key={type} />)}</div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      ) : <p className="directory-empty">No Pokémon match that search. Try another name or generation.</p>}
      {visible.length < matches.length && !limit && <button className="directory-more" type="button" onClick={() => setShown((value) => value + 48)}>Show more Pokémon</button>}
    </div>
  );
}
