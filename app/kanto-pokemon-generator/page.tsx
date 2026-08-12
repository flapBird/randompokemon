import type { Metadata } from "next";
import { SpecializedGeneratorPage } from "@/components/content/SpecializedGeneratorPage";
import { KANTO_FILTERS } from "@/lib/defaults";

const path = "/kanto-pokemon-generator";
const description = "Generate a random Kanto Pokémon team from the original 151 species, with type, evolution, Legendary, forms, and base-stat filters.";

export const metadata: Metadata = {
  title: { absolute: "Kanto Pokémon Generator – Random Gen 1 Team" },
  description,
  alternates: { canonical: path },
  openGraph: { title: "Kanto Pokémon Generator", description, url: path },
};

export default function KantoGeneratorPage() {
  return <SpecializedGeneratorPage
    name="Kanto Pokémon Generator"
    path={path}
    description={description}
    title="Kanto Pokémon"
    emphasis="Generator"
    lead="Build a random team from Pokédex #001–151, then lock favorites, reroll slots, and inspect shared weaknesses."
    filters={KANTO_FILTERS}
    seed="WELCOME-KANTO"
    overviewTitle="A random team from the original 151"
    overview={[
      "The initial pool combines Generation 1 with the Kanto region, keeping the first roll focused on Bulbasaur through Mew. It starts as a Smart Team of six with Legendary and Mythical Pokémon excluded.",
      "Lock any member you want to keep, reroll individual cards or every unlocked slot, and use the weakness panel to inspect the team. The selection remains seeded and shareable.",
    ]}
    usesTitle="Ways to play with a Kanto team"
    uses={[
      { title: "Plan a Gen 1 challenge", copy: "Start a replay or fan ruleset with a surprising six-Pokémon roster." },
      { title: "Build a Kanto draft", copy: "Give each player a seed or reroll duplicate picks between rounds." },
      { title: "Choose a monotype squad", copy: "Add a shared type filter while keeping every pick inside Kanto." },
      { title: "Create a nostalgia prompt", copy: "Roll a mascot, drawing subject, trivia answer, or team theme." },
    ]}
    detailsTitle="Kanto, Generation 1, and regional forms"
    details={[
      "The default Kanto pool refers to species introduced in Generation 1, Pokédex numbers #001–151. Later regional variants are not included unless you change the form and region settings.",
      "Legendary and Mythical Pokémon begin excluded so an ordinary team has room to form. Turn them on, change the team size, or switch from Smart Team to Pure Random whenever your rules call for it.",
    ]}
    related={[
      { href: "/paldea-pokemon-generator", title: "Paldea Generator", copy: "Jump from Generation 1 to the newest complete generation." },
      { href: "/random-pokemon-starter-generator", title: "Starter Generator", copy: "Pick one traditional first partner." },
      { href: "/random-pokemon-legendary-generator", title: "Legendary Generator", copy: "Roll only from the Legendary category." },
      { href: "/", title: "All-Generation Generator", copy: "Use all 1,025 species across Generations 1–9." },
    ]}
    faq={[
      { question: "Which Pokémon are in the default Kanto pool?", answer: "The initial pool contains the 151 main species introduced in Generation 1, from Bulbasaur through Mew." },
      { question: "Are Kanto Legendary Pokémon included?", answer: "They are excluded initially. Enable Legendary Pokémon in the filters to add Articuno, Zapdos, Moltres, and Mewtwo." },
      { question: "Is Mew included by default?", answer: "No. Mew is classified as Mythical and can be enabled separately in the filters." },
      { question: "Can I generate one Kanto Pokémon instead of six?", answer: "Yes. Change the count to any value from one through six." },
      { question: "Can I build a Kanto monotype team?", answer: "Yes. Select one type and keep the Kanto generation and region filters active." },
    ]}
  />;
}
