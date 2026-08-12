import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/content/JsonLd";
import { PokemonDirectory } from "@/components/pokemon/PokemonDirectory";
import { directoryEntries } from "@/lib/directory-entries";
import { breadcrumbSchema, collectionSchema, organizationSchema } from "@/lib/seo";
import { defaultPokemon } from "@/lib/pokemon-catalog";

const description = "Search all 1,025 Pokémon by name or generation, then open a Pokédex page with normal and Shiny artwork, types, abilities, stats, and evolution details.";

export const metadata: Metadata = {
  title: "Pokémon Pokédex – Search All 1,025 Pokémon",
  description,
  alternates: { canonical: "/pokemon" },
  openGraph: { title: "Pokémon Pokédex", description, url: "/pokemon" },
};

export default function PokedexPage() {
  return (
    <>
      <JsonLd data={[organizationSchema(), collectionSchema("Pokémon Pokédex", "/pokemon", description), breadcrumbSchema([["Home", "/"], ["Pokédex", "/pokemon"]])]} />
      <section className="subpage-hero catalog-hero">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Pokédex</span></nav>
        <h1>Pokémon <em>Pokédex</em></h1>
        <p>Find a Pokémon by name, compare its normal and Shiny artwork, and follow its complete evolution family.</p>
      </section>
      <div className="catalog-wrap"><PokemonDirectory entries={directoryEntries(defaultPokemon)} /></div>
    </>
  );
}
