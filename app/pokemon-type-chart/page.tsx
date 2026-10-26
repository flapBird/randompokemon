import type { Metadata } from "next";
import Link from "next/link";
import { Faq } from "@/components/content/Faq";
import { JsonLd } from "@/components/content/JsonLd";
import { breadcrumbSchema, faqSchema, organizationSchema } from "@/lib/seo";
import { calculateAttackMultiplier } from "@/data/type-chart";
import { POKEMON_TYPES } from "@/types/pokemon";

const path = "/pokemon-type-chart";
const description = "The complete Pokémon type chart: all 18 attacking types against every defending type, with super-effective, resisted, and immune matchups explained.";
const faq = [
  { question: "How do you read the Pokémon type chart?", answer: "Find the attacking type in the left column and the defending type across the top. The cell shows the damage multiplier: 2× means super effective, ½× means not very effective, and 0× means no effect at all." },
  { question: "What does the chart look like for dual-type Pokémon?", answer: "Multiply the multipliers for both defending types. A Fire attack against a Rock/Bug defender deals ½ × 2 = 1× damage, because Rock resists Fire while Bug is weak to it." },
  { question: "Which types have the most immunities?", answer: "Ground is immune to Electric, Flying is immune to Ground, Ghost is immune to Normal and Fighting, Normal is immune to Ghost, Dark is immune to Psychic, Steel is immune to Poison, and Fairy is immune to Dragon." },
  { question: "Has the type chart changed recently?", answer: "The current chart has been stable since Generation 6 (2013), when Steel lost its Ghost and Dark resistances and Fairy was introduced to counter Dragon, Fighting, and Dark." },
];

const CODES: Record<string, string> = {
  normal: "NRM", fire: "FIR", water: "WAT", electric: "ELE", grass: "GRA", ice: "ICE",
  fighting: "FIG", poison: "POI", ground: "GRO", flying: "FLY", psychic: "PSY", bug: "BUG",
  rock: "ROC", ghost: "GHO", dragon: "DRA", dark: "DAR", steel: "STE", fairy: "FAI",
};

function cell(multiplier: number) {
  if (multiplier === 2) return { label: "2×", state: "super" };
  if (multiplier === 0.5) return { label: "½×", state: "resist" };
  if (multiplier === 0) return { label: "0×", state: "immune" };
  return { label: "", state: "neutral" };
}

export const metadata: Metadata = {
  title: { absolute: "Pokémon Type Chart – All 18 Type Matchups (Gen 6+)" },
  description,
  alternates: { canonical: path },
  openGraph: { title: "Pokémon Type Chart", description, url: path },
};

export default function Page() {
  return (
    <>
      <JsonLd data={[organizationSchema(), faqSchema(faq), breadcrumbSchema([["Home", "/"], ["Pokémon Type Chart", path]])]} />
      <section className="subpage-hero">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Pokémon Type Chart</span></nav>
        <h1>Pokémon Type <em>Chart</em></h1>
        <p>Every attacking type against every defending type, current as of Generation 6 and used through Gen 9. Scroll sideways on mobile to see all 18 columns.</p>
        <div className="hero-actions"><Link href="/pokemon-type-wheel">Spin the Type Wheel</Link><Link href="/team-planner">Check a team&apos;s coverage</Link></div>
      </section>

      <div className="content-wrap">
        <section className="content-section">
          <div className="type-chart-scroll">
            <table className="type-chart">
              <caption className="sr-only">Damage multipliers for each attacking type (rows) against each defending type (columns)</caption>
              <thead>
                <tr>
                  <th scope="col"><span className="sr-only">Attacking ↓ / Defending →</span></th>
                  {POKEMON_TYPES.map((type) => (
                    <th scope="col" key={type} data-type={type}><span className="type-dot" aria-hidden="true" /><span className="tc-code">{CODES[type]}</span></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {POKEMON_TYPES.map((attacking) => (
                  <tr key={attacking} data-type={attacking}>
                    <th scope="row"><span className="type-dot" aria-hidden="true" /><Link href={`/pokemon/type/${attacking}`} className="tc-row-link">{CODES[attacking]}</Link></th>
                    {POKEMON_TYPES.map((defending) => {
                      const { label, state } = cell(calculateAttackMultiplier(attacking, defending));
                      return <td key={defending} data-m={state}>{label}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="type-chart-legend">
            <li><strong>2×</strong> super effective</li>
            <li><strong>½×</strong> not very effective</li>
            <li><strong>0×</strong> no effect</li>
            <li><em>blank</em> neutral (1×)</li>
          </ul>
        </section>

        <section className="content-section split-content">
          <div><span className="eyebrow">HOW TO READ IT</span><h2>Rows attack, columns defend</h2></div>
          <div><p>Find the attacking move&apos;s type in the left column, follow the row to the defender&apos;s type, and read the multiplier. Against a dual-type Pokémon, multiply both cells: Electric against Water/Flying deals 2 × 2 = 4× damage, the strongest hit in the game.</p><p>Building a team around this table is what Team Planner does automatically—open it to see which attacking types your six Pokémon leave unanswered. To browse every species of a given type, follow any row label to its <Link href="/pokemon">Pokédex collection</Link>.</p></div>
        </section>

        <section className="content-section">
          <div className="content-heading"><span className="eyebrow">FAST FACTS</span><h2>The matchups worth memorizing</h2></div>
          <div className="use-grid">
            <article><h3>Four-move immunity club</h3><p>Ground beats Electric outright, Flying shrugs off Ground, Ghost ignores Normal and Fighting, and Normal cannot touch Ghost.</p></article>
            <article><h3>Fairy changed everything</h3><p>Since Gen 6, Dragon is useless against Fairy, and Fighting and Dark both hit Fairy at ½×. One Fairy slot answers three common offensive types.</p></article>
            <article><h3>Water and Electric are elite attackers</h3><p>Each hits five types super effectively and is resisted by only three or four, which is why rain teams and Electric spam stay strong.</p></article>
            <article><h3>Ice is a great attacker, a bad defender</h3><p>Ice hits four types for 2× but carries five common weaknesses—most Ice types are better as coverage than as anchors.</p></article>
          </div>
        </section>

        <Faq items={faq} id="type-chart-faq" />
      </div>
    </>
  );
}
