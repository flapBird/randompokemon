import type { Metadata } from "next";
import Link from "next/link";
import { Faq } from "@/components/content/Faq";
import { JsonLd } from "@/components/content/JsonLd";
import { PokemonTypeWheel } from "@/components/tools/PokemonTypeWheel";
import { breadcrumbSchema, faqSchema, organizationSchema, webApplicationSchema } from "@/lib/seo";

const path = "/pokemon-type-wheel";
const description = "Spin a Pokémon Type Wheel with all 18 types and instantly get a random Pokémon from the winning type for teams, challenges, or creative prompts.";
const faq = [
  { question: "How many Pokémon types are on the wheel?", answer: "The wheel includes all 18 current Pokémon types, from Normal and Fire through Steel and Fairy." },
  { question: "Can I remove types from the wheel?", answer: "Yes. Tap any type to exclude or restore it, use Clear to build a smaller pool, or Select all to reset the wheel." },
  { question: "What happens after the wheel stops?", answer: "The winning type and one random Pokémon of that type appear immediately on this page. You can pick another matching Pokémon without spinning again." },
  { question: "How can I use a Pokémon Type Wheel?", answer: "Use it to choose a monotype challenge, drawing prompt, draft rule, team theme, starter restriction, or any game where the type should be decided fairly." },
];

export const metadata: Metadata = {
  title: { absolute: "Pokémon Type Wheel – Spin All 18 Types" },
  description,
  alternates: { canonical: path },
  openGraph: { title: "Pokémon Type Wheel", description, url: path },
};

export default function Page() {
  return (
    <>
      <JsonLd data={[organizationSchema(), webApplicationSchema("Pokémon Type Wheel", path, description), faqSchema(faq), breadcrumbSchema([["Home", "/"], ["Pokémon Type Wheel", path]])]} />
      <section className="subpage-hero">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Pokémon Type Wheel</span></nav>
        <h1>Pokémon Type <em>Wheel</em></h1>
        <p>Spin all 18 types—or make your own smaller pool—and get a matching random Pokémon directly on this page.</p>
      </section>
      <PokemonTypeWheel />
      <div className="content-wrap">
        <section className="content-section">
          <div className="content-heading"><span className="eyebrow">HOW TO PLAY</span><h2>From one spin to a usable Pokémon pick</h2><p>The wheel makes one fair type decision, then immediately turns it into a Pokémon result.</p></div>
          <div className="steps-grid">
            <article><span>01</span><h3>Choose the pool</h3><p>Leave all 18 types enabled for maximum surprise, or remove types that do not fit your challenge.</p></article>
            <article><span>02</span><h3>Spin once</h3><p>The pointer selects one enabled type. Every enabled type has the same chance to win.</p></article>
            <article><span>03</span><h3>Use the Pokémon</h3><p>A matching random Pokémon appears on the same page. Reroll that pick, plan around it, or browse its type.</p></article>
          </div>
        </section>
        <section className="content-section split-content">
          <div><span className="eyebrow">WHAT IT IS FOR</span><h2>A quick rule maker, not just an animation</h2></div>
          <div><p>Use the wheel whenever the type should be decided before the Pokémon: monotype teams, Nuzlocke restrictions, drawing prompts, draft nights, tabletop encounters, or friendly challenges.</p><p>The wheel only chooses from the types you enable. After it stops, the page samples the site’s 1,025-species Pokédex for a Pokémon containing that type, including dual-type Pokémon. Picking another Pokémon keeps the same winning type; spinning again starts a new type draw.</p></div>
        </section>
        <section className="content-section">
          <div className="content-heading"><span className="eyebrow">WAYS TO USE IT</span><h2>Four simple challenge ideas</h2></div>
          <div className="use-grid">
            <article><h3>Monotype team</h3><p>Spin one type, then build a full team where every member shares it.</p></article>
            <article><h3>Drawing prompt</h3><p>Use the random matching Pokémon as the subject for a sketch or design exercise.</p></article>
            <article><h3>Draft restriction</h3><p>Give each player a spin and limit their next choice to the winning type.</p></article>
            <article><h3>Team starting point</h3><p>Take the generated Pokémon into Team Planner and fill its coverage gaps.</p></article>
          </div>
        </section>
        <Faq items={faq} id="type-wheel-faq" />
      </div>
    </>
  );
}
