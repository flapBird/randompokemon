"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useMemo, useState } from "react";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { titleToken } from "@/lib/pokemon-catalog";
import { usePokemonDataset } from "@/lib/use-pokemon-dataset";
import { POKEMON_TYPES, type PokemonType } from "@/types/pokemon";

const COLORS = ["#9aa0a6", "#ef6a4b", "#4f8fe8", "#f2c84b", "#65ad64", "#6bc7cf", "#c65c73", "#9b69c7", "#c98d55", "#75a9d8", "#ef6c91", "#8caf45", "#b99a63", "#7458a6", "#6777c4", "#585a70", "#71838b", "#e38cb2"];

function randomNumber() {
  const value = new Uint32Array(1);
  crypto.getRandomValues(value);
  return value[0];
}

function randomIndex(length: number) {
  return randomNumber() % length;
}

export function PokemonTypeWheel() {
  const { entries, error, loading } = usePokemonDataset();
  const [enabled, setEnabled] = useState<PokemonType[]>([...POKEMON_TYPES]);
  const [result, setResult] = useState<PokemonType | null>(null);
  const [pokemonRoll, setPokemonRoll] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const gradient = useMemo(() => `conic-gradient(${POKEMON_TYPES.map((type, index) => `${enabled.includes(type) ? COLORS[index] : "var(--border)"} ${index * 20}deg ${(index + 1) * 20}deg`).join(",")})`, [enabled]);
  const pokemon = useMemo(() => {
    if (!result) return null;
    const pool = entries.filter((entry) => entry.types.includes(result));
    return pool.length ? pool[pokemonRoll % pool.length] : null;
  }, [entries, pokemonRoll, result]);

  const spin = () => {
    if (!enabled.length || spinning) return;
    const selected = enabled[randomIndex(enabled.length)];
    const index = POKEMON_TYPES.indexOf(selected);
    const target = 360 - (index * 20 + 10);
    setSpinning(true);
    setResult(null);
    setRotation((value) => value + 1440 + target - (value % 360));
    window.setTimeout(() => {
      setPokemonRoll(randomNumber());
      setResult(selected);
      setSpinning(false);
    }, 1050);
  };

  const toggle = (type: PokemonType) => setEnabled((current) => current.includes(type) ? current.filter((entry) => entry !== type) : [...current, type]);

  return (
    <section className="tool-shell type-wheel-tool">
      <div className="wheel-stage">
        <div className="wheel-pointer" aria-hidden="true" />
        <div className="type-wheel" style={{ background: gradient, transform: `rotate(${rotation}deg)` }} aria-label="Wheel containing all 18 Pokémon types">
          {POKEMON_TYPES.map((type, index) => <span style={{ transform: `rotate(${index * 20 + 10}deg)` }} key={type}><b style={{ transform: "rotate(90deg)" }}>{titleToken(type).slice(0, 3)}</b></span>)}
          <i aria-hidden="true">18</i>
        </div>
        <button className="generate-button wheel-spin" onClick={spin} disabled={spinning || !enabled.length}>{spinning ? "Spinning…" : "Spin the Wheel"}</button>
      </div>

      <div className="wheel-controls">
        <span className="eyebrow">TYPE POOL</span>
        <h2>Choose which types can win</h2>
        <p>Keep all 18 types for a fully random draw, or tap any type to remove it before spinning.</p>

        {result && (
          <div className="wheel-result" data-type={result} role="status" aria-live="polite">
            <span>WINNING TYPE &amp; RANDOM PICK</span>
            <h2>{titleToken(result)}</h2>
            {pokemon ? (
              <article className="wheel-pokemon-result">
                <img src={pokemon.sprite} alt={pokemon.name} />
                <div>
                  <small>Random {titleToken(result)}-type Pokémon</small>
                  <h3><Link href={`/pokemon/${pokemon.slug}`}>{pokemon.name}</Link></h3>
                  <div className="wheel-result-types">{pokemon.types.map((type) => <TypeBadge type={type} key={type} />)}</div>
                </div>
              </article>
            ) : <p className="wheel-result-status">{loading ? "Loading a matching Pokémon…" : error || "No matching Pokémon could be selected."}</p>}
            <div className="wheel-result-actions">
              <button type="button" onClick={() => setPokemonRoll(randomNumber())} disabled={loading}>Pick another {titleToken(result)} Pokémon</button>
              {pokemon && <Link href={`/team-planner?pokemon=${pokemon.slug}`}>Plan with {pokemon.name}</Link>}
              <Link href={`/pokemon/type/${result}`}>Browse {titleToken(result)} Pokédex</Link>
            </div>
          </div>
        )}

        <div className="wheel-type-grid">{POKEMON_TYPES.map((type) => <button type="button" data-type={type} aria-pressed={enabled.includes(type)} className={enabled.includes(type) ? "selected" : ""} onClick={() => toggle(type)} key={type}><span className="type-dot" />{titleToken(type)}</button>)}</div>
        <div className="wheel-pool-actions"><button onClick={() => setEnabled([...POKEMON_TYPES])}>Select all</button><button onClick={() => setEnabled([])}>Clear</button><span>{enabled.length} enabled</span></div>
      </div>
    </section>
  );
}
