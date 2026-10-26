import type { Metadata } from "next";
import Link from "next/link";
import { Faq } from "@/components/content/Faq";
import { JsonLd } from "@/components/content/JsonLd";
import { PokemonIvCalculator } from "@/components/tools/PokemonIvCalculator";
import { breadcrumbSchema, faqSchema, organizationSchema, webApplicationSchema } from "@/lib/seo";

const path = "/pokemon-iv-calculator";
const description = "Work out a Pokémon's Individual Values from its shown stats, level, nature, and EVs. Supports all Generations 3+ games, with per-stat IV ranges.";
const faq = [
  { question: "What are IVs in Pokémon?", answer: "Individual Values are hidden 0–31 bonuses each Pokémon has per stat. Two Pokémon of the same species and level can differ by up to 31 points in a stat purely because of IVs. They are fixed at capture or hatching and cannot be raised above 31 by leveling." },
  { question: "How accurate is this IV calculator?", answer: "The calculator inverts the official Gen 3+ stat formula, so it is exact. Low levels leave several IVs that produce the same shown stat (for example IV 24–31 at level 5); higher levels narrow the range, and level 100 pinpoints every IV exactly." },
  { question: "Which stats and inputs do I need?", answer: "The stat values shown on the Pokémon's summary screen, its level, its nature, and how many EVs it has invested. For a freshly caught or hatched Pokémon, EVs are 0 in every stat." },
  { question: "Why does a stat show 'Impossible'?", answer: "No IV from 0 to 31 produces that shown stat with the level, nature, and EVs you entered. The usual causes are a typo in the observed stat, the wrong level, or forgotten EV training—check those first." },
];

export const metadata: Metadata = {
  title: { absolute: "Pokémon IV Calculator – Exact IV Ranges for Gen 3+" },
  description,
  alternates: { canonical: path },
  openGraph: { title: "Pokémon IV Calculator", description, url: path },
};

export default function Page() {
  return (
    <>
      <JsonLd data={[organizationSchema(), webApplicationSchema("Pokémon IV Calculator", path, description), faqSchema(faq), breadcrumbSchema([["Home", "/"], ["Pokémon IV Calculator", path]])]} />
      <section className="subpage-hero">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Pokémon IV Calculator</span></nav>
        <h1>Pokémon IV <em>Calculator</em></h1>
        <p>Enter a Pokémon&apos;s shown stats, level, nature, and EVs to reveal its hidden Individual Values—the numbers competitive breeding is built on.</p>
      </section>
      <PokemonIvCalculator />
      <div className="content-wrap">
        <section className="content-section">
          <div className="content-heading"><span className="eyebrow">HOW TO USE IT</span><h2>From summary screen to verdict in one pass</h2><p>The calculator checks all 32 possible IVs per stat against the official formula, so ranges are exact.</p></div>
          <div className="steps-grid">
            <article><span>01</span><h3>Pick the species and level</h3><p>Base stats come from the site&apos;s Pokédex data. Higher levels narrow each range—level 100 gives exact values.</p></article>
            <article><span>02</span><h3>Set the nature and EVs</h3><p>A nature adds 10% to one stat and cuts 10% from another. Untrained Pokémon have 0 EVs everywhere.</p></article>
            <article><span>03</span><h3>Read the ranges</h3><p>Each row shows the IVs consistent with your inputs. “Impossible” means a typo or forgotten EV investment somewhere.</p></article>
          </div>
        </section>
        <section className="content-section split-content">
          <div><span className="eyebrow">WHAT IVS MEAN</span><h2>Why breeders obsess over 31</h2></div>
          <div><p>At level 100 a single IV is worth exactly one stat point, and competitive formats routinely settle around level 50—where a 31/31/31/x/31/31 spread versus a careless catch is the difference between outspeeding and losing the mirror match. Hidden Power in older games also depended on exact IV combinations, which is why calculators like this one were staple tools.</p><p>Checking a catch before training it saves hours: roll the species with the <Link href="/">Random Pokémon Generator</Link>, and once you know the IVs, see whether the typing is worth building around in the <Link href="/team-planner">Team Planner</Link>. The <Link href="/pokemon-type-chart">Type Chart</Link> covers the rest of the theory.</p></div>
        </section>
        <Faq items={faq} id="iv-calculator-faq" />
      </div>
    </>
  );
}
