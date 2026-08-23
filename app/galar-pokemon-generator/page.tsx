import type { Metadata } from "next";
import { RegionGeneratorPage } from "@/components/content/RegionGeneratorPage";
import { REGION_BY_SLUG } from "@/data/regions";
export const metadata: Metadata = { title: { absolute: "Galar Pokémon Generator – Random Gen 8 Team" }, description: "Generate a random Galar Pokémon team from Generation 8 with filters, locks, rerolls, and team analysis.", alternates: { canonical: "/galar-pokemon-generator" }, openGraph: { title: "Galar Pokémon Generator", url: "/galar-pokemon-generator" } };
export default function Page() { return <RegionGeneratorPage region={REGION_BY_SLUG.galar} />; }
