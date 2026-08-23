/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Faq } from "@/components/content/Faq";
import { JsonLd } from "@/components/content/JsonLd";
import { PokemonGenerator } from "@/components/generator/PokemonGenerator";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { REGION_GUIDES, type RegionGuide } from "@/data/regions";
import { STANDARD_FILTERS } from "@/lib/defaults";
import { breadcrumbSchema, faqSchema, organizationSchema, webApplicationSchema } from "@/lib/seo";
import { createStaticGeneration } from "@/lib/static-generation";
import { getPokemon } from "@/lib/pokemon-catalog";

export function regionPath(region: RegionGuide) {
  return `/${region.slug}-pokemon-generator`;
}

export function RegionGeneratorPage({ region }: { region: RegionGuide }) {
  const path = regionPath(region);
  const description = `Generate a random ${region.name} Pokémon team from Generation ${region.generation} (${region.dexRange}) with filters, locks, rerolls, seeds, and team analysis.`;
  const filters = { ...STANDARD_FILTERS, generations: [region.generation], regions: [region.slug] };
  const initial = createStaticGeneration(filters, `WELCOME-${region.name.toUpperCase()}`);
  const starters = region.starters.map(getPokemon).filter(Boolean);
  const legendaries = region.legendaries.map(getPokemon).filter(Boolean);
  const representatives = region.representatives.map(getPokemon).filter(Boolean);
  const faq = [
    { question: `Which Pokémon are in the ${region.name} generator?`, answer: `The default pool contains main species introduced in Generation ${region.generation}, covering National Pokédex ${region.dexRange}. Form and category controls can further change the eligible pool.` },
    { question: `Are ${region.name} Legendary Pokémon included?`, answer: "Legendary and Mythical Pokémon are excluded initially. Enable either category in the filters when your challenge allows them." },
    { question: `Can I generate one ${region.name} Pokémon?`, answer: "Yes. Choose any team size from one through six, then lock or reroll individual results." },
    { question: `Which games feature ${region.name}?`, answer: `${region.name} is the principal setting associated with ${region.games.join(", ")}.` },
  ];

  return (
    <>
      <JsonLd data={[organizationSchema(), webApplicationSchema(`${region.name} Pokémon Generator`, path, description), faqSchema(faq), breadcrumbSchema([["Home", "/"], [`${region.name} Generator`, path]])]} />
      <section className="subpage-hero specialized-hero">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>{region.name} Generator</span></nav>
        <h1>{region.name} Pokémon <em>Generator</em></h1>
        <p>Build a real Generation {region.generation} team from {region.dexRange}, then lock favorites, reroll slots, and inspect its defensive profile.</p>
      </section>
      <PokemonGenerator initialFilters={filters} initialResults={initial.results} initialSeed={initial.seed} initialQuickMode={null} />
      <div className="content-wrap">
        <section className="content-section region-intro-grid">
          <div><span className="eyebrow">REGION PROFILE</span><h2>{region.name} at a glance</h2><p>This preset keeps the first roll focused on Pokémon introduced with {region.games[0]} and {region.games[1] ?? region.games[0]}. Change filters at any time without leaving the tool.</p></div>
          <dl className="region-facts"><div><dt>Generation</dt><dd>{region.generation}</dd></div><div><dt>National Dex</dt><dd>{region.dexRange}</dd></div><div><dt>Games</dt><dd>{region.games.join(", ")}</dd></div><div><dt>Preset</dt><dd>{region.specialPreset}</dd></div></dl>
        </section>
        <section className="content-section">
          <div className="content-heading"><span className="eyebrow">REGION PICKS</span><h2>Starters, Legendary Pokémon, and familiar faces</h2><p>Open any species page for matchups, evolutions, related Pokémon, and team-building shortcuts.</p></div>
          <div className="region-pokemon-groups">
            {[["Starters", starters], ["Legendary Pokémon", legendaries], ["Representative Pokémon", representatives]].map(([label, entries]) => (
              <div className="region-pokemon-group" key={label as string}><h3>{label as string}</h3><div>{(entries as NonNullable<ReturnType<typeof getPokemon>>[]).slice(0, 8).map((entry) => <Link href={`/pokemon/${entry.slug}`} key={entry.slug}>{ }<img src={entry.sprite} alt="" loading="lazy" /><span><strong>{entry.name}</strong><small>{entry.types.map((type) => <TypeBadge type={type} key={type} />)}</small></span></Link>)}</div></div>
            ))}
          </div>
        </section>
        <section className="content-section">
          <div className="content-heading"><span className="eyebrow">EXPLORE REGIONS</span><h2>Try another region generator</h2></div>
          <div className="region-link-grid">{REGION_GUIDES.map((item) => <Link href={regionPath(item)} aria-current={item.slug === region.slug ? "page" : undefined} key={item.slug}><strong>{item.name}</strong><span>Gen {item.generation} · {item.dexRange}</span></Link>)}</div>
        </section>
        <Faq items={faq} id={`${region.slug}-generator-faq`} />
      </div>
    </>
  );
}
