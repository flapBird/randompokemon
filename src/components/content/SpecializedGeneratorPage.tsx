import Link from "next/link";
import { Faq, type FaqItem } from "@/components/content/Faq";
import { JsonLd } from "@/components/content/JsonLd";
import { PokemonGenerator } from "@/components/generator/PokemonGenerator";
import { breadcrumbSchema, faqSchema, organizationSchema, webApplicationSchema } from "@/lib/seo";
import { createStaticGeneration } from "@/lib/static-generation";
import type { GeneratorFilters } from "@/types/generator";

type InfoCard = { title: string; copy: string };
type RelatedGenerator = { href: string; title: string; copy: string };

export interface SpecializedGeneratorPageProps {
  name: string;
  path: string;
  description: string;
  title: string;
  emphasis: string;
  lead: string;
  filters: GeneratorFilters;
  seed: string;
  defaultShiny?: boolean;
  overviewTitle: string;
  overview: string[];
  usesTitle: string;
  uses: InfoCard[];
  detailsTitle: string;
  details: string[];
  related: RelatedGenerator[];
  faq: FaqItem[];
}

export function SpecializedGeneratorPage({
  name,
  path,
  description,
  title,
  emphasis,
  lead,
  filters,
  seed,
  defaultShiny = false,
  overviewTitle,
  overview,
  usesTitle,
  uses,
  detailsTitle,
  details,
  related,
  faq,
}: SpecializedGeneratorPageProps) {
  const initialGeneration = createStaticGeneration(filters, seed);
  const initialResults = defaultShiny
    ? initialGeneration.results.map((entry) => ({ ...entry, shiny: true }))
    : initialGeneration.results;

  return (
    <>
      <JsonLd data={[
        organizationSchema(),
        webApplicationSchema(name, path, description),
        faqSchema(faq),
        breadcrumbSchema([["Home", "/"], [name, path]]),
      ]} />
      <section className="subpage-hero specialized-hero">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>{name}</span></nav>
        <h1>{title} <em>{emphasis}</em></h1>
        <p>{lead}</p>
      </section>
      <PokemonGenerator
        initialFilters={filters}
        initialResults={initialResults}
        initialSeed={initialGeneration.seed}
        initialQuickMode={null}
        defaultShiny={defaultShiny}
      />
      <div className="content-wrap">
        <section className="content-section split-content">
          <div><span className="eyebrow">HOW IT WORKS</span><h2>{overviewTitle}</h2></div>
          <div>{overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        </section>
        <section className="content-section">
          <div className="content-heading"><span className="eyebrow">USE THE RESULT</span><h2>{usesTitle}</h2></div>
          <div className="use-grid">
            {uses.map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.copy}</p></article>)}
          </div>
        </section>
        <section className="content-section split-content">
          <div><span className="eyebrow">FILTERS & FAIRNESS</span><h2>{detailsTitle}</h2></div>
          <div>{details.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        </section>
        <section className="content-section">
          <div className="content-heading"><span className="eyebrow">KEEP EXPLORING</span><h2>Try another Pokémon generator</h2></div>
          <div className="use-grid related-generator-grid">
            {related.map((item) => (
              <article key={item.href}>
                <h3><Link href={item.href}>{item.title}</Link></h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </section>
        <Faq items={faq} id={`${seed.toLowerCase()}-faq`} />
      </div>
    </>
  );
}
