import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/content/JsonLd";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { breadcrumbSchema, organizationSchema, pokemonSchema } from "@/lib/seo";
import { defaultPokemon, evolutionFamily, getPokemon, pokemonSummary, PRIORITY_POKEMON_SLUGS, titleToken } from "@/lib/pokemon-catalog";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return defaultPokemon.filter((entry) => (PRIORITY_POKEMON_SLUGS as readonly string[]).includes(entry.slug)).map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getPokemon(slug);
  if (!entry) return {};
  const description = pokemonSummary(entry);
  const priority = (PRIORITY_POKEMON_SLUGS as readonly string[]).includes(slug);
  return {
    title: `${entry.name} Pokédex – Shiny, Stats & Evolution`,
    description,
    alternates: { canonical: `/pokemon/${entry.slug}` },
    robots: priority ? undefined : { index: false, follow: true },
    openGraph: { title: `${entry.name} Pokédex`, description, url: `/pokemon/${entry.slug}`, images: [entry.sprite] },
  };
}

const statLabels = [
  ["hp", "HP"], ["attack", "Attack"], ["defense", "Defense"],
  ["specialAttack", "Sp. Attack"], ["specialDefense", "Sp. Defense"], ["speed", "Speed"],
] as const;

export default async function PokemonPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = getPokemon(slug);
  if (!entry) notFound();
  const family = evolutionFamily(entry);
  const description = pokemonSummary(entry);

  return (
    <>
      <JsonLd data={[
        organizationSchema(),
        pokemonSchema({ name: entry.name, slug: entry.slug, description, image: entry.sprite, category: entry.category }),
        breadcrumbSchema([["Home", "/"], ["Pokédex", "/pokemon"], [entry.name, `/pokemon/${entry.slug}`]]),
      ]} />
      <article className="pokemon-page">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/pokemon">Pokédex</Link><span>/</span><span>{entry.name}</span></nav>
        <header className="pokemon-page-header">
          <div>
            <span className="eyebrow">POKÉDEX #{String(entry.id).padStart(4, "0")}</span>
            <h1>{entry.name}</h1>
            <p>{description}</p>
            <div className="type-row">{entry.types.map((type) => <TypeBadge type={type} key={type} />)}</div>
          </div>
          <div className="pokemon-status-list">
            {entry.isLegendary && <span>Legendary Pokémon</span>}
            {entry.isMythical && <span>Mythical Pokémon</span>}
            {entry.isStarter && <span>Starter Pokémon</span>}
            <span>{entry.category}</span>
          </div>
        </header>

        <section className="form-comparison" aria-labelledby="forms-title">
          <div className="form-card">
            <span>Normal</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={entry.sprite} alt={`${entry.name} normal form`} />
            <h2 id="forms-title">{entry.name}</h2>
          </div>
          <div className="form-card shiny">
            <span>✦ Shiny</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={entry.shinySprite} alt={`Shiny ${entry.name}`} />
            <h2>Shiny {entry.name}</h2>
          </div>
        </section>

        <section className="pokemon-facts-layout">
          <div className="pokemon-fact-panel">
            <span className="eyebrow">PROFILE</span><h2>{entry.name} details</h2>
            <dl className="pokedex-facts">
              <div><dt>Generation</dt><dd>{entry.generation}</dd></div>
              <div><dt>Region</dt><dd>{entry.region}</dd></div>
              <div><dt>Height</dt><dd>{entry.height.toFixed(1)} m</dd></div>
              <div><dt>Weight</dt><dd>{entry.weight.toFixed(1)} kg</dd></div>
              <div><dt>Abilities</dt><dd>{entry.abilities.join(", ")}</dd></div>
              <div><dt>Evolution stage</dt><dd>{entry.evolutionStage}</dd></div>
            </dl>
          </div>
          <div className="pokemon-fact-panel">
            <span className="eyebrow">BASE STATS</span><h2>Stats and total</h2>
            <div className="stats-list">
              {statLabels.map(([key, label]) => <div className="stat-row" key={key}><span>{label}</span><strong>{entry.stats[key]}</strong><span className="stat-track"><span style={{ width: `${Math.min(100, entry.stats[key] / 1.8)}%` }} /></span></div>)}
              <div className="stat-total"><span>Base Stat Total</span><strong>{entry.bst}</strong></div>
            </div>
          </div>
        </section>

        <section className="evolution-section">
          <div className="content-heading"><span className="eyebrow">EVOLUTION</span><h2>{entry.name} evolution chain</h2><p>{family.length > 1 ? `Follow every known stage in the ${family[0].name} evolution family.` : `${entry.name} does not have a standard evolution chain.`}</p></div>
          <div className="evolution-chain">
            {family.map((member, index) => (
              <div className="evolution-step" key={member.slug}>
                {index > 0 && <div className="evolution-method"><small>From {getPokemon(member.preEvolution ?? "")?.name ?? "previous form"}</small><strong>{member.evolutionMethod ?? "Evolves"}</strong></div>}
                <Link href={`/pokemon/${member.slug}`} aria-current={member.slug === entry.slug ? "page" : undefined}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={member.sprite} alt={member.name} loading="lazy" />
                  <strong>{member.name}</strong><small>{member.types.map(titleToken).join(" / ")}</small>
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="pokemon-page-cta">
          <div><span className="eyebrow">KEEP EXPLORING</span><h2>Use {entry.name} as a starting point</h2><p>Browse related collections or return to the generator for a completely random pick.</p></div>
          <div>
            {entry.isLegendary && <Link href="/legendary-pokemon">Legendary Pokémon list</Link>}
            {entry.isStarter && <Link href="/starter-pokemon">Starter Pokémon list</Link>}
            <Link href="/shiny-pokemon">Shiny Pokédex</Link>
            <Link href="/">Random Generator</Link>
          </div>
        </section>
      </article>
    </>
  );
}
