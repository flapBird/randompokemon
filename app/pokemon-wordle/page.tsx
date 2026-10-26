import type { Metadata } from "next";
import Link from "next/link";
import { Faq } from "@/components/content/Faq";
import { JsonLd } from "@/components/content/JsonLd";
import { PokemonWordle } from "@/components/tools/PokemonWordle";
import { breadcrumbSchema, faqSchema, organizationSchema, webApplicationSchema } from "@/lib/seo";

const path = "/pokemon-wordle";
const description = "Play the daily Pokémon Wordle: guess the mystery species in 8 tries with generation, type, height, and weight hints. Free, no download, plus unlimited practice.";
const faq = [
  { question: "How does the daily Pokémon Wordle work?", answer: "Every day one mystery Pokémon is chosen from all 1,025 species. Each guess returns five clues: whether the answer's generation, height, and weight are higher or lower, and whether it shares a type with your guess. You have 8 attempts." },
  { question: "What time does the daily Pokémon reset?", answer: "A new Daily Pokémon arrives at midnight UTC, the same moment for every player worldwide. Your progress and result for the day are saved on your device." },
  { question: "Can I practice without waiting for tomorrow?", answer: "Yes. Switch to Practice mode for unlimited rounds with a random species each time—the daily puzzle stays untouched." },
  { question: "Do I need to know every species?", answer: "No. The suggestion box completes names as you type, so you can browse the whole National Pokédex while guessing. Many players keep the Pokédex open in another tab." },
];

export const metadata: Metadata = {
  title: { absolute: "Pokémon Wordle – Guess the Daily Pokémon in 8 Tries" },
  description,
  alternates: { canonical: path },
  openGraph: { title: "Pokémon Wordle", description, url: path },
};

export default function Page() {
  return (
    <>
      <JsonLd data={[organizationSchema(), webApplicationSchema("Pokémon Wordle", path, description), faqSchema(faq), breadcrumbSchema([["Home", "/"], ["Pokémon Wordle", path]])]} />
      <section className="subpage-hero">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Pokémon Wordle</span></nav>
        <h1>Pokémon <em>Wordle</em></h1>
        <p>One mystery Pokémon per day, eight guesses, five clues per row. Same puzzle for everyone—come back tomorrow for a new one.</p>
      </section>
      <PokemonWordle />
      <div className="content-wrap">
        <section className="content-section">
          <div className="content-heading"><span className="eyebrow">HOW TO PLAY</span><h2>Read the clues like a dex research task</h2><p>Every guess narrows the search space the same way a real Pokédex filter would.</p></div>
          <div className="steps-grid">
            <article><span>01</span><h3>Start broad</h3><p>A mid-generation, mid-height guess returns the most information. Avoid extremes on turn one.</p></article>
            <article><span>02</span><h3>Bisect the ranges</h3><p>Each ↑ or ↓ halves the remaining generation, height, or weight space. Two or three rows usually pin the region down.</p></article>
            <article><span>03</span><h3>Exploit shared types</h3><p>A green type means the answer carries that typing in either slot—browse the matching <Link href="/pokemon">type collection</Link> and shortlist candidates.</p></article>
          </div>
        </section>
        <section className="content-section split-content">
          <div><span className="eyebrow">WHY IT WORKS</span><h2>A Wordle for people who memorized 1,025 silhouettes</h2></div>
          <div><p>Wordle-style deduction plus Pokédex knowledge is a natural pair: the clues are exactly the fields trainers already argue about—generation, typing, height, and weight. Because the daily answer is the same worldwide, results are shareable without spoilers, and your streak lives in your browser.</p><p>Stuck between candidates? Open both species pages and compare base stats, or spin the <Link href="/pokemon-type-wheel">Type Wheel</Link> while you wait for tomorrow’s puzzle. The <Link href="/whos-that-pokemon">silhouette quiz</Link> is the faster warm-up if you only have a minute.</p></div>
        </section>
        <Faq items={faq} id="wordle-faq" />
      </div>
    </>
  );
}
