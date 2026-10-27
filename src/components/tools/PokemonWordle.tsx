"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { PokemonRecord } from "@/types/pokemon";
import { usePokemonDataset } from "@/lib/use-pokemon-dataset";
import { titleToken } from "@/lib/pokemon-format";

const MAX_GUESSES = 8;
const DAILY_KEY_PREFIX = "pokemon-wordle-daily-";
const STREAK_KEY = "pokemon-wordle-streak";

function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let mix = Math.imul(state ^ (state >>> 15), 1 | state);
    mix = (mix + Math.imul(mix ^ (mix >>> 7), 61 | mix)) ^ mix;
    return ((mix ^ (mix >>> 14)) >>> 0) / 4294967296;
  };
}

const DAY_ONE = Date.UTC(2026, 0, 1);
function dayIndex() {
  return Math.floor((Date.now() - DAY_ONE) / 86400000);
}

type Direction = "correct" | "up" | "down";

interface GuessRow {
  entry: PokemonRecord;
  gen: Direction;
  type1Hit: boolean;
  type2Hit: boolean | "none";
  height: Direction;
  weight: Direction;
}

function buildFeedback(guess: PokemonRecord, answer: PokemonRecord): GuessRow {
  const direction = (guessValue: number, answerValue: number): Direction =>
    guessValue === answerValue ? "correct" : answerValue > guessValue ? "up" : "down";
  return {
    entry: guess,
    gen: direction(guess.generation, answer.generation),
    type1Hit: answer.types.includes(guess.types[0]),
    type2Hit: guess.types.length < 2 ? "none" : answer.types.includes(guess.types[1]),
    height: direction(guess.height, answer.height),
    weight: direction(guess.weight, answer.weight),
  };
}

function pickAnswer(pool: PokemonRecord[], seed: number) {
  const random = mulberry32(seed + pool.length);
  return pool[Math.floor(random() * pool.length)];
}

function Chip({ state, children }: { state: "hit" | "miss" | "none" | Direction; children: React.ReactNode }) {
  return <span className={`wordle-chip wordle-chip-${state}`}>{children}</span>;
}

function GuessRowView({ row }: { row: GuessRow }) {
  const arrow = (value: Direction) => (value === "up" ? "↑ higher" : value === "down" ? "↓ lower" : "✓ match");
  return (
    <li className="wordle-row">
      <img src={row.entry.sprite} alt={row.entry.name} loading="lazy" />
      <strong>{row.entry.name}</strong>
      <div className="wordle-chips">
        <Chip state={row.gen}>Gen {row.entry.generation} · {arrow(row.gen)}</Chip>
        <Chip state={row.type1Hit ? "hit" : "miss"}>{titleToken(row.entry.types[0])}</Chip>
        {row.type2Hit === "none"
          ? <Chip state="none">No 2nd type</Chip>
          : <Chip state={row.type2Hit ? "hit" : "miss"}>{titleToken(row.entry.types[1])}</Chip>}
        <Chip state={row.height}>{row.entry.height.toFixed(1)} m · {arrow(row.height)}</Chip>
        <Chip state={row.weight}>{row.entry.weight.toFixed(1)} kg · {arrow(row.weight)}</Chip>
      </div>
    </li>
  );
}

export function PokemonWordle() {
  const { entries, error, loading } = usePokemonDataset();
  const [practiceSeed, setPracticeSeed] = useState(0);
  const [mode, setMode] = useState<"daily" | "practice">("daily");
  const [query, setQuery] = useState("");
  const [guesses, setGuesses] = useState<GuessRow[]>([]);
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");
  const [bestStreak, setBestStreak] = useState(0);
  const [copied, setCopied] = useState(false);
  const today = dayIndex();

  const pool = useMemo(() => entries, [entries]);
  const answer = useMemo(() => {
    if (!pool.length) return null;
    return pickAnswer(pool, mode === "daily" ? today : practiceSeed);
  }, [mode, pool, practiceSeed, today]);

  useEffect(() => {
    const stored = Number(window.localStorage.getItem(STREAK_KEY) ?? 0);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (Number.isFinite(stored)) setBestStreak(stored);
  }, []);

  // 恢复今日进度
  useEffect(() => {
    if (!answer) return;
    if (mode !== "daily") return;
    const raw = window.localStorage.getItem(DAILY_KEY_PREFIX + today);
    if (!raw) return;
    try {
      const saved = JSON.parse(raw) as { slugs: string[]; status: "playing" | "won" | "lost" };
      const restored = saved.slugs
        .map((slug) => pool.find((entry) => entry.slug === slug))
        .filter((entry): entry is PokemonRecord => Boolean(entry))
        .map((entry) => buildFeedback(entry, answer));
      /* eslint-disable react-hooks/set-state-in-effect */
      setGuesses(restored);
      setStatus(saved.status);
      /* eslint-enable react-hooks/set-state-in-effect */
    } catch {
      /* 损坏的存档按新局处理 */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer?.slug, mode]);

  const persistDaily = useCallback((rows: GuessRow[], finalStatus: "playing" | "won" | "lost") => {
    if (mode !== "daily") return;
    window.localStorage.setItem(DAILY_KEY_PREFIX + today, JSON.stringify({ slugs: rows.map((row) => row.entry.slug), status: finalStatus }));
  }, [mode, today]);

  const suggestions = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return pool.filter((entry) => entry.name.toLowerCase().includes(term)).slice(0, 6);
  }, [pool, query]);

  const guess = useCallback((entry: PokemonRecord) => {
    if (!answer || status !== "playing") return;
    if (guesses.some((row) => row.entry.slug === entry.slug)) return;
    const feedback = buildFeedback(entry, answer);
    const next = [...guesses, feedback];
    const finalStatus = entry.slug === answer.slug ? "won" : next.length >= MAX_GUESSES ? "lost" : "playing";
    setGuesses(next);
    setQuery("");
    setStatus(finalStatus);
    persistDaily(next, finalStatus);
    if (finalStatus === "won") {
      setBestStreak((current) => {
        const updated = current + 1;
        window.localStorage.setItem(STREAK_KEY, String(updated));
        return updated;
      });
    }
  }, [answer, guesses, persistDaily, status]);

  const newPractice = () => {
    setMode("practice");
    setPracticeSeed(Math.floor(Math.random() * 1000000));
    setGuesses([]);
    setStatus("playing");
    setQuery("");
    setCopied(false);
  };

  const share = async () => {
    if (!answer) return;
    const label = mode === "daily" ? `Pokémon Wordle #${today}` : "Practice";
    const tries = status === "won" ? `${guesses.length}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`;
    const grid = guesses.map((row) => (row.entry.slug === answer.slug ? "🟩" : "🟥")).join("");
    try {
      await navigator.clipboard.writeText(`${label} ${tries} ${grid}\nGuess today's Pokémon at https://randompokemon.xyz/pokemon-wordle`);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  if (loading || error) {
    return (
      <section className="tool-shell wordle-shell">
        <div className="wordle-stage">
          <p className="wheel-result-status">{loading ? "Loading the Pokédex…" : error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="tool-shell wordle-shell">
      <div className="wordle-stage">
        <div className="wordle-topbar">
          <div className="wordle-modes" role="group" aria-label="Game mode">
            <button type="button" aria-pressed={mode === "daily"} className={mode === "daily" ? "selected" : ""} onClick={() => { if (mode !== "daily") { setMode("daily"); setGuesses([]); setStatus("playing"); setQuery(""); setCopied(false); } }}>Daily #{today}</button>
            <button type="button" aria-pressed={mode === "practice"} className={mode === "practice" ? "selected" : ""} onClick={newPractice}>Practice</button>
          </div>
          <span className="wordle-counter">{guesses.length}/{MAX_GUESSES} guesses · Best streak {bestStreak}</span>
        </div>

        {status !== "playing" && answer && (
          <div className={`wordle-result ${status}`} role="status" aria-live="polite" data-type={answer.primaryType}>
            {status === "won" ? <h2>Got it — it’s {answer.name}!</h2> : <h2>Out of guesses — it was {answer.name}</h2>}
            <div className="wordle-result-actions">
              <Link href={`/pokemon/${answer.slug}`}>Open {answer.name}’s Pokédex page →</Link>
              <button type="button" onClick={newPractice}>{mode === "daily" ? "Play a practice round" : "Play again"}</button>
              <button type="button" onClick={share}>{copied ? "Copied!" : "Share result"}</button>
            </div>
            <p className="wordle-result-note">{mode === "daily" ? "A new Daily Pokémon arrives at midnight UTC." : "Practice rounds use a random species every time."}</p>
          </div>
        )}

        {status === "playing" && (
          <div className="wordle-input">
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => { if (event.key === "Enter" && suggestions[0]) guess(suggestions[0]); }}
              placeholder="Type a Pokémon name…"
              aria-label="Guess a Pokémon"
              autoComplete="off"
            />
            {query && (
              <ul className="wordle-suggestions">
                {suggestions.map((entry) => (
                  <li key={entry.slug}>
                    <button type="button" onClick={() => guess(entry)}>
                      <img src={entry.sprite} alt="" loading="lazy" />
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

        <ol className="wordle-board">
          {guesses.map((row) => <GuessRowView row={row} key={row.entry.slug} />)}
        </ol>

        <p className="wordle-legend">Each row shows how your guess compares with the answer: <strong>↑/↓</strong> means the answer’s generation, height, or weight is higher or lower; a green type means the answer shares that type. Types apply to either slot.</p>
      </div>
    </section>
  );
}
