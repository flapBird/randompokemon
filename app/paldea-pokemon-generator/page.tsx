import type { Metadata } from "next";
import { RegionGeneratorPage } from "@/components/content/RegionGeneratorPage";
import { REGION_BY_SLUG } from "@/data/regions";

const path = "/paldea-pokemon-generator";
const description = "Generate a random Paldea Pokémon team from Generation 9 species #906–1025, with type, evolution, category, forms, and stat filters.";

export const metadata: Metadata = {
  title: { absolute: "Paldea Pokémon Generator – Random Gen 9 Team" },
  description,
  alternates: { canonical: path },
  openGraph: { title: "Paldea Pokémon Generator", description, url: path },
};

export default function PaldeaGeneratorPage() {
  return <RegionGeneratorPage region={REGION_BY_SLUG.paldea} />;
}
