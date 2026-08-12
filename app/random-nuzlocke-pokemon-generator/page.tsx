import type { Metadata } from "next";
import { SpecializedGeneratorPage } from "@/components/content/SpecializedGeneratorPage";
import { NUZLOCKE_FILTERS } from "@/lib/defaults";

const path = "/random-nuzlocke-pokemon-generator";
const description = "Generate a reproducible random Pokémon encounter for a custom Nuzlocke, with generation, region, type, evolution, category, and stat filters.";

export const metadata: Metadata = {
  title: { absolute: "Random Nuzlocke Pokémon Generator – Encounter Picker" },
  description,
  alternates: { canonical: path },
  openGraph: { title: "Random Nuzlocke Pokémon Generator", description, url: path },
};

export default function NuzlockeGeneratorPage() {
  return <SpecializedGeneratorPage
    name="Random Nuzlocke Pokémon Generator"
    path={path}
    description={description}
    title="Random Nuzlocke Pokémon"
    emphasis="Generator"
    lead="Create one reproducible encounter or starter rule for a custom challenge, then share the exact seed."
    filters={NUZLOCKE_FILTERS}
    seed="WELCOME-NUZLOCKE"
    overviewTitle="A flexible picker for custom Nuzlocke rules"
    overview={[
      "This tool selects one Pokémon from the pool you define. Start with all nine generations, or choose the generation, region, types, evolution stages, and categories allowed by your personal challenge rules.",
      "It is intentionally game-agnostic: it does not claim to reproduce a title's route encounter tables, levels, abilities, or capture odds. Use it when your rules call for an external random pick rather than an in-game encounter.",
    ]}
    usesTitle="Build a clear challenge rule"
    uses={[
      { title: "Pick a custom encounter", copy: "Roll one eligible species when your run allows an external random encounter." },
      { title: "Choose a backup starter", copy: "Use the result as a nontraditional first partner for a modified run." },
      { title: "Create a replacement rule", copy: "Generate a fair substitute when your group agrees an encounter is invalid." },
      { title: "Share a community seed", copy: "Send one link so multiple players begin with the same filters and result." },
    ]}
    detailsTitle="Your rules decide the eligible pool"
    details={[
      "Legendary and Mythical Pokémon are excluded initially, while duplicates are disabled. You can change those choices if your challenge permits them.",
      "For a game-specific pool, select the closest generation or region and add any type or evolution restrictions your rules require. Because this dataset is national rather than route-based, verify game availability separately for strict cartridge runs.",
    ]}
    related={[
      { href: "/random-pokemon-starter-generator", title: "Starter Generator", copy: "Choose from traditional Grass, Fire, and Water partners." },
      { href: "/kanto-pokemon-generator", title: "Kanto Generator", copy: "Limit the starting pool to the original 151 species." },
      { href: "/paldea-pokemon-generator", title: "Paldea Generator", copy: "Start with the Generation 9 Paldea species pool." },
      { href: "/", title: "Full Team Generator", copy: "Generate and analyze a complete team of up to six." },
    ]}
    faq={[
      { question: "Does this use real route encounter tables?", answer: "No. It selects from the national dataset after your filters are applied; it does not model encounters, levels, or odds for a specific game route." },
      { question: "Can I limit a roll to one game generation?", answer: "Yes. Choose one generation, or combine generation and region filters when the selections overlap." },
      { question: "Are Legendary Pokémon excluded?", answer: "Yes by default. You can include them if your custom rules allow it." },
      { question: "Can friends receive the same encounter?", answer: "Yes. Share the generated link or reuse the same seed and filter settings." },
      { question: "Can I generate more than one Pokémon?", answer: "Yes. Increase the count to create a candidate pool or a full challenge team." },
    ]}
  />;
}
