import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/content/JsonLd";
import { PokemonDirectory } from "@/components/pokemon/PokemonDirectory";
import { directoryEntries } from "@/lib/directory-entries";
import { defaultPokemon } from "@/lib/pokemon-catalog";
import { breadcrumbSchema, collectionSchema, organizationSchema } from "@/lib/seo";

const description = "Browse a Shiny Pokédex with normal and Shiny artwork for all 1,025 Pokémon. Search by name or generation, compare palettes, and open detailed Pokémon pages.";

export const metadata: Metadata = {
  title: "Shiny Pokémon Pokédex – All Normal & Shiny Forms",
  description,
  alternates: { canonical: "/shiny-pokemon" },
  openGraph: { title: "Shiny Pokémon Pokédex", description, url: "/shiny-pokemon" },
};

export default function ShinyPokemonPage() {
  return (
    <>
      <JsonLd data={[organizationSchema(), collectionSchema("Shiny Pokémon Pokédex", "/shiny-pokemon", description), breadcrumbSchema([["Home", "/"], ["Shiny Pokémon", "/shiny-pokemon"]])]} />
      <section className="subpage-hero catalog-hero">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Shiny Pokémon</span></nav>
        <h1>Shiny Pokémon <em>Pokédex</em></h1>
        <p>Search all 1,025 species and compare the standard palette with each Pokémon&apos;s Shiny artwork.</p>
      </section>
      <div className="catalog-wrap">
        <aside className="catalog-callout"><div><strong>Looking for a random hunt target?</strong><span>This page is a visual directory, not a Shiny-odds simulator.</span></div><Link href="/random-shiny-pokemon-generator">Open Random Shiny Generator</Link></aside>
        <PokemonDirectory entries={directoryEntries(defaultPokemon)} mode="compare" />
      </div>
    </>
  );
}
