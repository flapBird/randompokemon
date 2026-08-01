import type { Metadata } from "next";
import { Faq, type FaqItem } from "@/components/content/Faq";
import { JsonLd } from "@/components/content/JsonLd";
import { PokemonGenerator } from "@/components/generator/PokemonGenerator";
import { STANDARD_FILTERS } from "@/lib/defaults";
import { baseSchemas } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Random Pokémon Generator – Create a Pokémon or Team",
  description: "Generate a random Pokémon or build a complete team with filters for generation, type, region, evolution, and legendary status.",
};

const faq: FaqItem[] = [
  { question: "How does the random Pokémon generator work?", answer: "It filters a local Generation 1–9 dataset using your settings, then uses a seeded random number generator to select every result evenly from the matching pool." },
  { question: "Can I generate a full team of six?", answer: "Yes. Set the count to six or choose Team of 6. You can lock individual members and reroll only the remaining slots." },
  { question: "Can I choose a specific generation or type?", answer: "Yes. Select one or more generations and Pokémon types. Match Any accepts either selected type, while Match All requires both." },
  { question: "Can I exclude Legendary Pokémon?", answer: "Yes. Legendary and Mythical Pokémon are excluded by default. You can include either category separately or use the No Legendaries quick mode." },
  { question: "What is Smart Team mode?", answer: "Smart Team samples several valid random teams and favors type and evolution variety with fewer shared weaknesses. It is not a competitive team builder." },
  { question: "Can I share the same random team with a friend?", answer: "Yes. Copy Share Link includes the seed, filters, mode, and current Pokémon so the same team opens automatically." },
  { question: "Are shiny Pokémon included?", answer: "Every card has a Shiny toggle. It changes only the artwork and never rerolls the Pokémon, ability, nature, or team." },
  { question: "Is this an official Pokémon website?", answer: "No. RandomPokemon.xyz is an independent, unofficial fan-made tool and is not affiliated with Nintendo, Game Freak, Creatures Inc., or The Pokémon Company." },
];

export default function Home() {
  return (
    <>
      <link rel="canonical" href="https://randompokemon.xyz/" />
      <JsonLd data={baseSchemas(faq)} />
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">FAST · FILTERABLE · SHAREABLE</span>
          <h1>Random Pokémon<br /><em>Generator</em></h1>
          <p>Generate one random Pokémon or build a complete team with custom generations, types, regions, and special filters.</p>
        </div>
        <div className="hero-motif" aria-hidden="true">
          <div className="motif-ring"><span>?</span></div>
          <p>Who will you get?</p>
        </div>
      </section>
      <PokemonGenerator initialFilters={STANDARD_FILTERS} />
      <div className="content-wrap">
        <section className="content-section split-content">
          <div><span className="eyebrow">THE TOOL</span><h2>What is a random Pokémon generator?</h2></div>
          <div>
            <p>A random Pokémon generator is a quick way to turn more than a thousand possible picks into one useful surprise. This one goes further than a basic picker: you can narrow the pool, build a team, keep good rolls, replace weak links, and send the exact result to a friend.</p>
            <p>The generator runs from local data, so there is no long chain of API requests while you use it. That keeps each reroll quick on desktop and mobile.</p>
          </div>
        </section>
        <section className="content-section">
          <div className="content-heading"><span className="eyebrow">THREE STEPS</span><h2>How to generate a random Pokémon</h2></div>
          <div className="steps-grid">
            <article><span>01</span><h3>Choose a mode</h3><p>Start completely random, pick a starter, create a monotype squad, or jump straight to six.</p></article>
            <article><span>02</span><h3>Shape the pool</h3><p>Filter by generation, type, region, evolution, stats, and special Pokémon categories.</p></article>
            <article><span>03</span><h3>Keep and remix</h3><p>Lock favorite cards, reroll the rest, inspect weaknesses, and copy a permanent seed link.</p></article>
          </div>
        </section>
        <section className="content-section split-content">
          <div><span className="eyebrow">TEAM BUILDING</span><h2>How the team generator works</h2></div>
          <div><p>Each slot is independent once it appears. Lock the members you want to keep, reroll one card in place, or reroll every unlocked card at once. Duplicate prevention also respects locked members, so a refresh cannot quietly add the same Pokémon twice.</p><p>Remove a member when you want a smaller squad, then use Add Random Pokémon to fill open slots without rebuilding everything.</p></div>
        </section>
        <section className="content-section compare-section">
          <div className="content-heading"><span className="eyebrow">TWO STYLES</span><h2>Pure Random vs Smart Team</h2></div>
          <div className="compare-grid">
            <article><span className="compare-mark">✦</span><h3>Pure Random</h3><p>Every eligible Pokémon has an equal shot. Use it when surprise matters more than composition.</p><ul><li>Uniform selection</li><li>No strategic weighting</li><li>Best for challenges</li></ul></article>
            <article className="featured"><span className="compare-mark">◇</span><h3>Smart Team</h3><p>Samples valid teams and selects a roll with more type and evolution variety and fewer stacked weaknesses.</p><ul><li>Still random</li><li>Respects every filter</li><li>Not a competitive builder</li></ul></article>
          </div>
        </section>
        <section className="content-section">
          <div className="content-heading"><span className="eyebrow">PLAY YOUR WAY</span><h2>Ways to use the generator</h2></div>
          <div className="use-grid">
            {[
              ["Nuzlocke encounters", "Create an unexpected starter or team rule before a new run."],
              ["Draft nights", "Give every friend a seed and compare the teams you build from it."],
              ["Monotype challenges", "Pick one shared type while keeping the rest of the team surprising."],
              ["Creative prompts", "Roll a mascot, drawing subject, story character, or trivia pick."],
            ].map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
        </section>
        <Faq items={faq} />
      </div>
    </>
  );
}
