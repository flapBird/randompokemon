import type { Metadata } from "next";
import Link from "next/link";
import { Faq, type FaqItem } from "@/components/content/Faq";
import { JsonLd } from "@/components/content/JsonLd";
import { PokemonGenerator } from "@/components/generator/PokemonGenerator";
import { REGION_GUIDES } from "@/data/regions";
import { STANDARD_FILTERS } from "@/lib/defaults";
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

export default function Home() {
  const initialGeneration = createStaticGeneration(STANDARD_FILTERS, "WELCOME-TEAM");

  return (
    <>
      <JsonLd data={baseSchemas(faq)} />
      <section className="hero home-hero" id="generator">
        <div className="hero-copy">
          <h1>Random Pokémon <em>Generator</em></h1>
          <p>Pick a Pokémon or build a team. Keep your favorites and roll again.</p>
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
            {[
              ["/favorite-pokemon-picker", "Favorite Pokémon Picker", "Choose head-to-head and build a shareable shortlist.", "PICK"],
              ["/pokemon-type-wheel", "Pokémon Type Wheel", "Spin all 18 types, then generate a matching Pokémon or team.", "SPIN"],
              ["/team-planner", "Team Planner", "Choose up to six Pokémon and inspect coverage gaps.", "PLAN"],
              ["/compare-pokemon", "Compare Pokémon", "Compare stats, types, abilities, and matchups side by side.", "VS"],
            ].map(([href, title, copy, mark]) => <Link href={href} className="tool-card" key={href}><span>{mark}</span><h3>{title}</h3><p>{copy}</p><strong>Open tool →</strong></Link>)}
          </div>
        </section>
        <section className="content-section" id="generators">
          <div className="content-heading"><span className="eyebrow">POPULAR GENERATORS</span><h2>Start with a focused Pokémon pool</h2><p>Pick a Shiny hunt target, a starter, or a challenge encounter.</p></div>
          <div className="use-grid related-generator-grid">
            {[
              ["/random-shiny-pokemon-generator", "Shiny Pokémon Generator", "Choose from all 1,025 species with Shiny artwork enabled."],
              ["/random-pokemon-legendary-generator", "Legendary Pokémon Generator", "Roll one Legendary or expand the count into a full team."],
              ["/random-pokemon-starter-generator", "Starter Pokémon Generator", "Pick a traditional Grass, Fire, or Water first partner."],
              ["/random-nuzlocke-pokemon-generator", "Nuzlocke Pokémon Generator", "Create a reproducible encounter for custom challenge rules."],
            ].map(([href, title, copy]) => <article key={href}><h3><Link href={href}>{title}</Link></h3><p>{copy}</p></article>)}
          </div>
        </section>
        <section className="content-section region-discovery" id="regions">
          <div className="content-heading"><span className="eyebrow">GENERATE BY REGION</span><h2>Choose a regional Pokémon pool</h2><p>Each compact shortcut opens an existing generator with its own starters, Legendary Pokémon, games, and regional preset.</p></div>
          <nav className="region-chip-list" aria-label="Pokémon generators by region">
            {REGION_GUIDES.map((region) => <Link href={`/${region.slug}-pokemon-generator`} key={region.slug}>{region.name}<small>Gen {region.generation}</small></Link>)}
          </nav>
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
            ].map(([href, title, copy]) => <Link href={href} key={href}><strong>{title}</strong><span>{copy}</span></Link>)}
          </div>
        </section>
        <Faq items={faq} />
      </div>
    </>
  );
}
