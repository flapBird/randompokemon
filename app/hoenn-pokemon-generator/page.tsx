import type { Metadata } from "next";
import { RegionGeneratorPage } from "@/components/content/RegionGeneratorPage";
import { REGION_BY_SLUG } from "@/data/regions";
export const metadata: Metadata = { title: { absolute: "Hoenn Pokémon Generator – Random Gen 3 Team" }, description: "Generate a random Hoenn Pokémon team from Generation 3 with filters, locks, rerolls, and team analysis.", alternates: { canonical: "/hoenn-pokemon-generator" }, openGraph: { title: "Hoenn Pokémon Generator", url: "/hoenn-pokemon-generator" } };
export default function Page() { return <RegionGeneratorPage region={REGION_BY_SLUG.hoenn} />; }
