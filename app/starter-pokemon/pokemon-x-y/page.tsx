import type { Metadata } from "next";
import { StarterCollectionPage } from "@/components/content/StarterCollectionPage";
import { defaultPokemon } from "@/lib/pokemon-catalog";

const entries = defaultPokemon.filter((entry) => ["chespin", "fennekin", "froakie"].includes(entry.slug));
const description = "Compare the Pokémon X and Y starter Pokémon Chespin, Fennekin, and Froakie, including types, Shiny forms, stats, and complete Kalos evolution chains.";
export const metadata: Metadata = { title: "Pokémon X & Y Starters – Chespin, Fennekin & Froakie", description, alternates: { canonical: "/starter-pokemon/pokemon-x-y" } };

export default function PokemonXYStarterPage() {
  return <StarterCollectionPage name="Pokémon X and Y Starters" path="/starter-pokemon/pokemon-x-y" title="Pokémon X & Y" emphasis="Starters" lead={description} entries={entries} overview={[
    "Pokémon X and Pokémon Y share the same Kalos starter trio: Grass-type Chespin, Fire-type Fennekin, and Water-type Froakie. The version you play does not change the three initial choices.",
    "Froakie evolves into Frogadier at level 16 and Greninja at level 36. Open each profile below to see its complete evolution family and Shiny comparison.",
  ]} />;
}
