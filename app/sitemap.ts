import type { MetadataRoute } from "next";
import { publishedArticles } from "@/data/blog";
import { REGION_GUIDES } from "@/data/regions";
import { defaultPokemon, PRIORITY_POKEMON_SLUGS } from "@/lib/pokemon-catalog";
import { POKEMON_TYPES } from "@/types/pokemon";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://randompokemon.xyz";
  const curatedPokemonSlugs = [...new Set([
    ...PRIORITY_POKEMON_SLUGS,
    ...REGION_GUIDES.flatMap((region) => [...region.starters, ...region.legendaries, ...region.representatives]),
    ...defaultPokemon.filter((entry) => entry.isStarter || entry.isLegendary || entry.isMythical).map((entry) => entry.slug),
  ])];
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/pokemon`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/favorite-pokemon-picker`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/pokemon-type-wheel`, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/team-planner`, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/compare-pokemon`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/shiny-pokemon`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/legendary-pokemon`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/starter-pokemon`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/starter-pokemon/gen-5`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/starter-pokemon/pokemon-x-y`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/random-pokemon-starter-generator`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/random-pokemon-legendary-generator`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/random-shiny-pokemon-generator`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/random-nuzlocke-pokemon-generator`, changeFrequency: "weekly", priority: 0.8 },
    ...REGION_GUIDES.map((region) => ({ url: `${base}/${region.slug}-pokemon-generator`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...POKEMON_TYPES.map((type) => ({ url: `${base}/pokemon/type/${type}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: `${base}/blog`, changeFrequency: "monthly", priority: 0.65 },
    ...publishedArticles.map((article) => ({ url: `${base}/blog/${article.slug}`, changeFrequency: "monthly" as const, priority: 0.65 })),
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/credits`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.3 },
    ...curatedPokemonSlugs.map((slug) => ({ url: `${base}/pokemon/${slug}`, changeFrequency: "monthly" as const, priority: 0.72 })),
  ];
}
