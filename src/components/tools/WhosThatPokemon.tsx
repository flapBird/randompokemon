"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import type { PokemonRecord } from "@/types/pokemon";
import { usePokemonDataset } from "@/lib/use-pokemon-dataset";

function randomNumber() {
  const value = new Uint32Array(1);
  crypto.getRandomValues(value);
  return value[0];
}

function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let mix = Math.imul(state ^ (state >>> 15), 1 | state);
    mix = (mix + Math.imul(mix ^ (mix >>> 7), 61 | mix)) ^ mix;
    return ((mix ^ (mix >>> 14)) >>> 0) / 4294967296;
  };
}

export function artworkUrl(entry: PokemonRecord) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${entry.id}.png`;
}

const BEST_KEY = "whos-that-pokemon-best";

export function WhosThatPokemon() {
  const { entries, error, loading } = usePokemonDataset();
  const [generation, setGeneration] = useState<number | "all">("all");
  const [roundSeed, setRoundSeed] = useState(0);
  const [selected, setSelected] = useState<PokemonRecord | null>(null);
  const [score, setScore] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [copied, setCopied] = useState(false);

  const pool = useMemo(() => {
    return generation === "all" ? entries : entries.filter((entry) => entry.generation === generation);
  }, [entries, generation]);

  const round = useMemo(() => {
    if (pool.length < 4) return null;
    const random = mulberry32(roundSeed + pool.length);
    const answer = pool[Math.floor(random() * pool.length)];
    const distractorPool = pool.filter((entry) => entry.slug !== answer.slug);
    const options = [answer];
    for (let index = 0; index < 3 && distractorPool.length; index += 1) {
      options.push(distractorPool.splice(Math.floor(random() * distractorPool.length), 1)[0]);
    }
    for (let index = options.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(random() * (index + 1));
      [options[index], options[swap]] = [options[swap], options[index]];
    }
    return { answer, options };
  }, [pool, roundSeed]);

  const current = round?.answer ?? null;

  useEffect(() => {
    const stored = Number(window.localStorage.getItem(BEST_KEY) ?? 0);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (Number.isFinite(stored)) setBest(stored);
  }, []);

  const nextRound = useCallback(() => {
    setSelected(null);
    setCopied(false);
    setRoundSeed(randomNumber());
  }, []);

  const revealed = selected !== null;
  const isCorrect = revealed && selected?.slug === current?.slug;

  const guess = (entry: PokemonRecord) => {
    if (revealed || !current) return;
    setSelected(entry);
    setRounds((value) => value + 1);
    if (entry.slug === current.slug) {
      setScore((value) => value + 1);
      setStreak((value) => {
        const next = value + 1;
        if (next > best) {
          setBest(next);
          window.localStorage.setItem(BEST_KEY, String(next));
        }
        return next;
      });
    } else {
      setStreak(0);
    }
  };

  const reveal = () => {
    if (revealed || !current) return;
    setSelected(current);
    setRounds((value) => value + 1);
    setStreak(0);
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(`I named ${score}/${rounds} Pokémon in "Who's That Pokémon?" on RandomPokemon.xyz — best streak ${best}. Can you beat it?`);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  if (loading || error) {
    return (
      <section className="tool-shell quiz-shell">
        <div className="quiz-stage">
          <p className="wheel-result-status">{loading ? "Loading the Pokédex…" : error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="tool-shell quiz-shell">
      <div className="quiz-stage">
        <div className="quiz-scorebar">
          <span>Score <strong>{score}/{rounds}</strong></span>
          <span>Streak <strong>{streak}</strong></span>
          <span>Best <strong>{best}</strong></span>
          <label className="quiz-gen">
            <span className="sr-only">Generation pool</span>
            <select
              value={String(generation)}
              onChange={(event) => {
                const value = event.target.value;
                setGeneration(value === "all" ? "all" : Number(value));
                nextRound();
              }}
            >
              <option value="all">All generations</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((gen) => <option value={gen} key={gen}>Gen {gen} only</option>)}
            </select>
          </label>
        </div>

        <div className={`quiz-figure ${revealed ? "revealed" : ""}`} data-type={current?.primaryType}>
          {current && (
            <img
              src={artworkUrl(current)}
              alt={revealed ? `${current.name} silhouette revealed` : "Silhouette of a hidden Pokémon"}
              onError={(event) => { event.currentTarget.src = current.sprite; }}
            />
          )}
          {revealed && current && (
            <div className="quiz-answer" role="status" aria-live="polite">
              <h2 className={isCorrect ? "correct" : "missed"}>{current.name}</h2>
              <div className="quiz-answer-types">{current.types.map((type) => <TypeBadge type={type} key={type} />)}</div>
              <Link href={`/pokemon/${current.slug}`}>Open {current.name}’s Pokédex page →</Link>
            </div>
          )}
        </div>

        <div className="quiz-options">
          {round?.options.map((entry) => {
            const state = !revealed ? "idle" : entry.slug === current?.slug ? "correct" : entry.slug === selected?.slug ? "wrong" : "idle";
            return (
              <button type="button" key={entry.slug} data-state={state} disabled={revealed} onClick={() => guess(entry)}>
                {entry.name}
              </button>
            );
          })}
        </div>

        <div className="quiz-actions">
          {revealed ? (
            <>
              <button type="button" className="generate-button" onClick={nextRound}>Next Pokémon →</button>
              <button type="button" onClick={share}>{copied ? "Copied!" : "Share my score"}</button>
            </>
          ) : (
            <button type="button" onClick={reveal} disabled={!current}>Reveal answer</button>
          )}
        </div>
      </div>
    </section>
  );
}
