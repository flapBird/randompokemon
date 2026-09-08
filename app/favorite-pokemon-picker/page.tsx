import type { Metadata } from "next";
import Link from "next/link";
import { Faq } from "@/components/content/Faq";
import { JsonLd } from "@/components/content/JsonLd";
import { FavoritePokemonPicker } from "@/components/tools/FavoritePokemonPicker";
import { breadcrumbSchema, faqSchema, organizationSchema, webApplicationSchema } from "@/lib/seo";

const path = "/favorite-pokemon-picker";
const description = "Find your favorite Pokémon with a head-to-head tournament. Choose Quick, Standard, or Full mode, filter the pool, choose a winner, and share your result.";
const faq = [
  { question: "How does the Favorite Pokémon Picker work?", answer: "Choose between two Pokémon at a time. Each winner advances through the bracket until one favorite remains, while later eliminations form a shortlist, not an exact preference ranking." },
  { question: "What is the difference between Quick, Standard, and Full mode?", answer: "Quick samples up to 32 Pokémon, Standard samples up to 128, and Full includes the entire filtered pool." },
  { question: "Can I pick favorites from one generation or type?", answer: "Yes. Filter the tournament by generation, type, region, Legendary or Mythical status, or starters before it begins." },
  { question: "Can I share my favorite Pokémon list?", answer: "Yes. Copy the result text, use your device share sheet, or download a tournament result image." },
];

export const metadata: Metadata = { title: { absolute: "Favorite Pokémon Picker – Find Your Favorite" }, description, alternates: { canonical: path }, openGraph: { title: "Favorite Pokémon Picker", description, url: path } };

export default function Page() {
  return <><JsonLd data={[organizationSchema(), webApplicationSchema("Favorite Pokémon Picker", path, description), faqSchema(faq), breadcrumbSchema([["Home", "/"], ["Favorite Pokémon Picker", path]])]} /><section className="subpage-hero"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Favorite Pokémon Picker</span></nav><h1>Favorite Pokémon <em>Picker</em></h1><p>Turn “which Pokémon is my favorite?” into a real head-to-head tournament and leave with a shareable shortlist.</p></section><FavoritePokemonPicker /><div className="content-wrap"><section className="content-section split-content"><div><span className="eyebrow">PICK, DON’T ROLL</span><h2>A tournament for your personal favorites</h2></div><div><p>This tool is intentionally different from the <Link href="/">random Pokémon generator</Link>. It does not select a winner for you: your choices determine which Pokémon advance.</p><p>Use Quick mode for a short session, Standard for a larger tournament, or Full mode when you want every Pokémon in the filtered pool to get a chance.</p></div></section><Faq items={faq} id="favorite-picker-faq" /></div></>;
}
