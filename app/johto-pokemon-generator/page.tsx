import type { Metadata } from "next";
import { RegionGeneratorPage } from "@/components/content/RegionGeneratorPage";
import { REGION_BY_SLUG } from "@/data/regions";
export const metadata: Metadata = { title: { absolute: "Johto Pokémon Generator – Random Gen 2 Team" }, description: "Generate a random Johto Pokémon team from Generation 2 with filters, locks, rerolls, and team analysis.", alternates: { canonical: "/johto-pokemon-generator" }, openGraph: { title: "Johto Pokémon Generator", url: "/johto-pokemon-generator" } };
export default function Page() { return <RegionGeneratorPage region={REGION_BY_SLUG.johto} />; }
