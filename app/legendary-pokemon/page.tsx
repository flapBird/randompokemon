import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/content/JsonLd";
import { PokemonDirectory } from "@/components/pokemon/PokemonDirectory";
import { directoryEntries } from "@/lib/directory-entries";
import { defaultPokemon } from "@/lib/pokemon-catalog";
import { breadcrumbSchema, collectionSchema, organizationSchema } from "@/lib/seo";

const legendary = defaultPokemon.filter((entry) => entry.isLegendary);
const description = "Explore the complete Legendary Pokémon list from Generations 1–9, grouped and searchable by generation with types, artwork, stats, Shiny forms, and Pokédex details.";

export const metadata: Metadata = {
  title: "Legendary Pokémon List – All Generations 1–9",
  description,
  alternates: { canonical: "/legendary-pokemon" },
  openGraph: { title: "Legendary Pokémon List", description, url: "/legendary-pokemon" },
};

export default function LegendaryPokemonPage() {
  return (
    <>
      <JsonLd data={[organizationSchema(), collectionSchema("Legendary Pokémon List", "/legendary-pokemon", description), breadcrumbSchema([["Home", "/"], ["Legendary Pokémon", "/legendary-pokemon"]])]} />
      <section className="subpage-hero catalog-hero">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Legendary Pokémon</span></nav>
        <h1>Legendary Pokémon <em>List</em></h1>
        <p>Browse {legendary.length} Legendary Pokémon by generation, then open any species for normal and Shiny artwork, abilities, stats, and evolution details.</p>
      </section>
      <div className="catalog-wrap">
        <aside className="catalog-callout"><div><strong>Legendary is not the same as Mythical</strong><span>This directory follows the dataset&apos;s Legendary classification and keeps Mythical Pokémon separate.</span></div><Link href="/random-pokemon-legendary-generator">Pick a random Legendary</Link></aside>
        <PokemonDirectory entries={directoryEntries(legendary)} />
      </div>
    </>
  );
}
