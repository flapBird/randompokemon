import type { Metadata } from "next";
import { RegionGeneratorPage } from "@/components/content/RegionGeneratorPage";
import { REGION_BY_SLUG } from "@/data/regions";

const path = "/kanto-pokemon-generator";
const description = "Generate a random Kanto Pokémon team from the original 151 species, with type, evolution, Legendary, forms, and base-stat filters.";

export const metadata: Metadata = {
  title: { absolute: "Kanto Pokémon Generator – Random Gen 1 Team" },
  description,
  alternates: { canonical: path },
  openGraph: { title: "Kanto Pokémon Generator", description, url: path },
};

export default function KantoGeneratorPage() {
  return <RegionGeneratorPage region={REGION_BY_SLUG.kanto} />;
}
