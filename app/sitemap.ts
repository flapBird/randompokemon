import type { MetadataRoute } from "next";
import { PRIORITY_POKEMON_SLUGS } from "@/lib/pokemon-catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://randompokemon.xyz";
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/pokemon`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/shiny-pokemon`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/legendary-pokemon`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/starter-pokemon`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/starter-pokemon/gen-5`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/starter-pokemon/pokemon-x-y`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/random-pokemon-starter-generator`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/random-pokemon-legendary-generator`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/random-shiny-pokemon-generator`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/random-nuzlocke-pokemon-generator`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/kanto-pokemon-generator`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/paldea-pokemon-generator`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/credits`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.3 },
    ...PRIORITY_POKEMON_SLUGS.map((slug) => ({ url: `${base}/pokemon/${slug}`, changeFrequency: "monthly" as const, priority: 0.75 })),
  ];
}
