"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useMemo, useState } from "react";
import type { PokemonRecord, PokemonType } from "@/types/pokemon";
import { POKEMON_TYPES } from "@/types/pokemon";
import { usePokemonDataset } from "@/lib/use-pokemon-dataset";

type PickerMode = "quick" | "standard" | "full";
const MODE_SIZE: Record<PickerMode, number> = { quick: 32, standard: 128, full: Number.MAX_SAFE_INTEGER };

function shuffle<T>(entries: T[]) {
  const copy = [...entries];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const random = new Uint32Array(1);
    crypto.getRandomValues(random);
    const other = random[0] % (index + 1);
    [copy[index], copy[other]] = [copy[other], copy[index]];
  }
  return copy;
}

export function FavoritePokemonPicker() {
  const { entries, error, loading } = usePokemonDataset();
  const [mode, setMode] = useState<PickerMode>("quick");
  const [generation, setGeneration] = useState("all");
  const [type, setType] = useState<"all" | PokemonType>("all");
  const [region, setRegion] = useState("all");
  const [includeLegendary, setIncludeLegendary] = useState(true);
  const [includeMythical, setIncludeMythical] = useState(true);
  const [startersOnly, setStartersOnly] = useState(false);
  const [round, setRound] = useState<PokemonRecord[]>([]);
  const [pairIndex, setPairIndex] = useState(0);
  const [winners, setWinners] = useState<PokemonRecord[]>([]);
  const [eliminated, setEliminated] = useState<PokemonRecord[]>([]);
  const [result, setResult] = useState<PokemonRecord[]>([]);
  const [roundNumber, setRoundNumber] = useState(1);
  const [message, setMessage] = useState("");

  const available = useMemo(() => entries.filter((entry) =>
    (generation === "all" || entry.generation === Number(generation)) &&
    (type === "all" || entry.types.includes(type)) &&
    (region === "all" || entry.region.toLowerCase() === region) &&
    (includeLegendary || !entry.isLegendary) &&
    (includeMythical || !entry.isMythical) &&
    (!startersOnly || entry.isStarter)
  ), [entries, generation, includeLegendary, includeMythical, region, startersOnly, type]);

  const active = round.length > 0 && result.length === 0;
  const first = round[pairIndex];
  const second = round[pairIndex + 1];
  const totalDecisions = Math.max(0, round.length - 1);

  const start = () => {
    if (available.length < 2) return setMessage("Choose broader filters so at least two Pokémon can enter the tournament.");
    const bracket = shuffle(available).slice(0, Math.min(available.length, MODE_SIZE[mode]));
    setRound(bracket);
    setPairIndex(0);
    setWinners([]);
    setEliminated([]);
    setResult([]);
    setRoundNumber(1);
    setMessage("");
  };

  const choose = (winner: PokemonRecord, loser?: PokemonRecord) => {
    const nextWinners = [...winners, winner];
    const nextEliminated = loser ? [...eliminated, loser] : eliminated;
    if (pairIndex + 2 < round.length) {
      setWinners(nextWinners);
      setEliminated(nextEliminated);
      setPairIndex(pairIndex + 2);
      return;
    }
    if (nextWinners.length === 1) {
      setResult([nextWinners[0], ...[...nextEliminated].reverse()].slice(0, 10));
      setRound([]);
      setWinners([]);
      setEliminated(nextEliminated);
      return;
    }
    setRound(nextWinners);
    setPairIndex(0);
    setWinners([]);
    setEliminated(nextEliminated);
    setRoundNumber((value) => value + 1);
  };

  const resultText = () => ["My Top Pokémon", ...result.map((entry, index) => `#${index + 1} ${entry.name}`), "", "Picked at randompokemon.xyz/favorite-pokemon-picker"].join("\n");
  const copyResults = async () => { await navigator.clipboard.writeText(resultText()); setMessage("Results copied."); };
  const shareResults = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: "My Favorite Pokémon", text: resultText(), url: window.location.href }); return; } catch (error) { if (error instanceof DOMException && error.name === "AbortError") return; }
    }
    await copyResults();
  };
  const downloadImage = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200; canvas.height = 720;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.fillStyle = "#f6f7f2"; context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#172019"; context.font = "700 54px Georgia"; context.fillText("My Top 10 Pokémon", 70, 82);
    context.font = "600 25px system-ui";
    for (let index = 0; index < result.length; index += 1) {
      const entry = result[index]; const column = index % 5; const row = Math.floor(index / 5); const x = 60 + column * 228; const y = 125 + row * 270;
      context.fillStyle = "#ffffff"; context.fillRect(x, y, 205, 235);
      try {
        const image = new Image(); image.crossOrigin = "anonymous"; image.src = entry.sprite; await image.decode(); context.drawImage(image, x + 28, y + 18, 150, 150);
      } catch {}
      context.fillStyle = "#e85d43"; context.font = "800 18px system-ui"; context.fillText(`#${index + 1}`, x + 16, y + 28);
      context.fillStyle = "#172019"; context.font = "700 19px system-ui"; context.fillText(entry.name.slice(0, 16), x + 16, y + 210);
    }
    context.fillStyle = "#607064"; context.font = "600 18px system-ui"; context.fillText("randompokemon.xyz", 70, 690);
    const link = document.createElement("a"); link.download = "my-top-10-pokemon.png"; link.href = canvas.toDataURL("image/png"); link.click();
  };

  return (
    <section className="tool-shell favorite-picker" aria-label="Favorite Pokémon tournament">
      {!active && !result.length && <div className="picker-setup">
        <div className="tool-control"><span>Mode</span><div className="segmented">{(["quick", "standard", "full"] as PickerMode[]).map((value) => <button className={mode === value ? "selected" : ""} onClick={() => setMode(value)} key={value}>{value[0].toUpperCase() + value.slice(1)}<small>{value === "quick" ? "32" : value === "standard" ? "128" : "All"}</small></button>)}</div></div>
        <div className="picker-filter-grid">
          <label>Generation<select value={generation} onChange={(event) => setGeneration(event.target.value)}><option value="all">All generations</option>{Array.from({ length: 9 }, (_, index) => <option value={index + 1} key={index}>Generation {index + 1}</option>)}</select></label>
          <label>Type<select value={type} onChange={(event) => setType(event.target.value as typeof type)}><option value="all">All types</option>{POKEMON_TYPES.map((value) => <option value={value} key={value}>{value[0].toUpperCase() + value.slice(1)}</option>)}</select></label>
          <label>Region<select value={region} onChange={(event) => setRegion(event.target.value)}><option value="all">All regions</option>{[...new Set(entries.map((entry) => entry.region.toLowerCase()))].map((value) => <option value={value} key={value}>{value[0].toUpperCase() + value.slice(1)}</option>)}</select></label>
        </div>
        <div className="picker-toggles"><label><input type="checkbox" checked={includeLegendary} onChange={(event) => setIncludeLegendary(event.target.checked)} /> Include Legendary</label><label><input type="checkbox" checked={includeMythical} onChange={(event) => setIncludeMythical(event.target.checked)} /> Include Mythical</label><label><input type="checkbox" checked={startersOnly} onChange={(event) => setStartersOnly(event.target.checked)} /> Starters only</label></div>
        <div className="picker-start"><p>{loading ? "Loading the tournament pool…" : <><strong>{available.length}</strong> Pokémon match · {Math.min(available.length, MODE_SIZE[mode])} will enter</>}</p><button className="generate-button" onClick={start} disabled={loading || Boolean(error)}>Start Favorite Picker</button></div>
      </div>}

      {active && first && <div className="picker-battle">
        <div className="picker-progress"><span>Round {roundNumber}</span><strong>{Math.floor(pairIndex / 2) + 1} of {Math.ceil(round.length / 2)}</strong><small>{totalDecisions} decision{totalDecisions === 1 ? "" : "s"} remain in this bracket</small></div>
        <div className="versus-grid">
          {[first, second].filter(Boolean).map((entry) => <button type="button" onClick={() => choose(entry!, entry === first ? second : first)} key={entry!.slug}>{ }<img src={entry!.sprite} alt={entry!.name} /><span>Choose</span><strong>{entry!.name}</strong><small>Gen {entry!.generation} · {entry!.types.join(" / ")}</small></button>)}
          {second && <span className="versus-mark" aria-hidden="true">VS</span>}
        </div>
        {!second && <p className="bye-note">This Pokémon has a bye. Choose it to continue.</p>}
        <button className="text-button danger" onClick={() => { setRound([]); setWinners([]); setEliminated([]); }}>End tournament</button>
      </div>}

      {result.length > 0 && <div className="picker-results">
        <div className="content-heading"><span className="eyebrow">YOUR RESULT</span><h2>Your Favorite Pokémon</h2><p>Your winner and approximate Top 10, ordered by how far each pick survived.</p></div>
        <div className="favorite-ranking">{result.map((entry, index) => <Link href={`/pokemon/${entry.slug}`} className={index === 0 ? "winner" : ""} key={entry.slug}><span>#{index + 1}</span>{ }<img src={entry.sprite} alt="" /><strong>{entry.name}</strong><small>View Pokédex →</small></Link>)}</div>
        <div className="result-share-actions"><button onClick={copyResults}>Copy Results</button><button onClick={shareResults}>Share</button><button onClick={downloadImage}>Download Image</button><button className="generate-button" onClick={() => { setResult([]); setMessage(""); }}>Restart</button></div>
      </div>}
      {(message || error) && <p className="tool-message" role="status">{message || error}</p>}
    </section>
  );
}
