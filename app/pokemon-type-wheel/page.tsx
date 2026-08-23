import type { Metadata } from "next";
import Link from "next/link";
import { Faq } from "@/components/content/Faq";
import { JsonLd } from "@/components/content/JsonLd";
import { PokemonTypeWheel } from "@/components/tools/PokemonTypeWheel";
import { breadcrumbSchema, faqSchema, organizationSchema, webApplicationSchema } from "@/lib/seo";

const path = "/pokemon-type-wheel";
const description = "Spin a Pokémon Type Wheel with all 18 types, then generate a Pokémon, build a monotype team, or browse the winning type.";
const faq = [
  { question: "How many Pokémon types are on the wheel?", answer: "The wheel includes all 18 current Pokémon types, from Normal and Fire through Steel and Fairy." },
  { question: "Can I remove types from the wheel?", answer: "Yes. Toggle any type before spinning, or clear and restore the complete pool." },
  { question: "What can I do with the winning type?", answer: "Generate one matching Pokémon, build a six-member monotype team, or browse every Pokémon of that type." },
];
export const metadata: Metadata = { title: { absolute: "Pokémon Type Wheel – Spin All 18 Types" }, description, alternates: { canonical: path }, openGraph: { title: "Pokémon Type Wheel", description, url: path } };
export default function Page() { return <><JsonLd data={[organizationSchema(), webApplicationSchema("Pokémon Type Wheel", path, description), faqSchema(faq), breadcrumbSchema([["Home", "/"], ["Pokémon Type Wheel", path]])]} /><section className="subpage-hero"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Pokémon Type Wheel</span></nav><h1>Pokémon Type <em>Wheel</em></h1><p>Let all 18 types compete, then turn the result into a random Pokémon, a monotype team, or a focused Pokédex browse.</p></section><PokemonTypeWheel /><div className="content-wrap"><section className="content-section split-content"><div><span className="eyebrow">FROM TYPE TO TEAM</span><h2>One spin, three useful next steps</h2></div><div><p>The wheel is connected to the <Link href="/">Random Pokémon Generator</Link> rather than being an isolated novelty. A winning type becomes a ready-to-use generator filter.</p><p>Use it for drawing prompts, draft rules, monotype challenges, or a quick decision when all 18 types sound good.</p></div></section><Faq items={faq} id="type-wheel-faq" /></div></>; }
