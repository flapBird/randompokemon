import type { Metadata } from "next";
import { Faq, type FaqItem } from "@/components/content/Faq";
import { JsonLd } from "@/components/content/JsonLd";
import { PokemonGenerator } from "@/components/generator/PokemonGenerator";
import { STARTER_FILTERS } from "@/lib/defaults";
import { breadcrumbSchema, faqSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Random Pokémon Starter Generator – Pick a Starter",
  description: "Choose a random Pokémon starter by generation or type for your next playthrough, Nuzlocke, or Pokémon challenge.",
  alternates: { canonical: "/random-pokemon-starter-generator" },
  openGraph: {
    title: "Random Pokémon Starter Generator – Pick a Starter",
    description: "Pick a random Grass, Fire, or Water starter for a playthrough, Nuzlocke, or friendly challenge.",
    url: "/random-pokemon-starter-generator",
  },
};

const faq: FaqItem[] = [
  { question: "Which Pokémon count as starters?", answer: "The default pool contains the Grass, Fire, and Water first partners from the nine main-series generations." },
  { question: "Can Pikachu or Eevee be selected?", answer: "Yes. Turn on Include Pikachu or Include Eevee to add the partner choices from Pokémon Yellow and Pokémon: Let’s Go." },
  { question: "Can I pick a starter from one generation?", answer: "Yes. Select any one generation, or combine several generations into a custom starter pool." },
  { question: "Can I choose only Fire, Water, or Grass starters?", answer: "Yes. The starter type control can limit the pool to Fire, Water, or Grass, or leave all three available." },
  { question: "Is the same starter reproducible from a seed?", answer: "Yes. A seed with the same generation, type, Pikachu, and Eevee settings produces the same starter." },
  { question: "Is this useful for a Nuzlocke?", answer: "Yes. Use the result as your starter rule for a randomized Nuzlocke, a casual replay, or a challenge among friends." },
];

export default function StarterGeneratorPage() {
  return (
    <>
      <JsonLd data={[
        faqSchema(faq),
        breadcrumbSchema([["Home", "/"], ["Random Pokémon Starter Generator", "/random-pokemon-starter-generator"]]),
      ]} />
      <section className="subpage-hero starter-hero">
        <h1>Random Pokémon<br /><em>Starter Generator</em></h1>
        <p>Pick a random starter by generation or type for your next playthrough, Nuzlocke, random run, or friendly challenge.</p>
      </section>
      <PokemonGenerator initialFilters={STARTER_FILTERS} pageMode="starter" />
      <div className="content-wrap">
        <section className="content-section">
          <div className="content-heading"><span className="eyebrow">ONE FAIR PICK</span><h2>Choose a starter without overthinking it</h2><p>Set your eligible games, choose a classic starter type if you want, and let the seed make the final call.</p></div>
          <div className="use-grid">
            <article><h3>Start a new playthrough</h3><p>Break out of your usual pick and begin with a partner you might normally skip.</p></article>
            <article><h3>Set a Nuzlocke rule</h3><p>Use a shared seed so friends can verify or play the same starter challenge.</p></article>
            <article><h3>Run a friendly challenge</h3><p>Give everyone one roll, or reroll until each person receives a different starter.</p></article>
            <article><h3>Plan a themed run</h3><p>Limit the pool by generation or Grass, Fire, and Water to match your rules.</p></article>
          </div>
        </section>
        <section className="content-section split-content">
          <div><span className="eyebrow">THE POOL</span><h2>Main-series starters, clearly filtered</h2></div>
          <div><p>The core pool includes all twenty-seven traditional Grass, Fire, and Water starters from Generations 1–9. Pikachu and Eevee are optional because they are special partner choices rather than members of the traditional starter trio.</p><p>Every result uses the same card as the full generator, so you can inspect abilities and stats, switch to shiny artwork, save the pick, or share it by seed.</p></div>
        </section>
        <Faq items={faq} id="starter-faq" />
      </div>
    </>
  );
}
