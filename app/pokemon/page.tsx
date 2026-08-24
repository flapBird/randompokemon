import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/content/JsonLd";
import { PokemonDirectory } from "@/components/pokemon/PokemonDirectory";
import { directoryEntries } from "@/lib/directory-entries";
import { breadcrumbSchema, collectionSchema, organizationSchema } from "@/lib/seo";
import { defaultPokemon, titleToken } from "@/lib/pokemon-catalog";
import { POKEMON_TYPES } from "@/types/pokemon";

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
        <p>Find a Pokémon by name, then explore stats, weaknesses, resistances, abilities, evolutions, related species, and team-building shortcuts.</p>
      </section>
      <div className="catalog-wrap">
        <section className="pokedex-type-hub" id="pokemon-by-type" aria-labelledby="pokemon-by-type-title">
          <div><span className="eyebrow">POKÉMON BY TYPE</span><h2 id="pokemon-by-type-title">Browse all 18 type collections</h2><p>Open a focused, indexable Pokédex list for any type, then continue to individual Pokémon profiles.</p></div>
          <nav className="type-hub-links" aria-label="Pokémon types">
            {POKEMON_TYPES.map((type) => <Link href={`/pokemon/type/${type}`} data-type={type} key={type}><span className="type-dot" />{titleToken(type)}</Link>)}
          </nav>
        </section>
        <PokemonDirectory entries={directoryEntries(defaultPokemon)} />
      </div>
    </>
  );
}
