import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/content/JsonLd";
import { SpriteImage } from "@/components/pokemon/SpriteImage";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { breadcrumbSchema, organizationSchema, pokemonSchema } from "@/lib/seo";
import { defaultPokemon, evolutionFamily, getAdjacentPokemon, getPokemon, getRelatedPokemon, getTypeMatchups, pokemonSummary, titleToken } from "@/lib/pokemon-catalog";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return defaultPokemon.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getPokemon(slug);
  if (!entry) return {};
  const description = pokemonSummary(entry);
  return {
    title: `${entry.name} Pokédex – Shiny, Stats & Evolution`,
    description,
    alternates: { canonical: `/pokemon/${entry.slug}` },
    openGraph: { title: `${entry.name} Pokédex`, description, url: `/pokemon/${entry.slug}`, images: [entry.sprite] },
    twitter: { card: "summary_large_image", title: `${entry.name} Pokédex`, description, images: [entry.sprite] },
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
  const matchups = getTypeMatchups(entry.types);
  const related = getRelatedPokemon(entry);
  const adjacent = getAdjacentPokemon(entry);
  const description = pokemonSummary(entry);
  const dexNumber = `#${String(entry.id).padStart(4, "0")}`;

  return (
    <>
      <JsonLd data={[
        organizationSchema(),
        pokemonSchema({ name: entry.name, slug: entry.slug, description, image: entry.sprite, category: entry.category }),
        breadcrumbSchema([["Home", "/"], ["Pokédex", "/pokemon"], [entry.name, `/pokemon/${entry.slug}`]]),
      ]} />
      <article className="pokemon-page">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/pokemon">Pokédex</Link><span>/</span><span>{entry.name}</span></nav>

        <header className="detail-hero" data-type={entry.types[0]}>
          <span className="detail-watermark" aria-hidden="true">{dexNumber}</span>
          <div className="detail-hero-copy">
            <span className="eyebrow">POKÉDEX {dexNumber} · GEN {entry.generation} · {entry.region}</span>
            <h1>{entry.name}</h1>
            <div className="detail-chips">
              {entry.types.map((type) => <TypeBadge type={type} key={type} />)}
              {entry.isLegendary && <span className="status-chip">Legendary Pokémon</span>}
              {entry.isMythical && <span className="status-chip">Mythical Pokémon</span>}
              {entry.isStarter && <span className="status-chip">Starter Pokémon</span>}
              <span className="status-chip">{entry.category}</span>
            </div>
            <p>{description}</p>
          </div>
          <div className="detail-hero-art">
            <SpriteImage src={entry.sprite} alt={`${entry.name} artwork`} width={220} height={220} initial={entry.name[0]} />
          </div>
        </header>

        <section className="detail-grid" aria-labelledby="forms-title">
          <div className="detail-panel" data-type={entry.types[0]}>
            <span className="eyebrow">PROFILE</span>
            <dl className="detail-facts">
              <div><dt>National Dex</dt><dd>{dexNumber}</dd></div>
              <div><dt>Type</dt><dd>{entry.types.map(titleToken).join(" / ")}</dd></div>
              <div><dt>Generation</dt><dd>{entry.generation}</dd></div>
              <div><dt>Region</dt><dd>{entry.region}</dd></div>
              <div><dt>Height</dt><dd>{entry.height.toFixed(1)} m</dd></div>
              <div><dt>Weight</dt><dd>{entry.weight.toFixed(1)} kg</dd></div>
              <div><dt>Evolution stage</dt><dd>{family.length > 1 ? `${entry.evolutionStage} of ${family.length}` : entry.evolutionStage}</dd></div>
            </dl>
            <div className="ability-list"><h3>Abilities</h3>{entry.abilities.map((ability) => <span key={ability}>{ability}</span>)}</div>
          </div>
          <div className="detail-panel-right">
            <div className="detail-panel" data-type={entry.types[0]}>
              <span className="eyebrow">BASE STATS</span>
              <div className="stats-list">
                {statLabels.map(([key, label]) => <div className="stat-row" key={key}><span>{label}</span><strong>{entry.stats[key]}</strong><span className="stat-track"><span style={{ width: `${Math.min(100, entry.stats[key] / 1.5)}%` }} /></span></div>)}
                <div className="stat-total"><span>Base Stat Total</span><strong>{entry.bst}</strong></div>
              </div>
            </div>
            <div className="detail-panel">
              <h2 className="sr-only" id="forms-title">Normal and Shiny forms of {entry.name}</h2>
              <span className="eyebrow">FORMS</span>
              <div className="form-pair">
                <div className="form-tile">
                  <SpriteImage src={entry.sprite} alt={`${entry.name} normal form`} width={96} height={96} loading="lazy" initial={entry.name[0]} />
                  <span className="form-tile-copy">
                    <small>Normal</small>
                    <strong>{entry.name}</strong>
                    <span>Standard artwork everywhere on the site</span>
                  </span>
                </div>
                <div className="form-tile shiny">
                  <span className="form-tile-art">
                    <SpriteImage src={entry.shinySprite} alt={`Shiny ${entry.name}`} width={96} height={96} loading="lazy" initial={entry.name[0]} />
                    <span className="form-shiny-flag">+Shiny</span>
                  </span>
                  <span className="form-tile-copy">
                    <small>Shiny</small>
                    <strong>Shiny {entry.name}</strong>
                    <span>One tap on any card toggles it</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="matchup-strip" data-type={entry.types[0]} aria-label="Type matchups">
          <span className="eyebrow">TYPE MATCHUPS</span>
          <div className="matchup-group">
            <span className="matchup-label">Weak</span>
            <div className="matchup-badges">{matchups.weaknesses.map(({ type, multiplier }) => <Link href={`/pokemon/type/${type}`} data-type={type} key={type}><span className="type-dot" />{titleToken(type)} <strong>{multiplier}×</strong></Link>)}</div>
          </div>
          <div className="matchup-group">
            <span className="matchup-label">Resists</span>
            <div className="matchup-badges">{matchups.resistances.map(({ type, multiplier }) => <Link href={`/pokemon/type/${type}`} data-type={type} key={type}><span className="type-dot" />{titleToken(type)} <strong>{multiplier}×</strong></Link>)}</div>
          </div>
          <div className="matchup-group">
            <span className="matchup-label">Immune</span>
            <div className="matchup-badges">{matchups.immunities.length ? matchups.immunities.map(({ type }) => <Link href={`/pokemon/type/${type}`} data-type={type} key={type}><span className="type-dot" />{titleToken(type)} <strong>0×</strong></Link>) : <span className="matchup-none">None from typing alone</span>}</div>
          </div>
          <Link className="matchup-more" href="/pokemon-type-chart">Full type chart →</Link>
        </section>

        {family.length > 1 && (
          <section className="evo-section" aria-labelledby="evo-title">
            <span className="eyebrow">EVOLUTION</span>
            <h2 className="sr-only" id="evo-title">{entry.name} evolution chain</h2>
            <div className="evo-chain">
              {family.map((member, index) => (
                <Fragment key={member.slug}>
                  {index > 0 && (
                    <div className="evo-arrow" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 18 18"><path d="M3 9 h11 M10.5 5 L14.5 9 L10.5 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      <small>{member.evolutionMethod ?? "Evolves"}</small>
                    </div>
                  )}
                  <Link className={`evo-card${member.slug === entry.slug ? " evo-current" : ""}`} href={`/pokemon/${member.slug}`} data-type={member.types[0]} aria-current={member.slug === entry.slug ? "page" : undefined}>
                    <SpriteImage src={member.sprite} alt={member.name} width={108} height={108} loading="lazy" initial={member.name[0]} />
                    <strong>{member.name}</strong>
                    <small>{`#${String(member.id).padStart(4, "0")} · ${member.types.map(titleToken).join(" / ")}`}</small>
                    {member.slug === entry.slug && <span className="evo-badge">This page</span>}
                  </Link>
                </Fragment>
              ))}
            </div>
          </section>
        )}

        <section className="related-pokemon-section">
          <div className="content-heading"><span className="eyebrow">RELATED POKÉMON</span><h2>More Pokémon like {entry.name}</h2><p>Related by type, Generation {entry.generation}, or the {entry.region} region.</p></div>
          <div className="related-pokemon-grid">{related.map((pokemon) => <Link href={`/pokemon/${pokemon.slug}`} key={pokemon.slug}><SpriteImage src={pokemon.sprite} alt="" width={100} height={100} loading="lazy" initial={pokemon.name[0]} /><strong>{pokemon.name}</strong><small>Gen {pokemon.generation} · {pokemon.types.map(titleToken).join(" / ")}</small></Link>)}</div>
        </section>

        <section className="pokemon-page-cta">
          <div><span className="eyebrow">BUILD AROUND THIS PICK</span><h2>Use {entry.name} as a starting point</h2><p>Lock {entry.name} into slot one and let Smart Team build five companions, or open it in the Team Planner.</p></div>
          <div>
            {entry.isLegendary && <Link href="/legendary-pokemon">Legendary Pokémon list</Link>}
            {entry.isStarter && <Link href="/starter-pokemon">Starter Pokémon list</Link>}
            <Link href="/shiny-pokemon">Shiny Pokédex</Link>
            <Link className="primary-link" href={`/?pokemon=${entry.slug}&count=6&mode=smart&seed=AROUND-${entry.id}`}>Build a Team Around {entry.name}</Link>
            <Link href={`/team-planner?pokemon=${entry.slug}`}>Plan with {entry.name}</Link>
            <Link href="/compare-pokemon">Compare Pokémon</Link>
            <Link href={`/?pokemon=${entry.slug}&count=6&mode=smart&seed=AROUND-${entry.id}`}>Generate with this Pokémon</Link>
          </div>
        </section>
        <nav className="pokemon-adjacent" aria-label="Adjacent Pokédex entries">{adjacent.previous ? <Link href={`/pokemon/${adjacent.previous.slug}`}><span>← Previous</span><strong>#{String(adjacent.previous.id).padStart(4, "0")} {adjacent.previous.name}</strong></Link> : <span />}{adjacent.next && <Link href={`/pokemon/${adjacent.next.slug}`}><span>Next →</span><strong>#{String(adjacent.next.id).padStart(4, "0")} {adjacent.next.name}</strong></Link>}</nav>
      </article>
    </>
  );
}
