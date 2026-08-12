import type { Metadata } from "next";
import { StarterCollectionPage } from "@/components/content/StarterCollectionPage";
import { defaultPokemon } from "@/lib/pokemon-catalog";

const entries = defaultPokemon.filter((entry) => ["snivy", "tepig", "oshawott"].includes(entry.slug));
const description = "Compare the Generation 5 starter Pokémon Snivy, Tepig, and Oshawott, including types, Shiny forms, stats, and full Unova evolution chains.";
export const metadata: Metadata = { title: "Generation 5 Starter Pokémon – Snivy, Tepig & Oshawott", description, alternates: { canonical: "/starter-pokemon/gen-5" } };

export default function Gen5StarterPage() {
  return <StarterCollectionPage name="Generation 5 Starter Pokémon" path="/starter-pokemon/gen-5" title="Generation 5" emphasis="Starters" lead={description} entries={entries} overview={[
    "Pokémon Black and White begin with a choice between Grass-type Snivy, Fire-type Tepig, and Water-type Oshawott. Each evolves twice and reaches a different final typing and stat profile.",
    "Use the cards below to open each Pokédex profile, compare normal and Shiny forms, and see the complete evolution path before choosing a partner.",
  ]} />;
}
