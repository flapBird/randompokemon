import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/content/JsonLd";
import { PokemonDirectory } from "@/components/pokemon/PokemonDirectory";
import { directoryEntries } from "@/lib/directory-entries";
import { breadcrumbSchema, collectionSchema, organizationSchema } from "@/lib/seo";
import { getPokemonByType, titleToken } from "@/lib/pokemon-catalog";
import { POKEMON_TYPES, type PokemonType } from "@/types/pokemon";

type Props = { params: Promise<{ type: string }> };
export function generateStaticParams() { return POKEMON_TYPES.map((type) => ({ type })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { type } = await params; if (!POKEMON_TYPES.includes(type as PokemonType)) return {}; const label = titleToken(type); const description = `Browse every ${label}-type Pokémon across Generations 1–9, then open stats, weaknesses, evolutions, and team-building tools.`; return { title: `${label}-type Pokémon – Pokédex List`, description, alternates: { canonical: `/pokemon/type/${type}` } }; }
export default async function Page({ params }: Props) { const { type } = await params; if (!POKEMON_TYPES.includes(type as PokemonType)) notFound(); const label = titleToken(type); const entries = getPokemonByType(type as PokemonType); const path = `/pokemon/type/${type}`; const description = `${entries.length} ${label}-type Pokémon with Pokédex links, stats, matchups, and generator shortcuts.`; return <><JsonLd data={[organizationSchema(), collectionSchema(`${label}-type Pokémon`, path, description), breadcrumbSchema([["Home", "/"], ["Pokédex", "/pokemon"], [`${label} type`, path]])]} /><section className="subpage-hero"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/pokemon">Pokédex</Link><span>/</span><span>{label} type</span></nav><h1>{label}-type <em>Pokémon</em></h1><p>Browse {entries.length} Pokémon, or use this type immediately in a random pick or Smart Team.</p><div className="hero-actions"><Link href={`/?type=${type}&count=1&mode=random`}>Generate one</Link><Link href={`/?type=${type}&count=6&mode=smart`}>Build a {label} team</Link><Link href="/pokemon-type-wheel">Spin the type wheel</Link></div></section><div className="catalog-wrap"><PokemonDirectory entries={directoryEntries(entries)} /></div></>; }
