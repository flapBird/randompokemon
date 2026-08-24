import { defaultPokemon } from "@/lib/pokemon-catalog";
import { renderUrlSet, xmlResponse } from "@/lib/sitemap-xml";

export const dynamic = "force-static";

export function GET() {
  return xmlResponse(renderUrlSet(defaultPokemon.map((pokemon) => ({
    path: `/pokemon/${pokemon.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }))));
}
