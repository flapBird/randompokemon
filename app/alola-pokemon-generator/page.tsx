import type { Metadata } from "next";
import { RegionGeneratorPage } from "@/components/content/RegionGeneratorPage";
import { REGION_BY_SLUG } from "@/data/regions";
export const metadata: Metadata = { title: { absolute: "Alola Pokémon Generator – Random Gen 7 Team" }, description: "Generate a random Alola Pokémon team from Generation 7 with filters, locks, rerolls, and team analysis.", alternates: { canonical: "/alola-pokemon-generator" }, openGraph: { title: "Alola Pokémon Generator", url: "/alola-pokemon-generator" } };
export default function Page() { return <RegionGeneratorPage region={REGION_BY_SLUG.alola} />; }
