"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { POKEMON_TYPES, type PokemonType } from "@/types/pokemon";
import { titleToken } from "@/lib/pokemon-catalog";

const COLORS = ["#9aa0a6", "#ef6a4b", "#4f8fe8", "#f2c84b", "#65ad64", "#6bc7cf", "#c65c73", "#9b69c7", "#c98d55", "#75a9d8", "#ef6c91", "#8caf45", "#b99a63", "#7458a6", "#6777c4", "#585a70", "#71838b", "#e38cb2"];

export function PokemonTypeWheel() {
  const [enabled, setEnabled] = useState<PokemonType[]>([...POKEMON_TYPES]);
  const [result, setResult] = useState<PokemonType | null>(null);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const gradient = useMemo(() => `conic-gradient(${POKEMON_TYPES.map((type, index) => `${enabled.includes(type) ? COLORS[index] : "var(--border)"} ${index * 20}deg ${(index + 1) * 20}deg`).join(",")})`, [enabled]);

  const spin = () => {
    if (!enabled.length || spinning) return;
    const random = new Uint32Array(1); crypto.getRandomValues(random);
    const selected = enabled[random[0] % enabled.length];
    const index = POKEMON_TYPES.indexOf(selected);
    const target = 360 - (index * 20 + 10);
    setSpinning(true); setResult(null); setRotation((value) => value + 1440 + target - (value % 360));
    window.setTimeout(() => { setResult(selected); setSpinning(false); }, 1050);
  };
  const toggle = (type: PokemonType) => setEnabled((current) => current.includes(type) ? current.filter((entry) => entry !== type) : [...current, type]);

  return <section className="tool-shell type-wheel-tool">
    <div className="wheel-stage">
      <div className="wheel-pointer" aria-hidden="true" />
      <div className="type-wheel" style={{ background: gradient, transform: `rotate(${rotation}deg)` }} aria-label="Wheel containing all 18 Pokémon types">
        {POKEMON_TYPES.map((type, index) => <span style={{ transform: `rotate(${index * 20 + 10}deg)` }} key={type}><b style={{ transform: `rotate(90deg)` }}>{titleToken(type).slice(0, 3)}</b></span>)}
        <i aria-hidden="true">18</i>
      </div>
      <button className="generate-button wheel-spin" onClick={spin} disabled={spinning || !enabled.length}>{spinning ? "Spinning…" : "Spin the Wheel"}</button>
    </div>
    <div className="wheel-controls">
      <span className="eyebrow">TYPE POOL</span><h2>Choose which types can win</h2><p>All 18 Pokémon types are enabled by default. Tap a type to exclude or restore it.</p>
      <div className="wheel-type-grid">{POKEMON_TYPES.map((type) => <button type="button" data-type={type} aria-pressed={enabled.includes(type)} className={enabled.includes(type) ? "selected" : ""} onClick={() => toggle(type)} key={type}><span className="type-dot" />{titleToken(type)}</button>)}</div>
      <div className="wheel-pool-actions"><button onClick={() => setEnabled([...POKEMON_TYPES])}>Select all</button><button onClick={() => setEnabled([])}>Clear</button><span>{enabled.length} enabled</span></div>
      {result && <div className="wheel-result" data-type={result}><span>Your type is</span><h2>{titleToken(result)}</h2><div><Link href={`/?type=${result}&count=1&mode=random`}>Generate a {titleToken(result)} Pokémon</Link><Link href={`/?type=${result}&count=6&mode=smart`}>Build a {titleToken(result)} Team</Link><Link href={`/pokemon/type/${result}`}>View {titleToken(result)} Pokémon</Link></div></div>}
    </div>
  </section>;
}
