import type { Metadata } from "next";
import Link from "next/link";
import { Faq, type FaqItem } from "@/components/content/Faq";
import { JsonLd } from "@/components/content/JsonLd";
import { PokemonGenerator } from "@/components/generator/PokemonGenerator";
import { TEAM_FILTERS } from "@/lib/defaults";
import { breadcrumbSchema, faqSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Random Pokémon Team Generator – Build a Team of 6",
  description: "Create a random Pokémon team of six, lock your favorites, reroll individual members, and check shared type weaknesses.",
  alternates: { canonical: "/random-pokemon-team-generator" },
  openGraph: {
    title: "Random Pokémon Team Generator – Build a Team of 6",
    description: "Create a six-Pokémon team, lock favorites, reroll slots, and inspect shared weaknesses.",
    url: "/random-pokemon-team-generator",
  },
};

const faq: FaqItem[] = [
  { question: "Does the team generator always create six Pokémon?", answer: "It starts with six, but you can change the count from one to six or remove members after generating." },
  { question: "What happens when I lock a team member?", answer: "A locked Pokémon stays in its slot when you use Reroll Unlocked. It also stays excluded from new picks when duplicates are off." },
  { question: "Can I reroll only one team slot?", answer: "Yes. Use Reroll on any unlocked card. Every other card remains exactly where it is." },
  { question: "How does Smart Team choose a team?", answer: "It scores several random samples for type variety, evolution variety, primary-type overlap, and shared weaknesses, then returns the best sampled roll." },
  { question: "Does weakness analysis include dual types?", answer: "Yes. The analysis multiplies both defensive type matchups, including 4× weaknesses, double resistances, neutral cancellations, and immunities." },
  { question: "Can I save a team for later?", answer: "Yes. Save Team stores up to 20 favorites in this browser. Recent generations are also kept automatically." },
];

export default function TeamGeneratorPage() {
  return (
    <>
      <JsonLd data={[
        faqSchema(faq),
        breadcrumbSchema([["Home", "/"], ["Random Pokémon Team Generator", "/random-pokemon-team-generator"]]),
      ]} />
      <section className="subpage-hero">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Team Generator</span></nav>
        <span className="eyebrow">BUILD SIX · KEEP YOUR FAVORITES</span>
        <h1>Random Pokémon<br /><em>Team Generator</em></h1>
        <p>Create a random team of six, lock the members that work, reroll individual slots, and spot shared weaknesses before your next challenge.</p>
        <div className="feature-strip">
          <span>Lock every slot</span><span>Smart Team scoring</span><span>Weakness analysis</span><span>Seed sharing</span>
        </div>
      </section>
      <PokemonGenerator initialFilters={TEAM_FILTERS} pageMode="team" />
      <div className="content-wrap">
        <section className="content-section">
          <div className="content-heading"><span className="eyebrow">HOW IT WORKS</span><h2>A team you can shape, not just refresh</h2><p>Start with six and change only what needs changing.</p></div>
          <div className="steps-grid four">
            <article><span>01</span><h3>Set the rules</h3><p>Choose generations, types, regions, base stats, and rare categories.</p></article>
            <article><span>02</span><h3>Generate six</h3><p>Use Pure Random for chaos or Smart Team for more variety.</p></article>
            <article><span>03</span><h3>Lock and reroll</h3><p>Keep strong picks while replacing one slot or every unlocked slot.</p></article>
            <article><span>04</span><h3>Read and share</h3><p>Review team weaknesses, save locally, or copy a reproducible link.</p></article>
          </div>
        </section>
        <section className="content-section split-content">
          <div><span className="eyebrow">BALANCE WITHOUT THE HYPE</span><h2>What Smart Team does</h2></div>
          <div><p>Smart Team remains a random generator. It samples several teams that already satisfy your filters and prefers the sample with broader type coverage, fewer repeated primary types, fewer overloaded weaknesses, and a healthier spread of evolution stages.</p><p>It does not select moves, items, roles, EVs, or a legal competitive format. Think of it as a better starting point for a casual run—not a tournament-ready team builder.</p></div>
        </section>
        <Faq items={faq} id="team-faq" />
      </div>
    </>
  );
}
