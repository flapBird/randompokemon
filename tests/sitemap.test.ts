import { describe, expect, it } from "vitest";
import { GET as getBlogSitemap } from "../app/sitemap-blog.xml/route";
import { GET as getPagesSitemap } from "../app/sitemap-pages.xml/route";
import { GET as getPokemonSitemap } from "../app/sitemap-pokemon.xml/route";
import { GET as getSitemapIndex } from "../app/sitemap.xml/route";
import { publishedArticles } from "../src/data/blog";
import { REGION_GUIDES } from "../src/data/regions";
import { defaultPokemon } from "../src/lib/pokemon-catalog";
import { POKEMON_TYPES } from "../src/types/pokemon";

const countUrls = (xml: string) => (xml.match(/<url>/g) ?? []).length;
const sitemapLocations = (xml: string) => [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);

describe("split sitemaps", () => {
  it("publishes a sitemap index with the three canonical groups", async () => {
    const xml = await getSitemapIndex().text();

    expect(xml).toContain("https://randompokemon.xyz/sitemap-pages.xml");
    expect(xml).toContain("https://randompokemon.xyz/sitemap-pokemon.xml");
    expect(xml).toContain("https://randompokemon.xyz/sitemap-blog.xml");
    expect(xml.match(/<sitemap>/g)).toHaveLength(3);
  });

  it("keeps core, region, and type pages in the pages sitemap", async () => {
    const xml = await getPagesSitemap().text();

    expect(xml).toContain("<loc>https://randompokemon.xyz/</loc>");
    REGION_GUIDES.forEach((region) => expect(xml).toContain(`<loc>https://randompokemon.xyz/${region.slug}-pokemon-generator</loc>`));
    POKEMON_TYPES.forEach((type) => expect(xml).toContain(`<loc>https://randompokemon.xyz/pokemon/type/${type}</loc>`));
    expect(sitemapLocations(xml).every((location) => !location.includes("?"))).toBe(true);
  });

  it("submits all 1,025 default-form Pokémon and no state URLs", async () => {
    const xml = await getPokemonSitemap().text();

    expect(defaultPokemon).toHaveLength(1025);
    expect(countUrls(xml)).toBe(1025);
    expect(xml).toContain("<loc>https://randompokemon.xyz/pokemon/pikachu</loc>");
    expect(sitemapLocations(xml).every((location) => !location.includes("?"))).toBe(true);
  });

  it("contains only the blog hub and actually published articles", async () => {
    const xml = await getBlogSitemap().text();

    expect(countUrls(xml)).toBe(publishedArticles.length + 1);
    publishedArticles.forEach((article) => expect(xml).toContain(`<loc>https://randompokemon.xyz/blog/${article.slug}</loc>`));
    expect(xml).not.toContain("coming-soon");
    expect(sitemapLocations(xml).every((location) => !location.includes("?"))).toBe(true);
  });
});
