import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://randompokemon.xyz";
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/random-pokemon-team-generator`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/random-pokemon-starter-generator`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
