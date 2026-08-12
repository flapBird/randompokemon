import type { Metadata } from "next";
import Link from "next/link";
import { Faq, type FaqItem } from "@/components/content/Faq";
import { JsonLd } from "@/components/content/JsonLd";
import { PokemonGenerator } from "@/components/generator/PokemonGenerator";
import { STANDARD_FILTERS } from "@/lib/defaults";
import { baseSchemas } from "@/lib/seo";
import { createStaticGeneration } from "@/lib/static-generation";

export const metadata: Metadata = {
  title: { absolute: "Random Pokémon Generator – All 1,025 Pokémon, Gen 1–9" },
  description: "Generate 1–6 random Pokémon from all nine generations. Filter by type, region, evolution, Legendary status, forms, and base stats. Free, no signup.",
  alternates: { canonical: "/" },
};

const faq: FaqItem[] = [
  { question: "How does the random Pokémon generator work?", answer: "It filters a local Generation 1–9 dataset using your settings, then uses a seeded random number generator to select every result evenly from the matching pool." },
  { question: "Does the generator create a full team of six?", answer: "Yes. The homepage starts with six Pokémon. You can lock individual members, reroll only the remaining slots, or change the team size when you want a smaller challenge." },
  { question: "Can I choose a specific generation or type?", answer: "Yes. Select one or more generations and Pokémon types. Match Any accepts either selected type, while Match All requires both." },
  { question: "Can I exclude Legendary Pokémon?", answer: "Yes. Legendary and Mythical Pokémon are excluded by default. You can include either category separately or use the No Legendaries quick mode." },
  { question: "What is Smart Team mode?", answer: "Smart Team samples several valid random teams and favors type and evolution variety with fewer shared weaknesses. It is not a competitive team builder." },
  { question: "Can I share the same random team with a friend?", answer: "Yes. Copy Share Link includes the seed, filters, mode, and current Pokémon so the same team opens automatically." },
  { question: "Are shiny Pokémon included?", answer: "Every card has a Shiny toggle. It changes only the artwork and never rerolls the Pokémon, ability, nature, or team." },
  { question: "Is this an official Pokémon website?", answer: "No. RandomPokemon.xyz is an independent, unofficial fan-made tool and is not affiliated with Nintendo, Game Freak, Creatures Inc., or The Pokémon Company." },
];

export default function Home() {
  const initialGeneration = createStaticGeneration(STANDARD_FILTERS, "WELCOME-TEAM");

  return (
    <>
      <JsonLd data={baseSchemas(faq)} />
      <section className="hero home-hero">
        <div className="hero-copy">
          <h1>Random Pokémon <em>Generator</em></h1>
          <p>Generate 1–6 random Pokémon from all 1,025 species across Generations 1–9, then lock favorites, reroll slots, and share the exact seed.</p>
        </div>
      </section>
      <PokemonGenerator
        initialFilters={STANDARD_FILTERS}
        initialResults={initialGeneration.results}
        initialSeed={initialGeneration.seed}
      />
      <div className="content-wrap">
        <section className="content-section split-content">
          <div><span className="eyebrow">THE TOOL</span><h2>What is a random Pokémon generator?</h2></div>
          <div>
            <p>A random Pokémon generator is a quick way to turn 1,025 main species across nine generations into one pick or a complete team. Narrow the pool when you want, keep good rolls, replace weak links, and send the exact result to a friend.</p>
            <p>The generator runs from local data, so there is no long chain of API requests while you use it. That keeps each reroll quick on desktop and mobile.</p>
          </div>
        </section>
        <section className="content-section">
          <div className="content-heading"><span className="eyebrow">THREE STEPS</span><h2>How to generate a random Pokémon</h2></div>
          <div className="steps-grid">
            <article><span>01</span><h3>Choose a style</h3><p>Start with a Smart Team, switch to Pure Random, or create a monotype squad.</p></article>
            <article><span>02</span><h3>Shape the pool</h3><p>Filter by generation, type, region, evolution, stats, and special Pokémon categories.</p></article>
            <article><span>03</span><h3>Keep and remix</h3><p>Lock favorite cards, reroll the rest, inspect weaknesses, and copy a permanent seed link.</p></article>
          </div>
        </section>
        <section className="content-section">
          <div className="content-heading"><span className="eyebrow">FILTERS EXPLAINED</span><h2>Control the pool without losing the surprise</h2><p>Every restriction is applied before the seeded roll, so the generator never swaps in a Pokémon outside the rules you selected.</p></div>
          <div className="use-grid filter-explainer-grid">
            <article><h3>Generations and regions</h3><p>Choose one or more generations, regions, or an overlapping combination such as Generation 1 and Kanto.</p></article>
            <article><h3>Types and matching</h3><p>Match Any accepts either selected type. Match All requires a dual-type Pokémon containing both.</p></article>
            <article><h3>Legendary and Mythical</h3><p>Both are excluded initially and controlled separately, including a dedicated Legendary-only option.</p></article>
            <article><h3>Evolution and base stats</h3><p>Limit by evolution stage, require fully evolved Pokémon, or set a minimum and maximum BST.</p></article>
            <article><h3>Forms and categories</h3><p>Decide whether regional forms, Mega Evolutions, Gigantamax forms, Paradox Pokémon, and Ultra Beasts are eligible.</p></article>
            <article><h3>Seeds and team modes</h3><p>Pure Random selects uniformly. Smart Team samples valid rolls for more variety and fewer shared weaknesses.</p></article>
          </div>
        </section>
        <section className="content-section">
          <div className="content-heading"><span className="eyebrow">COMPLETE COVERAGE</span><h2>All Pokémon generations covered</h2><p>The bundled dataset covers every main species from Bulbasaur through Pecharunt, plus supported regional, Mega, and Gigantamax forms.</p></div>
          <div className="generation-table-wrap">
            <table className="generation-table">
              <caption className="sr-only">Pokémon generations, regions, and National Pokédex ranges</caption>
              <thead><tr><th>Generation</th><th>Main region</th><th>National Pokédex</th></tr></thead>
              <tbody>
                {[
                  ["Gen 1", "Kanto", "#001–151"], ["Gen 2", "Johto", "#152–251"], ["Gen 3", "Hoenn", "#252–386"],
                  ["Gen 4", "Sinnoh", "#387–493"], ["Gen 5", "Unova", "#494–649"], ["Gen 6", "Kalos", "#650–721"],
                  ["Gen 7", "Alola", "#722–809"], ["Gen 8", "Galar & Hisui", "#810–905"], ["Gen 9", "Paldea", "#906–1025"],
                ].map(([generation, region, range]) => <tr key={generation}><th scope="row">{generation}</th><td>{region}</td><td>{range}</td></tr>)}
              </tbody>
            </table>
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
        <section className="content-section">
          <div className="content-heading"><span className="eyebrow">SPECIALIZED GENERATORS</span><h2>Start with a focused Pokémon pool</h2><p>Each page opens with purpose-built defaults and a static, shareable first result.</p></div>
          <div className="use-grid related-generator-grid">
            {[
              ["/random-pokemon-legendary-generator", "Legendary Pokémon Generator", "Roll one Legendary or expand the count into a full team."],
              ["/random-shiny-pokemon-generator", "Shiny Pokémon Generator", "Choose from all 1,025 species with shiny artwork enabled."],
              ["/random-nuzlocke-pokemon-generator", "Nuzlocke Pokémon Generator", "Create a reproducible encounter for custom challenge rules."],
              ["/random-pokemon-starter-generator", "Starter Generator", "Pick a traditional Grass, Fire, or Water first partner."],
              ["/kanto-pokemon-generator", "Kanto Generator", "Build from Pokédex #001–151 and Generation 1."],
              ["/paldea-pokemon-generator", "Paldea Generator", "Build from Generation 9 species #906–1025."],
            ].map(([href, title, copy]) => <article key={href}><h3><Link href={href}>{title}</Link></h3><p>{copy}</p></article>)}
          </div>
        </section>
        <Faq items={faq} />
      </div>
    </>
  );
}
