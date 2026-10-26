import type { Metadata } from "next";
import Link from "next/link";
import { Faq } from "@/components/content/Faq";
import { JsonLd } from "@/components/content/JsonLd";
import { WhosThatPokemon } from "@/components/tools/WhosThatPokemon";
import { breadcrumbSchema, faqSchema, organizationSchema, webApplicationSchema } from "@/lib/seo";

const path = "/whos-that-pokemon";
const description = "Play Who's That Pokémon: name the silhouette from official artwork across all 1,025 species, track your streak, and share your score.";
const faq = [
  { question: "How does Who's That Pokémon work?", answer: "Each round hides one random Pokémon as a black silhouette. Pick the right name from four options before the answer is revealed, and every correct guess raises your score and streak." },
  { question: "How many Pokémon are in the game?", answer: "The default pool draws from all 1,025 species in the National Pokédex, Generations 1 through 9. You can narrow the pool to a single generation for an easier run." },
  { question: "Is the game free?", answer: "Yes. It runs entirely in your browser with no account, no download, and no cost. Your best streak is saved locally on your device." },
  { question: "Can I play with only one generation?", answer: "Yes. Switch the pool selector to a single generation such as Gen 1 or Gen 9 to quiz yourself on that era's species." },
];

export const metadata: Metadata = {
  title: { absolute: "Who's That Pokémon? – Free Silhouette Guessing Game" },
  description,
  alternates: { canonical: path },
  openGraph: { title: "Who's That Pokémon?", description, url: path },
};

export default function Page() {
  return (
    <>
      <JsonLd data={[organizationSchema(), webApplicationSchema("Who's That Pokémon?", path, description), faqSchema(faq), breadcrumbSchema([["Home", "/"], ["Who's That Pokémon?", path]])]} />
      <section className="subpage-hero">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Who&apos;s That Pokémon?</span></nav>
        <h1>Who&apos;s That <em>Pokémon</em>?</h1>
        <p>The classic silhouette game: a hidden Pokémon appears, four names are on the table, and your streak is on the line.</p>
      </section>
      <WhosThatPokemon />
      <div className="content-wrap">
        <section className="content-section">
          <div className="content-heading"><span className="eyebrow">HOW TO PLAY</span><h2>From black shadow to bragging rights</h2><p>Every round takes seconds, and the Pokédex pool covers every mainline species.</p></div>
          <div className="steps-grid">
            <article><span>01</span><h3>Study the silhouette</h3><p>A random Pokémon appears as a solid black shadow. Ears, tails, and wing shapes are your best clues.</p></article>
            <article><span>02</span><h3>Pick one of four names</h3><p>One option is correct and three are decoys. A correct pick scores a point and extends your streak.</p></article>
            <article><span>03</span><h3>Chase your best streak</h3><p>Your best streak is saved on your device. Copy your score and challenge friends to beat it.</p></article>
          </div>
        </section>
        <section className="content-section split-content">
          <div><span className="eyebrow">WHY IT&apos;S ADDICTIVE</span><h2>A two-second quiz with a decade of rosters</h2></div>
          <div><p>Silhouette recognition is the fastest way to test real Pokédex knowledge: no moves, no stats, just shapes you have seen a thousand times in the anime&apos;s eyecatch. Because the pool spans Generations 1–9, casual fans can stay in Gen 1 while completionists test all 1,025 species at once.</p><p>Missed one? Every reveal links straight to that Pokémon&apos;s page with stats, evolutions, and Shiny artwork, so the game doubles as a study tool.</p></div>
        </section>
        <section className="content-section">
          <div className="content-heading"><span className="eyebrow">MORE WAYS TO PLAY</span><h2>Pair the quiz with the rest of the toolkit</h2></div>
          <div className="use-grid">
            <article><h3>Warm up before a Nuzlocke</h3><p>Run the <Link href="/random-nuzlocke-pokemon-generator">Nuzlocke Generator</Link> after a quiz streak to keep encounters surprising.</p></article>
            <article><h3>Set a type restriction</h3><p>Spin the <Link href="/pokemon-type-wheel">Pokémon Type Wheel</Link> and quiz only that type&apos;s silhouettes next.</p></article>
            <article><h3>Study the matchups</h3><p>Keep the <Link href="/pokemon-type-chart">Pokémon Type Chart</Link> open to review weaknesses between rounds.</p></article>
            <article><h3>Name your next catch</h3><p>Stuck on a nickname for the Pokémon you just missed? The <Link href="/pokemon-nickname-generator">Nickname Generator</Link> has ideas by type and style.</p></article>
          </div>
        </section>
        <Faq items={faq} id="whos-that-pokemon-faq" />
      </div>
    </>
  );
}
