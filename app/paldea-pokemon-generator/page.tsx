import type { Metadata } from "next";
import { SpecializedGeneratorPage } from "@/components/content/SpecializedGeneratorPage";
import { PALDEA_FILTERS } from "@/lib/defaults";

const path = "/paldea-pokemon-generator";
const description = "Generate a random Paldea Pokémon team from Generation 9 species #906–1025, with type, evolution, category, forms, and stat filters.";

export const metadata: Metadata = {
  title: { absolute: "Paldea Pokémon Generator – Random Gen 9 Team" },
  description,
  alternates: { canonical: path },
  openGraph: { title: "Paldea Pokémon Generator", description, url: path },
};

export default function PaldeaGeneratorPage() {
  return <SpecializedGeneratorPage
    name="Paldea Pokémon Generator"
    path={path}
    description={description}
    title="Paldea Pokémon"
    emphasis="Generator"
    lead="Build a random team from Generation 9 species #906–1025, with locks, rerolls, seeds, and weakness analysis."
    filters={PALDEA_FILTERS}
    seed="WELCOME-PALDEA"
    overviewTitle="A Generation 9 team from the Paldea pool"
    overview={[
      "The initial pool uses Generation 9 and the Paldea region, covering the main species numbered #906–1025. It begins with a Smart Team of six and excludes Legendary and Mythical Pokémon until you enable them.",
      "Every roll supports the same lock, reroll, save, share, and analysis tools as the main generator. The result is rendered in the page before JavaScript loads, then becomes fully interactive in the browser.",
    ]}
    usesTitle="Ideas for a Paldea random team"
    uses={[
      { title: "Start a Gen 9 challenge", copy: "Build a fresh roster without defaulting to your usual Paldea favorites." },
      { title: "Roll a Paradox rule", copy: "Use the category controls to require or exclude Paradox Pokémon." },
      { title: "Create a monotype team", copy: "Combine Paldea with one shared type for a focused challenge." },
      { title: "Run a group draft", copy: "Share seeds and compare the teams each player develops from them." },
    ]}
    detailsTitle="Paldea species and special categories"
    details={[
      "The starting range covers Generation 9 species #906–1025. Regional forms and special form categories remain controlled separately, so a region label does not quietly expand the pool with every alternate form.",
      "Paradox, Legendary, and Mythical flags can each change the eligible set. If a combination yields no matches, the page explains the conflict rather than returning a Pokémon outside your rules.",
    ]}
    related={[
      { href: "/kanto-pokemon-generator", title: "Kanto Generator", copy: "Return to the original 151 from Generation 1." },
      { href: "/random-shiny-pokemon-generator", title: "Shiny Generator", copy: "Roll one species with its shiny artwork enabled." },
      { href: "/random-nuzlocke-pokemon-generator", title: "Nuzlocke Generator", copy: "Create a custom reproducible encounter." },
      { href: "/", title: "All-Generation Generator", copy: "Mix the complete Generation 1–9 Pokédex." },
    ]}
    faq={[
      { question: "Which Pokédex numbers are in the Paldea pool?", answer: "The initial pool covers main Generation 9 species #906–1025." },
      { question: "Are Paradox Pokémon included?", answer: "The category defaults to Any, so eligible Paradox Pokémon may appear unless you exclude them." },
      { question: "Are Legendary and Mythical Pokémon included?", answer: "They are excluded initially and can be enabled separately in the filters." },
      { question: "Can I generate a single Paldea Pokémon?", answer: "Yes. Change the count from six to one, or choose any team size in between." },
      { question: "Can I reproduce and share the same team?", answer: "Yes. The seed and share link preserve the filters and current team." },
    ]}
  />;
}
