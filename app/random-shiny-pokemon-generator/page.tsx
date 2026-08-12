import type { Metadata } from "next";
import { SpecializedGeneratorPage } from "@/components/content/SpecializedGeneratorPage";
import { SHINY_FILTERS } from "@/lib/defaults";

const path = "/random-shiny-pokemon-generator";
const description = "Generate a random shiny Pokémon from all 1,025 species across Generations 1–9, with filters for type, region, evolution, forms, and stats.";

export const metadata: Metadata = {
  title: { absolute: "Random Shiny Pokémon Generator – All Gen 1–9" },
  description,
  alternates: { canonical: path },
  openGraph: { title: "Random Shiny Pokémon Generator", description, url: path },
};

export default function ShinyGeneratorPage() {
  return <SpecializedGeneratorPage
    name="Random Shiny Pokémon Generator"
    path={path}
    description={description}
    title="Random Shiny Pokémon"
    emphasis="Generator"
    lead="Generate one Pokémon with shiny artwork enabled, then reroll or narrow the full Generation 1–9 pool."
    filters={SHINY_FILTERS}
    seed="WELCOME-SHINY"
    defaultShiny
    overviewTitle="A shiny visual picker, not an odds simulator"
    overview={[
      "Every new result on this page opens with its shiny artwork enabled. The Pokémon itself is selected with the same seeded method as the main generator; this page does not simulate in-game encounter rates or shiny odds.",
      "The starting pool includes all 1,025 main species and permits Legendary and Mythical Pokémon. You can narrow it by generation, region, type, evolution stage, forms, or base-stat total.",
    ]}
    usesTitle="Ways to use a random shiny pick"
    uses={[
      { title: "Choose a hunt target", copy: "Let the generator pick your next shiny hunt without favoring a familiar species." },
      { title: "Make an art prompt", copy: "Use the alternate palette as a drawing, sprite, or redesign challenge." },
      { title: "Plan a shiny team", copy: "Raise the count and build a themed roster from filtered shiny artwork." },
      { title: "Compare palettes", copy: "Toggle Shiny on a card to compare its standard and alternate artwork." },
    ]}
    detailsTitle="The filters choose species; Shiny chooses artwork"
    details={[
      "Generation, region, type, evolution, and category controls determine which species can be selected. The shiny state changes the displayed sprite without changing the ability, nature, stats, or seed.",
      "Some alternate forms use Pokémon Showdown artwork while default species use the PokéAPI sprite repository. Credits and data-source details are published on the Credits page.",
    ]}
    related={[
      { href: "/shiny-pokemon", title: "Shiny Pokémon Pokédex", copy: "Compare normal and Shiny artwork for all 1,025 species." },
      { href: "/random-pokemon-legendary-generator", title: "Random Legendary Pokémon", copy: "Limit the roll to the Legendary category." },
      { href: "/random-nuzlocke-pokemon-generator", title: "Nuzlocke Pokémon Generator", copy: "Create a reproducible random encounter rule." },
      { href: "/random-pokemon-starter-generator", title: "Starter Generator", copy: "Pick from the traditional starter pool." },
    ]}
    faq={[
      { question: "Does this simulate shiny odds?", answer: "No. It randomly selects an eligible species and displays its shiny artwork; it does not reproduce encounter rates from any game." },
      { question: "Are all nine generations available?", answer: "Yes. The default pool includes the 1,025 main species from Generations 1–9." },
      { question: "Can the result include Legendary or Mythical Pokémon?", answer: "Yes. Both categories are available on this page, and you can change those settings in the filters." },
      { question: "Can I build a shiny team instead of one pick?", answer: "Yes. Increase the count and each newly generated member will start with shiny artwork enabled." },
      { question: "Does toggling Shiny reroll the Pokémon?", answer: "No. It switches the artwork only; the species, ability, nature, stats, and seed remain unchanged." },
    ]}
  />;
}
