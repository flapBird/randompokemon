import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/content/JsonLd";
import { breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Credits & Data Sources",
  description: "See the Pokémon data, artwork, software, update process, and fan-project attribution used by RandomPokemon.xyz.",
  alternates: { canonical: "/credits" },
};

export default function CreditsPage() {
  return (
    <article className="legal-page">
      <JsonLd data={breadcrumbSchema([["Home", "/"], ["Credits & Data Sources", "/credits"]])} />
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Credits &amp; Data Sources</span></nav>
      <span className="eyebrow">TRANSPARENT SOURCES</span>
      <h1>Credits &amp; Data Sources</h1>
      <p className="lead">The generator uses a versioned local dataset so rolls stay fast, consistent, and testable.</p>
      <h2>Species and battle data</h2>
      <p>Names, types, abilities, base stats, evolution links, generation tags, and special categories are normalized from the open-source <a href="https://github.com/pkmn/ps" rel="noopener noreferrer">@pkmn data ecosystem</a>. The build is pinned through the project dependency lockfile instead of silently changing during a visit.</p>
      <h2>PokéAPI metadata</h2>
      <p>Default-form height and English species-category metadata are fetched from <a href="https://pokeapi.co/" rel="noopener noreferrer">PokéAPI</a>. The update script validates record counts and data variety before replacing the bundled files.</p>
      <h2>Artwork</h2>
      <p>Default and shiny sprites are loaded from the public <a href="https://github.com/PokeAPI/sprites" rel="noopener noreferrer">PokéAPI sprites repository</a>. Supported alternate forms may use sprite assets hosted by <a href="https://pokemonshowdown.com/" rel="noopener noreferrer">Pokémon Showdown</a>.</p>
      <h2>Coverage and updates</h2>
      <p>The current dataset covers the 1,025 main species from Generations 1–9 and selected regional, Mega, and Gigantamax forms. Automated tests check Pokédex coverage, unique slugs, metadata quality, and supported form counts. Corrections can be reported through the <Link href="/contact">Contact</Link> page.</p>
      <h2>Trademark notice</h2>
      <p>RandomPokemon.xyz is an unofficial fan-made tool and is not affiliated with Nintendo, Game Freak, Creatures Inc., or The Pokémon Company. Pokémon and Pokémon character names are trademarks of their respective owners.</p>
    </article>
  );
}
