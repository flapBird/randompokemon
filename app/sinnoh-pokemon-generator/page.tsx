import type { Metadata } from "next";
import { RegionGeneratorPage } from "@/components/content/RegionGeneratorPage";
import { REGION_BY_SLUG } from "@/data/regions";
export const metadata: Metadata = { title: { absolute: "Sinnoh Pokémon Generator – Random Gen 4 Team" }, description: "Generate a random Sinnoh Pokémon team from Generation 4 with filters, locks, rerolls, and team analysis.", alternates: { canonical: "/sinnoh-pokemon-generator" }, openGraph: { title: "Sinnoh Pokémon Generator", url: "/sinnoh-pokemon-generator" } };
export default function Page() { return <RegionGeneratorPage region={REGION_BY_SLUG.sinnoh} />; }
