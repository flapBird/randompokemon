import { REGION_GUIDES } from "@/data/regions";
import { renderUrlSet, type SitemapEntry, xmlResponse } from "@/lib/sitemap-xml";
import { POKEMON_TYPES } from "@/types/pokemon";

export const dynamic = "force-static";

const corePages: SitemapEntry[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/favorite-pokemon-picker", changeFrequency: "monthly", priority: 0.9 },
  { path: "/pokemon-type-wheel", changeFrequency: "monthly", priority: 0.9 },
  { path: "/team-planner", changeFrequency: "monthly", priority: 0.9 },
  { path: "/compare-pokemon", changeFrequency: "monthly", priority: 0.8 },
  { path: "/random-shiny-pokemon-generator", changeFrequency: "weekly", priority: 0.9 },
  { path: "/random-pokemon-legendary-generator", changeFrequency: "weekly", priority: 0.9 },
  { path: "/random-pokemon-starter-generator", changeFrequency: "weekly", priority: 0.9 },
  { path: "/random-nuzlocke-pokemon-generator", changeFrequency: "weekly", priority: 0.8 },
  { path: "/pokemon", changeFrequency: "weekly", priority: 0.9 },
  { path: "/shiny-pokemon", changeFrequency: "weekly", priority: 0.8 },
  { path: "/legendary-pokemon", changeFrequency: "weekly", priority: 0.8 },
  { path: "/starter-pokemon", changeFrequency: "weekly", priority: 0.8 },
  { path: "/starter-pokemon/gen-5", changeFrequency: "monthly", priority: 0.6 },
  { path: "/starter-pokemon/pokemon-x-y", changeFrequency: "monthly", priority: 0.6 },
  { path: "/about", changeFrequency: "monthly", priority: 0.4 },
  { path: "/credits", changeFrequency: "monthly", priority: 0.4 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
];

export function GET() {
  const regionPages: SitemapEntry[] = REGION_GUIDES.map((region) => ({
    path: `/${region.slug}-pokemon-generator`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));
  const typePages: SitemapEntry[] = POKEMON_TYPES.map((type) => ({
    path: `/pokemon/type/${type}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));
  return xmlResponse(renderUrlSet([...corePages, ...regionPages, ...typePages]));
}
