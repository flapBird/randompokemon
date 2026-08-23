import type { Metadata } from "next";
import { RegionGeneratorPage } from "@/components/content/RegionGeneratorPage";
import { REGION_BY_SLUG } from "@/data/regions";
export const metadata: Metadata = { title: { absolute: "Kalos Pokémon Generator – Random Gen 6 Team" }, description: "Generate a random Kalos Pokémon team from Generation 6 with filters, locks, rerolls, and team analysis.", alternates: { canonical: "/kalos-pokemon-generator" }, openGraph: { title: "Kalos Pokémon Generator", url: "/kalos-pokemon-generator" } };
export default function Page() { return <RegionGeneratorPage region={REGION_BY_SLUG.kalos} />; }
