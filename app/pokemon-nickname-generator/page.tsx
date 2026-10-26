import type { Metadata } from "next";
import Link from "next/link";
import { Faq } from "@/components/content/Faq";
import { JsonLd } from "@/components/content/JsonLd";
import { PokemonNicknameGenerator } from "@/components/tools/PokemonNicknameGenerator";
import { breadcrumbSchema, faqSchema, organizationSchema, webApplicationSchema } from "@/lib/seo";

const path = "/pokemon-nickname-generator";
const description = "Generate Pokémon nicknames by type and style—cute, cool, funny, or fierce—for any species in your party. One click copies each idea.";
const faq = [
  { question: "What makes a good Pokémon nickname?", answer: "Good nicknames are short, easy to say in battle, and match the Pokémon's type, look, or personality. Basing the name on its primary type keeps it fitting no matter how it evolves." },
  { question: "Are there nickname length limits in the games?", answer: "Yes. Mainline games limit nicknames to 12 characters, and names cannot start or end with a space. Every suggestion on this page fits that limit." },
  { question: "Can I rename a Pokémon later?", answer: "Usually yes. Any Name Rater in the region's towns will rename a Pokémon you caught yourself, though traded Pokémon keep the name their original trainer gave them." },
  { question: "Is the nickname generator free?", answer: "Yes. It runs in your browser with no account or download, and clicking a nickname copies it to your clipboard instantly." },
];

export const metadata: Metadata = {
  title: { absolute: "Pokémon Nickname Generator – Cute, Cool & Funny Ideas" },
  description,
  alternates: { canonical: path },
  openGraph: { title: "Pokémon Nickname Generator", description, url: path },
};

export default function Page() {
  return (
    <>
      <JsonLd data={[organizationSchema(), webApplicationSchema("Pokémon Nickname Generator", path, description), faqSchema(faq), breadcrumbSchema([["Home", "/"], ["Pokémon Nickname Generator", path]])]} />
      <section className="subpage-hero">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Pokémon Nickname Generator</span></nav>
        <h1>Pokémon Nickname <em>Generator</em></h1>
        <p>Choose a type and a vibe, get nine ready-to-use nicknames. Tap any name to copy it for your next catch.</p>
      </section>
      <PokemonNicknameGenerator />
      <div className="content-wrap">
        <section className="content-section">
          <div className="content-heading"><span className="eyebrow">HOW TO USE IT</span><h2>From random idea to party roster</h2><p>Nicknames hit hardest in Nuzlockes, monotype runs, and any challenge where every team member matters.</p></div>
          <div className="steps-grid">
            <article><span>01</span><h3>Pick the primary type</h3><p>The generator builds word banks around all 18 types, so a Water starter gets Tide-flavored ideas while an Electric pick gets Volt-flavored ones.</p></article>
            <article><span>02</span><h3>Choose a style</h3><p>Cute, Cool, Funny, or Fierce—each style reshapes the same type words into different patterns.</p></article>
            <article><span>03</span><h3>Copy and name</h3><p>Click a nickname to copy it. Generate again for nine fresh options, or mix results from two styles.</p></article>
          </div>
        </section>
        <section className="content-section split-content">
          <div><span className="eyebrow">NICKNAME TRADITIONS</span><h2>Why players name their teams at all</h2></div>
          <div><p>Nicknames turn “Charizard #3” into a character. Challenge runners swear by them: a Nuzlocke with named Pokémon hurts more when one faints, and that emotional stake is the point. Draft leagues also require nicknames to keep trade histories clear.</p><p>If you are naming a whole new team, roll six species first with the <Link href="/">Random Pokémon Generator</Link>, then name each one by its type. For themed runs, the <Link href="/pokemon-type-wheel">Type Wheel</Link> decides the typing and this page handles the rest.</p></div>
        </section>
        <Faq items={faq} id="nickname-faq" />
      </div>
    </>
  );
}
