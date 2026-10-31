import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { Faq, type FaqItem } from "@/components/content/Faq";
import { JsonLd } from "@/components/content/JsonLd";
import { PokemonGenerator } from "@/components/generator/PokemonGenerator";
import { SpriteImage } from "@/components/pokemon/SpriteImage";
import { REGION_GUIDES } from "@/data/regions";
import { STANDARD_FILTERS } from "@/lib/defaults";
import { getPokemon } from "@/lib/pokemon-catalog";
import { baseSchemas } from "@/lib/seo";
import { createStaticGeneration } from "@/lib/static-generation";

export const metadata: Metadata = {
  title: { absolute: "Random Pokémon Generator & Picker – Gen 1–9" },
  description: "Use a fast Random Pokémon Generator and picker for Gen 1–9. Generate one Pokémon or a full team with type, region, Legendary, monotype, and Smart Team filters.",
  alternates: { canonical: "/" },
};

const faq: FaqItem[] = [
  { question: "How does the random Pokémon generator work?", answer: "Pure Random gives each eligible Pokémon an equal chance. Smart Team compares random teams for type variety and fewer shared weaknesses. Both use your filters and a reproducible seed." },
  { question: "Does the generator create a full team of six?", answer: "Yes. The homepage starts with six Pokémon. You can lock individual members, reroll only the remaining slots, or change the team size when you want a smaller challenge." },
  { question: "Can I choose a specific generation or type?", answer: "Yes. Select one or more generations and Pokémon types. Match Any accepts either selected type, while Match All requires both." },
  { question: "Can I exclude Legendary Pokémon?", answer: "Yes. Legendary and Mythical Pokémon are excluded by default. You can include either category separately or use the No Legendaries quick mode." },
  { question: "What is Smart Team mode?", answer: "Smart Team samples several valid random teams and favors type and evolution variety with fewer shared weaknesses. It is not a competitive team builder." },
  { question: "Can I share the same random team with a friend?", answer: "Yes. Copy Share Link includes the seed, filters, mode, and current Pokémon so the same team opens automatically." },
  { question: "Are shiny Pokémon included?", answer: "Every card has a Shiny toggle. It changes only the artwork and never rerolls the Pokémon, ability, nature, or team." },
  { question: "Is this a Pokémon randomizer?", answer: "It is a browser-based random Pokémon generator and picker. It selects Pokémon and teams but does not modify a game or ROM like a Pokémon game randomizer." },
  { question: "Is this an official Pokémon website?", answer: "No. RandomPokemon.xyz is an independent, unofficial fan-made tool and is not affiliated with Nintendo, Game Freak, Creatures Inc., or The Pokémon Company." },
];

const PARADE_SPRITES = [6, 25, 1, 150, 7, 133, 94, 4, 143, 448, 149, 906];

const TOOL_CARDS = [
  {
    href: "/favorite-pokemon-picker",
    title: "Favorite Pokémon Picker",
    copy: "Choose head-to-head and build a shareable shortlist.",
    tone: "#b43f42",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M10 16.5 C4.5 12.8 2.4 9.8 3.4 6.9 C4.1 4.9 6.4 4 8.1 5 C9 5.5 9.6 6.3 10 7 C10.4 6.3 11 5.5 11.9 5 C13.6 4 15.9 4.9 16.6 6.9 C17.6 9.8 15.5 12.8 10 16.5 Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/pokemon-type-wheel",
    title: "Pokémon Type Wheel",
    copy: "Spin all 18 types, then generate a matching Pokémon or team.",
    tone: "#c69000",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="10" cy="10" r="7.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 2.6 V6.2 M17.4 10 H13.8 M10 17.4 V13.8 M2.6 10 H6.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/team-planner",
    title: "Team Planner",
    copy: "Choose up to six Pokémon and inspect coverage gaps.",
    tone: "#4d8e4e",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
        <rect x="2.8" y="2.8" width="5.6" height="5.6" rx="1.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <rect x="11.6" y="2.8" width="5.6" height="5.6" rx="1.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <rect x="2.8" y="11.6" width="5.6" height="5.6" rx="1.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M11.6 14.4 h5.6 M14.4 11.6 v5.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/compare-pokemon",
    title: "Compare Pokémon",
    copy: "Compare stats, types, abilities, and matchups side by side.",
    tone: "#5e55ad",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M3.4 3.4 L8.4 8.4 M16.6 3.4 L11.6 8.4 M3.4 16.6 L8.4 11.6 M16.6 16.6 L11.6 11.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="10" cy="10" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
];

const GENERATOR_CARDS = [
  { href: "/random-shiny-pokemon-generator", title: "Shiny Pokémon Generator", copy: "Choose from all 1,025 species with Shiny artwork enabled.", sprite: 385, tone: "shiny" },
  { href: "/random-pokemon-legendary-generator", title: "Legendary Pokémon Generator", copy: "Roll one Legendary or expand the count into a full team.", sprite: 150, tone: "psychic" },
  { href: "/random-pokemon-starter-generator", title: "Starter Pokémon Generator", copy: "Pick a traditional Grass, Fire, or Water first partner.", sprite: 4, tone: "fire" },
  { href: "/random-nuzlocke-pokemon-generator", title: "Nuzlocke Pokémon Generator", copy: "Create a reproducible encounter for custom challenge rules.", sprite: 94, tone: "ghost" },
];

export default function Home() {
  const initialGeneration = createStaticGeneration(STANDARD_FILTERS, "WELCOME-TEAM");

  return (
    <>
      <JsonLd data={baseSchemas(faq)} />
      <section className="home-hero" id="generator">
        <div className="hero-copy">
          <span className="eyebrow">GEN 1–9 · 1,025 POKÉMON · NO SIGNUP</span>
          <h1>Random Pokémon <em>Generator</em></h1>
          <p>Roll one Pokémon or a full team of six. Lock your favorites, reroll the rest, share the exact result.</p>
          <div className="sprite-parade" aria-hidden="true">
            {PARADE_SPRITES.map((id, index) => (
              <span className={`parade-item${id === 25 ? " parade-shiny" : ""}`} key={id}>
                <SpriteImage src={`/sprites/${id}.png`} alt="" width={id === 25 ? 78 : 72} height={id === 25 ? 78 : 72} loading={index < 4 ? "eager" : "lazy"} />
                {id === 25 && <span className="shiny-tag">+Shiny</span>}
              </span>
            ))}
          </div>
          <div className="hero-cta-row">
            <Link className="generate-button" href="#generator">Generate a team</Link>
            <Link className="ghost-button" href="/pokemon">Browse the Pokédex</Link>
          </div>
          <span className="hero-trust">Reproducible seeds · Share links · Dark mode included</span>
        </div>
      </section>
      <PokemonGenerator
        initialFilters={STANDARD_FILTERS}
        initialResults={initialGeneration.results}
        initialSeed={initialGeneration.seed}
      />
      <div className="content-wrap">
        <section className="content-section tools-discovery">
          <div className="content-heading"><span className="eyebrow">EXPLORE POKÉMON TOOLS</span><h2>Keep exploring after the roll</h2><p>Rank your favorites, spin a type, plan a team, or compare two Pokémon without leaving the shared Pokédex.</p></div>
          <div className="tool-card-grid">
            {TOOL_CARDS.map((card) => (
              <Link href={card.href} className="tool-card" key={card.href}>
                <span className="tool-icon" style={{ "--tile": card.tone } as CSSProperties}>{card.icon}</span>
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
                <strong>Open tool →</strong>
              </Link>
            ))}
          </div>
        </section>
        <section className="content-section" id="generators">
          <div className="content-heading"><span className="eyebrow">POPULAR GENERATORS</span><h2>Start with a focused Pokémon pool</h2><p>Pick a Shiny hunt target, a starter, or a challenge encounter.</p></div>
          <div className="gen-card-grid">
            {GENERATOR_CARDS.map((card) => (
              <Link href={card.href} className="gen-card" key={card.href}>
                <span className="gen-card-art" data-type={card.tone === "shiny" ? undefined : card.tone} data-art={card.tone === "shiny" ? "shiny" : undefined}>
                  <SpriteImage src={`/sprites/${card.sprite}.png`} alt="" width={62} height={62} loading="lazy" />
                </span>
                <span className="gen-card-copy">
                  <h3>{card.title}</h3>
                  <p>{card.copy}</p>
                  <span className="gen-card-link">Open →</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
        <section className="content-section region-discovery" id="regions">
          <div className="content-heading"><span className="eyebrow">GENERATE BY REGION</span><h2>Choose a regional Pokémon pool</h2><p>Each shortcut opens the regional generator with its own starters, Legendary Pokémon, and games.</p></div>
          <div className="region-card-grid">
            {REGION_GUIDES.map((region) => {
              const starter = getPokemon(region.starters[0]);
              return (
                <Link href={`/${region.slug}-pokemon-generator`} className="region-card" key={region.slug}>
                  {starter && <SpriteImage src={starter.sprite} alt="" width={46} height={46} loading="lazy" />}
                  <span className="region-card-copy">
                    <strong>{region.name}</strong>
                    <small>GEN {region.generation} · {region.dexRange}</small>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
        <section className="content-section">
          <div className="content-heading"><span className="eyebrow">EXPLORE POKÉMON</span><h2>Browse the Pokémon behind each roll</h2><p>Move from the main Pokédex hub into type collections or focused Shiny, Legendary, and starter lists.</p></div>
          <div className="explore-link-list">
            {[
              ["/pokemon", "Pokédex", "Search all 1,025 Pokémon"],
              ["/pokemon#pokemon-by-type", "Pokémon by Type", "Open one of 18 type collections"],
              ["/shiny-pokemon", "Shiny Pokémon", "Compare normal and Shiny artwork"],
              ["/legendary-pokemon", "Legendary Pokémon", "Browse the complete Gen 1–9 list"],
              ["/starter-pokemon", "Starter Pokémon", "Explore every first-partner trio"],
            ].map(([href, title, copy]) => (
              <Link href={href} key={href}>
                <strong>{title}</strong>
                <span>{copy}</span>
                <span className="explore-arrow" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </section>
        <section className="home-cta-band">
          <div className="home-cta-panel">
            <div>
              <h2>Can&apos;t decide? Roll a surprise team.</h2>
              <p>Six random slots, Smart Team balancing, and a share link for the exact result.</p>
            </div>
            <Link className="lime-button" href="/?count=6&mode=smart">Generate a team</Link>
          </div>
        </section>
        <Faq items={faq} />
      </div>
    </>
  );
}
