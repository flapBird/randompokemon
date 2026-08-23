"use client";

import { useEffect, useState } from "react";
import type { PokemonRecord } from "@/types/pokemon";

export function usePokemonDataset() {
  const [entries, setEntries] = useState<PokemonRecord[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    fetch("/data/pokemon.json").then((response) => {
      if (!response.ok) throw new Error("Pokédex data unavailable");
      return response.json() as Promise<PokemonRecord[]>;
    }).then((data) => { if (!cancelled) setEntries(data.filter((entry) => entry.isDefaultForm)); }).catch(() => { if (!cancelled) setError("Pokédex data could not be loaded."); });
    return () => { cancelled = true; };
  }, []);
  return { entries, error, loading: !entries.length && !error };
}
