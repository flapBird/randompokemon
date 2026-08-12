import type { Metadata } from "next";
import { StarterCollectionPage } from "@/components/content/StarterCollectionPage";
import { defaultPokemon } from "@/lib/pokemon-catalog";

const starters = defaultPokemon.filter((entry) => entry.isStarter && !["pikachu", "eevee"].includes(entry.slug));
const description = "Browse all 27 traditional starter Pokémon from Generations 1–9, with types, artwork, stats, Shiny forms, and complete evolution chains.";

export const metadata: Metadata = { title: "Starter Pokémon List – All Gen 1–9 Starters", description, alternates: { canonical: "/starter-pokemon" } };

export default function StarterPokemonPage() {
  return <StarterCollectionPage name="Starter Pokémon List" path="/starter-pokemon" title="Starter Pokémon" emphasis="List" lead={description} entries={starters} />;
}
