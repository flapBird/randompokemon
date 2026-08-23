"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useMemo, useState } from "react";
import { calculateAttackMultiplier, calculateDefensiveMultiplier } from "@/data/type-chart";
import { STANDARD_FILTERS } from "@/lib/defaults";
import { generatePokemon } from "@/lib/random";
import { analyzeTeam, title } from "@/lib/team-analysis";
import { usePokemonDataset } from "@/lib/use-pokemon-dataset";
import type { GeneratedPokemon } from "@/types/generator";
import { POKEMON_TYPES } from "@/types/pokemon";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { PokemonSelector } from "./PokemonSelector";

const asGenerated = (pokemon: GeneratedPokemon["pokemon"]): GeneratedPokemon => ({ pokemon, ability: pokemon.abilities[0] ?? "Unknown", nature: "Hardy", locked: true, shiny: false });

export function TeamPlanner({ initialPokemon = "" }: { initialPokemon?: string }) {
  const { entries, error, loading } = usePokemonDataset();
  const [teamSlugs, setTeamSlugs] = useState<string[]>(initialPokemon ? [initialPokemon] : []);
  const [message, setMessage] = useState("");
  const team = useMemo(() => teamSlugs.map((slug) => entries.find((entry) => entry.slug === slug)).filter(Boolean).map((entry) => asGenerated(entry!)), [entries, teamSlugs]);
  const analysis = useMemo(() => analyzeTeam(team), [team]);
  const immunities = useMemo(() => POKEMON_TYPES.map((type) => ({ type, count: team.filter(({ pokemon }) => calculateDefensiveMultiplier(pokemon.types, type) === 0).length })).filter((entry) => entry.count > 0), [team]);
  const offensiveCoverage = useMemo(() => POKEMON_TYPES.filter((defender) => team.some(({ pokemon }) => pokemon.types.some((attacker) => calculateAttackMultiplier(attacker, defender) > 1))), [team]);
  const gaps = useMemo(() => { const notes: string[] = []; if (analysis.weaknesses[0]?.count >= 3) notes.push(`${analysis.weaknesses[0].count} members share a ${title(analysis.weaknesses[0].type)} weakness.`); if (analysis.uniqueTypes < Math.min(6, team.length + 1)) notes.push("The team has limited type variety."); if (offensiveCoverage.length < 10 && team.length >= 4) notes.push("Offensive type coverage is narrow."); return notes.length ? notes : [team.length < 6 ? "Add more Pokémon for a fuller coverage read." : "No obvious broad type gap detected."]; }, [analysis, offensiveCoverage.length, team.length]);
  const fill = (smart: boolean) => { if (team.length >= 6 || !entries.length) return; const filters = { ...STANDARD_FILTERS, count: 6, includeLegendaries: true, includeMythicals: true, teamMode: smart ? "smart" as const : "random" as const }; try { const additions = generatePokemon(entries, filters, `PLANNER-${Date.now()}`, team); setTeamSlugs([...teamSlugs, ...additions.map(({ pokemon }) => pokemon.slug)]); setMessage(smart ? "Remaining slots filled for broader defensive variety." : "Remaining slots randomized."); } catch { setMessage("The remaining slots could not be filled."); } };

  return <section className="tool-shell team-planner-tool">
    <div className="planner-builder"><div className="planner-heading"><div><span className="eyebrow">TEAM BUILDER</span><h2>Your team</h2></div><strong>{team.length}/6</strong></div>
      <div className="planner-slots">{Array.from({ length: 6 }, (_, index) => { const member = team[index]; return member ? <article className="planner-slot filled" key={member.pokemon.slug}>{ }<img src={member.pokemon.sprite} alt="" /><Link href={`/pokemon/${member.pokemon.slug}`}>{member.pokemon.name}</Link><div>{member.pokemon.types.map((type) => <TypeBadge type={type} key={type} />)}</div><button onClick={() => setTeamSlugs(teamSlugs.filter((_, slot) => slot !== index))} aria-label={`Remove ${member.pokemon.name}`}>×</button></article> : <div className="planner-slot" key={index}><span>{index + 1}</span><small>Open slot</small></div>; })}</div>
      {team.length < 6 && <PokemonSelector entries={entries} selected={teamSlugs} onSelect={(entry) => setTeamSlugs([...teamSlugs, entry.slug])} />}
      <div className="planner-actions"><button onClick={() => fill(false)} disabled={team.length >= 6 || loading}>Randomize Remaining</button><button className="generate-button" onClick={() => fill(true)} disabled={team.length >= 6 || loading}>Improve Coverage</button><button onClick={() => setTeamSlugs([])} disabled={!team.length}>Clear Team</button></div>
      {(error || message) && <p className="tool-message" role="status">{error || message}</p>}
    </div>
    <div className="planner-analysis"><div className="content-heading"><span className="eyebrow">LIVE ANALYSIS</span><h2>Coverage &amp; gaps</h2><p>Type-level guidance only; moves, abilities, items, and formats can change real battle performance.</p></div>{team.length ? <>
      <div className="analysis-summary compact">{[["Pokémon", team.length], ["Unique types", analysis.uniqueTypes], ["Average BST", analysis.averageBst], ["Coverage", `${offensiveCoverage.length}/18`]].map(([label, value]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
      <div className="planner-analysis-grid"><article><h3>Shared weaknesses</h3><div className="type-cloud">{analysis.weaknesses.map((entry) => <TypeBadge type={entry.type} count={entry.count} key={entry.type} />)}</div></article><article><h3>Resistances</h3><div className="type-cloud">{analysis.resistances.map((entry) => <TypeBadge type={entry.type} count={entry.count} key={entry.type} />)}</div></article><article><h3>Immunities</h3><div className="type-cloud">{immunities.map((entry) => <TypeBadge type={entry.type} count={entry.count} key={entry.type} />)}</div></article><article><h3>Offensive coverage</h3><div className="type-cloud">{offensiveCoverage.map((type) => <TypeBadge type={type} key={type} />)}</div></article></div>
      <div className="team-tips">{gaps.map((gap) => <p key={gap}><span>◇</span>{gap}</p>)}</div>
    </> : <p className="empty-saved">Add a Pokémon to begin the analysis.</p>}</div>
  </section>;
}
