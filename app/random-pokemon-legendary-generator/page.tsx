import type { Metadata } from "next";
import { SpecializedGeneratorPage } from "@/components/content/SpecializedGeneratorPage";
import { LEGENDARY_FILTERS } from "@/lib/defaults";

const path = "/random-pokemon-legendary-generator";
const description = "Pick a random Legendary Pokémon from Generations 1–9, then filter by generation, region, type, evolution, forms, and base stats.";

export const metadata: Metadata = {
  title: { absolute: "Random Legendary Pokémon Generator – Gen 1–9" },
  description,
  alternates: { canonical: path },
  openGraph: { title: "Random Legendary Pokémon Generator", description, url: path },
};

const related = [
  { href: "/random-shiny-pokemon-generator", title: "Random Shiny Pokémon", copy: "Roll one Pokémon with its shiny artwork already enabled." },
  { href: "/kanto-pokemon-generator", title: "Kanto Pokémon Generator", copy: "Build a team from the original Generation 1 Pokédex." },
  { href: "/paldea-pokemon-generator", title: "Paldea Pokémon Generator", copy: "Generate a team from the Generation 9 Paldea Pokédex." },
  { href: "/", title: "Full Team Generator", copy: "Use the complete pool and Smart Team analysis." },
];

export default function LegendaryGeneratorPage() {
  return <SpecializedGeneratorPage
    name="Random Legendary Pokémon Generator"
    path={path}
    description={description}
    title="Random Legendary Pokémon"
    emphasis="Generator"
    lead="Roll one Legendary Pokémon from nine generations, or narrow the pool before the seed makes the final pick."
    filters={LEGENDARY_FILTERS}
    seed="WELCOME-LEGENDARY"
    overviewTitle="One random pick from the Legendary pool"
    overview={[
      "The page begins with one Pokémon classified as Legendary in the bundled Generation 1–9 dataset. Every eligible result receives the same seeded random selection chance after your filters are applied.",
      "Choose a generation, region, type, form rule, or base-stat range when you want a smaller pool. Lock, save, copy, or share the exact pick without creating an account.",
    ]}
    usesTitle="Ideas for a random Legendary roll"
    uses={[
      { title: "Choose a raid mascot", copy: "Pick one Legendary as the theme for a battle night or fan tournament." },
      { title: "Set a drawing prompt", copy: "Turn the result into a sketch, redesign, fusion, or color study." },
      { title: "Break a team-building tie", copy: "Let a reproducible seed choose between several eligible legends." },
      { title: "Run a trivia challenge", copy: "Roll a subject, then test its generation, type, ability, and stats." },
    ]}
    detailsTitle="Legendary and Mythical stay separate"
    details={[
      "Legendary-only mode does not silently mix Mythical Pokémon into the starting pool. The two categories are stored separately so the label on the generator matches the result you receive.",
      "Changing filters can make the pool too small or create a generation-and-region conflict. The generator reports that before a roll instead of substituting an ineligible Pokémon.",
    ]}
    related={related}
    faq={[
      { question: "Which generations are included?", answer: "The Legendary pool covers Generations 1 through 9 in the current bundled dataset." },
      { question: "Are Mythical Pokémon included?", answer: "No. This page starts in Legendary-only mode, while Mythical Pokémon remain a separate category." },
      { question: "Can I generate a team of Legendary Pokémon?", answer: "Yes. Increase the team size in the filters; duplicate prevention remains on unless you explicitly change it." },
      { question: "Can I choose a Legendary from one region?", answer: "Yes. Select a region or generation, provided the combination has matching Pokémon." },
      { question: "Can I reproduce the same result?", answer: "Yes. Reuse the same seed and filters, or copy the share link, to restore the same pick." },
    ]}
  />;
}
