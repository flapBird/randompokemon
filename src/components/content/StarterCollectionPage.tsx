import Link from "next/link";
import { JsonLd } from "@/components/content/JsonLd";
import { PokemonDirectory } from "@/components/pokemon/PokemonDirectory";
import { directoryEntries } from "@/lib/directory-entries";
import { breadcrumbSchema, collectionSchema, organizationSchema } from "@/lib/seo";
import type { PokemonRecord } from "@/types/pokemon";

export function StarterCollectionPage({
  name, path, title, emphasis, lead, entries, overview,
}: {
  name: string;
  path: string;
  title: string;
  emphasis: string;
  lead: string;
  entries: PokemonRecord[];
  overview?: string[];
}) {
  return (
    <>
      <JsonLd data={[organizationSchema(), collectionSchema(name, path, lead), breadcrumbSchema([["Home", "/"], ["Starter Pokémon", "/starter-pokemon"], ...(path === "/starter-pokemon" ? [] : [[name, path] as [string, string]])])]} />
      <section className="subpage-hero catalog-hero">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span>{path === "/starter-pokemon" ? <span>Starter Pokémon</span> : <><Link href="/starter-pokemon">Starter Pokémon</Link><span>/</span><span>{name}</span></>}</nav>
        <h1>{title} <em>{emphasis}</em></h1><p>{lead}</p>
      </section>
      <div className="catalog-wrap">
        {overview?.length ? <section className="starter-overview">{overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section> : null}
        <PokemonDirectory entries={directoryEntries(entries)} searchable={entries.length > 12} />
        <section className="catalog-links">
          <Link href="/starter-pokemon/gen-5"><strong>Generation 5 starters</strong><span>Snivy, Tepig, and Oshawott</span></Link>
          <Link href="/starter-pokemon/pokemon-x-y"><strong>Pokémon X and Y starters</strong><span>Chespin, Fennekin, and Froakie</span></Link>
          <Link href="/random-pokemon-starter-generator"><strong>Random Starter Generator</strong><span>Let a reproducible seed choose your partner</span></Link>
        </section>
      </div>
    </>
  );
}
