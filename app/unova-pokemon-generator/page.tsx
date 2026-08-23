import type { Metadata } from "next";
import { RegionGeneratorPage } from "@/components/content/RegionGeneratorPage";
import { REGION_BY_SLUG } from "@/data/regions";
export const metadata: Metadata = { title: { absolute: "Unova Pokémon Generator – Random Gen 5 Team" }, description: "Generate a random Unova Pokémon team from Generation 5 with filters, locks, rerolls, and team analysis.", alternates: { canonical: "/unova-pokemon-generator" }, openGraph: { title: "Unova Pokémon Generator", url: "/unova-pokemon-generator" } };
export default function Page() { return <RegionGeneratorPage region={REGION_BY_SLUG.unova} />; }
